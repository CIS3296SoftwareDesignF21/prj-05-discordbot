const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.

require('dotenv').config({ path:'.env' });
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);

async function get_canvas_auth(discord_guild_id) {
  var auth;
  try {
    await client.connect();
    const database = client.db('discord-canvas-auth');
    const discord_canvas_auth = database.collection('discord-canvas-auth');
    const query = { discord_guild_id };
    var auth = await discord_canvas_auth.findOne(query);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return auth;
}

async function set_canvas_auth(discord_guild_id, canvas_api_token, canvas_api_domain) {
  var auth;
  try {
    await client.connect();
    const database = client.db('discord-canvas-auth');
    const discord_canvas_auth = database.collection('discord-canvas-auth');

    // first check if exists
    const query = { discord_guild_id };
    auth = await discord_canvas_auth.findOne(query);

    if(auth) {
      console.log("updating\n");
      const new_values = { $set: { canvas_api_token: canvas_api_token, canvas_api_domain: canvas_api_domain } };
      console.log(new_values);
      const update_result = await discord_canvas_auth.updateOne(query, new_values);
      console.log(update_result);
    } else {
      console.log("inserting\n");
      const new_record = { discord_guild_id: discord_guild_id, canvas_api_token: canvas_api_token, canvas_api_domain: canvas_api_domain };
      console.log(new_record);
      const insert_result = await discord_canvas_auth.insertOne(new_record);
      console.log(insert_result);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return auth;
}

exports.get_canvas_auth = get_canvas_auth;
exports.set_canvas_auth = set_canvas_auth;
