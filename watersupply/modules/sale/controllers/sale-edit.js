//angular.module('business',['ngRoute','ui.bootstrap']);
angular.module('sale').controller('saleEditCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $timeout, $filter, hotkeys) {     


  $('.index').removeClass("active");
  $('#menucustomerindex').addClass("active");
  $('#newsaleindex').addClass("active"); 
    
    $('#hidetablegst').hide();
    $('#eway').hide();
    // $("#newProductAdd").hide();
    
    $scope.gstProductList = [];
    $scope.customerList = [];
    $scope.employeeList = [];
    $scope.productList = [];
    $scope.selectedProductList = [];
    $scope.selectedProductListRemove = [];
    $scope.selectedProductListAdd = [];
    $scope.deliverycount = [];
    $scope.sale = {};
    $scope.sale.amount = 0;
    $scope.sale.cgst = 0;
    $scope.sale.sgst = 0;
    $scope.sale.igst = 0;
    $scope.sale.roundoff = 0;
    $scope.sale.sm_amount = 0;
    $scope.sale.disper = 0;
    $scope.sale.advance_amt = 0;
    $scope.parseFloat = parseFloat;
    $scope.parseInt = parseInt;


    $scope.selectedNewProductList = [];
    $scope.selectedNewProductListAdd=[];
    $scope.selectedNewProductListRemove = [];

    $scope.smId = $routeParams.saleId;
    $scope.categoryList = [];
    $("#sm_cm_id").focus();

    const fin = localStorage.getItem("watersupply_admin_financial_year");
    const finyr = fin.split('-');

  hotkeys.bindTo($scope).add({
    combo: 'alt+s',
    description: 'It will update sale details.',
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

    $('#expectedDate').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.sale.sm_payment_date = $('#expectedDate').val();
            // $('#end-date-picker').val(endDate); 
        }
    });

    $('#deliveryDate').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.sale.sm_del_date = $('#deliveryDate').val();
        }
    });

    $('#sm_eway_bill_date').datetimepicker({
        validateOnBlur: false,
        todayButton: false,
        timepicker: false,
        scrollInput: false,
        format: 'Y-m-d',
        minDate: (finyr[0].toString()) + '/04/01',// minimum date(for today use 0 or -1970/01/01)
        maxDate: (finyr[1].toString()) + '/03/31',//maximum date calendar
        onChangeDateTime: function (dp, $input) {
            $scope.sale.sm_eway_bill_date = $('#sm_eway_bill_date').val();
            // $('#end-date-picker').val(endDate); 
        }
    });

    $scope.creditShow = function(){
        if($scope.sale.sm_payment_mode == 'cash' && $scope.sale.sm_del_check == true || $scope.sale.sm_payment_mode == 'card' && $scope.sale.sm_del_check == true){
            $('#paymentdate').hide();
            $('#advance').show();
            $('#balance').show();
            $scope.sale.sm_payment_date = null;
            $scope.sale.sm_advance_amt = null;
            $scope.sale.sm_balance_amt = null;
            // $('#expectedDate').val($('#pDate').val());
            // $scope.purchase.prm_payment_date = $scope.purchase.prm_date;
        }
        else{
            $('#paymentdate').show();
            $('#advance').hide();
            $('#balance').hide();
            $scope.sale.sm_payment_date = undefined;
            $scope.sale.sm_advance_amt = 0;
            $scope.sale.sm_balance_amt = 0;
        }
    };

    $scope.checkIsTrue = function(){

    if($scope.sale.is_true == true)
    {
      $("#newProductAdd").show();
    }
    else{
     $("#newProductAdd").hide();
    }
  };

// TO SHOW DELIVERY DATE ACCORDING TO CHEKBOX
  
    // $(document).ready(function(){
    //     $('#deliveryCheck').click(function(){
    //         if($(this).prop("checked") == true){
    //             $("#deldateshow").show();
    //         }
    //         else if($(this).prop("checked") == false){
    //             $("#deldateshow").hide( );
    //             $scope.sale.sm_del_date = $('#pDate').val();
    //         }
    //     });
    // }); 

     $(document).ready(function(){
        $('#deliveryCheck').click(function(){
            if($(this).prop("checked") == true){
                $("#deldateshow").show();
                $('#advance').show();
                $('#balance').show();
            $scope.sale.sm_advance_amt = null;
            $scope.sale.sm_balance_amt = null;
            $scope.sale.sm_del_date = undefined;
            }
            else if($(this).prop("checked") == false){
                $("#deldateshow").hide( );
                $('#advance').hide();
                $('#balance').hide();
            $scope.sale.sm_advance_amt = 0;
            $scope.sale.sm_balance_amt = 0;
            $scope.sale.sm_del_date = null;
                $scope.sale.sm_del_date = $('#pDate').val();
            }
        });
    });

    // $scope.delCheckIsTrue = function(){

    //     if($scope.sale.sm_payment_mode == 'cash' && $scope.sale.sm_del_check == true || $scope.sale.sm_payment_mode == 'card' && $scope.sale.sm_del_check == true)
    //     {
    //       $("#deldateshow").show();
    //         $('#advance').show();
    //         $('#balance').show();
    //         $scope.sale.sm_payment_date = null;
    //         $scope.sale.sm_advance_amt = null;
    //         $scope.sale.sm_balance_amt = null;
    //     }
    //     else{
    //      $("#deldateshow").hide();
    //         $('#advance').hide();
    //         $('#balance').hide();
    //         $scope.sale.sm_payment_date = undefined;
    //         $scope.sale.sm_advance_amt = 0;
    //         $scope.sale.sm_balance_amt = 0;
    //     }

    //     if($scope.sale.sm_payment_mode == 'credit' && $scope.sale.sm_del_check == true){
    //         $("#deldateshow").show();

    //     }
    // };

    $scope.getisewaybill = function(){
      if($('#is_eway:checkbox:checked').length > 0){
        $('#is_eway').prop("checked",true);
        $scope.sale.is_eway = 1;
        $('#eway').show();
      }
      else{
        $('#is_eway').prop("checked",false);
        $scope.sale.sm_eway_bill_no = undefined;
        $scope.sale.sm_vehicle_no = undefined;
        $scope.sale.sm_distance = undefined;
        $scope.sale.sm_eway_bill_date = undefined;
        $scope.sale.is_eway = 0;
        $('#eway').hide();
      }
    };

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

    $scope.getSearchEmp = function(vals) {

      var searchTerms = {search: vals, com_id: localStorage.getItem("com_id")};
      

        const httpOptions = {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
          }
        };
        return $http.post($rootScope.baseURL+'/employee/typeahead/search', searchTerms, httpOptions).then((result) => {
          
          return result.data;
      });
    };

    $scope.getSerialNo = function() {
        
        $http({
          method: 'GET',
          url: $rootScope.baseURL+'/sale/'+$scope.smId,
          //data: $scope.data,
          headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
        })
        .success(function(sale)
        {
            // $scope.sale  = angular.copy(sale);
            sale.forEach(function(value, key) {
                value.sm_date = $filter('date')(value.sm_date, "yyyy-MM-dd");
                value.sm_del_date = $filter('date')(value.sm_del_date, "yyyy-MM-dd");
                value.sm_payment_date = $filter('date')(value.sm_payment_date, "yyyy-MM-dd");
                value.sm_eway_bill_date = $filter('date')(value.sm_eway_bill_date, "yyyy-MM-dd");
                
                if(value.sm_payment_mode == "cash" || value.sm_payment_mode == "card"){
                    $('#paymentdate').hide();
                    $('#advance').show();
                    $('#balance').show();
                }
                else{
                    $('#paymentdate').show();
                    $('#advance').hide();
                    $('#balance').hide();
                }
                if(value.is_eway_bill == 1){
                    $('#is_eway').prop("checked",true);
                    value.is_eway = 1;
                    $('#eway').show();
                }


                if(value.sm_del_check == 1){
                    $('#deliveryCheck').prop("checked",true);
                    $("#deldateshow").show();
                }
                else{
                    $('#deliveryCheck').prop("checked",false);
                    $("#deldateshow").hide();
                }
                
                if(value.sm_prod_unsort_list == 1){
                    $('#is_true').prop("checked",true);

                    $('#newProductAdd').show();
                    value.sm_prod_unsort_list = 1;
                    // $("#is_true").value('true');
                }
                else{
                    value.sm_prod_unsort_list = 0;
                    $('#is_true').prop("checked",false);
                    $('#newProductAdd').hide();
                }
                value.old_sm_amount = value.sm_amount;
                value.old_sm_payment_mode = value.sm_payment_mode;
                value.disper = value.sm_disc_per;

                
                $http({
                  method: 'GET',
                  url: $rootScope.baseURL+'/customer/'+value.cm_id,
                  headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                })
                .success(function(customerObj)
                {
                    customerObj.forEach(function (value1, key1) {
                        value.old_sm_cm_id = value1;
                        value.sm_cm = value1;
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

                $http({
                  method: 'GET',
                  url: $rootScope.baseURL+'/employee/'+value.emp_id,
                  headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                })
                .success(function(customerObj)
                {
                    customerObj.forEach(function (value1, key1) {
                        value.old_sm_emp_id = value1;
                        value.sm_emp = value1;
                    });

                    $scope.sale = value;
                    $scope.sale.com_is_composition = localStorage.getItem("com_is_composition");
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
                if(value.sm_prod_list == 1){
                    $http({
                          method: 'GET',
                          url: $rootScope.baseURL+'/sale/details/'+$scope.smId,
                          //data: $scope.data,
                          headers: {'Content-Type': 'application/json',
                                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                        })
                        .success(function(selectedProductList)
                        {
                            selectedProductList.forEach(function (value, key) {
                                value.ppm_size = value.ppm_size;
                                value.old_spm_quantity = value.spm_quantity;
                                value.pm_color_code = value.ppm_color_code;
                                value.pm_unit_name = value.um_name;
                                value.pm_discount = value.spm_discount;
                                value.btpm_quantity = value.spm_quantity;
                                value.ppm_mrp = value.spm_rate;
                                $scope.adv_amt_old = value.sm_advance_amt;
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
                

                // for new product unsorted list               
                if(value.sm_prod_unsort_list == 1){
                        $http({
                          method: 'GET',
                          url: $rootScope.baseURL+'/sale/details/unsorted/'+$scope.smId,
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
                                // $scope.calculateTotal();
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

    $scope.getSearchPro = function(vals) {

      var searchTerms = {search: vals, com_id: localStorage.getItem("com_id")};
      

        const httpOptions = {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
          }
        };
        return $http.post($rootScope.baseURL+'/product/typeahead/search', searchTerms, httpOptions).then((result) => {
         
          return result.data;
      });
    };

    // $scope.setItemDetails = function(objects){
    //     $scope.productObj.btpm_price = objects.pm_sale_price;
    //     $scope.productObj.pm_discount = 0;
    // };
     $scope.setItemDetails = function(objects){
        // $scope.productObj.btpm_price = objects.pm_sale_price;
        $scope.productObj.pm_discount = 0;
        $scope.productObj.pm_size = objects. ppm_size;
        $scope.productObj.pm_color_code = objects.ppm_color_code;
        $scope.productObj.pm_unit_name = objects.um_name;
        $scope.productObj.ppm_mrp = objects.ppm_selling_price;
        $scope.productObj.pm_hsn = objects.pm_hsn;
        $scope.productObj.pm_name = objects.pm_name;
        // $scope.productObj.pm_discount = objects.ppm_discount;
        $scope.productObj.pm_cgst = objects.ppm_cgst;
        $scope.productObj.pm_sgst = objects.ppm_sgst;
        $scope.productObj.pm_igst = objects.ppm_igst;
        // $scope.productObj.btpm_quantity = 1;
        // $scope.productObj.btpm_price = objects.ppm_purchase_rate;
    };

    $scope.addToCart = function(){

        var nameRegex = /^\d+$/;
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var numRegex = /^\d+(\.\d{1,2})?$/;

        if($('#pm_id').val() == undefined || $('#pm_id').val() == "" || $scope.productObj.pm_id == undefined){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select product name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#pm_id").focus();
            }, 1500);
        }
        // else if($('#pm_discount').val() == undefined || $('#pm_discount').val() == ""){
        //     var dialog = bootbox.dialog({
        //     message: '<p class="text-center">please enter discount or 0.</p>',
        //         closeButton: false
        //     });
        //     dialog.find('.modal-body').addClass("btn-danger");
        //     setTimeout(function(){
        //         dialog.modal('hide');  
        //         $("#pm_discount").focus();
        //     }, 1500);
        // }
        else if($('#btpm_quantity').val() == undefined || $('#btpm_quantity').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter quantity.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#btpm_quantity").focus();
            }, 1500);
         }
        // else if($('#btpm_price').val() == undefined || $('#btpm_price').val() == ""){
        //     var dialog = bootbox.dialog({
        //     message: '<p class="text-center">please enter price.</p>',
        //         closeButton: false
        //     });
        //     dialog.find('.modal-body').addClass("btn-danger");
        //     setTimeout(function(){
        //         dialog.modal('hide'); 
        //         $("#btpm_price").focus();
        //     }, 1500);
        // }
        else{
            $scope.selectedProductListAdd.push($scope.productObj);
            $scope.productObj = null;
            $scope.calculateTotal();
           $('#pm_id').focus();
        }
    };

     $scope.removeItem = function(index){
        $scope.selectedProductListRemove.push($scope.selectedProductList[index]);
        $scope.selectedProductList.splice(index,1);
        $scope.calculateTotal();
           $('#pm_id').focus();
    };
    
    $scope.removeItemAdd = function(index){
        $scope.selectedProductListAdd.splice(index,1);
        $scope.calculateTotal();
            $('#pm_id').focus();
    };


    // UNIT NAME SEARCH ON TYPEHEAD FUNCTION
    $scope.getSearchUnit = function(vals) {

      var searchTerms = {search: vals, com_id: localStorage.getItem("com_id")};
      

        const httpOptions = {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer '+localStorage.getItem("watersupply_admin_access_token")
          }
        };
        return $http.post($rootScope.baseURL+'/unit/typeahead/search', searchTerms, httpOptions).then((result) => {
          
          return result.data;
      });
    };

    // NEW PRODUCT ADD FUNCTION
      $scope.addTotable = function(){
        var nameRegex = /^\d+$/;
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var numRegex = /^\d+(\.\d{1,2})?$/;
        if($('#um_id').val() == undefined || $('#um_id').val() == "" || $scope.newproductObj.um_id == undefined){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Unit Name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#um_id").focus();
            }, 1500);
        }
        else if($('#pm_product_name').val() == undefined || $('#pm_product_name').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Product Name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#pm_product_name").focus();
            }, 1500);
        }
        else if($('#pm_product_color_code').val() == undefined || $('#pm_product_color_code').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Design No.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#pm_product_color_code").focus();
            }, 1500);
        }
        
        else if($('#pm_product_size').val() == undefined || $('#pm_product_size').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Size or (-).</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#pm_product_size").focus();
            }, 1500);
        }
        else if($('#pm_product_hsn').val() == undefined || $('#pm_product_hsn').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter HSN.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#pm_product_hsn").focus();
            }, 1500);
        }
        // else if($('#pm_product_discount').val() == undefined || $('#pm_product_discount').val() == ""){
        //     var dialog = bootbox.dialog({
        //     message: '<p class="text-center">please enter Discount.</p>',
        //         closeButton: false
        //     });
        //     dialog.find('.modal-body').addClass("btn-danger");
        //     setTimeout(function(){
        //         dialog.modal('hide');  
        //         $("#pm_product_discount").focus();
        //     }, 1500);
        // }
        else if($('#pm_product_cgst').val() == undefined || $('#pm_product_cgst').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter CGST.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#pm_product_cgst").focus();
            }, 1500);
        }
        else if($('#pm_product_sgst').val() == undefined || $('#pm_product_sgst').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter SGST.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#pm_product_sgst").focus();
            }, 1500);
        }
        else if($('#pm_product_igst').val() == undefined || $('#pm_product_igst').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter IGST.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#pm_product_igst").focus();
            }, 1500);
        }
        else if($('#btpm_product_quantity').val() == undefined || $('#btpm_product_quantity').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Quantity.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $("#btpm_product_quantity").focus();
            }, 1500);
        }
        else if($('#ppm_product_mrp').val() == undefined || $('#ppm_product_mrp').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Price.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#ppm_product_mrp").focus();
            }, 1500);
        }
        else{
            // $scope.index =1;

            $scope.selectedNewProductListAdd.push($scope.newproductObj);
            $scope.newproductObj = null;
            $scope.calculateTotal();
        }
    };

    $scope.removeNewItem = function(index){
        $scope.selectedNewProductListRemove.push($scope.selectedNewProductList[index]);
        $scope.selectedNewProductList.splice(index,1);
        $scope.calculateTotal();
           // $('#pm_id').focus();
    };
    
    $scope.removeNewItemAdd = function(index){
        $scope.selectedNewProductListAdd.splice(index,1);
        $scope.calculateTotal();
            // $('#pm_id').focus();
    };


    $scope.calculateTotal = function(){
        var i = 1;
        var j = 1;
        $scope.disc = 0;
        $scope.sale.amount = 0;
        $scope.sale.discount = 0;
        $scope.sale.cgst = 0;
        $scope.sale.sgst = 0;
        $scope.sale.igst = 0;
        $scope.sale.roundoff = 0;

        if($scope.sale.com_is_composition == 0)
        {

            angular.forEach($scope.selectedProductList, function(value, key) {
                value.srno = i++;
                // $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.spm_quantity * value.spm_rate) * ($scope.sale.disper/100))).toFixed(2);
                // value.netamt = (((parseFloat((value.spm_quantity * value.spm_rate) - ((value.spm_quantity * value.spm_rate) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.pm_cgst) + parseFloat(value.pm_sgst) + parseFloat(value.pm_igst) + 100));
                // $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                // $scope.sale.cgst = parseFloat(parseFloat($scope.sale.cgst) + parseFloat(value.netamt * (value.spm_cgst/100))).toFixed(2);
                // $scope.sale.sgst = parseFloat(parseFloat($scope.sale.sgst) + parseFloat(value.netamt * (value.spm_sgst/100))).toFixed(2);
                // $scope.sale.igst = parseFloat(parseFloat($scope.sale.igst) + parseFloat(value.netamt * (value.spm_igst/100))).toFixed(2);
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_quantity * value.ppm_mrp) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = (((parseFloat((value.btpm_quantity * value.ppm_mrp) - ((value.btpm_quantity * value.ppm_mrp) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.pm_cgst) + parseFloat(value.pm_sgst) + parseFloat(value.pm_igst) + 100));
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                $scope.sale.cgst = parseFloat(parseFloat($scope.sale.cgst) + parseFloat(value.netamt * (value.pm_cgst/100))).toFixed(2);
                $scope.sale.sgst = parseFloat(parseFloat($scope.sale.sgst) + parseFloat(value.netamt * (value.pm_sgst/100))).toFixed(2);
                $scope.sale.igst = parseFloat(parseFloat($scope.sale.igst) + parseFloat(value.netamt * (value.pm_igst/100))).toFixed(2);
        
            });
            angular.forEach($scope.selectedProductListAdd, function(value, key) {
                value.srno = i++;
                // $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_quantity * value.btpm_price) * ($scope.sale.disper/100))).toFixed(2);
                // value.netamt = (((parseFloat((value.btpm_quantity * value.btpm_price) - ((value.btpm_quantity * value.btpm_price) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.pm_cgst) + parseFloat(value.pm_sgst) + parseFloat(value.pm_igst) + 100));
                // $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                // $scope.sale.cgst = parseFloat(parseFloat($scope.sale.cgst) + parseFloat(value.netamt * (value.pm_cgst/100))).toFixed(2);
                // $scope.sale.sgst = parseFloat(parseFloat($scope.sale.sgst) + parseFloat(value.netamt * (value.pm_sgst/100))).toFixed(2);
                // $scope.sale.igst = parseFloat(parseFloat($scope.sale.igst) + parseFloat(value.netamt * (value.pm_igst/100))).toFixed(2);
        
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_quantity * value.ppm_mrp) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = (((parseFloat((value.btpm_quantity * value.ppm_mrp) - ((value.btpm_quantity * value.ppm_mrp) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.pm_cgst) + parseFloat(value.pm_sgst) + parseFloat(value.pm_igst) + 100));
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                $scope.sale.cgst = parseFloat(parseFloat($scope.sale.cgst) + parseFloat(value.netamt * (value.pm_cgst/100))).toFixed(2);
                $scope.sale.sgst = parseFloat(parseFloat($scope.sale.sgst) + parseFloat(value.netamt * (value.pm_sgst/100))).toFixed(2);
                $scope.sale.igst = parseFloat(parseFloat($scope.sale.igst) + parseFloat(value.netamt * (value.pm_igst/100))).toFixed(2);
            });
            angular.forEach($scope.selectedNewProductList, function(value, key) {
                value.srno = j++;
                
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = (((parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) - ((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.pm_product_cgst) + parseFloat(value.pm_product_sgst) + parseFloat(value.pm_product_igst) + 100));
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                $scope.sale.cgst = parseFloat(parseFloat($scope.sale.cgst) + parseFloat(value.netamt * (value.pm_product_cgst/100))).toFixed(2);
                $scope.sale.sgst = parseFloat(parseFloat($scope.sale.sgst) + parseFloat(value.netamt * (value.pm_product_sgst/100))).toFixed(2);
                $scope.sale.igst = parseFloat(parseFloat($scope.sale.igst) + parseFloat(value.netamt * (value.pm_product_igst/100))).toFixed(2);
            });
            // ========for new product add calculation
            angular.forEach($scope.selectedNewProductListAdd, function(value, key) {
                value.srno = j++;
                
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = (((parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) - ((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2)) * 100) / parseFloat(parseFloat(value.pm_product_cgst) + parseFloat(value.pm_product_sgst) + parseFloat(value.pm_product_igst) + 100));
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
            angular.forEach($scope.selectedProductListAdd, function(value, key) {
                // value.srno = i++;
                // $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_quantity * value.btpm_price) * ($scope.sale.disper/100))).toFixed(2);
                // value.netamt = parseFloat((value.btpm_quantity * value.btpm_price) - ((value.btpm_quantity * value.btpm_price) * ($scope.sale.disper/100))).toFixed(2);
                // $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
                value.srno = i++;
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_quantity * value.ppm_mrp) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = parseFloat((value.btpm_quantity * value.ppm_mrp) - ((value.btpm_quantity * value.ppm_mrp) * ($scope.sale.disper/100))).toFixed(2);
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);             
            });
            angular.forEach($scope.selectedNewProductList, function(value, key) {
                value.srno = j++;
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) - ((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2);
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
            });
            // =====for new product add calculation
            angular.forEach($scope.selectedNewProductListAdd, function(value, key) {
                value.srno = j++;
                $scope.sale.discount = parseFloat(parseFloat($scope.sale.discount) + parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2);
                value.netamt = parseFloat((value.btpm_product_quantity * value.ppm_product_mrp) - ((value.btpm_product_quantity * value.ppm_product_mrp) * ($scope.sale.disper/100))).toFixed(2);
                $scope.sale.amount = parseFloat(parseFloat($scope.sale.amount) + parseFloat(value.netamt)).toFixed(2);
            });

        }
        $scope.sale.sm_amount = Math.round(parseFloat($scope.sale.amount) + parseFloat($scope.sale.cgst) + parseFloat($scope.sale.sgst) + parseFloat($scope.sale.igst) + parseFloat($scope.sale.sm_other_charges));
        $scope.sale.roundoff = $scope.sale.sm_amount - (parseFloat($scope.sale.amount) + parseFloat($scope.sale.cgst) + parseFloat($scope.sale.sgst) + parseFloat($scope.sale.igst) + parseFloat($scope.sale.sm_other_charges));
        $scope.sale.sm_balance_amt_new = parseFloat($scope.sale.sm_amount) - parseFloat($scope.sale.sm_advance_amt);
        $scope.convertNumberToWords($scope.sale.sm_amount);
    };

    $scope.discCalculate = function(){
        $scope.sale.disper = parseFloat((parseFloat(($scope.sale.sm_discount / $scope.sale.sm_amount) * 100))).toFixed(2);
        $scope.calculateTotal();
    }


    $scope.discCalculateEdit = function(){
        var tot = parseFloat($scope.sale.sm_discount + $scope.sale.amount).toFixed(2);
        $scope.sale.discountper = parseFloat((parseFloat(($scope.sale.sm_discount / tot) * 100))).toFixed(2);
        // $scope.dp=$scope.purchase.discountper;
        $scope.calculateTotal();
    }

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
        else if($('#deliveryDate').val() == undefined || $('#deliveryDate').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select Delivery Date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#deliveryDate').focus();
            }, 1500);
        }
        else if($('#invoiceType').val() == undefined || $('#invoiceType').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select credit / cash.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#invoiceType').focus();
            }, 1500);
        }
        else if($scope.sale.sm_payment_mode == "credit" && ($('#expectedDate').val() == undefined || $('#expectedDate').val() == "")){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select payment date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#expectedDate').focus();
            }, 1500);
        }
        else if($('#sm_cm_id').val() === undefined || $('#sm_cm_id').val() === "" || $scope.sale.sm_cm.cm_id == undefined){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select debtors.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide');  
                $('#sm_cm_id').focus();
            }, 1500);
        }
        else if($('#sm_emp_id').val() == undefined || $('#sm_emp_id').val() == "" || $scope.sale.sm_emp.emp_id == undefined){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select salesman.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_emp_id').focus();
            }, 1500);
        } 
        else if($('#sm_buyer_no').val() == undefined || $('#sm_buyer_no').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter buyer order no</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_buyer_no').focus();
            }, 1500);
        }
        else if($('#sm_discount').val() == undefined || $('#sm_discount').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter discount or 0.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_discount').focus();
            }, 1500);
        }
        else if($('#sm_other_charges').val() == undefined || $('#sm_other_charges').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter other charges or 0.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_other_charges').focus();
            }, 1500);
        }
        else if($('#sm_advance_amt').val() == undefined || $('#sm_advance_amt').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Advance amount or 0.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_advance_amt').focus();
            }, 1500);
        }
        else if($scope.sale.is_eway == 1 && ($('#sm_eway_bill_no').val() == undefined || $('#sm_eway_bill_no').val() == "")){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter eway bill no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_eway_bill_no').focus();
            }, 1500);
        }
        else if($scope.sale.is_eway == 1 && ($('#sm_vehicle_no').val() == undefined || $('#sm_vehicle_no').val() == "")){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter vehicle no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_vehicle_no').focus();
            }, 1500);
        }
        else if($scope.sale.is_eway == 1 && ($('#sm_distance').val() == undefined || $('#sm_distance').val() == "")){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter distance in KM.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_distance').focus();
            }, 1500);
        }
        else if($scope.sale.is_eway == 1 && ($('#sm_eway_bill_date').val() == undefined || $('#sm_eway_bill_date').val() == "")){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please select eway bill date.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#sm_eway_bill_date').focus();
            }, 1500);
        }
        else if($scope.selectedProductList.length == 0 && $scope.selectedProductListAdd.length == 0 && $scope.selectedNewProductList.length == 0 && $scope.selectedNewProductListAdd.length == 0){
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
            if($scope.selectedProductList.length > 0 || $scope.selectedProductListAdd.length > 0){
                     $scope.sale.sm_prod_list = 1;   
                }
                else{
                    $scope.sale.sm_prod_list = 0;   
                }
            if($scope.selectedNewProductList.length > 0 || $scope.selectedNewProductListAdd.length > 0){
                     $scope.sale.sm_prod_unsort_list = 1;                     
                }
                else{
                    $scope.sale.sm_prod_unsort_list = 0; 
                }

            if($scope.sale.sm_del_check == true){
                    $scope.sale.sm_del_check = 1;
                    $scope.sale.sm_delivery_status = 0;
                }
                else{
                    $scope.sale.sm_del_check = 0;
                    $scope.sale.sm_delivery_status = 1;
                }

            var advDiff = $scope.sale.sm_advance_amt - $scope.adv_amt_old;
            
             $scope.sale.sm_balance_amt = $scope.sale.sm_balance_amt - advDiff;
             

                $('#btnsave').attr('disabled','true');
                $('#btnsave').text("please wait...");

            $scope.sale.sm_date = $('#pDate').val();
            $scope.pruchaseForm = {
                purchaseSingleData : $scope.sale,

                purchaseMultipleData : $scope.selectedProductList,
                purchaseadd : $scope.selectedProductListAdd,
                purchaseremove : $scope.selectedProductListRemove,

                purchaseUnsortMultipleData : $scope.selectedNewProductList,
                purchaseUnsortadd : $scope.selectedNewProductListAdd,
                purchaseUnsortremove : $scope.selectedNewProductListRemove
            };
            $http({
              method: 'POST',
              url: $rootScope.baseURL+'/sale/edit/'+$scope.smId,
              data: $scope.pruchaseForm,
              headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            })
            .success(function(response)
            {


                $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                $('#btnsave').removeAttr('disabled');
                // $scope.printDetails();
                window.location.href = '#/sale'; 
                // $scope.gstProductList = [];
                //     $http({
                //       method: 'GET',
                //       url: $rootScope.baseURL+'/sale/gst/details/'+$scope.smId,
                //       headers: {'Content-Type': 'application/json',
                //                 'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                //     })
                //     .success(function(gstProductList)
                //     {

                //         if($scope.sale.com_is_composition == 0){
                //             $scope.sumtaxable_value = 0;
                //             $scope.sumtax_cgst = 0;
                //             $scope.sumtax_sgst = 0;
                //             $scope.sumtotal_tax = 0;

                //             gstProductList.forEach(function (value, key) {
                //                 $scope.sumtaxable_value = parseFloat($scope.sumtaxable_value) + parseFloat(value.taxable_value);
                //                 $scope.sumtax_cgst = parseFloat($scope.sumtax_cgst) + parseFloat(value.tax_cgst);
                //                 $scope.sumtax_sgst = parseFloat($scope.sumtax_sgst) + parseFloat(value.tax_sgst);
                //                 $scope.sumtotal_tax = parseFloat($scope.sumtotal_tax) + parseFloat(value.tax_cgst + value.tax_sgst);
                //                 $scope.gstProductList.push(value);
                //               });
                //         }

                //             $('#btnsave').html("UPDATE <span class='label label-success'>alt+s</span>");
                //           $('#btnsave').removeAttr('disabled');
                //           // $scope.printDetails();
                //           window.location.href = '#/sale'; 
                          
                //     })
                //     .error(function(data) 
                //     {   
                //       var dialog = bootbox.dialog({
                //           message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                //               closeButton: false
                //           });
                //           setTimeout(function(){
                //               dialog.modal('hide'); 
                //           }, 1500);
                //     });
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

    $scope.openCustomerForm = function(){
        $scope.customer = {};
        $scope.customer.cm_com_id = localStorage.getItem("com_id");
        // $scope.customer.cm_mobile = "N/A";
        $scope.customer.cm_address = "N/A";
        $scope.customer.cm_email = "N/A";
        $scope.customer.cm_gst_no = "N/A";
        // $scope.customer.cm_state = "N/A";
        // $scope.customer.cm_city = "N/A";
        // $scope.customer.cm_pin = "N/A";
        $scope.customer.cm_opening_debit = 0;
        $scope.customer.cm_opening_credit = 0;
        $('#addCustomer').modal('show');
    };

     $scope.saveCustomer = function(){
        var nameRegex = /^\d+$/;
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if($('#cm_name').val() == undefined || $('#cm_name').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_name").focus();
            }, 1500);
        }
      else if($('#cm_gst_no').val() == undefined || $('#cm_gst_no').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter GST or N/A.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_gst_no").focus();
            }, 1500);
      }
        else if($('#cm_mobile').val() == undefined || $('#cm_mobile').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Mobile no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_mobile").focus(); 
            }, 1500);
        }
      else if($('#cm_email').val() == undefined || $('#cm_email').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter email id.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_email").focus(); 
            }, 1500);
      }
        else if($('#cm_address').val() == undefined || $('#cm_address').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter address.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#cm_address").focus();
            }, 1500);
        }
        else{
            $('#addCust').attr('disabled','true');
            $('#addCust').text("please wait...");

            $http({
                method: 'POST',
                url: $rootScope.baseURL+'/customer/checkname',
                data: $scope.customer,
                headers: {'Content-Type': 'application/json',
                        'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(login)
              {

                if(login.length > 0)
                {
                  var dialog = bootbox.dialog({
                  message: '<p class="text-center">Debtors Already exists.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                        $('#addCust').text("Save changes");
                        $('#addCust').removeAttr('disabled');
                      dialog.modal('hide'); 
                      $("#cm_name").focus();
                  }, 1500);  
                }
                else{

                    $http({
                      method: 'POST',
                      url: $rootScope.baseURL+'/customer/add',
                      data: $scope.customer,
                      headers: {'Content-Type': 'application/json',
                              'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                    })
                    .success(function(login)
                    {
                        var dialog = bootbox.dialog({
                        message: '<p class="text-center">Data Saved Successfully!</p>',
                            closeButton: false
                        });
                        setTimeout(function(){
                        $('#addCust').text("Save changes");
                        $('#addCust').removeAttr('disabled');
                            //do something special
                            dialog.modal('hide');  
                            $('#addCustomer').modal('hide');
                            $scope.customer = null;
                        }, 1500);
                    })
                    .error(function(data) 
                    {   
                        var dialog = bootbox.dialog({
                        message: '<p class="text-center">Oops, Something Went Wrong!</p>',
                            closeButton: false
                        });
                        setTimeout(function(){
                        $('#addCust').text("Save changes");
                        $('#addCust').removeAttr('disabled');
                            dialog.modal('hide');  
                            $('#addCustomer').modal('hide');
                            //$scope.vendor = null;
                        }, 1500);
                    });
                }
              })
              .error(function(data) 
              {   
                var dialog = bootbox.dialog({
                  message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').html("SAVE  <span class='label label-success'>alt+s</span>");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                  }, 1500);            
              });
  
        }
    };

    $scope.openEmployeeForm = function(){
        $scope.employee = {};
        $scope.employee.emp_com_id = localStorage.getItem("com_id");
        $scope.employee.emp_mobile = "N/A";
        $scope.employee.emp_address = "N/A";
        $('#addEmployee').modal('show');
    };

    $scope.saveEmployee = function(){
        var nameRegex = /^\d+$/;
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if($('#emp_name').val() === undefined || $('#emp_name').val() === ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter employee name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#emp_name").focus(); 
            }, 1500);
        }
        else if($('#emp_mobile').val() == undefined || $('#emp_mobile').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter Mobile no.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#emp_mobile").focus(); 
            }, 1500);
        }
        else if($('#emp_address').val() == undefined || $('#emp_address').val() == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter address.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#emp_address").focus(); 
            }, 1500);
        }
        else{
            $('#addEmp').attr('disabled','true');
            $('#addEmp').text("please wait...");

            $http({
              method: 'POST',
              url: $rootScope.baseURL+'/employee/add',
              data: $scope.employee,
              headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
            })
            .success(function(login)
            {
                var dialog = bootbox.dialog({
                message: '<p class="text-center">Data Saved Successfully!</p>',
                    closeButton: false
                });
                setTimeout(function(){
                $('#addEmp').text("Save changes");
                $('#addEmp').removeAttr('disabled');
                    //do something special
                    dialog.modal('hide');  
                    $('#addEmployee').modal('hide');
                    $scope.employee = null;
                }, 1500);
            })
            .error(function(data) 
            {   
                var dialog = bootbox.dialog({
                message: '<p class="text-center">Oops, Something Went Wrong!</p>',
                    closeButton: false
                });
                setTimeout(function(){
                $('#addEmp').text("Save changes");
                $('#addEmp').removeAttr('disabled');
                    dialog.modal('hide');  
                    $('#addEmployee').modal('hide');
                    //$scope.vendor = null;
                }, 1500);
            });
  
        }
    };


    $scope.printDetails = function(){

        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
        if($scope.sale.com_is_composition == 0) 
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
          "<center style='font-size:11pt;'>Tax Invoice</center>"+
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
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.sale.sm_cm.cm_name+"</strong><br>Number : <strong>"+$scope.sale.sm_cm.cm_mobile+"</strong><br>Email Id : <strong>"+$scope.sale.sm_cm.cm_email+"</strong><br>GST : <strong>"+$scope.sale.sm_cm.cm_gst_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.sale.sm_cm.cm_address+"</strong><br><strong>"+$scope.sale.sm_cm.cm_state+"</strong><br><strong>"+$scope.sale.sm_cm.cm_city+"</strong><br><strong>"+$scope.sale.sm_cm.cm_pin+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.sale.sm_cm.cm_del_address+"</strong><br><strong>"+$scope.sale.sm_cm.cm_del_state+"</strong><br><strong>"+$scope.sale.sm_cm.cm_del_city+"</strong><br><strong>"+$scope.sale.sm_cm.cm_del_pin+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Serial No: <strong> "+$scope.sale.sm_invoice_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Buyer's Order No. : <strong>"+$scope.sale.sm_buyer_no+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.sale.sm_date, "dd-MM-yyyy")+"</strong></td>" +
                    "</tr>" +
                    "<tr>" ;
                        
                        if ($scope.sale.sm_eway_bill_no == "" || $scope.sale.sm_eway_bill_no == undefined) 
                        {
                          page1 = page1 + "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>E-Way Bill No. : <strong></strong></td>" ;
                        }
                        else
                        {
                          page1 = page1 + "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>E-Way Bill No. : <strong>"+$scope.sale.sm_eway_bill_no+"</strong></td>" ;
                        }
                        page1 = page1 + "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Salesman : <strong>"+$scope.sale.sm_emp.emp_name+"</strong></td>" ;
                        if ($scope.sale.sm_payment_date == "" || $scope.sale.sm_payment_date == undefined) 
                        {
                          page1 = page1 + "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Receive Date : <strong></strong></td>" ;
                        }
                        else
                        {
                          page1 = page1 + "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Receive Date : <strong>"+$filter('date')($scope.sale.sm_payment_date, "dd-MM-yyyy")+"</strong></td>" ;
                        }
                    page1 = page1 + "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td colspan='3' valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+      
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Sr. No.</th>" +
                        // "<th width='10%'>Code</th> " +
                        "<th width='25%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>HSN/SAC</th>"+
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Quantity</th>" +
                        "<th width='10%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Price</th>" +
                        "<th width='5%' style='padding:4px 8px 4px 8px; font-size:10pt; text-align:center'>Disc</th>" +
                        // "<th width='5%' style='padding:4px 8px 4px 8px; font-size:11pt;'>Disc</th>"+
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
                  "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.sale.sm_comment+"</strong></td>" +
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
              "</tr>";
              if ($scope.sale.sm_discount != 0 && $scope.sale.sm_other_charges !=0)
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='4' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_discount, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              else if($scope.sale.sm_discount != 0 && $scope.sale.sm_other_charges ==0)
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Discount Amount (-)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_discount, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              else if($scope.sale.sm_discount == 0 && $scope.sale.sm_other_charges !=0)
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='3' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>" +
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              else
              {
                  page1 = page1 + "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Round Off</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.roundoff, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_amount, "2")+"</strong></td>" +
                  "</tr>" ;
              }
              page1 = page1 + "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>"+
                      "<td rowspan='2' width='32%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>HSN/SAC</td>"+
                      "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Taxable Value</td>"+
                      "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Central Tax</td>"+
                      "<td colspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>State Tax</td>"+
                      "<td rowspan='2' width='17%'  style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Total Tax Amount</td>"+
                    "</tr>"+
                    "<tr>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Amount</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:.5px;'>Rate</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:.5px;'>Amount</td>"+
                    "</tr>";
                    $scope.gstProductList.forEach(function (value, key) {
                      page1 = page1 + "<tr>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:.5px;' align='center'>"+value.pm_hsn+"</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:.5px;' align='center'>"+$filter('number')(value.taxable_value,2)+"</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:.5px;' align='center'>"+value.spm_cgst+"%</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:.5px;' align='center'>"+$filter('number')(value.tax_cgst,2)+"</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:.5px;' align='center'>"+value.spm_sgst+"%</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:.5px;' align='center'>"+$filter('number')(value.tax_sgst,2)+"</td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt;' align='center'>"+ $filter('number')(parseFloat(value.tax_cgst) + parseFloat(value.tax_sgst),2)+"</td>"+
                      "</tr>";
                    });
                    page1 = page1 +"<tr>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='right'><strong>Total</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtaxable_value,2)+"</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_cgst,2)+"</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong></strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid solid none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtax_sgst,2)+"</strong></td>"+
                      "<td style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid none none none; border-width:.5px;' align='center'><strong>"+$filter('number')($scope.sumtotal_tax,2)+"</strong></td>"+
                    "</tr>"+
                  "</table>"+
                "</td>"+
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
        else
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
          "<center style='font-size:11pt;'><strong>Bill of Supply</strong></center>"+
          "<center style='font-size:10pt;'>Composition taxable person. Not eligible to collect tax on supplies</center>"+
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
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Name : <strong>"+$scope.sale.sm_cm.cm_name+"</strong><br>Number : <strong>"+$scope.sale.sm_cm.cm_mobile+"</strong><br>Email Id : <strong>"+$scope.sale.sm_cm.cm_email+"</strong><br>GST : <strong>"+$scope.sale.sm_cm.cm_gst_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Address : <strong>"+$scope.sale.sm_cm.cm_address+"</strong><br><strong>"+$scope.sale.sm_cm.cm_state+"</strong><br><strong>"+$scope.sale.sm_cm.cm_city+"</strong><br><strong>"+$scope.sale.sm_cm.cm_pin+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Delivery Address : <strong>"+$scope.sale.sm_cm.cm_del_address+"</strong><br><strong>"+$scope.sale.sm_cm.cm_del_state+"</strong><br><strong>"+$scope.sale.sm_cm.cm_del_city+"</strong><br><strong>"+$scope.sale.sm_cm.cm_del_pin+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Serial No: <strong> "+$scope.sale.sm_invoice_no+"</strong></td>" +
                      "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid solid none; border-width:1px;'>Buyer's Order No. : <strong>"+$scope.sale.sm_buyer_no+"</strong></td>" +
                      "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid none; border-width:1px;'>Date : <strong>"+$filter('date')($scope.sale.sm_date, "dd-MM-yyyy")+"</strong></td>" +
                    "</tr>" +
                    "<tr>" ;
                        if ($scope.sale.sm_eway_bill_no == "" || $scope.sale.sm_eway_bill_no == undefined) 
                        {
                          page1 = page1 + "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>E-Way Bill No. : <strong></strong></td>" ;
                        }
                        else
                        {
                          page1 = page1 + "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>E-Way Bill No. : <strong>"+$scope.sale.sm_eway_bill_no+"</strong></td>" ;
                        }
                    page1 = page1 + "<td width='33%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'>Salesman : <strong>"+$scope.sale.sm_emp.emp_name+"</strong></td>" ;
                        if ($scope.sale.sm_payment_date == "" || $scope.sale.sm_payment_date == undefined) 
                        {
                          page1 = page1 + "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Receive Date : <strong></strong></td>" ;
                        }
                        else
                        {
                          page1 = page1 + "<td width='34%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none none; border-width:1px;'>Receive Date : <strong>"+$filter('date')($scope.sale.sm_payment_date, "dd-MM-yyyy")+"</strong></td>" ;
                        }
                    page1 = page1 + "</tr>" +
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
                        "<th width='55%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Description of Goods</th> " +
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
                  "<td width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none solid solid; border-width:1px;'>Comment <strong>"+$scope.sale.sm_comment+"</strong></td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'>Net Amount</td>" +
                  "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none none; border-width:1px;'><strong>"+$filter('number')($scope.sale.amount, "2")+"</strong></td>" +
              "</tr>"+
              "<tr>"+
                      "<td rowspan='2' width='60%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none none none solid; border-width:1px;'>Amount in words : <strong>"+$scope.amountinwords+" Rupees Only</strong></td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'>Other Charges (+)</td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_other_charges, "2")+"</strong></td>" +
                  "</tr>"+
                  "<tr>"+
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt;'>Total Amount </td>" +
                      "<td width='20%' style='padding:4px 8px 4px 8px; font-size:10pt; border-style: none solid none solid; border-width:1px;'><strong>"+$filter('number')($scope.sale.sm_amount, "2")+"</strong></td>" +
                  "</tr>" +
              "<tr>"+
                "<td colspan='3' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                        "<td width='45%' rowspan='2' style='padding:4px 8px 4px 8px; font-size:8pt; border-style: none solid none none; border-width:1px;text-align: justify; text-justify: inter-word;'>" +
                          // "GSTIN &nbsp&nbsp&nbsp&nbsp: <strong>XXXXXXXXXXXXXXX</strong><br>"+
                          // "PAN No. : <strong>XXXXXXXXXX</strong><br><br>"+
                          "<strong>Declaration:</strong><br>" +
                        "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct." +
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

});

