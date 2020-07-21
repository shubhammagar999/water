/*
 * Login Controller
 */
 //  angular.module('orientfurniture', []).controller('loginCtrl', function($scope, $http) {
function LoginCtrl($scope, $location, $http, $routeParams, $rootScope) {
    
// $scope.apiURL = 'http://pos.restromaticz.com:3005';
	$scope.apiURL = 'http://localhost:3005';
	$scope.companyId = 9;

	// $scope.filteredTodos = [];
	// $scope.apiURL = 'http://mns.3commastechnologies.com:3003';

	// if(localStorage.getItem("watersupply_admin_access_token") != null)
 //      {
 //          window.location = '/citymotorsadmin/';
 //      }

 //    $scope.login = function() {
 //    	$scope.data={
	//         "username": $scope.username,
	//         "password": $scope.password
	//       }

	//      $http({
	//       method: 'POST',
	//       url: $scope.apiURL,
	//       data: $scope.data,
	//       headers: {'Content-Type': 'application/json'}
	//     })
	//     .success(function(login)
	//     {
	//     	window.location.href = '/citymotors/';  
	//     })
	//     .error(function(data) 
	//     {   
	//     	console.log("url"+$scope.apiURL);
	//       console.log("login error");
	                
	//     });
	// }
  
  	$scope.login = function() {
  		if($scope.username == undefined || $scope.username == ""){
  			var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter username.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);  
  		}
  		else if($scope.password == undefined || $scope.password == ""){
  			var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter password..</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);  
  		}
  		else{
                $('#login').attr('disabled','true');
                $('#login').text("please wait...");
  			$http({
		          method: 'POST',
		          url: $scope.apiURL+"/oauth/token",
		          data: 'grant_type=password&username='+ encodeURIComponent($scope.username) +'&password='+ encodeURIComponent($scope.password),
		          headers: {'Content-Type': 'application/x-www-form-urlencoded',
	                    'Authorization' : 'Basic Y2xpZW50S2V5OmNsaWVudFNlY3JldEtleQ=='}
			 })
		  	 .success(function(data, status, headers, config)
		  	 {
			        $http({
			          method: 'POST',
			          url: $scope.apiURL+'/login/isonline',
			          data: 'username='+$scope.username,
			          headers: {'Content-Type': 'application/x-www-form-urlencoded',
	                  'Authorization' :'Bearer '+data.access_token}
			        })
			        .success(function(deliverycount)
			        {	
			        	$scope.user = deliverycount[0].username;
			        	$scope.firstname = deliverycount[0].first_name;
			        	$scope.iconimage = deliverycount[0].icon_image;
				        localStorage.setItem('watersupply_user_type', deliverycount[0].user_type);
				        localStorage.setItem('watersupply_user_emp_id', deliverycount[0].user_emp_id);
				  	 	localStorage.setItem('watersupply_admin_username', $scope.user);
				  	 	localStorage.setItem('watersupply_admin_firstname', $scope.firstname);
				  	 	localStorage.setItem('watersupply_admin_iconimage', $scope.iconimage);
				  	 	localStorage.setItem('watersupply_admin_access_token', data.access_token);
				        localStorage.setItem('watersupply_admin_expires_in', data.expires_in);
				        localStorage.setItem('watersupply_admin_refresh_token', data.refresh_token);
				        localStorage.setItem('watersupply_admin_token_type', data.token_type);
				        var date = new Date(),  
					        day = date.getDate(),  
					        month = date.getMonth(),  
					        year = date.getFullYear();  
					        year1 = date.getFullYear();  
					    if (month < 3)  
					    {  
					        year = year - 1;  
					        year1 = year1;  
					    }  
					    else  
					    {  
					        year = year;  
					        year1 = (year1 + 1);  
					    }  
					    localStorage.setItem('watersupply_admin_financial_year', year + '-' + year1);
                $('#login').text("Login");
                $('#login').removeAttr('disabled');

                		 if(deliverycount[0].user_type == 'admin'){
                		 	window.location = "/watersupply/#/";
                		 }
                		 else{
                		 	window.location = "/watersupply/#/product/add";
                		 }
				         
			        })
			        .error(function(data) 
			        {   
			            //console.log("url"+$scope.apiURL);
			            /*console.log("Oops, Something Went Wrong!");*/
			            var dialog = bootbox.dialog({
			            message: '<p class="text-center">Oops, Something Went Wrong!</p>',
			                closeButton: false
			            });
			            setTimeout(function(){
                $('#login').text("Login");
                $('#login').removeAttr('disabled');
			                dialog.modal('hide');
			            }, 3001);
			        });
		  	 })
		  	 .error(function(data, status, headers, config)
		  	 {
		  	 	var dialog = bootbox.dialog({
	            message: '<p class="text-center">Invalid Username or Password</p>',
	                closeButton: false
	            });
	            setTimeout(function(){
                $('#login').text("Login");
                $('#login').removeAttr('disabled');
	                dialog.modal('hide'); 
	            }, 1500);
		     });
  		}
	}


};


