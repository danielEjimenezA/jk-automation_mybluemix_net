/**
 * This is the Angular Controller for my app
 */

var bmxCurriculumAppControllers = angular.module('bmxCurriculumAppControllers');


bmxCurriculumAppControllers.controller('chatCtrl', ['$scope', '$http', '$location', '$anchorScroll', 'nowService','cfgService', function($scope, $http, $location, $anchorScroll, nowService, cfgService) {
	
	console.log('in chatCtrl');

	
	$scope.username = "Jeff";
	$scope.hostname = $location.protocol() + "://" + $location.host() + ":" + $location.port();
	$scope.conversationId = "";
	$scope.clientId = "";
	$scope.posts = [];
	$scope.config = {};
	$scope.localWatsonResponses = [];
	$scope.validResponsesCount = 0;
	$scope.showTweetLink = false;
	$scope.tweetText = escape("I am going to see Elton John at the MGM Grand!");
	$scope.tweetHashtags = "IBMInterConnect2016,IBMSmarterProcess,EltonJohn",

	console.log("The url for this app is " + $scope.hostname);
	
	$scope.reset = function() {
		
		console.log("Resetting Scenario....");
		$scope.posts = [];
		$scope.localWatsonResponses = [];
		$scope.validResponsesCount = 0;
		$scope.startDialog();
	}
	
	$scope.processHumanResponse = function() {
		console.log("in processHumanRequest after button click");
		var currentDate = new Date();
		
		var currentPost = {
			'style': 'chat-human',
			'text': $scope.humanResponse,
			'name': $scope.username,
			'datetime': nowService.getCurrentDate()
		};
		$scope.posts.push(currentPost);
		
		var msgCount = $scope.posts.length - 1;
		var scrollTag = 'message' + msgCount.toString();
		console.log('the scroll tag id in chatCtrl.processHumanResponse is ' + scrollTag);
		$location.hash(scrollTag);
		$anchorScroll();
		
		$scope.sendDialog();
		$scope.humanResponse = "";
	};
	

	$scope.startDialog = function() {

		var startResponse = "";

		console.log("in chatCtrl.startDialog....");

		if ($scope.config.watsonClientOnly) {
			console.log("In startDialog in client only mode");
			startResponse = "Hello, I am the Watson powered Las Vegas concierge!  How may I help you, today?";
			$scope.validResponsesCount = 0;
			$scope.localWatsonResponses = [];
			
			$scope.conversationId = 111111;
			$scope.clientId = 222222;
			
			var currentPost = {
			    	'style': 'chat-watson', 
			    	'text': startResponse,
			    	'name': 'Watson',
			    	'datetime': nowService.getCurrentDate(),
			    	'showTweetLink': false
				
		};
		
		$scope.posts.push(currentPost);
			
		}else {//online or offline, but using the server side code in this app
			//This is the call to the server side of this node.ja app to start the dialog in Watson
			$http({
				method: 'POST', 
				url: $scope.hostname + '/spDialog/watson/dialog/start',
				headers:{'Content-Type': 'application/json', 'Accept': 'application/json'}
//				data: tweet
			}).
			success(function(data, status, headers, config){
				console.log("in chatCtrl.startDialog.success after starting the dialog.....");
				//For bluemix/Node.js we have to parse the JSON because it comes back as a string
				var watsonResponse = JSON.parse(data);
				//For Liberty it is already a JSON object
//				var watsonResponse = data;
				console.log(data);
				
				startResponse = watsonResponse.response[0];
				$scope.conversationId = watsonResponse.conversation_id;
				$scope.clientId = watsonResponse.client_id;
				
				
				var currentPost = {
				    	'style': 'chat-watson', 
				    	'text': startResponse,
				    	'name': 'Watson',
				    	'datetime': nowService.getCurrentDate(),
				    	'showTweetLink': false
					
			};
			
			$scope.posts.push(currentPost);

			}).
			error(function(data, status, headers, config){
				console.log("in chatCtrl.startDialog.error: ");
				console.log(JSON.parse(status).toString());
				console.log("HTTP Response Headers for chatCtrl.startDialog are " + JSON.stringify(headers));
				console.log("There was an error starting the dialog....");
				
			});			
		}

	
	};


	
	
	// this function gets called when the human clicks the button. It calls Watson to continue the conversation.
	$scope.sendDialog = function() {


		console.log("in chatCtrl.sendDialog....");

		var dialogInput = {
			'input': $scope.humanResponse,
			'conversation_id': $scope.conversationId,
			'client_id': $scope.clientId
		};
		
		console.log(JSON.stringify(dialogInput));
		console.log("The value of humanResponse is " + $scope.humanResponse);

		if ($scope.config.watsonClientOnly) {
						
			$scope.localWatsonResponses =[];
			$scope.generateLocalWatsonResponses();
			
			console.log("in sendDialog in client only mode");
			
			for (var x=0; x < $scope.localWatsonResponses.length; x++) {
				console.log("right before tweet check where validResponsesCount is " + $scope.validResponsesCount + " and x is " + x);
				if($scope.validResponsesCount === 5 && x === 0 && $scope.localWatsonResponses.length > 1) {
					$scope.showTweetLink = true;
				}else {
					$scope.showTweetLink = false;
				}
				
				if ($scope.localWatsonResponses[x].message !== "") {
					var currentPost = {
   				    	'style': 'chat-watson', 
   				    	'text': $scope.localWatsonResponses[x].message,
   				    	'name': 'Watson',
   			    		'datetime': nowService.getCurrentDate(),
   			    		'showTweetLink': $scope.showTweetLink
					
					};					
					console.log("in sendDialog local mode, pushing post:");
					console.log(JSON.stringify(currentPost));
					$scope.posts.push(currentPost);
		
				}			
			}			
		}else {//not running in local only mode so call the server side code of this app
			//This is the call to the server side of this node.ja app to start the dialog in Watson

			$http({
				method: 'POST', 
				url: $scope.hostname + '/spDialog/watson/dialog/send',
				headers:{'Content-Type': 'application/json', 'Accept': 'application/json'},
				data: dialogInput
			}).
			success(function(data, status, headers, config){
				console.log("in chatCtrl.sendDialog.success after starting the dialog.....");
				//For bluemix/Node.js we have to parse the JSON because it comes back as a string
				var watsonResponse = JSON.parse(data);
				//For Liberty it is already a JSON object
//				watsonResponse = data;
				console.log(data);

				for (var x=0; x < watsonResponse.response.length; x++) {
					
					if($scope.validResponsesCount === 5 && x === 0) {
						$scope.showTweetLink = true;
					}else {
						$scope.showTweetLink = false;
					}
					
					if (watsonResponse.response[x] !== "") {
						var currentPost = {
	   				    	'style': 'chat-watson', 
	   				    	'text': watsonResponse.response[x],
	   				    	'name': 'Watson',
	   			    		'datetime': nowService.getCurrentDate(),
	   			    		'showTweetLink': $scope.showTweetLink
						
						};					
						
						$scope.posts.push(currentPost);
			
					}			
				}
				

				var msgCount = $scope.posts.length - 1;
				var scrollTag = 'message' + msgCount.toString();
				console.log('the scroll tag id in chatCtrl.sendDialog.success is ' + scrollTag);
				$location.hash(scrollTag);
				$anchorScroll();

//				$scope.conversationId = watsonResponse.conversation_id;
//				$scope.clientId = watsonResponse.client_id;
			}).
			error(function(data, status, headers, config){
				console.log("in chatCtrl.sendDialog.error: ");
				console.log(JSON.parse(status).toString());
				console.log("HTTP Response Headers for chatCtrl.sendDialog are " + JSON.stringify(headers));
				console.log("There was an error sending the dialog....");
				
			});						
		}

	}; //of sendDialog
	
	//This is a local client-side function to simulate Watson in a totally disconnected mode after the app loads
	$scope.generateLocalWatsonResponses = function() {

		var theInput = $scope.humanResponse.toLowerCase();
		console.log("entering generateLocalWatsonResponses");
		console.log("the human response is - " + theInput + " - and the validResponseCount is " + $scope.validResponsesCount);

		
		if((theInput.indexOf("entertainment") >= 0) && $scope.validResponsesCount === 0 ){
			$scope.localWatsonResponses.push({"message": "Up for a show or concert?  Awesome!  Should we look for midday, afternoon or evening?"});
			$scope.validResponsesCount++;
		}else if((theInput.indexOf("evening") >= 0) && ($scope.validResponsesCount === 1)) {
			$scope.localWatsonResponses.push({"message": "I see last time I advised you in Vegas, you enjoyed shows with dancing.  How about some music this time?"});
			$scope.validResponsesCount++;
		}else if((theInput.indexOf("yes") >= 0 || theInput.indexOf("sounds good") >= 0 || theInput.indexOf("sure") >= 0 || theInput.indexOf("ok") >= 0 || theInput.indexOf("cool") >= 0) && ($scope.validResponsesCount === 2)){
			$scope.localWatsonResponses.push({"message": "Based on your music preferences and available concerts, I recommend jammin' with Michael Monge in the Encore Lounge, Feb 24, 9pm.  Cool?"});
			$scope.validResponsesCount++;
		}else if((theInput.indexOf("far") >= 0) && ($scope.validResponsesCount === 3)){
			$scope.localWatsonResponses.push({"message": "Based on your current geolocation and traffic projections, that is 24 mins in a taxi from Mandalay Bay.  Should I book it?"});
			$scope.validResponsesCount++;			
		}else if((theInput.indexOf("options") >= 0 || theInput.indexOf("closer") >= 0) && ($scope.validResponsesCount === 4)){
			$scope.localWatsonResponses.push({"message": "Your second personalized recommendation is Elton John, here at Mandalay Bay, Feb 24 at 8pm.  How about it?"});
			$scope.validResponsesCount++;			
			
		}else if(theInput.indexOf("book") >= 0 && $scope.validResponsesCount === 5){
			$scope.localWatsonResponses.push({"message": "Great, I located a deal for you on the Elton John tickets, 10% off.  I also just launched and completed an IBM BPM process to book your tickets which are in your email.  Have fun!"});
			$scope.localWatsonResponses.push({"message": "Any other Vegas style advice I can provide today?"});
		
		}else {
			console.log("Do not know how to respond");
			$scope.localWatsonResponses.push({"message": "I apologize, it's been a long night, and now day again, in Vegas!  I didn't quite understand, can you please ask again with easier words for me? Thanks!"});
		}

		console.log("leaving generateLocalWatsonResponses");
	}; // of watson simulator
	
	
	
	//This is the start of the execution of the controller

	cfgService.getConfig().then(function(result) {
		$scope.config = result;
		//This function calls Watson to start the dialog.
		$scope.startDialog();
	});
	
	

	
	
	
	
	
	
	
	
}]);