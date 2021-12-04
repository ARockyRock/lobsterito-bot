module.exports = {
	name: 'prune',
	aliases:['remove'],
	description: 'Removes the entered amount of messages',
	args: true,
	usage: '[amount]',
	execute(msg, args) {
		const sender = msg.member;

		if (sender.permissions.has([true])){
			// the +1 includes the command message itself to the pruning
			const amount = parseInt(args[0]) + 1;

			if (isNaN(amount)) {
				return msg.reply('that is not a valid number.');
			} else if (amount <= 1 || amount > 100) {
				return msg.reply('pick a number between 1 and 100.');
			}
			// .catch to catch an error when bulkDelete deletes a message from 2+ weeks ago
			msg.channel.bulkDelete(amount).catch(err => {
				console.error(err);
				msg.channel.send('There was an error trying to prune messages in this channel.');
			});
		} else {
			msg.reply('you cannot prune these messages.');
		}
	},
};
