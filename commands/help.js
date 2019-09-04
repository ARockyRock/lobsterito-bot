const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List of all my commands or help with a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	execute(msg, args) {
		const data = [];
		const { commands } = msg.client;

		// if there are 0 arguements then the user wants a whole help document
		if (!args.length) {
			data.push('Here\'s a list of all my commands:');
			// maps over commands stored in the commands collection
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command.`);

			// DMs the user all commands stored in the data array and splits message if at char limit
			return msg.author.send(data, { split: true })
				.then (() => {
					// if the command was done in DM then it exits the then
					if (msg.channel.type === 'dm') return;
					// replies to user in the channel
					msg.reply('I\'ve sent you a DM with all my commands.');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
					msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}

		// if the user asks for help of a specific messages
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return msg.reply('that\'s not a valid command.');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
		/*
		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		*/

		msg.channel.send(data, { split: true });


	},
};
