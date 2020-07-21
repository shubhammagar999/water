'use strict';
/* Account Module */
angular.module('common', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            
            .when('/commondelete',
                {
                    templateUrl: 'modules/common/partials/common-delete.html',
                    // controller: 'commmonDeleteCtrl',
                    // resolve: {
                    //     lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                    //         return $ocLazyLoad.load([{
                    //             name: 'myApp',
                    //             files: ['modules/common/controllers/common-delete.js']
                    //         }]);
                    //     }]
                    // }
                });
            // .when('/vendorledger',
            //     {
            //         templateUrl: 'modules/common/partials/vendor-ledger.html',
            //         controller: 'vendorLedgerCtrl',
            //         resolve: {
            //             lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
            //                 return $ocLazyLoad.load([{
            //                     name: 'myApp',
            //                     files: ['modules/common/controllers/vendor-ledger.js']
            //                 }]);
            //             }]
            //         }
            //     });
                
        }]);