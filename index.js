const calendar = require('./calendar');
const dataset = require('./dataset');
const styleset = require('./styleset');
const template = require('./template');
const orreryconstructor = require('./orreryconstructor');
const fs = require('fs');

let styles = null;
let models = null;

const main = async() => {
	let models = await dataset.loadDataSet("data/minorplanets.json", "data/solarsystem.json");
	let styles = await styleset.loadStyleSet("data/styles.json");
	let tpl = await template.load("data/template.svg");
	
	const scale = (r)=>{
		r=r/16000;
		let f=50;
		r=Math.log1p(r*f)/Math.log1p(f);
		return r*800;
	}
	let constructor = orreryconstructor.create(models, styles, tpl, calendar.dateToJulianDay("2237-01-01"), calendar.dateToJulianDay("2237-12-31"), scale);
	let svg = constructor.buildSVG();
	fs.writeFile('dist/orrery.svg', svg, ()=>{});
};
main();