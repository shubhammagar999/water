/*
 *  Controller To Set Global Definitions
 */
function GlobalCtrl($rootScope, $http, $scope, $timeout) {

    $rootScope.tokken=localStorage.getItem("watersupply_admin_access_token");
    $rootScope.userid=localStorage.getItem("watersupply_admin_username");
    $rootScope.firstname=localStorage.getItem("watersupply_admin_firstname");
    $rootScope.iconimage=localStorage.getItem("watersupply_admin_iconimage");

    // $rootScope.com_file=localStorage.getItem("com_file");
    // $rootScope.companyname = localStorage.getItem('com_name');
    // console.log(localStorage.getItem('com_name'));
    // 
    $scope.user_type = localStorage.getItem("watersupply_user_type");

    $rootScope.financialyear = localStorage.getItem("watersupply_admin_financial_year");

    $rootScope.baseURL = 'http://localhost:3005';
 // $rootScope.baseURL = 'http://10.1.0.71:3005';
 
    // $rootScope.baseURL = 'http://pos.restromaticz.com:3005';
    
    // $rootScope.baseURL = 'http://mns.3commastechnologies.com:3003';
    // $rootScope.setURL = function () {
    //     var currentUser = Parse.User.current();
    //     if (currentUser) {
            
    //     } else {

    //         window.location = "login.html";
    //     }
    // };

    if(localStorage.getItem("watersupply_admin_access_token") === null)
      {
          window.location = 'login.html';
      }

    $('.navbar-collapse').click(function(){
        $(".navbar-collapse").collapse('hide');
    });  
    

    // $('.navhide').click(function(){
    //     $(".navbar-collapse").collapse('hide');
    // });

    // $(".navehidey").on('click', function(event){
    //   console.log('HHHHHiiiiiiDDDDDDeeeeeee');
    //     $(".navbar-collapse").collapse('hide');
    // });

    // $scope.navehidey = function(){
    //   $(".navbar-collapse").collapse('hide');
    // };

    // $rootScope.back = function () {
    //     window.history.back();
    // };

    $scope.companyId = 9;
    $scope.callingCom = function(){
      $http({
            method: 'POST',
        url: $rootScope.baseURL+'/company/'+$scope.companyId,
            // data: $scope.limit,
            headers: {'Content-Type': 'application/json',
                      'Authorization' :'Bearer '+localStorage.getItem("watersupply_admin_access_token")}
          })
          .success(function(company)
          {
            $scope.filteredTodos = [];
            company.forEach(function (value, key) {
                  $scope.filteredTodos.push(value);
              });
              localStorage.setItem('com_id', $scope.filteredTodos[0].com_id);
              localStorage.setItem('com_name', $scope.filteredTodos[0].com_name);
              localStorage.setItem('com_address', $scope.filteredTodos[0].com_address);
              localStorage.setItem('com_contact', $scope.filteredTodos[0].com_contact);
              localStorage.setItem('com_email', $scope.filteredTodos[0].com_email);
              localStorage.setItem('com_note', $scope.filteredTodos[0].com_note);
              localStorage.setItem('com_comment', $scope.filteredTodos[0].com_comment);

              localStorage.setItem('com_gst', $scope.filteredTodos[0].com_gst);
              localStorage.setItem('com_city', $scope.filteredTodos[0].com_city);
              localStorage.setItem('com_state', $scope.filteredTodos[0].com_state);
              localStorage.setItem('com_status', $scope.filteredTodos[0].com_status);
              localStorage.setItem('com_pin', $scope.filteredTodos[0].com_pin);
              localStorage.setItem('com_is_composition', $scope.filteredTodos[0].com_is_composition);
              localStorage.setItem('com_created_at', $scope.filteredTodos[0].com_created_at);
              localStorage.setItem('com_updated_at', $scope.filteredTodos[0].com_updated_at);

              localStorage.setItem('com_file', $scope.filteredTodos[0].com_file);
               
                   $rootScope.com_file=localStorage.getItem("com_file");
                    $rootScope.companyname = localStorage.getItem('com_name');
                    // console.log(localStorage.getItem('com_name'));
          })
    }
    $scope.callingCom();
    $rootScope.logOut = function(){

        $http({
          method: 'POST',
          url: $rootScope.baseURL+'/login/isoffline',
          data: 'username='+$rootScope.userid,
          headers: {'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization' :'Bearer '+$rootScope.tokken}
        })
        .success(function(deliverycount)
        {   
            localStorage.removeItem('watersupply_admin_username');
            localStorage.removeItem('watersupply_admin_firstname');
            localStorage.removeItem('watersupply_admin_iconimage');
            localStorage.removeItem('watersupply_admin_access_token');
            localStorage.removeItem('watersupply_admin_expires_in');
            localStorage.removeItem('watersupply_admin_refresh_token');
            localStorage.removeItem('watersupply_admin_token_type');
            localStorage.clear();
            window.location = 'login.html'; 
        })
        .error(function(data) 
        {   
            //console.log("url"+$scope.apiURL);
            /*console.log("Oops, Something Went Wrong!");*/
            var dialog = bootbox.dialog({
            message: data,
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');
            }, 3001);
        });
      };

      $rootScope.backup = function(){

        // $http({
        //   method: 'POST',
        //   url: $rootScope.baseURL+'/backup',
        //   // data: 'username='+$rootScope.userid,
        //   headers: {'Content-Type': 'application/json',
        //   'Authorization' :'Bearer '+$rootScope.tokken}
        // })
        // .success(function(deliverycount)
        // {   
        //     var dialog = bootbox.dialog({
        //     message: '<p class="text-center">Successfully Backup!</p>',
        //         closeButton: false
        //     });
        //     setTimeout(function(){
        //         dialog.modal('hide');
        //     }, 3001);
        // })
        // .error(function(data) 
        // {   
        //     //console.log("url"+$scope.apiURL);
        //     /*console.log("Oops, Something Went Wrong!");*/
        //     var dialog = bootbox.dialog({
        //     message: '<p class="text-center">Oops, Something Went Wrong!</p>',
        //         closeButton: false
        //     });
        //     setTimeout(function(){
        //         dialog.modal('hide');
        //     }, 3001);
        // });
      };

      var d = new Date();
      $rootScope.fromyyyy = [];
      $rootScope.toyyyy = [];

      for (var i = d.getFullYear(); i > d.getFullYear()-5; i--) {
        $rootScope.fromyyyy.push(i);
      }

      for (var i = d.getFullYear()+1; i > d.getFullYear()-4; i--) {
        $rootScope.toyyyy.push(i);
      }

      $rootScope.saveYear = function(year,year1){
        console.log(year);
          if(year == undefined || year == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Select from year</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');
            }, 1000);
          }
          else if(year1 == undefined || year1 == ""){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Select to year</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');
            }, 1000);
          }
          else if(year1 < year ){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Year to should be greater than year from</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');
            }, 1000);
          }
          else if(year1 - year != 1){
            var dialog = bootbox.dialog({
            message: '<p class="text-center">Select with one year period</p>',
                closeButton: false
            });
            setTimeout(function(){
                dialog.modal('hide');
            }, 1000);
          }
          else
          {
            localStorage.setItem('watersupply_admin_financial_year', year + '-' + year1);
            $rootScope.financialyear = localStorage.getItem("watersupply_admin_financial_year");
            $('#change-period').modal('hide');
            location.reload();
          }
      };

    // $scope.Log_Out = function () {

    //     localStorage.clear();
    //     Parse.User.logOut();
    //     window.location = "login.html";
    // };

    //check user is idle
    // $rootScope.idle = 800; //800 expire time 24 hrs
    // $rootScope.timeout = 60; //60 warning time 1 minute

  $rootScope.$on('IdleStart', function() {
        // the user appears to have gone idle
        // $rootScope.oldTokken=$rootScope.tokken;
        //  console.log("Before"+$rootScope.oldTokken);
        console.log("start");
      });

  $rootScope.$on('IdleWarn', function(e, countdown) {
        // follows after the IdleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling Idle.watch()
      });

  $rootScope.$on('IdleTimeout', function() {    
        // the user has timed out (meaning idleDuration + timeout has passed without any activity)
        // this is where you'd log them

        $rootScope.logOut(); 
      });

  $rootScope.$on('IdleEnd', function() {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        console.log("end")
      });

    $rootScope.stateList = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal","N/A"];

    $rootScope.stateInfo = [
      {
      "state":"Andhra Pradesh",
      "cities":["Adoni","Amaravati","Anantapur","Chandragiri","Chittoor","Dowlaiswaram","Eluru","Guntur","Kadapa","Kakinada","Kurnool","Machilipatnam","Nagarjunakoṇḍa","Rajahmundry","Srikakulam","Tirupati","Vijayawada","Visakhapatnam","Vizianagaram","Yemmiganur","N/A"]
    },
    {
      "state":"Arunachal Pradesh",
      "cities":["Itanagar","N/A"]
    },
    {
      "state":"Assam",
      "cities":["Dhuburi","Dibrugarh","Dispur","Guwahati","Jorhat","Nagaon","Sibsagar","Silchar","Tezpur","Tinsukia","N/A"]
    },
    {
      "state":"Bihar",
      "cities":["Ara","Baruni","Begusarai","Bettiah","Bhagalpur","Bihar Sharif","Bodh Gaya","Buxar","Chapra","Darbhanga","Dehri","Dinapur Nizamat","Gaya","Hajipur","Jamalpur","Katihar","Madhubani","Motihari","Munger","Muzaffarpur","Patna","Purnia","Pusa","Saharsa","Samastipur","Sasaram","Sitamarhi","Siwan","N/A"]
    },
    {
      "state":"Chhattisgarh",
      "cities":["Ambikapur","Bhilai","Bilaspur","Dhamtari","Durg","Jagdalpur","Raipur","Rajnandgaon","N/A"]
    },
    {
      "state":"Delhi",
      "cities":["Delhi","New Delhi","N/A"]
    },
    {
      "state":"Goa",
      "cities":["Madgaon","Panaji","N/A"]
    },
    {
      "state":"Gujarat",
      "cities":["Ahmadabad","Amreli","Bharuch","Bhavnagar","Bhuj","Dwarka","Gandhinagar","Godhra","Jamnagar","Junagadh","Kandla","Khambhat","Kheda","Mahesana","Morvi","Nadiad","Navsari","Okha","Palanpur","Patan","Porbandar","Rajkot","Surat","Surendranagar","Valsad","Veraval","N/A"]
    },
    {
      "state":"Haryana",
      "cities":["Ambala","Bhiwani","Chandigarh","Faridabad","Firozpur Jhirka","Gurgaon","Hansi","Hisar","Jind","Kaithal","Karnal","Kurukshetra","Panipat","Pehowa","Rewari","Rohtak","Sirsa","Sonipat","N/A"]
    },
    {
      "state":"Himachal Pradesh",
      "cities":["Bilaspur","Chamba","Dalhousie","Dharmshala","Hamirpur","Kangra","Kullu","Mandi","Nahan","Shimla","Una","N/A"]
    },
    {
      "state":"Jammu and Kashmir",
      "cities":["Anantnag","Baramula","Doda","Gulmarg","Jammu","Kathua","Leh","Punch","Rajauri","Srinagar","Udhampur","N/A"]
    },
    {
      "state":"Jharkhand",
      "cities":["Bokaro","Chaibasa","Deoghar","Dhanbad","Dumka","Giridih","Hazaribag","Jamshedpur","Jharia","Rajmahal","Ranchi","Saraikela","N/A"]
    },
    {
      "state":"Karnataka",
      "cities":["Badami","Ballari","Bangalore","Belgavi","Bhadravati","Bidar","Chikkamagaluru","Chitradurga","Davangere","Halebid","Hassan","Hubballi-Dharwad","Kalaburagi","Kolar","Madikeri","Mandya","Mangaluru","Mysuru","Raichur","Shivamogga","Shravanabelagola","Shrirangapattana","Tumkuru","N/A"]
    },
    {
      "state":"Kerala",
      "cities":["Alappuzha","Badagara","Idukki","Kannur","Kochi","Kollam","Kottayam","Kozhikode","Mattancheri","Palakkad","Thalassery","Thiruvananthapuram","Thrissur","N/A"]
    },
    {
      "state":"Madhya Pradesh",
      "cities":["Balaghat","Barwani","Betul","Bharhut","Bhind","Bhojpur","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Guna","Gwalior","Hoshangabad","Indore","Itarsi","Jabalpur","Jhabua","Khajuraho","Khandwa","Khargon","Maheshwar","Mandla","Mandsaur","Mhow","Morena","Murwara","Narsimhapur","Narsinghgarh","Narwar","Neemuch","Nowgong","Orchha","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Sarangpur","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Ujjain","Vidisha","N/A"]
    },
    {
      "state":"Maharashtra",
      "cities":["Ahmadnagar","Akola","Amravati","Aurangabad","Bhandara","Bhusawal","Bid","Buldana","Chandrapur","Daulatabad","Dhule","Jalgaon","Kalyan","Karli","Kolhapur","Mahabaleshwar","Malegaon","Matheran","Mumbai","Nagpur","Nanded","Nashik","Osmanabad","Pandharpur","Parbhani","Pune","Ratnagiri","Sangli","Satara","Sevagram","Solapur","Thane","Ulhasnagar","Vasai-Virar","Wardha","Yavatmal","N/A"]
    },
    {
      "state":"Manipur",
      "cities":["Imphal","N/A"]
    },
    {
      "state":"Meghalaya",
      "cities":["Cherrapunji","Shillong","N/A"]
    },
    {
      "state":"Mizoram",
      "cities":["Aizawl","Lunglei","N/A"]
    },
    {
      "state":"Nagaland",
      "cities":["Kohima","Mon","Phek","Wokha","Zunheboto","N/A"]
    },
    {
      "state":"Odisha",
      "cities":["Balangir","Baleshwar","Baripada","Bhubaneshwar","Brahmapur","Cuttack","Dhenkanal","Keonjhar","Konark","Koraput","Paradip","Phulabani","Puri","Sambalpur","Udayagiri","Puducherry (Union Territory)","Karaikal","Mahe","Puducherry","Yanam","N/A"]
    },
    {
      "state":"Punjab",
      "cities":["Amritsar","Batala","Chandigarh","Faridkot","Firozpur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Nabha","Patiala","Rupnagar","Sangrur","N/A"]
    },
    {
      "state":"Rajasthan",
      "cities":["Abu","Ajmer","Alwar","Amer","Barmer","Beawar","Bharatpur","Bhilwara","Bikaner","Bundi","Chittaurgarh","Churu","Dhaulpur","Dungarpur","Ganganagar","Hanumangarh","Jaipur","Jaisalmer","Jalor","Jhalawar","Jhunjhunu","Jodhpur","Kishangarh","Kota","Merta","Nagaur","Nathdwara","Pali","Phalodi","Pushkar","Sawai Madhopur","Shahpura","Sikar","Sirohi","Tonk","Udaipur","N/A"]
    },
    {
      "state":"Sikkim",
      "cities":["Gangtok","Gyalsing","Lachung","Mangan","N/A"]
    },
    {
      "state":"Tamil Nadu",
      "cities":["Arcot","Chengalpattu","Chennai","Chidambaram","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kanchipuram","Kanniyakumari","Kodaikanal","Kumbakonam","Madurai","Mamallapuram","Nagappattinam","Nagercoil","Palayankottai","Pudukkottai","Rajapalaiyam","Ramanathapuram","Salem","Thanjavur","Tiruchchirappalli","Tirunelveli","Tiruppur","Tuticorin","Udhagamandalam","Vellore","N/A"]
    },
    {
      "state":"Telangana",
      "cities":["Hyderabad","Karimnagar","Khammam","Mahbubnagar","Nizamabad","Sangareddi","Warangal","N/A"]
    },
    {
      "state":"Tripura",
      "cities":["Agartala","N/A"]
    },
    {
      "state":"Uttar Pradesh",
      "cities":["Agra","Aligarh","Allahabad","Amroha","Ayodhya","Azamgarh","Bahraich","Ballia","Banda","Bara Banki","Bareilly","Basti","Bijnor","Bithur","Budaun","Bulandshahr","Deoria","Etah","Etawah","Faizabad","Farrukhabad-cum-Fatehgarh","Fatehpur","Fatehpur Sikri","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur","Lakhimpur","Lalitpur","Lucknow","Mainpuri","Mathura","Meerut","Mirzapur-Vindhyachal","Moradabad","Muzaffarnagar","Partapgarh","Pilibhit","Rae Bareli","Rampur","Saharanpur","Sambhal","Shahjahanpur","Sitapur","Sultanpur","Tehri","Varanasi","N/A"]
    },
    {
      "state":"Uttarakhand",
      "cities":["Almora","Dehra Dun","Haridwar","Mussoorie","Nainital","Pithoragarh","N/A"]
    },
    {
      "state":"West Bengal",
      "cities":["Alipore","Alipur Duar","Asansol","Baharampur","Bally","Balurghat","Bankura","Baranagar","Barasat","Barrackpore","Basirhat","Bhatpara","Bishnupur","Budge Budge","Burdwan","Chandernagore","Darjiling","Diamond Harbour","Dum Dum","Durgapu","Halisahar","Haora","Hugli","Ingraj Baza","Jalpaigur","Kalimpong","Kamarhati","Kanchrapara","Kharagpur","Koch Biha","Kolkata","Krishnanagar","Malda","Midnapore","Murshidabad","Navadwip","Palashi","Panihati","Purulia","Raiganj","Santipur","Shantiniketan","Shrirampur","Siliguri","Siuri","Tamluk","Titagarh","N/A"]
    },
    {
      "state":"N/A",
      "cities":["N/A"]
    }];

}
