// import admin
angular.module('report').controller('bankReportCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {
  
  $('.index').removeClass("active");
  $('#menureportindex').addClass("active");
  $('#bankreportindex').addClass("active");

    $('#printTable').hide();

    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.entryLimit = 5;
    $scope.filterUser = 0;
    $scope.filterUserend = 1;
    $scope.numPerPage = 10;
    $scope.obj_Main = [];
    $scope.bankList = [];
    $scope.bankListcount = 0;
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
    $scope.viewBankDetails($scope.ind);
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
  //   $scope.viewBankDetails($scope.ind);
  // };


    $scope.getAllSales = function () {
        
      $http({
        method: 'POST',
        url: $rootScope.baseURL+'/dashboard/bankreport',
        data: $scope.limit,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(saleList)
      {
        saleList.forEach(function (value, key) {
                  $scope.bankList.push(value);
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


    $scope.apiURL = $rootScope.baseURL+'/dashboard/bankreport/total';
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
	    .success(function(bank)
	    {
	      bank.forEach(function (value, key) {
                  $scope.bankListcount = value.total;
                  $scope.totalvalue = value.totalvalue;
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
        if ($scope.filterUser >= $scope.bankListcount)
            $scope.filterUser = $scope.bankListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/dashboard/bankreport/limit',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(bank)
              {
                $scope.filteredTodos = [];

                  bank.forEach(function (value, key) {
                      $scope.filteredTodos.push(value);
                  });
                  
                      // $scope.obj_Main = $scope.bankList;
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
    
  $scope.viewBankDetails1 = function (index) {
      $scope.ind = index;
      d = new Date();
      d.setFromDate();
      d.setToDate();
  };

  $scope.viewBankDetails = function (index) {
      $scope.banks = $scope.filteredTodos[index];

      $scope.categoryList =[];


      $scope.limit.fin_prev_year = localStorage.getItem("watersupply_admin_financial_year");
      $scope.limit.from = $("#user-datepicker-from").val();
      $scope.limit.to = $("#user-datepicker-to").val();

      $http({
        method: 'POST',
        url: $rootScope.baseURL+'/bank/details/'+$scope.filteredTodos[index].bkm_id,
        data: $scope.limit,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(categoryList)
      {
        // $scope.categoryList = angular.copy(categoryList);
        var amount_balance = 0;

        // if($scope.banks.bkm_opening_balance !=0){
        //   amount_balance = parseInt(amount_balance) + $scope.banks.bkm_opening_balance;
        //   $scope.categoryList = [{"credit":$scope.banks.bkm_opening_balance , "debit":"0", "drcr":"CR", "bal":amount_balance , "date":"" , "invoice":"" , "status":"Opening Balance" , "type":"Opening"}];
        // }
        
          categoryList.forEach(function (value, key) {
            // $scope.data = new Date(value.date);
            // $scope.data.setHours(0,0,0,0);
            if(value.deposit == 0)
            {
              amount_balance = parseInt(amount_balance) - parseInt(value.withdraw);
            }
            else if(value.withdraw == 0)
            {
              amount_balance = parseInt(amount_balance) + parseInt(value.deposit);
            }
            // if(amount_balance < 0)
            // {
            //   Math.abs(amount_balance);
            // value.bal = Math.abs(amount_balance);
            //   value.drcr="DR";
            // }
            // else{
            //   value.drcr="CR";
              value.bal = amount_balance;
            // }

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

    $scope.exportDetailsXls = function(){

      $("#contentexport").table2excel({
        exclude: ".noExl",
        name: "BankLedger",
        filename: "BankLedger.xls" //do not include extension
      });
    };


    $scope.printLedgerDetails = function(){
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
            "<center style='font-size:11pt;'>Bank Ledger</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='4' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Bank Name : <strong>"+$scope.banks.bkm_name+"</strong></td>" +
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.banks.bkm_address+" "+ $scope.banks.bkm_state+" "+ $scope.banks.bkm_city+ " "+ $scope.banks.bkm_pin +"</strong></td>" +
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Contact : <strong>"+$scope.banks.bkm_contact+"</strong></td>" +
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid none; border-width:1px;'>Email id : <strong>"+$scope.banks.bkm_email+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Account : <strong>"+$scope.banks.bkm_account_no+"</strong></td>" +
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Branch : <strong>"+$scope.banks.bkm_branch+"</strong></td>" +
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Ifsc : <strong>"+$scope.banks.bkm_ifsc+"</strong></td>" +
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid none; border-width:1px;'>Balance : <strong>"+$scope.banks.balance+"</strong></td>" +
                    "</tr>" ;
                    if($('#user-datepicker-from').val() != "" && $('#user-datepicker-to').val() != "") 
                    {
                    printchar = printchar + "<tr>" +
                      "<td colspan='2' width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid solid none none; border-width:1px;'>From Date : <strong>"+$filter('date')($scope.fDate, "dd-MM-yyyy")+"</strong></td>" +
                      "<td colspan='2' width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid none none none; border-width:1px;'>To Date : <strong>"+$filter('date')($scope.tDate, "dd-MM-yyyy")+"</strong></td>" +
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
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Date</th>"+
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Deposit</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Withraw</th>" +
                        // "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>DR/CR</th>" +
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

    $scope.exportXls = function(){

      $("#contentexportList").table2excel({
        exclude: ".noExl",
        name: "BankList",
        filename: "BankList.xls" //do not include extension
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
            "<center style='font-size:11pt;'>Bank Report</center>"+
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
                      "<td style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid none none none; border-width:1px;'>Total Balance Amount : <strong>"+$filter('number')($scope.totalvalue, "2")+"</strong></td>" +
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
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Bank Name</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Address</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Contact</th> " +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>E-Mail Id</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Account No</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Branch</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>IFSC</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Balance</th>" +
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