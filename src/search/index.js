/**
* Search torrents from available episodes in selected shows
 */
const debug = require('debug')('tv-show-tracker: search');
const DB = require('../database');
const config = require('config');
const episodeParser = require('episode-parser');
const utils = require('../utils');

// Configure torrent search
// more info about providers using await torrentSearch.getActiveProviders();
const torrentSearch = require('torrent-search-api');

if (config.get('torrentSearchEnablePublicProviders')) {
	torrentSearch.enablePublicProviders();
} else {
	config.get('torrentSearchEnableProviders').forEach(provider => {
		torrentSearch.enableProvider(provider);
	});
}

config.get('torrentSearchDisableProviders').forEach(provider => {
	torrentSearch.disableProvider(provider);
});


/**
 * API
 *
 * Searches torrents of all given episodes
 * @param {Array} episodes to search
 * @returns search results
 */
module.exports = async function searchEpisodes(episodes = []) {
  episodes = _getFilteredEpisodes(episodes);

  if(episodes.length) {
		await Promise.all(episodes.map(_searchEpisode));
  } else {
    debug('No new episodes to search');
  }
}

/**
 * Returns an array with the fewer search attempts
 * episodes and size configured in config files
 * @param {Array} episodes
 */
function _getFilteredEpisodes(episodes) {
	return episodes
		.filter(episode => !episode.torrent)
		.sort((a, b) => (a.searchAttempts || 0) - (b.searchAttempts || 0))
		.slice(0, config.get('simultaneousSearchLimit'));
}

/**
 * Searches torrent with given params and chooses the biggest found
 * @todo Torrent selection rules
 * @param {Object} episode
 * @returns episode with search result
 */
async function _searchEpisode(episode) {
  const {
		show,
		season: s,
		episode: e,
		searchAttempts
	} = episode;


  DB.get('episodes').find({
		show, season: s, episode: e
	}).set('searchAttempts', (searchAttempts || 0) + 1).write();

	if (!checkMaxAttempts(searchAttempts, show, s, e)) {
		return;
	}

	const query = `${show} S${utils.doubleDigit(s)}E${utils.doubleDigit(e)}`;

	debug(`Searching ${query}`);

  const torrents = await torrentSearch.search(query, 'All');

	return await _parseSearchResult(torrents);
}


/**
* Analyzes search result
*/
async function _parseSearchResult (torrents) {
	debug('Parsing search results...');
	const selectedShows = config.get('selectedShows');

	let torrentsFound = 0;
	torrents.filter(torrent => torrent.title).forEach(torrent => {
		if (!torrent.magnet){
			return;
		}

		const parsed = episodeParser(torrent.title);
		parsed.show = parsed.show.toLowerCase();

		// if show is selected in database
		if (selectedShows.includes(parsed.show)) {
			const {show, season, episode} = parsed;
			const dbEpisode = DB.get('episodes').find({show, season, episode});

			const exists = dbEpisode.value();


			if (exists && exists.torrent) {
				return;
			}

			if (exists) {
				debug(`Torrent found for episode ${show} ${season} ${episode}`);
				DB.get('episodes').find({show, season, episode}).set('torrent', torrent).write();
			} else {
				debug(`New episode found! ${show} ${season} ${episode}`);
				DB.get('episodes').push({
					show, season, episode, torrent
				}).write();
			}

			torrentsFound++;
			return torrent;
		}
	});

	if (!torrentsFound) {
		debug('No torrents found');
	}

	return torrentsFound;
}


/**
 * Returns torrent with highest size
 * @param {Array} torrents
 */
function _getHighestSize(torrents) {
  return torrents.reduce((prev, act) =>
    _parseSize(prev) > _parseSize(act) ? prev : act
  );
}



/**
 * @param {String} size 1.4 Gib | 333 MB | ....
 * @return number of MB
 */
function _parseSize(size) {
  const isGbRegEx = /Gi?B/;
  const isMbRegEx = /Mi?B/;

  if (isGbRegEx.test(size)) {
    return size.split(isGbRegEx)[0] * 1024;
  } else if (isMbRegEx.test(size)) {
    return Number(size.split(isMbRegEx)[0]);
  } else return size;
}

/**
 * Returns true if maxSearchAttempts has not been reached
 * @param {Number} searchAttempts
 */
function checkMaxAttempts (searchAttempts, show, season, episode) {
	const attemptsLeft = config.get('maxSearchAttempts') - searchAttempts;

	if (attemptsLeft <= 0){
		debug(`Reached max search attempts for ${show} ${season} ${episode}..`);
	}

	if (attemptsLeft === 0){
		debug(`Time of death... ${+ new Date()}. RIP`);
	}

	return attemptsLeft > 0;
}
