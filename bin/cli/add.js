const fs = require('fs-extra');
const path = require('path');

const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const chalk = require('chalk');
const episodeparser = require('episode-parser');
const database = require('../../src/database');
const output = require('../../src/utils').output('add');


add();

/**
 * Add a show to track or a magnet to download
 */
async function add () {
	const choices = {
		"Show": _addShow,
		"Magnet": _addMagnet
	};

	const {selected} = await inquirer.prompt([{
		name: 'selected',
		type: 'list',
		message: chalk.green('Select one option'),
		choices: Object.keys(choices)
	}]);

	await choices[selected]();
}

/**
* Adds a show to local config file
* @todo change to db insertion when module developed
*/
async function _addShow () {
	const localConfigPath = path.join(__dirname, '../../config/local.json');
	const localConfig = _getLocalConfig(localConfigPath);

	// infinite loop, always returns something
	const newShow = await _promptSelectShow();

	if (localConfig.selectedShows.includes(newShow)) {
		output('Show is already selected');
	} else {
		localConfig.selectedShows.push(newShow);
		await fs.writeJson(localConfigPath, localConfig, {spaces: 2});
		output('Show "%s" added to local config', newShow);
	}
}

/**
* Prompts for selecting an available show, or nee show
*/
async function _promptSelectShow () {
	const availableShows = database.shows.getAllShows().map(show => show.title);
	const {showName} = await inquirer.prompt([{
			type: 'autocomplete',
			name: 'showName',
			pageSize: 5,
			message: chalk.green('Select a show or enter a new one'),
			source: _searchShows(availableShows)
	}]);

	const {correct} = await inquirer.prompt([{
		name: 'correct',
		type: 'confirm',
		message: chalk.green(`Add ${showName} to selected shows?`)
	}]);

	return correct ? showName : _promptSelectShow();
}

/**
 * Currified function with available shows from database
 * Filters shows according to input
 * @param {Array} avilableShows
 */
const _searchShows = availableShows => async (answers, input) => {
	let shows = availableShows;

	if (input) {
		shows = fuzzy.filter(input, availableShows);
		shows = shows.length ? shows.map(el => el.original) : [input];
	}

	return shows;
}

/**
 * Gets local config or default
 * @param {String} localConfigPath
 */
function _getLocalConfig(localConfigPath) {
	const localConfig = {
		selectedShows: []
	};

	if (fs.existsSync(localConfigPath)) {
		Object.assign(localConfig, fs.readJSONSync(localConfigPath));
	}

	return localConfig;
}

/**
* Adds a magnet
*/
async function _addMagnet () {
	const {magnet} = await inquirer.prompt([{
		name: 'item',
		message: chalk.green(`Enter magnet:`)
	}]);

	const title = magnet.split('=')[2].replace('&tr', '');
	const parsed = episodeparser(title);

	const {correct} = await inquirer.prompt([{
		name: 'correct',
		type: 'confirm',
		message: chalk.green(`Is ${parsed.show} season ${parsed.season} episode ${parsed.episode} correct?`)
	}]);

	if (!correct) {
		return add();
	}

	// if is correct
	parsed.torrent = {magnet, title};
	parsed.show = parsed.show.toLowerCase();

	const exists = database.episodes.find(parsed);

	if (exists) {
		database.episodes.setTorrent(parsed, parsed.torrent);
		output('Torrent added to existing database episode');
	} else {
		database.episodes.push(parsed);
		output('New episode added to database');
	}
}
