const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs-extra');
const config = require('config');
const path = require('path');

// submodules
const episodes = require('./episodes');



const DATABASE_PATH = path.join(__dirname, '../../', config.get('databasePath'));
fs.ensureFileSync(DATABASE_PATH);

const adapter = new FileSync(DATABASE_PATH);

const rawDb = low(adapter);

/**
 * Database default structure
 */
rawDb.defaults({
  // array of tv shows { title: string , selected: bool}
  shows: [],
  // episodes
  episodes: [],
  schedules: []
}).write();

module.exports = {
	rawDb,
	episodes: episodes(rawDb)
};
