const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { blockQuote, bold } = require('@discordjs/builders')
const wait = require('util').promisify(setTimeout);
const commands = require('./commands/getAPIs');
const { waitForDebugger } = require('inspector');
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
		let embed = new MessageEmbed();
		commands.getCourses(state).then(response => {
			const result = JSON.parse(response);
			let i = 0;
			for (var obj in result) {
				//two courses per row
				if (i % 2 == 0 && i != 0) {
					embed.addField('\u200B', '\u200B') //adds emtpy field
				}
				i++; //counter for two courses per row
				embed.addField(
					'' + result[obj].name || 'unauthorized',
					blockQuote(
						bold('Course ID: ') + result[obj].id
						+ bold('\nCourse Format: ') + result[obj].course_format
						+ bold('\nStart at: \n') + ('' + result[obj].start_at).substring(0, 10)
						+ bold('\nEnd at: \n') + ('' + result[obj].end_at).substring(0, 10)
					),
					true
				)
			}
			interaction.reply({
				embeds: [
					embed
						.setColor('#FFC0CB')
						.setTitle('Your Courses')
						.setFooter(bold('You have 10s before this window expires'))
				],
				components: [new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('ac')
							.setLabel("Advanced Courses' Info")
							.setStyle('PRIMARY'),
					)],
				ephemeral: true,
			});
			//collector for buttons
			const filter = i => i.customId === 'ac';
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });
			collector.on('collect', async i => {
				if (i.customId === 'ac') {
					let arrEmbeds = [];
					for (var obj in result) {
						const sum = await commands.getCourseSummary(result[obj].id)
							.then(response => JSON.parse(response))
							.then(something => { return something })
						arrEmbeds.push(new MessageEmbed()
							.setTitle(result[obj]?.name || 'unauthorized')
							.setDescription('ID '+ (result[obj]?.id || 'NONE'))
							.addFields([
								{ name: bold("Announcement"), value: 'Unread: ' + (sum[0]?.unread_count || 'None'), inline: true },
								{ name: bold("Discussion Topic"), value: 'Unread: ' + (sum[1]?.unread_count || 'None'), inline: true },
								//{ name: '\u200B', value: '\u200B'},
								{ name: bold("Message"), value: 'Unread: ' + (sum[2]?.unread_count || 'None'), inline: true },
								{ name: bold("Submission"), value: 'Unread: ' + (sum[3]?.unread_count || 'None'), inline: true },
								{ name: '\u200B', value: '\u200B' },
							])
						);
					}
					await i.update({ embeds: arrEmbeds, components: [] });
				}
			});
			collector.on('end', collected => {
				if (collected.size === 0) {
					interaction.editReply({ embeds: [embed.setFooter(bold("THIS WINDOW HAS EXPIRED"))] })
				}
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