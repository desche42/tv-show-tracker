const inquirer = require('inquirer');
const chalk = require('chalk');
const DB = require('../database');
const fs = require('fs-extra');
const config = require('config');
const cp = require('child_process');
const path = require('path');
const episodeParser = require('episode-parser');

/**
 * Watch a downloaded tv show
 */
module.exports = async function watch () {
	let downloadPath = path.join(__dirname, '/../../', config.get('downloadPath'));
	let episodes = await _getCompleteDownloads(downloadPath);

	console.log(episodes)

	// // select show
	// const availableShows = await fs.readdir(filePath);
	// const {show} = await _promptSelectList('show', availableShows, 'Select a show to watch');

	// // select episode
	// filePath += `/${show}`;
	// const availableEpisodes = await fs.readdir(filePath);


	// const {episode} = await _promptSelectList('episode', availableEpisodes, 'Select an episode to watch');

	// filePath += `/${episode}`;

	// const [file] = await fs.readdir(filePath);

	// filePath += `/${file}`;

	// console.log(filePath);

	// const child = cp.exec(`vlc "${filePath}"`);

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

/**
 * Returns an array of
 */
async function _getCompleteDownloads (downloadPath) {
	const files = await _recReadDir(downloadPath);
	const videoFiles = files.filter(name => {
		const extension = name.split('.').pop();
		return config.get('allowedVideoExtensions').includes(extension)
	});
	const parsedEpisodes = videoFiles.map(path => {
		let filename = path.split('/').pop();
		let episode = episodeParser(filename);
		episode.path = path;
		return episode;
	});

	const completedDownloads = parsedEpisodes.filter(parsedEpisode => {
		const {show, season, episode} = parsedEpisode;
		return DB.get('episodes').find({
			show, season, episode,
			downloaded: true
		});
	});

	return completedDownloads;
}

/**
 * Recursively reads all directories in path and
 * returns all files
 * @param {String} path
 */
async function _recReadDir(path) {
	const read = await fs.readdir(path);

	const fileList = await read.reduce(async (acc, act) => {
		acc = await acc;

		const actPath = `${path}/${act}`;

		if (fs.statSync(actPath).isDirectory()) {
			const result =  await _recReadDir(actPath);
			acc.push(...result);
		} else {
			acc.push(actPath);
		}
		return acc;
	}, Promise.resolve([]));
	return fileList;
}


