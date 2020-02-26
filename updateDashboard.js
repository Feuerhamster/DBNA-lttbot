const main = require('./main');
const fs = require('fs');

function updateDashboard(){

	let { dbna, db, myAccountData } = main;

	let template = fs.readFileSync('./data/dashboardTemplate.md').toString();

	let placeholders = Array.from(template.matchAll(/{([a-zA-Z0-9.]+)}/g), el => { return {tag: el[0], name: el[1]} });

	placeholders.forEach((placeholder) => {

		let value = db.get(placeholder.name).value();

		/*
		* Date calculation
		* */
		if(typeof value == "string" && !isNaN(new Date(value))){
			let date = new Date(value);
			value = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
		}

		/*
		* Status conversion
		* */
		if(typeof value == 'number' && placeholder.name.startsWith('status')){
			if(value === 1){
				value = '✅ Aktiv';
			}else if(value === 2){
				value = '⚠ Deaktiviert';
			}else if(value === 0){
				value = '❌ Offline';
			}
		}

		template = template.replace(placeholder.tag, value);
	});

	dbna.user(myAccountData.thumb.id).texts().update('dreamboy', template)
		.then(data => console.log('[dbna] dashboard updated'));

}

module.exports = updateDashboard;
