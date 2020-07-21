// import admin
angular.module('employee').controller('employeeListCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {


  $('.index').removeClass("active");
  $('#menuemployeeindex').addClass("active");
  $('#employeeindex').addClass("active");
  
    $('#addrecord').hide();
    $('#checkrecord').hide();
  
    $('#printTable').hide();
    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.entryLimit = 5;
    $scope.filterUser = 0;
    $scope.filterUserend = 1;
    $scope.numPerPage = 10;
    $scope.obj_Main = [];
    $scope.employeeList = [];
    $scope.employeeListcount = 0;
    $scope.limit = {};
    $scope.loading1 = 0;
    $scope.limit.com_id = 9;

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



    $scope.getPermission = function(){
       if ($scope.user_type == 'emp') 
        {
            window.location.href = '#/404/'; 
        }
    };
    $scope.getPermission();
    
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
      $('#view-details').modal('show');
    $scope.viewEmployeeDetails($scope.ind);
      // $scope.getUser();

      // $scope.draw();

  };

  // Date.prototype.setFromDate = function() {
  //  var yyyy = this.getFullYear().toString();
  //  var mm = (this.getMonth()).toString(); // getMonth() is zero-based
  //  var dd  = this.getDate().toString();
  //  document.getElementById("user-datepicker-from").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
  // };

  // Date.prototype.setToDate = function() {
  //  var yyyy = this.getFullYear().toString();
  //  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  //  var dd  = this.getDate().toString();
  //  document.getElementById("user-datepicker-to").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
  // $scope.filter();
  // };

  // d = new Date();
  // d.setFromDate();
  // d.setToDate();

  $scope.reset = function()
  {
    $scope.toDate = "";
    $scope.fromDate = "";
    $('#user-datepicker-from').val("");
    $('#user-datepicker-to').val("");
    $scope.dateFilter = "";
      $('#reset-user-btn').attr('disabled','true');
      $('#reset-user-btn').text("please wait...");
      $('#view-details').modal('show');
    $scope.viewEmployeeDetails($scope.ind);
  };


$scope.apiURL = $rootScope.baseURL+'/employee/employee/total';
   $scope.getAll = function () {

        
      if ($('#searchtext').val() == undefined || $('#searchtext').val() == "") {
        $scope.limit.search = "";
        // $scope.limit.com_id = localStorage.getItem("com_id");
      }
      else{
        $scope.limit.search = $scope.searchtext;
        // $scope.limit.com_id = localStorage.getItem("com_id");
      }
        
      $http({
        method: 'POST',
        url: $scope.apiURL,
        data: $scope.limit,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(employee)
	    {
	      employee.forEach(function (value, key) {
                  $scope.employeeListcount = value.total;
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
    $scope.resetpagination = function () {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.filterUserend = begin + 1;
        $scope.filterUser = end;
        if ($scope.filterUser >= $scope.employeeListcount)
            $scope.filterUser = $scope.employeeListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/employee/employee/limit',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(customer)
              {
                $scope.filteredTodos = [];
                if (customer.length > 0) {
                  $('#addrecord').hide();
                  $('#checkrecord').show();
                  customer.forEach(function (value, key) {
                      $scope.filteredTodos.push(value);
                  });
                }
                else{
                  $('#checkrecord').hide();
                  $('#addrecord').show();
                }
                
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

    $scope.deleteEmployee = function (emp_id) {
      
      $('#confirm-delete').modal('show');
      $scope.emp_id=emp_id;
    }  

    $rootScope.deleteConfirm = function () {
                $('#del').attr('disabled','true');
                $('#del').text("please wait...");
	     $http({
	      method: 'POST',
	      url: $rootScope.baseURL+'/employee/delete/'+$scope.emp_id,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(customerObj)
	    {
                $('#del').text("Delete");
                $('#del').removeAttr('disabled');
                $scope.getAll();
                $('#confirm-delete').modal('hide');
      		  
	    })
	    .error(function(data) 
	    {   
	      var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                closeButton: false
            });
            setTimeout(function(){
                $('#del').text("Delete");
                $('#del').removeAttr('disabled');
                dialog.modal('hide'); 
            }, 1500);            
	    });
	};

  $scope.viewEmployeeDetails1 = function (index) {
      $scope.ind = index;
    $('#user-datepicker-from').val("");
    $('#user-datepicker-to').val("");
    $scope.viewEmployeeDetails(index);
  };

  $scope.viewEmployeeDetails = function (index) {
      $scope.categoryList = [];
      $scope.empname = $scope.filteredTodos[index].emp_name;
      $scope.empno = $scope.filteredTodos[index].emp_mobile;
      $scope.empadd = $scope.filteredTodos[index].emp_address;
      
      $http({
        method: 'GET',
        url: $rootScope.baseURL+'/employee/details/'+ $scope.filteredTodos[index].emp_id,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(categoryList)
      {
        categoryList.forEach(function (value, key) {
            $scope.data = new Date(value.sm_date);
            $scope.data.setHours(0,0,0,0);
            if($scope.fDate <= $scope.data && $scope.tDate >= $scope.data)
            {
              $scope.categoryList.push(value);
            }
            else if($('#user-datepicker-from').val() == "" && $('#user-datepicker-to').val() == "") 
            {
              $scope.categoryList.push(value);
            }
        });
          $('#filter-user-btn').text("Filter");
          $('#filter-user-btn').removeAttr('disabled');
          $('#reset-user-btn').text("Reset");
          $('#reset-user-btn').removeAttr('disabled');
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
            "<center style='font-size:11pt;'>Employee Ledger</center>"+
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
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>employee Name : <strong>"+$scope.empname+"</strong></td>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid none; border-width:1px;'>Contact Number : <strong>"+$scope.empno+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='50%' colspan='2' style='padding:4px 8px 4px 8px; font-size:11pt;'>Address : <strong>"+$scope.empadd+"</strong></td>" +
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
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Invoice</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Name</th> " +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Date</th>"+
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Balance Amount</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Amount</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Status</th>" +
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
      $("#contentexport").table2excel({
        exclude: ".excludeThisClass",
        name: "Employee Ledger",
        filename: "Employee Ledger" //do not include extension
      });
    };

    $scope.printEmployeeList = function(){
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
            "<center style='font-size:11pt;'>Employee List</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:12pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>COMPANY NAME<br><span style='font-size:12pt'>TAGLINE</span></h3><br>" +
                          "Address : XXXXXXXXXXXXX<br>" +
                          "Phone : XXXXXXXXXX<br>"+
                          "E-Mail : example@companyname.com"+
                      "</td>" +
                    "</tr>" +
                    // "<tr>" +
                    //   "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid none none; border-width:1px;'>Total Quantity : <strong>"+$scope.totalqty+"</strong></td>" +
                    //   "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid none none; border-width:1px;'>Total Amount : <strong>"+$scope.totalvalue+"</strong></td>" +
                    // "</tr>"+
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
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Code</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Employee Name</th>"+
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Mobile Number</th> " +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Address</th> " +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#contentlist').html()+" " +
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

    $scope.exportXlslist = function(){
      $("#contentexportlist").table2excel({
        exclude: ".excludeThisClass",
        name: "Employee List",
        filename: "Employee List" //do not include extension
      });
    };

});