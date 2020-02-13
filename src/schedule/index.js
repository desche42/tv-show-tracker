const getSchedule = require('./getSchedule');

/**
 * Get, parse and set schedule
 */
async function schedule () {
  try {
    const data = await getSchedule();
    console.log(data);
  } catch (err) {
    console.error('UOOOPS, COULDN\'T UPDATE SCHEDULE');
    console.error(err);
  }
}

schedule();
