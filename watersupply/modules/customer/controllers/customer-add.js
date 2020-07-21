// import admin
angular.module('customer').controller('customerAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter, hotkeys) {

  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will add a new debtors.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.addCustomer();
    }
  });

  $('.index').removeClass("active");
  $('#menucustomerindex').addClass("active");
  $('#newcustomerindex').addClass("active");

  $scope.customer = {};

  $scope.customer.cm_com_id = 9;
  $scope.customer.cm_email = "N/A";
  $scope.customer.cm_gst_no = "N/A";
  $scope.customer.cm_opening_debit = 0;
  $scope.customer.cm_opening_credit = 0;
  $scope.limit ={};
  $("#cm_name").focus();

    $scope.getPermission = function(){
       if ($scope.user_type == 'emp') 
        {
            window.location.href = '#/404/'; 
        }
    };
    $scope.getPermission();

  $scope.capitalize = function () {
    $scope.customer.cm_gst_no = $filter("uppercase")($scope.customer.cm_gst_no);
  }

  $scope.getCities=function(state){
    $rootScope.stateInfo.forEach(function (value, key) {
      if (value.state == state)
      {
        $scope.city = value.cities;
      }
    });
  }

   const fin = localStorage.getItem("watersupply_admin_financial_year");
    // $scope.product.user_emp_id = localStorage.getItem("watersupply_user_emp_id");

        const finyr = fin.split('-');
        const finyr1 = finyr[0].toString().substring(2);
        const finyr2 = finyr[1].toString().substring(2);
        $scope.limit.fin_year = "%/"+finyr1+"-"+finyr2+"%";

  var d = new Date();
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth()).toString(); // getMonth() is zero-based
    var dd  = d.getDate().toString();

    var from = Date.parse((finyr[0].toString()) + '/04/01');
    var to   = Date.parse((finyr[1].toString()) + '/03/31');
    var check = Date.parse(d);

    if((check <= to && check >= from))
    {
        $scope.customer.cm_date = yyyy +"-"+ (parseInt(mm)+parseInt(1)) +"-"+ dd;
    }


   $('#cDate').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.customer.cm_date = $('#cDate').val();
        }
    });

   $scope.blurSerialNo = function(){
       if($('#cm_serial_no').val() == undefined || $('#cm_serial_no').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter unique serial number.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_serial_no").focus();
            }, 2500);
        }
        else {

            $http({
                method: 'POST',
                url: $rootScope.baseURL+'/customer/checkserial',
                data: $scope.customer,
                headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(login)
              {
                if(login.length > 0)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Entered serial number is already taken.</p>',
                      closeButton: false
                  });
                  dialog.find('.modal-body').addClass("btn-danger");
                  setTimeout(function(){
                      dialog.modal('hide'); 
                      $scope.customer.cm_serial_no = undefined;
                      $("#cm_serial_no").focus();
                  }, 2500);  
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
                  }, 2500);            
              });
        }

   };

	$scope.apiURL = $rootScope.baseURL+'/customer/add';
    $scope.addCustomer = function () {
		  var nameRegex = /^\d+$/;
  		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    var mobileRegex = /^([0-9]{10})$/;


      if($('#cm_name').val() == undefined || $('#cm_name').val() == ""){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter vendor name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_name").focus();
            }, 2500);
	    }
      else if($('#cm_serial_no').val() == undefined || $('#cm_serial_no').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter unique serial number.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_serial_no").focus();
            }, 2500);
        }
      else if($('#cm_gst_no').val() == undefined || $('#cm_gst_no').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter GST or N/A.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_gst_no").focus();
            }, 2500);
      }
        else if($('#cDate').val() == undefined || $('#cDate').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select start date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cDate").focus();
            }, 2500);
        }
      else if($('#cm_prod_price_set').val() == undefined || $('#cm_prod_price_set').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter product price.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_prod_price_set").focus();
            }, 2500);
      }
      else if($('#cm_address').val() == undefined || $('#cm_address').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter address.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_address").focus();
            }, 2500);
      }
        else if($('#cm_pin').val() == undefined || $('#cm_pin').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter pin code.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_pin").focus();
            }, 2500);
        }
      else if($('#cm_mobile').val() == undefined || $('#cm_mobile').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Mobile no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_mobile").focus();
            }, 2500);
      }
      else if(!mobileRegex.test($('#cm_mobile').val())){
       var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Mobile no. in digits</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 2500);
      }
      else if($('#cm_email').val() == undefined || $('#cm_email').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter email id.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_email").focus();
            }, 2500);
      }
	    else{
          $scope.customer.cm_balance = 0;
          $('#btnsave').attr('disabled','true');
          $('#btnsave').text("please wait...");

              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/customer/checkname',
                data: $scope.customer,
                headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(login)
              {

                if(login.length > 0)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Vendor Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("SAVE  <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                      $("#cm_name").focus();
                  }, 2500);  
                }
                else{

                  $http({
                    method: 'POST',
                    url: $scope.apiURL,
                    data: $scope.customer,
                    headers: {'Content-Type': 'application/json',
                            'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                  })
                  .success(function(login)
                  {
                      var dialog = bootbox.dialog({
                        message: '<p class="text-center">Client Added Successfully!</p>',
                            closeButton: false
                        });
                         dialog.find('.modal-body').addClass("btn-success");
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
                      }, 2500);            
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
                  }, 2500);            
              });
		}
	};

});