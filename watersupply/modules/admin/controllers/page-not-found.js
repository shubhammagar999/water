// import admin
angular.module('admin').controller('pagenotfoundCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter, hotkeys) {


  $('.index').removeClass("active");
  $('#menucustomerindex').addClass("active");
  $('#newcustomerindex').addClass("active");

  $scope.developer = {};

  $scope.limit ={};

  const fin = localStorage.getItem("watersupply_admin_financial_year");
    // $scope.product.user_emp_id = localStorage.getItem("watersupply_user_emp_id");


});