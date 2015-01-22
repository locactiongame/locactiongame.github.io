/**
	Controllers for application
	@module Controllers
	@namespace ApplicationControllers
*/

var app = angular.module("locaction",["ngRoute","ngTouch","ngMap","ngDialog","ngSanitize"]);
	
	/**
		Routes for the mobile application
		@class Routes_
		@namespace Application
	*/
	app.config(function($routeProvider,$locationProvider){
		$routeProvider
		/**
			Routes
			@method Routes
			@for Routes_
		*/
		.when('/',{
			templateUrl : 'login.html',
			controller : 'loginControllers'
		})
		.when('/register',{
			templateUrl : 'register.html',
			controller : 'registerControllers'
		})
		.when('/game',{
			templateUrl : 'game.html',
			controller : 'gameControllers'
		})
		.when('/profile',{
			templateUrl : 'profile.html',
			controller : 'gameControllers'
		})
		.when('/inventory',{
			templateUrl : 'inventory.html',
			controller : 'gameControllers'
		})
		.when('/achievements',{
			templateUrl : 'achievements.html',
			controller : 'gameControllers'
		})
		.when('/messages',{
			templateUrl : 'messages.html',
			controller : 'gameControllers'
		})
		.otherwise({
			redirectTo : "/"
		})
		$locationProvider.html5Mode(true);
	})
/**
	Global application controllers
	@class appControllers
	@namespace Application
*/
app.controller("appControllers",function($scope,$routeParams,$rootScope){
	/**
		Toggles the menu if logged in 
		@method toggleMenu
		@for appControllers
	*/
	$scope.toggleMenu = function(){
		$rootScope.showMenu = !$rootScope.showMenu;
	}
	/**
		Logs out and redirects to login page
		@method logout
		@for appControllers
	*/
	$scope.logout = function(){
		$scope.loggedin = false
		core.logout(function(){
			window.location = "/"
		})
	}
	/**
		Fetches the table
		@method table
		@for appControllers
		@param table {String}
	*/
	$scope.table = function(table,offset,limit){
		if(offset){
			core.getTableBetween(table,offset,limit,function(t){
				$scope.$apply(function(){
					$scope[table] = t;
				})
			})
		}else{
			core.getTable(table,function(t){
				$scope.$apply(function(){
					$scope[table] = t;
				})
			})
		}
	}
})
/**
	Login controllers with redirection if logged in 
	@class loginControllers_
	@namespace Application
*/
app.controller("loginControllers",function($scope,$routeParams,$rootScope){
	/**
		Login method in login.html , redirects to /game if logged in
		@method login
		@for loginControllers_
		@param user {Scope Object}

	*/
	$scope.login = function(){
		var user = {
			username : $scope.username,
			password : $scope.password
		}
		core.login(user,function(response){
			window.location = "/game"
		},function(error){
			alert("Check your username and password");
		})
	}

	//Redirection
	kinveyPromise.then(function(){
		var user = Kinvey.getActiveUser();
		if(null !== user) {
			window.location = "/game"
		}
	})
})
/**
	Controllers in register.html
	@class registerControllers
	@namespace Application
*/
app.controller("registerControllers",function($scope,$routeParams,$rootScope){
	/**
		Register the user with the data taken from register form
		@method register
		@for registerControllers
		@param user {Scope Object}
	*/
	$scope.register = function(){
		var user = {
			username : $scope.username,
			email : $scope.email,
			password : $scope.password
		}
		core.register(user,function(response){
			window.location = "/game"
		},function(error){
			console.log(error)
			alert(error.description)
		})
	}
})
/**
	Controllers for game screen
	@class gameControllers
	@namespace Application
*/
app.controller("gameControllers",function($scope,$rootScope,ngDialog){
	//Close the menu when routed to new page
	$rootScope.showMenu = false
	//Redirection
		// Redirection also fetches the user data
		// if the user is logged in 
		// to the $scope.user
	kinveyPromise.then(function(){
		$scope.$apply(function(){
			$scope.user = Kinvey.getActiveUser();
		})
		if(null !== $scope.user) {
			$rootScope.loggedin = true;
		}else{
			window.location = "/";
		}
	})
	//When game starts the menu is closed
	$rootScope.showMenu = false;

	/**
		Changes the avatar path in users table (user.avatar) , <br/>
		Either can be Facebook Instagram or Twitter . <br/>
		Changes the path as : http://avatars.io/<twitter | facebook | instagram>/:username
		@method updateAvatar()
		@for gameControllers
		@param $scope.social
		@param $scope.nickname
	*/
	$scope.updateAvatar = function(){
		core.updateUser($scope.user,function(r){
			console.log(r);
			alert("Successfully updated your avatar !","success");
		})
	}	

	/**
		Show the mission info when clicked on marker
		@method showMission
		@for gameControllers
		@param event
		@param mission
	*/
	$scope.showMission = function(event,mission){

		$scope.mission = mission;	

		ngDialog.open({
		    template: 'dialogs/mission.html',
		    scope:$scope
		});
	}
	/**
		Checks in user the location by updating user.location <br/>
		For now the check in function does not check if the player is <br/>
		physically near to the location but this feature will be added soon
		@method checkin
		@for gameControllers
		@param locationID {String}
	*/
	$scope.checkin = function(locationID){
		$scope.user.location = locationID;
		core.updateUser($scope.user,function(r){
			alert("Checked in to the place!","success");
		})
	}

	/**
		Fetches all users checked into the place
		@method usersInLocation
		@for gameControllers
		@param locationID {String}
	*/	
	$scope.usersInLocation = function(locationID){

	}

	/**
		Triggers will be here
		@class triggers
		@namespace Application
	*/
	/**
		Invade trigger for missions
		@method invade
		@param missionID {String}
	*/
	$scope.invade = function(missionID){
		//Get users checked in to the location
		
	}

	$scope.$on('mapInitialized', function(event, map) {

    });
	
})

function alert(message,state){
	if(state){
		if(state == 'warning'){
			toastr.warning(message)
		}else if(state == 'success'){
			toastr.success(message)
		}
	}else{
		toastr.error(message, 'Error!')
	}
}








