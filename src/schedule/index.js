const getCurrentMonthSchedule = require('./schedule');
const debug = require('debug')('tv-show-tracker: schedule');
const DB = require('../database');
const fs = require('fs-extra');


module.exports = {
  update,
  getAvailableEpisodes
}

/**
 * Get, parse and set schedule
 */
async function update () {
  const currentMonth = (new Date()).getMonth();
  const currentYear = (new Date()).getFullYear();

  const monthSchedulePath = `./database/schedule/${currentMonth}-${currentYear}.txt`;
  if (await fs.existsSync(monthSchedulePath)) {
    debug('This month schedule is already loaded');
    return;
  }

  try {
    debug('Load online tv calendar.');
    const response = await getCurrentMonthSchedule();
    await fs.ensureFile(monthSchedulePath);
    await fs.writeFile(monthSchedulePath, response);
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

