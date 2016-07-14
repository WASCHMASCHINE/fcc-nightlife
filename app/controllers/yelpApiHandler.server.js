'use strict';

require('dotenv').load();

function YelpApiHandler(){
    var Yelp = require('yelp');

    var yelp = new Yelp({
      consumer_key: process.env.YELP_CONSUMER_KEY,
      consumer_secret: process.env.YELP_CONSUMER_SECRET,
      token: process.env.YELP_TOKEN,
      token_secret: process.env.YELP_TOKEN_SECRET
    });
    
    this.searchForBars = function(req, res){
        var location = req.query['location'];
        console.log("we're in the handler");
        yelp.search({   term: 'bars',
                        limit: 15,
                        location: location })
        .then(function (data) {
          console.log(data);
          res.json(data);
        })
        .catch(function (err) {
          console.error(err);
          res.json([]);
        });
    };
}

module.exports = YelpApiHandler;