//var cogBizAppControllers = angular.module('cogBizAppControllers', []);
//In the statement above, the [] at the end tells angular to create a module;
//In the statement below, since it doesn't have [] it acts as a "getter" that I can assign to a variable
//that will allow the rest of the controllers to work
var bmxCurriculumAppControllers = angular.module('bmxCurriculumAppControllers');


bmxCurriculumAppControllers.controller('mainAppCtrl', ['$scope', '$http', '$interval','usrService', function ($scope, $http, $interval, usrService) {
	

	console.log("in mainAppCtrl");

	$scope.partialsViewColumnClass = "col-md-10";
	$scope.showRightSideColumn = false;

    $scope.getUser = function() {
    	usrService.async().then(function(d){
    		console.log("in vm.getUser to retrieve the current user: ");
    		$scope.userData = d;
    		console.log($scope.userData);
    	});	
    };
    
    $scope.getUser();
        

	
}]);

bmxCurriculumAppControllers.controller('landingPageCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

	console.log("in landingPageCtrl");
	
}]);

bmxCurriculumAppControllers.controller('leadsPageCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
	
	console.log("in leadsPageCtrl");
	var currentLead;

    $scope.salesLeads = [];
    
    $scope.reset = function(){
        $scope.salesLeads = [];
    }

	$scope.addLead = function(leadForm){
		console.log("The customer name is " + $scope.firstName + " " + $scope.lastName);
		currentLead = {
			firstName: $scope.firstName,
			lastName: $scope.lastName,
			jobTitle: $scope.jobTitle,
            company: $scope.company,
            email: $scope.email,
            phone: $scope.phone,
            address: $scope.companyAddress,
            city: $scope.companyCity,
            state: $scope.companyState,
            zipcode: $scope.companyZipcode,
            interest: $scope.interest,
            followup: $scope.followup
		};
//		console.log("the current lead is " + JSON.stringify(currentLead));
        $scope.salesLeads.push(currentLead);
        
        // Wipe out the fields on the form
        $scope.firstName = "";
        $scope.lastName = "";
        $scope.jobTitle = "";
        $scope.company = "";
        $scope.email = "";
        $scope.phone = "";
        $scope.companyAddress = "";
        $scope.companyCity = "";
        $scope.companyState = "";
        $scope.companyZipcode = "";
        $scope.interest = "";
        $scope.followup = "";
	
//		console.log("the set of sales leads is " + JSON.stringify($scope.salesLeads));
	};		
}]);


bmxCurriculumAppControllers.controller('claimsPageCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
	
	console.log("in claimsPageCtrl");
	var currentLead;

    $scope.claims = [];
    
    $scope.reset = function(){
        $scope.claims = [];
    }

	$scope.addClaim = function(claimForm){
		console.log("The customer name is " + $scope.firstName + " " + $scope.lastName);
		currentClaim = {
			firstName: $scope.firstName,
			lastName: $scope.lastName,
			jobTitle: $scope.jobTitle,
            company: $scope.company,
            email: $scope.email,
            phone: $scope.phone,
            address: $scope.companyAddress,
            city: $scope.companyCity,
            state: $scope.companyState,
            zipcode: $scope.companyZipcode,
            interest: $scope.interest,
            followup: $scope.followup
		};

        $scope.claims.push(currentClaim);
        
        // Wipe out the fields on the form
        $scope.firstName = "";
        $scope.lastName = "";
        $scope.jobTitle = "";
        $scope.company = "";
        $scope.email = "";
        $scope.phone = "";
        $scope.companyAddress = "";
        $scope.companyCity = "";
        $scope.companyState = "";
        $scope.companyZipcode = "";
        $scope.interest = "";
        $scope.followup = "";
	
	};		
}]);



bmxCurriculumAppControllers.controller('testGridCtrl', ['$scope', '$http',  function ($scope, $http) {

	console.log("in testGridCtrl");
	
  $scope.myData = [
    {
        "firstName": "Cox",
        "lastName": "Carney",
        "company": "Enormo",
        "employed": true
    },
    {
        "firstName": "Lorraine",
        "lastName": "Wise",
        "company": "Comveyer",
        "employed": false
    },
    {
        "firstName": "Nancy",
        "lastName": "Waters",
        "company": "Fuelton",
        "employed": false
    }
];	
	
	
	
	
	
}]);






//angular.module('bmxCurriculumAppControllers', ['ngFileUpload'])
bmxCurriculumAppControllers.controller('uploadCtrl',['$scope', 'Upload', 'usrService', function($scope, Upload, usrService){
        var vm = this;
        
        vm.submit = function(){ //function to call on form submit
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            } else {
            	console.log("In vm.submit and the file is not valid");
            }
        }
        vm.upload = function (file) {
            Upload.upload({
                url: 'upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
            	console.log("The response from uploading the file is: ");
            	console.log(JSON.stringify(resp.data));
//            	vm.fileData = resp.data;

				vm.fileData = {
					worksheets: []
				};

				for (var i = 0; i < resp.data.worksheets.length; i++) {
					var worksheet = {};
					var gridOptions = {};
					var columnDefs = [];
					console.log("the worksheet is: ");
					console.log(JSON.stringify(resp.data.worksheets[i]));
					console.log("The columnNames are:" + JSON.stringify(resp.data.worksheets[i].columnNames));

					if (resp.data.worksheets[i].columnNames) {			
						for (var j = 1; j <= resp.data.worksheets[i].columnNames.length; j++) {
							columnDefs.push({
								field: resp.data.worksheets[i].columnNames[j]
							});
						}
					}else {
						columnDefs.push({name: "No Data Found"});
					}

					//create the gridOptions object for this sheet
					gridOptions.columnDefs = columnDefs;
					gridOptions.data = resp.data.worksheets[i].rows;
					
					//create this sheet
					worksheet.id = resp.data.worksheets[i].id;
					worksheet.name = resp.data.worksheets[i].name;
					worksheet.gridOptions = gridOptions;
					
					//add the sheet to fileData
					vm.fileData.worksheets.push(worksheet);
		
				}
				//testing theory that for the ui grid to work the data has to be in the $scope
				$scope.tempData = vm.fileData;
				console.log("The constructed file data is: ");
            	console.log(JSON.stringify(vm.fileData));
 

            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
//                $window.alert('Error status: ' + resp.status);
            }, function (evt) { 
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
}]);




