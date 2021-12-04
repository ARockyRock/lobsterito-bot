
// loads necessary packages and configs
const fs = require('fs');
const Discord = require('discord.js');
const StatsFunc = require ('./StatsFunc.js')
// loads only the values being called from config.json
const { prefix, token, errorMsg, botChannel, CringeEmoji, CringeTimeout, CringeValue, OfficialCringeEmoji, MarkovDataSize} = require('./config.json');


const cooldowns = new Discord.Collection();

const { Client, Intents } = require('discord.js');

const client = new Client({ partials: ["CHANNEL"], intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS",
		"GUILD_EMOJIS_AND_STICKERS", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS",
		"DIRECT_MESSAGE_TYPING", "GUILD_MESSAGE_TYPING"] });

//const client = new Discord.Client({fetchAllMembers: true});
client.commands = new Discord.Collection();
client.phrases = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const phraseFiles = fs.readdirSync('./phrases').filter(file => file.endsWith('.js'));
var Stats = JSON.parse((fs.readFileSync('./Statistics.json', 'utf-8'))); //Read Statistics json
module.export = { Stats };
var MarkovTraining = JSON.parse((fs.readFileSync('./Markov-Data.json', 'utf-8'))); //Read Markov Data
var MarkovBlacklist = ['!',''];
var MarkovGraylist = ['|','*','~','_','`'];
var MsgContent = '';


var CringeTrack = {};
var MeanTimesCringed = 0;
var MeanTimesUncringed = 0;
var MeanCringePosts = 0;
var Multiplier = 1;



// loops through files in /commands/
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// sets new items within commands Collection
	// key as the command name and value as the exported module
	client.commands.set(command.name, command);
}

for (const file of phraseFiles) {
	const phrase = require(`./phrases/${file}`);
	client.phrases.set(phrase.name, phrase);
}



// to check if bot is on
client.once('ready', () => {
	console.log('Logging in!');
});


// bot login token
client.login(token);

function Means (){
	for (var i = 0; i < Object.values(Stats).length; i++) {
		MeanTimesCringed += Object.values(Stats)[i].TimesCringed;
		MeanTimesUncringed += Object.values(Stats)[i].TimesUncringed;
		MeanCringePosts += Object.values(Stats)[i].CringePosts;
	}
	MeanTimesUncringed = MeanTimesUncringed / Object.values(Stats).length;
	MeanTimesCringed = MeanTimesCringed / Object.values(Stats).length;
	MeanCringePosts = MeanCringePosts / Object.values(Stats).length;
}


// listens for messages
// ${var} calls a variable within a string

client.on('messageCreate', msg => { // START of on(message) event
	//console.log(msg.content.substr(0,1))
	
	UserID = msg.author.id;

	if (Stats[UserID] == undefined) StatsFunc.AddToStats(UserID,Stats);
		Stats[UserID].Posts++; 
		StatsFunc.SaveStats(Stats);
	
//***********************Normal message interaction***********************

	if (msg.author.bot && UserID != client.user.id) { // if message read is from a bot it exits code
		return;
	} else if (!msg.content.startsWith(prefix)) {

		let daPhrase = msg.content;

		if (daPhrase.includes('🥛')) { // TODO: do this automatically like with commands
			daPhrase = '🥛';
		} else if (daPhrase.includes('checkmate')) {
			daPhrase = 'checkmate';
		}

		const phrase = client.phrases.get(daPhrase);
		if (!phrase){

			//***********************Markov Chain Data Collection***********************
			//https://github.com/Edwin-Pratt/js-markov
	
			//Records message content unless the message is empty (files) or if the message is a link or if its from itself
			if (!MarkovBlacklist.includes(msg.content.substring(0,1)) && msg.content.substring(0,4) != 'http' && UserID != client.user.id) {
				MsgContent = msg.content;
				if (MarkovGraylist.includes(msg.content.substring(0,1))) 
					MsgContent = MsgContent.replaceAll(MarkovGraylist[MarkovGraylist.indexOf(MsgContent.substring(0,1))],'')

				if (MarkovTraining[UserID] == undefined){
					MarkovTraining[UserID] = {
						Posts: 0,
						Rollover: false,
						Data: [] 
					}
				}
				MarkovTraining[UserID].Posts += 1; 
				if (MarkovTraining[UserID].Posts <= MarkovDataSize && MarkovTraining[UserID].Rollover == false)
					MarkovTraining[UserID].Data = MarkovTraining[UserID].Data.concat(MsgContent)
				else{
					if (MarkovTraining[UserID].Posts >= MarkovDataSize) MarkovTraining[UserID].Posts = 0;
					MarkovTraining[UserID].Rollover = true;
					MarkovTraining[UserID].Data[MarkovTraining[UserID].Posts] = MsgContent;
				}
				try {
					fs.writeFileSync('./Markov-Data.json', JSON.stringify(MarkovTraining, null, "\t")); //Save the updated json array to a file
				} catch (error) {
				console.error(error);
				}
			}
			//***********************End Markov Chain Data Collection***********************
			return;
		} 

		try {
			phrase.execute(msg);
		} catch (error) {
			console.error(error);
		}
	} else {
		// removes prefix from message and splits the message into an array by spaces
		const args = msg.content.slice(prefix.length).split(/ +/);
		// args.shift() returns the first element in the array and returns it while removing it from the original array
		const commandName = args.shift().toLowerCase();

		//	if (!client.commands.has(commandName)) return;

		const command = client.commands.get(commandName) ||
			client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return;

		if (command.guildOnly && msg.guildId == null) {
			return msg.reply('I can\'t execute that command in the DM.');
		}

		if (command.args && !args.length) {
			let reply = 'You massive fuck up!';

			if (command.usage) {
				reply += `\nYou're supposed to do: \`${prefix}${command.name} ${command.usage}\``;
			}

			return msg.channel.send(reply);
		}

		//	*** TIMEOUT ***
		// if command isn't in the collection it will be added
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}
		// stores current timestamp
		const now = Date.now();
		// receives the cooldown for triggered command
		const timestamps = cooldowns.get(command.name);
		// receives cooldown amount and coverts to milliseconds
		const cooldownAmount = command.cooldown * 1000;

		if (timestamps.has(UserID) && UserID != client.user.id) {
			const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
			// if expirationTime hasn't passed it'll return the user how much time is left
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return msg.reply(`you have ${timeLeft.toFixed(1)} second(s) before you can use the \`${command.name}\` command.`);
			}
		} else {
			timestamps.set(msg.author.id, now);
			setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
		}

		try {
			command.execute(msg, args, client, Stats);
		} catch (error) {
			console.error(error);
			msg.reply(errorMsg);
		}
	}

}); // END of on(message) event

client.on('messageReactionAdd', (reaction, user) => {

//***********************Marks a post as Officially cringe if the set cringe emoji is used on it***********************

	if (reaction._emoji.id == OfficialCringeEmoji && user.id != client.user.id) {
		reaction.message.reactions.cache.get(OfficialCringeEmoji).remove()
			.catch(error => console.error('Failed to remove reactions:', error));
	}
	
	else if (reaction._emoji.id == CringeEmoji && (Date.now() - reaction.message.createdTimestamp) < CringeTimeout) {
		
		Stats[user.id].TimesCringed++;

		Means();

		if (CringeTrack[reaction.message.id] == undefined)
			CringeTrack[reaction.message.id] = {CringeAmount:0};

		if (MeanTimesCringed > 1 && MeanCringePosts > 1) {
			Multiplier = (MeanTimesCringed / Stats[user.id].TimesCringed) + (Stats[user.id].CringePosts / MeanCringePosts); 
		}

		CringeTrack[reaction.message.id].CringeAmount += 1*Multiplier; 

		if (CringeTrack[reaction.message.id].CringeAmount > CringeValue) {
			Stats[reaction.message.author.id].CringePosts++;
			reaction.message.react(OfficialCringeEmoji);
		}	
	}

	else if(reaction._emoji.id == CringeEmoji && (Date.now() - reaction.message.createdTimestamp) > CringeTimeout){
		delete CringeTrack[reaction.message.id];
	}
	StatsFunc.SaveStats(Stats);
}); // END of on(react) event


client.on('messageReactionRemove', (reaction, user) => {

	//***********************Uncringes a post if people remove the emoji***********************

	if (reaction._emoji.id == CringeEmoji && (Date.now() - reaction.message.createdTimestamp) < CringeTimeout) {
		
		Stats[user.id].TimesCringed--;

		Means();

		if (CringeTrack[reaction.message.id] == undefined)
			CringeTrack[reaction.message.id] = {CringeAmount:0};

		if (MeanTimesCringed > 1 && MeanCringePosts > 1) {
			Multiplier = (MeanTimesCringed / Stats[user.id].TimesCringed) + (Stats[user.id].CringePosts / MeanCringePosts); 
		}

		CringeTrack[reaction.message.id].CringeAmount -= 1*Multiplier; 

		if (CringeTrack[reaction.message.id].CringeAmount == CringeValue-1) {
			Stats[reaction.message.author.id].CringePosts--;
			reaction.message.reactions.cache.get(OfficialCringeEmoji).remove()
			.catch(error => console.error('Failed to remove reactions:', error));
		}	
	}

	else if(reaction._emoji.id == CringeEmoji && (Date.now() - reaction.message.createdTimestamp) > CringeTimeout){
		delete CringeTrack[reaction.message.id];
	}

	StatsFunc.SaveStats(Stats);
	
}); // END of on(react) event


// listens for voice channel updates
client.on('voiceStateUpdate', (oldState, newState) => { // START of on(voiceStateUpdate)

	UserID = newState.member.user.id;

	if (Stats[UserID] == undefined) StatsFunc.AddToStats(UserID);

	//***********************If someone is in the afk channel***********************

	if (newState.channelId == newState.guild.afkChannelId) {
		newState.member.send('You just got owned.'); //Send ownage message
		Stats[UserID].OwnedAmount++;

		if ((oldState.channelId != newState.channelId) && oldState.channelId != undefined) {
			Stats[UserID].LeaveCall = Date.now();
			Stats[UserID].CallTime += Stats[UserID].LeaveCall - Stats[UserID].JoinCall; 
		}
	}
	
	//***********************If someone joined any other channel but not the afk channel***********************

	else if ((oldState.channelId != newState.channelId) && newState.channelId != undefined) {


		//***********************Set when they last joined***********************

		Stats[UserID].JoinCall = Date.now();


		//***********************Check if they are in debt***********************

		if (Stats[UserID].Debt == true) {
			client.channels.cache.get(botChannel).send(`~own <@${newState.member.user.id}>`);
			Stats[UserID].Debt = false
		}
	}


	//***********************If someone leaves***********************

	else if ((oldState.channelId != newState.channelId) && newState.channelId == undefined && oldState.channelId != newState.guild.afkChannelId) {
		Stats[UserID].LeaveCall = Date.now();
		Stats[UserID].CallTime += Stats[UserID].LeaveCall - Stats[UserID].JoinCall; 
	}


	//***********************Saves new stats to file***********************

	StatsFunc.SaveStats(Stats);

}); // END of on(voiceStateUpdate)