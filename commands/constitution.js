const Discord = require('discord.js');
const constitution = './docs/The_Constitution_of_the_Flaming_Red_Lobsters_March_2019.pdf';

module.exports = {
	name: 'constitution',
	description: 'posts the constitution',
	usage: '',
	guildOnly: true,
	execute(msg, args) {
		msg.channel.send({files: [{
    		attachment: constitution,
    		name: 'FlamingRedLobstersConstitution.pdf'
  		}]
  	})
	}
};