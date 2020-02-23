const DB_SHOWS_KEY = 'shows';


/**
 * Episodes module for db
 */
module.exports = rawDb => {
	return {
		find: findShow(rawDb),
		push: pushShow(rawDb)
	}
}

const findShow = rawDb => showName =>{
	return rawDb.get(DB_SHOWS_KEY)
		.find({ title: showName })
		.value();
}

const pushShow = rawDb => showName =>{
	return rawDb.get(DB_SHOWS_KEY)
		.push({ title: showName })
		.write();
}



