const Discord = require('discord.js');
const wher = new Discord.Attachment();

module.exports = {
	name: 'where tf u at',
	description: 'where tf u at - arock',
	execute(msg) {
		wher.setAttachment('.\\imgs\\wheretfuat.jpg');
		msg.channel.send(wher);
	},
};
