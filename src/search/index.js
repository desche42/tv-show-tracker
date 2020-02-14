/**
 * Search torrents from available episodes in selected shows
 */
const fs = require('fs-extra');
const debug = require('debug')('torrent-auto-downloader: searchTorrent');
const DB = require('../database');

/**
 * Configure torrent search
 */
const torrentSearch = require('torrent-search-api');
// more info about providers using await torrentSearch.getActiveProviders();
torrentSearch.enablePublicProviders();

/**
 * Searches torrent with given params and chooses the biggest found
 * @todo Torrent selection rules
 * @param {Object} episode
 * @returns episode with search result
 */
async function _searchEpisode(episode) {
  const {showTitle, season: s, episode: e} = episode;
  const episodeId = `${showTitle} season ${s} episode ${e}`;


  debug(`Searching ${episodeId}...`);
  // const torrents = await torrentSearch.search(showTitle, 'All', limit);
  const torrents = JSON.parse(fs.readFileSync('./src/search/torrents.json'));
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


/**
 *
  * Searches torrents of all given episodes
  * @param {Array} episodes to search
  * @returns search results
  */
async function searchEpisodes(episodes) {
  debug('Searching torrentless episodes');
  episodes = episodes.filter(episode => !episode.torrent);

  await Promise.all(episodes.map(_searchEpisode));
}

module.exports = {
  searchEpisodes
}
