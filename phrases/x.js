module.exports = {
	name: 'X',
	description: 'press X to doubt',
	execute(msg) {
		msg.channel.send(`${msg.author.username} doubts that.`);
	},
};
