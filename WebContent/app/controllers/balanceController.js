atm.controller('BalanceController', function($scope, SessionService){
	var activeAccountSubStr = SessionService.get('activeAccount').substr(SessionService.get('activeAccount').length - 4);
	$scope.message = 'Your balance for account ending in ' + activeAccountSubStr + ' is $' + SessionService.get('activeBalance');
});