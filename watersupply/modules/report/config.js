'use strict';

/* Account Module */
angular.module('report', [])
    .config(['$routeProvider', function config($routeProvider) {
        var resolve = {
            data: ["$q", "$location", function ($q, $location) {
            
            }]

        };

        $routeProvider
            .when('/salereport',
                {
                    templateUrl: 'modules/report/partials/sale-report.html',
                    controller: 'saleReportCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/report/controllers/sale-report.js']
                            }]);
                        }]
                    }
                })
            // .when('/purchasereport',
            //     {
            //         templateUrl: 'modules/report/partials/purchase-report.html',
            //         controller: 'purchaseReportCtrl',
            //         resolve: {
            //             lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
            //                 return $ocLazyLoad.load([{
            //                     name: 'myApp',
            //                     files: ['modules/report/controllers/purchase-report.js']
            //                 }]);
            //             }]
            //         }
            //     })
            // .when('/paymentdatereport',
            //     {
            //         templateUrl: 'modules/report/partials/paymentdate-report.html',
            //         controller: 'paymentdateReportCtrl',
            //         resolve: {
            //             lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
            //                 return $ocLazyLoad.load([{
            //                     name: 'myApp',
            //                     files: ['modules/report/controllers/paymentdate-report.js']
            //                 }]);
            //             }]
            //         }
            //     })
            // .when('/chequereceivedate',
            //     {
            //         templateUrl: 'modules/report/partials/chequereceivedate-report.html',
            //         controller: 'chequereceivedateReportCtrl',
            //         resolve: {
            //             lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
            //                 return $ocLazyLoad.load([{
            //                     name: 'myApp',
            //                     files: ['modules/report/controllers/chequereceivedate-report.js']
            //                 }]);
            //             }]
            //         }
            //     })
            // .when('/chequepaymentdate',
            //     {
            //         templateUrl: 'modules/report/partials/chequepaymentdate-report.html',
            //         controller: 'chequepaymentdateReportCtrl',
            //         resolve: {
            //             lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
            //                 return $ocLazyLoad.load([{
            //                     name: 'myApp',
            //                     files: ['modules/report/controllers/chequepaymentdate-report.js']
            //                 }]);
            //             }]
            //         }
            //     })
                // .when('/gstreport',
                //     {
                //         templateUrl: 'modules/report/partials/gst-report.html',
                //         controller: 'gstReportCtrl',
                //         resolve: {
                //             lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                //                 return $ocLazyLoad.load([{
                //                     name: 'myApp',
                //                     files: ['modules/report/controllers/gst-report.js']
                //                 }]);
                //             }]
                //         }
                //     })
            .when('/vendorreport',
                {
                    templateUrl: 'modules/report/partials/vendor-report.html',
                    controller: 'vendorReportCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/report/controllers/vendor-report.js']
                            }]);
                        }]
                    }
                })
            .when('/customerreport',
                {
                    templateUrl: 'modules/report/partials/customer-report.html',
                    controller: 'customerReportCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/report/controllers/customer-report.js']
                            }]);
                        }]
                    }
                })
            .when('/productreport',
                {
                    templateUrl: 'modules/report/partials/product-report.html',
                    controller: 'productReportCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/report/controllers/product-report.js']
                            }]);
                        }]
                    }
                })
            .when('/bankreport',
                {
                    templateUrl: 'modules/report/partials/bank-report.html',
                    controller: 'bankReportCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/report/controllers/bank-report.js']
                            }]);
                        }]
                    }
                })
            .when('/paymentmodereport',
                {
                    templateUrl: 'modules/report/partials/payment-mode.html',
                    controller: 'payModeCtrl',
                    resolve: {
                        lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
                            return $ocLazyLoad.load([{
                                name: 'myApp',
                                files: ['modules/report/controllers/payment-mode.js']
                            }]);
                        }]
                    }
                })
            // .when('/deliveryreport',
            //     {
            //         templateUrl: 'modules/report/partials/delivery-report.html',
            //         controller: 'deliveryrptCtrl',
            //         resolve: {
            //             lazy: ['$ocLazyLoad',"$q", "$location","$rootScope", function ($ocLazyLoad, $q, $location, $rootScope) {
            //                 return $ocLazyLoad.load([{
            //                     name: 'myApp',
            //                     files: ['modules/report/controllers/delivery-report.js']
            //                 }]);
            //             }]
            //         }
            //     })
            .when('/balancesheetreport',
                {
                    templateUrl: 'modules/report/partials/balancesheet-report.html',
                    controller: 'balancesheetReportCtrl',
                    resolve: resolve
                })
    }]);