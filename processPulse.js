let main = require('./main.js');

function processPulse(){

	let { dbna, myAccountData, db, tcw, config} = main;

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

	// like the ltt story
	dbna.story(story.id).heart();

	// select a random comment
	let selectedComment = config.lttPostComments[Math.floor(Math.random() * config.lttPostComments.length)];
	// post a comment to the ltt story
	dbna.story(story.id).comments().post(selectedComment)
		.catch(err => console.error(err));

	db.get('processedStories').push(story.id).write();

	let topUsers = db.get('analytics.topUsers').value();
	if(topUsers[story.user.id]){
		topUsers[story.user.id]++
	}else{
		topUsers[story.user.id] = 1
	}

	db.update('analytics.topUsers', topUsers).write();

	db.update('analytics.postsToday', n => n + 1).write();

}

module.exports = processPulse;