/**
 * Wrapper of torrent-stream for torrent download
 */
const DB = require('../database');
const downloadTorrent = require('./download');


async function downloadTorrents() {
  const episodes = DB.get('episodes')
    .filter(episode => episode.torrent && !episode.downloaded)
    .value();

  await Promise.all(episodes.map(function (episode) {
    return downloadTorrent(episode)
  }));
}






module.exports = {
  downloadTorrents
}
