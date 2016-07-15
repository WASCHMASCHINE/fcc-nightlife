'use strict';
/*global $, ajaxFunctions, appUrl*/

function addNewListItem(yelpJson){
   return '<li class="list-group-item">' +
			  	'<img src="'+ yelpJson.image_url + '" class="yelp-main-img img-rounded"></img>' +
			  	'<h3 class="yelp-name-text">'+ yelpJson.name + '</h3>' +
			  	'<img src="'+ yelpJson.rating_img_url+ '" class="yelp-rating"></img>' +
			  	'<a href="#" class="going-button btn btn-primary">0 going</img>' +
			 '</li>';
}

(function () {
   $("#barSearchButton").on("mousedown", function(){
       var location = $("#barSearchBar").val();
       if (location != ""){
           $("#loaderPlaceholder").addClass("loader");
           ajaxFunctions.ajaxRequest("GET", appUrl + '/api/search/?location=' + encodeURIComponent(location), function(response){
               var jsonData= JSON.parse(response);
               var bars = jsonData.businesses;
               console.log(bars);
               $("#searchResultsList").empty();
               for (var i=0; i < bars.length; ++i){
                  $("#searchResultsList").append(addNewListItem(bars[i]));
               }
               $("#loaderPlaceholder").removeClass("loader");
               $("html, body").animate({scrollTop: 0}, 600);
           });
       }
   });
})();