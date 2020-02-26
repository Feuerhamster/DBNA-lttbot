// load modules
// external
const fs = require('fs');
const lowDB = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const riveScript = require("rivescript");
// custom
const dbnaAPI = require('./custom_modules/dbna-api-v2/main');
const TextClass = require('./custom_modules/TextClass/main');
const processPulse = require('./processPulse');
const updateDashboard = require('./updateDashboard');
const chatBot = require('./chatbot');
const clearDB = require('./clearDB');

// load config
let config = fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json')) : JSON.parse(process.env.CONFIG);

if(typeof config === 'undefined'){
	throw new ReferenceError("Config not found");
}

// create instances
const dbna = new dbnaAPI();
const tcw = new TextClass.SingleWeighted();
const db = lowDB(new FileSync('./data/db.json'));
var rsbot = new riveScript({utf8: true});

// log in to dbna
dbna.login(config.dbna.login.username, config.dbna.login.password)
	.then(data => main(data))
	.catch(err => console.error(err.data));

// init rivescript
rsbot.loadDirectory("rivescript").then(()=>{

	rsbot.sortReplies();
	console.log("[rivescript] Import successful");

}).catch((error, filename, lineno)=>{console.error(`[rivescript] Error: ${error}`); });

// set defaults for lowdb json
db.defaults({
	processedStories: [],
	analytics: { postsToday: 0, totalPosts: 0 , trainData: 0, queryInterval: 0, day: new Date().toString() },
	status: {
		chat: 1,
		ltt: 1
	}
}).write();
db.read();

db.set('analytics.queryInterval', config.dbna.queryInterval).write();
db.set('status.chat', 1).write();
db.set('status.ltt', 1).write();

/*
* Main Function
* Will be executed if the login on dbna is successful
* */
function main(myAccountData){

	module.exports.myAccountData = myAccountData;

	dbna.startChatClient();

	chatBot();

	setInterval(()=>{

		if(db.get('status.ltt').value() !== 1) return;

		console.log("[dbna] get pulse...");
		processPulse();

		clearDB();

	}, config.dbna.queryInterval * 1000);

	updateDashboard();

}

// train textClass
let trainData = fs.readFileSync('./data/ltt-traindata.txt').toString().split(/\r?\n/);

trainData.forEach((line)=>{
	tcw.learn(line);
});

db.set('analytics.trainData', trainData.length).write();

/*
* Webserver for heroku to run
* */
require('http').createServer(function (req, res) {
	res.write('DBNA-lttbot app');
	res.end();
}).listen(process.env.PORT || 3000);

// export all important modules
module.exports.dbna = dbna;
module.exports.db = db;
module.exports.tcw = tcw;
module.exports.config = config;
module.exports.rsbot = rsbot;