import { Hi } from "./hi.js"
import { Command } from "./command.js";
import { SetupCommand } from "./setup.js";
import { AddQuestionCommand } from "./add-question.js";

export class CommandFactory {
  static createCommand(name, interaction) {
    switch (name) {
      case Hi.name:
        return new Hi(interaction);
      case SetupCommand.name:
        return new SetupCommand(interaction);
      case AddQuestionCommand.name:
        return new AddQuestionCommand(interaction);
      default:
        return new Command(interaction);
    }
  }
}