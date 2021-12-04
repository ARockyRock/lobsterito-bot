function AddToStats(UserIDFunc, Stats){
	//The Stats that will be collected
	Stats[UserIDFunc] = {
		OwnedAmount: 0, 
		Karma: 0, 
		Debt: false,
		TimesInDebt: 0,	
		CallTime: 0,
		JoinCall: 0,
		LeaveCall: 0,
		CringePosts: 0,
		TimesCringed: 0,	
		UncringePosts: 0,	//TODO
		TimesUncringed: 0,	//TODO
		Posts: 0,
		Core: false 		//TODO
		}
	return Stats;	
}

function SaveStats(Stats){
	try {
		fs.writeFileSync('./Statistics.json', JSON.stringify(Stats, null, "\t")); //Save the updated json array to a file
	} catch (error) {
		console.error(error);
	}	
}

module.exports = { AddToStats, SaveStats };