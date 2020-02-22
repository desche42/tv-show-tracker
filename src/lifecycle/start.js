/**
 * Entry point of the library
 */
const schedule = require('../schedule');
const search = require('../search');
const download = require('../download');
const config = require('config');

const output = require('../utils').output('');
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
			output(`${newEpisodes.length} new episodes. Starting search...`);
			actions.push(search(newEpisodes));
		} else {
			output('No new released episodes...');
		}

		if (magnets.length) {
			let simpleOutput = [...new Set(magnets.map(mag => mag.show))].reduce((acc, show) => {
				acc[show] = magnets.filter(ep => ep.show === show).map(ep => `S${ep.season}E${ep.episode}`);
				return acc;
			}, {});

			output(`${magnets.length} episodes ready. Starting download... %O`, simpleOutput);
			actions.push(download.downloadTorrents(magnets));
		}

		await Promise.all(actions);

		if (config.get('restart') && newEpisodes.length) {
			restart();
		} else {
			output('Finished.');
		}
	} catch (err) {
		output(err);
	}
}

function restart () {
	output('Restarting...');
	setTimeout(() => start(false), 500);
}

module.exports = start;
