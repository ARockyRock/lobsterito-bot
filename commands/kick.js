module.exports = {
	name: 'kick',
	description: 'Command to kick a user.',
	usage: '@[user]',
	guildOnly: true,
	execute(msg, args) {
		// precheck for a mention to prevent crash
		if (!msg.mentions.users.size) {
			return msg.reply('You need to tag a user in order to kick them.');
		}
		// grabs the first mentioned user
		const taggedUser = msg.mentions.members.first();
		const sender = msg.member;

		if (sender.hasPermission('ADMINISTRATOR')) {
			taggedUser.kick()
				.then(() => {
					msg.channel.send(`${taggedUser.user.tag} has been kicked by @${sender.user.username}`);
				})
				.catch(error => {
					console.error(`${msg.author.tag} couldn't kick ${taggedUser.user.tag}.\n`, error);
					msg.reply('there was a problem kicking that user.');
				});
		} else {
			msg.channel.send(`You tried to kick ${taggedUser.user.username}, but you slipped and fell on your ass.`);
		}
	},
};
