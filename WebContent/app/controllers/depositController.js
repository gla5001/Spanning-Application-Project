atm.controller('DepositController', function($scope, $rootScope, $timeout, AccountService, SessionService){
	$scope.message = 'Please enter deposit amount.';
	$scope.message2 = 'Your balance is $' + SessionService.get('activeBalance');
	$scope.message3 = '(Whole dollar amounts only.)';
	$scope.amount = null;
	
	AccountService.setEnteredInAmount(0);
	AccountService.setValidInput(false);
	
	$scope.setEnteredValue = function(){
		var regexp = /^[0-9]+$/g;
		if (!regexp.test($scope.amount)){
			AccountService.setValidInput(false);
			$scope.message = 'Not valid amount.';
			$timeout(function(){$scope.message = 'Please enter deposit amount';}, 2000);
		}
		else{
			AccountService.setValidInput(true);
			AccountService.setEnteredInAmount(parseInt($scope.amount));
		}
	};
	
	//broadcast event from rootScope AccountService
	$scope.$on('newBalance', function(obj){
		$scope.amount = null;
		$scope.message2 = 'Your balance is $' + SessionService.get('activeBalance');
	});
});