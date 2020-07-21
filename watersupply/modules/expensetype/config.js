'use strict';
/* Account Module */
angular.module('expensetype', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/expensetype',
                {
                    templateUrl: 'modules/expensetype/partials/expensetype-list.html',
                    controller: 'expensetypeListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/expensetype/controllers/expensetype-list.js']
                            }]);
                        }]
                    }
                })

            .when('/expensetype/add',
                {
                    templateUrl: 'modules/expensetype/partials/expensetype-add.html',
                    controller: 'expensetypeAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/expensetype/controllers/expensetype-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/expensetype/edit/:expensetypeId',
                {
                    templateUrl: 'modules/expensetype/partials/expensetype-edit.html',
                    controller: 'expensetypeEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/expensetype/controllers/expensetype-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);