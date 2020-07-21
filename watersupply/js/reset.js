/*
 * Reset Controller
 */
 //  angular.module('orientfurniture', []).controller('loginCtrl', function($scope, $http) {
function ResetCtrl($scope, $location, $http, $routeParams, $rootScope) {
    
	$scope.apiURL = 'http://localhost:3005';
	// $scope.apiURL = 'http://pos.restromaticz.com:3005';

	var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : sParameterName[1];
	        }
    	}
	};
	var tech = getUrlParameter('token');

  	$scope.reset = {};
  
  	$scope.resetPassword = function() {
  		// var passwordRegex = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;

  		if($scope.reset.password == undefined || $scope.reset.password == ""){
		    var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter password.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');
		    $('#password').focus(); 
            }, 1500);  
  		}
  		else if($scope.reset.conpassword == undefined || $scope.reset.conpassword == ""){
		    var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter confirm password.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');
		    $('#conpassword').focus(); 
            }, 1500); 
  		}

  		else if($('#password').val() != $('#conpassword').val()){
		    var dialog = bootbox.dialog({
	            message: '<p class="text-center">please entered does not match.. please try again.</p>',
	                closeButton: false
	            });
	            dialog.find('.modal-body').addClass("btn-danger");
	            setTimeout(function(){
	                dialog.modal('hide');
			    $('#password').focus(); 
	            }, 1500); 

                // $scope.reset.password="";
                $scope.reset.conpassword=""; 
        }
  		else{
  			$('#resetPassword').attr('readonly','true'); 
		    $('#resetPassword').text('Please Wait..');
  			$http({
		      method: 'POST',
		      url: $scope.apiURL+'/emailsent/reset/'+tech,
		      data: $scope.reset,
		      headers: {'Content-Type': 'application/json'}
		    })
		    .success(function(login)
		    {
		    	if(login == 'Token not Found')
		    	{	
		    	
				    var dialog = bootbox.dialog({
			            message: '<p class="text-center">Invalid Token or Token Expired.</p>',
			                closeButton: false
			            });
			            dialog.find('.modal-body').addClass("btn-danger");
			            setTimeout(function(){
			            	window.location.href='forgot.html';
			                dialog.modal('hide'); 
			            }, 1500);  
		    	}
		    	else
		    	{	
		    	    var dialog = bootbox.dialog({
			            message: '<p class="text-center">Password Updated Successfully.</p>',
			                closeButton: false
			            });
			            dialog.find('.modal-body').addClass("btn-success");
			            setTimeout(function(){
			            	window.location.href='login.html';
			                dialog.modal('hide'); 
			            }, 1500);  
	    		}
		    })
		    .error(function(data) 
		    {   
		            var dialog = bootbox.dialog({
			            message: '<p class="text-center">Oops, Something Went Wrong!</p>',
			                closeButton: false
			            });
			            setTimeout(function(){
			                $('#resetPassword').text("Update Password");
        			        $('#resetPassword').removeAttr('disabled');
			                dialog.modal('hide');
			            }, 3001);
		    });

			
  		}
	};




}


