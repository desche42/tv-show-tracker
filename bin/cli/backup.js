const commander = require('commander');
const fs = require('fs-extra');
const config = require('config');
const path = require('path');
const rsync = require('rsync');
const output = require('../../src/utils').output('backup');
const findRemoveSync = require('find-remove');

const program = new commander.Command();
program
	.option('-d, --destination <destination>', 'data backup directory')
	.parseAsync(process.argv)

const downloadPath = path.join(__dirname, '../../', config.get('downloadPath'));
const databasePath = path.join(__dirname, '../../', config.get('databasePath'));
const localConfig = path.join(__dirname, '../../', 'config/local.json');

// check if destination directory exists
const destination = program.destination || config.get('backupPath');
const dirExists = fs.existsSync(destination);

if (!dirExists) {
	output('Directory %s does not exist', destination);
} else {
	_cleanUnwantedFiles();
	_startBackup().then(() => {
		output('Backup complete');
	});
}

function _cleanUnwantedFiles() {
	output('Deleting local unwanted files');
	const result = findRemoveSync(downloadPath, {
		extensions: ['.nfo', '.exe', '.txt']
	});
	output('Deleted %d files', Object.keys(result).length);
}

async function _startBackup() {
	await [downloadPath, databasePath, localConfig].reduce(async (acc, source) => {
		await acc;
		output(`Syncing ${source}`);
		return _backupDir(source, destination);
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

	patterns.push(`${config.get('databasePath')}`);
	return patterns;
}

