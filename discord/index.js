const Discord = require('discord.js');

const discord = new Discord.Client({
  autoReconnect: true,
});

module.exports = discord;
