module.exports = {
	name: 'ping',
	description: 'Pings a user without them knowing who did it.',
	usage: '@[user]',
	guildOnly: true,
	execute(msg, args) {
		if (!msg.mentions.users.size) {
			msg.delete();
			return msg.reply('.');	//Weird
		}

		const atList = msg.mentions.users.map(user => {
			return `<@${user.id}>`;
		});
		// sends an array of strings as a message; by default, discord.js will .join() the array with \n DOES NOT USE .join BY DEFAULT IN V13		
		msg.channel.send(atList.join());
		msg.delete();
	},
};
