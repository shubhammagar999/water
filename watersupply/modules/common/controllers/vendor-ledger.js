// import admin
angular.module('common').controller('vendorLedgerCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {

$scope.printLedger = function(){
      var popupWin = window.open('', 'winname','directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no');
          
        var printchar = "<html>" +
         " <head>" +
            "<link rel='stylesheet' href='./././resources/vendor/bootstrap/css/bootstrap.min.css' />" +
            "<style>.action{display:none;} .print-hide{display:none;}</style>"+
            "   <style type='text/css' media='print'>" +
            "  @page " +
             " {" +
              "    size:  A4 portrait;" +  /* auto is the initial value */
               "   margin: 0; " + /* this affects the margin in the printer settings */
              "}" +

              "html" +
              "{" +
               "   background-color: #FFFFFF;" + 
                "  margin: 0px; " + /* this affects the margin on the html before sending to printer */
              "}" +

              "body" +
              "{" +
                "font-size:11pt;"+
                "font-family:'Open Sans', sans-serif;"+
               // "   border: solid 1px black ;" +
                "  margin: 5mm 5mm 5mm 5mm;" + /* margin you want for the content */
              "}" +
              "</style>" +
          "</head>" +
          "<body onload='window.print()'>" +
            "<center style='font-size:11pt;'>Dealer Ledger</center>"+
           "<table width='100%' height='95%'>" +
            "<thead>"+
              "<tr>"+
                "<td style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                      
                      "<td colspan='2' style='text-align:center; padding-bottom: 20; border-style: none none solid none; border-width:1px; font-size:11pt;' valign='center' width='100%'>" +
                          "<h3 style='font-size:14pt;margin-bottom: 0;'>"+localStorage.getItem("com_name")+"</h3><br>" +
                          "Address : "+localStorage.getItem("com_address")+" "+localStorage.getItem("com_state")+" "+localStorage.getItem("com_city")+" "+localStorage.getItem("com_pin")+"<br>" +
                          "Phone : "+localStorage.getItem("com_contact")+"<br>"+
                          "E-Mail : "+localStorage.getItem("com_email")+"<br>"+
                          "GST No.: "+localStorage.getItem("com_gst")+"<br>"+
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Dealer Name : <strong>"+$scope.venname+"</strong></td>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid none; border-width:1px;'>Address : <strong>"+$scope.venadd+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid solid none; border-width:1px;'>Contact Number : <strong>"+$scope.venno+"</strong></td>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none none solid none; border-width:1px;'>GST No. : <strong>"+$scope.vengstno+"</strong></td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: none solid none none; border-width:1px;'>Debit : <strong>"+$scope.vendebit+"</strong></td>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt;'>Credit : <strong>"+$scope.venbal+"</strong></td>" +
                    "</tr>" ;
                    if($('#user-datepicker-from').val() != "" && $('#user-datepicker-to').val() != "") 
                    {
                    printchar = printchar + "<tr>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid solid none none; border-width:1px;'>From Date : <strong>"+$filter('date')($scope.fDate, "dd-MM-yyyy")+"</strong></td>" +
                      "<td width='50%' style='padding:4px 8px 4px 8px; font-size:11pt; border-style: solid none none none; border-width:1px;'>To Date : <strong>"+$filter('date')($scope.tDate, "dd-MM-yyyy")+"</strong></td>" +
                    "</tr>" ;
                    }
                  printchar = printchar + "</table>"+
                "</td>"+
              "</tr>"+
            "</thead>"+
            "<tbody>"+
              "<tr>"+
                "<td valign='top' style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>" +
                    "<thead>"+
                      "<tr>"+      
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Type</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Invoice</th> " +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Date</th>"+
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Debit</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Credit</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>DR/CR</th>" +
                        "<th style='padding:4px 8px 4px 8px; font-size:11pt;'>Balance</th>" +
                      "</tr>"+
                    "</thead>"+
                    " "+$('#content').html()+" " +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tbody>"+
            "<tfoot>"+
              "<tr>"+
                "<td style=' border-style: solid; border-width:1px;'>"+
                  "<table width='100%'>"+
                    "<tr>" +
                        "<td valign='bottom' style='text-align:center; padding:4px 8px 4px 8px; font-size:11pt;'>THANK YOU</td>" +
                    "</tr>" +
                  "</table>"+
                "</td>"+
              "</tr>"+
            "</tfoot>"+
          "</table>"+
          "</body>" +
        "</html>";
        popupWin.document.write(printchar);
        popupWin.document.close();
    };

});