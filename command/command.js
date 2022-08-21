import { InteractionResponseType } from "discord-interactions";

export class Command {
  constructor(interaction) {
    this.interaction = interaction;
  }

  async buildResponse() {
    return `unimplemented command`;
  }

  async respond() {
    await this.interaction.reply(await this.buildResponse());
  }
}