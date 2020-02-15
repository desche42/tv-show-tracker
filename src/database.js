const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs-extra');

const DATABASE_PATH = './database/db.json';
fs.ensureFileSync(DATABASE_PATH);

const adapter = new FileSync('./database/db.json');

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
