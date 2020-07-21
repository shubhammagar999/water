'use strict';
/* Account Module */
angular.module('sale', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/sale/list',
                {
                    templateUrl: 'modules/sale/partials/sale-list.html',
                    controller: 'saleListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/sale/controllers/sale-list.js']
                            }]);
                        }]
                    }
                })

            .when('/sale/pending-list',
                {
                    templateUrl: 'modules/sale/partials/sale-list-pending.html',
                    controller: 'salePendingListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/sale/controllers/sale-list-pending.js']
                            }]);
                        }]
                    }
                })

            .when('/sale/add',
                {
                    templateUrl: 'modules/sale/partials/sale-add.html',
                    controller: 'saleAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/sale/controllers/sale-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/sale/edit/:saleId',
                {
                    templateUrl: 'modules/sale/partials/sale-edit.html',
                    controller: 'saleEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/sale/controllers/sale-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);