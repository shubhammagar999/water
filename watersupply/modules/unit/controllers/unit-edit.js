// import admin
angular.module('unit').controller('unitEditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {

 
  $('.index').removeClass("active");
  $('#menuproductintex').addClass("active");
  $('#unitintex').addClass("active");
  
  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will update unit details.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.editUnit();
    }
  });


	$scope.unitId = $routeParams.unitId;
  $scope.apiURL = $rootScope.baseURL+'/unit/edit/'+$scope.unitId;
    $("#um_name").focus();

  $scope.getUnit = function () {
	     $http({
	      method: 'GET',
	      url: $rootScope.baseURL+'/unit/'+$scope.unitId,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(unit)
	    {
	    	unit.forEach(function (value, key) {
	      		$scope.unit = value;
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


  $scope.editUnit = function () {

  	var nameRegex = /^\d+$/;
  		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    
	 
	    if($('#um_name').val() === undefined || $('#um_name').val() === ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter unit name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#um_name").focus();
            }, 1500);
      }
	    else{
                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");

                $http({
                method: 'POST',
                url: $rootScope.baseURL+'/unit/checkname',
                data: $scope.unit,
                headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(orderno)
              {

                if(orderno.length == 1 && $scope.unitId != orderno[0].um_id)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Unit Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("UPDATE  <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                      $("#um_name").focus();
                  }, 1500);  
                }
                else{
	    
				    $http({
				      method: 'POST',
				      url: $scope.apiURL,
				      data: $scope.unit,
				      headers: {'Content-Type': 'application/json',
			                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
				    })
				    .success(function(login)
				    {
		                $('#btnsave').html("UPDATE  <span class='label label-success'>alt+s</span>");
		                $('#btnsave').removeAttr('disabled');
				       window.location.href = '#/unit';  
				    })
				    .error(function(data) 
				    {   
				      var dialog = bootbox.dialog({
			            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
			                closeButton: false
			            });
			            setTimeout(function(){
		                $('#btnsave').html("UPDATE  <span class='label label-success'>alt+s</span>");
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
                  $('#btnsave').html("UPDATE  <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                  }, 1500);            
              });
		}
	};

});