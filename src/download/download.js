/**
 * Downloads available magnets in selected shows
 */
const debug = require('debug')('tv-show-tracker: download:');

// torrent-search-api download not working
const torrentStream = require('torrent-stream');
const DB = require('../database');


module.exports = function downloadTorrent(episode) {
  const {showTitle, season, episode: ep, torrent}  = episode;
  return new Promise((res, rej) => {

    const engine = torrentStream(torrent.magnet, {
      path: 'database/download'
    });

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
      .find({ showTitle, season, episode: ep })
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
