const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
// const { clientId, guildId, token } = require('./config.json');
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const GUILT_ID = process.env.GUILD_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;


const commands = [
	new SlashCommandBuilder().setName('hello').setDescription('Replies with Hello World'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('self').setDescription('Get user info'),
	// new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILT_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
