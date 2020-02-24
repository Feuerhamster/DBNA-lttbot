module.exports = class TextClassSingle{

	constructor(){

		// default construct of a model
		this.model = {
			tokens: {},
			importantTokens: {},
			processed: false
		};

		// The regex that will be used to tokenize the inputs
		this.tokenizerRegex = /[a-zA-Z0-9äöüß]+/gi;

		// set to default value. This will be updated automatically to a better value while processing the tokens.
		this.importanceWeighting = 2;
	}

	learn(text){

		this.model.processed = false;

		let tokens = this.tokenize(text);

		// add tokens with quantity to the model
		for(let token of tokens){
			// if token not exist, create it. If token exist, increase quantity
			if(!this.model.tokens[token]){
				this.model.tokens[token] = 1;
			}else{
				this.model.tokens[token]++;
			}

		}


	}

	processModel() {

		this.calculateImportanceWeighting();

		for(let token in this.model.tokens){

			let tokenQuantity = this.model.tokens[token];

			//importance levels
			if(tokenQuantity >= this.importanceWeighting && tokenQuantity < this.importanceWeighting * 2){
				this.model.importantTokens[token] = 1;

			}else if(tokenQuantity > this.importanceWeighting * 2){
				this.model.importantTokens[token] = 2;
			}

		}

		this.model.processed = true;

	}

	calculateImportanceWeighting(){

		/*
		* Calculate average quantity of all token quantities
		* Result -> importanceWeighting
		* */

		let quantities = Object.values(this.model.tokens);
		this.importanceWeighting = Math.round(quantities.reduce((a, c) => a + c) / quantities.length);

	}

	tokenize(text){
		//returns an array with only words in lower case
		return Array.from(text.matchAll(this.tokenizerRegex), el => el[0].toLowerCase());

	}

	run(text){

		// check if the model is processed or not. If not, do it.
		if(!this.model.processed){
			this.processModel();
		}

		// get the tokens (array with lower case words) of both input and model
		let tokens = this.tokenize(text);
		let modelTokens = Object.keys(this.model.tokens);

		let points = 0;
		let totalPoints = tokens.length;

		// loop over the words of the input
		for(let token of tokens){

			/*
			* Rules of this algorithm:
			* - If the word of the input is in the model, get +1 points
			* - If the word of the input is NOT in the model, get -1 points
			* - If the word of the input is important, add importance level to points (+1 or +2, depends on word importance)
			* */

			if(modelTokens.includes(token)){

				points++;
				// if the current token is important, add importance level to points
				points += this.model.importantTokens[token] ? this.model.importantTokens[token] : 0;

			}else{
				// decrease points. If points are already lower than 1, set to 0
				points = points < 1 ? 0 : points - 1;
			}

		}

		// calculate percent
		let confident = (points / totalPoints);

		// check if percent is greater than 100. If yes, set to 10
		confident = confident > 1 ? 1 : confident;

		return {
			input: tokens.join(' '),
			matchedTokens: tokens.filter(token => modelTokens.includes(token)),

			result: {
				confident: confident,
				percent: parseFloat((confident * 100).toFixed(2))
			}

		};

	}

};