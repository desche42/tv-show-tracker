/**
 * Entry point of the library
 */
const path = require('path');
const {start} = require(path.join(__dirname, 'src/lifecycle'));

module.exports = {start};
