atm.controller('WithdrawController', function($scope, $rootScope, $timeout, AccountService, SessionService){
	$scope.message = 'Please enter withdrawal amount.';
	$scope.message2 = 'Your balance is $' + SessionService.get('activeBalance');
	$scope.message3 = '(Whole dollar amounts only.)';
	$scope.amount = null;
	$scope.showInput = true;
	
	AccountService.setEnteredInAmount(0);
	AccountService.setValidInput(false);
	
	$scope.setEnteredValue = function(){
		var regexp = /^[0-9]+$/g;
		if (!regexp.test($scope.amount)){
			AccountService.setValidInput(false);
			$scope.message = 'Not valid amount.';
			$timeout(function(){$scope.message = 'Please enter withdraw amount';}, 2000);
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
	
	$scope.$on('notEnoughFunds', function(obj){
		$scope.showInput = false;
		$scope.message = 'You do not have enough for withdraw.';
		$timeout(function(){$scope.message = 'Please enter withdraw amount.'; $scope.showInput = true;}, 3200);
	});
});