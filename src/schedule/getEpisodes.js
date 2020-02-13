/**
 * Get shcedule from online tv calendar
 */
'use strict';

const cheerio = require('cheerio');
const rp = require('request-promise-native');

const fs = require('fs-extra');
/**
 * CURRENT MONTH SHCEDULE URL
 */

const SCHEDULE_URL = 'https://www.pogdesign.co.uk/cat/';
/**
 * Gets schedule from an online TV Calendar
 */
module.exports = async function getEpisodes () {

  // const response = await rp({
  //     uri: SCHEDULE_URL,
  //     transform: function (body) {
  //         return cheerio.load(body);
  //     }
  // });

  // debug
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

  const episodeList = [];

  // parse each day and return schedule object
  daysHTML.each((i, day) => {
    const date = $('strong a', day).attr('href').split('/').pop();

    $('div.ep', day).each((i, episode) => {
      const parsedEpisode = _parseEpisode(selector => $(selector, episode))
      parsedEpisode.date = date;
      episodeList.push(parsedEpisode);
    });
  });

  return episodeList;
}

/**
 * Extracts data from each episode
 *  Show title
 * @param {$} episode cheerio context
 * @param {*} $
 */
function _parseEpisode($) {
  const showTitle = $('p a:nth-child(1)').text().trim();

  const [
    inputText,
    season,
    episode,
    ...rest
  ] = $('p a:nth-child(2)').text().match(/s(\d*)e(\d*)/);

  return {
    showTitle,
    season,
    episode
  };
}
