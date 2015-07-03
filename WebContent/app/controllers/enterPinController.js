atm.controller('EnterPinController', function($scope, $rootScope, $timeout, AccountService){
	$scope.message = 'Please enter PIN...';
	$scope.pin = null;
	$scope.showInput = true;
	
	$scope.setEnteredValue = function(){
		var regexp = /^[0-9]+$/g;
		if (!regexp.test($scope.pin)){
			AccountService.setValidInput(false);
			$scope.message = 'Not valid number.';
			$timeout(function(){$scope.message = 'Please enter PIN...';}, 2000);
		}
		else{
			AccountService.setValidInput(true);
			AccountService.setEnteredInPin(parseInt($scope.pin));
		}
	};
	
	//broadcast event from rootScope AccountService
	$scope.$on('notFoundPin', function(obj, message){
		$scope.showInput = false;
		$scope.message = message;
		$timeout(function(){$scope.message = 'Please enter PIN...'; $scope.showInput = true;}, 1500);
	});
});