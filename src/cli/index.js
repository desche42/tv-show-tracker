/**
 *
 * Command line interface fot tv-show-tracker
 *
 */
const path = require('path');
const watch = require(path.join(__dirname, 'watch'));
const add = require(path.join(__dirname, 'add'));


module.exports = {
	watch,
	add
}
