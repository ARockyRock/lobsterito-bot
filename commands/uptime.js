module.exports = {
	name: 'uptime',
	description: 'Displays bot uptime',
	usage: '',
	execute(msg, args) {
		function format(second) {
			function pad(s) {
				return (s < 10 ? '0' : '') + s;
			}
			const hours = Math.floor(second / (60 * 60));
			const minutes = Math.floor(second % (60 * 60) / 60);
			const seconds = Math.floor(second % 60);

			return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
		}

		const uptime = process.uptime();
		msg.channel.send(format(uptime));
		console.log(format(uptime));
	},
};
