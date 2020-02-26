let main = require('./main');

function clearDB(){

	let { db } = main;

	let processedStories = db.get('processedStories').value();

	let deleteEntryCount = processedStories.length - 16;

	if(deleteEntryCount > 0){

		for(let i = 0; i < deleteEntryCount; i++){
			processedStories.shift();
		}

		db.set('processedStories',processedStories).write();
		console.log('[db] cleared. deleted entries: ' + deleteEntryCount);
	}

}

module.exports = clearDB;