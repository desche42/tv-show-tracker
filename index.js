/**
 * Entry point of the library
 */

const schedule = require('./src/schedule');
const search = require('./src/search');
const debug = require('debug')('tv-show-tracker:');
const download = require('./src/download');
const config = require('config');

/**
 * Update schedule and search available torrents for downloading.
 */
async function start() {
  try {
    if (config.get('updateCalendar')) {
      await schedule.update();
    }

   const {
     magnets,
     newEpisodes
   } = await _getAvailableEpisodes();

   const actions = [];

   newEpisodes.length && actions.push(search(newEpisodes));
   magnets.length && actions.push(download.downloadTorrents(magnets));

   await Promise.all(actions);

    if (config.get('restart')) {
      restart();
    } else {
      debug('Finished.');
    }
  } catch (err) {
    debug(err);
  }
}

function restart () {
  debug('Restarting...');
  setTimeout(start, 5000);
}

/**
 * @returns available episodes classified as {
 *  mangets, // ready ro download
 *  newEpisodes // search for torrent
 * }
 */
async function _getAvailableEpisodes() {
  const episodes = await schedule.getAvailableEpisodes();

  return {
    magnets: episodes.filter(ep => ep.torrent && ep.torrent.magnet),
    newEpisodes: episodes.filter(ep => !ep.torrent)
  }
}

start();
