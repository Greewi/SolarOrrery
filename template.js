const fs = require('fs');

const Template = class {
	/**
	 * @param {string} data le code du template
	 */
	constructor(data) {
		this._data = data;
		this._variables = {};
	}
	/**
	 * Sets a template variable
	 * @param {string} name the name of the variable
	 * @param {string} value the value to set
	 */
	setVariable(name, value){
		this._variables[name] = value;
	}
	/**
	 * Generates the template and return the generated code
	 * @returns {string}
	 */
	generate(){
		let generated = this._data;
		for(let varName in this._variables)
			generated = generated.replace(new RegExp(`\\{${varName}\\}`, 'g'), this._variables[varName]);
		return generated;
	}
};

/**
 * Loads a template and returns it.
 * @param {string} path the path to the template file
 */
const load = async (path) => {
	let data = await new Promise((resolve, reject)=>{
		fs.readFile(path, 'utf8', (err, data)=>{
			if(err)
				return reject(err);
			resolve(data);
		})
	});
	return new Template(data);
};

exports.Template = Template;
exports.load = load;