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
    const episodeList = [];

    $('div.ep', day).each((i, episode) => {
      episodeList.push(_parseEpisode(selector => $(selector, episode)));
    });

    parsedDays[date] = episodeList;
  });

  return parsedDays;
}

/**
 * Extracts data from each episode
 * @param {$} episode cheerio context
 * @param {*} $
 */
function _parseEpisode($) {
  const title = $('p a:nth-child(1)').text().trim();




  return title;
}
