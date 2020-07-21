// import admin
angular.module('admin').controller('dashboardCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {


  
  $('.index').removeClass("active");
  $('#dashboardindex').addClass("active");

  $('#sidenav').show();
  
	$scope.salereport = 0;
  $scope.purchasereport = 0;
  $scope.customerreport = 0;
  $scope.paymentdatereport = 0;
  $scope.dailybalancereport = 0;
  $scope.chequereceivedatereport = 0;
  $scope.chequepaymentdatereport = 0;
  $scope.cashreport = 0;
  $scope.smsbalance = 0;
  $scope.deliveryreport = 0;
  $scope.limit = {};

  const fin = localStorage.getItem("watersupply_admin_financial_year");


  $scope.getPermission = function(){
     if ($scope.user_type == 'emp') 
      {
          window.location.href = '#/404/'; 
      }
  };
  $scope.getPermission();
    
// 	$scope.getDashboardReport = function() {

//       $scope.limit.com_id = localStorage.getItem("com_id");
//       const finyr = fin.split('-');
//       // $scope.limit.from = finyr[0].toString() + '/04/01';
//       // $scope.limit.to = finyr[1].toString() + '/03/31';
//       var d = new Date();
//       var month = d.getMonth()+1;
//       var day = d.getDate();

//       var output = d.getFullYear() + '/' +
//           (month<10 ? '0' : '') + month + '/' +
//           (day<10 ? '0' : '') + day;

// // SET TODAYS DATE TO FROM AND TO .SHOW TODAY SALE ON DASHBOARD (USING OUTPUT)
//       $scope.limit.from = output;
//       $scope.limit.to = output;
//         $http({
//           method: 'POST',
//           url: $rootScope.baseURL+'/dashboard/dashadmin',
//           data: $scope.limit,
//           headers: {'Content-Type': 'application/json',
//                   'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
//         })
//         .success(function(dashboardadmin)
//         {
//             dashboardadmin.forEach(function (value, key) {
//               if(value.type == "salereport")
//               {
//                 $scope.salereport = value.id;
//               }
//               else if(value.type == "purchasereport")
//               {
//                 $scope.purchasereport = value.id;
//               }
//               else if(value.type == "paymentdatereport")
//               {
//                 $scope.paymentdatereport = value.id;
//               }
//               else if(value.type == "cashreport")
//               {
//                 $scope.cashreport = value.id;
//               }
//               else if(value.type == "chequepaymentdatereport")
//               {
//                 $scope.chequepaymentdatereport = value.id;
//               }
//               else if(value.type == "chequereceivedatereport")
//               {
//                 $scope.chequereceivedatereport = value.id;
//               }
//               else if(value.type == "deliveryreport")
//               {
//                 $scope.deliveryreport = value.id;
//               }
//             });
//         })
//         .error(function(data) 
//         {   
//             var dialog = bootbox.dialog({
//             message: '<p class="text-center">Oops, Something Went Wrong!</p>',
//                 closeButton: false
//             });
//             setTimeout(function(){
//                 dialog.modal('hide');
//             }, 1500);
//         });
//     };

});