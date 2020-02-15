/**
* Search torrents from available episodes in selected shows
 */
const debug = require('debug')('tv-show-tracker: search');
const DB = require('../database');
const config = require('config')

// Configure torrent search
// more info about providers using await torrentSearch.getActiveProviders();
const torrentSearch = require('torrent-search-api');
torrentSearch.enablePublicProviders();

torrentSearch.disableProvider("torrentz2");


/**
 * API
 *
 * Searches torrents of all given episodes
 * @param {Array} episodes to search
 * @returns search results
 */
module.exports = async function searchEpisodes(episodes) {
  episodes = episodes
    .filter(episode => !episode.torrent)
    .sort((a, b) => (a.searchAttempts || 0) - (b.searchAttempts || 0))
    .slice(0, config.get('simultaneousSearchLimit'));

  if(episodes.length) {
    debug(`Searching ${episodes.length} torrentless episodes`);

    await Promise.all(episodes.map(_searchEpisode));
  } else {
    debug('No new episodes to search');
  }
}





/**
 * Searches torrent with given params and chooses the biggest found
 * @todo Torrent selection rules
 * @param {Object} episode
 * @returns episode with search result
 */
async function _searchEpisode(episode) {
  const {show, season: s, episode: e, searchAttempts} = episode;
  const episodeId = `${show} season ${s} episode ${e}`;
  const limit = 100;

  debug(`Searching ${episodeId}...`);

  DB.get('episodes').find({
    show, season: s, episode: e
  }).set('searchAttempts', (searchAttempts || 0) + 1).write();

  const torrents = await torrentSearch.search(show, 'All', limit);

  // @toDo  add parse show names module to avoid bad show match
  const showRegex = new RegExp(`.*(s0?${s}e0?${e}).*`, 'gi');
  const filteredTorrents = torrents.filter(torrent =>
    showRegex.test(torrent.title) && torrent.magnet
  );


  debug(`${filteredTorrents.length} torrents found for ${episodeId}...`);

  if(filteredTorrents.length) {
    const selectedTorrent = _getHighestSize(filteredTorrents);

    DB.get('episodes').find({
      show, season: s, episode: e
    }).set('torrent', selectedTorrent).write();
  }
}


/**
 * Returns torrent with highest size
 * @param {Array} torrents
 */
function _getHighestSize(torrents) {
  return torrents.reduce((prev, act) =>
    _parseSize(prev) > _parseSize(act) ? prev : act
  );
}




/**
 * @param {String} size 1.4 Gib | 333 MB | ....
 * @return number of MB
 */
function _parseSize(size) {
  const isGbRegEx = /Gi?B/;
  const isMbRegEx = /Mi?B/;

  if (isGbRegEx.test(size)) {
    return size.split(isGbRegEx)[0] * 1024;
  } else if (isMbRegEx.test(size)) {
    return Number(size.split(isMbRegEx)[0]);
  } else return size;
}

