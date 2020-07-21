// import admin
angular.module('employee').controller('employeeEditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {


 
  $('.index').removeClass("active");
  $('#menuemployeeindex').addClass("active");
  $('#employeeindex').addClass("active");
  
   hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will update employee details.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.editEmployee();
    }
  });

    $("#emp_name").focus();
	$scope.employeeId = $routeParams.employeeId;
  $scope.apiURL = $rootScope.baseURL+'/employee/edit/'+$scope.employeeId;



    $scope.getPermission = function(){
       if ($scope.user_type == 'emp') 
        {
            window.location.href = '#/404/'; 
        }
    };
    $scope.getPermission();
    
  $scope.getEmployee = function () {
	     $http({
	      method: 'GET',
	      url: $rootScope.baseURL+'/employee/'+$scope.employeeId,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(customerObj)
	    {
	    	customerObj.forEach(function (value, key) {
	      		$scope.employee = value;
              });
      		  
	    })
	    .error(function(data) 
	    {   
	      var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);            
	    });
	};


  $scope.editEmployee = function () {

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
              .success(function(orderno)
              {

                if(orderno.length == 1 && $scope.employeeId != orderno[0].emp_id)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Employee Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
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
                          $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                          $('#btnsave').removeAttr('disabled');
          		       window.location.href = '#/employee';  
          		    })
          		    .error(function(data) 
          		    {   
          		      var dialog = bootbox.dialog({
          	            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
          	                closeButton: false
          	            });
          	            setTimeout(function(){
                          $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
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
                  $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                  }, 1500);            
              });
		}
	};

});