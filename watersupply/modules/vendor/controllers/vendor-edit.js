// import admin
angular.module('vendor').controller('vendorEditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter, hotkeys) {

  
  $('.index').removeClass("active");
  $('#menuvendorindex').addClass("active");
  $('#vendorindex').addClass("active");
  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will update creditors details.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.updateVendor();
    }
  });

    $("#vm_firm_name").focus();
	$scope.vendorId = $routeParams.vendorId;
  $scope.apiURL = $rootScope.baseURL+'/vendor/edit/'+$scope.vendorId;

  $scope.getCities=function(state){
    $rootScope.stateInfo.forEach(function (value, key) {
      if (value.state == state)
      {
        $scope.city = value.cities;
      }
    });
  }

  $scope.capitalize = function () {
    $scope.vendor.vm_gst_no = $filter("uppercase")($scope.vendor.vm_gst_no);
  }

  $scope.getVendor = function () {
	     $http({
	      method: 'GET',
	      url: $rootScope.baseURL+'/vendor/'+$scope.vendorId,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(customerObj)
	    {
	    	customerObj.forEach(function (value, key) {
            value.old_opening_credit = value.vm_opening_credit;
            value.old_opening_debit = value.vm_opening_debit;
            $rootScope.stateInfo.forEach(function (value1, key1) {
              if (value1.state == value.vm_state)
              {
                $scope.city = value1.cities;
              }
            });
	      		$scope.vendor = value;
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


  $scope.updateVendor = function () {

  		var nameRegex = /^\d+$/;
  		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    
	    if($('#vm_firm_name').val() == undefined || $('#vm_firm_name').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            $("#vm_firm_name").focus();
            }, 1500);
        }
      else if($('#vm_gst_no').val() == undefined || $('#vm_gst_no').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter GST no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_gst_no").focus();
            }, 1500);
      }
        else if($('#vm_address').val() == undefined || $('#vm_address').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter address.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_address").focus();
            }, 1500);
        }
        else if($('#vm_state').val() == undefined || $('#vm_state').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter state.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_state").focus();
            }, 1500);
        }
        else if($('#vm_city').val() == undefined || $('#vm_city').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter city.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#vm_city").focus();
            }, 1500);
        }
        else if($('#vm_pin').val() == undefined || $('#vm_pin').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter pin code.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_pin").focus();
            }, 1500);
        }
        else if($('#vm_mobile').val() == undefined || $('#vm_mobile').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Mobile no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_mobile").focus();
            }, 1500);
        }
        // else if(!nameRegex.test($('#vm_mobile').val())){
        //  var dialog = bootbox.dialog({
     //        message: '<p class="text-center">please enter Mobile no. in digits</p>',
     //            closeButton: false
     //        });
     //        dialog.find('.modal-body').addClass("btn-danger");
     //        setTimeout(function(){
     //            dialog.modal('hide'); 
     //        }, 1500);
        // }
        // else if($('#vm_mobile').val().length < 10){
        //     var dialog = bootbox.dialog({
        //     message: '<p class="text-center">please enter a valid Mobile no.</p>',
        //         closeButton: false
        //     });
        //     dialog.find('.modal-body').addClass("btn-danger");
        //     setTimeout(function(){
        //         dialog.modal('hide'); 
        //     }, 1500);
        // }
        else if($('#vm_email_id').val() == undefined || $('#vm_email_id').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter email id.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_email_id").focus();
            }, 1500);
        }
      else if($('#vm_opening_debit').val() == undefined || $('#vm_opening_debit').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter opening debit.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_opening_debit").focus();
            }, 1500);
      }
      else if($('#vm_opening_credit').val() == undefined || $('#vm_opening_credit').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter opening credit.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_opening_credit").focus();
            }, 1500);
      }
      else if($('#vm_agent_name').val() == undefined || $('#vm_agent_name').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter agent name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_agent_name").focus();
            }, 1500);
      }
      else if($('#vm_agent_mobile').val() == undefined || $('#vm_agent_mobile').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter agent contact number.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_agent_mobile").focus();
            }, 1500);
      }
	    else{
                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");


              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/vendor/checkname',
                data: $scope.vendor,
                headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(orderno)
              {

                if(orderno.length == 1 && $scope.vendorId != orderno[0].vm_id)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Creditors Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("UPDATE  <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                      $("#vm_firm_name").focus();
                  }, 1500);  
                }
                else{

          		    $http({
          		      method: 'POST',
          		      url: $scope.apiURL,
          		      data: $scope.vendor,
          		      headers: {'Content-Type': 'application/json',
          	                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
          		    })
          		    .success(function(login)
          		    {
                          $('#btnsave').html("UPDATE  <span class='label label-success'>alt+s</span>");
                          $('#btnsave').removeAttr('disabled');
          		       window.location.href = '#/vendor';  
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