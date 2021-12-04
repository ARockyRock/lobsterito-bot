const Discord = require('discord.js');
const uno_reverse = new Discord.MessageAttachment('./imgs/uno_reverse.png');
fs = require('fs');
// randomAPI requires a key from random.org
const { randomAPI, errorMsg } = require('../config.json');
const RandomOrg = require('random-org');
const random = new RandomOrg({ apiKey: randomAPI });
const StatsFunc = require ('../StatsFunc.js')

module.exports = {
    name: 'own',
    alias: ['owned'],
    description: 'Sends the user to the owned zone for they have just been owned.',
    cooldown: 900,
    usage: '@[user]',
    guildOnly: true,
    execute(msg, args, client, Stats) {

        // if the user didn't @ a user
        if (!args.length) return msg.reply('I owned your mother last night.');

        // check for leaderboard arguement
        if (args[0].toLowerCase() === 'leaderboard') {

            var StatsSort =Object.entries(Stats);
            //console.log(StatsSort[1][1])
            StatsSort.sort(function (a, b) { //Sorts the array from least owned to most
               return a[1].OwnedAmount - b[1].OwnedAmount;
            });
            
            //console.log(StatsSort[1][1].OwnedAmount);
            var IDs = [];

            for (var i = 0; i < StatsSort.length; i++) { //Creates the leaderboard by going through the sorted array and getting usernames and amount owned
                IDs = IDs.concat(StatsSort[i][0])
            }
            

            const promise = new Promise((resolve, reject) => { //Creates a promise to fetch all the owned members from discord
                msg.guild.members.fetch({ user: IDs })
                    .then(abc => {
                        UserN = Array.from(abc.mapValues(def => def.user.username));
                        resolve(UserN);
                    })
                    .catch(console.error);
            });

            promise.then(res => { //Runs promise and waits for it to be finished
                UserNames = [];
                for (var i = 0; i < IDs.length; i++) { //Starts going through the sorted IDs to find the username that belongs to them
                    var known = false;
                    for (var e = 0; e < UserN.length; e++) { //Goes through every username and matches it with the ID
                        if (UserN[e][0] == IDs[i]) {
                            UserNames[i] = UserN[e][1];
                            known = true;
                        }
                    }
                    if (!known) UserNames[i] = 'Some bitch'; //If it can't find the username for some reason
                }
            
                var OwnedLB = []
                for (var i = 0; i < StatsSort.length; i++) { //Creates the leaderboard by going through the sorted array and getting usernames and amount owned
                    OwnedLB = OwnedLB.concat([UserNames[i], StatsSort[i][1].OwnedAmount].join(': ')); //Makes array of leaderboard as Name: #    
                }

                const OwnedLeaderboard = new Discord.MessageEmbed() //Makes the leaderboard into a fancy embeded message.
                    // #36393e bg blend
                    .setColor('#b62827')
                    .setThumbnail(msg.guild.iconURL())
                    .setTitle('Owned Leaderboard')
                    .setDescription(OwnedLB.join('\n'))
                    .setTimestamp()
                    .setFooter(`${msg.guild.name}`);
                msg.channel.send({ embeds: [OwnedLeaderboard]});
            });

            return;
        }

        const taggedUser = msg.mentions.members.first();
        //console.log(AddToStats);
        const sender = msg.member;

        //Checks if the bot sends the message since it is not bound by the rules
        if (sender.id == client.user.id) {
            taggedUser.voice.setChannel(sender.guild.afkChannelId)
                .then(() => msg.channel.send(`<@${taggedUser.id}> has been owned by the people.`))
                .catch(console.error);
            return;
        }

        // if user is not in a voice channel

        if (taggedUser.voice.channelId == null) {
            msg.reply('Can\'t own a user not in voice.');
        } else if (taggedUser.voice.channelId == sender.guild.afkChannelId){
            Stats[sender.id].Karma++;
            sender.voice.setChannel(sender.guild.afkChannelId)
                .then(() => msg.channel.send(`<@${taggedUser.id}> is already in the owned zone idiot. Why don\'t you join them.`))
                .catch(console.error);
        } 
        else {
            //Checks if the owner has an entry in the own leaderboard file and if not then creates one for them
            if (Stats[sender.id] == undefined) Stats = StatsFunc.AddToStats(sender.id,Stats);
            //If they have been owned/owned someone before
            else Stats[sender.id].Karma++; //Increments amount of times they've owned people

            random.generateIntegers({ min: 0, max: 100, n: 1 }) //Generates a random number from 0-100 using True Randomness(TM)
                .then(result => {
                    const randomArray = result.random.data;
                    //The chance to get reversed on increases exponentially with how often you own
                    if (randomArray[0] < Math.pow(2, Stats[sender.id].Karma) && !Stats[sender.id].Debt) {
                        Stats[sender.id].Karma = 0; //Resets your karma if you've been reversed
                        msg.channel.send(uno_reverse); //Sends uno card
                        sender.voice.setChannel(sender.guild.afkChannelId)
                            .then(() => msg.channel.send(`<@${sender.id}> has been owned by <@${taggedUser.id}>.`))
                            .catch((error) => {
                                msg.channel.send('I will find you and I will own you.')
                                Stats[sender.id].Debt = true
                                Stats[sender.id].TimesInDebt++;
                                StatsFunc.SavesStats(Stats);
                            });
                    } else if (!Stats[sender.id].Debt) {
                        Stats[sender.id].Karma = Math.max(0, Stats[sender.id].Karma--)
                        taggedUser.voice.setChannel(sender.guild.afkChannelId)
                            .then(() => msg.channel.send(`<@${taggedUser.id}> has been owned by <@${sender.id}>.`))
                            .catch(console.error);
                    } else {
                        msg.channel.send('You have lost your owning privileges.')
                    }
                    StatsFunc.SaveStats(Stats);
                })
                .catch(error => {
                    msg.channel.send(errorMsg);
                    console.error(error);
                });
        }

    },
};