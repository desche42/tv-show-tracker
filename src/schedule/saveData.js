const debug = require('debug')('tv-show-tracker: schedule:');
const debugNewShow = require('debug')('New show available:');
const DB = require('../database');

const DB_SHOWS_KEY = 'shows';
const DB_EPISODES_KEY = 'episodes';
/**
 * Saves data into database
 * - update show collection
 * - save show episode
 */
module.exports = async function saveData (episodes) {
  const shows = [];

  episodes.forEach(episode => {
    shows.push(episode.showTitle);
    episode.downloaded = false;
    DB.get(DB_EPISODES_KEY).push(episode).write();
  });

  await _updateShowsInfo(shows);

}

/**
 * Update db of available shows and returns selected
 * @param {Array} newShows
 * @returns Promise<void>
 */
async function _updateShowsInfo (newShows) {
  return Promise.all(newShows.map(async (showName) => {
    const show = DB.get(DB_SHOWS_KEY)
      .find({ title: showName })
      .value();

    if (!show) {
      debugNewShow(showName);
      DB.get(DB_SHOWS_KEY).push({title: showName, selected: false}).write();
    }
  }));
}
