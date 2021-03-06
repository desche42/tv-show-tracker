const path = require('path');
const getMonthSchedule = require(path.join(__dirname, 'schedule'));
const output = require('../utils').output('schedule');
const {rawDb} = require('../database');
const config = require('config');


module.exports = {
  update,
  getAvailableEpisodes
}

/**
 * Get, parse and set schedule
 */
async function update (month, year) {
  month = month || ((new Date()).getMonth() + 1);
  year = year || (new Date()).getFullYear();

  const date = `${month}-${year}`;

  const monthSchedule = rawDb.get('schedules')
    .find(schedule => schedule === date)
    .value();

  if (monthSchedule) {
    output('This month schedule is already loaded in db');
    return;
  }

  try {
    output('Load online tv calendar.');
    await getMonthSchedule(month, year);
    rawDb.get('schedules').push(date).write();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Gets episodes of selected shows which date is
 * before today.
 */
async function getAvailableEpisodes() {
	const selectedShows = config.get('selectedShows');

  if (!selectedShows.length) {
    throw 'No shows selected, please add at least one in your config/local.js file.';
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
  return shows.reduce((acc, show) => {
    let episodes = rawDb.get('episodes')
      .filter({
        show
			}).value();

		if(config.get('downloadLastSeasonOnly')) {
			const lastSeasonAvailable = Math.max(...episodes.map(episode => episode.season));
			episodes = episodes.filter(episode => episode.season === lastSeasonAvailable);
		}

		episodes = episodes.filter(episode => !episode.downloaded);

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
    (+new Date(episode.date) + 1000*60*60*(config.get('searchAfterNHours') || 0)) < now
  );
}

