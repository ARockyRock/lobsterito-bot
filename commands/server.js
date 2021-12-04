const Discord = require('discord.js');
var NumRoles = 0;

module.exports = {
	name: 'server',
	alias:['info'],
	description: 'Displays server info.',
	usage: '',
	guildOnly: true,
	execute(msg, args) {
		const promise = new Promise((resolve, reject) => {
			msg.guild.roles.fetch()
			.then(roles =>{
				NumRoles = roles.size;
				resolve(NumRoles);
			})
			.catch(console.error)
		})
		promise.then(res =>{
		const serverInfoEmbed = new Discord.MessageEmbed()
		// #36393e bg blend
			.setColor('#b62827')
			.setThumbnail(msg.guild.iconURL())
			.setTitle('Server Information')
			.addField('Server Name', `${msg.guild.name}`)
			.addField('Total Members', `${msg.guild.memberCount}`)
			.addField('Total Number of Roles', `${NumRoles}`)
			.addField('Server Created', `${msg.guild.createdAt}`)
			.setTimestamp()
			.setFooter(`${msg.guild.name}`);

		msg.channel.send({ embeds: [serverInfoEmbed]});
	})
	},
};
