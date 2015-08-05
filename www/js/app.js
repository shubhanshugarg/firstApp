var pictureSource;
var destinationType;
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        if (navigator.camera != undefined) {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
        }
        ons.setDefaultDeviceBackButtonListener(function () {
            /*var confirmed = confirm("Are you sure to close the App?");
            if (confirmed)
                navigator.app.exitApp();
        });*/
        navigator.app.exitApp();
        });
        // Open any external link with InAppBrowser Plugin
        $(document).on('click', 'a[href^=http], a[href^=https]', function (e) {

            e.preventDefault();
            var $this = $(this);
            var target = $this.data('inAppBrowser') || '_blank';

            window.open($this.attr('href'), target);

        });

        checkPreAuth();

        app.getCount("Notices");
        setInterval(function () {
            app.getCount("Notices");
        }, 1500000);
        app.getCount("News");
        setInterval(function () {
            app.getCount("News");
        }, 1500000);
//left
//change variable name and make global variable for url

        function checkPreAuth() {
            var form = $("#loginForm");
            if (window.localStorage["email"] != undefined && window.localStorage["password"] != undefined) {
                var email = window.localStorage["email"];
                var password = window.localStorage["password"];
                $.post("json/structure.json", {email: "aa"}, function (res) {
                    //alert("Your login sucess");
                    //$('#loginPage').show();
                    //hacky way post asynch as to do after dom load
                    $('#toolbar').show();
                    $('#category-page').show();


                }, "json");
///handle login not needed as login if stored in local storage
//handleLogin(email,password);
            } else {
                //show login and register form here
                //hide the categories page
                //hacky way post asynch as to do after dom load


                $.get("http://collegeboard-env2.elasticbeanstalk.com/collegeInfo/getAllCollegeInfos", function (response) {
                    //alert("not stored in local storage");
                    var isSuccess = response.success;
                    if (isSuccess) {

                        var collegeList = response.data;

                    } else {
                        var errorMessage = response.message;
                        alert(errorMessage);
                    }
                    if (isSuccess) {
                        //store profile data in local storage
                        //var collegeData = {'college_list': register_email, 'user_id' :user_id ,'contact_nos':contact_nos,'register_password':register_password, 'register_name': register_name, 'register_college': register_college, 'register_roll': register_roll, 'interestedCategories': interestedCategories};
                        var collegeData = collegeList;
                        var collegeDataJson = JSON.stringify(collegeData);

                        window.localStorage["collegeData"] = collegeDataJson;

                        var collegeData = $.parseJSON(window.localStorage.getItem('collegeData'));

                        var tags = [];
                        $.each(collegeData, function (key, value) {
                            tags.push(value.collegeName);
                        });
                        $('#register_college').autocomplete({
                            source: tags,

                            change: function (event, ui) {
                                if (ui.item == null || ui.item == undefined) {
                                    $(this).val("");
                                    $(this).attr("disabled", false);
                                }
                            }
                        });
                        //$.mobile.changePage("some.html");
                        //show categories and hide login and register form
                        menu.setSwipeable(false);
                        $('#loginPage').show();
                        //$('#registerPage').show();


                    }
                }).fail(function () {

                    alert("some probem with internet or server not able to fetch list of colleges.");
                    menu.setSwipeable(false);
                    $('#loginPage').show();
                    //$('#registerPage').show();
                });

                //hide splash screen here

            }

        }


//mine


    },
    // there are 2 definitions of getcount they both do the same thing but otherone cannot be called from somewhere else wrong design
    getCount: function (mainCategory) {

        //if here to execute only when profile id set
        if (window.localStorage["profileData"] != undefined) {
            var profileData = $.parseJSON(window.localStorage.getItem('profileData'));
            var catIds = [];
            if (profileData != null) {
                $.each(profileData.interestedCategories, function (key, value) {
                    catIds.push(value.categoryId);
                });
                var catIdsString = catIds.join(",");

                var postedDates = [];

                $.each(profileData.interestedCategories, function (key, value) {
                    //catIds.push(value.categoryId);
                    if (window.localStorage['feedEntriesData' + mainCategory + value.categoryId + value.categoryName] != undefined) {
                        var categoryFeed = JSON.parse(window.localStorage.getItem('feedEntriesData' + mainCategory + value.categoryId + value.categoryName));
                        if (typeof categoryFeed[0] !== 'undefined' && typeof categoryFeed[0].publishedDate !== 'undefined') {
                            postedDates.push(categoryFeed[0].publishedDate);
                        } else {
                            postedDates.push(0000000000000);
                        }

                    } else {
                        postedDates.push(0000000000000);
                    }

                });

                var postedDatesString = postedDates.join(",");
                if (mainCategory == "Notices") {
                    getCountUrl = "http://collegeboard-env2.elasticbeanstalk.com/noticeInfo/getNoticesCount?userId=" + profileData.user_id + "&categoriesToFetch=" + catIdsString + "&dates=" + postedDatesString;
                } else if (mainCategory == "News") {
                    getCountUrl = "http://collegeboard-env2.elasticbeanstalk.com/newsInfo/getNewsCount?userId=" + profileData.user_id + "&categoriesToFetch=" + catIdsString + "&dates=" + postedDatesString;
                }
                $.get(getCountUrl, function (response) {
                    //alert("not stored in local storage");

                    //notification display logic here take out from response and show in text
                    //make all zero here and again set (if not 0 then notification circle shown)
                    //reseting notifcation local storage
                    $.each(profileData.interestedCategories, function (key, value) {
                        window.localStorage['#notification' + mainCategory + 'Count-' + value.categoryId] = 0;
                    });


                    $.each(response, function (key, value) {
                        $('#notification' + mainCategory + 'Count-' + key).text(value);
                        if (value > 0) {
                            $('#notificationNew' + mainCategory).text("New " + mainCategory);
                        }
                        ;
                        window.localStorage['#notification' + mainCategory + 'Count-' + key] = value;
                    });


                }).fail(function () {

                    //alert("some probem with internet or server not able to fetch count in categories.");
                });
            }
        }
        //alert("Hello");

    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }

};

(function () {
    'use strict';
    var module = angular.module('sensationFeedPlugin', ['onsen', 'sensationFeedPlugin.data', 'ngSanitize']);


    document.addEventListener('deviceready', function () {
        angular.bootstrap(document, ['sensationFeedPlugin']);
    }, false);


    //mine login controller

    module.controller('loginController', function ($scope, $http, FeedPluginData) {

        $scope.name = "harry";

        $scope.userLogin = function () {

            //alert("clicked");

            var form = $("#loginForm");
//disable the button so we can't resubmit while we wait
            $("#submitButton", form).attr("disabled", "disabled");
            var u = $("#email", form).val();
            var p = $("#password", form).val();
            console.log("click");
            if (u != '' && p != '') {


                $http({
                    method: 'GET',
                    url: "http://collegeboard-env2.elasticbeanstalk.com/userInfo/userSignIn?userEmail=" + u + "&userPassword=" + p,
                    async: false
                }).
                    success(function (response, status, headers, config) {

                        var isSuccess = response.success;
                        if (isSuccess) {
                            var register_name = response.data.userName;
                            var register_roll = response.data.rollNumber;
                            var user_id = response.data.userId;
                            var contact_nos = response.data.contactNumber;
                            var register_email = response.data.emailAddress;
                            var register_password = response.data.password;
                            var register_college = response.data.collegeName;
                            var interestedCategories = response.data.userCategories;
                        } else {
                            var errorMessage = response.message;
                            alert(errorMessage);
                        }
                        if (isSuccess) {
                            //store profile data in local storage
                            window.localStorage["email"] = register_email;
                            window.localStorage["password"] = register_password;
                            var profileData = {
                                'register_email': register_email,
                                'user_id': user_id,
                                'contact_nos': contact_nos,
                                'register_password': register_password,
                                'register_name': register_name,
                                'register_college': register_college,
                                'register_roll': register_roll,
                                'interestedCategories': interestedCategories
                            };
                            var profileDataJson = JSON.stringify(profileData);

                            window.localStorage["profileData"] = profileDataJson;
                            //$.mobile.changePage("some.html");
                            //show categories and hide login and register form

                            $('#loginPage').hide();
                            //$('#registerPage').hide();
                            $('#toolbar').show();
                            $('#category-page').show();
                            app.getCount("Notices");
                            app.getCount("News");
                            menu.setSwipeable(true);


                        }
                    }).
                    error(function (data, status, headers, config) {
                        alert("some probem with server try sometime later");
                        //page remain as it is
                        $scope.isLoggedIn = "no";
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

        $('#login-form-link').click(function (e) {
            $("#loginForm").delay(100).fadeIn(100);
            $("#registerForm").fadeOut(100);
            $('#register-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
    });


    module.controller('registerController', function ($scope, $http, FeedPluginData) {

        $('#register-form-link').click(function (e) {
            $("#registerForm").delay(100).fadeIn(100);
            $("#loginForm").fadeOut(100);
            $('#login-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        $scope.name = "harry";

        $scope.userRegister = function () {

            //alert("clicked");

            var form = $("#registerForm");
//disable the button so we can't resubmit while we wait
            $("#register_submitButton", form).attr("disabled", "disabled");
            var u = $("#register_email", form).val();
            var p = $("#register_password", form).val();
            var cp = $("#register_confirmPassword", form).val();
            var name = $("#register_name", form).val();
            var roll = $("#register_roll", form).val();
            var college = $("#register_college", form).val();
//var categories = $("#register_categories", form).val();
            var contactNumber = $("#register_contactNumber", form).val();

            if (u != '' && p != '' && !(p != cp)) {

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
                var locationOrigin = "http://collegeboard-env2.elasticbeanstalk.com";
                $http.post(locationOrigin + "/userInfo/userSignUp", fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function (response) {
                    var isSuccess = response.success;
                    if (isSuccess) {
                        var register_name = response.data.userName;
                        var register_roll = response.data.rollNumber;
                        var user_id = response.data.userId;
                        var contact_nos = response.data.contactNumber;
                        var register_email = response.data.emailAddress;
                        var register_password = response.data.password;
                        var register_college = response.data.collegeName;
                        var interestedCategories = response.data.userCategories;
                    } else {
                        var errorMessage = response.message;
                        alert(errorMessage);
                    }
                    if (isSuccess) {
                        //store profile data in local storage
                        window.localStorage["email"] = register_email;
                        window.localStorage["password"] = register_password;
                        var profileData = {
                            'register_email': register_email,
                            'user_id': user_id,
                            'contact_nos': contact_nos,
                            'register_password': register_password,
                            'register_name': register_name,
                            'register_college': register_college,
                            'register_roll': register_roll,
                            'interestedCategories': interestedCategories
                        };
                        var profileDataJson = JSON.stringify(profileData);

                        window.localStorage["profileData"] = profileDataJson;
                        //$.mobile.changePage("some.html");
                        //show categories and hide login and register form

                        $('#loginPage').hide();
                        //$('#registerPage').hide();
                        $('#toolbar').show();
                        $('#category-page').show();
                        app.getCount("Notices");
                        app.getCount("News");
                        menu.setSwipeable(true);


                    } else {
                        // or message from shubhanshu to show here
                        alert("Your registration failed try again");
                    }
                }).error(function (response) {

                    alert(response.message);
                    alert("Some problem with the server");
                });


                $("#register_submitButton").removeAttr("disabled");

            } else {
//Thanks Igor!
                alert("You must enter a email , password and matching confirm password ");
                $("#register_submitButton").removeAttr("disabled");
            }


            /*var selectedItem = $scope.categories[index];
             FeedPluginData.selectedItem = selectedItem;
             $scope.ons.navigator.pushPage('feed-category.html', {title : selectedItem.title});*/
        }


    });


    //mine close


    // Feed Plugin: Categories Controller
    module.controller('FeedPluginCategoriesController', function ($scope, $http, FeedPluginData) {

        $http({method: 'GET', url: FeedPluginData.url}).
            success(function (data, status, headers, config) {
                $scope.categories = data.categories;
            }).
            error(function (data, status, headers, config) {

            });

        $scope.retrieveCollege = function (a) {
            if (window.localStorage["profileData"] != undefined) {
                var profileData = JSON.parse(window.localStorage.getItem('profileData'));
                return profileData["register_college"];

            }
            ;
        }

        $scope.showDetail = function (index) {
            var selectedItem = $scope.categories[index];
            //selected item is for example notices
            //get profile information about items stored in the local storage
            //using some data replace lateron
            var profileData = JSON.parse(window.localStorage.getItem('profileData'));
            //var categoryInterestedData=profileData["categories"];
            //var email=window.localStorage["email"];
            FeedPluginData.selectedItem = selectedItem;
            FeedPluginData.profileData = profileData;
            //profiledata to take out the categories
            //title fields are passed you can change it
            if (selectedItem.title.toLowerCase() == "news") {
                app.getCount("News");
            } else if (selectedItem.title.toLowerCase() == "notices") {
                app.getCount("Notices");
            }
            $scope.ons.navigator.pushPage('feed-category.html', {title: selectedItem.title});
        }

        $scope.showHiddenPage = function (index) {
            //how to hide splash screen here
            if ($("#loginPage").is(":hidden") && window.localStorage["email"] != undefined && window.localStorage["password"] != undefined) {
                $('#toolbar').show();
                $('#category-page').show();

            }
            ;
        }

        $scope.getName = function (id) {
            //
            return "a";
        }

    });

    // Feed Plugin: Category Controller
    module.controller('FeedPluginCategoryController', function ($scope, FeedPluginData) {

        $scope.title = FeedPluginData.selectedItem.title;
        FeedPluginData.mainCategory = FeedPluginData.selectedItem.title;
        //$scope.items = FeedPluginData.selectedItem.items;

        //retreiving notification from local storage
        //var notifications=[];
        $.each(FeedPluginData.profileData["interestedCategories"], function (key, value) {
            //window.localStorage['#notificationNoticesCount-' + value.categoryId] = 0;
            //var profileData = JSON.parse(window.localStorage.getItem('#notificationNoticesCount-' + value.categoryId));
            //notifications.push(JSON.parse(window.localStorage.getItem('#notificationNoticesCount-' + value.categoryId)));
            if (FeedPluginData.mainCategory.toLowerCase() == "notices") {
                if (window.localStorage['#notificationNoticesCount-' + value.categoryId] != undefined) {
                    value.categoryNotifications = JSON.parse(window.localStorage.getItem('#notificationNoticesCount-' + value.categoryId));
                } else {
                    value.categoryNotifications = 0;
                }
            } else if (FeedPluginData.mainCategory.toLowerCase() == "news") {
                if (window.localStorage['#notificationNewsCount-' + value.categoryId] != undefined) {
                    value.categoryNotifications = JSON.parse(window.localStorage.getItem('#notificationNewsCount-' + value.categoryId));

                } else {
                    value.categoryNotifications = 0;
                }
            }


        });
        $scope.items = FeedPluginData.profileData["interestedCategories"];
        //var iii= FeedPluginData.profileData["interestedCategories"];
        //var ii=0;

        $scope.showDetail = function (index) {
            var selectedItem = $scope.items[index];
            FeedPluginData.selectedItem = selectedItem;
            $scope.ons.navigator.pushPage('feed-master.html', {title: selectedItem.categoryName});
        }

    });

    // Feed Plugin: Master Controller
    module.controller('FeedPluginMasterController', function ($scope, $http, FeedPluginData) {

        $scope.msg = "Loading...";


        $scope.feeds = "";


        //extra
        //td
        //list of variables to send to shubhanshu
        var user_id = FeedPluginData.profileData["user_id"];
        //main category in notice or news
        var mainCategory = FeedPluginData.mainCategory;
        var categoryId = FeedPluginData.selectedItem.categoryId;
        var categoryName = FeedPluginData.selectedItem.categoryName;
        var categoryDescription = FeedPluginData.selectedItem.categoryDescription;
        //which category is clicked
        //showing from local storage here as if internet as if net not there and internet chk take time
        if (window.localStorage["feedEntriesData" + mainCategory + categoryId + categoryName] != undefined) {
            //var errorMessage=response.message;
            $scope.title = categoryName;
            $scope.description = categoryDescription;

            var feedEntriesData = JSON.parse(window.localStorage.getItem('feedEntriesData' + mainCategory + categoryId + categoryName));
            //array formed for to limt to work
            var array = $.map(feedEntriesData, function (value, index) {
                return [value];
            });
            //$scope.feeds=feedEntriesData;
            feedEntriesData = array;
            $scope.feeds = feedEntriesData;
            executeOnSucess(feedEntriesData);

        }

        //close showing from llocal storage
        //alert(user_id);
        var getUrl = "http://collegeboard-env2.elasticbeanstalk.com/noticeInfo/getNotices?userId=" + user_id + "&categoriesToFetch=" + categoryId;
        if (mainCategory.toLowerCase() == "notices") {

            getUrl = "http://collegeboard-env2.elasticbeanstalk.com/noticeInfo/getNotices?userId=" + user_id + "&categoriesToFetch=" + categoryId;

        } else if (mainCategory.toLowerCase() == "news") {
            getUrl = "http://collegeboard-env2.elasticbeanstalk.com/newsInfo/getNews?userId=" + user_id + "&categoriesToFetch=" + categoryId;
        }
        //noticeInfo/getNotices?userId=user_id&categoriesToFetch=categoryId
        //$http({method: 'GET', url: "http://localhost/noticeBoard/www/loginDummy2.php", async: false}).
        $http({
            method: 'GET',
            //url: "http://collegeboard-env2.elasticbeanstalk.com/noticeInfo/getNotices?userId=" + user_id + "&categoriesToFetch=" + categoryId,
            url: getUrl,
            async: false
        }).
            success(function (response, status, headers, config) {


                //new
                var isSuccess = response.success;
                if (isSuccess) {
                    //var register_name = response.data.userName;


                    var responseData = response.data;
                    var feed = {};
                    var entries = {};
                    var count = 0;
                    var entryValueObj = {};

                    if (mainCategory.toLowerCase() == "notices") {

                        $.each(responseData, function (key, value) {

                            entryValueObj = {
                                "id": value.noticeId,
                                "title": value.noticeHeading,
                                "images": {
                                    "url1": value.noticeImageId
                                },
                                "publishedDate": value.creationDate,
                                "content": value.noticeDescription,
                                "urlLink": value.noticeUrl,
                                "socialLink": value.noticeFBUrl,
                                "postedById": value.userInfo.userId,
                                "postedByRoll": value.userInfo.rollNumber,
                                "postedByName": value.userInfo.userName,
                                "contentSnippet": "Click to read"
                            }
                            entries[count++] = entryValueObj;


                        });
                    } else if (mainCategory.toLowerCase() == "news") {
                        $.each(responseData, function (key, value) {

                            entryValueObj = {
                                "id": value.newsId,
                                "title": value.newsHeading,
                                "images": {
                                    "url1": value.newsImageId
                                },
                                "publishedDate": value.creationDate,
                                "content": value.newsDescription,
                                "urlLink": value.newsUrl,
                                "socialLink": value.newsFBUrl,
                                "postedById": value.userInfo.userId,
                                "postedByRoll": value.userInfo.rollNumber,
                                "postedByName": value.userInfo.userName,
                                "contentSnippet": "Click to read"
                            }
                            entries[count++] = entryValueObj;


                        });
                    }


                    feed = {
                        "entries": entries
                    }


                    //var feedData = response.data;
                    $scope.title = categoryName;
                    $scope.description = categoryDescription;
                    //$scope.link = feedData.feed.link;
                    //$scope.feeds = feedData.feed.entries;
                    $scope.feeds = feed.entries;
                    var feedEntriesData = feed.entries;
                    console.log($scope.feeds);
                    var feedEntriesDataJson = JSON.stringify(feedEntriesData);
                    window.localStorage["feedEntriesData" + mainCategory + categoryId + categoryName] = feedEntriesDataJson;
                    //td json formation and storing in memory, retrieving from memory and then showing
                    //below is change from object to array for working of limito filter in feed-master angular

                    //for showing feeds and using limito below has to be ser for array converion from json
                    var array = $.map(feedEntriesData, function (value, index) {
                        return [value];
                    });

                    $scope.feeds = array;
                    feedEntriesData = array;
                    console.log(array);
                    $scope.msg = "";
                    //feedEntriesData is not decoupled from the incomming data so also change in the feed master when data changes
                    executeOnSucess(feedEntriesData);
                } else {
                    //check if data in local storage show that
                    $scope.title = categoryName;
                    $scope.description = categoryDescription;

                    if (window.localStorage["feedEntriesData" + mainCategory + categoryId + categoryName] != undefined) {
                        var errorMessage = response.message;
                        alert("Not able to fetch new data" + errorMessage);
                        var feedEntriesData = JSON.parse(window.localStorage.getItem('feedEntriesData' + mainCategory + categoryId + categoryName));
                        //array formed for to limt to work
                        var array = $.map(feedEntriesData, function (value, index) {
                            return [value];
                        });
                        //scpoe.feeds allocate to the view
                        //$scope.feeds=feedEntriesData;
                        feedEntriesData = array;
                        $scope.feeds = feedEntriesData;
                        //var feedEntriesData=window.localStorage["feedEntriesData"+categoryId+categoryName];
                        executeOnSucess(feedEntriesData);

                    } else {
                        var errorMessage = response.message;
                        alert("Not able to fetch data" + errorMessage);
                    }
                }

            }).
            error(function (data, status, headers, config) {
                if (window.localStorage["feedEntriesData" + mainCategory + categoryId + categoryName] != undefined) {
                    //var errorMessage=response.message;
                    $scope.title = categoryName;
                    $scope.description = categoryDescription;

                    alert("Some internet problem");
                    var feedEntriesData = JSON.parse(window.localStorage.getItem('feedEntriesData' + mainCategory + categoryId + categoryName));
                    //array formed for to limt to work
                    var array = $.map(feedEntriesData, function (value, index) {
                        return [value];
                    });
                    //$scope.feeds=feedEntriesData;
                    feedEntriesData = array;
                    $scope.feeds = feedEntriesData;
                    executeOnSucess(feedEntriesData);

                } else {
                    //var errorMessage=response.message;
                    $scope.title = categoryName;
                    $scope.description = categoryDescription;

                    $scope.msg = 'An error occured:' + status;
                }

            });


        function executeOnSucess(feedEntriesData) {

            //alert(Object.keys(feedEntriesData).length);
            var page = 1;
            // Define the number of the feed results in the page
            var pageSize = 15;
            //console.log(feedData.responseData.feed.entries);
            //$scope.paginationLimit = function(data) {
            $scope.paginationLimit = function () {
                return pageSize * page;
            };
            $scope.hasMoreItems = function () {

                //return page < ($scope.feeds.length / pageSize);
                return page < (Object.keys(feedEntriesData).length / pageSize);
            };

            $scope.showMoreItems = function () {
                page = page + 1;
            };

            $scope.showDetail = function (index) {
                var selectedItem = feedEntriesData[index];
                FeedPluginData.selectedItem = selectedItem;
                $scope.ons.navigator.pushPage('feed-detail.html', selectedItem);
            }


        };

    });

    // Feed Plugin: Detail Controller
    module.controller('FeedPluginDetailController', function ($scope, $http, $sce, FeedPluginData) {
        $scope.item = FeedPluginData.selectedItem;
        //decoupling the selected item
        $scope.item.mainCategory = FeedPluginData.mainCategory;
        $scope.item.title = FeedPluginData.selectedItem.title;
        $scope.item.publishedDate = new Date(FeedPluginData.selectedItem.publishedDate);
        //$scope.item.publishedDate = FeedPluginData.selectedItem.publishedDate;
        $scope.item.content = FeedPluginData.selectedItem.content;
        $scope.item.urlLink = FeedPluginData.selectedItem.urlLink;
        $scope.item.socialLink = FeedPluginData.selectedItem.socialLink;
        $scope.item.postedByName = FeedPluginData.selectedItem.postedByName;
        $scope.item.postedById = FeedPluginData.selectedItem.postedById;
        $scope.item.postedByRoll = FeedPluginData.selectedItem.postedByRoll;
        $scope.item.myUserId = FeedPluginData.profileData["user_id"];
        if ($scope.item.images != undefined) {
            $scope.item.images.url1 = FeedPluginData.selectedItem.images.url1;
        }
        if (FeedPluginData.mainCategory.toLowerCase() == "notices") {
            $scope.item.noticeId = FeedPluginData.selectedItem.id;
        } else if (FeedPluginData.mainCategory.toLowerCase() == "news") {
            $scope.item.newsId = FeedPluginData.selectedItem.id;
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

        //delete a notice or news item
        $scope.deleteItem = function () {
            var confirmed = confirm("Are you sure you want to delete?");
            if (!confirmed){
                return;
            }
        
            var fd = new FormData();
            var setDeleteUrl = "";
            //if news or notice

            if (FeedPluginData.mainCategory.toLowerCase() == "notices") {
                fd.append('noticeId', $scope.item.noticeId);
                setDeleteUrl = "/noticeInfo/deleteNotice";

            } else if (FeedPluginData.mainCategory.toLowerCase() == "news") {
                fd.append('newsId', $scope.item.newsId);
                setDeleteUrl = "/newsInfo/deleteNews";
            }


            var locationOrigin = "http://collegeboard-env2.elasticbeanstalk.com";
            $http.post(locationOrigin + setDeleteUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                var isSuccess = response.success;
                if (isSuccess) {
                    alert("Deleted");
                    //empty the initial variabes of notice

                } else {

                    var errorMessage = response.message;
                    alert("error in deleting try later" + errorMessage);
                    //alert(errorMessage);
                }
            }).error(function (response) {

                //alert(response.message);
                alert("Some problem with the internet or server try later.");
            });


        }

        //close delete call

        $scope.checkItemPermission = function () {

            if ($scope.item.myUserId == $scope.item.postedById) {
                return true;
            } else {
                return false;
            }


        }


        //marking spam and report abuse here function firing post call to the server same function doing both calls

        $scope.setInfoState = function (state) {
            var confirmed = confirm("Are you sure you want to mark report item?");
            if (!confirmed){
                return;
            }
            var fd = new FormData();
            //if news or notice
            var setInfoStateUrl = "";
            if (FeedPluginData.mainCategory.toLowerCase() == "notices") {
                fd.append('noticeId', $scope.item.noticeId);
                setInfoStateUrl = "/noticeInfo/changeNoticeState";

            } else if (FeedPluginData.mainCategory.toLowerCase() == "news") {
                fd.append('newsId', $scope.item.newsId);
                setInfoStateUrl = "/newsInfo/changeNewsState";
            }
            //if spam or abuse
            if (state.toLowerCase() == "spam") {
                fd.append('infoState', "REPORTED_SPAM");

            } else if (state.toLowerCase() == "abuse") {
                fd.append('infoState', "REPORTED_ABUSE");
            }


            var locationOrigin = "http://collegeboard-env2.elasticbeanstalk.com";
            $http.post(locationOrigin + setInfoStateUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                var isSuccess = response.success;
                if (isSuccess) {
                    alert("Reported");
                    //empty the initial variabes of notice

                } else {

                    var errorMessage = response.message;
                    alert("error in reporting try later" + errorMessage);
                    //alert(errorMessage);
                }
            }).error(function (response) {

                //alert(response.message);
                alert("Some problem with the internet or server try later.");
            });


        }

        $scope.getTrustedResourceUrl = function (src) {

            return $sce.trustAsResourceUrl(src);
        }

        $scope.loadURL = function (link) {
            //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
            //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
            //_blank: Opens in the InAppBrowser.
            //_system: Opens in the system's web browser.
            //window.open($scope.item.link,'_blank');
            //alert(link);    
            if (link.substring(0, 4).toLowerCase() != "http") {
                link = "http://" + link;
            }
            window.open(link, '_blank');
        }


    });


    // Contact Controller
    module.controller('noticePostController', function ($scope, $http) {
        var profileData = JSON.parse(window.localStorage.getItem('profileData'));
        var allCategories = profileData.interestedCategories;
        $scope.allCategories = allCategories;
        $scope.disableButton=false;
        $scope.postNoticeButtonText="Post Notice";

        $scope.capturePhotoEdit = function () {
            // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
            navigator.camera.getPicture($scope.onPhotoDataSuccess, $scope.onFail, { quality: 20, allowEdit: true,
                destinationType: destinationType.DATA_URL });
        }
        $scope.onFail = function (message) {
            alert('Failed because: ' + message);
        }
        $scope.onPhotoDataSuccess = function (imageData) {
            // Uncomment to view the base64-encoded image data
            // console.log(imageData);

            // Get image handle
            //
            imageData = "data:image/jpeg;base64," + imageData;

            $scope.imageBlob = $scope.dataURItoBlob(imageData);

            var uploadPreview = document.getElementById('uploadPreview');

            // Unhide image elements
            //
            //uploadPreview.style.display = 'block';

            // Show the captured photo
            // The in-line CSS rules are used to resize the image
            //
            uploadPreview.src =imageData;
        };
        $scope.dataURItoBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);

            }

            return new Blob([ia], {type: mimeString});
        };
        
        $scope.loadImageFile = function(){

       var oFReader = new FileReader(), rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

        oFReader.onload = function (oFREvent) {

          var img=new Image();
          img.onload=function(){
              //document.getElementById("originalImg").src=img.src;
              var canvas=document.createElement("canvas");
              var ctx=canvas.getContext("2d");
              //canvas.width=img.width/2;
              //canvas.height=img.height/2;
              canvas.width=150;
              canvas.height=250;
              ctx.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);
              document.getElementById("uploadPreview").src = canvas.toDataURL();
              var imageData=canvas.toDataURL();
              $scope.imageBlob = $scope.dataURItoBlob(imageData);
          }
          img.src=oFREvent.target.result;
        };
                
        if (document.getElementById("uploadImage").files.length === 0) { return; }
          var oFile = document.getElementById("uploadImage").files[0];
          if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!"); return; }
          oFReader.readAsDataURL(oFile);

        };
        $scope.submitForm = function () {
            $scope.postNoticeButtonText="Wait ...";
            $scope.disableButton=true;
            var heading = $scope.subject;
            var description = $scope.message;
            var url = $scope.url;
            var fbUrl = $scope.fbUrl;
            var imageBlob = $scope.imageBlob;
            var categories = '';

            //for loop all categories time
            /*var i = 0;

             for (i = 0; i < allCategories.length; i++) {
             var cat = $scope.allCategories[i].isSelected;

             if (cat != "") {
             if (categories == "") {
             categories = $scope.allCategories[i].categoryId;
             } else {
             categories = categories + ',' + $scope.allCategories[i].categoryId;
             }
             };

             }*/
            categories = $scope.isSelected;


            /*var cat1=$scope.cat1;
             if (cat1) {
             categories='1';
             };
             alert(cat1);
             var cat2=$scope.cat2;
             if (cat2) {
             categories=categories+',2';
             };*/
            //var cp = $("#imgUri").val();
            /*var imgUri = $scope.imgUri;


            var imgUri = $("#imgUri").val();

            var imgUri = $('input[type=file]')[0].files[0];*/

            var profileData = JSON.parse(window.localStorage.getItem('profileData'));

            var user_id = profileData["user_id"];
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
            fd.append('noticeUrl', url);
            fd.append('noticeFBUrl', fbUrl);
            //fd.append('infoState', 'APPROVED');
            //fd.append('noticeImageFile', imgUri);
            fd.append('noticeImageFile', imageBlob);

            var locationOrigin = "http://collegeboard-env2.elasticbeanstalk.com";
            $http.post(locationOrigin + "/noticeInfo/postNotice", fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                var isSuccess = response.success;
                if (isSuccess) {
                    alert("Your Notice has been posted");
                    $scope.disableButton=false;
                    $scope.postNoticeButtonText="Post Notice";
                    //empty the initial variabes of notice
                    $scope.subject = '';
                    $scope.message = '';
                    $scope.cat1 = '';
                    $scope.url='';
                    $scope.fbUrl='';
                    $scope.imageBlob='';
                    $scope.isSelected='';
                    document.getElementById("uploadPreview").src='';
                } else {

                    var errorMessage = response.message;
                    alert("notice was'nt posted contact us" + errorMessage);
                    $scope.disableButton=false;
                    $scope.postNoticeButtonText="Post Notice";
                    //alert(errorMessage);
                }
            }).error(function (response) {

                //alert(response.message);
                alert("Some problem with the internet or server try later.");
                $scope.disableButton=false;
                $scope.postNoticeButtonText="Post Notice";
            });


        };

    });


    module.controller('newsPostController', function ($scope, $http) {
        var profileData = JSON.parse(window.localStorage.getItem('profileData'));
        var allCategories = profileData.interestedCategories;
        $scope.allCategories = allCategories;
        $scope.disableButton=false;
        $scope.postNewsButtonText="Post News";
        
        $scope.capturePhotoEdit = function () {
            // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
            navigator.camera.getPicture($scope.onPhotoDataSuccess, $scope.onFail, { quality: 20, allowEdit: true,
                destinationType: destinationType.DATA_URL });
        }
        $scope.onFail = function (message) {
            alert('Failed because: ' + message);
        }
        $scope.onPhotoDataSuccess = function (imageData) {
            imageData = "data:image/jpeg;base64," + imageData;

            $scope.imageBlob = $scope.dataURItoBlob(imageData);

            var uploadPreview = document.getElementById('uploadPreview');

            uploadPreview.src =imageData;

        };
        $scope.dataURItoBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);

            }

            return new Blob([ia], {type: mimeString});
        };
        
        $scope.loadImageFile = function(){

       var oFReader = new FileReader(), rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

        oFReader.onload = function (oFREvent) {

          var img=new Image();
          img.onload=function(){
              //document.getElementById("originalImg").src=img.src;
              var canvas=document.createElement("canvas");
              var ctx=canvas.getContext("2d");
              //canvas.width=img.width/2;
              //canvas.height=img.height/2;
              canvas.width=150;
              canvas.height=250;
              ctx.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);
              document.getElementById("uploadPreview").src = canvas.toDataURL();
              var imageData=canvas.toDataURL();
              $scope.imageBlob = $scope.dataURItoBlob(imageData);
          }
          img.src=oFREvent.target.result;
        };
                
        if (document.getElementById("uploadImage").files.length === 0) { return; }
          var oFile = document.getElementById("uploadImage").files[0];
          if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!"); return; }
          oFReader.readAsDataURL(oFile);

        };

        $scope.submitForm = function () {
            $scope.disableButton=true;
            $scope.postNewsButtonText="Wait...";
            var heading = $scope.subject;
            var description = $scope.message;
            var url = $scope.url;
            var fbUrl = $scope.fbUrl;
            var categories = '';
            var imageBlob = $scope.imageBlob;
            categories = $scope.isSelected;

            var profileData = JSON.parse(window.localStorage.getItem('profileData'));

            var user_id = profileData["user_id"];
            var fd = new FormData();
            fd.append('userId', user_id);
            fd.append('newsHeading', heading);
            fd.append('newsDescription', description);
            fd.append('categories', categories);
            fd.append('newsUrl', url);
            fd.append('newsFBUrl', fbUrl);
            //fd.append('infoState', 'APPROVED');
            //fd.append('newsImageFile', imgUri);
            fd.append('newsImageFile', imageBlob);

            var locationOrigin = "http://collegeboard-env2.elasticbeanstalk.com";
            $http.post(locationOrigin + "/newsInfo/postNews", fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                var isSuccess = response.success;
                if (isSuccess) {
                    alert("Your news has been posted");
                    $scope.disableButton=false;
                    $scope.postNewsButtonText="Post News";
                    //empty the initial variabes of news
                    $scope.subject = '';
                    $scope.message = '';
                    $scope.cat1 = '';
                    $scope.url='';
                    $scope.fbUrl='';
                    $scope.imageBlob='';
                    $scope.isSelected='';
                    document.getElementById("uploadPreview").src='';
                } else {

                    var errorMessage = response.message;
                    alert("news was'nt posted contact us" + errorMessage);
                    $scope.disableButton=false;
                    $scope.postNewsButtonText="Post News";
                    //alert(errorMessage);
                }
            }).error(function (response) {

                //alert(response.message);
                alert("Some problem with the internet or server try later.");
                $scope.disableButton=false;
                $scope.postNewsButtonText="Post News";
            });


        };

    });


    module.controller('menuController', function ($scope) {


        //$scope.items = FeedPluginData.selectedItem.items;

        $scope.showHiddenHome = function () {
            $('#toolbar').show();
            $('#category-page').show();

        }

    });

})();

