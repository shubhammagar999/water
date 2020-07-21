// import admin
angular.module('company').controller('companyListCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {

  $('#sidenav').hide();
    localStorage.setItem('com_name', '3CT Cloth');
    $rootScope.companyname = localStorage.getItem('com_name');

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
    $scope.companyListcount = 0;
    $scope.limit = {};
    $scope.loading1 = 0;

    $scope.apiURL = $rootScope.baseURL+'/company/company/total';
   $scope.getAll = function () {
      if ($('#searchtext').val() == undefined || $('#searchtext').val() == "") {
        $scope.limit.search = "";
      }
      else{
        $scope.limit.search = $scope.searchtext;
      }
        
      $http({
        method: 'POST',
        url: $scope.apiURL,
        data: $scope.limit,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(company)
	    {
	      company.forEach(function (value, key) {
                  $scope.companyListcount = value.total;
              });
              $scope.$watch("currentPage + numPerPage",
                  function () {
                      
                      $scope.resetpagination();
                  });
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
        if ($scope.filterUser >= $scope.companyListcount)
            $scope.filterUser = $scope.companyListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/company/company/limit',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(company)
              {
                $scope.filteredTodos = [];
                if (company.length > 0) {
                  $('#addrecord').hide();
                  $('#checkrecord').show();
                  company.forEach(function (value, key) {
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

    $scope.deleteCompany = function (com_id) {
      
      $('#confirm-delete').modal('show');
      $scope.com_id=com_id;
    }  

    $rootScope.deleteConfirm = function () {
                $('#del').attr('disabled','true');
                $('#del').text("please wait...");
	     $http({
	      method: 'POST',
	      url: $rootScope.baseURL+'/company/delete/'+$scope.com_id,
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

  $scope.select = function (index) {

    localStorage.setItem('com_id', $scope.filteredTodos[index].com_id);
    localStorage.setItem('com_name', $scope.filteredTodos[index].com_name);
    localStorage.setItem('com_address', $scope.filteredTodos[index].com_address);
    localStorage.setItem('com_contact', $scope.filteredTodos[index].com_contact);
    localStorage.setItem('com_email', $scope.filteredTodos[index].com_email);
    localStorage.setItem('com_note', $scope.filteredTodos[index].com_note);
    localStorage.setItem('com_comment', $scope.filteredTodos[index].com_comment);

    localStorage.setItem('com_gst', $scope.filteredTodos[index].com_gst);
    localStorage.setItem('com_city', $scope.filteredTodos[index].com_city);
    localStorage.setItem('com_state', $scope.filteredTodos[index].com_state);
    localStorage.setItem('com_status', $scope.filteredTodos[index].com_status);
    localStorage.setItem('com_pin', $scope.filteredTodos[index].com_pin);
    localStorage.setItem('com_is_composition', $scope.filteredTodos[index].com_is_composition);
    localStorage.setItem('com_created_at', $scope.filteredTodos[index].com_created_at);
    localStorage.setItem('com_updated_at', $scope.filteredTodos[index].com_updated_at);

    localStorage.setItem('com_file', $scope.filteredTodos[index].com_file);

    $http({
      method: 'POST',
      url: $rootScope.baseURL+'/bank/getbankdetails',
      data: $scope.filteredTodos[index],
      headers: {'Content-Type': 'application/json',
                'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
    })
    .success(function(bank)
    {
      bank.forEach(function (value, key) {
        localStorage.setItem('bkm_name', value.bkm_name);
        localStorage.setItem('bkm_branch', value.bkm_branch);
        localStorage.setItem('bkm_account_no', value.bkm_account_no);
        localStorage.setItem('bkm_ifsc', value.bkm_ifsc);
      });
        $rootScope.companyname=localStorage.getItem("com_name");
        window.location.href = "#/dashboard";
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

});