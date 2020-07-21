// import admin
angular.module('cash').controller('cashAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {


  
  $('.index').removeClass("active");
  $('#menubankindex').addClass("active");
  $('#cashintex').addClass("active");
  
  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will add a new cash.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.addCash();
    }
  });


	$scope.cash = {};

    $("#um_name").focus();
    $scope.cash.chm_com_id = localStorage.getItem("com_id");

	$scope.apiURL = $rootScope.baseURL+'/cash/add';
  $scope.addCash = function () {
	    
	 
	    if($('#chm_amount').val() === undefined || $('#chm_amount').val() === ""){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter cash in hand amount.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#chm_amount").focus();
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
              .success(function(login)
              {

                if(login.length > 0)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Cash Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("SAVE  <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                      $("#chm_amount").focus();
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
                $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
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
		                $('#btnsave').html("SAVE  <span class='label label-success'>alt+s</span>");
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
                  $('#btnsave').html("SAVE  <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                  }, 1500);            
              });
		}
	};

});