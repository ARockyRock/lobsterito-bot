const Discord = require('discord.js');
const uno_reverse = new Discord.MessageAttachment('./imgs/uno_reverse.png');
fs = require('fs');
// randomAPI requires a key from random.org
const { randomAPI, errorMsg } = require('../config.json');
const RandomOrg = require('random-org');
const random = new RandomOrg({ apiKey: randomAPI });

module.exports = {
	name: 'own',
	alias: ['owned'],
	description: 'Sends the user to the owned zone for they have just been owned.',
	cooldown: 900,
	usage: '@[user]',
	guildOnly: true,
	execute(msg, args, client) {

		// check for leaderboard arguement
		if (args[0].toLowerCase() === 'leaderboard')
		{
			let OwnedL = JSON.parse(fs.readFileSync('./OwnedLeaderboard.json', 'utf-8')) //Reads the JSON each time

			OwnedL.sort(function(a, b){		//Sorts the array from highest to least
				return b.OwnedAmount - a.OwnedAmount;
			});

			var OwnedLB =[];
			var IDs = [];

			for(var i = 0; i < OwnedL.length; i++){        //Creates the leaderboard by going through the sorted array and getting usernames and amount owned
				IDs = IDs.concat(OwnedL[i].UserID)
			}

			const promise = new Promise((resolve, reject) =>{
				msg.guild.members.fetch({ user: IDs})
				.then(abc =>{
					UserN = Array.from(abc.mapValues(def => def.user.username));
					resolve(UserN);
				})
				.catch(console.error);
			});

			promise.then(res => {
				UserNames = [];
				for (var i = 0; i<IDs.length; i++){
					var known = false;
					for(var e = 0; e < UserN.length; e++){
						if (UserN[e][0] == IDs[i]){    
							UserNames [i] = UserN[e][1];
							known = true;
						}
					}
					if (!known) {UserNames[i] = 'Some bitch'}
				}

				for(var i = 0; i < OwnedL.length; i++) {        //Creates the leaderboard by going through the sorted array and getting usernames and amount owned
						OwnedLB = OwnedLB.concat([UserNames[i], OwnedL[i].OwnedAmount].join(': ')); //Makes array of leaderboard as Name: #    
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
			});

			return;
		}

		// if the user didn't @ a user
		if (!msg.mentions.users.size) return msg.reply('I owned your mother last night.');

		const taggedUser = msg.mentions.members.first();
		const sender = msg.member;

		// if user is not in a voice channel
		if (taggedUser.voice.channelID == null) {
			msg.reply('can\'t own a user not in voice.');
		} else {
			random.generateIntegers({ min: 0, max: 100, n: 1 })
			.then(result => {
				const randomArray = result.random.data;
				if (randomArray[0] < 2) {
					// Random chance (2%) the own command is reversed
					msg.channel.send(uno_reverse);
					sender.voice.setChannel(sender.guild.afkChannelID)
						.then(() => msg.channel.send(`<@${sender.id}> has been owned by <@${taggedUser.id}>.`))
						.catch(console.error);
				} else {
					//Own command functions normally
					taggedUser.voice.setChannel(sender.guild.afkChannelID)
						.then(() => msg.channel.send(`<@${taggedUser.id}> has been owned by <@${sender.id}>.`))
						.catch(console.error);
				}
			})
			.catch(error => {
				msg.channel.send(errorMsg);
				console.error(error);
			});
		}

	},
};
