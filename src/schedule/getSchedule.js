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

  return _parseData(response);
}

/**
 * Extracts data from cheerio loaded html
 * @param {CheerioObject} $ entry point for manipulating the page
 */
function _parseData ($) {
  const daysHTML = $('div.day,div.today');

  // get available days in curren month
  const availableDays = Object.keys(daysHTML).filter(str => /^\d*$/.test(str));

  // parse each day and return schedule object
  return availableDays.reduce((acc, nDay) => {
    const day = daysHTML[nDay];

    const date = $('strong a', day).attr('href').split('/').pop();

    acc[date] = date;

    return acc;
  }, {});
}
