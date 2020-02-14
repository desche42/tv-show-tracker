/**
 * Starter point of the application
 */
const DB = require('./src/database');
const schedule = require('./src/schedule');
const debug = require('debug')('torrent-auto-downloader');

// arguments passed


// default
async function init() {
  try {
    await schedule.update();
  } catch (err) {
    debug(err)
    console.error('There was an error');
  }
}

init();

