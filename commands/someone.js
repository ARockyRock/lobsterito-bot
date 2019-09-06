module.exports = {
	name: 'someone',
	description: '@someone',
	usage: '',
	guildOnly: true,
	execute(msg, args) {
		msg.channel.send(`${msg.channel.members.random().user.username}`);

	},
};
