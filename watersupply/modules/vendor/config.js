'use strict';
/* Account Module */
angular.module('vendor', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/vendor',
                {
                    templateUrl: 'modules/vendor/partials/vendor-list.html',
                    controller: 'vendorListCtrl',
                    // hotkeys: [
                    //   ['p', 'Sort by price', 'sort(price)']
                    // ],
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/vendor/controllers/vendor-list.js']
                            }]);
                        }]
                    }
                })

            .when('/vendor/add',
                {
                    templateUrl: 'modules/vendor/partials/vendor-add.html',
                    controller: 'vendorAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/vendor/controllers/vendor-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/vendor/edit/:vendorId',
                {
                    templateUrl: 'modules/vendor/partials/vendor-edit.html',
                    controller: 'vendorEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/vendor/controllers/vendor-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);