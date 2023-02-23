import { Command } from "./command.js";
import { ddbDocClient } from "../ddb-doc-client.js";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";


export class DestroyCommand extends Command {
  static name = 'destroy';
  static description = 'remove this channel to stop receiving daily question of the day messages';
  static command = {
    name: DestroyCommand.name,
    description: DestroyCommand.description,
    type: 1
  }
  async buildResponse() {
    const channelId = this.interaction.channelId;
    var res = `oops, sorry something went wrong`;
    if(await this.removeChannelId(channelId)) {
      res = `Got it, will no longer send daily random questions to this channel`;
    }
    return res;
  }

  async removeChannelId(channelId) {
    const params = {
      TableName: "QOTD_channels",
      Key: {
        channel: channelId
      },
    };
    try {
      const data = await ddbDocClient.send(new DeleteCommand(params));
      console.log("Success - item added or updated", data);
      return true;
    } catch (err) {
      console.log("Error", err.stack);
      return false;
    }
  }
}