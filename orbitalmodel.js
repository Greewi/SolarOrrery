const calendar = require("./calendar");

/**
 * Represente the orbital model for a given celestial object
 */
const OrbitalModel = class {
	/**
	 * @param {object} data the data for this model
	 * @param {string} data.name the name of the celestial object
	 * @param {number} data.semiMajorAxis the semi major axis of the orbit in light second
	 * @param {number} data.excentricity the excentricity of the orbit
	 * @param {number} data.inclination the inclination of the orbit
	 * @param {number} data.ascendingNode the ascending node of the orbit
	 * @param {number} data.argumentOfPeriapsis the argument of periapsis of the orbit
	 * @param {number} data.orbitalPeriod the orbital period in terrestrial day
	 * @param {number} data.meanAnomaly the mean anomaly in degree
	 * @param {string} data.epoch the date corresponding to the data in UTC format ("YYYY-MM-DD")
	 */
	constructor(data) {
		this._name = data.name;
		this._semiMajorAxis = data.semiMajorAxis;
		this._excentricity = data.excentricity;
		this._inclination = data.inclination;
		this._ascendingNode = data.ascendingNode;
		this._argumentOfPeriapsis = data.argumentOfPeriapsis;
		this._orbitalPeriod = data.orbitalPeriod;
		this._meanAnomaly = data.meanAnomaly;
		this._epoch = data.epoch;
		// Derived properties
		this._julianEpoch = calendar.dateToJulianDay(data.epoch);
		this._apoapsis = data.semiMajorAxis * (1 + data.excentricity);
		this._periapsis = data.semiMajorAxis * (1 - data.excentricity);
	}

	/**
	 * Return the name of the celestial object
	 */
	getName() {
		return this._name;
	}

	/**
	 * Compute the true anomaly.
	 * @param {number} meanAnomaly the mean anomaly (in degree)
	 * @returns {number} the true anomaly (in degree)
	 */
	getTrueAnomaly(meanAnomaly) {
		// From : https://en.wikipedia.org/wiki/True_anomaly#From_the_mean_anomaly
		let M = meanAnomaly * Math.PI / 180;
		let e = this._excentricity;
		let e2 = e * e;
		let e3 = e2 * e;
		let m = M
			 + (2 * e - 1 / 4 * e3) * Math.sin(M)
			 + 5 / 4 * e2 * Math.sin(M * 2)
			 + 13 / 12 * e3 * Math.sin(M * 3);
		return m*180/Math.PI;
	}

	/**
	 * Compute the distance from the star for a given longitude
	 * @param {number} vernalAngle the vernal angle in degree (longitude)
	 * @returns {number}
	 */
	getDistance(vernalAngle) {
		let trueAnomaly = ((vernalAngle - this._ascendingNode - this._argumentOfPeriapsis+360)%360)*Math.PI/180;

		// From : https://en.wikipedia.org/wiki/True_anomaly#Radius_from_true_anomaly
		return this._semiMajorAxis * (1 - this._excentricity * this._excentricity) / (1 + this._excentricity * Math.cos(trueAnomaly));
	}

	/**
	 * @typedef {Object} PolarPosition
	 * @property {number} angle - the angle from the vernal axis in degree
	 * @property {number} distance - the distance from the central body
	 */

	/**
	 * Compute the position in polar coordinate of the object at a given julian day.
	 * 
	 * @param {number} julianDay the julian day of the moment when to compute the position
	 * @returns {PolarPosition}
	 */
	getPosition(julianDay) {
		let daysSinceEpoch = julianDay - this._julianEpoch;
		let meanAnomaly = ((this._meanAnomaly + 360 * daysSinceEpoch / this._orbitalPeriod) % 360);
		let trueAnomaly = this.getTrueAnomaly(meanAnomaly);
		let vernalAngle = (trueAnomaly + this._ascendingNode + this._argumentOfPeriapsis)%360;
		let distance = this.getDistance(vernalAngle);

		return {
			angle: vernalAngle,
			distance: distance
		};
	}

};

/**
 * Instanciate a new orbital model.
 * 
 * @param {object} data the data for this model
 * @param {string} data.name the name of the celestial object
 * @param {number} data.semiMajorAxis the semi major axis of the orbit in light second
 * @param {number} data.excentricity the excentricity of the orbit
 * @param {number} data.inclination the inclination of the orbit
 * @param {number} data.ascendingNode the ascending node of the orbit
 * @param {number} data.argumentOfPeriapsis the argument of periapsis of the orbit
 * @param {number} data.orbitalPeriod the orbital period in terrestrial day
 * @param {number} data.meanAnomaly the mean anomaly in degree
 * @param {string} data.epoch the date corresponding to the data in UTC format ("YYYY-MM-DD")
 * @returns {OrbitalModel}
 */
const create = (data) => {
	return new OrbitalModel(data);
};

exports.OrbitalModel = OrbitalModel;
exports.create = create;