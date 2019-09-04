module.exports = {
	name: 'leave',
	description: 'Bot leaves server.',
	usage:'',
	guildOnly: true,
	execute(msg, args) {
		const sender = msg.member;

		if (msg.guild.ownerID === sender.user.id) {
			msg.channel.send('Good-bye, @here!');
			// leaves server command is executed in
			msg.guild.leave();
		} else {
			msg.channel.send('Hey! You can\'t make me do that!');
		}

	},
};
