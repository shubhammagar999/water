// import admin
angular.module('cash').controller('cashEditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {

 
  $('.index').removeClass("active");
  $('#menubankindex').addClass("active");
  $('#cashintex').addClass("active");
  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will update cash details.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.editCash();
    }
  });


	$scope.cashId = $routeParams.cashId;
  $scope.apiURL = $rootScope.baseURL+'/cash/edit/'+$scope.cashId;
    $("#um_name").focus();

  $scope.getCash = function () {
	     $http({
	      method: 'GET',
	      url: $rootScope.baseURL+'/cash/'+$scope.cashId,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(cash)
	    {
	    	cash.forEach(function (value, key) {
            value.old_chm_opening_amount = value.chm_opening_amount;
	      		$scope.cash = value;
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


  $scope.editCash = function () {

  	
	    if($('#chm_opening_amount').val() === undefined || $('#chm_opening_amount').val() === ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter cash in hand amount.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#chm_opening_amount").focus();
            }, 1500);
      }
	    else{
                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");

                $http({
                method: 'POST',
                url: $rootScope.baseURL+'/cash/checkname',
                data: $scope.cash,
                headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(orderno)
              {

                if(orderno.length == 1 && $scope.cashId != orderno[0].chm_id)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Cash Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("UPDATE  <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                      $("#chm_opening_amount").focus();
                  }, 1500);  
                }
                else{
	    
				    $http({
				      method: 'POST',
				      url: $scope.apiURL,
				      data: $scope.cash,
				      headers: {'Content-Type': 'application/json',
			                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
				    })
				    .success(function(login)
				    {
		                $('#btnsave').html("UPDATE  <span class='label label-success'>alt+s</span>");
		                $('#btnsave').removeAttr('disabled');
				       window.location.href = '#/cash';  
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