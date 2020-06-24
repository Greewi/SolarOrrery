/**
 * Convert a date to a julian day
 * @param {string} date the date to comvert in UTC format ("YYYY-MM-DD")
 */
const dateToJulianDay = (date) => {
	// From : https://en.wikipedia.org/wiki/Julian_day
	// The algorithm is valid for all (possibly proleptic) Gregorian calendar dates after November 23, −4713. Divisions are integer divisions, fractional parts are ignored.[68]
	// JDN = (1461 × (Y + 4800 + (M − 14) /12))/4 + (367 × (M − 2 − 12 × ((M − 14) /12)))/12 − (3 × ((Y + 4900 + (M - 14) / 12) / 100)) /4 + D − 32075 

	let matches = date.match(/([0-9]+)-([0-9]+)-([0-9]+)/);
	let y = parseInt(matches[1]);
	let m = parseInt(matches[2]);
	let d = parseInt(matches[3]);

	let p = Math.trunc((m - 14) / 12);

	let a = Math.trunc((1461 * (y + 4800 + p)) / 4);
	let b = Math.trunc((367 * (m - 2 - 12 * (p))) / 12);
	let c = Math.trunc((3 * ((y + 4900 + p) / 100)) / 4);
	return a + b - c + d - 32075;
}

const julianDayToDate = (julianDay) => {
	// From : https://en.wikipedia.org/wiki/Julian_day

	let f = julianDay + 1401 + Math.trunc(Math.trunc((4*julianDay+274277)/146097)*3/4) - 38;
	let e = 4*f + 3;
	let g = Math.trunc((e%1461)/4);
	let h = 5*g + 2;
	let day = Math.trunc((h%153)/5)+1
	let month = (Math.trunc(h/153)+2)%12+1;
	let year = Math.trunc(e/1461) - 4716 + Math.trunc((14 - month)/12);
	return `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`;
}

exports.dateToJulianDay = dateToJulianDay;
exports.julianDayToDate = julianDayToDate;
