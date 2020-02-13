const fs = require('fs-extra');
const debug = require('debug')('save data:');


/**
 * Save data into json files for each show.
 * "DATABASE"
 */
module.exports = async function saveData (episodes) {
  const tvShows = [...new Set(episodes.map(ep => ep.showTitle))].sort();

  const availableShows = await _updateAvailableShows(tvShows);

  const selectedShows = Object.keys(availableShows)
    .filter(showName => availableShows[showName]);

  return await Promise.all(selectedShows.map(async showTitle => {
    const showPath = `./data/selectedShows/${showTitle}.json`;

    const show = await _assignLocalJson(showPath, {});

    const filteredEpisodes = episodes.filter(ep => ep.showTitle === showTitle);

    filteredEpisodes.forEach(episode => {
      if (!show[episode.season]) {
        show[episode.season] = {};
      }

      if (!show[episode.season][episode.episode]) {
        show[episode.season][episode.episode] = {
          date: episode.date
        }
      }
    });

    return fs.writeJson(showPath, show, {spaces: 2});
  }));
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

  await _assignLocalJson(availableShowsPath, availableShows);

  await fs.writeJson(
    availableShowsPath, availableShows, {spaces: 2}
  );

  return availableShows;
}

async function _assignLocalJson(path, defaultVal) {
  if (await fs.exists(path)) {
    return Object.assign(defaultVal, await fs.readJson(path));
  } else {
    await fs.ensureFile(path);
    return defaultVal;
  }
}

