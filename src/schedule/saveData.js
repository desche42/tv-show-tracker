const fs = require('fs-extra');
const debug = require('debug')('save data:')


/**
 * Save data into json files for each show.
 * "DATABASE"
 */
module.exports = async function saveData (episodes) {
  const tvShows = [...new Set(episodes.map(ep => ep.showTitle))].sort();

  await _updateAvailableShows(tvShows);


  // tvShows.forEach(showTitle => {
  //   const showEpisodes = episodes.filter(ep => ep.showTitle === showTitle);

  // });
}


/**
 * Update local json of available tv shows
 * @param {Array} shows names
 */
async function _updateAvailableShows (shows) {
  debug('Updating available shows...');
  const availableShowsPath = './data/availableShows.json';

  const availableShows = shows.reduce((acc, showName) => {
    acc[showName] = false;
    return acc;
  }, {});

  if (await fs.exists(availableShowsPath)) {
    Object.assign(availableShows, await fs.readJson(availableShowsPath));
  } else {
    await fs.ensureFile(availableShowsPath);
  }

  await fs.writeJson(availableShowsPath, availableShows, {spaces: 2});
}
