// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
require('dotenv').config();

// read in value of discord bot token from the .env file
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Login to server with your client's token, logout subsequently
client.login(DISCORD_BOT_TOKEN);

// logout of server after timeout
setTimeout(function() {
	client.destroy(DISCORD_BOT_TOKEN);
}, 10000);