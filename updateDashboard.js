const main = require('./main');
const fs = require('fs');

function updateDashboard(){

	let { dbna, db, myAccountData } = main;

	let template = fs.readFileSync('./data/dashboardTemplate.md').toString();

	let placeholders = Array.from(template.matchAll(/{(\w+)}/g), el => { return {tag: el[0], name: el[1]} });

	placeholders.forEach((placeholder) => {
		template = template.replace(placeholder.tag, db.get('analytics.' + placeholder.name).value());
	});

	dbna.user(myAccountData.thumb.id).texts().update('dreamboy', template);

}

module.exports = updateDashboard;
