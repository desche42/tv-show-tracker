const path = require('path');
const output = require(path.join(__dirname, 'output'));


/**
 * Utils Module
 */
 module.exports = {
	doubleDigit,
	uniqueArray,
	output
 }

 /**
 * Returns number as dobule digit string preceaded with 0
 * @param {Number} n
 */
function doubleDigit (n) {
	return n < 10 ? `0${n}` : n;
}

function uniqueArray (arr) {
	return [...new Set(arr)];
}

