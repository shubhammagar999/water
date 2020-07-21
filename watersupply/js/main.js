angular.module('3ctledger',
    [
        // External Dependencies
        'ngRoute',
        'oc.lazyLoad',
        'ui.bootstrap',
        'angularFileUpload',
        'ngIdle',
        'cfp.hotkeys',
        //'Modular Dependencies',
        'admin',
        'common',
        'company',
        'vendor',
        'customer',
        // 'workshop',
        // 'workshopsale',
        'employee',
        'unit',
        'product',
        // 'purchase',
        // 'purchasereturn',
        'expense',
        'purexpense',
        'expensetype',
        'dailyexpense',
        'sale',
        // 'bank',
        'salereturn',
        'cash',
        // 'bankwithdraw',
        // 'cashtransfer',
        'report',

]).config(function($routeProvider, IdleProvider, KeepaliveProvider, $controllerProvider) {
  // configure Idle settings
  IdleProvider.idle(3600); // in seconds
  IdleProvider.timeout(5); // in seconds
  KeepaliveProvider.interval(2); // in seconds
  $controllerProvider.allowGlobals();
  $routeProvider
})
.run(function(Idle){
  // start watching when the app runs. also starts the Keepalive service by default.
  Idle.watch();
});