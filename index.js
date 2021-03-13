// loads necessary packages and configs
const fs = require('fs');
const Discord = require('discord.js');
var OwnedL = require('./OwnedLeaderboard.json'); //Reads the Owned Leaderboard JSON file and saves to memory

/* const config = require('./config.json'); */
// loads only the values being called from config.json
const { prefix, token, errorMsg } = require('./config.json');


const cooldowns = new Discord.Collection();

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.phrases = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const phraseFiles = fs.readdirSync('./phrases').filter(file => file.endsWith('.js'));

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


// listens for messages
// ${var} calls a variable within a string

client.on('message', msg => {	// START of on(message) event

	if (msg.author.bot) {		// if message read is from a bot it exits code
		return;
	} else if (!msg.content.startsWith(prefix)) {

		let daPhrase = msg.content;

		if (daPhrase.includes('🥛')) {		// TODO: do this automatically like with commands
			daPhrase = '🥛';
		} else if (daPhrase.includes('checkmate')) {
			daPhrase = 'checkmate';
		}

		const phrase = client.phrases.get(daPhrase);
		if(!phrase) return;

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

		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if(!command) return;

		if(command.guildOnly && msg.channel.type !== 'text') {
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

		if (timestamps.has(msg.author.id)) {
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
			command.execute(msg, args, client);
		} catch (error) {
			console.error(error);
			msg.reply(errorMsg);
		}
	}


});	// END of on(message) event


// listens for voice channel updates
client.on('voiceStateUpdate', (oldState, newState) => { // START of on(voiceStateUpdate)
	if (newState.channelID == newState.guild.afkChannelID) {
		newState.member.send('You just got owned.');

		var OwnedA = 0; //How many times someone has been owned
		var OwnedID =''; //How is getting owned
		var OwnedPlace = 0; //Where in the JSON string that person is

		//Looks through the entire string to find where the the ownee is in the string
		for(var i = 0; i < OwnedL.length; i++){
 	 		if(OwnedL[i].UserID == newState.member.user.id){
    			OwnedA = OwnedL[i].OwnedAmount;
    			OwnedID = OwnedL[i].UserID;
    			OwnedPlace=i;
  			}
		}
		//If they have not been owned before then OwnedID will still be empty
		if (OwnedID == ''){
			const newOwned = {					//Creates a new string containing their id and the amount of times owned 
			UserID: newState.member.user.id,
    			OwnedAmount: 1
			}
			fs.writeFile('./OwnedLeaderboard.json', JSON.stringify(OwnedL.concat(newOwned)), err => { //Adds the above string to the existing string and writes to JSON file
    			if (err) {
        			console.log('Error writing file', err)
    			}
			})
			OwnedL = OwnedL.concat(newOwned); //Saves new ownee in memory
		}
		//If they have been owned before
		else{
        	OwnedA++; //Increments amount of times owned
			OwnedL[OwnedPlace].OwnedAmount = OwnedA; //Updates the owned memory string to the new amount
			fs.writeFile('./OwnedLeaderboard.json', JSON.stringify(OwnedL), err => { //Saves the new amount to a JSON file
    			if (err) {
        			console.log('Error writing file', err)
    			}
			})
		}
	}
}); // END of on(voiceStateUpdate)
