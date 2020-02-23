/**
 * Episodes module for db
 */
module.exports = rawDb => {
	return {
		setDownloaded: setDownloaded(rawDb),
		getDownloaded: getDownloaded(rawDb),
		getShowEpisodes: getShowEpisodes(rawDb)
	}
}

/**
 * Sets an episode as downloaded: true
 * @param {Object} episodeData {show, season, episode}
 */
const setDownloaded = rawDb => ({show, season, episode}) => {
	rawDb.get('episodes')
		.find({show, season, episode})
		.set('downloaded', true)
		.write();
}

/**
 * Returns downloaded episodes
 */
const getDownloaded = rawDb => () => rawDb.get('episodes').filter({downloaded: true}).value()

/**
 * Gets shows episodes
 */
const getShowEpisodes = rawDb => show => {
	return rawDb.get('episodes')
		.filter({
			show
		}).value();
}
