// import admin
angular.module('report').controller('vendorReportCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {


  $('.index').removeClass("active");
  $('#menureportindex').addClass("active");
  $('#vendorreportindex').addClass("active");

    $('#printTable').hide();
    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.entryLimit = 5;
    $scope.filterUser = 0;
    $scope.filterUserend = 1;
    $scope.numPerPage = 10;
    $scope.obj_Main = [];
    $scope.vendorList = [];
    $scope.vendorListcount = 0;
    $scope.saleList = [];
    $scope.limit = {};
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

$scope.filter = function()
  {
    $scope.toDate = document.getElementById("user-datepicker-to").value;
    $scope.fromDate = document.getElementById("user-datepicker-from").value;
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
      // $('#view-details').modal('show');
    $scope.viewVendorDetails($scope.ind);
      // $scope.getUser();

      // $scope.draw();

  };

  Date.prototype.setFromDate = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   document.getElementById("user-datepicker-from").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
  };

  Date.prototype.setToDate = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   document.getElementById("user-datepicker-to").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
  $scope.filter();
  };

  // d = new Date();
  // d.setFromDate();
  // d.setToDate();

  // $scope.reset = function()
  // {
  //   $scope.toDate = "";
  //   $scope.fromDate = "";
  //   $('#user-datepicker-from').val("");
  //   $('#user-datepicker-to').val("");
  //   $scope.dateFilter = "";
  //     $('#reset-user-btn').attr('disabled','true');
  //     $('#reset-user-btn').text("please wait...");
  //     $('#view-details').modal('show');
  //   $scope.viewVendorDetails($scope.ind);
  // };


    $scope.getAllSales = function () {
        
      $http({
        method: 'POST',
        url: $rootScope.baseURL+'/dashboard/vendorreport',
        data: $scope.limit,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(saleList)
      {
        saleList.forEach(function (value, key) {
                  $scope.vendorList.push(value);
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

    $scope.apiURL = $rootScope.baseURL+'/dashboard/vendorreport/total';
   $scope.getAll = function () {
        

      if ($('#searchtext').val() == undefined || $('#searchtext').val() == "") {
        $scope.limit.search = "";
        $scope.limit.com_id = localStorage.getItem("com_id");
      }
      else{
        $scope.limit.search = $scope.searchtext;
        $scope.limit.com_id = localStorage.getItem("com_id");
      }

      $scope.getAllSales();
        
      $http({
        method: 'POST',
        url: $scope.apiURL,
        data: $scope.limit,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(vendor)
	    {
	      vendor.forEach(function (value, key) {
                  $scope.vendorListcount = value.total;
                  $scope.totalvalue = value.saletotal;
              });
              $scope.$watch("currentPage + numPerPage",
                  function () {
                      
                      $scope.resetpagination();
                  });

              
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
            }, 1500);             
	    });
    };

    //Pagination Function
    

   //Pagination Function
    $scope.resetpagination = function () {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.filterUserend = begin + 1;
        $scope.filterUser = end;
        if ($scope.filterUser >= $scope.vendorListcount)
            $scope.filterUser = $scope.vendorListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/dashboard/vendorreport/limit',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(vendor)
              {
                $scope.filteredTodos = [];

                  vendor.forEach(function (value, key) {
                      $scope.filteredTodos.push(value);
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
    };
    //search Data
    $scope.getSearch = function () {

      $scope.getAll();

    };

  $scope.viewVendorDetails1 = function (index) {
      $scope.ind = index;
      d = new Date();
      d.setFromDate();
      d.setToDate();
  };

  $scope.redirect = function (ids) {
    $('#view-details').modal('hide');
    location.reload();
    // data-dissmiss="modal" class="close"
    window.location.href = '#/purchase/edit/'+ids; 
  };

  $scope.viewVendorDetails = function (index) {
      $scope.venname = $scope.filteredTodos[index].vm_firm_name;
      $scope.venno = $scope.filteredTodos[index].vm_mobile;
      $scope.venadd = $scope.filteredTodos[index].vm_address;
      $scope.vengstno = $scope.filteredTodos[index].vm_gst_no;
      $scope.venbal = $scope.filteredTodos[index].credit;
      $scope.vendebit = $scope.filteredTodos[index].debit;
      $scope.vencode = $scope.filteredTodos[index].vm_code;
      $scope.vopeningcredit = $scope.filteredTodos[index].vm_opening_credit;
      $scope.vopeningdebit = $scope.filteredTodos[index].vm_opening_debit;

      $scope.limit.fin_prev_year = localStorage.getItem("watersupply_admin_financial_year");
      $scope.limit.from = $("#user-datepicker-from").val();
      $scope.limit.to = $("#user-datepicker-to").val();

      $scope.categoryList =[];
      $http({
        method: 'POST',
        url: $rootScope.baseURL+'/vendor/details/'+$scope.filteredTodos[index].vm_id,
        data: $scope.limit,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(categoryList)
      {
        // $scope.categoryList = angular.copy(categoryList);
        var amount_balance = 0;

        // if($scope.vopeningcredit !=0){
        //   amount_balance = parseInt(amount_balance) + $scope.vopeningcredit;
        //   $scope.categoryList = [{"credit":$scope.vopeningcredit , "debit":$scope.vopeningdebit , "drcr":"CR", "bal":amount_balance , "date":"" , "invoice":"" , "status":"Opening Balance" , "type":"Opening"}];
        // }
        // else if($scope.vopeningdebit !=0){
        //   amount_balance = parseInt(amount_balance) - $scope.vopeningdebit;
        //   $scope.categoryList = [{"credit":$scope.vopeningcredit , "debit":$scope.vopeningdebit , "drcr":"DR", "bal": Math.abs(amount_balance) , "date":"" , "invoice":"" , "status":"Opening Balance" , "type":"Opening"}];
        // }
        
          categoryList.forEach(function (value, key) {
            // $scope.data = new Date(value.date);
            // $scope.data.setHours(0,0,0,0);
            if(value.credit == 0)
            {
              amount_balance = parseInt(amount_balance) - parseInt(value.debit);
            }
            else if(value.debit == 0 && value.ctype != 'cash')
            {
              amount_balance = parseInt(amount_balance) + parseInt(value.credit);
            }
            if(amount_balance < 0)
            {
              Math.abs(amount_balance);
            value.bal = Math.abs(amount_balance);
              value.drcr="DR";
            }
            else{
              value.drcr="CR";
              value.bal = amount_balance;
            }

              $scope.categoryList.push(value);
              
            // if($scope.fDate <= $scope.data && $scope.tDate >= $scope.data)
            // {
            //   $scope.categoryList.push(value);
            // }
            // else if($('#user-datepicker-from').val() == "" && $('#user-datepicker-to').val() == "")  {
            //   $scope.categoryList.push(value);
            // }
          });
          $('#filter-user-btn').text("Filter");
          $('#filter-user-btn').removeAttr('disabled');
          // $('#reset-user-btn').text("Reset");
          // $('#reset-user-btn').removeAttr('disabled');
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


    $scope.printDetails = function(){
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
            "<center style='font-size:11pt;'>Dealer Ledger</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='2' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Dealer Name : <strong>"+$scope.venname+"</strong></td>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid none; border-width:1px;'>Address : <strong>"+$scope.venadd+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Contact Number : <strong>"+$scope.venno+"</strong></td>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid none; border-width:1px;'>GST No. : <strong>"+$scope.vengstno+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid none none; border-width:1px;'>Debit : <strong>"+$scope.vendebit+"</strong></td>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt;'>Credit : <strong>"+$scope.venbal+"</strong></td>" +
                    "</tr>" ;
                    if($('#user-datepicker-from').val() != "" && $('#user-datepicker-to').val() != "") 
                    {
                    printchar = printchar + "<tr>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid solid none none; border-width:1px;'>From Date : <strong>"+$filter('date')($scope.fDate, "dd-MM-yyyy")+"</strong></td>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid none none none; border-width:1px;'>To Date : <strong>"+$filter('date')($scope.tDate, "dd-MM-yyyy")+"</strong></td>" +
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
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Type</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Invoice</th> " +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Date</th>"+
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Debit</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Credit</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>DR/CR</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Balance</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#content').html()+" " +
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

  $scope.viewPurchaseDetails = function (index) {
    
    $('#view-purchase-details').modal('show');
    $scope.purchaseProductList = [];

    $http({
        method: 'GET',
        url: $rootScope.baseURL+'/purchase/'+$scope.categoryList[index].idd,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(purchasePtList)
      {
        $scope.invoiceno = purchasePtList[0].prm_invoice_no;
        $scope.inwardno = purchasePtList[0].prm_inward_no;
        $scope.vmfirmname = purchasePtList[0].vm_firm_name;
        $scope.vmaddress = purchasePtList[0].vm_address;
        $scope.vmgstno = purchasePtList[0].vm_gst_no;
        $scope.prmamount = $filter('number')(purchasePtList[0].prm_amount, "2");
        $scope.prmdate = $filter('date')(purchasePtList[0].prm_date, "dd-MM-yyyy");
        $scope.vmmobile = purchasePtList[0].vm_mobile;
        $scope.prmpaymentdate = $filter('date')(purchasePtList[0].prm_payment_date, "dd-MM-yyyy");
        $scope.prmcredit = purchasePtList[0].prm_credit;
        $scope.prmcomment = purchasePtList[0].prm_comment;
        $scope.prmstatus = purchasePtList[0].prm_status;
        $scope.prmcgst = $filter('number')(purchasePtList[0].prm_cgst, "2");
        $scope.prmsgst = $filter('number')(purchasePtList[0].prm_sgst, "2");
        $scope.prmigst = $filter('number')(purchasePtList[0].prm_igst, "2");
        $scope.prmdiscount = $filter('number')(purchasePtList[0].prm_discount, "2");
        $scope.amount = $filter('number')(purchasePtList[0].prm_net_amount, "2");
        $scope.amount = parseFloat(parseFloat(purchasePtList[0].prm_amount) - parseFloat(purchasePtList[0].prm_cgst) - parseFloat(purchasePtList[0].prm_sgst) - parseFloat(purchasePtList[0].prm_igst));
        $scope.tota = parseFloat($scope.amount) + parseFloat(purchasePtList[0].prm_cgst) + parseFloat(purchasePtList[0].prm_sgst) + parseFloat(purchasePtList[0].prm_igst);
        $scope.roundoff = parseFloat(purchasePtList[0].prm_amount) - parseFloat($scope.tota);
        $scope.convertNumberToWords($scope.prmamount);
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

      $http({
        method: 'GET',
        url: $rootScope.baseURL+'/purchase/details/'+$scope.categoryList[index].idd,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(purchaseProductList)
      {
        var i = 1;
        purchaseProductList.forEach(function (value, key) {
              value.srno = i++;
              $scope.purchaseProductList.push(value);
            });
        // $scope.purchaseProductList = angular.copy(purchaseProductList);
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

    $scope.printPurDetails = function(){

      if($scope.prmstatus == 1){

        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
        
        
            var printchar = "<html>" +
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
            "<center style='font-size:11pt;'>PURCHASE</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      "<td colspan='2' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='60%' rowspan='3' valign='center' style='padding:4px 8px 4px 8px; border-style: none solid solid none; border-width:1px;'>Creditors Name : <strong>"+$scope.vmfirmname+"</strong><br>Address : <strong>"+ $scope.vmaddress +"</strong><br>Contact Number : <strong>"+$scope.vmmobile+"</strong><br>GST No. : <strong>"+$scope.vmgstno+"</strong></td>" +
                      "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.prmdate, "dd-MM-yyyy")+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none solid none; border-width:1px;'>Invoice No: <strong>"+$scope.invoiceno+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none solid none; border-width:1px;'>Inward No : <strong>"+$scope.inwardno+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='60%' style='padding:4px 8px 4px 8px; border-style: none solid none none; border-width:1px;'>Cash / Credit : <strong>"+$scope.prmcredit+"</strong></td>" ;
                      if($scope.prmcredit == "credit"){
                        printchar = printchar + "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none none none; border-width:1px;'>Payment Date : <strong>"+$filter('date')($scope.prmpaymentdate, "dd-MM-yyyy")+"</strong></td>" ;
                      }
                      else{
                        printchar = printchar + "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none none none; border-width:1px;'>&nbsp</td>" ;
                      }
                    printchar = printchar + "</tr>" +
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
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Sr. No.</th>" +
                        // "<th width='10%'>Code</th> " +
                        "<th width='25%' style='padding:4px 8px 4px 8px; font-size:11pt;'>Description of Goods</th> " +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>HSN/SAC</th>"+
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Quantity</th>" +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Price</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Disc</th>"+
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>CGST</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>SGST</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>IGST</th>" +
                        "<th width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Net Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#contentPurchase').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
            "<tr>" +
                  "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.prmcomment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2") +"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>Discount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.prmdiscount, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>CGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$scope.prmcgst+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>SGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$scope.prmsgst+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>IGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.prmigst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid none; border-width:1px;'>Total Amount </td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid solid; border-width:1px;'><strong>"+$scope.prmamount+"</strong></td>" +
              "</tr>" +
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";

        popupWin.document.write(printchar);
            popupWin.document.close();
            // popupWin.close();
      }
      else{

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
            "<center style='font-size:11pt;'>PURCHASE</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      "<td colspan='2' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='60%' rowspan='3' valign='center' style='padding:4px 8px 4px 8px; border-style: none solid solid none; border-width:1px;'>Creditors Name : <strong>"+$scope.vmfirmname+"</strong><br>Address : <strong>"+ $scope.vmaddress +"</strong><br>Contact Number : <strong>"+$scope.vmmobile+"</strong><br>GST No. : <strong>"+$scope.vmgstno+"</strong></td>" +
                      "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.prmdate, "dd-MM-yyyy")+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none solid none; border-width:1px;'>Invoice No: <strong>"+$scope.invoiceno+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none solid none; border-width:1px;'>Inward No : <strong>"+$scope.inwardno+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='60%' style='padding:4px 8px 4px 8px; border-style: none solid none none; border-width:1px;'>Cash / Credit : <strong>"+$scope.prmcredit+"</strong></td>" ;
                      if($scope.prmcredit == "credit"){
                        printchar = printchar + "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none none none; border-width:1px;'>Payment Date : <strong>"+$filter('date')($scope.prmpaymentdate, "dd-MM-yyyy")+"</strong></td>" ;
                      }
                      else{
                        printchar = printchar + "<td width='40%' style='padding:4px 8px 4px 8px; border-style: none none none none; border-width:1px;'>&nbsp</td>" ;
                      }
                    printchar = printchar + "</tr>" +
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
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Sr. No.</th>" +
                        // "<th width='10%'>Code</th> " +
                        "<th width='25%' style='padding:4px 8px 4px 8px; font-size:11pt;'>Description of Goods</th> " +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>HSN/SAC</th>"+
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Quantity</th>" +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Price</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Disc</th>"+
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>CGST</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>SGST</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>IGST</th>" +
                        "<th width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; text-align:center'>Net Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#contentPurchase').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
            "<tr>" +
                  "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.prmcomment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2") +"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>Discount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.prmdiscount, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>CGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$scope.prmcgst+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>SGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$scope.prmsgst+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>IGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.prmigst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid none; border-width:1px;'>Total Amount </td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid solid; border-width:1px;'><strong>"+$scope.prmamount+"</strong></td>" +
              "</tr>" +
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";

        popupWin.document.write(printchar);
        
            popupWin.document.close();
            // popupWin.close();
          }
    }

    $scope.exportXls = function(){

      $("#contentexportList").table2excel({
        exclude: ".noExl",
        name: "VendorList",
        filename: "VendorList.xls" //do not include extension
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
            "<center style='font-size:11pt;'>Creditors Report</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      "<td style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid none none none; border-width:1px;'>Total Credit Amount : <strong>"+$filter('number')($scope.totalvalue, "2")+"</strong></td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+
                      "<tr>"+      
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Name</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Address</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Contact</th> " +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>E-Mail Id</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>GST No</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Debit</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Credit</th>" +
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