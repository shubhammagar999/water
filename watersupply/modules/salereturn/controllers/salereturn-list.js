// import admin
angular.module('salereturn').controller('salereturnListCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {

  $('.index').removeClass("active");
  $('#menucustomerindex').addClass("active");
  $('#salereturnindex').addClass("active");
    
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
    $scope.loading1 = 0;
    $scope.parseFloat = parseFloat;

    const fin = localStorage.getItem("watersupply_admin_financial_year");
    $scope.com_file = localStorage.getItem("com_file");

$scope.apiURL = $rootScope.baseURL+'/salereturn/salereturn/total';

   $scope.getAll = function () {
        
      if ($('#searchtext').val() == undefined || $('#searchtext').val() == "") {
        $scope.limit.search = "";
        $scope.limit.com_id = localStorage.getItem("com_id");
      }
      else{
        $scope.limit.search = $scope.searchtext;
        $scope.limit.com_id = localStorage.getItem("com_id");
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
                url: $rootScope.baseURL+'/salereturn/salereturn/limit',
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
      $scope.sm_id=sm_id;
    }  

    $rootScope.deleteConfirm = function () {
                $('#del').attr('disabled','true');
                $('#del').text("please wait...");
	     $http({
	      method: 'POST',
	      url: $rootScope.baseURL+'/salereturn/delete/'+$scope.sm_id.srm_id,
        data: $scope.sm_id,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(saleObj)
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

  $scope.viewSaleDetails = function (index) {
    $scope.saleProductList = [];
    $scope.saleNewProductList = [];

$scope.sales = $scope.filteredTodos[index];
      $scope.serial = $scope.filteredTodos[index].sm_invoice_no;
      $scope.rserial = $scope.filteredTodos[index].srm_invoice_no;
      $scope.smdate = $filter('date')($scope.filteredTodos[index].srm_date, "dd-MM-yyyy");
      $scope.custname = $scope.filteredTodos[index].cm_name;
      $scope.custaddress = $scope.filteredTodos[index].cm_address;
      $scope.custaddressprint = $scope.filteredTodos[index].cm_address +"<br>"+$scope.filteredTodos[index].cm_state +"<br>"+$scope.filteredTodos[index].cm_city +"<br>"+$scope.filteredTodos[index].cm_pin;
      $scope.custdeladdressprint = $scope.filteredTodos[index].cm_del_address +"<br>"+$scope.filteredTodos[index].cm_del_state +"<br>"+$scope.filteredTodos[index].cm_del_city +"<br>"+$scope.filteredTodos[index].cm_del_pin;
      $scope.custmobile = $scope.filteredTodos[index].cm_mobile;
      $scope.custemail = $scope.filteredTodos[index].cm_email;
      $scope.custgstno = $scope.filteredTodos[index].cm_gst_no;
      $scope.totalamount = $scope.filteredTodos[index].srm_amount;
      $scope.empname = $scope.filteredTodos[index].emp_name;
      $scope.smcomment = $scope.filteredTodos[index].srm_comment;
      $scope.smcarname = $scope.filteredTodos[index].sm_car_name;
      $scope.smcarmodel = $scope.filteredTodos[index].sm_car_model;
      $scope.sm_other_charges = $scope.filteredTodos[index].sm_other_charges;
      $scope.sm_discount = $scope.filteredTodos[index].sm_discount;
      $scope.cgst = $scope.filteredTodos[index].srm_cgst;
      $scope.sgst = $scope.filteredTodos[index].srm_sgst;
      $scope.igst = $scope.filteredTodos[index].srm_igst;
      $scope.smstatus = $scope.filteredTodos[index].srm_status;
      $scope.srmdiscount = $scope.filteredTodos[index].srm_discount;
      $scope.amount = $scope.filteredTodos[index].srm_net_amount;
      $scope.com_is_composition = $scope.filteredTodos[index].com_is_composition;
      $scope.tota = parseFloat($scope.amount) + parseFloat($scope.filteredTodos[index].srm_cgst) + parseFloat($scope.filteredTodos[index].srm_sgst) + parseFloat($scope.filteredTodos[index].srm_igst);
      $scope.roundoff = parseFloat($scope.filteredTodos[index].srm_amount) - parseFloat($scope.tota);
      $scope.convertNumberToWords($scope.totalamount);
var i = 1;
      if($scope.sales.sm_prod_list == 1){
      $http({
        method: 'GET',
        url: $rootScope.baseURL+'/salereturn/details/'+$scope.filteredTodos[index].srm_id,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(saleProductList)
      {
        // $scope.saleProductList = angular.copy(saleProductList);

         
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

      }

      if($scope.sales.sm_prod_unsort_list == 1){
      $http({
        method: 'GET',
        url: $rootScope.baseURL+'/salereturn/details/unsorted/'+$scope.filteredTodos[index].srm_id,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(saleNewProductList)
      {
        // $scope.saleNewProductList = angular.copy(saleNewProductList);

         // var i = 1;
          saleNewProductList.forEach(function (value, key) {
              value.srno = i++;
              $scope.saleNewProductList.push(value);
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

      if($scope.smstatus == 1){
        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
        if($scope.com_is_composition == 0) 
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
          "<center style='font-size:11pt;'>SALE RETURN</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='3' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.custname+"</strong><br>Number : <strong>"+$scope.custmobile+"</strong><br>Email Id : <strong>"+$scope.custemail+"</strong><br>GST : <strong>"+$scope.custgstno+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.custaddressprint+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.custdeladdressprint+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Invoice No: <strong> "+$scope.serial+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Return Invoice No. : <strong>"+$scope.rserial+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.smdate, "dd-MM-yyyy")+"</strong></td>" +
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
                  "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.smcomment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
              "</tr>"+
               "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.srmdiscount, "2")+"</strong></td>" +
                  "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>CGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.cgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>SGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>IGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.igst, "2")+"</strong></td>" +
              "</tr>"+
               "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.totalamount, "2")+"</strong></td>" +
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
      else{

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
          "<center style='font-size:11pt;'>SALE RETURN</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='3' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.custname+"</strong><br>Number : <strong>"+$scope.custmobile+"</strong><br>Email Id : <strong>"+$scope.custemail+"</strong><br>GST : <strong>"+$scope.custgstno+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.custaddressprint+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.custdeladdressprint+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Invoice No: <strong> "+$scope.serial+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Return Invoice No. : <strong>"+$scope.rserial+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.smdate, "dd-MM-yyyy")+"</strong></td>" +
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
                  "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.smcomment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
              "</tr>"+
               "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.srmdiscount, "2")+"</strong></td>" +
                  "</tr>"+
               "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.totalamount, "2")+"</strong></td>" +
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
        popupWin.document.write(page1);
        popupWin.document.close();
      }
      else{
        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
        if($scope.com_is_composition == 0) 
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
          "<center style='font-size:11pt;'>SALE RETURN</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='3' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.custname+"</strong><br>Number : <strong>"+$scope.custmobile+"</strong><br>Email Id : <strong>"+$scope.custemail+"</strong><br>GST : <strong>"+$scope.custgstno+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.custaddressprint+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.custdeladdressprint+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Invoice No: <strong> "+$scope.serial+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Return Invoice No. : <strong>"+$scope.rserial+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.smdate, "dd-MM-yyyy")+"</strong></td>" +
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
                  "<td rowspan='5' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.smcomment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
              "</tr>"+
               "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.srmdiscount, "2")+"</strong></td>" +
                  "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>CGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.cgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>SGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>IGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.igst, "2")+"</strong></td>" +
              "</tr>"+
               "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.totalamount, "2")+"</strong></td>" +
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
      else{

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
          "<center style='font-size:11pt;'>SALE RETURN</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='3' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.custname+"</strong><br>Number : <strong>"+$scope.custmobile+"</strong><br>Email Id : <strong>"+$scope.custemail+"</strong><br>GST : <strong>"+$scope.custgstno+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.custaddressprint+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.custdeladdressprint+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Invoice No: <strong> "+$scope.serial+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Return Invoice No. : <strong>"+$scope.rserial+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.smdate, "dd-MM-yyyy")+"</strong></td>" +
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
                  "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.smcomment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.amount, "2")+"</strong></td>" +
              "</tr>"+
               "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.srmdiscount, "2")+"</strong></td>" +
                  "</tr>"+
               "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.totalamount, "2")+"</strong></td>" +
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
        popupWin.document.write(page1);
        popupWin.document.close();
      }
    }

});