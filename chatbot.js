let main = require('./main');
let cmd = require('./commands');

function textDelay(text){
	let rand = Math.floor(Math.random() * 3) + 1;
	return (text.length * (main.config.chatbot.delayMultiplier * rand));
}

function chatBot(){

	let { rsbot, dbna, tcw, config, myAccountData, db } = main;

	dbna.on('message', (msg) => {

		// check if message is from this bot
		if(msg.message.sender == myAccountData.thumb.id) return;

		// check if message is a command
		if(msg.message.message.startsWith(config.chatbot.cmdPrefix)){

			msg.actions.read();

			if(config.chatbot.rootUsers.includes(msg.message.sender)){

				let args = msg.message.message.substr(config.chatbot.cmdPrefix.length).split(' ');
				let intend = args.shift();

				if(typeof cmd[intend] === 'function'){
					let res = cmd[intend](args);
					msg.chat.send(res);
				}else{
					msg.chat.send(config.chatbot.notFoundMessage)
				}

			}else{
				msg.chat.send(config.chatbot.notRootMessage);
				console.log('[cmd] attemp of unauthorized access by ' + msg.message.sender);
			}

			return;

		}

		// check if chatbot is disabled
		if(db.get('status.chat').value() !== 1) return;

		setTimeout(()=>{

			msg.actions.read();

			setTimeout(() => {

				msg.chat.typing(true);

				rsbot.reply('local-user', tcw.tokenize(msg.message.message).join(' '))
					.then((reply) => {

						if(reply !== 'error'){
							setTimeout(() => {
								msg.chat.typing(false);
								msg.chat.send(reply);
							}, textDelay(reply));
						}else{
							setTimeout(() => {
								msg.chat.typing(false);
								msg.chat.send('Sorry ich muss mal eben wo hin. Wir können später weiter schreiben.');
							}, textDelay(reply));
							dbna.user(config.chatbot.rootUsers[0]).chat().send(`LTT-Bot: Cannot answer to "${msg.message.message}"`);
						}


					});


			}, textDelay(msg.message.message) / 2);

		}, textDelay(msg.message.message));


	});


}

module.exports = chatBot;