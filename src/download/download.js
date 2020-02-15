/**
 * Downloads available magnets in selected shows
 */
const debug = require('debug')('tv-show-tracker: download:');

// torrent-search-api download not working
const torrentStream = require('torrent-stream');
const DB = require('../database');
const config = require('config');


module.exports = function downloadTorrent(episode) {
  const {show, season, episode: ep, torrent}  = episode;
  return new Promise((res, rej) => {
    let engine;
    try {
      engine = torrentStream(torrent.magnet, {
        path: config.get('downloadPath')
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

function isVideoFile (fileName) {
  const extensions = ['mkv', 'avi', 'mp4'];
  return extensions.some(extension => fileName.endsWith(`.${extension}`));
}
