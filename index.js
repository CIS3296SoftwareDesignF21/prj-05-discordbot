const { Client, Intents, MessageEmbed, MessageAttachment, Message } = require('discord.js');
const { blockQuote, bold, codeBlock} = require('@discordjs/builders')
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
		commands.getSelf().then((response) => {
			const js = JSON.parse(response)
			//console.log(js)
			interaction.reply({
				embeds: [new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('User Info')
					.setDescription('User ID => ' + js.id + '\n'
						+ 'User Name => ' + js.name)
					.setThumbnail(js.avatar_url)
					.setTimestamp()],
				ephemeral: true,
			})
		})
			.catch(error => {
				interaction.reply({
					content: error,
					ephemeral: true,
				})
			})
	}
	if (commandName === 'courses') {
		const state = interaction.options.getString('state');
		commands.getCourses(state).then(response => {
			const result = JSON.parse(response);
			let embed = new MessageEmbed();
			let i = 0;
			for (var obj in result) {
				//two courses per row
				if(i%2 == 0 && i!=0){ 
					embed.addField('\u200B','\u200B') //adds emtpy field
				}
				i++; //counter for two courses per row

				embed.addField(
					'' + result[obj].name + '\n---\nID ' + result[obj].id,
					blockQuote(
						bold('\nCourse Format: ') + result[obj].course_format + "\n---"
						+ bold('\nStart at: \n') + result[obj].start_at + "\n---"
						+ bold('\nEnd at: \n') + result[obj].end_at
					),
					true
				)
			}
			interaction.reply({
				embeds: [embed
					.setColor('#FFC0CB')
					.setTitle('Your Courses')
					.setTimestamp()],
				ephemeral: true,
			})
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