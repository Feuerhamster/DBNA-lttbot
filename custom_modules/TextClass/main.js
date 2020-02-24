/*
class TextClassSingle{

	constructor(){
		this.model = [];
		this.tokenizerRegex = /\w+/g;
	}

	learn(text){
		//merge arrays
		this.model = this.model.concat(this.tokenize(text));
	}

	tokenize(text){
		//return only words in lower case
		return Array.from(text.matchAll(this.tokenizerRegex), el => el[0].toLowerCase());

	}

	run(text){

		var tokens = this.tokenize(text);
		var points = 0;
		var totalPoints = tokens.length;

		for(let token of tokens){
			if(this.model.includes(token)){
				points++;
			}
		}

		return {
			confident: parseFloat(((points / totalPoints) * 100).toFixed(2))
		};

	}

}

class TextClassMulti{

	constructor(){
		this.model = {};
		this.tokenizerRegex = /\w+/g;
	}

	learn(text, label){

		if(!this.model[label]){
			this.model[label] = []
		}

		this.model[label] = this.model[label].concat(this.tokenize(text));
	}

	tokenize(text){

		return Array.from(text.matchAll(this.tokenizerRegex), el => el[0].toLowerCase());

	}

	run(text){

		var tokens = this.tokenize(text);
		var result = [];

		for(let label in this.model){

			var points = 0;
			var totalPoints = tokens.length;

			for(let token of tokens){
				if(this.model[label].includes(token)){
					points++;
				}
			}

			result.push({
				label: label,
				confident: parseFloat(((points / totalPoints) * 100).toFixed(2))
			});

		}

		return result;

	}

}
*/
module.exports.SingleWeighted = require('./TextClassSingleWeighted');
module.exports.Single = require('./TextClassSingle');

