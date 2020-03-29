/**
 * Downloads available magnets in selected shows
 */
const output = require('../utils').output('download');

// torrent-search-api download not working
const torrentStream = require('torrent-stream');
const database = require('../database');
const config = require('config');
const utils = require('../utils');
const path = require('path');
const logProgress = require(path.join(__dirname, 'logProgress'));

/**
 * Handles the download of a single torrent
 */
module.exports = function downloadTorrent(episode) {
  const {show, season, episode: ep, torrent}  = episode;
  return new Promise((res, rej) => {
		let engine;
		let episodePath =_getFilePath(show, season, ep);
		let downloadPath = path.join(__dirname, '../../', config.get('downloadPath'), episodePath);
    try {
      engine = torrentStream(torrent.magnet, {path: downloadPath});
    } catch (error) {
      output(`Error downloading episode ${episode.show} ${episode.season} ${episode.ep}`);
      rej();
		}

		let selectedFile;

    engine.on('ready', function () {
      engine.files.forEach(file => {
        if (isVideoFile(file.name)) {
					file.select();
					episodePath += `/${file.path}`;
					selectedFile = file;
          output(`${file.name} downloading!`);
        } else {
					file.deselect();
				}
      })
    });

    engine.on('idle', () => {
			database.episodes.setDownloaded({show, season, episode: ep}, episodePath);
      engine.destroy(() => {
        output(`Torrent ${torrent.title} downloaded.`);
        res();
      });
		});

		engine.on('download', () => {
			logProgress(selectedFile, engine);
		});

		engine.on('torrent', () => {
			output('Torrent metadata fetched');
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
	return [show, folderName].join('/');
}
