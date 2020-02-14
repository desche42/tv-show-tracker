/**
 * Starter point of the application
 */
const schedule = require('./src/schedule');
const search = require('./src/search');
const debug = require('debug')('torrent-auto-downloader');

// arguments passed


/**
 * Updates the schedule
 */
async function start() {
  try {
    await schedule.update();
    const availableEpisodes = await schedule.getAvailableEpisodes();
    await search.searchEpisodes(availableEpisodes);

  } catch (err) {
    debug(err)
  }
}

start();

