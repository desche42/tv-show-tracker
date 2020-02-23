/**
 * Episodes module for db
 */
module.exports = rawDb => {
	return {
		setDownloaded: setDownloaded(rawDb)
	}
}

const setDownloaded = rawDb => ({show, season, episode}) => {
	rawDb.get('episodes')
		.find({show, season, episode})
		.set('downloaded', true)
		.write();
}
