const Discord = require('discord.js');
const uno_reverse = new Discord.MessageAttachment('./imgs/uno_reverse.png');
fs = require('fs');

module.exports = {
	name: 'own',
	alias: ['owned'],
	description: 'Sends the user to the owned zone for they have just been owned.',
	cooldown: 1800,
	usage: '@[user]',
	guildOnly: true,
	execute(msg, args, client) {

		if (args != 'leaderboard' && args != 'Leaderboard'){
			if (!msg.mentions.users.size) return msg.reply('I owned your mother last night.');

			const taggedUser = msg.mentions.members.first();
			const sender = msg.member;

			if (taggedUser.voice.channelID == null) {
				msg.reply('can\'t own a user not in voice.');
			} else {
				if ((Math.floor(Math.random() * 100)) < 2) {
					// Random chance (2%) the own command is reversed
					msg.channel.send(uno_reverse);
					sender.voice.setChannel('747241493789409391')
					.then(() => msg.channel.send(`<@${sender.id}> has been owned by <@${taggedUser.id}>.`))
					.catch(console.error);
				} else {
					//Own command functions normally
					taggedUser.voice.setChannel('747241493789409391')
					.then(() => msg.channel.send(`<@${taggedUser.id}> has been owned by <@${sender.id}>.`))
					.catch(console.error);
				}
			}
		}
		else{

			let OwnedL = JSON.parse(fs.readFileSync('./OwnedLeaderboard.json', 'utf-8')) //Reads the JSON wach time

			OwnedL.sort(function(a, b){				//Sorts the array from highest to least
   		 		return b.OwnedAmount - a.OwnedAmount;
			})

			var OwnedLB =[];
			for(var i = 0; i < OwnedL.length; i++){		//Creates the leaderboard by going through the sorted array and getting usernames and amount owned
 				var UserN = client.users.cache.get(OwnedL[i].UserID); //Gets usernames
				OwnedLB = OwnedLB.concat([UserN.username, OwnedL[i].OwnedAmount].join(': ')); //Makes array of leaderboard as Name: #
			}

			const serverInfoEmbed = new Discord.MessageEmbed() //Makes the leaderboard into a fancy embeded message.
			// #36393e bg blend
				.setColor('#b62827')
				.setThumbnail(msg.guild.iconURL())
				.setTitle('Owned Leaderboard')
				.setDescription(OwnedLB)
				.setTimestamp()
				.setFooter(`${msg.guild.name}`);
			msg.channel.send(serverInfoEmbed);
		}

	},
};
