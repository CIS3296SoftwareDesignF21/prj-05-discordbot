# Project
Short Description of Project:
- It is a Discord bot that utilizes Canvas API to allow users to interact with Canvas in Discord. It is only for personal use, so only a personal Canvas key / token is required for the bot to interact with Canvas.

Link to Original Project Proposal:
- https://github.com/CIS3296SoftwareDesignF21/feedback-on-proposals-section-005-m-w-3-30pm/issues/4

Vision Statement:
- For college students who utilize Discord servers for their college classes and whose colleges utilize Canvas, the Canvas Discord Bot is a Discord bot that facilitates communication between the Discord server and the corresponding college class the server is centered around. Unlike the previous solution, which required users to go back and forth between the Discord and Canvas applications, users of the Canvas Discord Bot can use simple commands within their Discord servers to pull information about their classes from Canvas without leaving the application. This provides simple, fast, and convinient access to Canvas in Discord with just text commands, and no need to navigate into Canvas. It could improve Discord users' awareness of their Canvas's activities.

# How to Install
Prerequisite: Node Package Manager (NPM)
## Create a bot and add it to your server
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on ```New Application``` >>> Enter a name and comfirm the pop-up window by clicking the "Create" button.
4. On the left panel, go to ```SETTINGS/Bot``` and click on ```Add Bot``` button and create a new bot.
5. Create a bot user, enter ```USERNAME```, and copy ```TOKEN``` for env.```DISCORD_BOT_TOKEN=``` or store it somewhere safe for now.
6. On the left panel, go to ```SETTINGS/OAuth2/OAUth2 URL Generator```. Under ```SCOPES```, select ```bot``` and ```applications.commands```. At the bottom of the page, under ```GENERATED URL```, copy the url and paste it on your browser to add the bot to your desired server.

# How to Run
1. Clone the repository or download the newest release.
2. Move into the directory of the project.
3. Create a file in the directory called “.env” with the format found in [.env.example](.env.example)
5. run ```npm install``` to install node dependencies
6. run ```npm install -g nodemon``` to install node dev. Dependencies
7. Navigate into the folder entitled, "commands" and run ```node deploy-commands.js``` to register the commands with your Discord bot/server.
8. run ```node .``` or ```node index.js``` to start the bot