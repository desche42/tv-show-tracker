const getMonthSchedule = require('./schedule');
const debug = require('debug')('tv-show-tracker: schedule');
const DB = require('../database');


module.exports = {
  update,
  getAvailableEpisodes
}

/**
 * Get, parse and set schedule
 */
async function update (month, year) {
  month = month || (new Date()).getMonth();
  year = year || (new Date()).getFullYear();

  const date = `${month}-${year}`;

  const monthSchedule = DB.get('schedules')
    .find(schedule => schedule.date === date)
    .value();

  if (monthSchedule) {
    debug('This month schedule is already loaded in db');
    return;
  }

  try {
    debug('Load online tv calendar.');
    const response = await getMonthSchedule(month, year);
    DB.get('schedules').push({
      date
    }).write();
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

	const episodes = _filterFutureEpisodes(
		_getNotDownloaded(selectedShows)
	);

	return {
		magnets: episodes.filter(ep => ep.torrent && ep.torrent.magnet),
		newEpisodes: episodes.filter(ep => !ep.torrent)
	}

}

/**
 * @param {Array} shows [{title}]
 * @returns Array of not downloaded episodes
 * of selected shows
 */
function _getNotDownloaded(shows) {
  return shows.reduce((acc, actual) => {
    const show = actual.title;
    const episodes = DB.get('episodes')
      .filter({
        show,
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

