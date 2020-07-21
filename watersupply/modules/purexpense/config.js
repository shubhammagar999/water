'use strict';
/* Account Module */
angular.module('purexpense', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/purexpense',
                {
                    templateUrl: 'modules/purexpense/partials/purexpense-list.html',
                    controller: 'purexpenseListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/purexpense/controllers/purexpense-list.js']
                            }]);
                        }]
                    }
                })

            .when('/purexpense/add',
                {
                    templateUrl: 'modules/purexpense/partials/purexpense-add.html',
                    controller: 'purexpenseAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/purexpense/controllers/purexpense-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/purexpense/edit/:expenseId',
                {
                    templateUrl: 'modules/purexpense/partials/purexpense-edit.html',
                    controller: 'purexpenseEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/purexpense/controllers/purexpense-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);