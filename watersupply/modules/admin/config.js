'use strict';
/* Account Module */
angular.module('admin', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/',
                {
                    templateUrl: 'modules/admin/partials/dashboard.html',
                    controller: 'dashboardCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/admin/controllers/dashboard.js']
                            }]);
                        }]
                    }
                })

            .when('/changepass',
                {
                    templateUrl: 'modules/admin/partials/change-password.html',
                    controller: 'changePasswordCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/admin/controllers/change-password.js']
                            }]);
                        }]
                    }
                })

            .when('/developer',
                {
                    templateUrl: 'modules/admin/partials/developer.html',
                    controller: 'developerCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/admin/controllers/developer.js']
                            }]);
                        }]
                    }
                })

            .when('/404',
                {
                    templateUrl: 'modules/admin/partials/page-not-found.html',
                    controller: 'pagenotfoundCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/admin/controllers/page-not-found.js']
                            }]);
                        }]
                    }
                });
                
        }]);