const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs-extra');
const config = require('config');


const DATABASE_PATH = config.get('databasePath');
fs.ensureFileSync(DATABASE_PATH);

const adapter = new FileSync(DATABASE_PATH);

const db = low(adapter);

/**
 * Database default structure
 */
db.defaults({
  // array of tv shows { title: string , selected: bool}
  shows: [],
  // episodes
  episodes: [],
  schedules: []
}).write();

module.exports = db;
