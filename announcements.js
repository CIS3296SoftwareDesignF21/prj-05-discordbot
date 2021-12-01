require('dotenv').config();
const { get_canvas_auth } = require('./database.js');


// read in value of discord bot token from the .env file
const GUILD_ID = process.env.GUILD_ID;

const { getAnnouncements } = require('node-canvas-api');


// setTimeout(checkForAnnouncement, 2 * 60 * 1000);

function checkForAnnouncement() {
  get_canvas_auth(GUILD_ID).then((canvas_auth) => {
    const { canvas_api_token, canvas_api_domain } = canvas_auth;
    console.log(canvas_auth);
    getAnnouncements(canvas_api_token, "http://" + canvas_api_domain, "123").then(res => {
      console.log(res.title);
    });
  });
}

checkForAnnouncement();
