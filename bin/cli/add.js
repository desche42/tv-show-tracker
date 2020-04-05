const fs = require('fs-extra');
const path = require('path');
const config = require('config');

const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const chalk = require('chalk');
const episodeparser = require('episode-parser');
const database = require('../../src/database');
const output = require('../../src/utils').output('add');

const AVAILABLE_SHOWS = database.shows.getAllShowNames();

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
	const localConfigPath = path.join(__dirname, `../../${config.get('localConfigPath')}`);
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

	if (!database.shows.find(newShow)) {
		output('Adding show to database');
		database.shows.push(newShow);
	}
}

/**
* Prompts for selecting an available show, or nee show
*/
async function _promptSelectShow () {
	const {showName} = await inquirer.prompt([{
			type: 'autocomplete',
			name: 'showName',
			pageSize: 5,
			message: chalk.green('Select a show or enter a new one'),
			source: _searchShows
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
async function _searchShows (answers, input) {
	let shows = AVAILABLE_SHOWS || [];

	if (input) {
		shows = fuzzy.filter(input, AVAILABLE_SHOWS);
		shows = [...shows.map(el => el && el.original || el)];
		!shows.includes(input) && shows.unshift(input);
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
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */




/**
* Adds a magnet
*/
async function _addMagnet () {
	const {magnet} = await inquirer.prompt([{
		name: 'magnet',
		message: chalk.green(`Enter magnet:`)
	}]);

	let title = _getMagnetTitle(magnet);

	if (!title) {
		output(`Magnet doesn't have a display name`);
		return;
	}

	const parsed = await _confirmParsedMagnet(title, magnet);
	if (parsed) {
		parsed.forceDownload = true;
		_addEpisodeToDatabase(parsed);
	} else {
		await add();
	}
}

/**
 * Adds episode to database
 * @param {Object} parsed
 */
function _addEpisodeToDatabase(parsed) {
	const exists = database.episodes.find(parsed);
	if (exists) {
		database.episodes.setTorrent(parsed, parsed.torrent);
		output('Torrent added to existing database episode');
	} else {
		database.episodes.push(parsed);
		output('New episode added to database');
	}
}

/**
 * Extracts title from magnet
 * @param {String} magnet
 */
function _getMagnetTitle(magnet) {
	let title = (/.*magnet:\?xt=urn.*&dn=([^&]*)&.*/i.exec(magnet) || [])[1] || '';
	return title.toLowerCase().replace(/season[.\s]/, 's').replace(/\+/g, '.');
}

/**
 * Parses torrent data and propmts for confirmation
 * @param {Strineg} title
 * @param {String} magnet
 */
async function _confirmParsedMagnet(title, magnet) {
	const parsed = episodeparser(title) || {};

	parsed.torrent = {magnet, title};
	parsed.show = getShowName(parsed.show);

	const {correct} = await inquirer.prompt([{
		name: 'correct',
		type: 'confirm',
		message: chalk.green(`Is ${parsed.show} season ${parsed.season} episode ${parsed.episode ||  parsed.name} correct?`)
	}]);

	return correct ? parsed : correct;
}

/**
 * Looks in database for the show, and if found,
 * returns that name. Avoids show duplication
 * @example legends of tomorrow // dcs legends of tomorrow
 * @param {String} showName
 */
function getShowName (showName) {
	const found = database.shows.ffilterFuzzyShow(showName);
	return found ? found.original : showName;
}
