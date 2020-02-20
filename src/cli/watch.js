const inquirer = require('inquirer');
const chalk = require('chalk');
const DB = require('../database');
const fs = require('fs-extra');
const config = require('config');
const cp = require('child_process');
const path = require('path');

/**
 * Watch a downloaded tv show
 * @returns {Promise} that resolves when vlc is closed
 */
module.exports = async function watch () {

	const {show, episode, filePath, fileName} = await _selectEpisode();

	return await _launchVlc(filePath, fileName);
}

/**
 * Inquires for an episode and
 * @returns {show, episode, filePath, file}
 */
async function _selectEpisode () {
	let downloadPath = path.join(__dirname, '/../../', config.get('downloadPath'));
	const availableShows = await fs.readdir(downloadPath);

	// select show
	const {show} = await _promptSelectList('show', availableShows, 'Select a show to watch');
	let filePath = `${downloadPath}/${show}`;

	// select episode
	const availableEpisodes = await fs.readdir(filePath);
	const {episode} = await _promptSelectList('episode', availableEpisodes, 'Select an episode to watch');

	filePath += `/${episode}`;

	// filter by extension?
	// @todo
	const [fileName] = await fs.readdir(filePath);

	return { show, episode, filePath, fileName };
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

	return new Promise((resolve, rej) => {
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

	process.on('close', code => {
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
