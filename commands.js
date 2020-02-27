let main = require('./main');
let updateDashboard = require('./updateDashboard');

module.exports = {

	shutdown: () => {

		main.db.set('status.chat', 0).write();
		main.db.set('status.ltt', 0).write();

		updateDashboard();

		setTimeout(() => {
			process.exit();
		}, 5000);

		return '>> node application shutdown in 5 seconds';

	},

	chat: (args) => {
		if(args[0] === 'enable'){

			main.db.set('status.chat', 1).write();
			updateDashboard();
			return ">> chat enabled";

		}else if(args[0] === 'disable'){

			main.db.set('status.chat', 2).write();
			updateDashboard();
			return ">> chat disabled";

		}else{
			return ">> argument not found";
		}
	},

	ltt: (args) => {
		if(args[0] === 'enable'){

			main.db.set('status.ltt', 1).write();
			updateDashboard();
			return ">> ltt enabled";

		}else if(args[0] === 'disable'){

			main.db.set('status.ltt', 2).write();
			updateDashboard();
			return ">> ltt disabled";

		}else{
			return ">> argument not found"
		}
	},

	help: () => {
		return 'Commands: \n//help\n//chat <enable/disable>\n//ltt <enable/disable>';
	},

	setval: (args) => {

		let { db } = main;

		let field = args[0];
		let value = args[1];

		if(/\d+/.test(value)){
			value = Number.parseInt(value);
		}else if(value === 'true' || value === 'false'){
			value = value === 'true';
		}

		db.set(field, value).write();

		updateDashboard();

		return `>> set "${field}" to ${value}`;

	}

};