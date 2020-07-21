// import admin
angular.module('sale').controller('saleListCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {

  $('.index').removeClass("active");
  $('#menusaleintex').addClass("active");
  $('#newsaleindex1').addClass("active"); 
    
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
    $scope.salepreviousShow = undefined;

    const fin = localStorage.getItem("watersupply_admin_financial_year");

    $scope.com_file = localStorage.getItem("com_file");
    

    $scope.apiURL = $rootScope.baseURL+'/sale/sale/total';

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
                url: $rootScope.baseURL+'/sale/sale/limit',
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
      $('#confirm-delete').modal('show');
      $scope.sm_id=sm_id;
    }  

    $rootScope.deleteConfirm = function () {
        $('#del').attr('disabled','true');
        $('#del').text("please wait...");
	     $http({
	      method: 'POST',
	      url: $rootScope.baseURL+'/sale/delete/'+$scope.sm_id.sm_id,
        data: $scope.sm_id,
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

    $scope.reopenSale = function (sm_id) {
      $('#repoen-confirm').modal('show');
      $scope.sm_id=sm_id;
    }  

    $scope.reopenConfirm = function () {
                $('#reopen').attr('disabled','true');
                $('#reopen').text("please wait...");
       $http({
        method: 'POST',
        url: $rootScope.baseURL+'/sale/reopen/'+$scope.sm_id.sm_id,
        data: $scope.sm_id,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(saleObj)
      {
                $('#reopen').text("Reopen");
                $('#reopen').removeAttr('disabled');
                $scope.saleList = [];
                $scope.getAll();
                $('#repoen-confirm').modal('hide');
            
      })
      .error(function(data) 
      {   
        var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                closeButton: false
            });
            setTimeout(function(){
                $('#reopen').text("Reopen");
                $('#reopen').removeAttr('disabled');
                dialog.modal('hide'); 
            }, 1500);            
      });
  };

  $scope.viewSaleDetails = function (index) {
    
    $('#view-details').modal('show');
    $scope.saleProductList = [];
    $scope.saleprevious = [];
    $scope.salepreviousShow = undefined;

      $scope.sales = $scope.filteredTodos[index];
      $scope.amount = $scope.filteredTodos[index].spm_net_amount;
      // $scope.convertNumberToWords($scope.filteredTodos[index].sm_amount);
      var i = 1;
      
      $scope.limit.from_date = $scope.filteredTodos[index].sm_from_date;
      $scope.limit.to_date = $scope.filteredTodos[index].sm_to_date
      $scope.limit.customer_id = $scope.filteredTodos[index].sm_cm_id;
      $scope.limit.sale_id = $scope.filteredTodos[index].sm_id;

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
                  $scope.forList();
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

            // $http({
            //   method: 'POST',
            //   url: $rootScope.baseURL+'/sale/checkPending/forList',
            //   data: $scope.limit,
            //   headers: {'Content-Type': 'application/json',
            //           'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            // })
            // .success(function(data)
            // {   
            //   console.log(data);
            //   // if(data[0].sm_id == $scope.sales.sm_id){
            //   //      $scope.salepreviousShow = 1;
            //   //      console.log('11111111111');

            //   // }
            //   // else if(data[0].sm_balance_amt == 0){
            //   //    $scope.salepreviousShow = 1;
            //   //    console.log('22222222222');
            //   // }
            //   // else if(data[0].sm_balance_amt > 1){
            //   //    $scope.salepreviousShow = 0;
            //   //    console.log('33333333333');
            //   // }
            //   // else if(data[0].sm_balance_amt < 0){
            //   //    $scope.salepreviousShow = 0;
            //   //    console.log('44444444444');
            //   // }
            //   // else{
            //   //    console.log('55555555555');

            //   //     // data.forEach(function (value, key) {
            //   //     //       $scope.saleprevious.push(value);
            //   //     // });
            //   //    $scope.salepreviousShow = 0;
              
            //   // }
            //   // data.forEach(function (value, key) {
            //   //           $scope.saleprevious.push(value);
            //   //     });
            //   //   console.log($scope.saleprevious);
            // })
            // .error(function(data) 
            // {   
            //   var dialog = bootbox.dialog({
            //     message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
            //         closeButton: false
            //     });
            //     setTimeout(function(){
            //     $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
            //     $('#btnsave').removeAttr('disabled');
            //         dialog.modal('hide'); 
            //     }, 1500);            
            // });
    };

    $scope.forList = function(){
          $http({
              method: 'POST',
              url: $rootScope.baseURL+'/sale/check_pend/list',
              data: $scope.limit,
              headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")
              }
            })
            .success(function(data)
            { 
              console.log(data);
                $scope.saleprevious = [];
                  if(data.length == 0){
                       $scope.salepreviousShow = 1;
                       console.log('null data');
                  }
                  else{
                        if(data[0].sm_balance_amt == 0){
                          $scope.salepreviousShow = 1;
                         console.log('null data 2222');
                        }
                        else{
                         console.log('null data 33333');                         
                          $scope.salepreviousShow = 0;
                          data.forEach(function (value, key) {
                              $scope.saleprevious.push(value);
                          });
                          
                        }
                  }
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
        $scope.convertNumberToWords($scope.sales.sm_amount);

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
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>";
                          if (localStorage.getItem("com_gst") != "N/A") {
                           page1 = page1 + "GST No.: "+localStorage.getItem("com_gst")+"<br>";
                       }
                      page1 = page1 +"</td>" +
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
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid none none none; border-width:1px;'>Rate: <strong>"+$filter('number')($scope.sales.sm_prod_price, "2")+"</strong></td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid none none solid; border-width:1px;'>Total Quantity: <strong>"+$scope.sm_qty_filled+"</strong></td> " +
                                // "<td width='40%'>&nbsp;</td>" +

                              "</tr>"+ 
                            "</thead>"+
                          "</table>"+
                        "</td>"+
                      "</tr>";
                 if ($scope.salepreviousShow == 0) {
                    page1 = page1 + "<tr>" +
                        "<td colspan='4' valign='top' style=' border-style: solid; border-width:1px;'>"+
                          "<table width='100%'>" +
                            "<thead>"+      
                              "<tr>"+
                                "<td width='60%' colspan='2' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none solid none none; border-width:1px;'>Pending Bill Details</td>" +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none solid none solid; border-width:1px;text-align:right;'>Net Amount</td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;text-align:right;'><strong>"+$filter('number')($scope.sales.sm_net_amount, "2")+"</strong></td>" +

                              "</tr>"+     
                              "<tr>"+
                                "<td width='30%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none none none none; border-width:1px;'>Bill No: <strong>"+$scope.saleprevious[0].sm_invoice_no+" </strong></td>" +
                                "<td width='30%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none none none none; border-width:1px;'>Bill Date: <strong>"+$filter('date')($scope.saleprevious[0].sm_from_date,'dd-MM-yyyy')+" - "+$filter('date')($scope.saleprevious[0].sm_to_date,'dd-MM-yyyy')+"</strong></td>" +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid solid none solid; border-width:1px;text-align:right;'>Pending Balance</td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid none none none; border-width:1px;text-align:right;'><strong>"+$filter('number')($scope.saleprevious[0].sm_balance_amt, "2")+"</strong></td>" +

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
    // $scope.printDetails = function(){

    //   if($scope.sales.sm_status == 1){
    //     var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
    //     if($scope.sales.com_is_composition == 0) 
    //     {
    //     var page1 = "<html>" +
    //      " <head>" +
    //         "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
    //         "<style>.action{display:none;} .print-hide{display:none;}</style>"+
    //         "<style>@media print {.watermark {display: inline;position: fixed !important;opacity: 0.50;font-size: 100px;width: 100%;text-align: center;z-index: 1000;top:270px;right:5px;}}</style>" +
    //         "   <style type='text/css' media='print'>" +
    //         "  @page " +
    //          " {" +
    //           "    size:  A4 portrait;" +  /* auto is the initial value */
    //            "   margin: 0; " + /* this affects the margin in the printer settings */
    //           "}" +

    //           "html" +
    //           "{" +
    //            "   background-color: #FFFFFF;" + 
    //             "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
    //           "}" +

    //           "body" +
    //           "{" +
    //             "font-size:11pt;"+
    //             "font-family:'Open Sans', sans-serif;"+
    //            // "   border: solid 1px black ;" +
    //             "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
    //           "}" +
    //           "</style>" +
    //       "</head>" +
    //       "<body onload='window.print()'>" +          
    //       "<div class='watermark'>Cancelled</p></div>" +
    //       "<center style='font-size:11pt;'>Tax Invoice</center>"+
    //        "<table width='100%' height='95%'>" +
    //         "<thead>"+
    //           "<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
                      
    //                   "<td  width='40%' style='text-align:center; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" ;
    //                     if (localStorage.getItem("com_file") != "null") {
    //                          page1 = page1 + "<center><img style='width: 90%; height: auto;' width='80%' height='80%' src='"+localStorage.getItem("com_file")+"'/><center>" ;
    //                     }
    //                   page1 = page1 + "</td>" +
                      
    //                   "<td  width='60%' style='text-align:left; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" +
    //                       "<h3 style='font-size:14pt;margin-bottom: 0;'><b>"+localStorage.getItem("com_name")+"</b></h3><br>" +
    //                       "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
    //                       "Phone : "+localStorage.getItem("com_contact")+"<br>"+
    //                       "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
    //                       "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
    //                   "</td>" +
                      
    //                   // "<td style='text-align:center; padding-bottom: 10;white-space:pre; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center' width='33%'>" +
    //                   //     // "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
    //                   //     // "<span>"+localStorage.getItem("com_note")+"</span><br>"+
    //                   // "</td>" +
    //                 "</tr>" +
    //               "</table>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
    //                   "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>"+
    //                         "Name : <strong>"+$scope.sales.cm_name+"</strong><br>"+
    //                         "Number : <strong>"+$scope.sales.cm_mobile+"</strong><br>";

    //                         if ($scope.sales.cm_email != 'N/A') {
    //                           page1 = page1 + "Email Id : <strong>"+$scope.sales.cm_email+"</strong><br>";
    //                         }
    //                         if ($scope.sales.cm_gst_no != 'N/A') {
    //                           page1 = page1 + "GST : <strong>"+$scope.sales.cm_gst_no+"</strong><br>";
    //                         }
    //                         if ($scope.sales.cm_address != 'N/A') {
    //                           page1 = page1 + "Address : <strong>"+$scope.sales.cm_address+"</strong><br>";
    //                         }

    //                         page1 = page1 + "Order No. : <strong>"+$scope.sales.sm_buyer_no+"</strong><br>"+
    //                       "</td>" +
    //                   // "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Address : <strong>"+$scope.sales.cm_address+"</strong></td>" +
    //                   "<td width='40%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>"+
    //                       "Serial No: <strong>"+$scope.sales.sm_invoice_no+"</strong><br>"+
    //                       "Date: <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong><br>"+

    //                       "Delivery Date: <strong>"+$filter('date')($scope.sales.sm_del_date,'dd-MM-yyyy')+"</strong><br>";
            
    //                       if($scope.sales.sm_payment_mode == 'credit'){
    //                         page1 = page1 + "Receive Date: <strong>"+$filter('date')($scope.smpaymentdate,'dd-MM-yyyy')+"</strong>";
    //                       }
    //                       page1 = page1 + "</td>"+
                        
    //                   // "<td width='1%'></td>"+
    //                 "</tr>" +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //         "</thead>"+
    //         "<tbody>"+
    //           "<tr>"+
    //             "<td colspan='3' valign='top' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>" +
    //                 "<thead>"+      
    //                     "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
    //                     // "<th width='10%'>Code</th> " +
    //                     "<th width='25%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>HSN/SAC</th>"+
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" ;
    //                     if($scope.sales.spm_disc > 0)
    //                     {
    //                       page1 = page1 + "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Disc</th>" ;
    //                     }
    //                     page1 = page1 + "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>CGST</th>" +
    //                     "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>SGST</th>" +
    //                     "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>IGST</th>" +
    //                     "<th width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Net Amount</th>" +
    //                   "</tr>"+
    //                 "</thead>"+
    //                 " "+$('#content').html()+" " +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //         "</tbody>"+
    //         "<tfoot>"+
    //             "<tr>" +
    //               "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      
    //               // "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;white-space:pre;'>Terms & Conditions:<br> <strong>"+localStorage.getItem("com_comment")+"</strong></td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
    //           "</tr>"+
    //           "<tr>"+
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>CGST (+)</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_cgst, "2")+"</strong></td>" +
    //           "</tr>"+
    //           "<tr>"+
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>SGST (+)</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_sgst, "2")+"</strong></td>" +
    //           "</tr>"+
    //           "<tr>"+
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>IGST (+)</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_igst, "2")+"</strong></td>" +
    //           "</tr>";
    //           if ($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges !=0)
    //           {
    //               page1 = page1 + "<tr>"+
                      
    //                   "<td rowspan='6' width='60%' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: solid ; border-width:1px; white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
    //               "</tr>" +
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
    //               "</tr>" +
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>" +

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges ==0)
    //           {
    //               page1 = page1 + "<tr>"+
    //                   // "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      
    //                   "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: solid ; border-width:1px;white-space:pre;'> "+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
    //               "</tr>" +
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>" +

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else if($scope.sales.sm_discount == 0 && $scope.sales.sm_other_charges !=0)
    //           {
    //               page1 = page1 + "<tr>"+

    //                   "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: solid ; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
    //               "</tr>" +
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>" +

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else
    //           {
    //               page1 = page1 + "<tr>"+

    //                   "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: solid ; border-width:1px;white-space:pre;'> "+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>" +

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           page1 = page1 + "<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>"+
    //                   "<td rowspan='2' width='32%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>HSN/SAC</td>"+
    //                   "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Taxable Value</td>"+
    //                   "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Central Tax</td>"+
    //                   "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>State Tax</td>"+
    //                   "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Total Tax Amount</td>"+
    //                 "</tr>"+
    //                 "<tr>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Amount</td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Amount</td>"+
    //                 "</tr>"+
    //                 ""+ $('#gstdist').html()+" " +
    //                 "<tr>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='right'><strong>Total</strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtaxable_value,2)+"</strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_cgst,2)+"</strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_sgst,2)+"</strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid none none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtotal_tax,2)+"</strong></td>"+
    //                 "</tr>"+
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //           "<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
    //                     "<td width='38%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
    //                       // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
    //                       // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
    //                       "<strong>Declaration:</strong><br>" +
    //                     "I/we hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002 is in force on the date on which the sale of goods specifies in thes tax invoice is made by me/us and that the transaction of sale covered by this tax invoice has been effected by me/us and is shall be accounted for in the turnover of sale while filling the return due tax, if any, payable on the sale has been paid or shall be paid." +
    //                       // "Composition Taxable Person, not eligible to collect tax on supplies."+
    //                     "</td>"+
    //                     "<td width='17%'style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word; white-space:pre;'>" +
    //                       // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
    //                       // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
    //                       "<strong>Store Timing:</strong><br>" +
    //                         localStorage.getItem("com_note")+
    //                     // "Composition Taxable Person, not eligible to collect tax on supplies."+
    //                     "</td>"+
    //                     "<td width='25%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: none solid none none; border-width:1px;'>" +
    //                       "Company's Bank Details<br>"+
    //                       "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
    //                       "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
    //                       "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
    //                       "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
    //                     "</td>" +
    //                     "<td width='30%' valign='top' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>For "+localStorage.getItem("com_name")+":</td>" +
    //                 "</tr>" +
    //                 "<tr>" +
    //                     "<td valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'></td>" +
                    
    //                     "<td width='30%' valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>Authorized Signatory</td>" +
    //                 "</tr>" +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+

    //           "<tr >" +
    //               "<td colspan='3' valign='bottom' style='text-align:center; padding:4px 8px 4px 8px; font-size:9pt;border:1px solid;'>  Thank you!!! Visit us again!!!  </td>" +
    //           "</tr>" +
    //         "</tfoot>"+
    //       "</table>"+
    //       "</body>" +
    //     "</html>";
    //   }
    //   else
    //   {
    //     var page1 = "<html>" +
    //      " <head>" +
    //         "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
    //         "<style>.action{display:none;} .print-hide{display:none;}</style>"+
    //         "<style>@media print {.watermark {display: inline;position: fixed !important;opacity: 0.50;font-size: 100px;width: 100%;text-align: center;z-index: 1000;top:270px;right:5px;}}</style>" +            
    //         "   <style type='text/css' media='print'>" +
    //         "  @page " +
    //          " {" +
    //           "    size:  A4 portrait;" +  /* auto is the initial value */
    //            "   margin: 0; " + /* this affects the margin in the printer settings */
    //           "}" +

    //           "html" +
    //           "{" +
    //            "   background-color: #FFFFFF;" + 
    //             "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
    //           "}" +

    //           "body" +
    //           "{" +
    //             "font-size:11pt;"+
    //             "font-family:'Open Sans', sans-serif;"+
    //            // "   border: solid 1px black ;" +
    //             "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
    //           "}" +
    //           "</style>" +
    //       "</head>" +
    //       "<body onload='window.print()'>" +          
    //       "<div class='watermark'>Cancelled</p></div>" +
    //       "<center style='font-size:11pt;'><strong>Bill of Supply</strong></center>"+
    //       "<center style='font-size:10pt;'>Composition taxable person. Not eligible to collect tax on supplies</center>"+
    //        "<table width='100%' height='95%'>" +
    //         "<thead>"+
    //           "<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
                      
    //                   "<td  width='40%' style='text-align:center; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" ;
    //                     if (localStorage.getItem("com_file") != "null") {
    //                          page1 = page1 + "<center><img style='width: 90%; height: auto;' width='80%' height='80%' src='"+localStorage.getItem("com_file")+"'/></center>" ;
    //                     }
    //                   page1 = page1 + "</td>" +
                      
    //                   "<td  width='60%' style='text-align:left; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" +
    //                       "<h3 style='font-size:14pt;margin-bottom: 0;'><b>"+localStorage.getItem("com_name")+"</b></h3><br>" +
    //                       "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
    //                       "Phone : "+localStorage.getItem("com_contact")+"<br>"+
    //                       "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
    //                       "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
    //                   "</td>" +
                      
    //                   // "<td style='text-align:center; padding-bottom: 10;white-space:pre; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center' width='33%'>" +
    //                   //     // "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
    //                   //     // "<span>"+localStorage.getItem("com_note")+"</span><br>"+
    //                   // "</td>" +
    //                 "</tr>" +
    //               "</table>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
    //                   "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>"+
    //                         "Name : <strong>"+$scope.sales.cm_name+"</strong><br>"+
    //                         "Number : <strong>"+$scope.sales.cm_mobile+"</strong><br>";

    //                         if ($scope.sales.cm_email != 'N/A') {
    //                           page1 = page1 + "Email Id : <strong>"+$scope.sales.cm_email+"</strong><br>";
    //                         }
    //                         if ($scope.sales.cm_gst_no != 'N/A') {
    //                           page1 = page1 + "GST : <strong>"+$scope.sales.cm_gst_no+"</strong><br>";
    //                         }
    //                         if ($scope.sales.cm_address != 'N/A') {
    //                           page1 = page1 + "Address : <strong>"+$scope.sales.cm_address+"</strong><br>";
    //                         }

    //                         page1 = page1 + "Order No. : <strong>"+$scope.sales.sm_buyer_no+"</strong><br>"+
    //                       "</td>" +
    //                   // "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Address : <strong>"+$scope.sales.cm_address+"</strong></td>" +
    //                   // "<td width='40%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Serial No: <strong>"+$scope.sales.sm_invoice_no+"</strong><br>Date: <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong><br>Receive Date: <strong>"+$filter('date')($scope.smpaymentdate,'dd-MM-yyyy')+"</strong></td>" +
    //                   // "<td width='1%'></td>"+
    //                   "<td width='40%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>"+
    //                       "Serial No: <strong>"+$scope.sales.sm_invoice_no+"</strong><br>"+
    //                       "Date: <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong><br>"+
    //                       "Delivery Date: <strong>"+$filter('date')($scope.sales.sm_del_date,'dd-MM-yyyy')+"</strong><br>";
                          
    //                       if($scope.sales.sm_payment_mode == 'credit'){
    //                         page1 = page1 + "Receive Date: <strong>"+$filter('date')($scope.smpaymentdate,'dd-MM-yyyy')+"</strong>";
    //                       }
    //                       page1 = page1 + "</td>"+
    //                 "</tr>" +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //         "</thead>"+
    //         "<tbody>"+
    //           "<tr>"+
    //             "<td colspan='3' valign='top' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>" +
    //                 "<thead>"+      
    //                   "<tr>"+
    //                     "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
    //                     // "<th width='10%'>Code</th> " +
    //                     "<th width='55%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" ;
    //                     if($scope.sales.spm_disc > 0)
    //                     {
    //                       page1 = page1 + "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Disc</th>" ;
    //                     }
    //                     page1 = page1 + "<th width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Net Amount</th>" +
    //                   "</tr>"+
    //                 "</thead>"+
    //                 " "+$('#content').html()+" " +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //         "</tbody>"+
    //         "<tfoot>"+
    //             "<tr>" +
    //               "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      
    //               // "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;white-space:pre;'><strong>"+localStorage.getItem("com_comment")+"</strong></td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid solid; border-width:1px;'>Net Amount</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
    //           "</tr>";
    //           if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges !=0)
    //           {
    //             page1 = page1 + "<tr>"+
    //                   "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Discount Amount (-)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Other Charges (+)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>"+

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges ==0)
    //           {
    //             page1 = page1 + "<tr>"+
    //                   "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Discount Amount (-)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>"+

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else if($scope.sales.sm_discount == 0 && $scope.sales.sm_other_charges !=0)
    //           {
    //             page1 = page1 + "<tr>"+
                      
    //                   "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Other Charges (+)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>"+

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else{
    //             page1 = page1 + "<tr>"+
    //               "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //               // "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //           "</tr>" +

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           page1 = page1 +"<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
    //                     "<td width='38%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
    //                       // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
    //                       // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
    //                       "<strong>Declaration:</strong><br>" +
    //                     "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct." +
    //                       // "Composition Taxable Person, not eligible to collect tax on supplies."+
    //                     "</td>"+

    //                     "<td width='17%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word; white-space:pre;'>" +
    //                         "<strong>Store Timing:</strong><br>" +
    //                         localStorage.getItem("com_note")+
    //                     "</td>"+
    //                     "<td width='25%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: none solid none none; border-width:1px;'>" +
    //                       "Company's Bank Details<br>"+
    //                       "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
    //                       "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
    //                       "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
    //                       "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
    //                     "</td>" +
    //                     "<td width='30%' valign='top' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>For "+localStorage.getItem("com_name")+":</td>" +
    //                 "</tr>" +
    //                 "<tr>" +
    //                     "<td width='30%' valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>Authorized Signatory</td>" +
    //                 "</tr>" +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+

    //           "<tr >" +
    //               "<td colspan='3' valign='bottom' style='text-align:center; padding:4px 8px 4px 8px; font-size:9pt;border:1px solid;'>  Thank you!!! Visit us again!!! </td>" +
    //           "</tr>" +
    //         "</tfoot>"+
    //       "</table>"+
    //       "</body>" +
    //     "</html>";
    //   }
    //     popupWin.document.write(page1);
    //     popupWin.document.close();
    //   }
    //   else{
    //     var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
    //       if($scope.sales.com_is_composition == 0) 
    //     {
    //     var page1 = "<html>" +
    //      " <head>" +
    //         "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
    //         "<style>.action{display:none;} .print-hide{display:none;}</style>"+
    //         "   <style type='text/css' media='print'>" +
    //         "  @page " +
    //          " {" +
    //           "    size:  A4 portrait;" +  /* auto is the initial value */
    //            "   margin: 0; " + /* this affects the margin in the printer settings */
    //           "}" +

    //           "html" +
    //           "{" +
    //            "   background-color: #FFFFFF;" + 
    //             "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
    //           "}" +

    //           "body" +
    //           "{" +
    //             "font-size:11pt;"+
    //             "font-family:'Open Sans', sans-serif;"+
    //            // "   border: solid 1px black ;" +
    //             "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
    //           "}" +
    //           "</style>" +
    //       "</head>" +
    //       "<body onload='window.print()'>" +
    //       "<center style='font-size:11pt;'>Tax Invoice</center>"+
    //        "<table width='100%' height='95%'>" +
    //         "<thead>"+
    //           "<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
                      
    //                   "<td  width='40%' style='text-align:center; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" ;
    //                     if (localStorage.getItem("com_file") != "null") {
    //                          page1 = page1 + "<center><img style='width: 90%; height: auto;' width='80%' height='80%' src='"+localStorage.getItem("com_file")+"'/></center>" ;
    //                     }
    //                   page1 = page1 + "</td>" +
                      
    //                   "<td  width='60%' style='text-align:left; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" +
    //                       "<h3 style='font-size:14pt;margin-bottom: 0;'><b>"+localStorage.getItem("com_name")+"</b></h3><br>" +
    //                       "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
    //                       "Phone : "+localStorage.getItem("com_contact")+"<br>"+
    //                       "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
    //                       "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
    //                   "</td>" +
                      
    //                   // "<td style='text-align:center; padding-bottom: 10;white-space:pre; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center' width='33%'>" +
    //                   //     // "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
    //                   //     // "<span>"+localStorage.getItem("com_note")+"</span><br>"+
    //                   // "</td>" +
    //                 "</tr>" +
    //               "</table>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
    //                   "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>"+
    //                         "Name : <strong>"+$scope.sales.cm_name+"</strong><br>"+
    //                         "Number : <strong>"+$scope.sales.cm_mobile+"</strong><br>";

    //                         if ($scope.sales.cm_email != 'N/A') {
    //                           page1 = page1 + "Email Id : <strong>"+$scope.sales.cm_email+"</strong><br>";
    //                         }
    //                         if ($scope.sales.cm_gst_no != 'N/A') {
    //                           page1 = page1 + "GST : <strong>"+$scope.sales.cm_gst_no+"</strong><br>";
    //                         }
    //                         if ($scope.sales.cm_address != 'N/A') {
    //                           page1 = page1 + "Address : <strong>"+$scope.sales.cm_address+"</strong><br>";
    //                         }

    //                         page1 = page1 + "Order No. : <strong>"+$scope.sales.sm_buyer_no+"</strong><br>"+
    //                       "</td>" +
    //                   // "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Address : <strong>"+$scope.sales.cm_address+"</strong></td>" +
    //                   "<td width='40%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>"+
    //                       "Serial No: <strong>"+$scope.sales.sm_invoice_no+"</strong><br>"+
    //                       "Date: <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong><br>"+

    //                       "Delivery Date: <strong>"+$filter('date')($scope.sales.sm_del_date,'dd-MM-yyyy')+"</strong><br>";
                          
    //                       if($scope.sales.sm_payment_mode == 'credit'){
    //                         page1 = page1 + "Receive Date: <strong>"+$filter('date')($scope.smpaymentdate,'dd-MM-yyyy')+"</strong>";
    //                       }
    //                       page1 = page1 + "</td>"+
                        
    //                   // "<td width='1%'></td>"+
    //                 "</tr>" +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //         "</thead>"+
    //         "<tbody>"+
    //           "<tr>"+
    //             "<td colspan='3' valign='top' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>" +
    //                 "<thead>"+      
    //                     "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
    //                     // "<th width='10%'>Code</th> " +
    //                     "<th width='25%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>HSN/SAC</th>"+
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" ;
    //                     if($scope.sales.spm_disc > 0)
    //                     {
    //                       page1 = page1 + "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Disc</th>" ;
    //                     }
    //                     page1 = page1 + "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>CGST</th>" +
    //                     "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>SGST</th>" +
    //                     "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>IGST</th>" +
    //                     "<th width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Net Amount</th>" +
    //                   "</tr>"+
    //                 "</thead>"+
    //                 " "+$('#content').html()+" " +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //         "</tbody>"+
    //         "<tfoot>"+
    //             "<tr>" +
    //               "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      
    //               // "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;white-space:pre;'>Terms & Conditions:<br> <strong>"+localStorage.getItem("com_comment")+"</strong></td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
    //           "</tr>"+
    //           "<tr>"+
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>CGST (+)</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_cgst, "2")+"</strong></td>" +
    //           "</tr>"+
    //           "<tr>"+
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>SGST (+)</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_sgst, "2")+"</strong></td>" +
    //           "</tr>"+
    //           "<tr>"+
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>IGST (+)</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_igst, "2")+"</strong></td>" +
    //           "</tr>";
    //           if ($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges !=0)
    //           {
    //               page1 = page1 + "<tr>"+
                      
    //                   "<td rowspan='6' width='60%' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: solid ; border-width:1px; white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
    //               "</tr>" +
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
    //               "</tr>" +
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>" +

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges ==0)
    //           {
    //               page1 = page1 + "<tr>"+
    //                   // "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      
    //                   "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: solid ; border-width:1px;white-space:pre;'> "+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
    //               "</tr>" +
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>" +

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else if($scope.sales.sm_discount == 0 && $scope.sales.sm_other_charges !=0)
    //           {
    //               page1 = page1 + "<tr>"+

    //                   "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: solid ; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
    //               "</tr>" +
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>" +

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else
    //           {
    //               page1 = page1 + "<tr>"+

    //                   "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: solid ; border-width:1px;white-space:pre;'> "+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>" +

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           page1 = page1 + "<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>"+
    //                   "<td rowspan='2' width='32%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>HSN/SAC</td>"+
    //                   "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Taxable Value</td>"+
    //                   "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Central Tax</td>"+
    //                   "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>State Tax</td>"+
    //                   "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Total Tax Amount</td>"+
    //                 "</tr>"+
    //                 "<tr>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Amount</td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Amount</td>"+
    //                 "</tr>"+
    //                 ""+ $('#gstdist').html()+" " +
    //                 "<tr>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='right'><strong>Total</strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtaxable_value,2)+"</strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_cgst,2)+"</strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_sgst,2)+"</strong></td>"+
    //                   "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid none none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtotal_tax,2)+"</strong></td>"+
    //                 "</tr>"+
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //           "<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
    //                     "<td width='38%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
    //                       // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
    //                       // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
    //                       "<strong>Declaration:</strong><br>" +
    //                     "I/we hereby certify that my/our registration certificate under the Maharashtra Value Added Tax Act 2002 is in force on the date on which the sale of goods specifies in thes tax invoice is made by me/us and that the transaction of sale covered by this tax invoice has been effected by me/us and is shall be accounted for in the turnover of sale while filling the return due tax, if any, payable on the sale has been paid or shall be paid." +
    //                       // "Composition Taxable Person, not eligible to collect tax on supplies."+
    //                     "</td>"+
    //                     "<td width='17%'style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word; white-space:pre;'>" +
    //                       // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
    //                       // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
    //                       "<strong>Store Timing:</strong><br>" +
    //                         localStorage.getItem("com_note")+
    //                     // "Composition Taxable Person, not eligible to collect tax on supplies."+
    //                     "</td>"+
    //                     "<td width='25%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: none solid none none; border-width:1px;'>" +
    //                       "Company's Bank Details<br>"+
    //                       "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
    //                       "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
    //                       "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
    //                       "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
    //                     "</td>" +
    //                     "<td width='30%' valign='top' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>For "+localStorage.getItem("com_name")+":</td>" +
    //                 "</tr>" +
    //                 "<tr>" +
    //                     "<td valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'></td>" +
                    
    //                     "<td width='30%' valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>Authorized Signatory</td>" +
    //                 "</tr>" +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+

    //           "<tr >" +
    //               "<td colspan='3' valign='bottom' style='text-align:center; padding:4px 8px 4px 8px; font-size:9pt;border:1px solid;'>  Thank you!!! Visit us again!!!  </td>" +
    //           "</tr>" +
    //         "</tfoot>"+
    //       "</table>"+
    //       "</body>" +
    //     "</html>";
    //   }
    //   else
    //   {
    //     var page1 = "<html>" +
    //      " <head>" +
    //         "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
    //         "<style>.action{display:none;} .print-hide{display:none;}</style>"+
    //         "   <style type='text/css' media='print'>" +
    //         "  @page " +
    //          " {" +
    //           "    size:  A4 portrait;" +  /* auto is the initial value */
    //            "   margin: 0; " + /* this affects the margin in the printer settings */
    //           "}" +

    //           "html" +
    //           "{" +
    //            "   background-color: #FFFFFF;" + 
    //             "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
    //           "}" +

    //           "body" +
    //           "{" +
    //             "font-size:11pt;"+
    //             "font-family:'Open Sans', sans-serif;"+
    //            // "   border: solid 1px black ;" +
    //             "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
    //           "}" +
    //           "</style>" +
    //       "</head>" +
    //       "<body onload='window.print()'>" +
    //       "<center style='font-size:11pt;'><strong>Bill of Supply</strong></center>"+
    //       "<center style='font-size:10pt;'>Composition taxable person. Not eligible to collect tax on supplies</center>"+
    //        "<table width='100%' height='95%'>" +
    //         "<thead>"+
    //           "<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
                      
    //                   "<td  width='40%' style='text-align:center; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" ;
    //                     if (localStorage.getItem("com_file") != "null") {
    //                          page1 = page1 + "<center><img style='width: 90%; height: auto;' width='80%' height='80%' src='"+localStorage.getItem("com_file")+"'/></center>" ;
    //                     }
    //                   page1 = page1 + "</td>" +
                      
    //                   "<td  width='60%' style='text-align:left; padding-bottom: 10; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center'>" +
    //                       "<h3 style='font-size:14pt;margin-bottom: 0;'><b>"+localStorage.getItem("com_name")+"</b></h3><br>" +
    //                       "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
    //                       "Phone : "+localStorage.getItem("com_contact")+"<br>"+
    //                       "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
    //                       "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
    //                   "</td>" +
                      
    //                   // "<td style='text-align:center; padding-bottom: 10;white-space:pre; border-style: none none solid none; border-width:1px; font-size:10pt;' valign='center' width='33%'>" +
    //                   //     // "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
    //                   //     // "<span>"+localStorage.getItem("com_note")+"</span><br>"+
    //                   // "</td>" +
    //                 "</tr>" +
    //               "</table>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
    //                   "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>"+
    //                         "Name : <strong>"+$scope.sales.cm_name+"</strong><br>"+
    //                         "Number : <strong>"+$scope.sales.cm_mobile+"</strong><br>";

    //                         if ($scope.sales.cm_email != 'N/A') {
    //                           page1 = page1 + "Email Id : <strong>"+$scope.sales.cm_email+"</strong><br>";
    //                         }
    //                         if ($scope.sales.cm_gst_no != 'N/A') {
    //                           page1 = page1 + "GST : <strong>"+$scope.sales.cm_gst_no+"</strong><br>";
    //                         }
    //                         if ($scope.sales.cm_address != 'N/A') {
    //                           page1 = page1 + "Address : <strong>"+$scope.sales.cm_address+"</strong><br>";
    //                         }

    //                         page1 = page1 + "Order No. : <strong>"+$scope.sales.sm_buyer_no+"</strong><br>"+
    //                       "</td>" +
    //                   // "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Address : <strong>"+$scope.sales.cm_address+"</strong></td>" +
    //                   // "<td width='40%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Serial No: <strong>"+$scope.sales.sm_invoice_no+"</strong><br>Date: <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong><br>Receive Date: <strong>"+$filter('date')($scope.smpaymentdate,'dd-MM-yyyy')+"</strong></td>" +
    //                   // "<td width='1%'></td>"+
    //                   "<td width='40%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>"+
    //                       "Serial No: <strong>"+$scope.sales.sm_invoice_no+"</strong><br>"+
    //                       "Date: <strong>"+$filter('date')($scope.sales.sm_date,'dd-MM-yyyy')+"</strong><br>"+

    //                       "Delivery Date: <strong>"+$filter('date')($scope.sales.sm_del_date,'dd-MM-yyyy')+"</strong><br>";
                          
    //                       if($scope.sales.sm_payment_mode == 'credit'){
    //                         page1 = page1 + "Receive Date: <strong>"+$filter('date')($scope.smpaymentdate,'dd-MM-yyyy')+"</strong>";
    //                       }
    //                       page1 = page1 + "</td>"+
    //                 "</tr>" +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //         "</thead>"+
    //         "<tbody>"+
    //           "<tr>"+
    //             "<td colspan='3' valign='top' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>" +
    //                 "<thead>"+      
    //                   "<tr>"+
    //                     "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
    //                     // "<th width='10%'>Code</th> " +
    //                     "<th width='55%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
    //                     "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" ;
    //                     if($scope.sales.spm_disc > 0)
    //                     {
    //                       page1 = page1 + "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Disc</th>" ;
    //                     }
    //                     page1 = page1 + "<th width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Net Amount</th>" +
    //                   "</tr>"+
    //                 "</thead>"+
    //                 " "+$('#content').html()+" " +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+
    //         "</tbody>"+
    //         "<tfoot>"+
    //             "<tr>" +
    //               "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      
    //               // "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;white-space:pre;'><strong>"+localStorage.getItem("com_comment")+"</strong></td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid solid; border-width:1px;'>Net Amount</td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
    //           "</tr>";
    //           if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges !=0)
    //           {
    //             page1 = page1 + "<tr>"+
    //                   "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Discount Amount (-)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Other Charges (+)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>"+

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else if($scope.sales.sm_discount != 0 && $scope.sales.sm_other_charges ==0)
    //           {
    //             page1 = page1 + "<tr>"+
    //                   "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Discount Amount (-)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.spm_disc, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>"+

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else if($scope.sales.sm_discount == 0 && $scope.sales.sm_other_charges !=0)
    //           {
    //             page1 = page1 + "<tr>"+
                      
    //                   "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //                   // "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Other Charges (+)</td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_other_charges, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //               "</tr>"+

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           else{
    //             page1 = page1 + "<tr>"+
    //               "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;white-space:pre;'>"+localStorage.getItem("com_comment")+"</td>" +
                  
    //               // "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Total Amount </td>" +
    //               "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_amount, "2")+"</strong></td>" +
    //           "</tr>"+

    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Advance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_advance_amt, "2")+"</strong></td>" +
    //               "</tr>"+
    //               "<tr>"+
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Balance Amount </td>" +
    //                   "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sales.sm_balance_amt, "2")+"</strong></td>" +
    //               "</tr>" ;
    //           }
    //           page1 = page1 +"<tr>"+
    //             "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
    //               "<table width='100%'>"+
    //                 "<tr>" +
    //                     "<td width='38%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
    //                       // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
    //                       // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
    //                       "<strong>Declaration:</strong><br>" +
    //                     "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct." +
    //                       // "Composition Taxable Person, not eligible to collect tax on supplies."+
    //                     "</td>"+

    //                     "<td width='17%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word; white-space:pre;'>" +
    //                         "<strong>Store Timing:</strong><br>" +
    //                         localStorage.getItem("com_note")+
    //                     "</td>"+
    //                     "<td width='25%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:9pt; border-style: none solid none none; border-width:1px;'>" +
    //                       "Company's Bank Details<br>"+
    //                       "Bank Name : <strong>"+localStorage.getItem("bkm_name")+"</strong><br>"+
    //                       "A/C No &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_account_no")+"</strong><br>"+
    //                       "Branch &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_branch")+"</strong><br>"+
    //                       "IFS Code &nbsp&nbsp&nbsp&nbsp: <strong>"+localStorage.getItem("bkm_ifsc")+"</strong><br>"+
    //                     "</td>" +
    //                     "<td width='30%' valign='top' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>For "+localStorage.getItem("com_name")+":</td>" +
    //                 "</tr>" +
    //                 "<tr>" +
    //                     "<td width='30%' valign='bottom' style='text-align:right; padding:4px 8px 4px 8px; font-size:9pt;'>Authorized Signatory</td>" +
    //                 "</tr>" +
    //               "</table>"+
    //             "</td>"+
    //           "</tr>"+

    //           "<tr >" +
    //               "<td colspan='3' valign='bottom' style='text-align:center; padding:4px 8px 4px 8px; font-size:9pt;border:1px solid;'>  Thank you!!! Visit us again!!! </td>" +
    //           "</tr>" +
    //         "</tfoot>"+
    //       "</table>"+
    //       "</body>" +
    //     "</html>";
    //   }
    //     popupWin.document.write(page1);
    //     popupWin.document.close();
    //   }
    // }

});