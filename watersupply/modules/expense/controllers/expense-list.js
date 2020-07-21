// import admin
angular.module('expense').controller('expenseListCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {

  $('.index').removeClass("active");
  $('#menucustomerindex').addClass("active");
  $('#expenseindex').addClass("active");
  
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
    $scope.expenseListcount = [];
    $scope.limit = {};
    $scope.loading1 = 0;

    const fin = localStorage.getItem("watersupply_admin_financial_year");
    
$scope.apiURL = $rootScope.baseURL+'/expense/expense/total';
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
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(expense)
	    {
	      expense.forEach(function (value, key) {
                  $scope.expenseListcount = value.total;
              });

              $scope.$watch("currentPage + numPerPage",
                  function () {
                      
                      $scope.resetpagination();
                  });
              // $scope.obj_Main = $scope.expenseList;
              // $scope.loading1 = 1;
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
        if ($scope.filterUser >= $scope.expenseListcount)
            $scope.filterUser = $scope.expenseListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/expense/expense/limit',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(expense)
              {
                $scope.filteredTodos = [];
                if (expense.length > 0) {
                  $('#addrecord').hide();
                  $('#checkrecord').show();
                  expense.forEach(function (value, key) {
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

    $scope.deleteExpense = function (em_id) {
      
      $('#confirm-delete').modal('show');
      $scope.em_id=em_id;
    }  

    $rootScope.deleteConfirm = function () {
	     $http({
	      method: 'POST',
	      url: $rootScope.baseURL+'/expense/delete/'+$scope.em_id.em_id,
        data: $scope.em_id,
	      headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
	    })
	    .success(function(customerObj)
	    {
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
                dialog.modal('hide'); 
            }, 1500);            
	    });
    };

});