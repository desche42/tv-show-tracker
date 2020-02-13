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
 * Gets schedule from an online TV Calendar
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

  return _parseDays(response);
}

/**
 * Extracts data from cheerio loaded html and returns result for each day
 * @param {CheerioObject} $ entry point for manipulating the page
 */
function _parseDays ($) {
  const daysHTML = $('div.day,div.today');

  const parsedDays = {};

  // parse each day and return schedule object
  daysHTML.each((i, day) => {
    const date = $('strong a', day).attr('href').split('/').pop();
    const episodeList = $('div.ep', day);

    parsedDays[date] = _parseEpisodesList(episodeList, $);
  });

  return parsedDays;
}

/**
 * Extracts data from each episode
 * @param {Cheerio Context} episodeList
 * @param {*} $
 */
function _parseEpisodesList(episodeList, $) {
  // return episodeList;

  return 'hello'

}
