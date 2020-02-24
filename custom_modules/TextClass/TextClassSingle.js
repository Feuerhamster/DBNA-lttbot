module.exports = class TextClassSingle{

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