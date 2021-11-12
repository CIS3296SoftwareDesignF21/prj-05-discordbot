/* eslint-disable no-mixed-spaces-and-tabs */
// Require the necessary discord.js classes
const { channel } = require('diagnostics_channel');
const { Client, Intents, MessageEmbed, MessageAttachment, Message } = require('discord.js');
const commands = require('./commands/commands');
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

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'hello') {
		await interaction.reply('Hello World!');
	}
	if (commandName === 'server') {
		await interaction.reply({
			content: `Server name: ${interaction.guild.name}\n`
				+ `Total members: ${interaction.guild.memberCount}`,
			ephemeral: true,
		});
	}
	if (commandName === 'self') {
		commands.getSelf.then((response) => {
			const js = JSON.parse(response)
			console.log(js)
			interaction.reply({
				embeds: [new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('User Info')
					.setDescription('User ID => ' + js.id + '\n'
						+ 'User Name => ' + js.name)
					.setThumbnail(js.avatar_url)
					.addField('Inline field title', 'Some value here', true)
					.setTimestamp()],
				ephemeral: true,
			})
		})
			.catch(error => {
				console.log('Error => ' + error);
			})
	}
});

// logout of server after timeout
/* setTimeout(function() {
	console.log('destroyed');
	client.destroy(DISCORD_BOT_TOKEN);
}, 10000); */