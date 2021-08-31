var bmxCurriculumApp = angular.module('bmxCurriculumApp', ['ngRoute', 'bmxCurriculumAppControllers', 'ui.grid']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/home', {templateUrl: 'partials/landingpage.html'}).
			when('/downloadFile', {templateUrl: 'partials/downloadpage.html'}).
            when('/leads', {templateUrl: 'partials/leadspage.html', controller: 'leadsPageCtrl'}).
            when('/claims', {templateUrl: 'partials/claimspage.html', controller: 'claimsPageCtrl'}).
			when('/uploadFile', {templateUrl: 'partials/uploadpage.html'}).
			when('/testgrid', {templateUrl: 'partials/testgrid.html', controller: 'testGridCtrl'}).
//			when('/customers', {templateUrl: 'partials/customerlist.html', controller: 'customerListCtrl'}).
//			when('/customers/:customerId', {templateUrl: 'partials/customerdetails.html', controller: 'customerDetailsCtrl'}).
			otherwise({redirectTo: '/home'});
	}]);

//Update the default headers on $http to fix something that didn't work.......
bmxCurriculumApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

//Create the controllers module
angular.module('bmxCurriculumAppControllers', ['ngFileUpload']);


//Directive to switch tabs
/***
 * note: this directive binds the function below to the HTML element containing the "showtab" attribute.  This allows the app to activate the clicked tab
 * using javascript rather than the anchor tag.  Angular misinterprets the anchor tag as a navigation instead of a scroll.
 * 
 */
bmxCurriculumApp.directive('showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });



bmxCurriculumApp.factory('usrService', function($http){
	var promise;
	var myService = {
		async: function() {
			if ( !promise ) {
				promise = $http.get('/currentuser').then(function (response) {
					console.log(response);
					return response.data;
				});
			}
			return promise;
		}		
	};
	return myService;
});




/***
 * This function is not currently being used.  It was copied from another application and is reserved for future use
 */

bmxCurriculumApp.factory('cfgService',  function($http) {
	
	var config = {};
	var properties = {};
	
	config.getConfig = function(){
		
		return $http.get('data/config.json').then(function(response){
			properties = response.data;
			console.log("config data");
			console.log(JSON.stringify(properties));

			return properties;
		});	
		
	};
	
	return config;
	
});



/***
 * This function is not currently being used.  It was copied from another application and is reserved for future use
 */
bmxCurriculumApp.factory('urlService', function() {
	var urlService = {};
	var dsiUrl = "https://localhost:9447";
	
	urlService.getUrl = function() {
		return dsiUrl;
	};
	
	return urlService;
});

bmxCurriculumApp.factory('nowService', function() {
	var nowService = {};
	var formattedDate = "";
	
	nowService.getCurrentDate = function() {
		var currentDate = new Date();
		var currentMonth = "";
		var currentDay = "";
		var currentHour = "";
		var currentMinute = "";
		var currentSecond = "";
		var currentMillisecond = "";

		if ((currentDate.getMonth() + 1) < 10) {
			currentMonth = "0" + (currentDate.getMonth() + 1);
		}else {
			currentMonth = currentDate.getMonth() + 1;
		}

		if (currentDate.getDate() < 10) {
			currentDay = "0" + currentDate.getDate();
		}else {
			currentDay = currentDate.getDate();
		}
		
		if (currentDate.getHours() < 10) {
			currentHour = "0" + currentDate.getHours();
		}else {
			currentHour = currentDate.getHours();
		}
		
		if (currentDate.getMinutes() < 10){
			currentMinute = "0" + currentDate.getMinutes();
		}else {
			currentMinute = currentDate.getMinutes();
		}
		
		if (currentDate.getSeconds() < 10){
			currentSecond = "0" + currentDate.getSeconds();
		}else {
			currentSecond = currentDate.getSeconds();
		}
		
		if (currentDate.getMilliseconds() < 10) {
			currentMillisecond = "00" + currentDate.getMilliseconds();
		} else if(currentDate.getMilliseconds() >= 10 && currentDate.getMilliseconds() < 100){
			currentMillisecond = "0" + currentDate.getMilliseconds();
		}else {
			currentMillisecond = currentDate.getMilliseconds();
		}
		
		formattedDate = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;
		formattedDate += " " + currentHour + ":" + currentMinute;
		
		return formattedDate;
		
	};
	
	return nowService;
	
});



