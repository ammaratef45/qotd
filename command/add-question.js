import { Command } from "./command.js";
import { randomUUID } from 'crypto';
import { ddbDocClient } from "../ddb-doc-client.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export class AddQuestionCommand extends Command {
  static name = 'add-question';
  static description = 'adds a question to the list of the questions asked daily...';
  static command = {
    name: AddQuestionCommand.name,
    description: AddQuestionCommand.description,
    type: 1
  }
  async buildResponse() {
    const question = this.interaction.options.getString('question');
    const uuid = randomUUID();
    const user =  `${this.interaction.user.username}#${this.interaction.user.discriminator}`;
    const params = {
      TableName: "QOTD_questions",
      Item: {
        uuid: uuid,
        user: user,
        question: question
      },
    };
    var res = `sorry ${user}, I failed to add the question to my database`;
    if(await this.addQuestion(params)) {
      res = `${user} added a new question to my database`;
    }
    return res;
  }

  async addQuestion(params) {
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
