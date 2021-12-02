/* eslint-disable no-shadow */
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { blockQuote, bold } = require('@discordjs/builders');
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
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Login to server with your client's token
client.login(DISCORD_BOT_TOKEN);

client.on('interactionCreate', async interaction => {
	const { guildId } = interaction;

	const canvas_auth = await get_canvas_auth(guildId).catch(console.dir);

	try {
		await handle_command(interaction, canvas_auth);
	} catch(error) {
		console.log(error);
	}

});

async function handle_command(interaction, canvas_auth) {
	if (!interaction.isCommand()) return;

	const { canvas_api_token, canvas_api_domain } = canvas_auth;

	const { commandName } = interaction;

	if (commandName === 'canvas_init') {
		await interaction.reply(`https://canvasdiscordbot.herokuapp.com/guild/${interaction.guildId}`);
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
		commands.getSelf(canvas_auth.canvas_api_token, canvas_auth.canvas_api_domain).then((res) => {
			const json = JSON.parse(res);
			// console.log(json);
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
		const course_id = interaction.options.getString('course_id');
		canvas.getAnnouncements(canvas_api_token, canvas_api_domain, course_id).then(res => {
			const arrEmbeds = [];
			const numToDisplay = res.length >= 10 ? 10 : res.length;
			for (let i = numToDisplay - 1; i >= 0; i--) {
				// console.log(res[i]);
				arrEmbeds.push(new MessageEmbed()
					.setTitle(res[i].title + '	' + '\nID => ' + res[i].id)
					.setTimestamp(new Date(res[i].posted_at))
					.setAuthor(res[i].user_name)
					.setURL('http://' + canvas_api_domain + `/courses/${course_id}/discussion_topics/${res[i].id}`),
				);
			}
			interaction.reply({
				content: 'Announcements',
				embeds: arrEmbeds,
				ephemeral: true,
			});
		});
	}

	if (commandName === 'courses') {
		const state = interaction.options.getString('state');
		const embed = new MessageEmbed();
		commands.getCourses(canvas_api_token, canvas_api_domain, state).then(response => {
			const result = JSON.parse(response);
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
					'' + result[obj].name || 'unauthorized',
					blockQuote(
						bold('Course ID: ') + result[obj].id
						+ bold('\nCourse Format: ') + result[obj].course_format
						+ bold('\nStart at: \n') + ('' + result[obj].start_at).substring(0, 10)
						+ bold('\nEnd at: \n') + ('' + result[obj].end_at).substring(0, 10),
					),
					true,
				);
			}
			interaction.reply({
				embeds: [
					embed
						.setColor('#FFC0CB')
						.setTitle('Your Courses')
						.setFooter(bold('You have 2 mins before this window expires')),
				],
				components: [new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('sum')
							.setLabel('Activity Summary')
							.setStyle('PRIMARY'),
					).addComponents(
						new MessageButton()
							.setCustomId('todo')
							.setLabel('TODOS')
							.setStyle('DANGER'),
					)],
				ephemeral: true,
			});
			// collector for buttons
			const filter = i => i.customId === 'todo' || i.customId === 'sum';
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 2 * 60 * 1000 });
			collector.on('collect', async i => {
				// TODO button
				if (i.customId === 'todo') {
					const arrEmbeds = [];
					for (let x = 0; x < result.length && x < 10; x++) {
						// get specific course summary
						/* const sum = await commands.getCourseSummary(result[obj].id)
							.then(response => JSON.parse(response))
							.then(something => { return something }); */
						// get specific course todos
						const todos = await commands.getTodo(canvas_api_token, canvas_api_domain, result[x].id)
							.then(response => JSON.parse(response))
							.then(something => { return something; });

						if (todos[0] !== undefined) {
							const e = new MessageEmbed()
								.setTitle(result[x]?.name || 'unauthorized')
								.setDescription('ID ' + (result[x]?.id || 'NONE'));
							for (let i = 0; i < 3; i++) {
								if (todos[i] !== undefined) {
									e.addFields([
										{
											name: todos[i]?.assignment.name || 'None',
											value: blockQuote(
												bold('Due at: ') + (todos[i]?.assignment.due_at || 'None')
												+ bold('\nSubmission Types: ') + (todos[i]?.assignment.submission_types[0] || 'None')
												+ bold('\nPoints: ') + (todos[i]?.assignment.points_possible || 'None')
												+ bold('\nURL: ') + (todos[i]?.assignment.html_url || 'None'),
											),
										},
									]);
								}
							}
							arrEmbeds.push(e);
						}

					}
					await interaction.editReply({ embeds: arrEmbeds, components: [] });
				}
				// activity summary button
				if (i.customId === 'sum') {
					const arrEmbeds = [];
					for (let x = 0; x < result.length && x < 10; x++) {
						// get specific course summary
						const sum = await commands.getCourseSummary(canvas_api_token, canvas_api_domain, result[x].id)
							.then(response => JSON.parse(response))
							.then(something => { return something; });
						arrEmbeds.push(
							new MessageEmbed()
								.setTitle(result[x]?.name || 'undefined')
								.setDescription('ID ' + (result[x]?.id || 'undefined'))
								.addField(
									'Unreads',
									blockQuote(
										bold('Announcement: ') + (sum[0]?.unread_count || 'none')
										+ bold('\nDiscussion Topic: ') + (sum[1]?.unread_count || 'none')
										+ bold('\nMessage: ') + (sum[2]?.unread_count || 'none')
										+ bold('\nSubmission: ') + (sum[3]?.unread_count || 'none'),
									),
								),
						);
					}
					await interaction.editReply({ embeds: arrEmbeds, components: [] });
				}
			});
			collector.on('end', collected => {
				if (collected.size === 0) {
					interaction.editReply({ embeds: [embed.setFooter(bold('THIS WINDOW HAS EXPIRED'))] });
				}
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

		commands.getAssignments(canvas_api_token, canvas_api_domain, course_id, type).then(response => {
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
				ephemeral: true,
			});
		}).catch(error => {
			interaction.reply({
				content: 'Error => ' + error,
				ephemeral: true,
			});
		});
	}
}
