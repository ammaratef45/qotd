import { Command } from "./command.js";

export class Hi extends Command {
  static name = 'hi';
  static description = 'says hi';
  static command = {
    name: Hi.name,
    description: Hi.description,
    type: 1
  }
  async buildResponse() {
    return `Hello there..`;
  }
}