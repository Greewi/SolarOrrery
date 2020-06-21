const calendar = require('./calendar');
const dataset = require('./dataset');
const styleset = require('./styleset');
const orreryconstructor = require('./orreryconstructor');
const fs = require('fs');

let styles = null;
let models = null;

dataset.loadDataSet("data/minorplanets.json", "data/solarsystem.json")
.then((data)=> {
	models = data;
	return styleset.loadStyleSet("data/styles.json");
}).then((data)=> {
	styles = data;
	const scale = (r)=>{
		r=r/16000;
		let f=50;
		r=Math.log1p(r*f)/Math.log1p(f);
		return r*800;
	}
	let constructor = orreryconstructor.create(models, styles, calendar.dateToJulianDay("2237-01-01"), calendar.dateToJulianDay("2237-12-31"), scale);
	return constructor.buildSVG();
}) .then((svg) => {
	fs.writeFile('dist/orrery.svg', svg, ()=>{});
});
