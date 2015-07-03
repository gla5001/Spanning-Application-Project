atm.controller('UserHomeScreenController', function($scope, $rootScope, $timeout, SessionService){
	$scope.message1 = 'Hi ' + SessionService.get('activeName') + '!';
	$scope.message2 = 'Please make a choice...';
});