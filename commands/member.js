module.exports = {
	name: 'member',
	description: 'adds a user to the member role',
	args: true,
	usage: '@[user]',
	execute(msg, args) {
		
		const taggedUser = msg.mentions.members.first();

		const greaterRole = msg.guild.roles.cache.find(role => role.name === 'CORE');
		console.log(greaterRole);
		const membersID = msg.guild.members.cache.filter(member => member.roles.cache.find(memberRole => memberRole === greaterRole)).map(member => member.user.id);
		
		membersID.forEach(member => {
			if (member === msg.author.id)
				try {
					taggedUser.roles.add(greaterRole);
				}
				catch (error) {
					console.error(error);
					msg.reply("that's not a real user.");
				}
		});

	},
};