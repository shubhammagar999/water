// import admin
angular.module('expensetype').controller('expensetypeEditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {

  $('.index').removeClass("active");
  $('#menuexpenseindex').addClass("active");
  $('#expensetypeindex').addClass("active");

  
	$scope.etmId = $routeParams.expensetypeId;
    $("#etm_type").focus();

    hotkeys.bindTo($scope).add({
      combo: 'alt+s',
      description: 'It will update expense type details.',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        $scope.editExpensetype();
      }
    });
  $scope.apiURL = $rootScope.baseURL+'/expensetype/edit/'+$scope.etmId;

  $scope.getExpensetype = function () {
	     $http({
	      method: 'GET',
	      url: $rootScope.baseURL+'/expensetype/'+$scope.etmId,
	      // data: $scope.employee,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(expensetype)
	    {
	    	expensetype.forEach(function (value, key) {
	      		$scope.expensetype = value;
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


  $scope.editExpensetype = function () {

  		if($('#etm_type').val() === undefined || $('#etm_type').val() === ""){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter expense type.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#etm_type").focus();
            }, 1500);
	    }
	    else{
                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");


              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/expensetype/checkname',
                data: $scope.expensetype,
                headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(orderno)
              {
                if(orderno.length == 1 && $scope.etmId != orderno[0].etm_id)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Expense Type Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                      $("#etm_type").focus();
                  }, 1500);  
                }
                else{

          		    $http({
          		      method: 'POST',
          		      url: $scope.apiURL,
          		      data: $scope.expensetype,
          		      headers: {'Content-Type': 'application/json',
          	                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
          		    })
          		    .success(function(login)
          		    {
                          $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                          $('#btnsave').removeAttr('disabled');
          		       window.location.href = '#/expensetype';  
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