'use strict';

module.exports = (app) => {
	app.use('/', require('./index'));
	app.use('/level', require('./level'));
	app.use('/ownedgames', require('./ownedgames'));
	app.use('/longestPeriod', require('./longestPeriod'));
}