const inquirer = require('inquirer');
const chalk = require('chalk');

const fs = require('fs-extra');
const { readdir } = require('fs').promises;

const config = require('config');
const cp = require('child_process');
const path = require('path');

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

	// select show
	const availableShows = [...new Set(availableEpisodes.map(e => e.episodeData.show))];
	const {show} = await _promptSelectList('show', availableShows, 'Select a show to watch');

	const showEpisodes = availableEpisodes.filter(ep => ep.episodeData.show === show);

	// select episode
	const {episode} = await _promptSelectList(
		'episode',
		showEpisodes.map(ep => `Season ${ep.episodeData.season} Episode ${ep.episodeData.episode}`),
		'Select an episode to watch'
	);

	return showEpisodes.find(ep => {
		const {episodeData} = ep;
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
	const vlc_process = cp.spawn('vlc', ['--fullscreen', '-vv', `${file}`], {
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
 * Reads a dir and filters hidden folders
 * @param {String} path
 */
async function _readDirFilterHidden(path) {
	const files = await fs.readdir(path);
	return files.filter(fileName => !fileName.startsWith('.'));
}

/**
 * Recursivelly gets files in dir
 * @param {String} dir
 */
async function getFiles(dir) {
	const dirents = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(dirents.map((dirent) => {
		const res = path.resolve(dir, dirent.name);
		return dirent.isDirectory() ? getFiles(res) : res;
	}));
	return Array.prototype.concat(...files);
}

/**
* Get all files in dir and subdirs
*/
async function getVideoFiles (dir) {
	const files = await getFiles(dir);
	const extensions = config.get('allowedVideoExtensions');
	return files.filter(f => extensions.some(extension => f.endsWith(extension)));
}

/**
* Returns an array of downloaded episodes
*/
async function getAvailableEpisodes () {
	let downloadPath = path.join(__dirname, '/../../', config.get('downloadPath'));
	const files = await getVideoFiles(downloadPath);
	const downloadedEpidoes = database.episodes.getDownloaded();

	return files.map(fileName => {
		const isDownloaded = downloadedEpidoes.find(ep => fileName.includes(ep.torrent.title));
		return isDownloaded
			? {episodeData: isDownloaded, path: fileName}
			: undefined;
	}).filter(Boolean);
}
