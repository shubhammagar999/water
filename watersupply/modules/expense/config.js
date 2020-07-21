'use strict';
/* Account Module */
angular.module('expense', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/expense',
                {
                    templateUrl: 'modules/expense/partials/expense-list.html',
                    controller: 'expenseListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/expense/controllers/expense-list.js']
                            }]);
                        }]
                    }
                })

            .when('/expense/add',
                {
                    templateUrl: 'modules/expense/partials/expense-add.html',
                    controller: 'expenseAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/expense/controllers/expense-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/expense/edit/:expenseId',
                {
                    templateUrl: 'modules/expense/partials/expense-edit.html',
                    controller: 'expenseEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/expense/controllers/expense-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);