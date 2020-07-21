'use strict';
/* Account Module */
angular.module('customer', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/customer',
                {
                    templateUrl: 'modules/customer/partials/customer-list.html',
                    controller: 'customerListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/customer/controllers/customer-list.js']
                            }]);
                        }]
                    }
                })

            .when('/customer/add',
                {
                    templateUrl: 'modules/customer/partials/customer-add.html',
                    controller: 'customerAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/customer/controllers/customer-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/customer/edit/:customerId',
                {
                    templateUrl: 'modules/customer/partials/customer-edit.html',
                    controller: 'customerEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/customer/controllers/customer-edit.js']
                            }]);
                        }]
                    }
                })

            .when('/customer/sms',
                {
                    templateUrl: 'modules/customer/partials/sms.html',
                    controller: 'promoSMSCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/customer/controllers/sms.js']
                            }]);
                        }]
                    }
                });
                
        }]);