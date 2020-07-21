//angular.module('business',['ngRoute','ui.bootstrap']);
angular.module('salereturn').controller('salereturnEditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $timeout, $filter, hotkeys) {     
   
  $('.index').removeClass("active");
  $('#menucustomerindex').addClass("active");
  $('#salereturnindex').addClass("active");
    
    $scope.productList = [];
    $scope.selectedProductList = [];
    $scope.selectedProductListRemove = [];
    $scope.selectedNewProductListRemove = [];
    $scope.selectedProductListAdd = [];
    $scope.deliverycount = [];
    $scope.sale = {};
    $scope.sale.amount = 0;
    $scope.sale.cgst = 0;
    $scope.sale.sgst = 0;
    $scope.sale.igst = 0;
    $scope.sale.roundoff = 0;
    $scope.sale.srm_amount = 0;
    $scope.parseFloat = parseFloat;
    $scope.parseInt = parseInt;

    $scope.srmId = $routeParams.salereturnId;

    const fin = localStorage.getItem("watersupply_admin_financial_year");
    const finyr = fin.split('-');
        
    $("#newProductAdd").hide();

  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will update sale return details.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.saveData();
    }
  });
    $scope.categoryList = [];

    $('#pDate').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.sale.srm_date = $('#pDate').val();
        }
    });

    $scope.getSerialNo = function() {
        
        $http({
          method: 'GET',
          url: $rootScope.baseURL+'/salereturn/'+$scope.srmId,
          //data: $scope.data,
          headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
        })
        .success(function(sale)
        {
            // $scope.sale  = angular.copy(sale);
            
            sale.forEach(function(value, key) {
                value.srm_date = $filter('date')(value.srm_date, "yyyy-MM-dd");
                value.old_srm_amount = value.srm_amount;


                value.disper = value.srm_disc_per;
                
                if(value.sm_prod_unsort_list == 1){
                    $('#is_true').prop("checked",true);

                    $('#newProductAdd').show();
                    value.sm_prod_unsort_list = 1;
                    // $("#is_true").value('true');
                }
                else if(value.sm_prod_unsort_list = 0){
                    // value.sm_prod_unsort_list = 0;
                    $('#is_true').prop("checked",false);
                    $('#newProductAdd').hide();
                }

                $scope.sale = value;
                if(value.sm_prod_list == 1){
                    $http({
                      method: 'GET',
                      url: $rootScope.baseURL+'/salereturn/details/'+$scope.srmId,
                      //data: $scope.data,
                      headers: {'Content-Type': 'application/json',
                              'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                    })
                    .success(function(selectedProductList)
                    {
                        $scope.selectedProductList = [];
                        selectedProductList.forEach(function (value, key) {
                            value.old_srpm_quantity = value.srpm_quantity;
                            $scope.selectedProductList.push(value);
                        });
                        $scope.calculateTotal();
                    })
                    .error(function(data) 
                    {   
                        var dialog = bootbox.dialog({
                        message: '<p class="text-center">Oops, Something Went Wrong!</p>',
                            closeButton: false
                        });
                        setTimeout(function(){
                            dialog.modal('hide');  
                            //$scope.vendor = null;
                        }, 1500);
                    });
                }
                if(value.sm_prod_unsort_list == 1){
                        $scope.sale.is_true = true;
                        $('#newProductAdd').show();
                    $http({
                      method: 'GET',
                      url: $rootScope.baseURL+'/salereturn/details/unsorted/'+$scope.srmId,
                      //data: $scope.data,
                      headers: {'Content-Type': 'application/json',
                              'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                    })
                    .success(function(selectedNewProductList)
                    {
                        $scope.selectedNewProductList = [];
                        selectedNewProductList.forEach(function (value, key) {
                            value.btpm_product_quantity = value.srpum_quantity;
                            $scope.selectedNewProductList.push(value);
                        });
                        $scope.calculateTotal();
                    })
                    .error(function(data) 
                    {   
                        var dialog = bootbox.dialog({
                        message: '<p class="text-center">Oops, Something Went Wrong!</p>',
                            closeButton: false
                        });
                        setTimeout(function(){
                            dialog.modal('hide');  
                            //$scope.vendor = null;
                        }, 1500);
                    });
                }
                else
                {
                     $scope.sale.is_true = false;
                    $('#newProductAdd').hide();
                }
            });
        })
        .error(function(data) 
        {   
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong!</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');  
            }, 1500);
        });
    };
    $scope.getSerialNo();

    $scope.removeItem = function(index){
        $scope.selectedProductListRemove.push($scope.selectedProductList[index]);
        $scope.selectedProductList.splice(index,1);
        $scope.calculateTotal();
    };
    $scope.removeNewItem = function(index){
        $scope.selectedNewProductListRemove.push($scope.selectedNewProductList[index]);
        $scope.selectedNewProductList.splice(index,1);
        $scope.calculateTotal();
    };

    $scope.calculateTotal = function(){
        var i = 1;
        $scope.sale.amount = 0;
        $scope.sale.cgst = 0;
        $scope.sale.sgst = 0;
        $scope.sale.igst = 0;
        $scope.sale.roundoff = 0;
        $scope.sale.discount = 0;

        if($scope.sale.com_is_composition == 0)
        {
            angular.forEach($scope.selectedProductList, function(value, key) {
                

                value.srno = i++;
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.srpm_quantity * value.srpm_rate) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = (((parseFloat((value.srpm_quantity * value.srpm_rate) - ((value.srpm_quantity * value.srpm_rate) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.pm_cgst) + parseFloat(value.pm_sgst) + parseFloat(value.pm_igst) + 100));
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                $scope.sale.cgst = parseFloat(parseFloat($scope.sale.cgst) + parseFloat(value.netamt * (value.srpm_cgst/100))).toFixed(2);
                $scope.sale.sgst = parseFloat(parseFloat($scope.sale.sgst) + parseFloat(value.netamt * (value.srpm_sgst/100))).toFixed(2);
                $scope.sale.igst = parseFloat(parseFloat($scope.sale.igst) + parseFloat(value.netamt * (value.srpm_igst/100))).toFixed(2);

            });
            angular.forEach($scope.selectedNewProductList, function(value, key) {
                    
                value.srno = i++;
                
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_product_quantity * value.srpum_rate) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = (((parseFloat((value.btpm_product_quantity * value.srpum_rate) - ((value.btpm_product_quantity * value.srpum_rate) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.srpum_cgst) + parseFloat(value.srpum_sgst) + parseFloat(value.srpum_igst) + 100)).toFixed(2);
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                $scope.sale.cgst = parseFloat(parseFloat($scope.sale.cgst) + parseFloat(value.netamt * (value.srpum_cgst/100))).toFixed(2);
                $scope.sale.sgst = parseFloat(parseFloat($scope.sale.sgst) + parseFloat(value.netamt * (value.srpum_sgst/100))).toFixed(2);
                $scope.sale.igst = parseFloat(parseFloat($scope.sale.igst) + parseFloat(value.netamt * (value.srpum_igst/100))).toFixed(2);
            
            });// =====for new product add calculation
            
        }
        else
        {
            angular.forEach($scope.selectedProductList, function(value, key) {
                value.srno = i++;
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.srpm_quantity * value.srpm_rate) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = parseFloat((value.srpm_quantity * value.srpm_rate) - ((value.srpm_quantity * value.srpm_rate) * ($scope.sale.disper/100))).toFixed(2);
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
            });
            angular.forEach($scope.selectedNewProductList, function(value, key) {
                value.srno = i++;
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_product_quantity * value.srpum_rate) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = parseFloat((value.btpm_product_quantity * value.srpum_rate) - ((value.btpm_product_quantity * value.srpum_rate) * ($scope.sale.disper/100))).toFixed(2);
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
              
            });
            // =====for new product add calculation
        }

        $scope.sale.srm_amount = Math.round(parseFloat($scope.sale.amount) + parseFloat($scope.sale.cgst) + parseFloat($scope.sale.sgst) + parseFloat($scope.sale.igst));
        $scope.sale.roundoff = $scope.sale.srm_amount - (parseFloat($scope.sale.amount) + parseFloat($scope.sale.cgst) + parseFloat($scope.sale.sgst) + parseFloat($scope.sale.igst));
        $scope.convertNumberToWords($scope.sale.srm_amount);

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

    $scope.saveData = function(){

        var nameRegex = /^\d+$/;
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var numRegex = /^\d+(\.\d{1,2})?$/;
     

        if($('#pDate').val() === undefined || $('#pDate').val() === ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#pDate').focus(); 
            }, 1500);
        }
        else if($scope.selectedProductList.length == 0){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please add product to list.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#pm_id').focus(); 
            }, 1500);
        }
        else if($('#comment').val() == undefined || $('#comment').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter comment or N/A.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#comment').focus();
            }, 1500);
        }
        else{
            if($scope.selectedProductList.length > 0){
                 $scope.sale.sm_prod_list = 1;   
            }
            else{
                $scope.sale.sm_prod_list = 0;   
            }
            if($scope.selectedNewProductList.length > 0){
                 $scope.sale.sm_prod_unsort_list = 1;                     
            }
            else{
                $scope.sale.sm_prod_unsort_list = 0; 
            }
                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");

            $scope.sale.srm_date = $('#pDate').val();

            $scope.pruchaseForm = {
                purchaseSingleData : $scope.sale,
                purchaseMultipleData : $scope.selectedProductList,
                purchaseadd : $scope.selectedProductListAdd,
                purchaseremove : $scope.selectedProductListRemove,
                newpurchaseremove : $scope.selectedNewProductListRemove
            };
            $http({
              method: 'POST',
              url: $rootScope.baseURL+'/salereturn/edit/'+$scope.srmId,
              data: $scope.pruchaseForm,
              headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            })
            .success(function(response)
            {
                $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                $('#btnsave').removeAttr('disabled');
                // $scope.printDetails();
                window.location.href = '#/salereturn'; 
            })
            .error(function(data) 
            {   
                var dialog = bootbox.dialog({
                message: '<p class="text-center">Oops, Something Went Wrong! Please try again!</p>',
                    closeButton: false
                });
                setTimeout(function(){
                $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                $('#btnsave').removeAttr('disabled');
                    dialog.modal('hide');  
                    $('#addCustomer').modal('hide');
                }, 1500);
            });
        }
    };

    $scope.printDetails = function(){

      var name = $scope.sale.bm_name;

      var vari = name.substring(0, 3);


        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
          
        popupWin.document.write("<html>" +
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
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.sale.cm_name+"</strong><br>Number : <strong>"+$scope.sale.cm_mobile+"</strong><br>Email Id : <strong>"+$scope.sale.cm_email+"</strong><br>GST : <strong>"+$scope.sale.cm_gst_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.sale.cm_address+"</strong><br><strong>"+$scope.sale.cm_state+"</strong><br><strong>"+$scope.sale.cm_city+"</strong><br><strong>"+$scope.sale.cm_pin+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.sale.cm_del_address+"</strong><br><strong>"+$scope.sale.cm_del_state+"</strong><br><strong>"+$scope.sale.cm_del_city+"</strong><br><strong>"+$scope.sale.cm_del_pin+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Invoice No: <strong> "+vari+"-"+$scope.sale.sm_invoice_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Return Invoice No. : <strong>"+$scope.sale.srm_invoice_no+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.sale.srm_date, "dd-MM-yyyy")+"</strong></td>" +
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
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Disc</th>"+
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
                  "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.sale.srm_comment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.sale.amount, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>CGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.cgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>SGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>IGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.igst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.roundoff, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt;'>Total Amount </td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.srm_amount, "2")+"</strong></td>" +
              "</tr>" +
              // "<tr>"+
              //     "<td width='60%' style='padding:4px; font-size:7pt; border-style: none solid none solid; border-width:1px;'>Comment <strong>"+$scope.sale.srm_comment+"</strong></td>" +
              //     "<td width='20%' style='padding:4px; font-size:7pt; border-style: none none solid none; border-width:1px;'>Net Amount </td>" +
              //     "<td width='20%' style='padding:4px; font-size:7pt; border-style: none solid solid solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.amount, "2")+"</strong></td>" +
              // "</tr>" +
              // "<tr>"+
              //     "<td width='60%' rowspan='2' style='padding:4px; font-size:7pt; border-style: solid solid none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+"</strong></td>" +
              //     "<td width='20%' style='padding:4px; font-size:7pt; border-style: none none solid none; border-width:1px;'>Discount Amount </td>" +
              //     "<td width='20%' style='padding:4px; font-size:7pt; border-style: none solid solid solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.srm_discount, "2")+"</strong></td>" +
              // "</tr>" +
              // "<tr>"+
              //     "<td width='20%' style='padding:4px; font-size:7pt;'>Total Amount </td>" +
              //     "<td width='20%' style='padding:4px; font-size:7pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.srm_amount, "2")+"</strong></td>" +
              // "</tr>" +
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
        "</html>");
        popupWin.document.close();

    }

});

