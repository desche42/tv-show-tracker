const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

add();

/**
 * Add a show to track or a magnet to download
 */
async function add () {
	const choices = {
		"Magnet": _addMagnet,
		"Show": _addShow
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
async function _addMagnet () {
 console.error('not implemented')
}
