const main = require('./main');
const fs = require('fs');

function updateDashboard(){

	let { dbna, db, myAccountData } = main;

	let template = fs.readFileSync('./data/dashboardTemplate.md').toString();

	let placeholders = Array.from(template.matchAll(/{(\w+)}/g), el => { return {tag: el[0], name: el[1]} });

	placeholders.forEach((placeholder) => {

		let value = db.get('analytics.' + placeholder.name).value();
		//check if value is date
		if(typeof value == "string" && !isNaN(new Date(value))){
			let date = new Date(value);
			if(date.setHours(0,0,0,0) === new Date().setHours(0,0,0,0)){
				value = "Heute";
			}else{
				value = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
			}
		}

		template = template.replace(placeholder.tag, value);
	});

	dbna.user(myAccountData.thumb.id).texts().update('dreamboy', template)
		.then(data => console.log('[dbna] dashboard updated'));

}

module.exports = updateDashboard;
