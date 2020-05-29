const Discord = require('discord.js');
const wher = new Discord.MessageAttachment('.\\imgs\\wheretfuat.jpg');

module.exports = {
	name: 'where tf u at',
	description: 'where tf u at - arock',
	execute(msg) {
		msg.channel.send(wher);
	},
};
