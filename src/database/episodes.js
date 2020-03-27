const DB_EPISODES_KEY = 'episodes';

/**
 * Episodes module for db
 */
module.exports = rawDb => {
	return {
		setDownloaded: setDownloaded(rawDb),
		setTorrent: setTorrent(rawDb),
		getDownloaded: getDownloaded(rawDb),
		getShowEpisodes: getShowEpisodes(rawDb),
		push: push(rawDb),
		find: find(rawDb),
		updateSearchAttempts: updateSearchAttempts(rawDb),
		getForcedEpisodes: getForcedEpisodes(rawDb)
	}
}

/**
 * Sets an episode as downloaded: true and sets path
 * @param {Object} episodeData {show, season, episode}
 * @param {String} path path of the file
 */
const setDownloaded = rawDb => ({show, season, episode}, path) => {
	rawDb.get(DB_EPISODES_KEY)
		.find({show, season, episode})
		.set('downloaded', true)
		.set('path', path)
		.write();
}

/**
 * Sets a torrent in episode
 * @param {Object} episodeData {show, season, episode}
 */
const setTorrent = rawDb => ({show, season, episode, forceDownload}, torrent) => {
	rawDb.get(DB_EPISODES_KEY)
		.find({show, season, episode})
		.set('torrent', torrent)
		.set('forceDownload', !!forceDownload)
		.write();
}

/**
 * Returns downloaded episodes
 */
const getDownloaded = rawDb => () => rawDb.get(DB_EPISODES_KEY).filter({downloaded: true}).value();

/**
 * Returns episodes forced to download
 * that are not downloaded yet
 */
const getForcedEpisodes = rawDb => () => rawDb.get(DB_EPISODES_KEY).filter({
	downloaded: false,
	forceDownload: true
}).value();

/**
 * Gets shows episodes
 */
const getShowEpisodes = rawDb => show => {
	return rawDb.get(DB_EPISODES_KEY)
		.filter({
			show
		}).value();
}

/**
 * Pushes a new episode into db
 * @param {Object} episode
 */
const push = rawDb => episode => {
	rawDb.get(DB_EPISODES_KEY).push(episode).write();
}

/**
 * Update searchAttempts counter
 * @param {Object} episode
 */
const updateSearchAttempts = rawDb => ({show, season, episode, searchAttempts}) => {
	rawDb.get(DB_EPISODES_KEY)
		.find({show, season, episode})
		.set('searchAttempts', (searchAttempts || 0) + 1)
		.write();
}

const find = rawDb => ({show, season, episode}) => {
	return rawDb
		.get(DB_EPISODES_KEY)
		.find({show, season, episode})
		.value();
}
