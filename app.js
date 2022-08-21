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

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
  //sendMessageToChannel('991149794712096768', ':p')
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const { commandName } = interaction;
  var command = CommandFactory.createCommand(commandName, interaction);
  await command.respond();
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

function sendMessageToChannel(channel_id, message) {
  client.channels.fetch(channel_id)
    .then(async channel => {
      channel.send(message);
    }
  ); 
}
