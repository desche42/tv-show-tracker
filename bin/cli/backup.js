const commander = require('commander');
const fs = require('fs-extra');
const config = require('config');
const path = require('path');
const rsync = require('rsync');
const output = require('../../src/utils').output('backup');


const program = new commander.Command();
program
	.option('-d, --destination <destination>', 'data backup directory')
	.parseAsync(process.argv)

// check if destination directory exists
const dirExists = fs.existsSync(program.destination);

if (!dirExists) {
	output('Directory does not exist');
} else {
	_startBackup();
}

function _startBackup() {
	['downloadPath', 'databasePath'].reduce(async (acc, act) => {
		await acc;
		const source = path.join(__dirname, '../../', config.get(act));
		output(`Syncing ${source}`);
		return _backupDir(source, program.destination);
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

