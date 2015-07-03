atm.controller('ButtonsRightController', function($scope, $rootScope, $timeout, AccountService, LocationService, SessionService){
	$scope.currentPath = 'test';
	$scope.handleClickRight = function(event){
		event.preventDefault();
		var currentLocation = LocationService.getCurrentLocation();
		if(currentLocation === '/index' && event.target.id === 'button-r4'){ 
			LocationService.goToLocation('/enterPin');
		}
		else if(currentLocation === '/enterPin' && event.target.id === 'button-r3'){
			AccountService.logout();
		}
		else if(currentLocation === '/enterPin' && event.target.id === 'button-r4'){
			var enteredPin = AccountService.getEnteredInPin();
			if(AccountService.getValidInput()){
				AccountService.loginFromPin(enteredPin);
			}
		}
		else if(currentLocation === '/userHome' && event.target.id === 'button-r2'){
			AccountService.logout();
		}
		else if(currentLocation === '/userHome' && event.target.id === 'button-r3'){
			LocationService.goToLocation('/balance');
		}
		else if(currentLocation === '/userHome' && event.target.id === 'button-r4'){
			var cardType = SessionService.get('activeCardType');
			$('div.'+cardType).remove();
			
			LocationService.goToLocation('/enterPin');
		}
		else if(currentLocation === '/balance' && event.target.id === 'button-r4'){ 
			LocationService.goToLocation('/userHome');
		}
		else if(currentLocation === '/deposit' && event.target.id === 'button-r3'){
			LocationService.goToLocation('/userHome');
		}
		else if(currentLocation === '/deposit' && event.target.id === 'button-r4'){
			if(AccountService.getValidInput()){
				AccountService.deposit();
			}
		}
		else if(currentLocation === '/withdraw' && event.target.id === 'button-r3'){
			LocationService.goToLocation('/userHome');
		}
		else if(currentLocation === '/withdraw' && event.target.id === 'button-r4'){
			if(AccountService.getValidInput()){
				AccountService.withdraw();
			}
		}
	 };
});	

atm.controller('ButtonsLeftController', function($scope, $rootScope, $timeout, AccountService, LocationService){
	$scope.handleClickLeft = function(event){
		event.preventDefault();
		var currentLocation = LocationService.getCurrentLocation();
		if(currentLocation === '/userHome' && event.target.id === 'button-l3'){
			LocationService.goToLocation('/withdraw');
		}
		else if(currentLocation === '/userHome' && event.target.id === 'button-l4'){
			LocationService.goToLocation('/deposit');
		}
	 };
});	