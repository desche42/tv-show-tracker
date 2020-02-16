/**
 * Downloads available magnets in selected shows
 */
const debug = require('debug')('tv-show-tracker: download:');

// torrent-search-api download not working
const torrentStream = require('torrent-stream');
const DB = require('../database');
const config = require('config');
const utils = require('../utils');

/**
 * Handles the download of a single torrent
 */
module.exports = function downloadTorrent(episode) {
  const {show, season, episode: ep, torrent}  = episode;
  return new Promise((res, rej) => {
		let engine;
    try {
      engine = torrentStream(torrent.magnet, {
				path: _getFilePath(show, season, ep)
      });
    } catch (error) {
      debug(`Error downloading episode ${episode.show} ${episode.season} ${episode.ep}`);
      rej();
    }

    engine.on('ready', function () {
      engine.files.forEach(file => {
        if (isVideoFile(file.name)) {
          file.select();
          debug(`${file.name} downloading!`);
        } else {
					file.deselect();
				}
      })
    });

    engine.on('idle', () => {
      DB.get('episodes')
      .find({ show, season, episode: ep })
      .set('downloaded', true)
      .write();
      engine.destroy(() => {
        debug(`Torrent ${torrent.title} downloaded.`);
        res();
      });
    });
  });
}

/**
 * Checks if file is among allowed extensions
 * @param {String} fileName
 */
function isVideoFile (fileName) {
	return config.get('allowedVideoExtensions').some(extension => fileName.endsWith(`.${extension}`));
}

/**
 * Forms download path based on episode details
 * @param {Object} episode
 * @example doctor who, 12, 3 --> 'database/downloads/doctor who/S12E03'
 */
function _getFilePath(show, season, episode) {
	const folderName = `S${utils.doubleDigit(season)}E${utils.doubleDigit(episode)}`;
	return [config.get('downloadPath'), show, folderName].join('/');
}
