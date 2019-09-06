const { randomAPI, errorMsg } = require('../config.json');
const RandomOrg = require('random-org');
const random = new RandomOrg({ apiKey: randomAPI });

module.exports = {
	name: 'roll',
	aliases: ['r'],
	description: 'Rolls dice',
	args: true,
	usage: '[# of dice]d[# of sides on die]', // ~roll 69d420
	execute(msg, args) {

		const arg = args[0];
		const dIndex = arg.indexOf('d');
		const dRolls = arg.slice(0, dIndex);
		const dSides = arg.slice(dIndex + 1, arg.length);


		if (dSides == 1) {
			msg.channel.send(dRolls);
			if (dRolls == 69) msg.reply(' you are one fake fuck!');
		} else if (dSides == 0 || dRolls == 0) {
			msg.channel.send('Null');
		} else if (isNaN(dRolls) || isNaN(dSides)) {
			msg.reply('you massive fuck up. You MUST use NUMBERS');
		} else {
			random.generateIntegers({ min: 1, max: dSides, n: dRolls })
				.then(result => {
					const randomArray = result.random.data;
					const sum = randomArray.reduce((a, b) => a + b);
					msg.channel.send('Rolled ' + arg + ': ' + sum);
					if (sum == 69) msg.reply(' that\'s the sex number!');
				})
				.catch(error => {
					msg.channel.send(errorMsg);
					console.error(error);
				});
		}
	},
};
