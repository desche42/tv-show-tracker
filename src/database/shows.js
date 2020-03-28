const DB_SHOWS_KEY = 'shows';
const fuzzy = require('fuzzy');


/**
 * Episodes module for db
 */
module.exports = rawDb => {
	return {
		find: findShow(rawDb),
		push: pushShow(rawDb),
		// getAllShows: getAllShows(rawDb),
		getAllShowNames: getAllShowNames(rawDb),
		ffilterFuzzyShow: filterFuzzyShow(rawDb)
	}
}

const findShow = rawDb => showName =>{
	return rawDb.get(DB_SHOWS_KEY)
		.find({ title: showName })
		.value();
}

/**
 * Returns first fuzzy search in database/shows/show.title
 * @param {String} showName
 */
const filterFuzzyShow = rawDb => showName => {
	const showNames = getAllShowNames(rawDb)();
	return fuzzy.filter(showName, showNames)[0];
}

/**
 * Returns all shows from database
 */
const getAllShows = rawDb => () => {
	return rawDb.get(DB_SHOWS_KEY).value();
}

/**
 * Returns all show names from database
 */
const getAllShowNames = rawDb => () => {
	return getAllShows(rawDb)().map(show => show.title);
}

const pushShow = rawDb => showName => {
	return rawDb.get(DB_SHOWS_KEY)
		.push({ title: showName })
		.write();
}
