const Discord = require('discord.js');
const uno_reverse = new Discord.MessageAttachment('./imgs/uno_reverse.png');
module.exports = {
	name: 'own',
	alias: ['owned'],
	description: 'Sends the user to the owned zone for they have just been owned.',
	cooldown: 1800,
	usage: '@[user]',
	guildOnly: true,
	execute(msg, args) {
		if (!msg.mentions.users.size) return msg.reply('I owned your mother last night.');

		const taggedUser = msg.mentions.members.first();
		const sender = msg.member;

		if (taggedUser.voice.channelID == null) {
			msg.reply('can\'t own a user not in voice.');
		} else {
			if ((Math.floor(Math.random() * 100)) < 2) {
				// Random chance (2%) the own command is reversed
				msg.channel.send(uno_reverse);
				sender.voice.setChannel('406611345887461377')
				.then(() => msg.channel.send(`<@${sender.id}> has been owned by <@${taggedUser.id}>.`))
				.catch(console.error);
			} else {
				//Own command functions normally
				taggedUser.voice.setChannel('406611345887461377')
				.then(() => msg.channel.send(`<@${taggedUser.id}> has been owned by <@${sender.id}>.`))
				.catch(console.error);
			}
		}
	},
};
