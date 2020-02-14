const getEpisodes = require('./getEpisodes');
const saveData = require('./saveData');
const debug = require('debug')('torrent-auto-downloader: schedule');
const DB = require('../database');

/**
 * Get, parse and set schedule
 */
async function update () {
  try {
    // @todo do not save data if old schedule
    // for now ill comment this lines

    // debug('Getting episodes...');
    // const episodes = await getEpisodes();

    // debug('Saving data');
    // await saveData(episodes);
    // debug('Data saved');

  } catch (err) {
    console.error(err);
  }
}

/**
 * Gets episodes of selected shows which date is
 * before today.
 */
async function getAvailableEpisodes() {
  const selectedShows = DB.get('shows').filter({selected: true}).value();

  if (!selectedShows.length) {
    throw 'No shows selected, please select at least one in file database/db.json';
  }

  const episodes = _getNotDownloaded(selectedShows);

  return _filterFutureEpisodes(episodes);
}

/**
 * @param {Array} shows [{title}]
 * @returns Array of not downloaded episodes
 * of selected shows
 */
function _getNotDownloaded(shows) {
  return shows.reduce((acc, show) => {
    const showTitle = show.title;
    const episodes = DB.get('episodes')
      .filter({
        showTitle,
        downloaded: false
      }).value();

    acc.push(...episodes);
    return acc;
  }, []);
}

/**
 * Returns array with aired episodes
 * @param {Array} episodes
 */
function _filterFutureEpisodes(episodes) {
  const now = +new Date();
  return episodes.filter(episode =>
    +new Date(episode.date) < now
  );
}

module.exports = {
  update,
  getAvailableEpisodes
}
