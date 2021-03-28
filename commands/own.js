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
		// if the user didn't @ a user
		if (!msg.mentions.users.size) return msg.reply('I owned your mother last night.');
		
		var Own = JSON.parse(fs.readFileSync('./OwnedLeaderboard.json', 'utf-8')); 	//Reads the own leaderboard
		// check for leaderboard arguement
		if (args[0].toLowerCase() === 'leaderboard'){

			Own.sort(function(a, b){		//Sorts the array from least owned to most
				return a.OwnedAmount - b.OwnedAmount;
			});

			var OwnedLB =[];
			var IDs = [];

			for(var i = 0; i < Own.length; i++){        //Creates the leaderboard by going through the sorted array and getting usernames and amount owned
				IDs = IDs.concat(Own[i].UserID)
			}

			const promise = new Promise((resolve, reject) =>{ //Creates a promise to fetch all the owned members from discord
				msg.guild.members.fetch({ user: IDs})
				.then(abc =>{
					UserN = Array.from(abc.mapValues(def => def.user.username));
					resolve(UserN);
				})
				.catch(console.error);
			});

			promise.then(res => { //Runs promise and waits for it to be finished
				UserNames = [];
				for (var i = 0; i<IDs.length; i++){		//Starts going through the sorted IDs to find the username that belongs to them
					var known = false;
					for(var e = 0; e < UserN.length; e++){	//Goes through every username and matches it with the ID
						if (UserN[e][0] == IDs[i]){    
							UserNames [i] = UserN[e][1];
							known = true;
						}
					}
					if (!known) UserNames[i] = 'Some bitch'; //If it can't find the username for some reason
				}

				for(var i = 0; i < Own.length; i++) {        //Creates the leaderboard by going through the sorted array and getting usernames and amount owned
						OwnedLB = OwnedLB.concat([UserNames[i], Own[i].OwnedAmount].join(': ')); //Makes array of leaderboard as Name: #    
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

		const taggedUser = msg.mentions.members.first();
		const sender = msg.member;

		//Checks if the bot sends the message since it is not bound by the rules
		if (sender.id == client.user.id) {
			taggedUser.voice.setChannel(sender.guild.afkChannelID)
				.then(() => msg.channel.send(`<@${taggedUser.id}> has been owned by the people.`))
				.catch(console.error);
			return;
		}

		// if user is not in a voice channel
		if (taggedUser.voice.channelID == null) {
			msg.reply('can\'t own a user not in voice.');
		} else {
			var Ownerindex = Own.findIndex(obj => obj.UserID==sender.id);				//Finds the index of the person doing the owning  
			var Owneeindex = Own.findIndex(obj => obj.UserID==taggedUser.id);			//Finds teh index of the owned person
			//Checks if the owner has an entry in the own leaderboard file and if not then creates one for them
			if (Ownerindex < 0){
				const newOwner = {					//Creates a new entry for them in the leaderboard
				UserID: sender.id,
    				OwnedAmount: 0,
    				Karma: 1,
    				Debt: false
				}
				Own = Own.concat(newOwner);
				Ownerindex = Own.length-1
			}
			if (Owneeindex < 0){
				const newOwnee = {					//Creates a new entry for them in the leaderboard
				UserID: taggedUser.id,
    				OwnedAmount: 0,
    				Karma: 0,
    				Debt: false
				}
				Own = Own.concat(newOwnee);
				Owneeindex = Own.length-1
			}
			//If they have been owned/owned someone before
			else Own[Ownerindex].Karma++; //Increments amount of times they've owned people

			random.generateIntegers({ min: 0, max: 100, n: 1 }) 	//Generates a random number from 0-100 using True Randomness(TM)
				.then(result => {
					const randomArray = result.random.data;
					//The chance to get reversed on increases exponentially with how often you own
					if (randomArray[0] < Math.pow(2, Own[Ownerindex].Karma) && !Own[Ownerindex].Debt) {
						Own[Ownerindex].Karma = 0; 		//Resets your karma if you've been reversed
						msg.channel.send(uno_reverse);	//Sends uno card
						sender.voice.setChannel(sender.guild.afkChannelID)
							.then(() => msg.channel.send(`<@${sender.id}> has been owned by <@${taggedUser.id}>.`))
							.catch ((error) => {
								msg.channel.send('I will find you and I will own you.') 
								Own[Ownerindex].Debt = true
								fs.writeFile('./OwnedLeaderboard.json', JSON.stringify(Own), err => {if(err) msg.reply(errorMsg)})
							});
					} else if (!Own[Ownerindex].Debt) {
						Own[Owneeindex].Karma = Math.max(0, Own[Owneeindex].Karma--)
						taggedUser.voice.setChannel(sender.guild.afkChannelID)
							.then(() => msg.channel.send(`<@${taggedUser.id}> has been owned by <@${sender.id}>.`))
							.catch(console.error);
					} else{
						msg.channel.send('You have lost your owning privileges.')
					}
					fs.writeFile('./OwnedLeaderboard.json', JSON.stringify(Own), err => {if(err) msg.reply(errorMsg)})
				})
				.catch(error => {
					msg.channel.send(errorMsg);
					console.error(error);
				});
		}

	},
};
