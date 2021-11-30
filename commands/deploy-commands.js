const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
// const { clientId, guildId, token } = require('./config.json');
// updated require command to get .env file one directory above current [AS 11/17/21]
require('dotenv').config({ path:'.env' });
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const commands = [
	new SlashCommandBuilder().setName('hello').setDescription('Replies with Hello World'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('self').setDescription('Get user info'),
	new SlashCommandBuilder().setName('courses').setDescription('Get all courses info. Optional True/False: active -> get active courses info'),
	new SlashCommandBuilder().setName('canvas_init').setDescription('Landing page for authenticating canvas!'),
	new SlashCommandBuilder().setName('announcements').setDescription('Display announcements for class id!')
		// .addStringOption(option => option.setName('state').setDescription('Enter a state: active/compeleted')),
	// .addIntegerOption(option => option.setName('int').setDescription('Enter an integer'))
	// .addNumberOption(option => option.setName('num').setDescription('Enter a number'))
	// .addBooleanOption(option => option.setName('state').setDescription('Select a state'))
	// .addUserOption(option => option.setName('target').setDescription('Select a user'))
	// .addChannelOption(option => option.setName('destination').setDescription('Select a channel'))
	// .addRoleOption(option => option.setName('muted').setDescription('Select a role'))
	// .addMentionableOption(option => option.setName('mentionable').setDescription('Mention something')),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
