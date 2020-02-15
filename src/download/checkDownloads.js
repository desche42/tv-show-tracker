/**
 * Marks downloaded files as downloaded in db
 */
 const fs = require('fs-extra');
 const config = require('config');
 const episodeParser = require('episode-parser');
 const DB = require('../database');
 const debug = require('debug')('torrent downloader: check downloads');


 async function checkDownloads () {
   const paths = await fs.readdir(config.get('downloadPath'));
   const downloadedEpisodes = paths.map(ep => {
     ep = episodeParser(ep || ' ') || {};
     ep.show = (ep.show || '').toLowerCase();
     return ep;
   }).filter(Boolean);

   debug(`Downloaded episodes ${downloadedEpisodes.length}`);

   let counterFound = 0;

   downloadedEpisodes.forEach(ep => {
     const {show, season, episode} = ep;
     const found = DB.get('episodes')
      .find({show, season, episode})
      .value();

    if (found && !found.downloaded) {
        counterFound++;
        DB.get('episodes').find({show, season, episode}).set('downloaded', true).write();
      } else {
        DB.get('episodes').push({show, season, episode, downloaded: true}).write();
      }
    })

    debug(`found episodes ${counterFound}`);

}

checkDownloads();
