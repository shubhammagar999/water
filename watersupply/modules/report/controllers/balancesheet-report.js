// import admin
angular.module('report').controller('balancesheetReportCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {
  
  $('.index').removeClass("active");
  $('#menureportindex').addClass("active");
  $('#balancesheetreportindex').addClass("active");
  
  $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.entryLimit = 5;
    $scope.filterUser = 0;
    $scope.filterUserend = 1;
    $scope.numPerPage = 10;
    $scope.obj_Main = [];
    $scope.purchaseList = [];
    $scope.totalvalue = 0;

    $('#user-datepicker-from').datetimepicker({
     timepicker:false,
     format:'Y-m-d',
     maxDate:'+1970/01/02',
     scrollInput:false
    });

    $('#user-datepicker-to').datetimepicker({
     timepicker:false,
     format:'Y-m-d',
     maxDate:'+1970/01/02',
     scrollInput:false

    });

$scope.apiURL = $rootScope.baseURL+'/dashboard/balancesheetreport';
   $scope.getAll = function () {
      $scope.filteredTodos = [];
      $scope.currentPage = 1;
      $scope.maxSize = 5;
      $scope.entryLimit = 5;
      $scope.filterUser = 0;
      $scope.filterUserend = 1;
      $scope.numPerPage = 10;
      $scope.obj_Main = [];
      $scope.purchaseList = [];
      $scope.totalvalue = 0;
      $scope.loading1 = 0;

      $http({
	      method: 'GET',
	      url: $scope.apiURL,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")
        }
	    })
	    .success(function(purchaseorder)
	    {
        var amount_balance = 0;

          purchaseorder.forEach(function (value, key) {

              $scope.data = new Date(value.date);
              $scope.data.setHours(0,0,0,0);
              if($scope.fDate <= $scope.data && $scope.tDate >= $scope.data)
              {
                    
                if(value.credit == 0)
                {
                  amount_balance = parseFloat(parseFloat(amount_balance) - parseFloat(value.debit)).toFixed(2);
                }
                else if(value.debit == 0)
                {
                  amount_balance = parseFloat(parseFloat(amount_balance) + parseFloat(value.credit * value.quant)).toFixed(2);
                }
                value.bal = amount_balance;
                // if(amount_balance < 0)
                // {
                //   Math.abs(amount_balance);
                // value.bal = Math.abs(amount_balance);
                //   value.drcr="DR";
                // }
                // else{
                //   value.drcr="CR";
                //   value.bal = amount_balance;
                // }
                $scope.totalvalue =value.bal; 
                $scope.purchaseList.push(value);
              }
              else if($('#user-datepicker-from').val() == "" && $('#user-datepicker-to').val() == ""){
                if(value.credit == 0)
                {
                  amount_balance = parseFloat(parseFloat(amount_balance) - parseFloat(value.debit)).toFixed(2);
                }
                else if(value.debit == 0)
                {
                  amount_balance = parseFloat(parseFloat(amount_balance) + parseFloat(value.credit * value.quant)).toFixed(2);
                }
                value.bal = amount_balance;
                // if(amount_balance < 0)
                // {
                //   Math.abs(amount_balance);
                // value.bal = Math.abs(amount_balance);
                //   value.drcr="DR";
                // }
                // else{
                //   value.drcr="CR";
                //   value.bal = amount_balance;
                // }
                $scope.totalvalue =value.bal;
                $scope.purchaseList.push(value);
              }
          });
	      // purchaseorder.forEach(function (value, key) {
       //            $scope.data = new Date(value.prm_date);
       //            if($scope.fDate <= $scope.data && $scope.tDate >= $scope.data)
       //            {
       //                  $scope.totalvalue = ($scope.totalvalue + parseFloat(value.prm_amount));
       //                  $scope.purchaseList.push(value);
       //            }
       //            else if($('#user-datepicker-from').val() == "" && $('#user-datepicker-to').val() == "")  {
       //                  $scope.totalvalue = ($scope.totalvalue + parseFloat(value.prm_amount));
       //                  $scope.purchaseList.push(value);
       //            }
       //        });

              $scope.$watch("currentPage + numPerPage",
                  function () {
                      var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                      var end = begin + $scope.numPerPage;
                      $scope.filterUserend = begin + 1;
                      $scope.filterUser = end;
                      if ($scope.filterUser >= $scope.purchaseList.length)
                          $scope.filterUser = $scope.purchaseList.length;
                      $scope.filteredTodos = $scope.purchaseList.slice(begin, end);
                  });

              $scope.obj_Main = $scope.purchaseList;
              $scope.loading1 = 1;
              // $scope.$apply(); 
              $('#filter-user-btn').text("Filter");
              $('#filter-user-btn').removeAttr('disabled');
              $('#reset-user-btn').text("Reset");
              $('#reset-user-btn').removeAttr('disabled');
	    })
	    .error(function(data) 
	    {   
              $scope.loading1 = 1;
	      var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);             
	    });
    };

    
    $scope.filter = function () {
    $scope.toDate = $("#user-datepicker-to").val();
    $scope.fromDate = $("#user-datepicker-from").val();
    if(angular.isUndefined($scope.fromDate) || $scope.fromDate === null || $scope.fromDate == "")
      {
         var dialog = bootbox.dialog({
          message: '<p class="text-center">please select from-date.</p>',
              closeButton: false
          });
          dialog.find('.modal-body').addClass("btn-danger");
          setTimeout(function(){
              dialog.modal('hide'); 
          }, 1500);
        return;
      }

      if(angular.isUndefined($scope.toDate) || $scope.toDate === null || $scope.toDate == "")
      {
          var dialog = bootbox.dialog({
          message: '<p class="text-center">please select to-date.</p>',
              closeButton: false
          });
          dialog.find('.modal-body').addClass("btn-danger");
          setTimeout(function(){
              dialog.modal('hide'); 
          }, 1500);
        return;
      }

      $scope.dateFilter = '&startTime='+ $scope.fromDate + '&endTime=' + $scope.toDate;

      $scope.fDate = new Date($scope.fromDate);
      $scope.fDate.setHours(0,0,0,0);
      $scope.tDate = new Date($scope.toDate);
      $scope.tDate.setHours(0,0,0,0);
      if($scope.fDate > $scope.tDate)
      {
          var dialog = bootbox.dialog({
          message: '<p class="text-center">oops!!! to-date greater than from-date.</p>',
              closeButton: false
          });
          dialog.find('.modal-body').addClass("btn-danger");
          setTimeout(function(){
              dialog.modal('hide'); 
          }, 1500);
        return;
      }
      $('#filter-user-btn').attr('disabled','true');
      $('#filter-user-btn').text("please wait...");
      $scope.getAll();

      // $scope.draw();

    };

    Date.prototype.setFromDate = function() {
     var yyyy = this.getFullYear().toString();
     var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
     var dd  = this.getDate().toString();
     if(mm == 0){
    document.getElementById("user-datepicker-from").value = yyyy-1 +"-"+ ("12") +"-"+ (dd[1]?dd:"0"+dd[0]);
   }
   else{
    document.getElementById("user-datepicker-from").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
   }
    };

    Date.prototype.setToDate = function() {
     var yyyy = this.getFullYear().toString();
     var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
     var dd  = this.getDate().toString();
     document.getElementById("user-datepicker-to").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
    

    bootbox.dialog({
      message: "<input class='form-control' type='password' id='pascode'>",
      title: "Enter a password to view balance sheet.",
      buttons: {
        main: {
          label: "Open",
          className: "btn-primary",
          callback: function() {
            if($('#pascode').val() == 'admin'){
              $scope.filter();
            }
            else{
              alert("please enter a correct password.");
              return false;
            }
          }
        }
      }
    });
    

    };

    d = new Date();
    d.setFromDate();
    d.setToDate();

    $scope.reset = function()
    {
      $scope.toDate = "";
      $scope.fromDate = "";
      $('#user-datepicker-from').val("");
      $('#user-datepicker-to').val("");
      $scope.dateFilter = "";
        $('#reset-user-btn').attr('disabled','true');
        $('#reset-user-btn').text("please wait...");
        $scope.getAll();
    };


   //Pagination Function
    $scope.resetpagination = function () {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.filterUserend = begin + 1;
        $scope.filterUser = end;
        if ($scope.filterUser >= $scope.purchaseList.length)
            $scope.filterUser = $scope.purchaseList.length;
        $scope.filteredTodos = $scope.purchaseList.slice(begin, end);
    };
    //search Data
    $scope.getSearch = function () {
        $scope.searchtext = $("#searchtext").val();
        $scope.purchaseList = [];
        if ($scope.searchtext !== "") {
            for (var i = 0; i < $scope.obj_Main.length; i++) {
                if (String($scope.obj_Main[i].prm_invoice_no).toLowerCase().includes($scope.searchtext.toLowerCase())
                    || String($scope.obj_Main[i].prm_inward_no).toLowerCase().includes($scope.searchtext.toLowerCase())
                    || String($scope.obj_Main[i].vm_firm_name).toLowerCase().includes($scope.searchtext.toLowerCase())
                    || String($scope.obj_Main[i].prm_credit).toLowerCase().includes($scope.searchtext.toLowerCase())
                    || String($scope.obj_Main[i].prm_amount).toLowerCase().includes($scope.searchtext.toLowerCase())
                ) {
                    $scope.purchaseList.push($scope.obj_Main[i]);
                }
            }
        }
        else {
            $scope.purchaseList = [];
            $scope.purchaseList = $scope.obj_Main;
        }
        $scope.resetpagination();
        $scope.$apply();
    };

    $scope.viewExpenseDetails = function(index) {
      $('#cheq').hide();
      $scope.expense = [];
        $scope.apiURL = $rootScope.baseURL+'/dailyexpense/'+$scope.filteredTodos[index].spm_id;
        $http({
          method: 'GET',
          url: $scope.apiURL,
          headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
        })
        .success(function(expense)
        {
            expense.forEach(function (value, key) {
                value.em_date = $filter('date')(value.em_date, "dd-MM-yyyy");
                if(value.em_payment_mode == "Cheque"){
                    $('#cheq').show();
                    value.em_cheque_date = $filter('date')(value.em_cheque_date, "dd-MM-yyyy");
                }
                $scope.expense = value;
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

  $scope.viewSaleDetails = function (index) {
    
    $scope.product = [];

      $http({
        method: 'GET',
        url: $rootScope.baseURL+'/dashboard/saledetails/'+$scope.filteredTodos[index].spm_id,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(product)
      {
        product.forEach(function (value, key) {
            value.total = (value.spm_rate);
            value.vat = parseFloat((value.spm_vat/100) * value.total).toFixed(2);
            value.sgst = parseFloat((value.spm_sgst/100) * value.total).toFixed(2);
            value.igst = parseFloat((value.spm_igst/100) * value.total).toFixed(2);
            value.disc = parseFloat((value.spm_discount/100) * value.total).toFixed(2);
          value.ppm_total = Math.round(parseFloat(value.total) + parseFloat(value.vat)+parseFloat(value.sgst)+parseFloat(value.igst)-parseFloat(value.disc));
          
          value.dis = parseFloat(value.spm_purchase_price * value.ctm_discount/100).toFixed(2);
          value.discnt = parseFloat(parseFloat(value.spm_purchase_price) - parseFloat(value.dis)).toFixed(2);
          value.sg = parseFloat(value.discnt * value.ctm_vat/100).toFixed(2);
          value.cg = parseFloat(value.discnt * value.ctm_sgst/100).toFixed(2);
          value.ig = parseFloat(value.discnt * value.ctm_igst/100).toFixed(2);
          value.di = parseFloat(value.spm_rate * $scope.discper/100).toFixed(0);

          value.sm_profit = value.ppm_total - (parseFloat(parseFloat(value.discnt)+parseFloat(value.sg)+parseFloat(value.cg)+parseFloat(value.ig)));
          value.sm_date = $filter('date')(value.sm_date, "dd-MM-yyyy");
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

});