'use strict';

var path = process.cwd();
var importedYelpApiHandlerFunctions = require(path + "/app/controllers/yelpApiHandler.server.js");
var yelpApiHandler = new importedYelpApiHandlerFunctions();

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/api/search/*')
		.get(yelpApiHandler.searchForBars);
};
