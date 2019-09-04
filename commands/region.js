module.exports = {
	name: 'region',
	description: 'Displays server region and changes region. Region options: us-east and us-south',
	usage: '[server-region]',
	guildOnly: true,
	execute(msg, args) {
		if (!args.length) {
			return msg.channel.send(`The server's region is located in ${msg.guild.region}.`);
		} else if (args[0] === msg.guild.region) {
			return msg.channel.send('The server is already in this region.');
		}

		if (args[0] === 'us-east') {
			msg.guild.setRegion(args[0])
				.then(() => {
					msg.channel.send(`Server has been changed to ${args[0]}.`);
				})
				.catch(error => {
					console.error(`${msg.author.tag} couldn't change the server region to ${args[0]}.\n`, error);
					msg.reply('there was a problem changing the region.');
				});
		} else if (args[0] === 'us-south') {
			msg.guild.setRegion(args[0])
				.then(() => {
					msg.channel.send(`Server has been changed to ${args[0]}.`);
				})
				.catch(error => {
					console.error(`${msg.author.tag} couldn't change the server region to ${args[0]}.\n`, error);
					msg.reply('there was a problem changing the region.');
				});
		} else {
			msg.channel.send('You have a choice of us-east or us-south');
		}

	},
};
