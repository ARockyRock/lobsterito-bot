module.exports = {
	name: 'F',
	description: 'press F to pay respects',
	execute(msg) {
		msg.channel.send(`${msg.author.username} has paid their respects.`);
	},
};
