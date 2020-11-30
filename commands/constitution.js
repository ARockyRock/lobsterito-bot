const Discord = require('discord.js');
const constitution = new Discord.MessageAttachment('./docs/The_Constitution_of_the_Flaming_Red_Lobsters_March_2019.pdf', 'theConstitution.pdf');

module.exports = {
	name: 'constitution',
	description: 'posts the constitution',
	usage: '',
	guildOnly: true,
	execute(msg, args) {
		msg.channel.send(constitution);
	},
};