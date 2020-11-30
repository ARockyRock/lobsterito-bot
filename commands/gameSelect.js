module.exports = {
	name: 'games',
	alias: ['game'],
	description: 'opt in or out of any game roles',
	args: true,
	usage: '[add|remove] @[role]',
	execute(msg, args) {

		const mentionedRoles = msg.mentions.roles;
		const topRoleBorder = msg.guild.roles.cache.get('782606962449448961');
		const bottomRoleBorder = msg.guild.roles.cache.get('782607030363095060');

		let guildRoles = msg.guild.roles;
		guildRoles = guildRoles.cache.filter(role => (role.comparePositionTo(topRoleBorder) < 0) && (role.comparePositionTo(bottomRoleBorder) > 0));

		if (args[0] === 'list') {
			let message = '';
			guildRoles.each( role => message += role.name + ' | ');
			msg.channel.send(message);
			msg.delete();
			return;
		}

		let success = 0;

		mentionedRoles.each(role => {
			if (guildRoles.has(role.id)) {
				if (args[0] === 'add') {
					try {
						msg.member.roles.add(role);
						success = 1;
						msg.delete();
					}
					catch (error) {
						console.error(error);
						msg.channel.send('Caught error on role add');
					}

				}
				else if (args[0] === 'remove') {
					try {
						msg.member.roles.remove(role);
						success = 2;
						msg.delete();
					}
					catch (error) {
						console.error(error);
						msg.channel.send('Caught error on role remove');
					}
				}
				else
					msg.reply('bad arguements');
			}
			else
				msg.reply('this only works with game roles');
		});

		if (success === 1)
			msg.channel.send('Role(s) added.');
		else if (success === 2)
			msg.channel.send('Role(s) removed');

	},
};