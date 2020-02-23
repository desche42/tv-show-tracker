/**
 * Wrapper of torrent-stream for torrent download
 */
const path = require('path');
const downloadTorrent = require(path.join(__dirname, 'download'));
const config = require('config');

async function downloadTorrents(torrents) {
  const episodes = torrents
		.filter(episode => episode.torrent && episode.torrent.magnet && !episode.downloaded)
		.slice(0, config.get('simultaneousDownloadLimit'))

  await Promise.all(episodes.map(function (episode) {
    return downloadTorrent(episode);
  }));
}

module.exports = {
  downloadTorrents
}
