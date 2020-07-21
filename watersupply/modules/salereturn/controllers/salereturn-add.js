//angular.module('business',['ngRoute','ui.bootstrap']);
angular.module('salereturn').controller('salereturnAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $timeout, $filter, hotkeys) { 	
	
  $('.index').removeClass("active");
  $('#menucustomerindex').addClass("active");
  $('#newsalereturnindex').addClass("active");

    $scope.customerList = [];
    $scope.employeeList = [];
    $scope.productList = [];
    $scope.selectedProductList = [];
    $scope.deliverycount = [];
    $scope.sale = {};
    $scope.customer = {};
    $scope.sale.amount = 0;
    $scope.sale.cgst = 0;
    $scope.sale.sgst = 0;
    $scope.sale.igst = 0;
    $scope.sale.srm_discount = 0;
    $scope.sale.roundoff = 0;
    // $scope.sale.sm_discount = 0;
    // $scope.sale.sm_other_charges = 0;
    $scope.sale.discount = 0;
    $scope.sale.srm_amount = 0;
    $scope.parseFloat = parseFloat;
    $scope.parseInt = parseInt;
    $scope.limit ={};

    $scope.sale.srm_comment = "N/A";

    $scope.sale.srm_com_id = localStorage.getItem("com_id");
    $scope.sale.com_is_composition = localStorage.getItem("com_is_composition");

        
        const fin = localStorage.getItem("watersupply_admin_financial_year");
        const finyr = fin.split('-');
        const finyr1 = finyr[0].toString().substring(2);
        const finyr2 = finyr[1].toString().substring(2);
        $scope.limit.fin_year = "%/"+finyr1+"-"+finyr2+"%";

    $("#srm_sm_id").focus();

    hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will add a new sale return.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.saveData();
    }
  });
    
    $scope.categoryList = [];


    var d = new Date();
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth()).toString(); // getMonth() is zero-based
    var dd  = d.getDate().toString();

    var from = Date.parse((finyr[0].toString()) + '/04/01');
    var to   = Date.parse((finyr[1].toString()) + '/03/31');
    var check = Date.parse(d);

    if((check <= to && check >= from))
    {
        $scope.sale.srm_date = yyyy +"-"+ (parseInt(mm)+parseInt(1)) +"-"+ dd;
    }

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

 $("#newProductAdd").hide();

    //  $scope.checkIsTrue = function(){

    //     if($scope.sale.is_true == true)
    //     {
    //       $("#newProductAdd").show();
    //       // $scope.selectedNewProductList = [];
    //     }
    //     else{
    //      $("#newProductAdd").hide();
    //       // $scope.selectedNewProductList = [];
    //     }
    // };

    $scope.getSerialNo = function() {
        $scope.limit.com_id = localStorage.getItem("com_id");
        
        $http({
          method: 'POST',
          url: $rootScope.baseURL+'/salereturn/serial/no',
          data: $scope.limit,
          headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
        })
        .success(function(orderno)
        {

            var comname = localStorage.getItem("com_name");
            var com = comname;
            var comarr = com.split(' ');

            if(orderno.length >0){
                var pom = orderno[0].srm_invoice_no;
                var arr = pom.split('-');
                var arrinvo = arr[1].split('/');
                $scope.sale.srm_invoice_no = comarr[0].charAt(0)+comarr[1].charAt(0)+"-"+parseInt(parseInt(arrinvo[0])+parseInt(1))+"/"+finyr1+"-"+finyr2;                
            }
            else
                $scope.sale.srm_invoice_no = comarr[0].charAt(0)+comarr[1].charAt(0)+"-"+1+"/"+finyr1+"-"+finyr2;

        })
        .error(function(data) 
        {   
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong!</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');  
                $('#addCustomer').modal('hide');
                //$scope.vendor = null;
            }, 1500);
        });
    };
    $scope.getSerialNo();

    $scope.getSearchSale = function(vals) {
        var searchTerms = {search: vals, com_id: localStorage.getItem("com_id"), from: finyr[0].toString() + '/04/01', to: finyr[1].toString() + '/03/31'};
        const httpOptions = {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
          }
        };
        return $http.post($rootScope.baseURL+'/sale/typeahead/search', searchTerms, httpOptions).then((result) => {
            return result.data;
        });
    };

    $scope.getSaleDetails = function() {
        $scope.selectedProductList =[];
        $scope.selectedNewProductList =[];
        $scope.apiURL = $rootScope.baseURL+'/sale/details/'+$scope.sale.srm_sm_id.sm_id;

        if($scope.sale.srm_sm_id.sm_prod_list == 1){

        $http({
          method: 'GET',
          url: $scope.apiURL,
          //data: $scope.data,
          headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
        })
        .success(function(selectedProductList)
        {
            $scope.sale.srm_discount = $scope.sale.srm_sm_id.sm_discount;
            // $scope.selectedProductList = angular.copy(selectedProductList);
                $scope.sale.disper = $scope.sale.srm_sm_id.sm_disc_per;
            selectedProductList.forEach(function (value, key) {
                // var rate = parseFloat(value.spm_quantity) * parseFloat(value.spm_rate);
                // var cgst = ((value.spm_cgst/100) * (parseFloat(value.spm_quantity) * parseFloat(value.spm_rate)));
                // var sgst = ((value.spm_sgst/100) * (parseFloat(value.spm_quantity) * parseFloat(value.spm_rate)));
                // var igst = ((value.spm_igst/100) * (parseFloat(value.spm_quantity) * parseFloat(value.spm_rate)));
                // value.spm_rate = parseFloat(parseFloat(rate) + parseFloat(cgst) + parseFloat(sgst) + parseFloat(igst)).toFixed(2);
                $scope.selectedProductList.push(value);
                // $scope.selectedProductList = value;
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
            }, 1500);
        });
    }

        if($scope.sale.srm_sm_id.sm_prod_unsort_list == 1){

            $scope.sale.is_true = true;
            $('#newProductAdd').show();
            $http({
              method: 'GET',
              url: $rootScope.baseURL+'/sale/details/unsorted/'+$scope.sale.srm_sm_id.sm_id,
              //data: $scope.data,
              headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            })
            .success(function(selectedNewProductList)
            {
                selectedNewProductList.forEach(function (value, key) {
                    value.pm_product_name = value.spum_name;
                    value.pm_product_color_code = value.spum_color_code;
                    value.um_name = value.um_name;
                    value.pm_product_size = value.spum_size;
                    value.pm_product_hsn = value.spum_hsn;
                    value.pm_product_cgst = value.spum_cgst;
                    value.pm_product_sgst = value.spum_sgst;
                    value.pm_product_igst = value.spum_igst;
                    value.btpm_product_quantity = value.spum_quantity;
                    value.ppm_product_mrp = value.spum_rate;
                    value.netamt = value.spum_netamt;
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
        
    };

    $scope.removeItem = function(index){
        $scope.selectedProductList.splice(index,1);
        $scope.calculateTotal();
    };
    $scope.removeNewItem = function(index){
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
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.spm_quantity * value.spm_rate) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = (((parseFloat((value.spm_quantity * value.spm_rate) - ((value.spm_quantity * value.spm_rate) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.pm_cgst) + parseFloat(value.pm_sgst) + parseFloat(value.pm_igst) + 100));
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                $scope.sale.cgst = parseFloat(parseFloat($scope.sale.cgst) + parseFloat(value.netamt * (value.spm_cgst/100))).toFixed(2);
                $scope.sale.sgst = parseFloat(parseFloat($scope.sale.sgst) + parseFloat(value.netamt * (value.spm_sgst/100))).toFixed(2);
                $scope.sale.igst = parseFloat(parseFloat($scope.sale.igst) + parseFloat(value.netamt * (value.spm_igst/100))).toFixed(2);
        
            });
             angular.forEach($scope.selectedNewProductList, function(value, key) {
                    
                value.srno = i++;
                
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = (((parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) - ((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.pm_product_cgst) + parseFloat(value.pm_product_sgst) + parseFloat(value.pm_product_igst) + 100)).toFixed(2);
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                $scope.sale.cgst = parseFloat(parseFloat($scope.sale.cgst) + parseFloat(value.netamt * (value.pm_product_cgst/100))).toFixed(2);
                $scope.sale.sgst = parseFloat(parseFloat($scope.sale.sgst) + parseFloat(value.netamt * (value.pm_product_sgst/100))).toFixed(2);
                $scope.sale.igst = parseFloat(parseFloat($scope.sale.igst) + parseFloat(value.netamt * (value.pm_product_igst/100))).toFixed(2);
            
            });
        }
        else{
            angular.forEach($scope.selectedProductList, function(value, key) {

                value.srno = i++;
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.spm_quantity * value.spm_rate) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = parseFloat((value.spm_quantity * value.spm_rate) - ((value.spm_quantity * value.spm_rate) * ($scope.sale.disper/100))).toFixed(2);
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);                 
            });
            angular.forEach($scope.selectedNewProductList, function(value, key) {

                value.srno = i++;
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) - ((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2);
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
              
            });
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
     

        if($('#srm_sm_id').val() === undefined || $('#srm_sm_id').val() === "" || $scope.sale.srm_sm_id.sm_id == undefined){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select serial no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#srm_sm_id').focus();
            }, 1500);
        }
        else if($('#pDate').val() === undefined || $('#pDate').val() === ""){
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
        else if($scope.selectedProductList.length == 0 && $scope.selectedNewProductList.length == 0){
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

                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");

                $scope.sale.srm_date = $('#pDate').val();

                $scope.pruchaseForm = {
                    purchaseSingleData : $scope.sale,
                    purchaseMultipleData : $scope.selectedProductList,     
                    purchaseUnsortMultipleData : $scope.selectedNewProductList
                };
                $http({
                  method: 'POST',
                  url: $rootScope.baseURL+'/salereturn/add',
                  data: $scope.pruchaseForm,
                  headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                })
                .success(function(response)
                {
                    var dialog = bootbox.dialog({
                    message: '<p class="text-center">Sale Return Add Successfully!</p>',
                        closeButton: false
                    });
                    setTimeout(function(){
                      $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
                      $('#btnsave').removeAttr('disabled');
                      $route.reload();
                      dialog.modal('hide'); 
                      // $scope.printDetails();
                    }, 1000);
                })
                .error(function(data) 
                {   
                    var dialog = bootbox.dialog({
                    message: '<p class="text-center">Oops, Something Went Wrong! Please try again!</p>',
                        closeButton: false
                    });
                    setTimeout(function(){
                    $('#btnsave').html("SAVE <span class='label label-success'>alt+s</span>");
                    $('#btnsave').removeAttr('disabled');
                        dialog.modal('hide');  
                        $('#addCustomer').modal('hide');
                    }, 1500);
                });
            
        }
    };

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
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.sale.srm_sm_id.cm_name+"</strong><br>Number : <strong>"+$scope.sale.srm_sm_id.cm_mobile+"</strong><br>Email Id : <strong>"+$scope.sale.srm_sm_id.cm_email+"</strong><br>GST : <strong>"+$scope.sale.srm_sm_id.cm_gst_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.sale.srm_sm_id.cm_address+"</strong><br><strong>"+$scope.sale.srm_sm_id.cm_state+"</strong><br><strong>"+$scope.sale.srm_sm_id.cm_city+"</strong><br><strong>"+$scope.sale.srm_sm_id.cm_pin+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.sale.srm_sm_id.cm_del_address+"</strong><br><strong>"+$scope.sale.srm_sm_id.cm_del_state+"</strong><br><strong>"+$scope.sale.srm_sm_id.cm_del_city+"</strong><br><strong>"+$scope.sale.srm_sm_id.cm_del_pin+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Invoice No: <strong> "+$scope.sale.srm_sm_id.sm_invoice_no+"</strong></td>" +
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
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt;' text-align:center'>Disc</th>"+
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
                  "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.sale.srm_comment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.sale.amount, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>CGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.cgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>SGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sgst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>IGST</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.igst, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.roundoff, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.srm_amount, "2")+"</strong></td>" +
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
        popupWin.document.write(page1);
        popupWin.document.close();
        
    }

});

