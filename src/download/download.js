/**
 * Downloads available magnets in selected shows
 */
const debug = require('debug')('download:');

// torrent-search-api download not working
const torrentStream = require('torrent-stream');
const DB = require('../database');


module.exports = async function downloadTorrent(episode) {
  const {showTitle, season, episode: ep, torrent}  = episode;

  debug(`start ${torrent.title}`);
  const engine = torrentStream(torrent.magnet, {
    path: 'data/download'
  });

  engine.on('ready', function () {
    engine.files.forEach(file => {
      if (isVideoFile(file.name)) {
        file.select();
        debug(`${file.name} selected`);
      }
    })
  });

  engine.on('idle', () => {
    debug(`Torrent ${torrent.title} downloaded.`);
    DB.get('episodes')
      .find({ showTitle, season, episode: ep })
      .set('downloaded', true)
      .write();

    engine.destroy();
  });
}

function isVideoFile (fileName) {
  const extensions = ['mkv', 'avi', 'mp4'];
  return extensions.some(extension => fileName.endsWith(`.${extension}`));
}
