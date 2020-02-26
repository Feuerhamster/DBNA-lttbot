let main = require('./main.js');
let updateDashboard = require('./updateDashboard');

function processPulse(){

	let { dbna, db, tcw, config} = main;

	// get current stream entries
	dbna.pulse().getCurrent().then(pulse => {
		// loop over all stream entries
		for(let story of pulse.stories){
			// continue if story has no body or comments are disabled (in case of pictures or something)
			if(!story.body || !story.comments || story.comments.disabled) continue;

			// execute TextClass
			let classificationResult = tcw.run(story.body);

			if(classificationResult.result.percent >= config.classification.minPercent){
				// check if story is already processed
				if(!db.get('processedStories').value().includes(story.id)){
					processStory(story);
				}
			}

		}

	}).catch(err => console.error(err));

}

function processStory(story){

	let { dbna, myAccountData, db, tcw, config} = main;

	console.log('[dbna] process ltt story...');

	// like the ltt story
	dbna.story(story.id).heart();

	// select a random comment
	let selectedComment = config.lttPostComments[Math.floor(Math.random() * config.lttPostComments.length)];
	// post a comment to the ltt story
	dbna.story(story.id).comments().post(selectedComment)
		.catch(err => console.error(err));

	db.get('processedStories').push(story.id).write();
	db.update('analytics.totalPosts', n => n + 1).write();

	let analyticsDay = new Date(db.get('analytics.day').value()).setHours(0,0,0,0);
	let currentDay = new Date().setHours(0,0,0,0);
	if(analyticsDay < currentDay){
		db.set('analytics.postsToday', 1).write();
		db.set('analytics.day', new Date().toString()).write();
	}else{
		db.update('analytics.postsToday', n => n + 1).write();
	}

	updateDashboard();

}

module.exports = processPulse;