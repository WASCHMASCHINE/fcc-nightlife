'use strict';
var mongo = require('mongodb').MongoClient;

function CheckinHandler(){
    this.toggleGoing = function(req, res){
        var barId = req.query.id;
        var userId = req.session.passport.user.userId; 
        mongo.connect(process.env.MONGO_URI, function(err, db) {
			if (err) throw err;
			
			db.collection('nightlife-bars').find(
				{"yelpId": barId}).toArray(function(err,data){
					if (err) throw err;
					if (data.length != 0){ // bar exists already in db
					    var foundUser = false;
    					for (var i=0; i < data[0].goingGuests; i++) {
                            if (data[0].goingGuests[i] === userId) {
                                foundUser = true;
                                break;
                            }
                        }
                        if (foundUser){ // found user as a guest
                            db.collection('nightlife-bars').update(
					            {"yelpId": barId, "goingGuests": userId},
					            {$pull: {'goingGuests': userId}});
					        res.send("exists, removed user");
                        } else { // did not found user a a guest
                            db.collection('nightlife-bars').update(
					            {"yelpId": barId},
					            {$push: {'goingGuests': userId}});
					        res.send("exists, added user");
                        }
					    
					} else { // bar does not exist in db
					    db.collection('nightlife-bars').insert(
					        { "yelpId": barId, "goingGuests": [userId]});
                        res.send("added bar + user");
					}
				}
			);
		});	
    };
}

module.exports = CheckinHandler;