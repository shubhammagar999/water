// import admin
angular.module('employee').controller('employeeAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {



  $('.index').removeClass("active");
  $('#menuemployeeindex').addClass("active");
  $('#newemployeeindex').addClass("active");
  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will add a new employee.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.addEmployee();
    }
  });

	$scope.employee = {};

    $scope.employee.emp_com_id = localStorage.getItem("com_id");
    $scope.employee.emp_type = "emp";
    $scope.employee.log_status = true;
    // $scope.employee.emp_mobile = "N/A";
    // $scope.employee.emp_address = "N/A";
    $("#emp_name").focus();

    $scope.getPermission = function(){
       if ($scope.user_type == 'emp') 
        {
            window.location.href = '#/404/'; 
        }
    };
    $scope.getPermission();

	$scope.apiURL = $rootScope.baseURL+'/employee/add';
  $scope.addEmployee = function () {
	    
	    var nameRegex = /^\d+$/;
  		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    
	 
	    if($('#emp_name').val() === undefined || $('#emp_name').val() === ""){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter employee name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#emp_name").focus();
            }, 1500);
	    }
      else  if($('#emp_id_card').val() === undefined || $('#emp_id_card').val() === ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter employee id.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#emp_id_card").focus();
            }, 1500);
      }
	    else if($('#emp_mobile').val() == undefined || $('#emp_mobile').val() == ""){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Mobile no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');
                $("#emp_mobile").focus(); 
            }, 1500);
	    }
	    else if(!nameRegex.test($('#emp_mobile').val())){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Mobile no. in digits</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);
	    }
	    else if($('#emp_address').val() == undefined || $('#emp_address').val() == ""){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter address.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#emp_address").focus();
            }, 1500);
	    }
      else  if($('#emp_username').val() === undefined || $('#emp_username').val() === ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter employee username.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#emp_username").focus();
            }, 1500);
      }
      else  if($('#emp_password').val() === undefined || $('#emp_password').val() === ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter employee password.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#emp_password").focus();
            }, 1500);
      }
      else  if($('#emp_email').val() === undefined || $('#emp_email').val() === ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter employee email.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#emp_email").focus();
            }, 1500);
      }

	    else{
              $('#btnsave').attr('disabled','true');
              $('#btnsave').text("please wait...");

              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/employee/checkname',
                data: $scope.employee,
                headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(login)
              {

                if(login.length > 0)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Employee Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                      $("#emp_name").focus();
                  }, 1500);  
                }
                else{
          		    $http({
          		      method: 'POST',
          		      url: $scope.apiURL,
          		      data: $scope.employee,
          		      headers: {'Content-Type': 'application/json',
          	                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
          		    })
          		    .success(function(login)
          		    {
                      var dialog = bootbox.dialog({
                        message: '<p class="text-center">Employee Add Successfully!</p>',
                            closeButton: false
                        });
                        setTimeout(function(){
                          $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
                          $('#btnsave').removeAttr('disabled');
                          $route.reload();
                          dialog.modal('hide'); 
                        }, 1000);
          		    })
          		    .error(function(data) 
          		    {   
          		      var dialog = bootbox.dialog({
          	            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
          	                closeButton: false
          	            });
          	            setTimeout(function(){
                          $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
                          $('#btnsave').removeAttr('disabled');
          	                dialog.modal('hide'); 
          	            }, 1500);            
          		    });
                }
              })
              .error(function(data) 
              {   
                var dialog = bootbox.dialog({
                  message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                  }, 1500);            
              });
		}
	};

});