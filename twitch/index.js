const Tmi = require('tmi.js');

const bot = new Tmi.Client({
  connection: {
    reconnect: true,
    secure: 443
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: `oauth:${process.env.TWITCH_BOT_TOKEN}`
  },
  channels: process.env.TWITCH_CHANNELS_NAME.split(', ')
});

module.exports = bot;
