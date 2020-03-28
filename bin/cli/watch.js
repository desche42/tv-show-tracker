const inquirer = require('inquirer');
const chalk = require('chalk');
const config = require('config');
const fs = require('fs-extra');
const cp = require('child_process');

const database = require('../../src/database');


/**
 * Watch a downloaded tv show
 * @returns {Promise} that resolves when vlc is closed
 */
(async function watch () {

	const selectedEpisodePath = await _selectEpisode().then(ep => ep.path.split('/'))

	const fileName = selectedEpisodePath.pop();
	const filePath = selectedEpisodePath.join('/');

	return await _launchVlc(filePath, fileName);
})();

/**
 * Inquires for an episode and
 * @returns {show, episode, filePath, file}
 */
async function _selectEpisode () {
	const availableEpisodes = await getAvailableEpisodes();

	if(!availableEpisodes.length) {
		console.log(chalk.red('No episodes available'));
		return;
	}

	// select show
	const availableShows = [...new Set(availableEpisodes.map(e => e.show))];
	const {show} = await _promptSelectList('show', availableShows, 'Select a show to watch');

	const showEpisodes = availableEpisodes.filter(ep =>
		ep.show === show
	);

	// select episode
	const {episode} = await _promptSelectList(
		'episode',
		showEpisodes.map(ep => `Season ${ep.season} Episode ${ep.episode}`),
		'Select an episode to watch'
	);

	return showEpisodes.find(episodeData => {
		const [season, nEp] = episode.split(' ').map(Number).filter(Boolean);
		return episodeData.season === season && episodeData.episode === nEp;
	});
}

/**
 * Prompts the user to choose an item from a list
 * @param {String} name of the selected item
 * @param {Array} choices
 * @param {String} message
 */
function _promptSelectList(name, choices, message) {
	return inquirer.prompt([
		{
			name,
			type: 'list',
			message: chalk.green(message),
			choices
		}
	]);
}

function _launchVlc(filePath, file) {
	const vlc_process = cp.spawn(config.get('vlcCommand'), ['--fullscreen', '-vv', `${file}`], {
		cwd: filePath
	});

	return new Promise((resolve) => {
		_monitorProcess(vlc_process, resolve);
	});
}

/**
 * Checks process stderr for video finis
 * @param {Object} process
 * @param {Function} resolve
 * @returns {Boolean} true if video ended, false if vlc closed
 */
function _monitorProcess(process, resolve) {
	let result;
	process.stderr.on('data', data => {
		const isEnd = _checkVideoFinished(data.toString());

		if (isEnd) {
			process.kill();
			result = isEnd.isVideoFinished;
		}
	});

	process.on('close', () => {
		resolve(result);
	});
}

/**
 * Checks if video has finished
 * @param {String} dataStr
 */
function _checkVideoFinished(dataStr) {
	const options = [
		{
			value: 'main playlist debug: nothing to play',
			isVideoFinished: true
		},
		{
			value: 'main playlist debug: incoming request - stopping current input',
			isVideoFinished: false
		}
	];

	return options.find(option => dataStr.includes(option.value));
}


/**
* Returns an array of downloaded episodes
*/
async function getAvailableEpisodes () {
	const downloaded = database.episodes.getDownloaded();

	return downloaded.filter(episode => fs.existsSync(episode.path));
}
