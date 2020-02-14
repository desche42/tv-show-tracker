const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

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
  // schedules
  // @todo save crawled schedules to keep track
  schedules: []
}).write();


/**
 * Some functionallity
 */
db._.mixin({
});

module.exports = db;
