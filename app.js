/**
 * TODO:
 *  - add a command to remove channel
 *  - add a scheduler to post questions
 * Sync:
rsync -azvv --progress -e "ssh -i wordpressKey.pem" . \
ec2-user@ec2-34-229-13-222.compute-1.amazonaws.com:~/QOTD
 */
import 'dotenv/config';
import { CommandFactory } from './command/factory.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { ddbDocClient } from "./ddb-doc-client.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import pkg from 'node-cron';
import { randomUUID } from 'crypto';
const { schedule } = pkg;


// flags
const sendQuestionNow = process.argv.includes('now');
const printDebugLogs = process.argv.includes('debug');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
  if(sendQuestionNow) {
    dailyRoutine();
  }
  schedule('0 17 * * *', function() {
    dailyRoutine();
  });
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const { commandName } = interaction;
  var command = CommandFactory.createCommand(commandName, interaction);
  await command.respond();
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

async function dailyRoutine() {
  const channels = await getChannels();
  const question = await getRandomQuestion();
  console.log(`Today's question: ${question}`);
  if(question === undefined) {
    console.error(`oops, no question...`)
    return;
  }
  for(const channel of channels) {
    await sendMessageToChannel(channel, buildMessage(question));
  }
}

function buildMessage(question) {
  return `Question of the day:\n`+
        `${question.question}\n\n`+
        `Question was added by: <@${question.user}>\n`+
        `use slash commadn add-question to add a question to my database`;
}

async function getRandomQuestion() {
  const params = {
    TableName: 'QOTD_questions',
    ExclusiveStartKey: {
      'uuid': randomUUID()
    },
    Limit: 1
  };
  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    if(printDebugLogs) {
      console.log(data);
    }
    return data.Items[0];
  } catch (err) {
    console.error(err);
  }
}

async function getChannels() {
  const params = {
    TableName: 'QOTD_channels',
  };
  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    const values = data.Items.map(x=> x.channel);
    return values;
  } catch (err) {
    console.error(err);
  }
}

async function sendMessageToChannel(channel_id, message) {
  const channel = await client.channels.fetch(channel_id);
  channel.send(message);  
}
