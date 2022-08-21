import { Command } from "./command.js";
import { ddbDocClient } from "../ddb-doc-client.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";


export class SetupCommand extends Command {
  static name = 'setup';
  static description = 'setup this channel to receive daily question of the day messages';
  static command = {
    name: SetupCommand.name,
    description: SetupCommand.description,
    type: 1
  }
  async buildResponse() {
    const channelId = this.interaction.channelId;
    var res = `oops, sorry something went wrong`;
    if(await this.addChannelId(channelId)) {
      res = `Got it, will start sending daily random questions to this channel`;
    }
    return res;
  }

  async addChannelId(channelId) {
    const params = {
      TableName: "QOTD_channels",
      Item: {
        channel: channelId
      },
    };
    try {
      const data = await ddbDocClient.send(new PutCommand(params));
      console.log("Success - item added or updated", data);
      return true;
    } catch (err) {
      console.log("Error", err.stack);
      return false;
    }
  }
}