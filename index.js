const { Client, Intents, MessageEmbed, MessageAttachment, Message } = require('discord.js');
const { blockQuote, bold, codeBlock} = require('@discordjs/builders');
const commands = require('./commands/getAPIs');
require('dotenv').config();

// read in value of discord bot token from the .env file
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
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
			const embed = new MessageEmbed();
			let i = 0;
			for (const obj in result) {
				// two courses per row
				if (i % 2 == 0 && i != 0) {
					// adds emtpy field
					embed.addField('\u200B', '\u200B');
				}

				// counter for two courses per row
				i++;

				embed.addField(
					'' + result[obj].name + '\n---\nID ' + result[obj].id,
					blockQuote(
						bold('\nCourse Format: ') + result[obj].course_format + '\n---'
						+ bold('\nStart at: \n') + result[obj].start_at + '\n---'
						+ bold('\nEnd at: \n') + result[obj].end_at,
					),
					true,
				);
			}
			interaction.reply({
				embeds: [embed
					.setColor('#FFC0CB')
					.setTitle('Your Courses')
					.setTimestamp()],
				ephemeral: true,
			});
		}).catch(error => {
			interaction.reply({
				content: 'Error => ' + error,
				ephemeral: true,
			});
		});
	}

	if (commandName === 'assignments') {
		const course_id = interaction.options.getString('course_id');
		const type = interaction.options.getString('type');
		commands.getAssignments(course_id, type).then(response => {
			const reply = JSON.parse(response);
			const embed = new MessageEmbed();
			let i = 0;

			// console.log(js);

			for (const obj in reply) {
				if (i % 2 == 0 && i != 0) {
					// adds emtpy field
					embed.addField('\u200B', '\u200B');
				}

				// counter for two courses per row
				i++;

				let isSubmitted = '';
				if (reply[obj].has_submitted_submissions == true) {
					isSubmitted = 'yes';
				}
				else {
					isSubmitted = 'no';
				}

				embed.addField(
					'' + reply[obj].name,
					blockQuote(
						bold('Assignment Type: ') + reply[obj].submission_types + '\n' +
						bold('Submitted: ') + isSubmitted + '\n' +
						bold('Due Date: ') + reply[obj].due_at + '\n' +
						bold('Points Possible: ') + reply[obj].points_possible + '\n' +
						bold('Link to Assignment: ') + reply[obj].html_url,
					),
					true,
				);
			}
			interaction.reply({
				embeds: [embed
					.setColor('#7289da')
					.setTitle('Your Assignments')],
				ephemeral: false,
			});
		}).catch(error => {
			interaction.reply({
				content: 'Error => ' + error,
				ephemeral: true,
			});
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