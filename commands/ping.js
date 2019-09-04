module.exports = {
	name: 'ping',
	//	cooldown: 5,
	description: 'Pings a user without them knowing who did it.',
	usage: '@[user]',
	guildOnly: true,
	execute(msg, args) {
		if (!msg.mentions.users.size) {
			msg.delete();
			return msg.reply('');
		}

		const atList = msg.mentions.users.map(user => {
			return `<@${user.id}>`;
		});
		// sends an array of strings as a message; by default, discord.js will .join() the array with \n
		msg.channel.send(atList);
		msg.delete();
	},
};
