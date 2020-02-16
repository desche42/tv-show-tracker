/**
 * IMDB Search
 */
const imdb = require('imdb-scrapper');

/**
*
*/
async function search (term) {
 const data = await imdb.simpleSearch(term);
 	const {
		l: title,
		id
	} = data.d[0];

	// console.log(title, id);

	// show information
	// const {
	// 	year,
	// 	story,
	// 	genre,
	// 	seasons // may not be on air
	// } = await imdb.getFull(id);

	// season episodes info
	// const season = seasons - 1;
	// const {episodes} = await imdb.episodesPage(id, season);
	// console.log(episodes)

	const scrap = await imdb.scrapper(id);

	console.log(scrap)


	return;
}

search('brooklyn nine nine');
