const {expect} = require('chai');

const schedule = require('../src/schedule');

describe.only('Schedule module', () => {
	it('should expose update method', () => {
		expect(schedule.update instanceof Function).to.be.true;
	});

	it('should expose getAvailableEpisodes method', () => {
		expect(schedule.getAvailableEpisodes instanceof Function).to.be.true;
	});
});
