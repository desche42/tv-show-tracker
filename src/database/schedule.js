/**
 * Episodes module for db
 */
module.exports = rawDb => {
	return {
		push: pushSchedule(rawDb),
		findSchedule: findSchedule(rawDb)
	}
}

/**
 * Sets an episode as downloaded: true
 * @param {Object} episodeData {show, season, episode}
 */
const pushSchedule = rawDb => (month, year) => {
	const date = getDate(month, year);
	rawDb.get('schedules').push(date).write();
}

/**
 * Finds if schedule is in db
 * @param {String} month
 * @param {String} year
 * @returns {Boolean}
 */
const findSchedule = rawDb => (month, year) => {
	const schedules = rawDb.get('schedules').value();
	const date = getDate(month, year);
	return schedules.includes(date);
}

const getDate = (month, year) => `${month}-${year}`;
