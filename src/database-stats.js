/**
 * Log some database stats
 */
const DB = require('./database');
const debug = require('debug')('tv-show-tracker: database stats');
const fs = require('fs-extra');

const episodes = DB.get('episodes').value();
const shows = DB.get('shows').value();

/**
 * Checks discrepancies among episodes and shows collections
 * // 0 unmatched at this commit
 */
function checkUnmatchedShows() {
  const result = episodes.map(episode => {
    return !!shows.find(show => episode.show === show.title);
  });

  const nMatch = result.filter(Boolean).length;
  const unmatched = result.length - nMatch;

  return `${nMatch} matched, ${unmatched} unmatched`;
}

debug(
  // checkUnmatchedShows()
)

function setLocalSchedules() {
  DB.set('schedules', fs.readdirSync('./database/schedule')
  .filter(str => /.*.txt/.test(str))
  .map(str => str.replace('.txt', ''))
  ).write();

}


debug(`${shows.length} shows, ${episodes.length} episodes`);
