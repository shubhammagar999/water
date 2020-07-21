// import admin
angular.module('expensetype').controller('expensetypeAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {

  $('.index').removeClass("active");
  $('#menuexpenseindex').addClass("active");
  $('#newexpensetypeindex').addClass("active");

    $scope.expensetype = {};

    $scope.expensetype.etm_com_id = localStorage.getItem("com_id");
    $("#etm_type").focus();

    hotkeys.bindTo($scope).add({
      combo: 'alt+s',
      description: 'It will add a new expense type.',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        $scope.addExpensetype();
      }
    });
  
	$scope.apiURL = $rootScope.baseURL+'/expensetype/add';
  	$scope.addExpensetype = function () {
	    
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
              .success(function(login)
              {
                if(login.length > 0)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Expense Type Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
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
          		    .success(function(expensetype)
          		    {
                     var dialog = bootbox.dialog({
                      message: '<p class="text-center">Expense Type Add Successfully!</p>',
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