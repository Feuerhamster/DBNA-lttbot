// load modules
// external
const fs = require('fs');
const lowDB = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
// custom
const dbnaAPI = require('./custom_modules/dbna-api-v2/main');
const TextClass = require('./custom_modules/TextClass/main');
const processPulse = require('./processPulse');
const updateDashboard = require('./updateDashboard');

// load config
const config = JSON.parse(fs.readFileSync('./data/config.json'));

// create instances
const dbna = new dbnaAPI();
const tcw = new TextClass.SingleWeighted();
const db = lowDB(new FileSync('./data/db.json'));

// log in to dbna
dbna.login(config.dbna.login.username, config.dbna.login.password)
	.then(data => main(data))
	.catch(err => console.error(err.data));

// set defaults for lowdb json
db.defaults({ processedStories: [], analytics: { postsToday: 0, totalPosts: 0 , trainData: 0, queryInterval: 0, day: new Date().toString() } }).write();
db.read();

db.set('analytics.queryInterval', config.dbna.queryInterval).write();

/*
* Main Function
* Will be executed if the login on dbna is successful
* */
function main(myAccountData){

	module.exports.myAccountData = myAccountData;

	setInterval(()=>{

		console.log("[dbna] get pulse...");
		processPulse();

	}, config.dbna.queryInterval * 1000);

	updateDashboard();

}

// train textClass
let trainData = fs.readFileSync('./data/ltt-traindata.txt').toString().split(/\r?\n/);

trainData.forEach((line)=>{
	tcw.learn(line);
});

db.set('analytics.trainData', trainData.length).write();


// export all important modules
module.exports.dbna = dbna;
module.exports.db = db;
module.exports.tcw = tcw;
module.exports.config = config;