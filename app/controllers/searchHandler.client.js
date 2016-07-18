'use strict';
/*global $, ajaxFunctions, appUrl*/

function addNewListItem(location, yelpJson){
   var imageSource = yelpJson.image_url || '/public/img/missingImg.png';
   return '<li class="list-group-item">' +
			  	'<img src="'+ imageSource + '" class="yelp-main-img img-rounded"></img>' +
			  	'<h3 class="yelp-name-text">'+ yelpJson.name + '</h3>' +
			  	'<img src="'+ yelpJson.rating_img_url+ '" class="yelp-rating"></img>' +
			  	'<a href="/api/toggle_going/?location=' + location + '&id=' + encodeURIComponent(yelpJson.id) + '" class="going-button btn btn-primary">'+ yelpJson.guestnumber +' going</img>' +
			 '</li>';
}

function handleNewLoad(){
   console.log(window.location.search.substr("?location=".length));
   var location = decodeURIComponent(window.location.search.substr("?location=".length));
   
   if (location != ""){
      $("#barSearchBar").val(location);  
      $("#loaderPlaceholder").addClass("loader");
      ajaxFunctions.ajaxRequest("GET", appUrl + '/api/search/?location=' + encodeURIComponent(location), function(response){
         var jsonData= JSON.parse(response);
         var bars = jsonData.businesses;
         console.log(bars);
         $("#searchResultsList").empty();
         for (var i=0; i < bars.length; ++i){
            $("#searchResultsList").append(addNewListItem(location, bars[i]));
         }
         $("#loaderPlaceholder").removeClass("loader");
         $("html, body").animate({scrollTop: 0}, 600);
     });
   }
}


(function () {
   handleNewLoad();
   
   $("#barSearchButton").on("mousedown", function(){
       var location = $("#barSearchBar").val();
       window.location.search="?location="+location;
   });
   
   $("#barSearchBar").on('keydown', function(evt){
      if (evt.which == 13){
         var location = $("#barSearchBar").val();
         window.location.search="?location="+location;
         return false;
      }
   });
})();