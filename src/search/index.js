/**
* Search torrents from available episodes in selected shows
 */
const output = require('../utils').output('search');
const database = require('../database');
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
    output('No new episodes to search');
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

	database.episodes.updateSearchAttempts(episode);

	if (!checkMaxAttempts(searchAttempts, show, s, e)) {
		return;
	}

	const query = `${show} S${utils.doubleDigit(s)}E${utils.doubleDigit(e)}`;

	output(`Searching ${query}`);

  const torrents = await torrentSearch.search(query, 'All');

	return await _parseSearchResult(torrents);
}


/**
* Analyzes search result
*/
async function _parseSearchResult (torrents) {
	output('Parsing search results...');
	const selectedShows = config.get('selectedShows');

	const result = torrents.filter(torrent => torrent.title).map(torrent => {
		if (!torrent.magnet){
			return;
		}

		const parsed = episodeParser(torrent.title);
		parsed.show = parsed.show.toLowerCase();

		// if show is selected in database
		const {show, season, episode} = parsed;
		if (selectedShows.includes(parsed.show)) {
			const exists = database.episodes.find({show, season, episode});

			if (exists && exists.torrent) {
				return;
			}

			if (exists) {
				output(`Torrent found for episode ${show} ${season} ${episode}`);
				database.episodes.setTorrent({show, season, episode}, torrent);
			} else {
				output(`New episode found! ${show} ${season} ${episode}`);
				database.episodes.push({
					show, season, episode, torrent
				});
			}
			return torrent;
		}
	});

	if (!result.length) {
		output('No torrents found');
	}
}

/**
 * Returns true if maxSearchAttempts has not been reached
 * @param {Number} searchAttempts
 */
function checkMaxAttempts (searchAttempts, show, season, episode) {
	const maxSearchAttempts = config.get('maxSearchAttempts');

	if (!maxSearchAttempts) {
		return true;
	}

	const attemptsLeft = maxSearchAttempts - searchAttempts;

	if (attemptsLeft <= 0){
		output(`Reached max search attempts for ${show} ${season} ${episode}..`);
	}

	if (attemptsLeft === 0){
		output(`Time of death... ${+ new Date()}. RIP`);
	}

	return attemptsLeft > 0;
}
