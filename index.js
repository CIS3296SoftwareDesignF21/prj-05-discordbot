const { Client, Intents, MessageEmbed, MessageAttachment, Message } = require('discord.js');
const commands = require('./commands/getAPIs');
require('dotenv').config();

// read in value of discord bot token from the .env file
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Login to server with your client's token
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
		commands.getSelf().then((response) => {
			const js = JSON.parse(response);
			console.log(js);
			interaction.reply({
				embeds: [new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(js.name)
					.setDescription(
						'Canvas User ID => ' + js.id + '\n'
						+ 'TUID => ' + js.integration_id + '\n'
						+ 'Email => ' + js.primary_email + '\n'
						+ 'User Bio => "' + js.bio + '"\n')
					.setThumbnail(js.avatar_url)
					.setTimestamp()],
				ephemeral: true,
			});
		})
			.catch(error => {
				interaction.reply({
					content: error,
					ephemeral: true,
				});
			});
	}
	if (commandName === 'courses') {
		const state = interaction.options.getString('state');
		commands.getCourses(state).then(response => {
			const result = JSON.parse(response);
			let arrEmbeds = [];
			for (var obj in result) {
				arrEmbeds.push(new MessageEmbed()
					.setTitle(result[obj].name + '	' + '\nID => ' + result[obj].id)
					.addFields(
						{ name: 'Start at', value: '' + result[obj].start_at },
						{ name: 'End at', value: '' + result[obj].end_at },
					),
				);
			}
			interaction.reply({
				content: 'Total Courses => ' + result.length,
				embeds: arrEmbeds,
				ephemeral: true,
			});
		}).catch(error => {
			interaction.reply('Error => ' + error);
		});
	}
	/*
		const string = interaction.options.getString('input');
		const integer = interaction.options.getInteger('int');
		const number = interaction.options.getNumber('num');
		const boolean = interaction.options.getBoolean('choice');
		const user = interaction.options.getUser('target');
		const member = interaction.options.getMember('target');
		const channel = interaction.options.getChannel('destination');
		const role = interaction.options.getRole('muted');
		const mentionable = interaction.options.getMentionable('mentionable');
	 example */
});

// logout of server after timeout
/* setTimeout(function() {
	console.log('destroyed');
	client.destroy(DISCORD_BOT_TOKEN);
}, 10000); */