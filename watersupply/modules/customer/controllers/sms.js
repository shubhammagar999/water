// import admin
angular.module('customer').controller('promoSMSCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter, hotkeys) {
 
  $('.index').removeClass("active");
  $('#menucustomerindex').addClass("active");
  $('#smsindex').addClass("active");
  // hotkeys.bindTo($scope).add({
  //   combo: 'alt+s',
  //   description: 'It will add a new debtors.',
  //   allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
  //   callback: function() {
  //     $scope.addCustomer();
  //   }
  // });
  $('#addrecord').hide();
  $('#checkrecord').hide();
  $('#cm_message').attr('maxlength','140');
    $scope.message = {};
    $scope.customer = {};
    $scope.select = {};
    $scope.filteredTodos = [];
    $scope.maxSize = 5;
    $scope.entryLimit = 5;
    $scope.obj_Main = [];
    $scope.limit = {};
    $scope.loading1 = 0;
    $scope.parseFloat = parseFloat;

    $scope.message.cm_mob = "";
    $scope.customer.cm_com_id = localStorage.getItem("com_id");
    // $scope.customer.cm_mobile = "N/A";
    // $scope.customer.cm_email = "N/A";
   
    $("#cm_name").focus();

 

    // $scope.apiURL = $rootScope.baseURL+'/customer/customer/total';
     $scope.getAll = function () {
        if ($('#searchtext').val() == undefined || $('#searchtext').val() == "") {
        $scope.limit.search = "";
        $scope.limit.com_id = localStorage.getItem("com_id");
      }
      else{
        $scope.limit.search = $scope.searchtext;
        $scope.limit.com_id = localStorage.getItem("com_id");
      }
      $http({
                method: 'POST',
                url: $rootScope.baseURL+'/customer/customer/sms',
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

    $scope.arrarSelect = [];
    $scope.arrarSelect2 = [];
    $scope.checkBoxAll = function(index){ 
      $scope.message.cm_mob = "";
      if($scope.rcm_check_all)
      {
            angular.forEach($scope.filteredTodos, function(value, key) {
               value.samecheck = true;
                $scope.arrarSelect.push(value.cm_mobile);
                if( $scope.message.cm_mob == ""){
                  $scope.message.cm_mob = value.cm_mobile;
                }
                else{
                    $scope.message.cm_mob = $scope.message.cm_mob +","+ value.cm_mobile;
                }
            });
            $scope.arrarSelect2 = $scope.arrarSelect;
            // $("input.all").attr("disabled", true);
      }
      else{

          angular.forEach($scope.filteredTodos, function(value, key) {
           value.samecheck = false;
            // $scope.message.cm_mob = "";
            
            $scope.arrarSelect = [];
            });
          // $("input.all").attr("disabled", false);
      }
    };


    var arrar = [];
    var newLot = [];
    var temparrar = [];
    var uniqueNames = [];
    var arrayq1 = [];
    $scope.getsamecheck = function(index){
          // if($("#selectall").prop('checked', true)){
            if($('#selectall').is(":checked")){
                  var name1 = $scope.filteredTodos[index].cm_mobile;     
                  var index3 = $scope.arrarSelect.indexOf(name1);
                 
                 var clicks = $(this).data('clicks');
                      if (clicks) {
                        $scope.arrarSelect.push(name1);
                      } 
                      else {
                        $scope.arrarSelect.splice( index3, 1 );
                      }
                      $(this).data("clicks", !clicks);

                      // arrar = newLot;
                      var str = $scope.arrarSelect.toString();
                      var res = str.split(" ");
                      $scope.message.cm_mob = res;

            }
            else{
               var charaa = $scope.filteredTodos[index].cm_mobile;
                    temparrar.push(charaa);
                    arrayq1 = temparrar;

                    var name1 = $scope.filteredTodos[index].cm_mobile;     
                    var index3 = uniqueNames.indexOf(name1);
                    
                    var clicks = $(this).data('clicks');
                      if (clicks) {
                        uniqueNames.splice( index3, 1 );
                      } 
                      else {
                        var charaa = $scope.filteredTodos[index].cm_mobile;
                         newLot.push(charaa);
                         $.each(newLot, function(i, el){
                            if($.inArray(el, uniqueNames) === -1){ 
                                uniqueNames.push(el);
                              }
                          }); 
                         newLot = uniqueNames;
                      }
                      $(this).data("clicks", !clicks);
                    
                      arrar = newLot;
                      var str = arrar.toString();
                      var res = str.split(" ");
                      $scope.message.cm_mob = res;
            }
        
      };

    

    //   $scope.sendSMS = function(){
    //     if($("#cm_mob").val() == "" || $("#cm_mob").val() == undefined){
    //       var dialog = bootbox.dialog({
    //         message: '<p class="text-center">please select Mobile number from list.</p>',
    //             closeButton: false
    //         });
    //         dialog.find('.modal-body').addClass("btn-danger");
    //         setTimeout(function(){
    //             dialog.modal('hide'); 
    //             $("#cm_mob").focus();
    //         }, 1500);
    //     }
    //     else if($("#cm_msg").val() == "" || $("#cm_msg").val() == undefined){
    //       var dialog = bootbox.dialog({
    //         message: '<p class="text-center">please enter Message.</p>',
    //             closeButton: false
    //         });
    //         dialog.find('.modal-body').addClass("btn-danger");
    //         setTimeout(function(){
    //             dialog.modal('hide'); 
    //             $("#cm_msg").focus();
    //         }, 1500);
    //     }

    //     $scope.data = {
    //         recipient : $scope.message.cm_mob,
    //         message : 'Hi '+$scope.message.cm_msg+''
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


});