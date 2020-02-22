const output = require('../utils').output('schedule');
const {rawDb} = require('../database');

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
    episode.show = episode.show.toLowerCase();
    shows.push(episode.show);
    episode.downloaded = false;
    rawDb.get(DB_EPISODES_KEY).push(episode).write();
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
    const show = rawDb.get(DB_SHOWS_KEY)
      .find({ title: showName })
      .value();

    if (!show) {
      output(`new show "${showName}" available!!`);
      rawDb.get(DB_SHOWS_KEY).push({title: showName}).write();
    }
  }));
}
