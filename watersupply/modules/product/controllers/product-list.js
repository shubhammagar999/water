// import admin
angular.module('product').controller('productnewListCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {

  $('.index').removeClass("active");
  $('#menuproductintex').addClass("active");
  $('#productintex').addClass("active");
  
    $('#addrecord').hide();
    $('#checkrecord').hide();
    $('#printTable').hide();
    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.entryLimit = 5;
    $scope.filterUser = 0;
    $scope.filterUserend = 1;
    $scope.numPerPage = 10;
    $scope.obj_Main = [];
    $scope.productListcount = 0;
    $scope.limit = {};
    $scope.loading1 = 0;
    $scope.limit.com_id = 9;


    $scope.limit.user_emp_id = localStorage.getItem("watersupply_user_emp_id");

    $scope.apiURL = $rootScope.baseURL+'/product/product/emp/total';
   $scope.getAll = function () {
        
      if ($('#searchtext').val() == undefined || $('#searchtext').val() == "") {
        $scope.limit.search = "";
        // $scope.limit.com_id = localStorage.getItem("com_id");
      }
      else{
        $scope.limit.search = $scope.searchtext;
        // $scope.limit.com_id = localStorage.getItem("com_id");
      }
        
      $http({
        method: 'POST',
        url: $scope.apiURL,
        data: $scope.limit,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(product)
      {
        product.forEach(function (value, key) {
                  $scope.productListcount = value.total;
              });
              $scope.$watch("currentPage + numPerPage",
                  function () {
                      
                      $scope.resetpagination();
                  });

              
              // $scope.$apply(); 
      })
      .error(function(data) 
      {   
              $scope.loading1 = 1;
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide'); 
            }, 1500);             
      });
    };

    //Pagination Function
    

   //Pagination Function
    $scope.resetpagination = function () {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.filterUserend = begin + 1;
        $scope.filterUser = end;
        if ($scope.filterUser >= $scope.productListcount)
            $scope.filterUser = $scope.productListcount;

              $scope.filteredTodos = [];
              $scope.limit.number = $scope.numPerPage;
              $scope.limit.begin = begin;
              $scope.limit.end = end;
              $http({
                method: 'POST',
                url: $rootScope.baseURL+'/product/product/emp/limit',
                data: $scope.limit,
                headers: {'Content-Type': 'application/json',
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
              })
              .success(function(product)
              {
                $scope.filteredTodos = [];
                if (product.length > 0) {
                  $('#addrecord').hide();
                  $('#checkrecord').show();
                  product.forEach(function (value, key) {

                      $scope.filteredTodos.push(value);
                  });
                }
                else{
                  $('#checkrecord').hide();
                  $('#addrecord').show();
                }
                
                      // $scope.obj_Main = $scope.vendorList;
                      $scope.loading1 = 1;
                      // $scope.$apply(); 
              })
              .error(function(data) 
              {   
                  $scope.loading1 = 1;
                    var dialog = bootbox.dialog({
                    message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                        closeButton: false
                    });
                    setTimeout(function(){
                        dialog.modal('hide'); 
                    }, 3001);             
              });
    };
    //search Data
    $scope.getSearch = function () {

      $scope.getAll();

    };

    $scope.deleteProduct = function (pm_id) {
      
      $('#confirm-delete').modal('show');
      $scope.pm_id=pm_id;
    }  

    $rootScope.deleteConfirm = function () {
                $('#del').attr('disabled','true');
                $('#del').text("please wait...");
       $http({
        method: 'POST',
        url: $rootScope.baseURL+'/product/delete/'+$scope.pm_id,
        headers: {'Content-Type': 'application/json',
                  'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
      })
      .success(function(customerObj)
      {
                $('#del').text("Delete");
                $('#del').removeAttr('disabled');
                $scope.getAll();
                $('#confirm-delete').modal('hide');
            
      })
      .error(function(data) 
      {   
        var dialog = bootbox.dialog({
            message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                closeButton: false
            });
            setTimeout(function(){
                $('#del').text("Delete");
                $('#del').removeAttr('disabled');
                dialog.modal('hide'); 
            }, 1500);            
      });
  };

   $scope.barCode = function(index){
      
      $scope.ppmquantity = $scope.filteredTodos[index].ppm_quantity;
    

      // for(var i = 1; i <= $scope.ppmquantity; i++) {
      //   console.log(i); 
      //   $scope.barWithQty.push($scope.filteredTodos[index]);
         
      // }

      // for(var i = 1; i < $scope.ppmquantity; i++) {
      //   console.log(i); 
      //               $('#barrepete')
      //                 .clone()
      //                 .appendTo("#mobile")
      // }
           

      $scope.ppmdescription = $scope.filteredTodos[index].ppm_description;
      $scope.ppmcolorcode = $scope.filteredTodos[index].ppm_color_code;
      $scope.ctmtype = $scope.filteredTodos[index].ppm_item_name;
      $scope.mrp = $scope.filteredTodos[index].ppm_selling_price;


      JsBarcode("#barcode", $scope.filteredTodos[index].ppm_code, {
        format: "CODE128",
        lineColor: "#000000",
        width: 1.5,
        height: 30,
        margin:2,
        displayValue: true,
        fontSize: 9,
        fontOptions: "bold",
      });

      // for(var i = 0; i < $scope.ppmquantity; i++) {
             
              
      // };
    }


    $scope.printBarCode = function(){
      var printContents = $('#content').html();
        var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no, width=400,height=auto');
            // popupWin.document.open();

            var page = "<html>" +
                    "<head>" +
                        "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
                        "<link rel='stylesheet' href='./././resources/vendor/font-awesome/css/font-awesome.min.css' />" +
                        "<style>" +
                            "@media print {" +
                            "@page{" + 
                            "margin: 0px;"+
                            "size: A4;" +
                            "size: portrait;}" +
                        "}" +
                        "</style>"+
                        "<style>.table.no-border tr td, .table.no-border tr th {border-width: 0;}</style>"+
                    "</head>" +
                    "<body onload='window.print()' style=''>";
                    for (var i = 0; i < $scope.ppmquantity; i++) {
                      page = page + "<div style='float:left;width:50%;padding:10px;height:374px;'>"+
                          "<center>"+
                            "<table class='' style='margin-top:35%;'>"+
                              "<tr>"+
                                  "<td style='text-align:center; font-size:10pt; padding:0px 1px 0px 1px;font-weight: bold;' valign='center'>STATUS FOR MEN</td>"+
                                  "<td  rowspan='2' style='text-align:center;  padding:0px 1px 0px 1px;' valign='center'>"+$('#content').html()+"</td>"+
                              "</tr>"+
                              "<tr>"+
                                "<td style='text-align:center; font-size:10pt;  padding:0px 1px 0px 1px;font-weight: bold;' valign='center'><i class='fa fa-inr'></i> "+$scope.mrp+"/- </td>"+
                              "</tr>"+
                            "</table>"+
                            "</center>"+
                      "</div>";
                    }
                      
                      // ""+$('#content').html()+"" +
                        
                    page=page+"</body>" +
                    "</html>";

                    popupWin.document.write(page);

            popupWin.document.close();
            // popupWin.close();
    };

});