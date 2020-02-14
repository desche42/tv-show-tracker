/**
 * Get shcedule from online tv calendar
 */
'use strict';

const cheerio = require('cheerio');
const rp = require('request-promise-native');
const saveData = require('./saveData');

/**
 * CURRENT MONTH SHCEDULE URL
 */

const SCHEDULE_URL = 'https://www.pogdesign.co.uk/cat';

/**
 * Gets schedule from an online TV Calendar
 * and sets episodes into DB
 */
module.exports = async function getMonthSchedule (month, year) {
  const response = await rp({
      uri: `${SCHEDULE_URL}/${month}-${year}`,
      transform: function (body) {
          return cheerio.load(body);
      }
  });

  await saveData(_parseDays(response));

  return response.html();
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
    const dateStr = $('strong a', day).attr('href').split('/').pop();

    $('div.ep', day).each((i, episode) => {
      const parsedEpisode = Object.assign(
        _parseEpisode(selector => $(selector, episode)),
        { date: formatDate(dateStr) }
      );

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
    season: Number(season),
    episode: Number(episode)
  };
}

/**
 * Converts date string to js date object
 * @param {String} date DD-MM-YYYY
 * @returns {Date}
 */
function formatDate(datestr) {
  const [day, month, year] = datestr.split('-');
  return new Date([month, day, year].join('-'));
}
