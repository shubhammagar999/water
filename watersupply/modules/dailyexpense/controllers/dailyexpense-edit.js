// import admin
angular.module('dailyexpense').controller('dailyexpenseEditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter, hotkeys) {

  $('.index').removeClass("active");
  $('#menuexpenseindex').addClass("active");
  $('#dailyexpenseindex').addClass("active");
  
    $scope.emId = $routeParams.dailyexpenseId;

    $("#em_etm_id").focus();
  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will update expense details.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.addExpense();
    }
  });

    const fin = localStorage.getItem("watersupply_admin_financial_year");

        const finyr = fin.split('-');

    $('#selectbank').hide();
    $('#cheq').hide();
    $('#trans').hide();

    $('#dateExpense').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.expense.em_date = $('#dateExpense').val();
            // $('#end-date-picker').val(endDate); 
        }
    });

    $('#em_cheque_date').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.expense.em_cheque_date = $('#em_cheque_date').val();
            // $('#end-date-picker').val(endDate); 
        }
    });

    $('#em_transaction_date').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.expense.em_transaction_date = $('#em_transaction_date').val();
            // $('#end-date-picker').val(endDate); 
        }
    });

    $scope.getSearch = function(vals) {

      var searchTerms = {search: vals, com_id: localStorage.getItem("com_id")};
      

        const httpOptions = {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
          }
        };
        return $http.post($rootScope.baseURL+'/expensetype/typeahead/search', searchTerms, httpOptions).then((result) => {
          
          return result.data;
      });
  };

    $scope.getSearchBank = function(vals) {

      var searchTerms = {search: vals, com_id: localStorage.getItem("com_id")};
      

        const httpOptions = {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
          }
        };
        return $http.post($rootScope.baseURL+'/bank/typeahead/search', searchTerms, httpOptions).then((result) => {
          
          return result.data;
      });
    };


    $scope.chequeShow = function(){
        if ($scope.expense.em_payment_mode == "Cheque") {
            $('#trans').hide();
            $('#selectbank').show();
            $('#cheq').show();
            $scope.expense.em_transaction_no = undefined;
            $scope.expense.em_transaction_date = undefined;
        }
        else if ($scope.expense.em_payment_mode == "Bank Transfer") {
            $('#cheq').hide();
            $('#selectbank').show();
            $('#trans').show();
            $scope.expense.em_cheque_no = undefined;
            $scope.expense.em_cheque_date = undefined;
        }
        else{
            $('#selectbank').hide();
            $('#trans').hide();
            $('#cheq').hide();
            $scope.expense.em_bkm = undefined;
            $scope.expense.em_transaction_no = undefined;
            $scope.expense.em_transaction_date = undefined;
            $scope.expense.em_cheque_no = undefined;
            $scope.expense.em_cheque_date = undefined;
        }
    }

    $scope.getExpenseList = function() {
        $scope.apiURL = $rootScope.baseURL+'/dailyexpense/'+$scope.emId;
        $http({
          method: 'GET',
          url: $scope.apiURL,
          headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
        })
        .success(function(expense)
        {
            expense.forEach(function (value, key) {
                value.em_date = $filter('date')(value.em_date, "yyyy-MM-dd");
                value.old_em_payment_mode = value.em_payment_mode;
                if(value.em_payment_mode == "Cheque"){
                    $('#trans').hide();
                    $('#selectbank').show();
                    $('#cheq').show();
                    value.em_cheque_date = $filter('date')(value.em_cheque_date, "yyyy-MM-dd");
                }
                else if(value.em_payment_mode == "Bank Transfer")
                {
                    $('#cheq').hide();
                    $('#selectbank').show();
                    $('#trans').show();
                    value.em_transaction_date = $filter('date')(value.em_transaction_date, "yyyy-MM-dd");
                }
                else{
                    $('#selectbank').hide();
                    $('#trans').hide();
                    $('#cheq').hide();
                }
                value.old_em_amount = value.em_amount;

                $http({
                  method: 'GET',
                  url: $rootScope.baseURL+'/expensetype/'+value.etm_id,
                  headers: {'Content-Type': 'application/json',
                            'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                })
                .success(function(unit)
                {
                  unit.forEach(function (value1, key1) {
                        value.em_etm = value1;
                  });

                  $scope.expense = value;
                      
                })
                .error(function(data) 
                {   
                  var dialog = bootbox.dialog({
                      message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                          closeButton: false
                      });
                      setTimeout(function(){
                          dialog.modal('hide'); 
                      }, 3001);            
                });



                if(value.em_payment_mode != "Cash"){

                    $http({
                      method: 'GET',
                      url: $rootScope.baseURL+'/bank/'+value.bkm_id,
                      headers: {'Content-Type': 'application/json',
                                'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                    })
                    .success(function(unit)
                    {
                      unit.forEach(function (value1, key1) {
                            value.old_em_bkm_id = value1;
                            value.em_bkm = value1;
                      });

                      $scope.expense = value;
                          
                    })
                    .error(function(data) 
                    {   
                      var dialog = bootbox.dialog({
                          message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                              closeButton: false
                          });
                          setTimeout(function(){
                              dialog.modal('hide'); 
                          }, 3001);            
                    });

                }
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
    $scope.getExpenseList();

    $scope.addExpense = function () {

        var nameRegex = /^\d+$/;
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var numRegex = /^\d+(\.\d{1,2})?$/;
        
        if($scope.expense.em_payment_mode == undefined || $scope.expense.em_payment_mode == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select payment mode.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#em_payment_mode").focus();
            }, 1500);
        }
        else if($scope.expense.em_payment_mode != "Cash" && ($('#em_bkm_id').val() == undefined || $('#em_bkm_id').val() == "" || $scope.expense.em_bkm.bkm_id == undefined)){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select bank.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);
        }
        else if($('#em_etm_id').val() == undefined || $('#em_etm_id').val() == "" || $scope.expense.em_etm.etm_id == undefined){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select type.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#em_etm_id").focus();
            }, 1500);
        }
        else if($('#em_comment').val() == undefined || $('#em_comment').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter comment or N/A.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#em_comment").focus();
            }, 1500);
        }
        else if($('#em_amount').val() == undefined || $('#em_amount').val() == "" || !numRegex.test($('#em_amount').val())){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter amount.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#em_amount").focus(); 
            }, 1500);
        }
        else if($scope.expense.em_payment_mode === "Cheque" && ($('#em_cheque_no').val() == undefined || $('#em_cheque_no').val() == "" || $('#em_cheque_no').val().length < 6 || !nameRegex.test($('#em_cheque_no').val()))){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter a valid cheque no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#em_cheque_no").focus(); 
            }, 1500);
        }
        else if($scope.expense.em_payment_mode === "Cheque" && ($('#em_cheque_date').val() == undefined || $('#em_cheque_date').val() == "")){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select cheque date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#em_cheque_date").focus(); 
            }, 1500);
        }
        else if($scope.expense.em_payment_mode === "Bank Transfer" && ($('#em_transaction_no').val() == undefined || $('#em_transaction_no').val() == "")){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter a transaction no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);
        }
        else if($scope.expense.em_payment_mode === "Bank Transfer" && ($('#em_transaction_date').val() == undefined || $('#em_transaction_date').val() == "")){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select transaction date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);
        }
        else{
                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");
            $scope.apiURL = $rootScope.baseURL+'/dailyexpense/edit/'+$scope.emId;
    	    $http({
    	      method: 'POST',
    	      url: $scope.apiURL,
    	      data: $scope.expense,
    	      headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
    	    })
    	    .success(function(login)
    	    {
                $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                $('#btnsave').removeAttr('disabled');
    	       window.location.href = '#/dailyexpense';  
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