'use strict';
/* Account Module */
angular.module('company', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/dome',
                {
                    templateUrl: 'modules/company/partials/company-list.html',
                    controller: 'companyListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/company/controllers/company-list.js']
                            }]);
                        }]
                    }
                })

            .when('/company/add',
                {
                    templateUrl: 'modules/company/partials/company-add.html',
                    controller: 'companyAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/company/controllers/company-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/company/edit/:companyId',
                {
                    templateUrl: 'modules/company/partials/company-edit.html',
                    controller: 'companyEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/company/controllers/company-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);