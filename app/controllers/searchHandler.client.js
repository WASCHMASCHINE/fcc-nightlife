'use strict';
/*global $, ajaxFunctions, appUrl*/

(function () {
   $("#barSearchButton").on("mousedown", function(){
       var location = $("#barSearchBar").val();
       if (location != ""){
           $("#loaderPlaceholder").addClass("loader");
           ajaxFunctions.ajaxRequest("GET", appUrl + '/api/search/?location=' + encodeURIComponent(location), function(response){
               var jsonData= JSON.parse(response);
               console.log(jsonData);
               $("#loaderPlaceholder").removeClass("loader");
           });
       }
   });
})();