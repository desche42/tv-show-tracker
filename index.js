/**
 * Entry point of the library
 */

const schedule = require('./src/schedule');
const search = require('./src/search');
const debug = require('debug')('tv-show-tracker:');
const download = require('./src/download');
const config = require('config');

/**
 * Update schedule and search available torrents for downloading.
 */
async function start(updateCalendar = true) {
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
			debug('Starting search...');
			actions.push(search(newEpisodes));
		}

		if (magnets.length) {
			debug('Starting download...');
			actions.push(download.downloadTorrents(magnets));
		} else {
			debug('No new mangnets available to download.');
		}

		await Promise.all(actions);

		if (config.get('restart') && (newEpisodes.length)) {
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


start();
