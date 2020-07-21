'use strict';
/* Account Module */
angular.module('dailyexpense', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/dailyexpense',
                {
                    templateUrl: 'modules/dailyexpense/partials/dailyexpense-list.html',
                    controller: 'dailyexpenseListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/dailyexpense/controllers/dailyexpense-list.js']
                            }]);
                        }]
                    }
                })

            .when('/dailyexpense/add',
                {
                    templateUrl: 'modules/dailyexpense/partials/dailyexpense-add.html',
                    controller: 'dailyexpenseAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/dailyexpense/controllers/dailyexpense-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/dailyexpense/edit/:dailyexpenseId',
                {
                    templateUrl: 'modules/dailyexpense/partials/dailyexpense-edit.html',
                    controller: 'dailyexpenseEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/dailyexpense/controllers/dailyexpense-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);