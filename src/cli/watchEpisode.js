const inquirer = require('inquirer');
const chalk = require('chalk');
const DB = require('../database');
const fs = require('fs-extra');
const config = require('config');
const cp = require('child_process');
const path = require('path');

/**
 * Watch a downloaded tv show
 */
module.exports = async function watch () {
	let filePath = path.join(__dirname, '/../../', config.get('downloadPath'));

	const availableShows = await fs.readdir(filePath);

	const {show} = await _promptSelectList('show', availableShows, 'Select a show to watch');

	filePath += `/${show}`;

	const availableEpisodes = await fs.readdir(filePath);
	const {episode} = await _promptSelectList('episode', availableEpisodes, 'Select an episode to watch');

	filePath += `/${episode}`;

	const [file] = await fs.readdir(filePath);

	filePath += `/${file}`;

	console.log(filePath);

	const child = cp.exec(`vlc "${filePath}"`);


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


