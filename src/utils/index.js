/**
 * Utils Module
 */
 module.exports = {
	douleDigit
 }

 /**
 * Returns number as dobule digit string preceaded with 0
 * @param {Number} n
 */
const douleDigit = (n) => n < 10 ? `0${n}` : n;

