// import admin
angular.module('product').controller('productEditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys, $filter) {

  $('.index').removeClass("active");
  $('#menuproductintex').addClass("active");
  $('#productintex').addClass("active");
  
	$scope.productId = $routeParams.productId;
  $scope.apiURL = $rootScope.baseURL+'/product/edit/'+$scope.productId;
    $("#pm_name").focus();

  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will update product details.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.updateProduct();
    }
  });

    $scope.limit = {};
  const fin = localStorage.getItem("watersupply_admin_financial_year");
  const finyr = fin.split('-');
        const finyr1 = finyr[0].toString().substring(2);
        const finyr2 = finyr[1].toString().substring(2);
        $scope.limit.fin_year = "%/"+finyr1+"-"+finyr2+"%";
  // $scope.product.user_emp_id = localStorage.getItem("watersupply_user_emp_id");

  $scope.getProduct = function () {
	     $http({
	      method: 'GET',
	      url: $rootScope.baseURL+'/product/'+$scope.productId,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(product)
	    {
	    	product.forEach(function (value, key) {
              value.pm_date = $filter('date')(value.pm_date, "yyyy-MM-dd");
              value.pm_cm_id = value.cm_search;
              $scope.product = value;
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

    var d = new Date();
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth()).toString(); // getMonth() is zero-based
    var dd  = d.getDate().toString();

    var from = Date.parse((finyr[0].toString()) + '/04/01');
    var to   = Date.parse((finyr[1].toString()) + '/03/31');
    var check = Date.parse(d);

    // if((check <= to && check >= from))
    // {
    //     $scope.product.pm_date = yyyy +"-"+ (parseInt(mm)+parseInt(1)) +"-"+ dd;
    // }


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
  $scope.updateProduct = function () {
  		var nameRegex = /^\d+$/;
  		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    
	    if($('#pDate').val() == undefined || $('#pDate').val() == ""){
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

                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");
                $http({
                  method: 'POST',
                  url: $scope.apiURL,
                  data: $scope.product,
                  headers: {'Content-Type': 'application/json',
                            'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                })
                .success(function(login)
                {
                        $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                        $('#btnsave').removeAttr('disabled');
                   window.location.href = '#/product/list';  
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
            // $http({
            //     method: 'POST',
            //     url: $rootScope.baseURL+'/product/checkname',
            //     data: $scope.product,
            //     headers: {'Content-Type': 'application/json',
            //             'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            //   })
            //   .success(function(login)
            //   {
            //     if(login.length == 1 && $scope.productId != login[0].pm_id)
            //     {
            //       var dialog = bootbox.dialog({
            //       message: '<p class="text-center">Product Already exists.</p>',
            //           closeButton: false
            //       });
            //       setTimeout(function(){
            //       $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
            //       $('#btnsave').removeAttr('disabled');
            //           dialog.modal('hide'); 
            //           $("#pm_name").focus();
            //       }, 1500);  
            //     }
            //     else{

        		    
            //     }
            //   })
            //   .error(function(data) 
            //   {   
            //     var dialog = bootbox.dialog({
            //       message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
            //           closeButton: false
            //       });
            //       setTimeout(function(){
            //       $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
            //       $('#btnsave').removeAttr('disabled');
            //           dialog.modal('hide'); 
            //       }, 1500);            
            //   });
		}
	};

});