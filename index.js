/* eslint-disable no-mixed-spaces-and-tabs */
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
require('dotenv').config();

// read in value of discord bot token from the .env file
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CANVAS_API_DOMAIN = process.env.CANVAS_API_DOMAIN;
const CANVAS_KEY = process.env.CANVAS_KEY;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Login to server with your client's token, logout subsequently
client.login(DISCORD_BOT_TOKEN);

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'hello') {
		await interaction.reply('Hello World!');
	}
	if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	}
	if (commandName === 'self') {
		let body = '';
		const https = require('https');
		const options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/users/self',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + CANVAS_KEY,
			},
		};

		const req = https.request(options, res => {
			res.on('data', d => {
				body += d;
			});
		});
		req.on('error', error => {
			console.error(error);
		});
		req.end();
		console.log(body);
	}
});

// logout of server after timeout
/* setTimeout(function() {
	console.log('destroyed');
	client.destroy(DISCORD_BOT_TOKEN);
}, 10000); */