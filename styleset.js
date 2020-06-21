const fs = require('fs');
const styleModel = require('./styleModel');

const StyleSet = class {
	constructor(data){
		this._styles = {};
		for(let styleData of Object.values(data)){
			let style = styleModel.create(styleData);
			this._styles[style.name] = style;
		}
	}
	getStyle(name){
		if(this._styles[name])
			return this._styles[name];
		return this._styles["*"];
	}
}

const loadStyleSet = async (path) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, {}, (err, data) => {
			if (err)
				return reject(err);
			resolve(new StyleSet(JSON.parse(data)));
		});
	});
};

exports.StyleSet = StyleSet;
exports.loadStyleSet = loadStyleSet;