var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        ons.setDefaultDeviceBackButtonListener(function() {
            if (navigator.notification.confirm("Are you sure to close the App?", 
                function(index) {
                    if (index == 1) { // OK button
                        navigator.app.exitApp(); // Close the app
                    }
                }
            ));
        });
        
        // Open any external link with InAppBrowser Plugin
        $(document).on('click', 'a[href^=http], a[href^=https]', function(e){

            e.preventDefault();
            var $this = $(this); 
            var target = $this.data('inAppBrowser') || '_blank';

            window.open($this.attr('href'), target);

        });

        //mine initial login and signup functionality (when app launches) before the oops of the template started

    function handleLogin(email,password) {
    //var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    //$("#submitButton",form).attr("disabled","disabled");
    //var u = $("#email", form).val();
    //var p = $("#password", form).val();
    var u= email;
    var p= password;
    console.log("click");
    if(u != '' && p!= '') {
    $('#loginPage').show();
    $.post("http://localhost/noticeBoard/www/loginDummy.php", {email:u,password:p}, function(res) {
        alert(res.a);
    if(res.a == "1") {
    //store
    //show the logged in panel
    window.localStorage["email"] = u;
    window.localStorage["password"] = p;
    alert("Your login sucess");
    //$('#loginPage').show();
    $('#toolbar').show();
    $('#category-page').show();
    //show category page here and hide the splash screen

    //$.mobile.changePage("some.html");
    } else {
    alert("Your login failed");
    // show signup login form
    //hide splash screen here
    $('#loginPage').show();
    $('#registerPage').show();
    //hide splash screen here
    }
    $("#submitButton").removeAttr("disabled");
    },"json");
    //$('#loginPage').show();
    } else {
    //Thanks Igor!
    //post request because of hacky loading of dom
    $.post("http://localhost/noticeBoard/www/loginDummy.php", {email:"aa"}, function(res) {
    alert("Do initial login");
    $("#submitButton").removeAttr("disabled");
    $('#loginPage').show();
    $('#registerPage').show();
    },"json");
    //hide splash screen here

    }
    //return false;
    }

     //   $("#submitButton").on('click',handleLogin);
        checkPreAuth();
//left
//change variable name and make global variable for url

        function checkPreAuth() {
var form = $("#loginForm");
if(window.localStorage["email"] != undefined && window.localStorage["password"] != undefined) {
/*$("#email", form).val(window.localStorage["email"]);
$("#password", form).val(window.localStorage["password"]);
*/
var email=window.localStorage["email"];
var password= window.localStorage["password"];
$.post("json/structure.json", {email:"aa"}, function(res) {
    alert("Your login sucess");
    //$('#loginPage').show();
    //hacky way post asynch as to do after dom load
    $('#toolbar').show();
    $('#category-page').show();
    
    },"json");
///handle login not needed as login if stored in local storage
//handleLogin(email,password);
}else{
    //show login and register form here
    //hide the categories page
    //hacky way post asynch as to do after dom load
    
    /*$.post("json/structure.json", {email:"aa"}, function(res) {
    alert("not stored in local storage");
    //$('#toolbar').show();
    $('#loginPage').show();
    $('#registerPage').show();
    },"json");*/
    
    $.get("http://collegeboard-env2.elasticbeanstalk.com/collegeInfo/getAllCollegeInfos", function(response) {
    alert("not stored in local storage");
    var isSuccess= response.success;
            if (isSuccess) {
            
            var collegeList= response.data;
            
            }else{
                var errorMessage=response.message;
                alert(errorMessage);
        }
            if(isSuccess) {
            //store profile data in local storage
            //var collegeData = {'college_list': register_email, 'user_id' :user_id ,'contact_nos':contact_nos,'register_password':register_password, 'register_name': register_name, 'register_college': register_college, 'register_roll': register_roll, 'interestedCategories': interestedCategories};
            var collegeData=collegeList;
            var collegeDataJson=JSON.stringify(collegeData);

            window.localStorage["collegeData"] = collegeDataJson;
            //$.mobile.changePage("some.html");
            //show categories and hide login and register form

            $('#loginPage').show();
            $('#registerPage').show();

            }
    }).fail(function() {
    
    alert("some probem with internet or server not able to fetch list of colleges.");
});

    //hide splash screen here
    //new call to fetch the colleges
/*
    $http({method: 'GET', url: "http://collegeboard-env2.elasticbeanstalk.com/collegeInfo/getAllCollegeInfos",async: false}).
        success(function(response, status, headers, config) {
            
            var isSuccess= response.success;
            if (isSuccess) {
            
            var collegeList= response.data;
            
            }else{
                var errorMessage=response.message;
                alert(errorMessage);
        }
            if(isSuccess) {
            //store profile data in local storage
            //var collegeData = {'college_list': register_email, 'user_id' :user_id ,'contact_nos':contact_nos,'register_password':register_password, 'register_name': register_name, 'register_college': register_college, 'register_roll': register_roll, 'interestedCategories': interestedCategories};
            var collegeData=college_list;
            var collegeDataJson=JSON.stringify(collegeData);

            window.localStorage["collegeData"] = collegeDataJson;
            //$.mobile.changePage("some.html");
            //show categories and hide login and register form

            $('#loginPage').show();
            $('#registerPage').show();

            } 
        }).
        error(function(data, status, headers, config) {
            alert("some probem with internet or server not able to fetch list of colleges.");
            //page remain as it is
            $scope.isLoggedIn="no";
        });   */ 

    //close new call

}

}


//mine






    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
    
};

(function(){
    'use strict';
    var module = angular.module('sensationFeedPlugin', ['onsen', 'sensationFeedPlugin.data', 'ngSanitize']);
    
   
    document.addEventListener('deviceready', function() {
        angular.bootstrap(document, ['sensationFeedPlugin']);       
    }, false);
    
    // Feed Plugin: Categories Controller
    /*module.controller('FeedPluginCategoriesController', function($scope, $http, FeedPluginData) {

        $http({method: 'GET', url: FeedPluginData.url}).
        success(function(data, status, headers, config) {
            $scope.categories = data.categories; 
        }).
        error(function(data, status, headers, config) {

        });

        $scope.showDetail = function(index) {
        var selectedItem = $scope.categories[index];
        //get profile information about items stored in the local storage
        //using some data replace lateron
        var profileData = JSON.parse(window.localStorage.getItem('profileData'));
        //var categoryInterestedData=profileData["categories"];
        //var email=window.localStorage["email"];
        FeedPluginData.selectedItem = selectedItem;
        FeedPluginData.profileData=profileData;
        //title fields are passed you can change it
        $scope.ons.navigator.pushPage('feed-category.html', {title : selectedItem.title});
        }

    });*/
    
    //mine login controller

    module.controller('loginController', function($scope, $http, FeedPluginData) {

        $scope.name="harry";

        $scope.userLogin = function() {

        alert("clicked");

        var form = $("#loginForm");
//disable the button so we can't resubmit while we wait
$("#submitButton",form).attr("disabled","disabled");
var u = $("#email", form).val();
var p = $("#password", form).val();
console.log("click");
if(u != '' && p!= '') {



$http({method: 'GET', url: "http://collegeboard-env2.elasticbeanstalk.com/userInfo/userSignIn?userEmail="+u+"&userPassword="+p ,async: false}).
        success(function(response, status, headers, config) {
            
            var isSuccess= response.success;
            if (isSuccess) {
            var register_name= response.data.userName;
            var register_roll= response.data.rollNumber;
            var user_id=response.data.userId;
            var contact_nos=response.data.contactNumber;
            var register_email= response.data.emailAddress;
            var register_password= response.data.password;
            var register_college= response.data.collegeName;
            var interestedCategories=response.data.userCategories;
            }else{
                var errorMessage=response.message;
                alert(errorMessage);
        }
            if(isSuccess) {
            //store profile data in local storage
            window.localStorage["email"] = register_email;
            window.localStorage["password"] = register_password;
            var profileData = {'register_email': register_email, 'user_id' :user_id ,'contact_nos':contact_nos,'register_password':register_password, 'register_name': register_name, 'register_college': register_college, 'register_roll': register_roll, 'interestedCategories': interestedCategories};
            var profileDataJson=JSON.stringify(profileData);

            window.localStorage["profileData"] = profileDataJson;
            //$.mobile.changePage("some.html");
            //show categories and hide login and register form

            $('#loginPage').hide();
            $('#registerPage').hide();
            $('#toolbar').show();
            $('#category-page').show();

            } /*else {
            // or message from shubhanshu to show here
            alert("Your registration failed try again failed");
            } */
        }).
        error(function(data, status, headers, config) {
            alert("some probem with server try sometime later");
            //page remain as it is
            $scope.isLoggedIn="no";
        });


$("#submitButton").removeAttr("disabled");

} else {
//Thanks Igor!
alert("You must enter a email and password");
$("#submitButton").removeAttr("disabled");
}




        /*var selectedItem = $scope.categories[index];
        FeedPluginData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('feed-category.html', {title : selectedItem.title});*/
        }

    });





module.controller('registerController', function($scope, $http, FeedPluginData) {

        $scope.name="harry";

        $scope.userRegister = function() {

        alert("clicked");

        var form = $("#registerForm");
//disable the button so we can't resubmit while we wait
$("#register_submitButton",form).attr("disabled","disabled");
var u = $("#register_email", form).val();
var p = $("#register_password", form).val();
var cp = $("#register_confirmPassword", form).val();
var name = $("#register_name", form).val();
var roll = $("#register_roll", form).val();
var college = $("#register_college", form).val();
//var categories = $("#register_categories", form).val();
var contactNumber=$("#register_contactNumber", form).val();

if(u != '' && p!= '' && !(p !=cp)) {

var fd = new FormData();
fd.append('userName', name);
fd.append('rollNumber', roll);
fd.append('contactNumber', contactNumber);
//fd.append('categoryIds', categories);
fd.append('email', u);
fd.append('password', p);
fd.append('collegeName', college);
//fd.append('collegeAddress', collegeAddress);
//fd.append('userImageFile', userImageFile);
    var locationOrigin="http://collegeboard-env2.elasticbeanstalk.com";
$http.post(locationOrigin + "/userInfo/userSignUp", fd, {
transformRequest: angular.identity,
headers: {
'Content-Type': undefined
}
}).success(function (response) {
            var isSuccess= response.success;
            if (isSuccess) {
            var register_name= response.data.userName;
            var register_roll= response.data.rollNumber;
            var user_id=response.data.userId;
            var contact_nos=response.data.contactNumber;
            var register_email= response.data.emailAddress;
            var register_password= response.data.password;
            var register_college= response.data.collegeName;
            var interestedCategories=response.data.userCategories;
            }else{
                var errorMessage=response.message;
                alert(errorMessage);
        }
            if(isSuccess) {
            //store profile data in local storage
            window.localStorage["email"] = register_email;
            window.localStorage["password"] = register_password;
            var profileData = {'register_email': register_email, 'user_id' :user_id ,'contact_nos':contact_nos,'register_password':register_password, 'register_name': register_name, 'register_college': register_college, 'register_roll': register_roll, 'interestedCategories': interestedCategories};
            var profileDataJson=JSON.stringify(profileData);

            window.localStorage["profileData"] = profileDataJson;
            //$.mobile.changePage("some.html");
            //show categories and hide login and register form

            $('#loginPage').hide();
            $('#registerPage').hide();
            $('#toolbar').show();
            $('#category-page').show();

            } else {
            // or message from shubhanshu to show here
            alert("Your registration failed try again failed");
            } 
        }).error(function (response) {
            
            alert(response.message);
            alert("Some problem with the server");
        });


$("#register_submitButton").removeAttr("disabled");

} else {
//Thanks Igor!
alert("You must enter a email and password or confirm password does not match");
$("#register_submitButton").removeAttr("disabled");
}




        /*var selectedItem = $scope.categories[index];
        FeedPluginData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('feed-category.html', {title : selectedItem.title});*/
        }

        $scope.getCollegeFromStorage = function() {
            var collegeData = JSON.parse(window.localStorage.getItem('collegeData'));
            return collegeData;

        }

    });


    //mine close


    // Feed Plugin: Categories Controller
    module.controller('FeedPluginCategoriesController', function($scope, $http, FeedPluginData) {

        $http({method: 'GET', url: FeedPluginData.url}).
        success(function(data, status, headers, config) {
            $scope.categories = data.categories; 
        }).
        error(function(data, status, headers, config) {

        });

        $scope.showDetail = function(index) {
        var selectedItem = $scope.categories[index];
        //selected item is for example notices
        //get profile information about items stored in the local storage
        //using some data replace lateron
        var profileData = JSON.parse(window.localStorage.getItem('profileData'));
        //var categoryInterestedData=profileData["categories"];
        //var email=window.localStorage["email"];
        FeedPluginData.selectedItem = selectedItem;
        FeedPluginData.profileData=profileData;
        //profiledata to take out the categories
        //title fields are passed you can change it
        $scope.ons.navigator.pushPage('feed-category.html', {title : selectedItem.title});
        }

        $scope.showHiddenPage = function(index) {
            //how to hide splash screen here
            if ($("#loginPage").is(":hidden") && $("#registerPage").is(":hidden") && window.localStorage["email"] != undefined && window.localStorage["password"] != undefined) {
            $('#toolbar').show();
            $('#category-page').show();
            };        
        }
        
        $scope.getName = function(id) {
        //
        return "a";
        }

    });

    // Feed Plugin: Category Controller
    module.controller('FeedPluginCategoryController', function($scope, FeedPluginData) {

        $scope.title = FeedPluginData.selectedItem.title;
        FeedPluginData.mainCategory=FeedPluginData.selectedItem.title;
        //$scope.items = FeedPluginData.selectedItem.items;
        $scope.items = FeedPluginData.profileData["interestedCategories"];
        $scope.showDetail = function(index) {
        var selectedItem = $scope.items[index];
        FeedPluginData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('feed-master.html', {title : selectedItem.categoryName});
        }

    });
    
    // Feed Plugin: Master Controller
    module.controller('FeedPluginMasterController', function($scope, $http, FeedPluginData) {
    
        $scope.msg = "Loading...";
        

        $scope.feeds = "";


        //extra
        //td
        //list of variables to send to shubhanshu
        var user_id=FeedPluginData.profileData["user_id"];
        //main category in notice or news
        var mainCategory=FeedPluginData.mainCategory;
        var categoryId=FeedPluginData.selectedItem.categoryId;
        var categoryName=FeedPluginData.selectedItem.categoryName;
        var categoryDescription=FeedPluginData.selectedItem.categoryDescription;
        //which category is clicked
        alert(user_id);
        //noticeInfo/getNotices?userId=user_id&categoriesToFetch=categoryId
        $http({method: 'GET', url: "http://localhost/noticeBoard/www/loginDummy2.php" ,async: false}).
        success(function(response, status, headers, config) {
            

                //new
                var isSuccess= response.success;
            if (isSuccess) {
                var register_name= response.data.userName;
                var feedData=response.data;
                $scope.title = feedData.feed.title;
                $scope.description = feedData.feed.description;
                $scope.link = feedData.feed.link;
                $scope.feeds = feedData.feed.entries;
                var feedEntriesData=feedData.feed.entries;
                console.log($scope.feeds);
                var feedEntriesDataJson=JSON.stringify(feedEntriesData);
                window.localStorage["feedEntriesData"+mainCategory+categoryId+categoryName] = feedEntriesDataJson;
                //td json formation and storing in memory, retrieving from memory and then showing
                //below is change from object to array for working of limito filter in feed-master angular

                //for showing feeds and using limito below has to be ser for array converion from json
                var array = $.map(feedEntriesData, function(value, index) {
                    return [value];
                    });

                $scope.feeds=array;
                feedEntriesData=array;              
                console.log(array);
                $scope.msg = "";
                //feedEntriesData is not decoupled from the incomming data so also change in the feed master when data changes 
                executeOnSucess(feedEntriesData);
            }else{
                //check if data in local storage show that
                if (window.localStorage["feedEntriesData"+mainCategory+categoryId+categoryName] != undefined) {
                    var errorMessage=response.message;
                    alert("Not able to fetch new data"+errorMessage);
                    var feedEntriesData=JSON.parse(window.localStorage.getItem('feedEntriesData'+mainCategory+categoryId+categoryName));
                    //array formed for to limt to work
                    var array = $.map(feedEntriesData, function(value, index) {
                    return [value];
                    });
                    //scpoe.feeds allocate to the view
                    //$scope.feeds=feedEntriesData;
                    feedEntriesData=array;
                    $scope.feeds=feedEntriesData;
                    //var feedEntriesData=window.localStorage["feedEntriesData"+categoryId+categoryName];
                    executeOnSucess(feedEntriesData);
                    
                }else{
                var errorMessage=response.message;
                alert("Not able to fetch data"+errorMessage);
                }
            }
                //new close








            /*console.log(data);
          //  console.log(data.a);
            var feedData=data;
            //var feedData=JSON.parse(data);
            //profData["userId"];
            //below to check correct information on login
            if (!feedData.responseData) {
                $scope.msg = "The device is unable to get the data.";
            } else {
                $scope.title = feedData.responseData.feed.title;
                $scope.description = feedData.responseData.feed.description;
                $scope.link = feedData.responseData.feed.link;
                $scope.feeds = feedData.responseData.feed.entries;
                console.log($scope.feeds);
                //below is change from object to array for working of limito filter in feed-master angular
                var array = $.map($scope.feeds, function(value, index) {
                    return [value];
                    });

                $scope.feeds=array;
                console.log(array);
                $scope.msg = "";
                executeOnSucess();
            }*/ 
        }).
        error(function(data, status, headers, config) {
            if (window.localStorage["feedEntriesData"] != undefined) {
                    //var errorMessage=response.message;
                    alert("Some internet problem");
                    var feedEntriesData=JSON.parse(window.localStorage.getItem('feedEntriesData'+mainCategory+categoryId+categoryName));
                    //array formed for to limt to work
                    var array = $.map(feedEntriesData, function(value, index) {
                    return [value];
                    });
                    //$scope.feeds=feedEntriesData;
                    feedEntriesData=array;
                    $scope.feeds=feedEntriesData;
                    executeOnSucess(feedEntriesData);
                    
                }else{
                //var errorMessage=response.message;
                $scope.msg = 'An error occured:' + status;
                }
        
        });


        //extra close

        /*$http({method: 'JSONP', url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(FeedPluginData.selectedItem.url)}).
        success(function(data, status, headers, config) {
            
            if (!data.responseData) {
                $scope.msg = "The device is unable to get the data.";
            } else {
                $scope.title = data.responseData.feed.title;
                $scope.description = data.responseData.feed.description;
                $scope.link = data.responseData.feed.link;
                $scope.feeds = data.responseData.feed.entries;
                
                $scope.msg = "";
            }

        }).
        error(function(data, status, headers, config) {
        $scope.msg = 'An error occured:' + status; 
        });*/
    function executeOnSucess(feedEntriesData){
        
        alert(Object.keys(feedEntriesData).length);
        var page = 1;
        // Define the number of the feed results in the page
        var pageSize = 3;
        //console.log(feedData.responseData.feed.entries);
        //$scope.paginationLimit = function(data) {
        $scope.paginationLimit = function() {
        return pageSize * page;
        };
        $scope.hasMoreItems = function() {

        //return page < ($scope.feeds.length / pageSize);
        return page < (Object.keys(feedEntriesData).length / pageSize);
        };

        $scope.showMoreItems = function() {
        page = page + 1;       
        }; 
        
        $scope.showDetail = function(index) {
        var selectedItem = feedEntriesData[index];
        FeedPluginData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('feed-detail.html', selectedItem);
        }
        
		
        
        };
        
    });

    // Feed Plugin: Detail Controller
    module.controller('FeedPluginDetailController', function($scope,$http ,$sce, FeedPluginData) {
        $scope.item = FeedPluginData.selectedItem;
        //decoupling the selected item
        $scope.item.mainCategory= FeedPluginData.mainCategory;
        $scope.item.title= FeedPluginData.selectedItem.title;
        $scope.item.publishedDate=FeedPluginData.selectedItem.publishedDate;
        $scope.item.content=FeedPluginData.selectedItem.content;
        $scope.item.urlLink=FeedPluginData.selectedItem.urlLink;
        $scope.item.socialLink=FeedPluginData.selectedItem.socialLink;
        $scope.item.postedByName=FeedPluginData.selectedItem.postedByName;
        $scope.item.postedByRoll=FeedPluginData.selectedItem.postedByRoll;
        if($scope.item.images != undefined){
        $scope.item.images.url1=FeedPluginData.selectedItem.images.url1;
        }
        if(FeedPluginData.mainCategory.toLowerCase()=="notices")
        {$scope.item.noticeId=FeedPluginData.selectedItem.id;
        }else if(FeedPluginData.mainCategory.toLowerCase()=="news"){
            $scope.item.newsId=FeedPluginData.selectedItem.id;
        }
		/*$scope.mediaObject = function(item) {
			return (item && item.mediaGroups) ? item.mediaGroups[0].contents[0] : {url:''};
		}

		$scope.hasVideo = function(item) {
			var media = $scope.mediaObject(item);
            
            //JAVASCRIPT: condition ? val1 : val2
            //return media.type ? (media.type == "video/mp4") : (media.url ? (media.url.indexOf(".mp4") != -1) : false);
			return media.type ? (media.type == "video/mp4") : false;
		}
        
		$scope.hasAudio = function(item) {
			var media = $scope.mediaObject(item);
            
            //JAVASCRIPT: condition ? val1 : val2
			return media.type ? (media.type == "audio/mp3") : false;
		}*/
        
        //marking spam and report abuse here function firing post call to the server same function doing both calls

        $scope.setInfoState = function(state) {
            var fd = new FormData();
            //if news or notice
            if(FeedPluginData.mainCategory.toLowerCase()=="notices")
            {
                fd.append('noticeId',$scope.item.noticeId);
                
            }else if(FeedPluginData.mainCategory.toLowerCase()=="news"){
                fd.append('newsId',$scope.item.newsId);
            }
             //if spam or abuse
            if(state.toLowerCase()=="spam")
            {
                fd.append('infoState',"REPORTED_SPAM");
                
            }else if(state.toLowerCase()=="abuse"){
                fd.append('newsId',"REPORTED_ABUSE");
            }
            
            
            var locationOrigin="http://collegeboard-env2.elasticbeanstalk.com";
            $http.post(locationOrigin + "/noticeInfo/changeNoticeState", fd, {
            transformRequest: angular.identity,
            headers: {
            'Content-Type': undefined
            }
            }).success(function (response) {
            var isSuccess= response.success;
            if (isSuccess) {
            alert("Reported");
            //empty the initial variabes of notice
            
            }else{
                alert("error in reporting try later");
                var errorMessage=response.message;
                alert(errorMessage);
        }
        }).error(function (response) {
            
            //alert(response.message);
            alert("Some problem with the internet or server try later.");
        });
        

        }

        $scope.getTrustedResourceUrl = function(src) {
            
            return $sce.trustAsResourceUrl(src);
        }
        
        $scope.loadURL = function (link) {
            //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
            //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
            //_blank: Opens in the InAppBrowser.
            //_system: Opens in the system's web browser.
            //window.open($scope.item.link,'_blank');
            window.open(link,'_blank');
        }
        
        /*$scope.shareFeed = function () {
            
            var subject = $scope.item.title;
            var message = $scope.item.content;
            message = message.replace(/(<([^>]+)>)/ig,"");

            var link = $scope.item.link;
            
            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }*/
        
     });
    
    // Contact Controller
    module.controller('ContactController', function($scope, $http) {

        $scope.submitForm = function() {
            var heading=$scope.subject;
            var description=$scope.message;
            var cat1=$scope.cat1;
            if (cat1) {};
            alert(cat1);
            var imgUri=$scope.imgUri;
            alert(imgUri);
            
            var noticeData = {notice_heading: heading, notice_description:description};
            var noticeDataJson=JSON.stringify(noticeData);
            var profileData = JSON.parse(window.localStorage.getItem('profileData'));
            var fd = new FormData();
fd.append('userName', name);
fd.append('rollNumber', roll);
fd.append('contactNumber', contactNumber);
fd.append('categoryIds', categories);
fd.append('email', u);
fd.append('password', p);
fd.append('collegeName', college);

var noticeInfos={};

fd.append('noticeInfos', noticeInfos);

//fd.append('collegeAddress', collegeAddress);
//fd.append('userImageFile', userImageFile);
    /*var locationOrigin="http://collegeboard-env2.elasticbeanstalk.com";
$http.post(locationOrigin + "/userInfo/userSignUp", fd, {
transformRequest: angular.identity,
headers: {
'Content-Type': undefined
}
}).success(function (response) {
*/



            $http({method: 'POST', url: "http://localhost/noticeBoard/www/loginDummy2.php",data: noticeDataJson}).success(function(data, status, headers, config) {
                $scope.postedSuccess= data.responseData.feed.title;
                alert($scope.postedSuccess);
                if ($scope.postedSuccess=="Peter Parker") {
                    //hide login register show categories
                    $scope.postedSuccess="yes";
                }else{
                    $scope.postedSuccess="no";
                };
                if($scope.postedSuccess=="yes") {
                //store profile data in local storage
                alert("Your notice has been posted");

                } else {
                // or message from shubhanshu to show here
                alert("Your notice could not be posted");
                } 
            }).
            error(function(data, status, headers, config) {
                alert("There is some server error try sommetime later");
            });

           /* window.plugin.email.open({
                to:      ['email@company.com'],
                cc:      ['email1@company.com'],
                bcc:     ['email2@company.com'],
                subject: $scope.subject,
                body:    $scope.message
            });*/

        };

    });

    // Contact Controller
    module.controller('noticePostController', function($scope, $http) {
        var profileData = JSON.parse(window.localStorage.getItem('profileData'));
        
        $scope.submitForm = function() {
            var heading=$scope.subject;
            var description=$scope.message;
            var categories='';
            var cat1=$scope.cat1;
            if (cat1) {
                categories='1';
            };
            alert(cat1);
            var cat2=$scope.cat2;
            if (cat2) {
                categories=categories+',2';
            };
            //var cp = $("#imgUri").val();
            var imgUri=$scope.imgUri;

            
            var imgUri = $("#imgUri").val();
            alert(imgUri);
            var imgUri=$('input[type=file]')[0].files[0];
            /*console.log(imgUri);
            var imgUri=btoa($('input[type=file]')[0].files[0]);
            console.log(imgUri);*/
            //new
            /*var noticeInfos = [
{
'noticeHeading': heading,
'noticeDescription': description
}
];*/
var profileData = JSON.parse(window.localStorage.getItem('profileData'));
            
var user_id=profileData["user_id"];
/*var data = {
"userId": user_id,
"noticeInfoList": noticeInfos
};
*/
//data = JSON.stringify(data);
var fd = new FormData();
            fd.append('userId', user_id);
            fd.append('noticeHeading', heading);
            fd.append('noticeDescription', description);
            fd.append('categories', categories);
            fd.append('noticeUrl', description);
            fd.append('noticeFBUrl', categories);
            //fd.append('infoState', 'APPROVED');
            fd.append('noticeImageFile', imgUri);
            //new
            //var noticeData = {'noticeHeading': heading, 'noticeDescription':description,'categories':categories,infoState:'APPROVED'};
            //var noticeData={'noticeHeading': heading, 'noticeDescription':description};
            /*var array = $.map(noticeData, function(value, index) {
                    return [value];
                    });
            noticeData=array;
            var notices=[];
            notices.push(noticeData);*/
//notices.push(noticeData);
            //notices=JSON.stringify(notices);
            /*var noticeDataJson=JSON.stringify(noticeData);
            var profileData = JSON.parse(window.localStorage.getItem('profileData'));
            
            var user_id=profileData["user_id"];            
            */

           /* var fdJson={
                
                'noticeInfos':notices
            }*/
            //fdJson=JSON.stringify(fdJson);
            


//fd.append('collegeAddress', collegeAddress);
//fd.append('userImageFile', userImageFile);
    //var locationOrigin="http://collegeboard-env2.elasticbeanstalk.com";

/*$http({
url: locationOrigin + '/collegeInfo/postNotices',
method: "POST",
data: data,
headers: {'Content-Type': 'application/json'}
}*/
    var locationOrigin="http://collegeboard-env2.elasticbeanstalk.com";
$http.post(locationOrigin + "/noticeInfo/postNotice", fd, {
transformRequest: angular.identity,
headers: {
'Content-Type': undefined
}
}).success(function (response) {
            var isSuccess= response.success;
            if (isSuccess) {
            alert("Your Notice has been posted");
            //empty the initial variabes of notice
            $scope.subject='';
            $scope.message='';
            $scope.cat1='';
            }else{
                alert("notice was'nt posted contact us");
                var errorMessage=response.message;
                alert(errorMessage);
        }
        }).error(function (response) {
            
            //alert(response.message);
            alert("Some problem with the internet or server try later.");
        });



        };

    });


module.controller('menuController', function($scope) {

        
        //$scope.items = FeedPluginData.selectedItem.items;
        
        $scope.showHiddenHome = function() {
            $('#toolbar').show();
            $('#category-page').show();
        }

    });

})();

