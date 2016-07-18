'use strict';

var path = process.cwd();
var yelpApiHandlerFunctions = require(path + "/app/controllers/yelpApiHandler.server.js");
var checkinHandlerFunctions = require(path + "/app/controllers/checkinHandler.server.js");
var yelpApiHandler = new yelpApiHandlerFunctions();
var checkinHandler = new checkinHandlerFunctions();

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		req.session.returnTo = "/?location="+ encodeURIComponent(req.query.location);
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
	
	app.route('/login')
		.get(function(req, res) {
		    res.redirect('/auth/twitter');
		});
	
	app.route('/api/search/*')
		.get(yelpApiHandler.searchForBars);

	app.route('/api/toggle_going/*')
		.get(isLoggedIn, checkinHandler.toggleGoing);
	
	//-----------------------------------------------
	// Redirect the user to Twitter for authentication.  When complete, Twitter
	// will redirect the user back to the application at
	//   /auth/twitter/callback
	app.get('/auth/twitter', passport.authenticate('twitter'));
	
	// Twitter will redirect the user to this URL after approval.  Finish the
	// authentication process by attempting to obtain an access token.  If
	// access was granted, the user will be logged in.  Otherwise,
	// authentication has failed.
	app.get('/auth/twitter/callback',
	  passport.authenticate('twitter', {failureRedirect: '/'}), function(req, res){
	  	res.redirect(req.session.returnTo);
	  });
};
