atm.controller('HomeController', function($scope, $rootScope, $timeout){
	$scope.message = 'Welcome to the ATM';
	$timeout(function(){$(".welcome-note" ).slideDown("slow");}, 350);
});