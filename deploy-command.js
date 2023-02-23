import { SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Hi } from './command/hi.js';
import { SetupCommand } from './command/setup.js';
import { AddQuestionCommand } from './command/add-question.js';
import 'dotenv/config';
import { DestroyCommand } from './command/destroy.js';

const commands = [
  new SlashCommandBuilder().setName(Hi.name).setDescription(Hi.description),
  new SlashCommandBuilder().setName(SetupCommand.name).setDescription(SetupCommand.description),
  new SlashCommandBuilder().setName(DestroyCommand.name).setDescription(DestroyCommand.description),
  new SlashCommandBuilder().setName(AddQuestionCommand.name).setDescription(AddQuestionCommand.description)
    .addStringOption(option => option.setName('question')
		.setDescription('The question to add')
		.setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
