'use strict';
/* Account Module */
angular.module('salereturn', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/salereturn',
                {
                    templateUrl: 'modules/salereturn/partials/salereturn-list.html',
                    controller: 'salereturnListCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/salereturn/controllers/salereturn-list.js']
                            }]);
                        }]
                    }
                })

            .when('/salereturn/add',
                {
                    templateUrl: 'modules/salereturn/partials/salereturn-add.html',
                    controller: 'salereturnAddCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/salereturn/controllers/salereturn-add.js']
                            }]);
                        }]
                    }
                })
                
            .when('/salereturn/edit/:salereturnId',
                {
                    templateUrl: 'modules/salereturn/partials/salereturn-edit.html',
                    controller: 'salereturnEditCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/salereturn/controllers/salereturn-edit.js']
                            }]);
                        }]
                    }
                });
                
        }]);