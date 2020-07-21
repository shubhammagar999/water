// import admin
angular.module('report').controller('gstReportCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {

  $('.index').removeClass("active");
  $('#menureportindex').addClass("active");
  $('#gstindex').addClass("active");
    
  $('#printTable').hide();
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
    $scope.loading1 = 1;

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
$scope.apiURL = $rootScope.baseURL+'/dashboard/gstreport/total';

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
                  $scope.netamount = value.netamount;
                  $scope.cgstamount = value.cgstamount;
                  $scope.sgstamount = value.sgstamount;
                  $scope.igstamount = value.igstamount;
                  $scope.totalgst = value.totalgst;
              });

          $scope.loading1 = 1;
          $scope.printDetails();

          $('#filter-user-btn').html("<i class='fa fa-filter'></i> Filter");
          $('#filter-user-btn').removeAttr('disabled');
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
     document.getElementById("user-datepicker-to").value = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
    // $scope.filter();
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

      var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
          
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
           "<table width='100%' height='98%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      "<td colspan='2' style='text-align:center; padding-bottom: 10; font-size:10pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                          "<b>GST Computation </b><br>"+
                          "from "+$('#user-datepicker-from').val() +" to "+ $('#user-datepicker-to').val()+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td style='text-align:left; padding: 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "GSTR-3B"+
                      "</td>"+
                      "<td style='text-align:right; padding: 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "from "+$('#user-datepicker-from').val() +" to "+ $('#user-datepicker-to').val()+
                      "</td>"+
                    "</tr>" +
                    "<tr>" +
                      "<td colspan='2' style='text-align:left; padding: 10px; border-style: solid none solid none; border-width:1px; font-size:10pt;' valign='center' width='50%'>"+
                      "<b>Returns Summary</b>"+
                      "</td>"+
                    "</tr>" +
                    "<tr>" +
                      "<td style='text-align:left; padding: 10px 10px 5px 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "<b>Total number of vouchers for the period</b>"+
                      "</td>"+
                      "<td style='text-align:right; padding: 10px 10px 5px 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "113"+
                      "</td>"+
                    "</tr>" +
                    "<tr>" +
                      "<td style='text-align:left; padding: 5px 10px 5px 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "Included in returns"+
                      "</td>"+
                      "<td style='text-align:right; padding: 5px 10px 5px 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "20"+
                      "</td>"+
                    "</tr>" +
                    "<tr>" +
                      "<td style='text-align:left; padding: 5px 10px 5px 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "Not relevant for returns"+
                      "</td>"+
                      "<td style='text-align:right; padding: 5px 10px 5px 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "93"+
                      "</td>"+
                    "</tr>" +
                    "<tr>" +
                      "<td style='text-align:left; padding: 5px 10px 10px 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "Incomplete/Mismatch in information (to be resolved)"+
                      "</td>"+
                      "<td style='text-align:right; padding: 5px 10px 10px 10px; font-size:10pt;' valign='center' width='50%'>"+
                      "0"+
                      "</td>"+
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
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Table No.</th>" +
                        // "<th width='10%'>Code</th> " +
                        "<th width='25%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Particulars</th> " +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Taxable Value</th>"+
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Integrated Tax Amount</th>" +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Central Tax Amount</th>" +
                        // "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt;'>Disc</th>"+
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>State Tax Amount</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Cess Amount</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Tax Amount</th>" +
                      "</tr>"+
                    "</thead>"+
                    "<body>"+
                      "<tr>"+
                        "<td>3.1</td>"+
                        "<td>Outward supplies and inward supplies liable to reverse charge</td>"+
                        "<td>"+$scope.netamount+"</td>"+
                        "<td>"+$scope.igstamount+"</td>"+
                        "<td>"+$scope.cgstamount+"</td>"+
                        "<td>"+$scope.sgstamount+"</td>"+
                        "<td></td>"+
                        "<td>"+$scope.totalgst+"</td>"+
                      "</tr>"+
                      "<tr>"+
                        "<td>3.2</td>"+
                        "<td>Of the supplies shown in 3.1 (a) above, details of inter-state supplies made to unregistered persons, composition taxable persons and UIN holders</td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                      "</tr>"+
                      "<tr>"+
                        "<td>4</td>"+
                        "<td>Eligible ITC</td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                      "</tr>"+
                      "<tr>"+
                        "<td>5</td>"+
                        "<td>Value of exempt, nil rated and non-GST inward supplies</td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                        "<td></td>"+
                      "</tr>"+
                    "</body>"+
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";
        popupWin.document.write(page1);
        popupWin.document.close();
    };

});