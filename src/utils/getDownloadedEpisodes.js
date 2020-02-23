const database = require('../database');

const downloaded = database.episodes.getDownloaded();

const uniqueArray = arr => [...new Set(arr)];

let totalEpisodes = 0;

uniqueArray(downloaded.map(ep => ep.show)).forEach(show => {
	console.log(`\n Downloaded episodes for ${show}: \n`);

	const result = {};

	downloaded.filter(ep => ep.show === show).forEach(ep => {
		totalEpisodes++;
		const {season, episode} = ep;

		// add episode and sort
		result[season] = result[season]
			? [...result[season], episode].sort((a,b) => a - b)
			: [episode];
	});

	console.log(result);
});

console.log(`\n Downloaded episodes: ${totalEpisodes}`);

