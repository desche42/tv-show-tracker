/**
 * Starter point of the application
 */
const schedule = require('./src/schedule');
const debug = require('debug')('torrent-auto-downloader');

// arguments passed


/**
 * Updates the schedule
 */
async function start() {
  try {
    await schedule.update();
    await schedule.getAvailableEpisodes();

  } catch (err) {
    debug(err)
    console.error('There was an error');
  }
}

start();

