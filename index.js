const { Client, Intents, MessageEmbed, MessageAttachment, Message } = require('discord.js');
const { get_canvas_auth } = require('./database.js');
const canvas = require('node-canvas-api');
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
	const { guildId } = interaction;

	const canvas_auth = await get_canvas_auth(guildId).catch(console.dir);

	await handle_command(interaction, canvas_auth);

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

async function handle_command(interaction, canvas_auth) {
	if (!interaction.isCommand()) return;

	const { canvas_api_token, canvas_api_domain } = canvas_auth;

	const { commandName } = interaction;

	if (commandName === 'canvas_init') {
		await interaction.reply(`https://canvasdiscordbot.herokuapp.com/guild/${interaction.guildId}`)
	}
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
		console.log(canvas_auth);
		commands.getSelf(canvas_auth.canvas_api_token, canvas_auth.canvas_api_domain).then((res) => {
			const json = JSON.parse(res);
			console.log(json);
			interaction.reply({
				embeds: [new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(json.name)
					.setDescription(
						'Canvas User ID => ' + json.id + '\n'
						+ 'TUID => ' + json.integration_id + '\n'
						+ 'Email => ' + json.primary_email + '\n'
						+ 'User Bio => "' + json.bio + '"\n')
					.setThumbnail(json.avatar_url)
					.setTimestamp()],
				ephemeral: true,
			});
		})
		.catch(error => {
				console.log(error);
				interaction.reply(error);
		});
	}
	if (commandName === 'announcements') {
		canvas.getAnnouncements(canvas_api_token, canvas_api_domain, "99485").then(res => {
			console.log(res[0].title);
			interaction.reply(res[0].title);
		});
	}
	if (commandName === 'courses') {
		const state = interaction.options.getString('state');
		commands.getCourses(canvas_auth.canvas_api_token, canvas_auth.canvas_api_domain, state).then(response => {
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

}
