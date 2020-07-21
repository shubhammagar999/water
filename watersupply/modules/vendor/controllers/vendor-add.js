// import admin
angular.module('vendor').controller('vendorAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter, hotkeys) {

  // You can pass it an object.  This hotkey will not be unbound unless manually removed
  // using the hotkeys.del() method
  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will add a new creditors.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.addVendor();
    }
  });
  
  $('.index').removeClass("active");
  $('#menuvendorindex').addClass("active");
  $('#newvendorindex').addClass("active");

  
    $scope.vendor = {};
    $scope.vendor.vm_com_id = localStorage.getItem("com_id");
    $scope.vendor.vm_mobile = "N/A";
    $scope.vendor.vm_email_id = "N/A";
    $scope.vendor.vm_address = "N/A";
    $scope.vendor.vm_gst_no = "N/A";
    // $scope.vendor.vm_state = "Maharashtra";
    // $scope.vendor.vm_city = "Pune";
    $scope.vendor.vm_pin = "N/A";
    $scope.vendor.vm_opening_debit = 0;
    $scope.vendor.vm_opening_credit = 0;
    $scope.vendor.vm_agent_name = "N/A";
    $scope.vendor.vm_agent_mobile = "N/A";
    $("#vm_firm_name").focus();

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

    $scope.press = function($event, hotKeyRef) {
        console.log(hotKeyRef);
        if ($event.keyCode==hotKeyRef) {
            console.log("test");
        }
    }

	$scope.apiURL = $rootScope.baseURL+'/vendor/add';

    $scope.addVendor = function () {
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
            message: '<p class="text-center">please select state.</p>',
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
            message: '<p class="text-center">please select city.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#vm_city").focus();
            }, 1500);
        }
        else if($('#vm_pin').val() == undefined || $('#vm_pin').val() == ""){
            console.log($scope.vendor.vm_state +" "+$scope.vendor.vm_city);
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
              .success(function(login)
              {

                if(login.length > 0)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Creditors Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("SAVE  <span class='label label-success'>alt+s</span>");
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
                      var dialog = bootbox.dialog({
                        message: '<p class="text-center">Creditors Add Successfully!</p>',
                            closeButton: false
                        });
                        setTimeout(function(){
                          $('#btnsave').html("SAVE  <span class='label label-success'>alt+s</span>");
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