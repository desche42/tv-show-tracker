/**
 * Entry point of the library
 */
const schedule = require('../schedule');
const search = require('../search');
const download = require('../download');
const config = require('config');

const debug = require('debug')('tv-show-tracker:');
/**
 * Update schedule and search available torrents for downloading.
 */
module.exports = async function start(updateCalendar = true) {
	try {
		if (config.get('updateCalendar') && updateCalendar) {
			await schedule.update();
		}

		const {
			magnets,
			newEpisodes
		} = await schedule.getAvailableEpisodes();

		const actions = [];

		if (newEpisodes.length) {
			debug(`${newEpisodes.length} new episodes. Starting search...`);
			actions.push(search(newEpisodes));
		} else {
			debug('No new released episodes...');
		}

		if (magnets.length) {
			let simpleOutput = [...new Set(magnets.map(mag => mag.show))].reduce((acc, show) => {
				acc[show] = magnets.filter(ep => ep.show === show).map(ep => `S${ep.season}E${ep.episode}`);
				return acc;
			}, {});

			debug(`${magnets.length} episodes ready. Starting download... %O`, simpleOutput);
			actions.push(download.downloadTorrents(magnets));
		}

		await Promise.all(actions);

		if (config.get('restart') && newEpisodes.length) {
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
	setTimeout(() => start(false), 500);
}
