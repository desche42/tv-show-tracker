const getEpisodes = require('./getEpisodes');
const saveData = require('./saveData');
const debug = require('debug')('schedule');

/**
 * Get, parse and set schedule
 */
async function update () {
  try {
    debug('Getting episodes...');
    const episodes = await getEpisodes();

    debug('Saving data');
    await saveData(episodes);
    debug('Data saved');
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  update
}
