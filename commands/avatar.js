module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'avi'],
	description: 'Displays avatar\'s of mentioned users.',
	usage: '@[user]',
	execute(msg, args) {
		if (!msg.mentions.users.size) {
			return msg.channel.send({
				content:'Your avatar:',
				files: [`${msg.author.avatarURL()}`]		
			});
		}

		const avatarList = msg.mentions.users.map(user => {
			return msg.channel.send({
				content: `${user.username}'s avatar`,
				files: [`${user.avatarURL()}`]		
			});
		});
	},
};
