const DataSet = require("./dataset").DataSet;
const StyleSet = require("./styleset").StyleSet;
const OrbitalModel = require("./orbitalmodel").OrbitalModel;

const OrreryConstructor = class {
	/**
	 * 
	 * @param {DataSet} dataset
	 * @param {StyleSet} styleset
	 * @param {number} start start (Julian Day)
	 * @param {number} start end (Julian Day)
	 * @param {function} scaleFunction a function that manage the scale of the map. Receives a radius in parameter and returns the value in pixels
	 */
	constructor(dataset, styleset, start, end, scaleFunction) {
		this._dataset = dataset;
		this._styleSet = styleset;
		this._start = start;
		this._end = end;
		this._scale = scaleFunction;
	}

	buildSVG() {
		let svg = `<?xml version="1.0" encoding="utf-8"?>
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
			width="2048"
			height="2048"
			viewBox="-1024 -1024 2048 2048"
			preserveAspectRatio="xMidYMid meet"
			xmlns:xlink="http://www.w3.org/1999/xlink"
		>
			<title>Solar Orrery</title>
			<desc></desc>
			<rect id="background" x="-1024" y="-1024" width="2048" height="2048" fill="#000000" />
			<circle id="sun" cx="0" cy="0" r="5" fill="#FFFFFF" />
			${this.buildOrbits()}
		</svg>`;
		return svg;
	}

	buildOrbits() {
		let orbits = "";
		for (let model of this._dataset.getAllCelestialObjects()) {
			orbits += this.buildOrbit(model);
		}
		for (let model of this._dataset.getAllCelestialObjects()) {
			orbits += this.buildName(model);
		}
		return orbits;
	}

	buildOrbit(model) {
		let orbit = "";
		let start = this._start;
		let end = this._start;
		let slices = 4;
		for (let m = 1; m <= slices; m++) {
			start = end;
			end = Math.round(m * (this._end - this._start) / slices) + this._start;
			let opacity = m / slices;
			orbit += this.buildArc(model, start, end, opacity);
		}
		return orbit;
	}

	/**
	 * @param {OrbitalModel} model 
	 * @param {number} start 
	 * @param {number} end 
	 * @param {number} opacity 
	 */
	buildArc(model, start, end, opacity) {
		let style = this._styleSet.getStyle(model.getName());
		opacity*=style.opacity;
		let path = '';
		let x, y = 0;
		for (let jd = start; jd <= end; jd++) {
			let position = model.getPosition(jd);
			let spiralSpread = style.spiral * (style.width);
			let r = this._scale(position.distance);
			if(style.spiral>0)
				r += (jd - this._start) * spiralSpread / (this._end - this._start) - spiralSpread;
			let a = position.angle * Math.PI / 180;
			x = r * Math.cos(a);
			y = r * Math.sin(a);
			if (jd == start)
				path = `M${x} ${y} `;
			else
				path += `L${x} ${y} `;
		}
		if (style.tickWidth > 0)
			return `<path id="${model.getName()}-${start}-${end}" d="${path}" stroke="${style.color}" stroke-opacity="${opacity}" stroke-width="${style.width}" fill="none" />
				<circle id="${model.getName()}-body-${end}" cx="${x}" cy="${y}" r="${style.tickWidth*2}" fill="${style.color}" fill-opacity="${opacity*0.2}" />\n
				<circle id="${model.getName()}-outline-${end}" cx="${x}" cy="${y}" r="${style.tickWidth}" fill="${style.color}" fill-opacity="${opacity}" />\n`;
		else
			return `<path id="${model.getName()}-${start}-${end}" d="${path}" stroke="${style.color}" stroke-opacity="${opacity}"  stroke-width="${style.width}" fill="none" />\n`;
	}

	/**
	 * @param {OrbitalModel} model 
	 */
	buildName(model) {
		let style = this._styleSet.getStyle(model.getName());
		if(style.displayName=="")
			return "";

		let position = model.getPosition(this._end);
		
		let styleTexte = `font-style:normal;font-size:22px;font-family:'Exo 2';fill:#ffffff;fill-opacity:1;stroke:none;`;
		let path='';
		if(position.angle<180){
			// Up is inside
			for (let angle = position.angle; angle>=position.angle-180; angle--) {
				let r = this._scale(model.getDistance(angle)) + style.tickWidth*2 + 14
				let a = angle * Math.PI / 180;
				let x = r * Math.cos(a);
				let y = r * Math.sin(a);
				if (path == '')
					path = `M${x} ${y} `;
				else
					path += `L${x} ${y} `;
			}
			return `<path id="${model.getName()}Path" fill="none" stroke="none" d="${path}" /><text style="${styleTexte}"><textPath xlink:href="#${model.getName()}Path">${style.displayName}</textPath></text>`;
		} else {
			// Up is outside
			for (let angle = position.angle-180; angle<=position.angle; angle++) {
				let r = this._scale(model.getDistance(angle)) + style.tickWidth*2;
				let a = angle * Math.PI / 180;
				let x = r * Math.cos(a);
				let y = r * Math.sin(a);
				if (path == '')
					path = `M${x} ${y} `;
				else
					path += `L${x} ${y} `;
			}
			return `<path id="${model.getName()}Path" fill="none" stroke="none" d="${path}" /><text style="${styleTexte}" text-anchor="end"><textPath startOffset="100%" xlink:href="#${model.getName()}Path">${style.displayName}</textPath></text>`;
		}
	}
};

const create = (dataset, styleset, start, end, scaleFunction) => {
	return new OrreryConstructor(dataset, styleset, start, end, scaleFunction);
};

exports.create = create;
exports.OrreryConstructor = OrreryConstructor;