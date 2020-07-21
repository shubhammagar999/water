// import admin
angular.module('dailyexpense').controller('dailyexpenseAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {

  $('.index').removeClass("active");
  $('#menuexpenseindex').addClass("active");
  $('#newdailyexpenseindex').addClass("active");
  
    $scope.expense = {};


    $('#selectbank').hide();
    $('#cheq').hide();
    $('#trans').hide();

    $scope.expense.em_com_id = localStorage.getItem("com_id");

    const fin = localStorage.getItem("watersupply_admin_financial_year");

        const finyr = fin.split('-');
        
    $scope.expense.em_payment_mode = "Cash";
    $scope.expense.em_comment = "N/A";
    $scope.expense.em_received_by = "N/A";
    $("#em_etm_id").focus();

  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will add a new expense.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.addExpense();
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
        $scope.expense.em_date = yyyy +"-"+ (parseInt(mm)+parseInt(1)) +"-"+ dd;
    }
    

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
            $scope.expense.em_bkm_id = undefined;
            $scope.expense.em_transaction_no = undefined;
            $scope.expense.em_transaction_date = undefined;
            $scope.expense.em_cheque_no = undefined;
            $scope.expense.em_cheque_date = undefined;
        }
    }

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
        else if($scope.expense.em_payment_mode != "Cash" && ($('#em_bkm_id').val() == undefined || $('#em_bkm_id').val() == "" || $scope.expense.em_bkm_id.bkm_id == undefined)){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select bank.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);
        }
        else if($('#em_etm_id').val() == undefined || $('#em_etm_id').val() == ""){
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
        else if($('#dateExpense').val() == undefined || $('#dateExpense').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#dateExpense").focus();
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


                $scope.expensetype={};
            if($scope.expense.em_etm_id.etm_id == undefined){
                $scope.expensetype.etm_type = $('#em_etm_id').val();

                $scope.expensetype.etm_com_id = localStorage.getItem("com_id");

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
                          url: $rootScope.baseURL+'/expensetype/add',
                          data: $scope.expensetype,
                          headers: {'Content-Type': 'application/json',
                                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                        })
                        .success(function(expensetype)
                        {
                            $scope.expense.em_etm_id = expensetype[expensetype.length-1]; 
                            $scope.expense.em_date = $('#dateExpense').val();
                            $scope.apiURL = $rootScope.baseURL+'/dailyexpense/add';
                            $http({
                              method: 'POST',
                              url: $scope.apiURL,
                              data: $scope.expense,
                              headers: {'Content-Type': 'application/json',
                                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                            })
                            .success(function(login)
                            {
                                var dialog = bootbox.dialog({
                                message: '<p class="text-center">Expense Add Successfully!</p>',
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
                });
            }
            else{
                $scope.expense.em_date = $('#dateExpense').val();
                $scope.apiURL = $rootScope.baseURL+'/dailyexpense/add';
                $http({
                  method: 'POST',
                  url: $scope.apiURL,
                  data: $scope.expense,
                  headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                })
                .success(function(login)
                {
                    var dialog = bootbox.dialog({
                    message: '<p class="text-center">Expense Add Successfully!</p>',
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

        }
	};

});