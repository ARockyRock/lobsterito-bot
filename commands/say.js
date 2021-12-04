module.exports = {
	name: 'say',
	description: 'Bots says what you want in a channel',
	args: true,
	usage: '[channel id] [phrase]',
	execute(msg, args, client) {
		//const channelID = args.shift();
		msg.delete().then().catch(err => {
			console.error(err);
			msg.channel.send('Help I\'m stuck in a bot factory');
		});
		msg.channel.send(args.join(' '));

	},
};
