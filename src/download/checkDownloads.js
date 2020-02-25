/**
 * Marks downloaded files as downloaded in db
 */
 const fs = require('fs-extra');
 const config = require('config');
 const episodeParser = require('episode-parser');
 const database = require('../database');
 const output = require('../utils').output('check downloads');
 const path = require('path');


 async function checkDownloads () {
   const paths = await fs.readdir(path.join(__dirname, '../../', config.get('downloadPath')));
   const downloadedEpisodes = paths.map(ep => {
     ep = episodeParser(ep || ' ') || {};
     ep.show = (ep.show || '').toLowerCase();
     return ep;
   }).filter(Boolean);

   output(`Downloaded episodes ${downloadedEpisodes.length}`);

   let counterFound = 0;

   downloadedEpisodes.forEach(ep => {
     const {show, season, episode} = ep;
     const found = database.rawDb.get('episodes')
      .find({show, season, episode})
      .value();

    if (found && !found.downloaded) {
        counterFound++;
        database.episodes.setDownloaded({show, season, episode});
      } else {
        database.rawDb.get('episodes').push({show, season, episode, downloaded: true}).write();
      }
    })

    output(`found episodes ${counterFound}`);

}

checkDownloads();
