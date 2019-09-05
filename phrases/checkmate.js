const Discord = require('discord.js');
const check = new Discord.Attachment();

module.exports = {
	name: 'checkmate',
	description: 'checkmate atheists - nick',
	execute(msg) {
		check.setAttachment('.\\imgs\\checkmateLibby.jpg', 'checkmateLibby.jpg');
		msg.channel.send(check);
	},
};
