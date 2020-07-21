// import admin
angular.module('expensetype').controller('expensetypeListCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route) {

  $('.index').removeClass("active");
  $('#menuexpenseindex').addClass("active");
  $('#expensetypeindex').addClass("active");


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
    $scope.expensetypeListcount = [];
    $scope.limit = {};
    $scope.loading1 = 0;
    
$scope.apiURL = $rootScope.baseURL+'/expensetype/expensetype/total';
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
        url: $scope.apiURL,
        data: $scope.limit,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(expensetype)
	    {
	      expensetype.forEach(function (value, key) {
                  $scope.expensetypeListcount = value.total;
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
        if ($scope.filterUser >= $scope.expensetypeListcount)
            $scope.filterUser = $scope.expensetypeListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/expensetype/expensetype/limit',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(expensetype)
              {
                $scope.filteredTodos = [];
                if (expensetype.length > 0) {
                  $('#addrecord').hide();
                  $('#checkrecord').show();
                  expensetype.forEach(function (value, key) {
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

    $scope.deleteExpensetype = function (etm_id) {
      
      $('#confirm-delete').modal('show');
      $scope.etm_id=etm_id;
    }  

    $rootScope.deleteConfirm = function () {
                $('#del').attr('disabled','true');
                $('#del').text("please wait...");
	     $http({
	      method: 'POST',
	      url: $rootScope.baseURL+'/expensetype/delete/'+$scope.etm_id,
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

});