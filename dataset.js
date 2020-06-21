const fs = require('fs');
const orbitalmodel = require('./orbitalmodel');

const DataSet = class {
	/**
	 * @param {object} data 
	 */
	constructor(data) {
		this._data = data;

		this._models = {};
		for(let modelData of data){
			let model = orbitalmodel.create(modelData);
			this._models[model.getName()] = model;
		}
	}

	/**
	 * @param {string} name the name of the wanted celestial object
	 * @returns {OrbitalModel} the orbital model of the celestial object
	 */
	getCelestialObject(name) {
		return this._models[name];
	}

	/**
	 * @returns {orbitalmodel.OrbitalModel[]}
	 */
	getAllCelestialObjects() {
		return Object.values(this._models);
	}
};

const loadDataSet = async (...paths) => {
	let dataset = [];
	for(let path of paths) {
		let data = await new Promise((resolve, reject) => {
			fs.readFile(path, {}, (err, data) => {
				if (err)
					return reject(err);
				resolve(JSON.parse(data));
			});
		});
		dataset = dataset.concat(data);
	}
	return new DataSet(dataset);
};

exports.DataSet = DataSet;
exports.loadDataSet = loadDataSet;