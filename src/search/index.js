/**
 * Search torrents from available episodes in selected shows
 */
const fs = require('fs-extra');
const debug = require('debug')('searchTorrent');

/**
 * Configure torrent search
 */
const torrentSearch = require('torrent-search-api');
// more info about providers using await torrentSearch.getActiveProviders();
torrentSearch.enablePublicProviders();

/**
 * Searches torrents with given params and chooses the biggest found
 * @todo Torrent selection rules
 * @param {String} show name
 * @param {String} season
 * @param {String} episode
 */
async function searchTorrent(show, season, episode) {
  const limit = 20;

  debug(`Searching ${show}...`);
  // const torrents = await torrentSearch.search(show, 'All', limit);
  const torrents = JSON.parse(fs.readFileSync('./src/search/torrents.json'));

  const showRegex = new RegExp(`.*(s0?${season}e0?${episode}).*`, 'gi');

  const filteredTorrents = torrents.filter(torrent => showRegex.test(torrent.title));

  if(filteredTorrents.length) {
    debug(`${filteredTorrents.length} torrents found. Choosing highest.`);

    // @todo database module
    const showPath = `./data/selectedShows/${show}.json`;
    const showData = JSON.parse(await fs.readFile(showPath));

    showData[season][episode].torrents = filteredTorrents.sort(
      (a,b) => parseSize(a.size) - parseSize(b.size)
    );

    await fs.writeJson(showPath, showData, {spaces: 2});
  }
}

function parseSize(size) {
  const isGbRegEx = /Gi?B/;
  const isMbRegEx = /Mi?B/;

  if (isGbRegEx.test(size)) {
    return size.split(isGbRegEx)[0] * 1024;
  } else if (isMbRegEx.test(size)) {
    return Number(size.split(isMbRegEx)[0]);
  } else return size;
}

searchTorrent('Doctor Who', '12', '06');
