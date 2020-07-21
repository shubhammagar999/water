// import admin
angular.module('company').controller('companyAddCtrl', function ($rootScope, $http, $scope, $location, $routeParams, $route, $filter) {


  $('#sidenav').hide();
    $scope.company = {};
    $scope.company.com_gst = "N/A";
    $scope.company.com_address = "N/A";
    // $scope.company.com_state = "N/A";
    // $scope.company.com_city = "N/A";
    $scope.company.com_pin = "N/A";
    $scope.company.com_contact = "N/A";
    $scope.company.com_email = "N/A";
    $scope.company.com_is_composition = 0;
    $("#com_name").focus();
    $scope.displayImage = "resources/images/default-image.png";

    function readURL(input) {
      if (input.files && input.files[0]) {
            var reader = new FileReader();
                $scope.company.file = input.files[0];
            reader.onload = function (e) {
                if(input.files[0].size > 200000)
              {
                var dialog = bootbox.dialog({
                      message: '<p class="text-center">File Size Too Big To Upload!!!</p>',
                      closeButton: false
                  });
                  dialog.find('.modal-body').addClass("btn-danger");
                  setTimeout(function(){
                      dialog.modal('hide'); 
                      $('#blah').attr('src', "resources/image/default-image.png");
                      $('#company_image').val("");
                  }, 1500);
              }
              else
              { 
                
                $('#blah').attr('src', e.target.result);
              }
            }
            reader.readAsDataURL(input.files[0]);

        }
    }
    $("#company_image").change(function(){
        readURL(this);
    });

    $scope.getCities=function(state){
      $rootScope.stateInfo.forEach(function (value, key) {
        if (value.state == state)
        {
          $scope.city = value.cities;
        }
      });
    }

    $scope.capitalize = function () {
      $scope.company.com_gst = $filter("uppercase")($scope.company.com_gst);
    }

  $scope.checkIsComposition = function(){

    if($scope.company.is_composition)
    {
      $scope.company.com_is_composition = 1;
    }
    else{
      $scope.company.com_is_composition = 0;
    }
  }

	$scope.apiURL = $rootScope.baseURL+'/company/add';
    $scope.addCompany = function () {
		var nameRegex = /^\d+$/;
  		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    
      if($('#com_name').val() == undefined || $('#com_name').val() == ""){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter company name.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_name").focus();
            }, 1500);
	    }
	    else if($('#com_gst').val() == undefined || $('#com_gst').val() == ""){
	    	var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter gst no</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_gst").focus();
            }, 1500);
	    }
      else if($('#com_address').val() == undefined || $('#com_address').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter address</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_address").focus();
            }, 1500);
      }
      else if($('#com_state').val() == undefined || $('#com_state').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter state</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_state").focus();
            }, 1500);
      }
      else if($('#com_city').val() == undefined || $('#com_city').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter city</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_city").focus();
            }, 1500);
      }
      else if($('#com_pin').val() == undefined || $('#com_pin').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter pin code</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_pin").focus();
            }, 1500);
      }
      else if($('#com_contact').val() == undefined || $('#com_contact').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter contact</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_contact").focus();
            }, 1500);
      }
      else if($('#com_email').val() == undefined || $('#com_email').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter email id</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_email").focus();
            }, 1500);
      }
      else if($('#com_note').val() == undefined || $('#com_note').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter note</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_note").focus();
            }, 1500);
      }
      else if($('#com_comment').val() == undefined || $('#com_comment').val() == ""){
        var dialog = bootbox.dialog({
            message: '<p class="text-center">please enter comment</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $("#com_comment").focus();
            }, 1500);
      }
      else if($('#company_image').val() != "" && ($('#company_image').data('max-size') < $('#company_image').get(0).files[0].size )){
            var dialog = bootbox.dialog({
                message: '<p class="text-center">Please Select Image size less than 200KB.</p>',
                closeButton: false
            });
            dialog.find('.modal-body').addClass("btn-danger");
            setTimeout(function(){
                dialog.modal('hide'); 
                $('#company_image').val("");
                $scope.company_image = '';
                $('#blah').attr('src', "resources/img/default-image.png");
            }, 1500);
      }
	    else{

        $('#btnsave').attr('disabled','true');
        $('#btnsave').text("please wait...");

        var fd = new FormData();
                fd.append('com_name', $scope.company.com_name);
                fd.append('com_gst', $scope.company.com_gst);
                fd.append('com_address',$scope.company.com_address);
                fd.append('com_state',$scope.company.com_state);
                fd.append('com_city',$scope.company.com_city);
                fd.append('com_pin',$scope.company.com_pin);
                fd.append('com_contact',$scope.company.com_contact);
                fd.append('com_email',$scope.company.com_email);
                fd.append('com_note',$scope.company.com_note);
                fd.append('com_comment',$scope.company.com_comment);
                fd.append('com_is_composition',$scope.company.com_is_composition);
                fd.append('imgUploader', $scope.company.file);

        $http({
            method: 'POST',
            url: $rootScope.baseURL+'/company/checkname',
            data: $scope.company,
            headers: {'Content-Type': 'application/json',
                    'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
          })
          .success(function(login)
          {

            if(login.length > 0)
            {
              var dialog = bootbox.dialog({
              message: '<p class="text-center">Company Already exists.</p>',
                  closeButton: false
              });
              setTimeout(function(){
              $('#btnsave').text("SAVE");
              $('#btnsave').removeAttr('disabled');
                  dialog.modal('hide'); 
                  $("#com_name").focus();
              }, 1500);  
            }
            else{

                $http({
                  method: 'POST',
                  url: $scope.apiURL,
                  data: fd,
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined,
                          'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
                })
                .success(function(login)
                {
                    $('#btnsave').text("SAVE");
                    $('#btnsave').removeAttr('disabled');
                   window.location.href = '#/';  
                })
                .error(function(data) 
                {   
                  var dialog = bootbox.dialog({
                    message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                        closeButton: false
                    });
                    setTimeout(function(){
                    $('#btnsave').text("SAVE");
                    $('#btnsave').removeAttr('disabled');
                        dialog.modal('hide'); 
                    }, 1500);            
                });
                }
              })
              .error(function(data) 
              {   
                var dialog = bootbox.dialog({
                  message: '<p class="text-center">Oops, Something Went Wrong! Please Refresh the Page.</p>',
                      closeButton: false
                  });
                  setTimeout(function(){
                  $('#btnsave').text("SAVE");
                  $('#btnsave').removeAttr('disabled');
                      dialog.modal('hide'); 
                  }, 1500);            
              });
		}
	};

});