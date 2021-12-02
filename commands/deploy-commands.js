const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

require('dotenv').config({ path:'../.env' });
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const commands = [
	new SlashCommandBuilder().setName('hello').setDescription('Replies with Hello World!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('self').setDescription('Get user info about yourself from Canvas!'),
	new SlashCommandBuilder().setName('canvas_init').setDescription('Landing page for authenticating Canvas!'),
	new SlashCommandBuilder().setName('announcements').setDescription('Display announcements for an inputted class_id!')
		.addStringOption(option =>
			option.setName('course_id')
				.setDescription('Enter the course_id you want to see announcemtns for')
				.setRequired(true)),
	new SlashCommandBuilder().setName('courses').setDescription('Get information about active or completed course enrollments!')
		.addStringOption(option =>
			option.setName('state')
				.setDescription('Enter a course state: ')
				.addChoice('active enrollments', 'active')
				.addChoice('past enrollments', 'completed')
				.setRequired(true)),
	new SlashCommandBuilder().setName('assignments').setDescription('Get all assignments for a specific course_id!')
		.addStringOption(option => option.setName('course_id').setDescription('Enter a state: course_id').setRequired(true))
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Select an assignment type: ')
				.addChoice('past assignments', 'past')
				.addChoice('overdue assignments', 'overdue')
				.addChoice('unsubmitted assignments', 'unsubmitted')
				.addChoice('future assignments', 'future')
				.setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
