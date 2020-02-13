/**
 * Get shcedule from online tv calendar
 */
'use strict';

const cheerio = require('cheerio');
const rp = require('request-promise-native');

const fs = require('fs');
/**
 * CURRENT MONTH SHCEDULE URL
 */
const SCHEDULE_URL = 'https://www.pogdesign.co.uk/cat/';

/**
 * Gets and parses schedule
 */
module.exports = async function getSchedule () {

  // const response = await rp({
  //     uri: SCHEDULE_URL,
  //     transform: function (body) {
  //         return cheerio.load(body);
  //     }
  // });

  const response = cheerio.load(
    JSON.parse(fs.readFileSync('./data/schedule-raw.txt'))
  );

  return getRawData(response);
}

/**
 * Extracts data from cheerio loaded html
 * @param {CheerioObject} $
 */
function getRawData ($) {
  const days = $('div.day,div.today');

  console.log(days)

  fs.writeFileSync(
    './data/schedule.json',
    days
  )
}
