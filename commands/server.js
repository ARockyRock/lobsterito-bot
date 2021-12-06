const Discord = require('discord.js');
var NumRoles = 0;
var NumEmojis = 0;

module.exports = {
	name: 'server',
	alias:['info'],
	description: 'Displays server info.',
	usage: '',
	guildOnly: true,
	execute(msg, args) {
		const PromiseEmojis = new Promise((resolve, reject) => {
			msg.guild.emojis.fetch()
			.then(emojis =>{
				NumEmojis = emojis.size;
				resolve(NumEmojis);
			})
			.catch(console.error)
		})
		const PromiseRoles = new Promise((resolve, reject) => {
			msg.guild.roles.fetch()
			.then(roles =>{
				NumRoles = roles.size;
				resolve(NumRoles);
			})
			.catch(console.error)
		})
		Promise.all([PromiseRoles, PromiseEmojis]).then(res =>{
			const serverInfoEmbed = new Discord.MessageEmbed()
			// #36393e bg blend
				.setColor('#b62827')
				.setThumbnail(msg.guild.iconURL())
				.setTitle('Server Information')
				.addField('Server Name', `${msg.guild.name}`)
				.addField('Total Members', `${msg.guild.memberCount}`)
				.addField('Total Number of Roles', `${NumRoles}`)
				.addField('Total Number of Emojis', `${NumEmojis}`)
				.addField('Server Created', `${msg.guild.createdAt}`)
				.setTimestamp()
				.setFooter(`${msg.guild.name}`);

			msg.channel.send({ embeds: [serverInfoEmbed]});
		})
	},
};
