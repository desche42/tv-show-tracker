const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
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

	const {item} = await inquirer.prompt([{
		name: 'item',
		message: chalk.green(`Enter ${selected}`)
	}]);

	await choices[selected](item);
}

/**
* Adds a show to local config file
* @todo change to db insertion when module developed
*/
async function _addShow (name) {
	const localConfig = {
		selectedShows: []
	};

	const localConfigPath = path.join(__dirname, '../../config/local.json');

	if (fs.existsSync(localConfigPath)) {
		Object.assign(localConfig, fs.readJSONSync(localConfigPath));
	}

	localConfig.selectedShows.push(name);

	await fs.writeJson(localConfigPath, localConfig, {spaces: 2});
}

/**
* Adds a magnet
*/
async function _addMagnet (magnet) {
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
