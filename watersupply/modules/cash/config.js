'use strict';
/* Account Module */
angular.module('cash', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/cash',
                {
                    templateUrl: 'modules/cash/partials/cash-list.html',
                    controller: 'cashListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/cash/controllers/cash-list.js']
                            }]);
                        }]
                    }
                })

            .when('/cash/add',
                {
                    templateUrl: 'modules/cash/partials/cash-add.html',
                    controller: 'cashAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/cash/controllers/cash-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/cash/edit/:cashId',
                {
                    templateUrl: 'modules/cash/partials/cash-edit.html',
                    controller: 'cashEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/cash/controllers/cash-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);