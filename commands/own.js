module.exports = {
	name: 'own',
	alias: ['owned'],
	description: 'Sends the user to the owned zone for they have just been owned.',
	cooldown: 14400,
	usage: '@[user]',
	guildOnly: true,
	execute(msg, args) {
		if (!msg.mentions.users.size) return msg.reply('I owned your mother last night.');

		const taggedUser = msg.mentions.members.first();
		const sender = msg.member;

		if (taggedUser.voice.channelID == null) {
			msg.reply('can\'t own a user not in voice.');
		} else {
			// moves user to the servers afk channel
			taggedUser.voice.setChannel('406611345887461377')
				.then(() => msg.channel.send(`<@${taggedUser.id}> has been owned by <@${sender.id}>.`))
				.catch(console.error);
		}
	},
};
