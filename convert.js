const fs = require ("fs");

// Format for Starry Night (SiennaSoft)
// Num   Name                Mag.       a          e        i       Node        w         L      Epoch

fs.readFile('data/Minor planet.txt', 'utf8', (err, data)=>{
	if(err)
		return console.error(err);
	data = data.split("\n");
	let premier = true;
	let json = "[\n";
	for(let minorPlanet of data){
		let result = minorPlanet.match(/(.{24}) +([0-9.]+) +([0-9.]+) +([0-9.]+) +([0-9.]+) +([0-9.]+) +([0-9.]+) +([0-9.]+) +([0-9.]+)/);
		if(!result)
			continue;
		if(parseFloat(result[2])>18)
			continue;

		let semiMajorAxis = parseFloat(result[3]);
		let excentricity = parseFloat(result[4]);
		let inclination = parseFloat(result[5]);
		let ascendingNode = parseFloat(result[6]);
		let argumentOfPeriapsis = parseFloat(result[7]);
		let meanAnomaly = parseFloat(result[8]);

		// Calculation of the Orbital period
		let semiMajorAxisM = semiMajorAxis*1.496E11;
		let orbitalPeriod = 2*Math.PI*Math.sqrt(semiMajorAxisM*semiMajorAxisM*semiMajorAxisM/1.32712440042E20);
		orbitalPeriod /= 86400;

		let semiMajorAxisLS = semiMajorAxis*499;
		let apoapsis = semiMajorAxisLS*(1+excentricity);
		let periapsis = semiMajorAxisLS*(1-excentricity);

		json +=`	${premier ? "":","}{
		"name": "${result[1].toLowerCase().trim()}",
		"realName": "${result[1].trim()}",
		"semiMajorAxis": ${semiMajorAxisLS},
		"excentricity": ${excentricity},
		"inclination": ${inclination},
		"ascendingNode": ${ascendingNode},
		"argumentOfPeriapsis": ${argumentOfPeriapsis},
		"orbitalPeriod": ${orbitalPeriod},
		"meanAnomaly": ${meanAnomaly},
		"epoch": "2017-09-04",
		"apoapsis": ${apoapsis},
		"periapsis": ${periapsis}
	}\n`;
	premier=false;
	}
	json += "]";
premier
	fs.writeFile("data/minorplanets.json", json, ()=>{});
});

