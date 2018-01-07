app.directive('addCard', function () {
   return {
      restrict: "AE",
      templateUrl: "./addCard/addCard.html",
	  scope: {
		info: '='
		},
		link: function(scope, element, attrs) {
		}
   }
});