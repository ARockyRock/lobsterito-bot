const Discord = require('discord.js');
const check = new Discord.MessageAttachment('./imgs/checkmateLibby.jpg');

module.exports = {
	name: 'checkmate',
	description: 'checkmate atheists - nick',
	execute(msg) {
		msg.channel.send(check);
	},
};
