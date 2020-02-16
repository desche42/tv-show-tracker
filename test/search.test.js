const {expect} = require('chai');
const sinon = require('sinon');

const search = require('../src/search');

describe.only('Search module', () => {
	it('should be function', () => {
		expect(search instanceof Function).to.be.true;
	});

	it('should return a promise', () => {
		expect(search() instanceof Promise).to.be.true;
	});
});
