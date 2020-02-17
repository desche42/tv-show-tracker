const inquirer = require('inquirer');
const chalk = require('chalk');
const DB = require('../database');
const fs = require('fs-extra');
const config = require('config');

/**
 * Watch a downloaded tv show
 */
module.exports = async function watch () {
	const path = [config.get('downloadPath')];

	const availableShows = await fs.readdir(path.join(''));

	const {show} = await _promptSelectList('show', availableShows, 'Select a show to watch');
	path.push(show);

	const availableEpisodes = await fs.readdir(path.join('/'));
	const {episode} = await _promptSelectList('episode', availableEpisodes, 'Select an episode to watch');
	path.push(episode);

	const [file] = await fs.readdir(path.join('/'));
	path.push(file);

	console.log(path.join('/'));


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


