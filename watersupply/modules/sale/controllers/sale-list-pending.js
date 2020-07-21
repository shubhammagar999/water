// import admin
angular.module('sale').controller('salePendingListCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {

  $('.index').removeClass("active");
  $('#menusaleintex').addClass("active");
  $('#saleindex').addClass("active"); 
    
  $('#addrecord').hide();
  $('#checkrecord').hide();
  
  $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.entryLimit = 5;
    $scope.filterUser = 0;
    $scope.filterUserend = 1;
    $scope.numPerPage = 10;
    $scope.obj_Main = [];
    $scope.saleListcount = 0;
    $scope.limit = {};
    $scope.parseFloat = parseFloat;
    $scope.loading1 = 0;
    $scope.limit.com_id = 9;

    $scope.saleObj = {};
    $scope.saleObj.sm_advance_amt = 0;
    $scope.saleObj.sm_comment = 'N/A';

    const fin = localStorage.getItem("watersupply_admin_financial_year");

    $scope.com_file = localStorage.getItem("com_file");
    
    const finyr = fin.split('-');
    const finyr1 = finyr[0].toString().substring(2);
    const finyr2 = finyr[1].toString().substring(2);
    $scope.limit.fin_year = "%/"+finyr1+"-"+finyr2+"%";

    var d = new Date();
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth()).toString(); // getMonth() is zero-based
    var dd  = d.getDate().toString();

    var from = Date.parse((finyr[0].toString()) + '/04/01');
    var to   = Date.parse((finyr[1].toString()) + '/03/31');
    var check = Date.parse(d);
    if((check <= to && check >= from))
    {
        $scope.saleObj.sm_payment_date = yyyy +"-"+ (parseInt(mm)+parseInt(1)) +"-"+ dd;
    }

   $('#pDate').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        orientation: 'bottom',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.saleObj.sm_payment_date = $('#pDate').val();
        }
    });

    $scope.apiURL = $rootScope.baseURL+'/sale/sale/total/pending';


    $scope.getPermission = function(){
       if ($scope.user_type == 'emp') 
        {
            window.location.href = '#/404/'; 
        }
    };
    $scope.getPermission();
    
     $scope.getAll = function () {
          
        if ($('#searchtext').val() == undefined || $('#searchtext').val() == "") {
          $scope.limit.search = "";
          // $scope.limit.com_id = localStorage.getItem("com_id");
        }
        else{
          $scope.limit.search = $scope.searchtext;
          // $scope.limit.com_id = localStorage.getItem("com_id");
        }
        
        const finyr = fin.split('-');
        $scope.limit.from = finyr[0].toString() + '/04/01';
        $scope.limit.to = finyr[1].toString() + '/03/31';
          
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
        if ($scope.filterUser >= $scope.saleListcount)
            $scope.filterUser = $scope.saleListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/sale/sale/limit/pending',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(sale)
              {
                $scope.filteredTodos = [];
                if (sale.length > 0) {
                  $('#addrecord').hide();
                  $('#checkrecord').show();
                  sale.forEach(function (value, key) {
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

    $scope.deleteSale = function (sm_id) {
      console.log(sm_id);
      $('#confirm-delete').modal('show');
      $scope.sm_id=sm_id;
    }  

    $rootScope.deleteConfirm = function () {
      $('#del').attr('disabled','true');
      $('#del').text("please wait...");
	     $http({
	      method: 'POST',
	      url: $rootScope.baseURL+'/sale/pending/delete/'+$scope.sm_id.sm_id,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(saleObj)
	    {
                $('#del').text("Delete");
                $('#del').removeAttr('disabled');
                $scope.saleList = [];
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

    $scope.openSaleAction = function (index) {
      $('#sale-action').modal('show');
      $scope.sales = $scope.filteredTodos[index];
      $scope.saleObj.sm_id = $scope.filteredTodos[index].sm_id;
      $scope.saleObj.cm_id = $scope.filteredTodos[index].cm_id;
      // console.log(data);
    };

    $scope.saveActionConfirm = function () {

     if($('#pDate').val() == undefined || $('#pDate').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter payment date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#pDate").focus(); 
            }, 1500);
      }
      else if($('#sm_advance_amt').val() == undefined || $('#sm_advance_amt').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter amount paid.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');
                $("#sm_advance_amt").focus();  
            }, 1500);
        }
      else if($('#sm_payment_mode').val() == undefined || $('#sm_payment_mode').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select payment mode.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#sm_payment_mode").focus(); 
            }, 1500);
        }
      else if($('#sm_comment').val() == undefined || $('#sm_comment').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please add comment or N/A.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#sm_comment").focus(); 
            }, 1500);
        }
        else{
            $scope.saleObj.sm_balance_amt = $scope.sales.sm_amount - $scope.saleObj.sm_advance_amt;
          console.log($scope.saleObj);
              $('#smaction').attr('disabled','true');
              $('#smaction').text("please wait...");
             $http({
              method: 'POST',
              url: $rootScope.baseURL+'/sale/action',
              data: $scope.saleObj,
              headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            })
            .success(function(saleObj)
            {
                      $('#smaction').text("Save");
                      $('#smaction').removeAttr('disabled');
                      $scope.saleObj = {};
                      $scope.getAll();
                      $('#sale-action').modal('hide');

                       $scope.saleObj.sm_comment = 'N/A';
                       if((check <= to && check >= from))
                        {
                            $scope.saleObj.sm_payment_date = yyyy +"-"+ (parseInt(mm)+parseInt(1)) +"-"+ dd;
                        }
            })
            .error(function(data) 
            {   
              var dialog = bootbox.dialog({
                  message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                      $('#smaction').text("Save");
                      $('#smaction').removeAttr('disabled');
                      dialog.modal('hide'); 
                  }, 1500);            
            });
        }
  };

  $scope.viewSaleDetails = function (index) {
    
    $('#view-details').modal('show');
    $("#hidetablegst").hide();
    $scope.saleProductList = [];

      $scope.sales = $scope.filteredTodos[index];
      $scope.amount = $scope.filteredTodos[index].spm_net_amount;
     
      $scope.convertNumberToWords($scope.filteredTodos[index].sm_amount);
      var i = 1;
      
      $scope.limit.from_date = $scope.filteredTodos[index].sm_from_date;
      $scope.limit.to_date = $scope.filteredTodos[index].sm_to_date
      $scope.limit.customer_id = $scope.filteredTodos[index].sm_cm_id;
                 
      $http({
              method: 'POST',
              url: $rootScope.baseURL+'/sale/salereport/bill',
              data: $scope.limit,
              headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")
              }
            })
            .success(function(sale)
            { 
                $scope.saleProductList = [];
                sale.forEach(function (value, key) {
                      $scope.saleProductList.push(value);
                  });
                  $scope.calculate();
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


        $scope.sm_qty_filled = 0;
        $scope.sm_qty_empty = 0;
     $scope.calculate = function(){
        var i = 1;
        $scope.sm_qty_filled = 0;
        $scope.sm_qty_empty = 0;

        angular.forEach($scope.saleProductList, function(value, key) {
                
            value.srno = i++;
            
            $scope.sm_qty_filled = $scope.sm_qty_filled + value.pm_qty_filled;
            $scope.sm_qty_empty = $scope.sm_qty_empty + value.pm_qty_empty;
        });

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
          "<center style='font-size:11pt;'><strong>Invoice-Bill</strong></center>"+
          // "<center style='font-size:10pt;'>Composition taxable person. Not eligible to collect tax on supplies</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td  width='40%' style='text-align:center; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" ;
                        if (localStorage.getItem("com_file") != "null") {
                             page1 = page1 + "<center><img style='width: 90%; height: auto;' width='80%' height='80%' src='resources/images/logo1.png'/></center>" ;
                        }
                      page1 = page1 + "</td>" +
                      
                      "<td  width='60%' style='text-align:left; padding-bottom: 10;padding-left: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'><b>"+localStorage.getItem("com_name")+"</b></h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                  "</table>"+ 
                  "<table width='100%'>"+
                    "<tr>" +
                      "<td style='padding:4px 8px 4px 8px;text-align: center; font-size:10pt; border-style: none none solid none; border-width:1px;'>"+
                          "20-Liters of cold water available in jars as well as Home delivery services in offices, shops, wedding and other events.<br>" +
                          "</td>" +
                    "</tr>" +
                  "</table>"+
                  "<table width='100%'>"+
                    "<tr>" +
                        "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>"+
                            "Name : <strong>"+$scope.sales.cm_name+"</strong><br>"+
                            "Number : <strong>"+$scope.sales.cm_mobile+"</strong><br>";

                            if ($scope.sales.cm_email != 'N/A') {
                              page1 = page1 + "Email Id : <strong>"+$scope.sales.cm_email+"</strong><br>";
                            }
                            if ($scope.sales.cm_gst_no != 'N/A') {
                              page1 = page1 + "GST : <strong>"+$scope.sales.cm_gst_no+"</strong><br>";
                            }
                            if ($scope.sales.cm_address != 'N/A') {
                              page1 = page1 + "Address : <strong>"+$scope.sales.cm_address+"</strong><br>";
                            }
                            
                        page1 = page1 + "</td>" +
                      "<td width='40%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>"+
                          "Date: <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong><br>"+
                          "Serial No: <strong>"+$scope.sales.sm_invoice_no+"</strong><br>"+
                          "Billing Date: <strong>"+$filter('date')($scope.sales.sm_from_date,'dd-MM-yyyy')+" - "+$filter('date')($scope.sales.sm_to_date,'dd-MM-yyyy')+"</strong><br>"+
                      "</td>"+
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td colspan='3' valign='top' style=' border-style: none solid none solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+      
                      "<tr>"+
                        "<th width='15%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
                        "<th width='40%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Date</th> " +
                        "<th width='15%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Rate</th>" +
                        "<th width='15%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
                        "<th width='15%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Amount</th>" +
                        // "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#content').html()+" " +
                    // " "+$('#contentone').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
                    "<tr>" +
                        "<td colspan='4' valign='top' style=' border-style: none solid solid solid; border-width:1px;'>"+
                          "<table width='100%'>" +
                            "<thead>"+     
                              "<tr>"+
                                "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid solid none none; border-width:1px;'>Product Name: <strong>"+$scope.sales.sm_prod_name+"</strong> </td>" +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid none none none; border-width:1px;'>Rate: <strong>"+$filter('number')($scope.sales.sm_product_price, "2")+"</strong></td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid none none solid; border-width:1px;'>Total Quantity: <strong>"+$scope.sales.sm_qty_filled+"</strong></td> " +
                                // "<td width='40%'>&nbsp;</td>" +

                              "</tr>"+ 
                            "</thead>"+
                          "</table>"+
                        "</td>"+
                      "</tr>";
                if ($scope.sales.previous == 'Yes') {
                    page1 = page1 + "<tr>" +
                        "<td colspan='4' valign='top' style=' border-style: solid; border-width:1px;'>"+
                          "<table width='100%'>" +
                            "<thead>"+      
                              "<tr>"+
                                "<td width='60%' colspan='2' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none solid none none; border-width:1px;'>Pending Bill Details</td>" +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none solid none solid; border-width:1px;text-align:right;'>Net Amount</td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;text-align:right;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +

                              "</tr>"+     
                              "<tr>"+
                                "<td width='30%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none none none none; border-width:1px;'>Bill No: </td>" +
                                "<td width='30%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none none none none; border-width:1px;'>Bill Date:</td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid solid none solid; border-width:1px;text-align:right;'>Pending Amount</td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid none none none; border-width:1px;text-align:right;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +

                              "</tr>"+ 
                            "</thead>"+
                          "</table>"+
                        "</td>"+
                      "</tr>";
                  }
                 page1 = page1 + "<tr>" +
                  "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid solid; border-width:1px;text-align:right;'>Total Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;text-align:right;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
                "</tr>"+
             "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                        "<td width='60%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
                          // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
                          // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
                          "<strong>Declaration:</strong><br>" +
                        "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct." +
                          // "Composition Taxable Person, not eligible to collect tax on supplies."+
                        "</td>"+

                        // "<td width='17%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word; white-space:pre;'>" +
                        //     "<strong>Store Timing:</strong><br>" +
                        //     localStorage.getItem("com_note")+
                        // "</td>"+
                        // "<td width='25%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: none solid none none; border-width:1px;'>" +
                        //   "Company's Bank Details<br>"+
                        //   "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
                        //   "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
                        //   "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
                        //   "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
                        // "</td>" +
                        "<td width='40%' valign='top' style='text-align:center; padding:4px 8px 4px 8px; font-size:9pt;'>For "+localStorage.getItem("com_name")+":<br><br></td>" +
                    "</tr>" +
                    // "<tr>" +
                    //     "<td width='40%' valign='bottom' style='text-align:center; padding:4px 8px 4px 8px; font-size:9pt;'></td>" +
                    // "</tr>" +
                    // "<tr>" +
                    //     "<td width='40%' valign='bottom' style='text-align:center; padding:4px 8px 4px 8px; font-size:9pt;'></td>" +
                    // "</tr>" +
                    "<tr>" +
                        "<td width='40%' valign='bottom' style='text-align:center; padding:4px 8px 4px 8px; font-size:9pt;'>Authorized Signatory</td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+

            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";

        popupWin.document.write(page1);
        popupWin.document.close();
    }
   

});