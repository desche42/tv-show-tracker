const commander = require('commander');
const config = require('config');
const database = require('../../src/database');
const findRemoveSync = require('find-remove');
const fs = require('fs-extra');
const output = require('../../src/utils').output('backup');
const path = require('path');
const rsync = require('rsync');

const program = new commander.Command();
program
	.option('-d, --destination <destination>', 'data backup directory')
	.option('-s, --scan', 'scan data backup directory for shows')
	.parseAsync(process.argv)

const LOCAL_DOWNLOAD_PATH = path.join(__dirname, '../../', config.get('downloadPath'));
const DATABASE_PATH = path.join(__dirname, '../../', config.get('databasePath'));
const LOCAL_CONFIG_PATH = path.join(__dirname, '../../', config.get('localConfigPath'));
const BACKUP_PATH = program.destination || config.get('backupPath');

(async () => {
	if (program.scan) {
		await scanBackup(BACKUP_PATH, config.get('downloadPath'));
	} else {
		await backup(BACKUP_PATH);
	}
})();

async function backup(backupPath) {
	_cleanUnwantedFiles();
	_startBackup(backupPath).then(() => {
		output('Backup complete');
	});
}

function _cleanUnwantedFiles() {
	output('Deleting local unwanted files');
	const result = findRemoveSync(LOCAL_DOWNLOAD_PATH, {
		extensions: ['.nfo', '.exe', '.txt']
	});
	output('Deleted %d files', Object.keys(result).length);
}

async function _startBackup(backupPath) {
	await [LOCAL_DOWNLOAD_PATH, DATABASE_PATH, LOCAL_CONFIG_PATH].reduce(async (acc, source) => {
		await acc;
		output(`Syncing ${source}`);
		return _backupDir(source, backupPath);
	}, Promise.resolve(''));
}

/**
 * Starts backup
 * @param {String} destinationPath
 */
function _backupDir(source, dest) {
	return new Promise((res) => {
		new rsync()
		.flags('azvh')
		.set('progress')
		.exclude('.DS_Store')
		// .include(getBackupPatterns())
		.source(source)
		.destination(dest)
		.output(parseOutput, parseOutput)
		.execute(() => res());
	})
}

function parseOutput(data) {
	data = data.toString();
	console.log(data);
}

/**
 * Doesnt work.. why??
 */
function getBackupPatterns() {
	const patterns = config.get('allowedVideoExtensions').map(extension =>
		`*.${extension}`
	);

	patterns.push(DATABASE_PATH);
	return patterns;
}

/**
 *
 *
 *
 *
 *
 *
 *
 */

 /**
 * Scans backup directory for shows and adds them to database
 */
 async function scanBackup (backupPath, downloadPath) {
	console.error('this can alter the database very badly. ask for prompt and do a backup first or comment this code.');
	// coment the line below at your own risk @todo
	return;

	backupPath += '/' + downloadPath.split('/').pop();
	const backupShows = await fs.readdir(backupPath).then(dir =>
		dir.filter(path => path !== '.DS_Store')
	);
	const found = backupShows.map(database.shows.ffilterFuzzyShow);

	for (let i = 0; i < backupShows.length; i++) {
		const showPath = [backupPath, backupShows[i]].join('/');
		const episodes = await searchEpisodes(showPath);

		const showName = found[i] || backupShows[i];


		for (let episode of episodes) {
			const [season, epNumber] = episode.match(/S(\d\d)E(\d\d)/).slice(1, 3).map(Number);
			const showData = {show: showName, episode: epNumber, season}
			const dbEpisode = database.episodes.find(showData);
			if (!dbEpisode) {
				database.episodes.push(showData);
			}
			database.episodes.setDownloaded(showData, `${found[i]}/${episode}`);
		}
	}
 }

 /**
 * Scans dir and looks for episodes
 */
 async function searchEpisodes (dirPath) {
	const episodes = await fs.readdir(dirPath).then(
		dirs => dirs
			.filter(episode => /^S[0-9]{2}E[0-9]{2}$/.test(episode))
	);

	const videoExtensions = config.get('allowedVideoExtensions');

	return episodes.reduce(async (acc, episodePath) => {
		acc = await acc;
		const videoFiles = await fs.readdir(`${dirPath}/${episodePath}`).then(files => files.filter(filename => {
			const extension = filename.split('.').pop();
			return videoExtensions.includes(extension)
		}));

		videoFiles.length && acc.push(...videoFiles.map(file => `${episodePath}/${file}`));
		return acc;
	}, Promise.resolve([]));
 }
