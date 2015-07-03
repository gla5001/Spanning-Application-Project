var atm = angular.module("atm", ['ngRoute', 'ngResource']);

//session storage
atm.service('SessionService', function(){	
	this.get = function(key){
		return sessionStorage.getItem(key);
	};
	
	this.set = function(key, value){
		return sessionStorage.setItem(key, value);	
	};
	
	this.unset = function(key){
		return sessionStorage.removeItem(key);	
	};
});

//using local storage to 'fake' post request and make it look like data was persisted across sessions.
atm.service('LocalStorageService', function(){	
	this.get = function(key){
		return localStorage.getItem(key);
	};
	
	this.set = function(key, value){
		return localStorage.setItem(key, value);	
	};
});

atm.service('LocationService', function($location){
	this.getCurrentLocation = function(){
		return $location.path();
	};
	
	this.goToLocation = function(pathIn){
		$location.path(pathIn);
	};
});

atm.service('AccountService', function($resource, $rootScope, $location, SessionService, LocalStorageService){
	var accountPinObject = $resource('WebContent/stubbedBackend/accountToPin.json', {});
	var accountObject = $resource('WebContent/stubbedBackend/:accountNumber.json', {accountNumber:'@accountNumber'});
	
	this.depositTransactionType = 1;
	this.withdrawTransactionType = 2;
	
	this.validInput = true;
	
	this.enteredInPin = null;
	this.enteredInAmount = null;
	
	this.setValidInput = function(isValid){
		this.validInput = isValid;
	};
	
	this.getValidInput = function(){
		return this.validInput;
	};
	
	this.setEnteredInPin = function(pinIn){
		this.enteredInPin = pinIn;
	};
	
	this.getEnteredInPin = function(){
		return this.enteredInPin;
	};
	
	this.clearEnteredInPin = function(){
		this.enteredInPin = null;
	};
	
	this.setEnteredInAmount = function(amountIn){
		this.enteredInAmount = amountIn;
	};
	
	this.getEnteredInAmount = function(){
		return this.enteredInAmount;
	};
	
	this.clearEnteredInAmount = function(){
		this.enteredInAmount = null;
	};
	
	this.errorInRequest = function(){
		$rootScope.$broadcast('notFoundPin', 'Oops, we couldnt find an account with that PIN.');
	};
	
	this.loginFromPin = function(pinIn){
		var self = this;
		var accountPin = accountPinObject.get({}, function(data) {
		   var accounts = data.accountToPins;
		   var pinArray;
		   var pinArrayLength;
		   var accountNumber = null;
		   angular.forEach(accounts, function(values, key) {
			   pinArray = values;
			   pinArrayLength = pinArray.length;
			   
			   for(var i = 0; i < pinArrayLength; i++){
				   if(pinArray[i] == pinIn){
					   accountNumber = key;
				   }
			   }
		   });
		   
		   if(accountNumber != null){
			   self.getAccountObject(accountNumber, pinIn);
		   }
		   else{
			   self.errorInRequest();
		   }		   
		}, function(){ self.errorInRequest(); });
	};
	
	this.getAccountObject = function(accountNumberIn, pinIn){
		var self = this;
		var account = accountObject.get({accountNumber : accountNumberIn}, function(data) {
			   var account = data.account;	
			   var name = "";
			   angular.forEach(account.pinsToName, function(value, key) {
				   if(parseInt(key) == pinIn){
					   name = value;
				   }
			   });
			   
			   var balance = LocalStorageService.get(accountNumberIn) != null ? LocalStorageService.get(accountNumberIn) : account.balance;
			   
			   SessionService.set('activeAccount', accountNumberIn);
			   SessionService.set('activePin', pinIn);
			   SessionService.set('activeName', name);
			   SessionService.set('activeBalance', balance);
			   SessionService.set('activeCardType', account.cardType);
			   
			   $('div.credit-cards').append("<div class=\"" + account.cardType + "\"></div>");
			   
			   $location.path('/userHome');
		}, function(){ self.errorInRequest(); });
	};
	
	this.deposit = function(){
		var currentBalance = parseInt(SessionService.get('activeBalance'));
		var newBalance = currentBalance + this.getEnteredInAmount();
		
		SessionService.set('activeBalance', newBalance);
		LocalStorageService.set(SessionService.get('activeAccount'), newBalance);
		$rootScope.$broadcast('newBalance');
		this.setEnteredInAmount(0);
		this.setValidInput(false);
	};
	
	this.withdraw = function(){
		var currentBalance = parseInt(SessionService.get('activeBalance'));
		var newBalance = currentBalance - this.getEnteredInAmount();
		
		if(newBalance < 0){
			$rootScope.$broadcast('notEnoughFunds');
		}
		else{
			SessionService.set('activeBalance', newBalance);
			LocalStorageService.set(SessionService.get('activeAccount'), newBalance);
			
			$('.body-container').append("<div class=\"dollar\"></div>");			
			$('div.dollar').css('top', ($('.machine-container').height()/2) + 50);
			$('div.dollar').css('left', ($('.machine-container').width()/2) - 46);
			$('div.dollar').fadeIn("slow");
			
			 $('div.dollar').animate({
			        top: '2000px'
			    }, 1000, function(){ $('div.dollar').remove(); });
			
			$rootScope.$broadcast('newBalance');
			this.setEnteredInAmount(0);
			this.setValidInput(false);
		}
	};
	
	this.logout = function(){
		accountObjectResponse = null;
		var cardType = SessionService.get('activeCardType');
		$('div.'+cardType).remove();
		
		SessionService.unset('activeAccount');
		SessionService.unset('activePin');
		SessionService.unset('activeName');
		SessionService.unset('activeBalance');
		SessionService.unset('activeCardType');
		
		this.clearEnteredInPin();
		
		$location.path('/index');
	};
});

atm.config(function($routeProvider){
	$routeProvider.when('/index', {
		templateUrl:'WebContent/partials/home.html',
		controller: 'HomeController'
	});
	
	$routeProvider.when('/enterPin', {
		templateUrl:'WebContent/partials/enterPin.html',
		controller: 'EnterPinController'
	});
	
	$routeProvider.when('/userHome', {
		templateUrl:'WebContent/partials/userHomeScreen.html',
		controller: 'UserHomeScreenController'
	});
	
	$routeProvider.when('/balance', {
		templateUrl:'WebContent/partials/balance.html',
		controller: 'BalanceController'
	});
	
	$routeProvider.when('/deposit', {
		templateUrl:'WebContent/partials/deposit.html',
		controller: 'DepositController'
	});
	
	$routeProvider.when('/withdraw', {
		templateUrl:'WebContent/partials/withdraw.html',
		controller: 'WithdrawController'
	});
	
	$routeProvider.otherwise({redirectTo:'/index'});
});

//logic to route provider. if there is not active pin in session, go to welcome screen
atm.run(function($rootScope, $location, $timeout, SessionService){	
	$rootScope.$on('$routeChangeStart', function(){		
		if($location.path() != '/index' && $location.path() != '/enterPin' && SessionService.get('activePin') == null){
			$location.path('/index');	
		}	
	});
});