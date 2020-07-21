'use strict';
/* Account Module */
angular.module('unit', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/unit',
                {
                    templateUrl: 'modules/unit/partials/unit-list.html',
                    controller: 'unitListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/unit/controllers/unit-list.js']
                            }]);
                        }]
                    }
                })

            .when('/unit/add',
                {
                    templateUrl: 'modules/unit/partials/unit-add.html',
                    controller: 'unitAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/unit/controllers/unit-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/unit/edit/:unitId',
                {
                    templateUrl: 'modules/unit/partials/unit-edit.html',
                    controller: 'unitEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/unit/controllers/unit-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);