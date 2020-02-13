const getEpisodes = require('./getEpisodes');
const saveData = require('./saveData');
const debug = require('debug')('SCHEDULE:')

/**
 * Get, parse and set schedule
 */
async function schedule () {
  try {
    debug('Getting episodes...');
    const episodes = await getEpisodes();

    debug('Saving data');
    await saveData(episodes);

    debug('Data saved');
  } catch (err) {
    console.error('UOOOPS, COULDN\'T UPDATE SCHEDULE');
    console.error(err);
  }
}

schedule();
