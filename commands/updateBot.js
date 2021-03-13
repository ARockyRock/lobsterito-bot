const exec = require('child_process').exec;

module.exports = {
	name: 'update',
	description: 'Update bots repo. Contributers only.',
	execute(msg, args) {
		const sender = msg.member;
		if (sender.id == 127644338250317827 || sender.id == 104690572568117248)
		{
			const gitUpdateScript = exec('sh updateGit.sh');
			gitUpdateScript.stdout.on('data', (data)=>{
				console.log(data);
				msg.channel.send("Update script completed without error.");
			});
			gitUpdateScript.stderr.on('data', (data)=>{
				console.error(data);
				msg.channel.send("Update script had an error.");
			});

			setTimeout(() => {
				process.exit();
			}, 3000);
		}
		else
		{
			msg.reply("you don't have permission.");
		}
	},
};