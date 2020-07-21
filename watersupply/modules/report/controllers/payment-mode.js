// import admin
angular.module('report').controller('payModeCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {

  $('.index').removeClass("active");
  $('#menureportindex').addClass("active");
  $('#salereportindex').addClass("active");
    
  $('#printTable').hide();
  $scope.cash = 0;
  $scope.card = 0;
  $scope.credit = 0;
   $scope.purchase_cash = 0;
  $scope.purchase_credit = 0;
    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.entryLimit = 5;
    $scope.filterUser = 0;
    $scope.filterUserend = 1;
    $scope.numPerPage = 10;
    $scope.obj_Main = [];
    $scope.saleList = [];
    $scope.totalvalue = 0;
    $scope.loading1 = 0;

    const fin = localStorage.getItem("watersupply_admin_financial_year");
    const finyr = fin.split('-');

    $('#user-datepicker-from').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        // onChangeDateTime: function (dp, $input) {
        //     $scope.sale.sm_from_date = $('#user-datepicker-from').val();
        // }
     // timepicker:false,
     // format:'Y-m-d',
     // maxDate:'+1970/01/02',
     // scrollInput:false
    });

  
    $('#user-datepicker-to').datetimepicker({
     
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar

    });
$scope.apiURL = $rootScope.baseURL+'/dashboard/salereport/total';


    $scope.getAllSales = function () {
        
      $http({
        method: 'POST',
        url: $rootScope.baseURL+'/dashboard/salereport',
        data: $scope.limit,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(saleList)
      {
        saleList.forEach(function (value, key) {
                  $scope.saleList.push(value);
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


   $scope.getAll = function () {
      $scope.filteredTodos = [];
      $scope.currentPage = 1;
      $scope.maxSize = 5;
      $scope.entryLimit = 5;
      $scope.filterUser = 0;
      $scope.filterUserend = 1;
      $scope.numPerPage = 10;
      $scope.obj_Main = [];
      $scope.saleList = [];
      $scope.totalvalue = 0;
      $scope.loading1 = 0;
    $scope.saleListcount = 0;
    $scope.limit = {};

      
    $scope.parseFloat = parseFloat;
        
      if ($('#searchtext').val() == undefined || $('#searchtext').val() == "") {
        $scope.limit.search = "";
      }
      else{
        $scope.limit.search = $scope.searchtext;
      }
        
        $scope.limit.com_id = localStorage.getItem("com_id");
        $scope.limit.from_date = $("#user-datepicker-from").val();
        $scope.limit.to_date = $("#user-datepicker-to").val();

        $scope.getAllSales();

      $http({
        method: 'POST',
        url: $scope.apiURL,
        data: $scope.limit,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")
        }
      })
      .success(function(sale)
      {
        sale.forEach(function (value, key) {
                  $scope.saleListcount = value.total;
                  $scope.totalvalue = value.saletotal;
                  // $scope.data = new Date(value.sm_date);
                  // $scope.data.setHours(0,0,0,0);
                  // if($scope.fDate <= $scope.data && $scope.tDate >= $scope.data)
                  // {
                  //       $scope.totalvalue = ($scope.totalvalue + parseFloat(value.sm_amount));
                  //       $scope.saleList.push(value);
                  // }
                  // else if($('#user-datepicker-from').val() == "" && $('#user-datepicker-to').val() == "")  {
                  //       $scope.totalvalue = ($scope.totalvalue + parseFloat(value.sm_amount));
                  //       $scope.saleList.push(value);
                  // }
              });

              $scope.$watch("currentPage + numPerPage",
                  function () {
                      
                      $scope.resetpagination();
                  });
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
     var mm = (this.getMonth()).toString(); // getMonth() is zero-based
     var dd  = this.getDate().toString();
     var d = new Date();
     if(mm == 0){
    document.getElementById("user-datepicker-from").value = yyyy-1 +"-"+ ("12") +"-"+ (dd[1]?dd:"0"+dd[0]);
   }
   else if(mm==2||mm==4||mm==6||mm==7||mm==9||mm==11){
    document.getElementById("user-datepicker-from").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd-1:"0"+dd[0]);
   }
   else{
    document.getElementById("user-datepicker-from").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd-1:"0"+dd[0]);
   }
    };

    Date.prototype.setToDate = function() {
     var yyyy = this.getFullYear().toString();
     var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
     var dd  = this.getDate().toString();
     document.getElementById("user-datepicker-from").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
     document.getElementById("user-datepicker-to").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
    $scope.filter();
    };

    var d = new Date();
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth()).toString(); // getMonth() is zero-based
    var dd  = d.getDate().toString();

    var from = Date.parse((finyr[0].toString()) + '/04/01');
    var to   = Date.parse((finyr[1].toString()) + '/03/31');
    var check = Date.parse(d);

    if((check <= to && check >= from))
    {
        
      d.setFromDate();
      d.setToDate();
    }
    else
    {
      $scope.loading1 = 1;
    }

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
        if ($scope.filterUser >= $scope.saleListcount)
            $scope.filterUser = $scope.saleListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;

              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/dashboard/salereport/limit',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(sale)
              {
                $scope.filteredTodos = [];

                  sale.forEach(function (value, key) {
                      $scope.filteredTodos.push(value);

                      if(value.sm_payment_mode == "cash"){
                          $scope.cash = parseFloat(parseFloat($scope.cash) + parseFloat(value.sm_advance_amt)).toFixed(2);
                        }
                        else if(value.sm_payment_mode == "card"){
                          $scope.card = $scope.card + value.sm_advance_amt;
                        }
                        else if(value.sm_payment_mode = "credit"){
                          $scope.credit = $scope.credit + value.sm_amount;
                        }
                  });

// THIS SERVICE IS WRITE FOR EXPENSE DETAILS
                    $http({
                      method: 'POST',
                      url: $rootScope.baseURL+'/dashboard/expensereport/list',
                      data: $scope.limit,
                      headers: {'Content-Type': 'application/json',
                                'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                    })
                    .success(function(dailyexpense)
                    {
                      $scope.filteredTodos1 = [];
                        dailyexpense.forEach(function (value1, key) {
                            $scope.filteredTodos1.push(value1);
                        });
                      
                            // $scope.obj_Main = $scope.vendorList;
                            $scope.loading1 = 1;
                            // $scope.$apply(); 
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
                          }, 3001);             
                    });                
                      // $scope.obj_Main = $scope.vendorList;
                      $scope.loading1 = 1;
                      // $scope.$apply(); 
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
                    }, 3001);             
              });
// THIS SERVICE WRITE FOR VENDR OR PURCHASE DETAILS
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/dashboard/purchasereport/list',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(purchase)
              {
                $scope.filteredTodospurchase = [];
                  purchase.forEach(function (value2, key) {
                      $scope.filteredTodospurchase.push(value2);

                      if(value2.prm_credit == "cash"){
                          $scope.purchase_cash = $scope.purchase_cash + value2.prm_amount;
                        }
                      else if (value2.prm_credit == "credit") {
                          $scope.purchase_credit = $scope.purchase_credit + value2.prm_amount;
                        }
                  });    

                      // $scope.obj_Main = $scope.vendorList;
                      $scope.loading1 = 1;
                      // $scope.$apply(); 
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
                    }, 3001);             
              });
             

              $('#filter-user-btn').text("Filter");
              $('#filter-user-btn').removeAttr('disabled');
              $('#reset-user-btn').text("Reset");
              $('#reset-user-btn').removeAttr('disabled');
    };
    //search Data
    $scope.getSearch = function () {
      $scope.getAll();
    };

    
    $scope.showbootbox = function (index){
      bootbox.dialog({
        message: "<input class='form-control' type='password' id='pascode'>",
        title: "Enter a password to view balance sheet.",
        buttons: {
          main: {
            label: "Open",
            className: "btn-primary",
            callback: function() {
              if($('#pascode').val() == 'admin'){
                $('#view-details').modal('show');
                $scope.viewSaleDetails(index);
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

  $scope.viewSaleDetails = function (index) {

    $('#view-details').modal('show');
    $("#hidetablegst").hide();
    $scope.saleProductList = [];
    $scope.gstProductList = [];

    $scope.sales = $scope.filteredTodos[index];
      // $scope.serial = $scope.filteredTodos[index].sm_invoice_no;
      // $scope.smdate = $filter('date')($scope.filteredTodos[index].sm_date, "dd-MM-yyyy");
      // $scope.custname = $scope.filteredTodos[index].cm_name;
      // $scope.custaddress = $scope.filteredTodos[index].cm_address +"<br>"+ $scope.filteredTodos[index].cm_state +"<br>"+ $scope.filteredTodos[index].cm_city +"<br>"+ $scope.filteredTodos[index].cm_pin;
      // $scope.delcustaddress = $scope.filteredTodos[index].cm_del_address +"<br>"+ $scope.filteredTodos[index].cm_del_state +"<br>"+ $scope.filteredTodos[index].cm_del_city +"<br>"+ $scope.filteredTodos[index].cm_del_pin;
      // $scope.custmobile = $scope.filteredTodos[index].cm_mobile;
      // $scope.custemail = $scope.filteredTodos[index].cm_email;
      // $scope.custgstno = $scope.filteredTodos[index].cm_gst_no;
      // $scope.balamount = $scope.filteredTodos[index].sm_balance_amount;
      // $scope.bmname = $scope.filteredTodos[index].bm_name;
      // $scope.totalamount = $scope.filteredTodos[index].sm_amount;
      // $scope.empname = $scope.filteredTodos[index].emp_name;
      // $scope.smcomment = $scope.filteredTodos[index].sm_comment;
      // $scope.paymentmode = $scope.filteredTodos[index].sm_payment_mode;
      // $scope.smbuyerno = $scope.filteredTodos[index].sm_buyer_no;
      if ($scope.filteredTodos[index].sm_payment_date == "" || $scope.filteredTodos[index].sm_payment_date == undefined) 
        $scope.smpaymentdate = "";
      else
        $scope.smpaymentdate = $filter('date')($scope.filteredTodos[index].sm_payment_date, "dd-MM-yyyy");

      if ($scope.filteredTodos[index].sm_eway_bill_no == "" || $scope.filteredTodos[index].sm_eway_bill_no == undefined) 
        $scope.smewaybillno = "";
      else
        $scope.smewaybillno = $scope.filteredTodos[index].sm_eway_bill_no;
      // $scope.cgst = $scope.filteredTodos[index].sm_cgst;
      // $scope.sgst = $scope.filteredTodos[index].sm_sgst;
      // $scope.igst = $scope.filteredTodos[index].sm_igst;
      // $scope.smstatus = $scope.filteredTodos[index].sm_status;
      // $scope.smdiscount = $scope.filteredTodos[index].sm_discount;
      // $scope.sm_other_charges = $scope.filteredTodos[index].sm_other_charges;

      $scope.amount = $scope.filteredTodos[index].spm_net_amount;
      if($scope.sales.com_is_composition == 0) 
      {
        $scope.tota = parseFloat($scope.amount) + parseFloat($scope.filteredTodos[index].sm_cgst) + parseFloat($scope.filteredTodos[index].sm_sgst) + parseFloat($scope.filteredTodos[index].sm_igst);
        $scope.disc = parseFloat(parseFloat($scope.tota) - parseFloat($scope.filteredTodos[index].spm_disc) + parseFloat($scope.filteredTodos[index].sm_other_charges)).toFixed(2);
        $scope.roundoff = parseFloat($scope.filteredTodos[index].sm_amount) - parseFloat($scope.disc);
      }
        $scope.convertNumberToWords($scope.filteredTodos[index].sm_amount);

      $http({
        method: 'GET',
        url: $rootScope.baseURL+'/sale/details/'+$scope.filteredTodos[index].sm_id,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(saleProductList)
      {
        // $scope.saleProductList = angular.copy(saleProductList);

         var i = 1;
          saleProductList.forEach(function (value, key) {
            
              value.srno = i++;
              $scope.saleProductList.push(value);
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

      if($scope.sales.com_is_composition == 0) 
      {
        $http({
          method: 'GET',
          url: $rootScope.baseURL+'/sale/gst/details/'+$scope.filteredTodos[index].sm_id,
          headers: {'Content-Type': 'application/json',
                    'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
        })
        .success(function(gstProductList)
        {

            $scope.sumtaxable_value = 0;
            $scope.sumtax_cgst = 0;
            $scope.sumtax_sgst = 0;
            $scope.sumtotal_tax = 0;

            gstProductList.forEach(function (value, key) {
                $scope.sumtaxable_value = parseFloat(parseFloat($scope.sumtaxable_value) + parseFloat(value.taxable_value)).toFixed(2);
                $scope.sumtax_cgst = parseFloat(parseFloat($scope.sumtax_cgst) + parseFloat(value.tax_cgst)).toFixed(2);
                $scope.sumtax_sgst = parseFloat(parseFloat($scope.sumtax_sgst) + parseFloat(value.tax_sgst)).toFixed(2);
                $scope.sumtotal_tax = parseFloat(parseFloat($scope.sumtotal_tax) + parseFloat(value.tax_cgst + value.tax_sgst)).toFixed(2);
                $scope.gstProductList.push(value);
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
      }
    };

    $scope.convertNumberToWords = function (amount) {
        var words = new Array();
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        amount = amount.toString();
        var atemp = amount.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
        if (n_length <= 9) {
            var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + parseInt(n_array[j]);
                        n_array[i] = 0;
                    }
                }
            }
            value = "";
            for (var i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Crores ";
                }
                if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Lakhs ";
                }
                if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Thousand ";
                }
                if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                    words_string += "Hundred and ";
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
        $scope.amountinwords = words_string;
    }

    $scope.printDetails = function(){


      if($scope.sales.sm_status == 1){
        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
        if($scope.sales.com_is_composition == 0) 
        {
        var page1 = "<html>" +
         " <head>" +
            "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
            "<style>.action{display:none;} .print-hide{display:none;}</style>"+
            "<style>@media print {.watermark {display: inline;position: fixed !important;opacity: 0.50;font-size: 100px;width: 100%;text-align: center;z-index: 1000;top:270px;right:5px;}}</style>" +
            "   <style type='text/css' media='print'>" +
            "  @page " +
             " {" +
              "    size:  A4 portrait;" +  /* auto is the initial value */
               "   margin: 0; " + /* this affects the margin in the printer settings */
              "}" +

              "html" +
              "{" +
               "   background-color: #FFFFFF;" + 
                "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
              "}" +

              "body" +
              "{" +
                "font-size:11pt;"+
                "font-family:'Open Sans', sans-serif;"+
               // "   border: solid 1px black ;" +
                "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
              "}" +
              "</style>" +
          "</head>" +
          "<body onload='window.print()'>" +
          "<div class='watermark'>cancelled</p></div>" +
          "<center style='font-size:11pt;'>Tax Invoice</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='3' style='text-align:center; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.sales.cm_name+"</strong><br>Number : <strong>"+$scope.sales.cm_mobile+"</strong><br>Email Id : <strong>"+$scope.sales.cm_email+"</strong><br>GST : <strong>"+$scope.sales.cm_gst_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.sales.cm_address+"<br>"+$scope.sales.cm_state+"<br>"+$scope.sales.cm_city+"<br>"+$scope.sales.cm_pin+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.sales.cm_del_address+"<br>"+$scope.sales.cm_del_state+"<br>"+$scope.sales.cm_del_city+"<br>"+$scope.sales.cm_del_pin+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Serial No: <strong> "+$scope.sales.sm_invoice_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Buyer's Order No. : <strong>"+$scope.sales.sm_buyer_no+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>E-Way Bill No. : <strong>"+$scope.smewaybillno+"</strong></td>" +
                        "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Salesman : <strong>"+$scope.sales.emp_name+"</strong></td>" +
                        "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Receive Date : <strong>"+$scope.smpaymentdate+"</strong></td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td colspan='3' valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+       
                      "<tr>"+    
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
                        // "<th width='10%'>Code</th> " +
                        "<th width='25%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>HSN/SAC</th>"+
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" +
                        // "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt;'>Disc</th>"+
                        // "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Disc</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>CGST</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>SGST</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>IGST</th>" +
                        "<th width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Net Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#content').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            
            "<tfoot>"+
                "<tr>" +
                  "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.sales.sm_comment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>CGST (+)</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_cgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>SGST (+)</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_sgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>IGST (+)</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_igst, "2")+"</strong></td>" +
              "</tr>";
              if ($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges !=0)
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              else if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges ==0)
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              else if($scope.sales.sm_discount == 0 && $scope.sales.sm_other_charges !=0)
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              else
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              page1 = page1 + "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>"+
                      "<td rowspan='2' width='32%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>HSN/SAC</td>"+
                      "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Taxable Value</td>"+
                      "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Central Tax</td>"+
                      "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>State Tax</td>"+
                      "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Total Tax Amount</td>"+
                    "</tr>"+
                    "<tr>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Amount</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Amount</td>"+
                    "</tr>"+
                    ""+ $('#gstdist').html()+" " +
                    "<tr>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='right'><strong>Total</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtaxable_value,2)+"</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_cgst,2)+"</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_sgst,2)+"</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid none none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtotal_tax,2)+"</strong></td>"+
                    "</tr>"+
                  "</table>"+
                "</td>"+
              "</tr>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                        "<td width='45%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
                          // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
                          // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
                          "<strong>Declaration:</strong><br>" +
                        "I/we hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002 is in force on the date on which the sale of goods specifies in thes tax invoice is made by me/us and that the transaction of sale covered by this tax invoice has been effected by me/us and is shall be accounted for in the turnover of sale while filling the return due tax, if any, payable on the sale has been paid or shall be paid." +
                          // "Composition Taxable Person, not eligible to collect tax on supplies."+
                        "</td>"+
                        "<td width='25%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: none solid none none; border-width:1px;'>" +
                          "Company's Bank Details<br>"+
                          "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
                          "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
                          "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
                          "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
                        "</td>" +
                        "<td width='30%' valign='top' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>For "+localStorage.getItem("com_name")+":</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td width='30%' valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>Authorized Signatory</td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";
      }
      else
      {
        var page1 = "<html>" +
         " <head>" +
            "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
            "<style>.action{display:none;} .print-hide{display:none;}</style>"+
            "<style>@media print {.watermark {display: inline;position: fixed !important;opacity: 0.50;font-size: 100px;width: 100%;text-align: center;z-index: 1000;top:270px;right:5px;}}</style>" +
            "   <style type='text/css' media='print'>" +
            "  @page " +
             " {" +
              "    size:  A4 portrait;" +  /* auto is the initial value */
               "   margin: 0; " + /* this affects the margin in the printer settings */
              "}" +

              "html" +
              "{" +
               "   background-color: #FFFFFF;" + 
                "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
              "}" +

              "body" +
              "{" +
                "font-size:11pt;"+
                "font-family:'Open Sans', sans-serif;"+
               // "   border: solid 1px black ;" +
                "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
              "}" +
              "</style>" +
          "</head>" +
          "<body onload='window.print()'>" +
          "<div class='watermark'>cancelled</p></div>" +
          "<center style='font-size:11pt;'><strong>Bill of Supply</strong></center>"+
          "<center style='font-size:10pt;'>Composition taxable person. Not eligible to collect tax on supplies</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='3' style='text-align:center; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.sales.cm_name+"</strong><br>Number : <strong>"+$scope.sales.cm_mobile+"</strong><br>Email Id : <strong>"+$scope.sales.cm_email+"</strong><br>GST : <strong>"+$scope.sales.cm_gst_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.sales.cm_address+"<br>"+$scope.sales.cm_state+"<br>"+$scope.sales.cm_city+"<br>"+$scope.sales.cm_pin+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.sales.cm_del_address+"<br>"+$scope.sales.cm_del_state+"<br>"+$scope.sales.cm_del_city+"<br>"+$scope.sales.cm_del_pin+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Serial No: <strong> "+$scope.sales.sm_invoice_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Buyer's Order No. : <strong>"+$scope.sales.sm_buyer_no+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>E-Way Bill No. : <strong>"+$scope.smewaybillno+"</strong></td>" +
                        "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Salesman : <strong>"+$scope.sales.emp_name+"</strong></td>" +
                        "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Receive Date : <strong>"+$scope.smpaymentdate+"</strong></td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td colspan='3' valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+      
                      "<tr>"+
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
                        // "<th width='10%'>Code</th> " +
                        "<th width='55%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" +
                        "<th width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Net Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#content').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
                "<tr>" +
                  "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.sales.sm_comment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
              "</tr>";
              if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges !=0)
              {
                page1 = page1 + "<tr>"+
                      "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>";
              }
              else if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges ==0)
              {
                page1 = page1 + "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>";
              }
              else if($scope.sales.sm_discount == 0 && $scope.sales.sm_other_charges !=0)
              {
                page1 = page1 + "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>";
              }
              else{
                page1 = page1 + "<tr>"+
                  "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
              "</tr>" ;
              }
              page1 = page1 +"<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                        "<td width='45%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
                          // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
                          // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
                          "<strong>Declaration:</strong><br>" +
                        "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct." +
                          // "Composition Taxable Person, not eligible to collect tax on supplies."+
                        "</td>"+
                        "<td width='25%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: none solid none none; border-width:1px;'>" +
                          "Company's Bank Details<br>"+
                          "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
                          "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
                          "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
                          "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
                        "</td>" +
                        "<td width='30%' valign='top' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>For "+localStorage.getItem("com_name")+":</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td width='30%' valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>Authorized Signatory</td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";
      }
        popupWin.document.write(page1);
        popupWin.document.close();
      }
      else{
        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
          if($scope.sales.com_is_composition == 0) 
        {
        var page1 = "<html>" +
         " <head>" +
            "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
            "<style>.action{display:none;} .print-hide{display:none;}</style>"+
            "   <style type='text/css' media='print'>" +
            "  @page " +
             " {" +
              "    size:  A4 portrait;" +  /* auto is the initial value */
               "   margin: 0; " + /* this affects the margin in the printer settings */
              "}" +

              "html" +
              "{" +
               "   background-color: #FFFFFF;" + 
                "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
              "}" +

              "body" +
              "{" +
                "font-size:11pt;"+
                "font-family:'Open Sans', sans-serif;"+
               // "   border: solid 1px black ;" +
                "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
              "}" +
              "</style>" +
          "</head>" +
          "<body onload='window.print()'>" +
          "<center style='font-size:11pt;'>Tax Invoice</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='3' style='text-align:center; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.sales.cm_name+"</strong><br>Number : <strong>"+$scope.sales.cm_mobile+"</strong><br>Email Id : <strong>"+$scope.sales.cm_email+"</strong><br>GST : <strong>"+$scope.sales.cm_gst_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.sales.cm_address+"<br>"+$scope.sales.cm_state+"<br>"+$scope.sales.cm_city+"<br>"+$scope.sales.cm_pin+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.sales.cm_del_address+"<br>"+$scope.sales.cm_del_state+"<br>"+$scope.sales.cm_del_city+"<br>"+$scope.sales.cm_del_pin+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Serial No: <strong> "+$scope.sales.sm_invoice_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Buyer's Order No. : <strong>"+$scope.sales.sm_buyer_no+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>E-Way Bill No. : <strong>"+$scope.smewaybillno+"</strong></td>" +
                        "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Salesman : <strong>"+$scope.sales.emp_name+"</strong></td>" +
                        "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Receive Date : <strong>"+$scope.smpaymentdate+"</strong></td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td colspan='3' valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+      
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
                        // "<th width='10%'>Code</th> " +
                        "<th width='25%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>HSN/SAC</th>"+
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" +
                        // "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt;'>Disc</th>"+
                        // "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Disc</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>CGST</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>SGST</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>IGST</th>" +
                        "<th width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Net Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#content').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
                "<tr>" +
                  "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.sales.sm_comment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>CGST (+)</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_cgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>SGST (+)</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_sgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>IGST (+)</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_igst, "2")+"</strong></td>" +
              "</tr>";
              if ($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges !=0)
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              else if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges ==0)
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              else if($scope.sales.sm_discount == 0 && $scope.sales.sm_other_charges !=0)
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              else
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              page1 = page1 + "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>"+
                      "<td rowspan='2' width='32%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>HSN/SAC</td>"+
                      "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Taxable Value</td>"+
                      "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Central Tax</td>"+
                      "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>State Tax</td>"+
                      "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Total Tax Amount</td>"+
                    "</tr>"+
                    "<tr>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Amount</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Amount</td>"+
                    "</tr>"+
                    ""+ $('#gstdist').html()+" " +
                    "<tr>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='right'><strong>Total</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtaxable_value,2)+"</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_cgst,2)+"</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_sgst,2)+"</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid none none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtotal_tax,2)+"</strong></td>"+
                    "</tr>"+
                  "</table>"+
                "</td>"+
              "</tr>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                        "<td width='45%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
                          // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
                          // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
                          "<strong>Declaration:</strong><br>" +
                        "I/we hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002 is in force on the date on which the sale of goods specifies in thes tax invoice is made by me/us and that the transaction of sale covered by this tax invoice has been effected by me/us and is shall be accounted for in the turnover of sale while filling the return due tax, if any, payable on the sale has been paid or shall be paid." +
                          // "Composition Taxable Person, not eligible to collect tax on supplies."+
                        "</td>"+
                        "<td width='25%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: none solid none none; border-width:1px;'>" +
                          "Company's Bank Details<br>"+
                          "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
                          "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
                          "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
                          "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
                        "</td>" +
                        "<td width='30%' valign='top' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>For "+localStorage.getItem("com_name")+":</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td width='30%' valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>Authorized Signatory</td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";
      }
      else
      {
        var page1 = "<html>" +
         " <head>" +
            "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
            "<style>.action{display:none;} .print-hide{display:none;}</style>"+
            "   <style type='text/css' media='print'>" +
            "  @page " +
             " {" +
              "    size:  A4 portrait;" +  /* auto is the initial value */
               "   margin: 0; " + /* this affects the margin in the printer settings */
              "}" +

              "html" +
              "{" +
               "   background-color: #FFFFFF;" + 
                "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
              "}" +

              "body" +
              "{" +
                "font-size:11pt;"+
                "font-family:'Open Sans', sans-serif;"+
               // "   border: solid 1px black ;" +
                "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
              "}" +
              "</style>" +
          "</head>" +
          "<body onload='window.print()'>" +
          "<center style='font-size:11pt;'><strong>Bill of Supply</strong></center>"+
          "<center style='font-size:10pt;'>Composition taxable person. Not eligible to collect tax on supplies</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='3' style='text-align:center; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.sales.cm_name+"</strong><br>Number : <strong>"+$scope.sales.cm_mobile+"</strong><br>Email Id : <strong>"+$scope.sales.cm_email+"</strong><br>GST : <strong>"+$scope.sales.cm_gst_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.sales.cm_address+"<br>"+$scope.sales.cm_state+"<br>"+$scope.sales.cm_city+"<br>"+$scope.sales.cm_pin+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.sales.cm_del_address+"<br>"+$scope.sales.cm_del_state+"<br>"+$scope.sales.cm_del_city+"<br>"+$scope.sales.cm_del_pin+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Serial No: <strong> "+$scope.sales.sm_invoice_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Buyer's Order No. : <strong>"+$scope.sales.sm_buyer_no+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>E-Way Bill No. : <strong>"+$scope.smewaybillno+"</strong></td>" +
                        "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Salesman : <strong>"+$scope.sales.emp_name+"</strong></td>" +
                        "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Receive Date : <strong>"+$scope.smpaymentdate+"</strong></td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td colspan='3' valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+      
                      "<tr>"+
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
                        // "<th width='10%'>Code</th> " +
                        "<th width='55%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" +
                        "<th width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Net Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#content').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
                "<tr>" +
                  "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.sales.sm_comment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
              "</tr>";
              if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges !=0)
              {
                page1 = page1 + "<tr>"+
                      "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>";
              }
              else if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges ==0)
              {
                page1 = page1 + "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>";
              }
              else if($scope.sales.sm_discount == 0 && $scope.sales.sm_other_charges !=0)
              {
                page1 = page1 + "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                  "</tr>";
              }
              else{
                page1 = page1 + "<tr>"+
                  "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
              "</tr>" ;
              }
              page1 = page1 +"<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                        "<td width='45%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
                          // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
                          // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
                          "<strong>Declaration:</strong><br>" +
                        "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct." +
                          // "Composition Taxable Person, not eligible to collect tax on supplies."+
                        "</td>"+
                        "<td width='25%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: none solid none none; border-width:1px;'>" +
                          "Company's Bank Details<br>"+
                          "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
                          "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
                          "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
                          "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
                        "</td>" +
                        "<td width='30%' valign='top' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>For "+localStorage.getItem("com_name")+":</td>" +
                    "</tr>" +
                    "<tr>" +
                        "<td width='30%' valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>Authorized Signatory</td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";
      }
        popupWin.document.write(page1);
        popupWin.document.close();
      }
    }

    $scope.exportXls = function(){

      $("#contentexport").table2excel({
        exclude: ".noExl",
        name: "SaleList",
        filename: "SaleList.xls" //do not include extension
      });
    };

    $scope.exportPrint = function(){
      
      var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
          
        var printchar = "<html>" +
         " <head>" +
            "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
            "<style>.action{display:none;} .print-hide{display:none;}</style>"+
            "   <style type='text/css' media='print'>" +
            "  @page " +
             " {" +
              "    size:  A4 portrait;" +  /* auto is the initial value */
               "   margin: 0; " + /* this affects the margin in the printer settings */
              "}" +

              "html" +
              "{" +
               "   background-color: #FFFFFF;" + 
                "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
              "}" +

              "body" +
              "{" +
                "font-size:11pt;"+
                "font-family:'Open Sans', sans-serif;"+
               // "   border: solid 1px black ;" +
                "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
              "}" +
              "</style>" +
          "</head>" +
          "<body onload='window.print()'>" +
            "<center style='font-size:11pt;'>Sale Report</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='3' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" ;
                    if($('#user-datepicker-from').val() != "" && $('#user-datepicker-to').val() != "") 
                    {
                    printchar = printchar + "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid solid none none; border-width:1px;'>From Date : <strong>"+$filter('date')($scope.fDate, "dd-MM-yyyy")+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid solid none none; border-width:1px;'>To Date : <strong>"+$filter('date')($scope.tDate, "dd-MM-yyyy")+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid none none none; border-width:1px;'>Total Sale : <strong>"+$filter('number')($scope.totalvalue, "2")+"</strong></td>" +
                    "</tr>" ;
                    }
                  printchar = printchar + "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+
                      "<tr>"+      
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Invoice No</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Buyer's Order No</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Debtors</th>"+
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Date</th> " +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Payment Date</th> " +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Cash / Credit</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Amount</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Balance Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#contentExportPrint').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
              "<tr>"+
                "<td style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                        "<td valign='bottom' style='text-align:center; padding:4px 8px 4px 8px; font-size:11pt;'>THANK YOU</td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";
        popupWin.document.write(printchar);
        popupWin.document.close();
    }

});