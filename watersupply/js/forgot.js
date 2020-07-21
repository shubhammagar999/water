/*
 * Forgot Controller
 */
function ForgotCtrl($scope, $location, $http, $routeParams, $rootScope) {
    
	$scope.apiURL = 'http://localhost:3005';
	// $scope.apiURL = 'http://pos.restromaticz.com:3005';

  	$scope.forgotpass = {};
  
  	$scope.forgot = function() {
  		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
  		if($scope.forgotpass.username == undefined || $scope.forgotpass.username == ""){
  			var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter username.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500); 
  		}
  // 		else if(!emailRegex.test($scope.forgotpass.username)){
      
		//     var dialog = bootbox.dialog({
  //           message: '<p class="text-center">please enter a valid email..</p>',
  //               closeButton: false
  //           });
  //           dialog.find('.modal-body').addClass("btn-danger");
  //           setTimeout(function(){
  //               dialog.modal('hide'); 
  //               $('#username').focus();
  //           }, 1500); 
		// }
  		else{
  			$('#forgot').attr('readonly','true'); 
		    $('#forgot').text('Please Wait..');
  			$http({
	             method: 'POST',
                    url: $scope.apiURL+'/login/check',
                    data: $scope.forgotpass,
                    headers: {'Content-Type': 'application/json'}
	        })
	        .success(function(category)
	        {
		        if(category.length > 0 && (category[0].username == $scope.forgotpass.username)){
		        	
		        		$http({
				            method: 'POST',
				            url: $scope.apiURL+'/emailsent',
				            data: category[0],
				            headers: {'Content-Type': 'application/json'}
				        })
				        .success(function(category)
				        {
				      //   	toastr.success('Email sent Successfully.', 'Success', {
						    //     closeButton: true,
						    //     progressBar: true,
							  	// positionClass: "toast-top-center",
							  	// timeOut: "500",
							  	// extendedTimeOut: "500",
						    // });
						    var dialog = bootbox.dialog({
					            message: '<p class="text-center">Email sent Successfully.</p>',
					                closeButton: false
					            });
					            dialog.find('.modal-body').addClass("btn-success");
					            setTimeout(function(){

					                $('#forgot').html("Send Email");
					                $('#forgot').removeAttr('disabled');
					                $scope.forgotpass.username = '';

					                dialog.modal('hide'); 
					            }, 1500); 

			                
				        })
				        .error(function(data) 
				        {   
				   //          toastr.error('Oop, Something went Wrong', 'Error', {
						 //        closeButton: true,
						 //        progressBar: true,
							//   	positionClass: "toast-top-center",
							//   	timeOut: "500",
							//   	extendedTimeOut: "500",
							// }); 

							 var dialog = bootbox.dialog({
					            message: '<p class="text-center">Oops, Something Went Wrong!</p>',
					                closeButton: false
					            });
					            dialog.find('.modal-body').addClass("btn-danger");
					            setTimeout(function(){
					                    $('#forgot').html("Send Email");
			                			$('#forgot').removeAttr('disabled');
					                dialog.modal('hide');
					            }, 3001);

			                
				        });
		        }
		        else{

				    var dialog = bootbox.dialog({
			            message: '<p class="text-center">Please Enter Correct Username!</p>',
			                closeButton: false
			            });
					    dialog.find('.modal-body').addClass("btn-danger");
			            setTimeout(function(){
			                    $('#forgot').html("Send Email");
	                			$('#forgot').removeAttr('disabled');
			                dialog.modal('hide');
			            }, 3001);



	                
		        }
	        })
	        .error(function(data) 
	        {   
			    var dialog = bootbox.dialog({
		            message: '<p class="text-center">Oops, Something Went Wrong!</p>',
		                closeButton: false
		            });
		            dialog.find('.modal-body').addClass("btn-danger");
		            setTimeout(function(){
		                    $('#forgot').html("Send Email");
                			$('#forgot').removeAttr('disabled'); 
		                dialog.modal('hide');
		            }, 3001);


	        });
  		}
	};

}


