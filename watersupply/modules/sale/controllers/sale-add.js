//angular.module('business',['ngRoute','ui.bootstrap']);
angular.module('sale').controller('saleAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $timeout, $filter, hotkeys) { 	

  $('.index').removeClass("active");
  $('#menusaleintex').addClass("active");
  $('#newsaleindex').addClass("active");
    
    $('#hidetablegst').hide();
    $('#eway').hide();
    $("#deldateshow").hide();

    // $scope.customerList = [];
    // $scope.employeeList = [];
    // $scope.productList = [];
    // $scope.selectedProductList = [];
    // $scope.selectedNewProductList = [];
    $scope.productDetails = [];
    $scope.deliverycount = [];
    $scope.sale = {};
    $scope.customer = {};
    $scope.employee = {};

    $scope.sale.amount = 0;
    $scope.sale.discount = 0;
    $scope.sale.cgst = 0;
    $scope.sale.sgst = 0;
    $scope.sale.igst = 0;
    $scope.sale.sm_discount = 0;
    $scope.sale.sm_other_charges = 0;
    $scope.sale.roundoff = 0;
    $scope.sale.is_eway = 0;
    $scope.parseFloat = parseFloat;
    $scope.parseInt = parseInt;
    $scope.sale.disper = 0;
    $scope.sale.advance_amt =0;
    $scope.limit = {};

    $scope.sale.sm_buyer_no = "N/A";
    $scope.sale.sm_comment = "N/A";
    $scope.sale.sm_payment_mode = "cash";

    $scope.sale.com_is_composition = localStorage.getItem("com_is_composition");
    $scope.sale.sm_com_id = 9;

    $scope.sale.sm_qty_filled = 0;
    $scope.sale.sm_qty_empty = 0;
    $scope.sale.sm_amount = 0;
    // $scope.sale.sm_product_price = 0;

    $scope.sale.sm_prod_name = 'Bottle';

    const fin = localStorage.getItem("watersupply_admin_financial_year");

        const finyr = fin.split('-');
        const finyr1 = finyr[0].toString().substring(2);
        const finyr2 = finyr[1].toString().substring(2);
        $scope.limit.fin_year = "%/"+finyr1+"-"+finyr2+"%";

    $("#sm_cm_id").focus();
    $("#newProductAdd").hide();

  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will add a new sale.',
    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
    callback: function() {
      $scope.saveData();
    }
  });

  
    $scope.getPermission = function(){
       if ($scope.user_type == 'emp') 
        {
            window.location.href = '#/404/'; 
        }
    };
    $scope.getPermission();

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
        $scope.sale.sm_date = yyyy +"-"+ (parseInt(mm)+parseInt(1)) +"-"+ dd;
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
            $scope.sale.sm_date = $('#pDate').val();
        }
    });

      $('#user-datepicker-from').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        // maxDate: '0',
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
        // maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        maxDate: '0', //limit of current date

    });

    //keypree change in vender
    $( "#sm_cm_id" ).keypress(function() {
        $scope.productDetails = [];
        $scope.sale.sm_qty_filled = 0;
        $scope.sale.sm_qty_empty = 0;
        $scope.sale.sm_amount = 0;
    }); //keypree change in vender
    // $( "#user-datepicker-from" ).keypress(function() {
    //     $scope.productDetails = [];
    // }); //keypree change in vender
    // $( "#user-datepicker-to" ).keypress(function() {
    //     $scope.productDetails = [];
    // });


    $('#paymentdate').hide();
    $('#advance').hide();
    $('#balance').hide();
    $scope.creditShow = function(){
        if($scope.sale.sm_payment_mode == 'cash' && $scope.sale.sm_del_check == true || $scope.sale.sm_payment_mode == 'card' && $scope.sale.sm_del_check == true){
            $('#paymentdate').hide();
            $('#advance').show();
            $('#balance').show();
            $scope.sale.sm_payment_date = null;
            $scope.sale.sm_advance_amt = null;
            $scope.sale.sm_balance_amt = null;
        }
        else{
            $('#paymentdate').show();
            $('#advance').hide();
            $('#balance').hide();
            $scope.sale.sm_payment_date = undefined;
            $scope.sale.sm_advance_amt = 0;
            $scope.sale.sm_balance_amt = 0;
        }
    }


    $scope.getSerialNo = function() {
        $scope.limit.com_id = localStorage.getItem("com_id");
        
        $http({
          method: 'POST',
          url: $rootScope.baseURL+'/sale/serial/no',
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
                var pom = orderno[0].sm_invoice_no;
                var arr = pom.split('-');
                var arrinvo = arr[1].split('/');
                $scope.sale.sm_invoice_no = comarr[0].charAt(0)+comarr[1].charAt(0)+"-"+parseInt(parseInt(arrinvo[0])+parseInt(1))+"/"+finyr1+"-"+finyr2;                
            }
            else
                $scope.sale.sm_invoice_no = comarr[0].charAt(0)+comarr[1].charAt(0)+"-"+1+"/"+finyr1+"-"+finyr2;
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
    };
    $scope.getSerialNo();

    $scope.getSearchCust = function(vals) {

      var searchTerms = {search: vals, com_id: localStorage.getItem("com_id")};
      

        const httpOptions = {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
          }
        };
        return $http.post($rootScope.baseURL+'/customer/typeahead/search', searchTerms, httpOptions).then((result) => {
          
          return result.data;
      });
    };

    $scope.getDetails = function(cust) {
      $scope.sale.sm_product_price = cust.cm_prod_price_set;
      $scope.last_bill = '';
      $scope.saleprevious = [];
      $http({
              method: 'POST',
              url: $rootScope.baseURL+'/sale/checkPending/'+cust.cm_id,
              headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            })
            .success(function(data)
            { 
              if(data[0].sm_bill_status == 'pending'){
                   $scope.sale.sm_cm_id = undefined;
                    var dialog = bootbox.dialog({
                      message: '<p class="text-center">Please clear the pending bill</p>',
                          closeButton: false
                      });
                      dialog.find('.modal-body').addClass("btn-danger");
                      setTimeout(function(){
                        dialog.modal('hide'); 
                        $scope.last_bill = '';
                        $scope.sale.sm_product_price = null;
                      }, 2500);
                }

                data.forEach(function (value, key) {
                      $scope.saleprevious.push(value);
                });
                  $scope.last_bill = data[0].sm_to_date;

            })
            .error(function(data) 
            {   
              var dialog = bootbox.dialog({
                message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                    closeButton: false
                });
                setTimeout(function(){
                $('#btnsave').html("SAVE & PRINT <span class='label label-success'>alt+s</span>");
                $('#btnsave').removeAttr('disabled');
                    dialog.modal('hide'); 
                }, 1500);            
            });

    };

  $scope.getReport = function () {
    $scope.toDate = $("#user-datepicker-to").val();
    $scope.fromDate = $("#user-datepicker-from").val();
    if($('#sm_cm_id').val() == undefined || $('#sm_cm_id').val() == "" || $scope.sale.sm_cm_id.cm_id == undefined){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please select vendor name</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#sm_cm_id").focus();
            }, 1500);
      }
    else {
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

            $scope.limit.from_date = $("#user-datepicker-from").val();
            $scope.limit.to_date = $("#user-datepicker-to").val();
            $scope.limit.customer_id = $scope.sale.sm_cm_id.cm_id;
          $('#report_user_btn').attr('disabled','true');
          $('#report_user_btn').text("please wait...");
          $scope.getAll();
          $scope.calculateTotal();
          $('#sm_produc_pricet').focus();
      }

    };

    $scope.getAll = function(){
      $scope.productDetails = [];
      $scope.sale.sm_from_date = $("#user-datepicker-from").val();
      $scope.sale.sm_to_date = $("#user-datepicker-to").val();
        
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
                  if (sale.length == 0){
                       var dialog = bootbox.dialog({
                        message: '<p class="text-center">No data found.</p>',
                            closeButton: false
                        });
                        dialog.find('.modal-body').addClass("btn-danger");
                        setTimeout(function(){
                            dialog.modal('hide'); 
                        }, 1500);
                  }
                  else{
                      $scope.productDetails = [];
                      sale.forEach(function (value, key) {
                            $scope.productDetails.push(value);
                        });
                  }
                  $scope.calculate();
                  $('#report_user_btn').removeAttr('disabled');;
                  $('#report_user_btn').text("Get Report");
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
    

    
    $scope.calculate = function(){
        var i = 1;
        $scope.sale.sm_qty_filled = 0;
        $scope.sale.sm_qty_empty = 0;

        angular.forEach($scope.productDetails, function(value, key) {
                
            value.srno = i++;
            
            $scope.sale.sm_qty_filled = $scope.sale.sm_qty_filled + value.pm_qty_filled;
            $scope.sale.sm_qty_empty = $scope.sale.sm_qty_empty + value.pm_qty_empty;
        });

    };
    $scope.calculateTotal = function(){
        $scope.sale.sm_amount = 0;
        $scope.sale.sm_net_amount = 0;
        $scope.sale.sm_net_amount = $scope.sale.sm_qty_filled * $scope.sale.sm_product_price;
        $scope.sale.sm_amount = $scope.sale.sm_net_amount + $scope.sale.sm_cm_id.cm_balance;

        // $scope.sale.sm_amount = $scope.sale.sm_qty_filled * $scope.sale.sm_product_price + $scope.sale.sm_cm_id.cm_balance;
        $scope.convertNumberToWords($scope.sale.sm_amount);
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

    // $scope.sendSMS = function(){

    //     $scope.data = {
    //         recipient : $scope.sale.sm_cm_id.cm_mobile,
    //         message : 'Hi '+$scope.sale.sm_cm_id.cm_name+', Thank you for shopping with City Motors. Your serial no : '+$scope.sale.sm_invoice_no+'. Please visit again. For Any query please contact : 9011901109.'
    //     }
    //     $http({
    //       method: 'POST',
    //       url: $rootScope.baseURL+'/sms/',
    //       data: $scope.data,
    //       headers: {'Content-Type': 'application/json',
    //               'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
    //     })
    //     .success(function(respose)
    //     {
    //         console.log('Message Send successfully');
    //     })
    //     .error(function(data) 
    //     {   
    //         console.log('Oops, Something Went Wrong!');
    //     });
    // }

    // $scope.sendEmail = function(){
    
    //     var message = 
    //     $scope.data = {
    //         recipient : $scope.sale.sm_cm_id.cm_email,
    //         message : message
    //     }
    //     $http({
    //       method: 'POST',
    //       url: $rootScope.baseURL+'/emailsent/',
    //       data: $scope.data,
    //       headers: {'Content-Type': 'application/json',
    //               'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
    //     })
    //     .success(function(respose)
    //     {
    //         console.log('E-Mail Send successfully');
    //     })
    //     .error(function(data) 
    //     {   
    //         console.log('Oops, Something Went Wrong!');
    //     });
    // }

    $scope.saveData = function(){

      $scope.calculateTotal();
        var nameRegex = /^\d+$/;
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var numRegex = /^\d+(\.\d{1,2})?$/;
        
        if($('#sm_cm_id').val() == undefined || $('#sm_cm_id').val() == "" || $scope.sale.sm_cm_id.cm_id == undefined){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select vendor.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_cm_id').focus();
            }, 1500);
        }
        else if($('#user-datepicker-from').val() == undefined || $('#user-datepicker-from').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select from date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#user-datepicker-from').focus();
            }, 1500);
        }
        else if($('#user-datepicker-to').val() == undefined || $('#user-datepicker-to').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select to date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#user-datepicker-to').focus();
            }, 1500);
        }
        else if($('#sm_prod_name').val() == undefined || $('#sm_prod_name').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter product name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_prod_name').focus();
            }, 1500);
        }
        else if($('#sm_product_price').val() == undefined || $('#sm_product_price').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select product price.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_product_price').focus();
            }, 1500);
        }
        else if($scope.productDetails.length == 0 ){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please add atleast 1 Product.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#pm_id').focus();
            }, 1500);
        }
       
        else{ 
            $scope.sale.sm_to_date = $("#user-datepicker-to").val();
            $scope.sale.sm_from_date = $("#user-datepicker-from").val();
            $scope.sale.sm_date = d;

              $('#btnsave').attr('disabled','true');
              $('#btnsave').text("please wait...");
              

                $http({
                  method: 'POST',
                  url: $rootScope.baseURL+'/sale/add',
                  data: $scope.sale,
                  headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                })
                .success(function(response)
                {
                    var dialog = bootbox.dialog({
                            message: '<p class="text-center">Sale Add Successfully!</p>',
                                closeButton: false
                            });
                            setTimeout(function(){
                              $('#btnsave').html("SAVE & PRINT <span class='label label-success'>alt+s</span>");
                              $('#btnsave').removeAttr('disabled');
                              $route.reload();
                              dialog.modal('hide'); 
                              $scope.printDetails();
                            }, 1000);
                })
                .error(function(data) 
                {   
                    var dialog = bootbox.dialog({
                    message: '<p class="text-center">Oops, Something Went Wrong! Please try again!</p>',
                        closeButton: false
                    });
                    setTimeout(function(){
                    $('#btnsave').html("SAVE & PRINT <span class='label label-success'>alt+s</span>");
                    $('#btnsave').removeAttr('disabled');
                        dialog.modal('hide');  
                        $('#addCustomer').modal('hide');
                    }, 1500);
                });
        }
    };

    $scope.printDetails = function(){
      $scope.calculateTotal();
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
                            "Name : <strong>"+$scope.sale.sm_cm_id.cm_name+"</strong><br>"+
                            "Number : <strong>"+$scope.sale.sm_cm_id.cm_mobile+"</strong><br>";

                            if ($scope.sale.sm_cm_id.cm_email != 'N/A') {
                              page1 = page1 + "Email Id : <strong>"+$scope.sale.sm_cm_id.cm_email+"</strong><br>";
                            }
                            if ($scope.sale.sm_cm_id.cm_gst_no != 'N/A') {
                              page1 = page1 + "GST : <strong>"+$scope.sale.sm_cm_id.cm_gst_no+"</strong><br>";
                            }
                            if ($scope.sale.sm_cm_id.cm_address != 'N/A') {
                              page1 = page1 + "Address : <strong>"+$scope.sale.sm_cm_id.cm_address+"</strong><br>";
                            }
                            
                        page1 = page1 + "</td>" +
                      "<td width='40%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>"+
                          "Date: <strong>"+$filter('date')(d,'dd-MM-yyyy')+"</strong><br>"+
                          "Serial No: <strong>"+$scope.sale.sm_invoice_no+"</strong><br>"+
                          "Billing Date: <strong>"+$filter('date')($scope.sale.sm_from_date,'dd-MM-yyyy')+" - "+$filter('date')($scope.sale.sm_to_date,'dd-MM-yyyy')+"</strong><br>"+
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
                                "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid solid none none; border-width:1px;'>Product Name: <strong>"+$scope.sale.sm_prod_name+"</strong> </td>" +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid none none none; border-width:1px;'>Rate: <strong>"+$filter('number')($scope.sale.sm_product_price, "2")+"</strong></td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid none none solid; border-width:1px;'>Total Quantity: <strong>"+$scope.sale.sm_qty_filled+"</strong></td> " +
                                // "<td width='40%'>&nbsp;</td>" +

                              "</tr>"+ 
                            "</thead>"+
                          "</table>"+
                        "</td>"+
                      "</tr>";
                if ($scope.sale.sm_cm_id.cm_balance != 0) {
                    page1 = page1 + "<tr>" +
                        "<td colspan='4' valign='top' style=' border-style: solid; border-width:1px;'>"+
                          "<table width='100%'>" +
                            "<thead>"+      
                              "<tr>"+
                                "<td width='60%' colspan='2' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none solid none none; border-width:1px;'>Pending Bill Details</td>" +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none solid none solid; border-width:1px;text-align:right;'>Net Amount</td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;text-align:right;'><strong>"+$filter('number')($scope.sale.sm_net_amount, "2")+"</strong></td>" +

                              "</tr>"+     
                              "<tr>"+
                                "<td width='30%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none none none none; border-width:1px;'>Bill No: <strong>"+$scope.saleprevious[0].sm_invoice_no+" </strong></td>" +
                                "<td width='30%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: none none none none; border-width:1px;'>Bill Date: <strong>"+$filter('date')($scope.saleprevious[0].sm_from_date,'dd-MM-yyyy')+" - "+$filter('date')($scope.saleprevious[0].sm_to_date,'dd-MM-yyyy')+"</strong></td>" +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;border-style: solid solid none solid; border-width:1px;text-align:right;'>Pending Balance</td> " +
                                "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid none none none; border-width:1px;text-align:right;'><strong>"+$filter('number')($scope.sale.sm_cm_id.cm_balance, "2")+"</strong></td>" +

                              "</tr>"+ 
                            "</thead>"+
                          "</table>"+
                        "</td>"+
                      "</tr>";
                  }
                 page1 = page1 + "<tr>" +
                  "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid solid; border-width:1px;text-align:right;'>Total Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;text-align:right;'><strong>"+$filter('number')($scope.sale.sm_amount, "2")+"</strong></td>" +
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

