/**
 * Utils Module
 */
 module.exports = {
	doubleDigit
 }

 /**
 * Returns number as dobule digit string preceaded with 0
 * @param {Number} n
 */
function doubleDigit (n) {
	return n < 10 ? `0${n}` : n;
}

