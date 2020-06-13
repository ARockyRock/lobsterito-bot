module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'avi'],
	description: 'Displays avatar\'s of mentioned users.',
	usage: '@[user]',
	execute(msg, args) {
		if (!msg.mentions.users.size) {
			return msg.channel.send(`Your avatar: <${msg.author.displayAvatarURL()}>`);
		}

		const avatarList = msg.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL()}>`;
		});
		// sends an array of strings as a message; by default, discord.js will .join() the array with \n
		msg.channel.send(avatarList);
	},
};
