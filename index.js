/**
 * Entry point of the library
 */

const schedule = require('./src/schedule');
const search = require('./src/search');
const debug = require('debug')('torrent-auto-downloader:');
const download = require('./src/download');


/**
 * Update schedule and search available torrents for downloading.
 */
async function start() {
  try {
    await schedule.update();
    const availableEpisodes = await schedule.getAvailableEpisodes();
    await search(availableEpisodes);
    await download.downloadTorrents();
  } catch (err) {
    debug(err)
  }

  debug('All torrents downloaded. Nice!!!');
}

start();
