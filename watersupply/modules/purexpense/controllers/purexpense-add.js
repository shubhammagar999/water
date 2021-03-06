// import admin
angular.module('purexpense').controller('purexpenseAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, hotkeys) {


  $('.index').removeClass("active");
  $('#menuvendorindex').addClass("active");
  $('#newpurexpenseindex').addClass("active");
  
    $scope.expense = {};
    $scope.expense.em_comment = "N/A";
    $scope.expense.em_received_by = "N/A";
    $scope.expense.em_com_id = localStorage.getItem("com_id");

    const fin = localStorage.getItem("watersupply_admin_financial_year");

        const finyr = fin.split('-');

    $('#selectbank').hide();
    $('#cheq').hide();
    $('#trans').hide();
    $scope.expense.em_payment_mode = "Cash";
    $("#vm_id").focus();


  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will add a new creditors payment entry.',
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

    
  //   $scope.getSearch = function(vals) {

  //     var searchTerms = {search: vals, com_id: localStorage.getItem("com_id")};
      
  //       const httpOptions = {
  //         headers: {
  //           'Content-Type':  'application/json',
  //           'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
  //         }
  //       };
  //       return $http.post($rootScope.baseURL+'/vendor/typeahead/search', searchTerms, httpOptions).then((result) => {
          
  //         return result.data;
  //     });
  // };

  $scope.getSearch = function(vals) {

      var searchTerms = {search: vals, com_id: localStorage.getItem("com_id")};
      
        const httpOptions = {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
          }
        };
        return $http.post($rootScope.baseURL+'/dashboard/vendorreport/typeahead/search', searchTerms, httpOptions).then((result) => {
          
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
        else if($('#vm_id').val() == undefined || $('#vm_id').val() == "" || $scope.expense.em_vm_id.vm_id == undefined){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
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
            }, 1500);
        }
        else if($('#em_comment').val() == undefined || $('#em_comment').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter description or N/A.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
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
                $scope.expense.em_vm_id.vm_balance =$scope.expense.em_vm_id.credit;
                $scope.expense.em_vm_id.vm_debit = $scope.expense.em_vm_id.debit;
            
                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");
            $scope.expense.em_date = $('#dateExpense').val();
            $scope.apiURL = $rootScope.baseURL+'/purexpense/add';
            $http({
              method: 'POST',
              url: $scope.apiURL,
              data: $scope.expense,
              headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            })
            .success(function(login)
            {
                $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
                $('#btnsave').removeAttr('disabled');
               window.location.href = '#/purexpense';  
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