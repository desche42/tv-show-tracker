/**
 * Entry point of the library
 */
const debug = require('debug')('tv-show-tracker:');
const config = require('config');
const start = require('./src/lifecycle');

start();
