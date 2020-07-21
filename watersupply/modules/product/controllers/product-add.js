// import admin
angular.module('product').controller('productAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {

  
  $('.index').removeClass("active");
  $('#menuproductintex').addClass("active");
  $('#newproductintex').addClass("active");
  
    $scope.product = {};
    $scope.product.pm_com_id = 9;
    $scope.product.pm_name = 'bottle';
    $scope.product.pm_opening_quantity = 0; d
    $scope.product.pm_price = 0;
    $scope.product.pm_sale_price = 0;
    $scope.product.pm_hsn = 0;
    $scope.product.pm_discount = 0;
    $scope.product.pm_cgst = 0;
    $scope.product.pm_sgst = 0;
    $scope.product.pm_igst = 0;
    $scope.limit ={};
  $("#pm_cm_id").focus();
    // $scope.product.m_com_id = 9;


    const fin = localStorage.getItem("watersupply_admin_financial_year");
    $scope.product.user_emp_id = localStorage.getItem("watersupply_user_emp_id");

        const finyr = fin.split('-');
        const finyr1 = finyr[0].toString().substring(2);
        const finyr2 = finyr[1].toString().substring(2);
        $scope.limit.fin_year = "%/"+finyr1+"-"+finyr2+"%";

        $("#pm_name").focus();

  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will add a new product.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.addProduct();
    }
  });

  var d = new Date();
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth()).toString(); // getMonth() is zero-based
    var dd  = d.getDate().toString();

    var from = Date.parse((finyr[0].toString()) + '/04/01');
    var to   = Date.parse((finyr[1].toString()) + '/03/31');
    var check = Date.parse(d);

    if((check <= to && check >= from))
    {
        $scope.product.pm_date = yyyy +"-"+ (parseInt(mm)+parseInt(1)) +"-"+ dd;
    }


   $('#pDate').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.product.pm_date = $('#pDate').val();
        }
    });

    $scope.getSearchCust = function(vals) {

      var searchTerms = {search: vals, com_id: 9};
      

        const httpOptions = {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
          }
        };
        return $http.post($rootScope.baseURL+'/customer/typeahead/search', searchTerms, httpOptions).then((result) => {
          
          return result.data;
      });
    };

	$scope.apiURL = $rootScope.baseURL+'/product/add';
    $scope.addProduct = function () {
		  var nameRegex = /^\d+$/;
  		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    
      if($('#pm_cm_id').val() == undefined || $('#pm_cm_id').val() == "" || $scope.product.pm_cm_id.cm_id == undefined){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please select vendor name</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#pm_cm_id").focus();
            }, 1500);
      }
      else if($('#pDate').val() == undefined || $('#pDate').val() == ""){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#pDate").focus(); 
            }, 1500);
	    }
      else if($('#pm_qty_filled').val() == undefined || $('#pm_qty_filled').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter quantity for filled bottle or 0.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');
                $("#pm_qty_filled").focus();  
            }, 1500);
        }
      else if($('#pm_qty_empty').val() == undefined || $('#pm_qty_empty').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter quantity for empty bottle or 0.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#pm_qty_empty").focus(); 
            }, 1500);
        }
	    else{
console.log('k2');
            $http({
              method: 'POST',
              url: $scope.apiURL,
              data: $scope.product,
              headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            })
            .success(function(login)
            {
                var dialog = bootbox.dialog({
                  message: '<p class="text-center">Product Add Successfully!</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                    $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
                    $('#btnsave').removeAttr('disabled');
                    $route.reload();
                    dialog.modal('hide'); 

                        // $scope.product.pm_type = '';
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
	};

});