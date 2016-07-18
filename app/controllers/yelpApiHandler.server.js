'use strict';
var mongo = require('mongodb').MongoClient;
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
        yelp.search({   term: 'bars',
                        limit: 10,
                        location: location })
        .then(function (yelpdata) {
          var yelpIdArray = yelpdata.businesses.map(function(a) {return a.id;});
        
          mongo.connect(process.env.MONGO_URI, function(err, db) {
			    if (err) throw err;
			      db.collection('nightlife-bars').find(
			        {"yelpId": {$in : yelpIdArray}}).toArray(function(err, data){
			           if (err) throw err;
			           for (var i=0; i < yelpdata.businesses.length; ++i){
			              yelpdata.businesses[i]["guestnumber"] = 0;
			              for (var j=0; j < data.length; ++j){
			                if (yelpdata.businesses[i].id === data[j].yelpId){
			                    yelpdata.businesses[i]["guestnumber"] = data[j].goingGuests.length;
			                    break;
			                }
			              }
			           }
			           res.json(yelpdata);
			        });
          });
        })
        .catch(function (err) {
          console.error(err);
          res.json([]);
        });
    };
}

module.exports = YelpApiHandler;