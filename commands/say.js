module.exports = {
	name: 'say',
	description: 'Bots says what you want in a channel',
	args: true,
	usage: '[channel id] [phrase]',
	execute(msg, args, client) {
		const channelID = args.shift();
		client.channels.get(channelID).send(args.join(' '));

	},
};
