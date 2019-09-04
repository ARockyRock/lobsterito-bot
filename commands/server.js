const Discord = require('discord.js');

module.exports = {
	name: 'server',
	description: 'Displays server info.',
	usage: '',
	guildOnly: true,
	execute(msg, args) {
		const serverInfoEmbed = new Discord.RichEmbed()
		// #36393e bg blend
			.setColor('#b62827')
			.setThumbnail(msg.guild.iconURL)
			.setTitle('Server Information')
			.addField('Server Name', `${msg.guild.name}`)
			.addField('Total Members', `${msg.guild.memberCount}`)
			.addField('Server Created', `${msg.guild.createdAt}`)
			.addField('Server Region', `${msg.guild.region}`)
			.setTimestamp()
			.setFooter(`${msg.guild.name}`);

		msg.channel.send(serverInfoEmbed);
	},
};
