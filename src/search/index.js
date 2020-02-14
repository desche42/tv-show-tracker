/**
* Search torrents from available episodes in selected shows
 */
const debug = require('debug')('tv-show-tracker: search');
const DB = require('../database');

// Configure torrent search
// more info about providers using await torrentSearch.getActiveProviders();
const torrentSearch = require('torrent-search-api');
torrentSearch.enablePublicProviders();



/**
 * API
 *
 * Searches torrents of all given episodes
 * @param {Array} episodes to search
 * @returns search results
 */
module.exports = async function searchEpisodes(episodes) {
  if(episodes.length) {
    debug('Searching torrentless episodes');
    episodes = episodes.filter(episode => !episode.torrent);
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
  const {showTitle, season: s, episode: e} = episode;
  const episodeId = `${showTitle} season ${s} episode ${e}`;
  const limit = 100;


  debug(`Searching ${episodeId}...`);
  const torrents = await torrentSearch.search(showTitle, 'All', limit);
  const showRegex = new RegExp(`.*(s0?${s}e0?${e}).*`, 'gi');
  const filteredTorrents = torrents.filter(torrent => showRegex.test(torrent.title));


  debug(`${filteredTorrents.length} torrents found for ${episodeId}...`);

  if(filteredTorrents.length) {
    const selectedTorrent = _getHighestSize(filteredTorrents);

    DB.get('episodes').find({
      showTitle, season: s, episode: e
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

