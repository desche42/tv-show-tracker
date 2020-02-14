const getEpisodes = require('./getEpisodes');
const saveData = require('./saveData');
const debug = require('debug')('schedule');
const DB = require('../database');

/**
 * Get, parse and set schedule
 */
async function update () {
  try {
    // @todo do not save data if old schedule
    // for now ill comment this lines

    // debug('Getting episodes...');
    // const episodes = await getEpisodes();

    // debug('Saving data');
    // await saveData(episodes);
    // debug('Data saved');

  } catch (err) {
    console.error(err);
  }
}

/**
 * Gets episodes of selected shows which date is
 * before today.
 */
async function getAvailableEpisodes() {
  const selectedShows = DB.get('shows').find({selected: true}).value();

  if (!selectedShows) {
    throw 'No shows selected, please select at least one in file database/db.json';
  }

  
}

module.exports = {
  update,
  getAvailableEpisodes
}
