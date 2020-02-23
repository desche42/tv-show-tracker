const output = require('../utils').output('schedule');
const database = require('../database');

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
		database.push(episode);
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
    const show = database.shows.find(showName);

    if (!show) {
			output(`new show "${showName}" available!!`);
			database.shows.push(showName);
    }
  }));
}
