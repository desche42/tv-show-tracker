/**
 * Wrapper of torrent-stream for torrent download
 */
const DB = require('../database');
const downloadTorrent = require('./download');
const output = require('../utils').output('download');
const config = require('config');

async function downloadTorrents(torrents) {
  const episodes = torrents
		.filter(episode => episode.torrent && episode.torrent.magnet && !episode.downloaded)
		.slice(0, config.get('simultaneousDownloadLimit'))

  await Promise.all(episodes.map(function (episode) {
    return downloadTorrent(episode);
  }));
}

/**
 * Adds episode with 0 date to force download
 * @param {Object} ep
 */
function forceAddEpisode(ep) {
  const {show, season, episode} = ep;

  ep.date = new Date(0);
  ep.downloaded = false;

  const isAlready = DB.get('episodes').find({show, season, episode}).value();


  if (!isAlready) {
    output(`force download on show ${ep.show} S${ep.season} E${ep.episode}`);
    DB.get('episodes').push(ep).write();
  } else {
    output('forced fail, episode exists');
  }
}

module.exports = {
  downloadTorrents,
  forceAddEpisode
}
