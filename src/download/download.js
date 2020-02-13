/**
 * Downloads available magnets in selected shows
 */
const fs = require('fs-extra');
const debug = require('debug')('download torrent:');

// torrent-search-api download not working
const torrentStream = require('torrent-stream');


async function downloadTorrent(torrent) {
  debug(`Downloading torrent ${torrent.title}`);

  const engine = torrentStream(torrent.magnet, {
    path: 'data/download'
  });

  engine.on('ready', function () {
    engine.files.forEach(file => {
      if (isVideoFile(file.name)) {
        file.select();
      }
    })
  });

  engine.on('idle', () => {
    debug('Torrent downloaded.');
    engine.destroy(() => process.exit());
  });
}

function isVideoFile (fileName) {
  const extensions = ['mkv', 'avi', 'mp4'];
  return extensions.some(extension => fileName.endsWith(`.${extension}`));
}

downloadTorrent(
  JSON.parse(fs.readFileSync('data/selectedShows/Doctor Who.json'))["12"]["06"].torrents[0]
);
