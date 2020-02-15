/**
 * Wrapper of torrent-stream for torrent download
 */
const DB = require('../database');
const downloadTorrent = require('./download');
const debug = require('debug')('tv-show-tracker: download ')

async function downloadTorrents(torrents) {
  const episodes = torrents
    .filter(episode => episode.torrent && episode.torrent.magnet && !episode.downloaded)

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
    debug(`force download on show ${ep.show} S${ep.season} E${ep.episode}`);
    DB.get('episodes').push(ep).write();
  } else {
    debug('forced fail, episode exists');
  }
}

module.exports = {
  downloadTorrents,
  forceAddEpisode
}
