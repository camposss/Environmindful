//GOOGLE FUSION TABLE API: AIzaSyBWgR4nfF3j9TO6kvtsSkTwxeqNu10M60Q
//URL:
$(document).ready(initializeApp);
var geo_info_object = {
    lat: 34.0522 ,
    lon: -118.2437,
    city: "Los Angeles",
    state: "California"
};

function initializeApp() {
    var submit_button = $('#submit_button');
    submit_button.on('click', geocode);
    $("#myModal").show("modal");
    google.charts.load('current', {'packages':['corechart']});
    callApi();

}

//*********************** open weather api *************************
/*

 */

function handleWeatherInfo() {
    $.ajax({
        method: 'get',
        data: {
            api_key: '262d0228050ee6334c5273af092b068c',
            latitude: geo_info_object.lat,
            longitude: geo_info_object.lon
        },
        url: 'http://api.openweathermap.org/data/2.5/weather?lat=' +
        geo_info_object.lat + '&lon=' +
        geo_info_object.lon + '&units=metric&appid=b231606340553d9174136f7f083904b3',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var dataMain = data['main'];
            // var cityName = geo_info_object.city;
            geo_info_object.temperature = dataMain['temp'];
            geo_info_object.humidity = dataMain['humidity'];
            geo_info_object.minTemp = dataMain['temp_min'];
            geo_info_object.maxTemp = dataMain['temp_max'];
            weatherOutput();
        },
        error: function () {
            $('.data').text('Sorry, your temperature info is missing!')
        }
    })
}

function weatherOutput() {
    $('#weatherCity').empty();
    $('#weatherCurrent').empty();
    $('#weatherTemp').empty();
    $('#weatherHumidity').empty();
    $('#weatherCity').append('City: ' + geo_info_object.city);
    $('#weatherCurrent').append('Current Temperature: ' + geo_info_object.temperature + '&deg;');
    $('#weatherTemp').append('Temperature: ' + geo_info_object.minTemp + '&deg;'+ '- ' + geo_info_object.maxTemp + '&deg;');
    $('#weatherHumidity').append('Humidity: ' + geo_info_object.humidity + '%');
}









/*
*   url: http://carma.org/api/  
*   key/token: NA
*   Calls successfulCarmaPull upon successful ajax call 
*   @parameter - none
*   @callback chart - calls drawChart function
*   @returns - none
*
*/
function pullFromCarma() {

    var proxy = 'http://cors-anywhere.herokuapp.com/'
    $.ajax({
        dataType: 'json',
        url: proxy + 'http://carma.org/api/1.1/searchLocations?name=' + geo_info_object.state,
        method: 'get',
        success: successfulCarmaPull,
        error: errorPull
    });

}

/*
Pulls Carma data, adds data to geo info object and calls drawChart
*/
function successfulCarmaPull(data) {
    geo_info_object.fossil = parseFloat(data[0].fossil.present);
    geo_info_object.hydro = parseFloat(data[0].hydro.present);
    geo_info_object.nuclear = parseFloat(data[0].nuclear.present);
    geo_info_object.renewable = parseFloat(data[0].renewable.present);
    
    google.charts.setOnLoadCallback(drawChart);
}

function errorPull(data) {
    console.log('something went wrong :(', data);
}

function geocode(e) {
    console.log("hello");
    //prevent actual submit
    e.preventDefault();
    var location = document.getElementById('location-input').value;
    $.ajax("https://maps.googleapis.com/maps/api/geocode/json?", {
        method: "get",
        data: {
            address: location,
            key: "AIzaSyD2vYz71KVg4PUiyae7M21lCA1Wkh0b8RY"
        },
        success: function (data) {
            console.log(data);
            //geometry
            var city;
            var state;
            var addressComponentArray= data.results[0].address_components;
            if(addressComponentArray[0].types[0]==="locality"){
                city= addressComponentArray[0].long_name;
            }
            if(addressComponentArray.length===4){
                state=addressComponentArray[2].long_name;
            }else if(addressComponentArray.length===3){
                state=addressComponentArray[1].long_name;
            }
            // if((data.results[0].address_components[2].types[0]==="administrative_area_level_1")){
            //     state= (data.results[0].address_components[2].long_name);
            // }
            geo_info_object = {
                lat: (data.results[0].geometry.location.lat),
                lon: (data.results[0].geometry.location.lng),
                city: city,
                state: state
                // city: (data.results[0].address_components[0].long_name),
                // state: (data.results[0].address_components[1].long_name),
                // country: (data.results[0].address_components[2].long_name)
            };

            console.log('GeoInfoObj: ' +geo_info_object);

            callApi();
        }
    });
}

function callApi() {
        initMap(geo_info_object.lat, geo_info_object.lon);
        $(".newsListDisplay").text("");
        getNewsData();
        handleWeatherInfo();
        pullFromCarma();
        getAqiData(geo_info_object.state);
}

function initMap(lat, lng) {

    var center = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('map_display'), {
        zoom: 12,
        center: center
    });
    var marker = new google.maps.Marker({
        position: center,
        map: map
    });
}


// **********************CESKA'S CODE -- AIR POLLUTION API -- START**********************

/*
*   url: http://api.waqi.info/search/?token=TOKEN&keyword=KEYWORD    
*   key/token: 1af10262d0228050ee6334c5273af092b068ca53
*   Create a function called getAqiData 
*   Takes in 1 parameter
*   @param keyword - STATE??
*   @callback determineAqiLevel - takes in aqi as a param, see function for further info
*   @returns aqi - {string} number
*
*/

function getAqiData(keyword) {
    console.log('*************************GET STATIONS BY KEYWORD FUNCTION IS BEING CALLED*************************');
    $.ajax({
        data: {
            api_key: '1af10262d0228050ee6334c5273af092b068ca53' //variable api_key not being used at the moment, it is hardcoded into the url
        },
        method: 'GET',
        dataType: 'json',
        url: 'http://api.waqi.info/search/?token=1af10262d0228050ee6334c5273af092b068ca53&keyword=' + keyword + ',USA',
        success: function(result) {
            if (result.data.length === 0) {
                console.log('************** NO STATIONS EXIST IN ' + keyword);
                return;
            }
            // if the first station in the array does not have an aqi available, it will check until it finds one
            for (var i=0; i<result.data.length; i++) {
                var checkAqi = result.data[i].aqi;
                if (checkAqi !== '' && checkAqi !== '-') {
                    determineAqiLevel(checkAqi, keyword);
                    return;
                }  
                // determineAqiLevel(checkAqi, keyword);
            }
            console.log('**************NO AQI AVAILABLE FOR ' + keyword);
            // return checkAqi;
        },
        error: function (result) {
            console.log('handleAirQuality ajax call resulted in error', result);
        }
    })

}

/*
*   Create a function called determineAqiLevel
*   This function will determine where the aqi falls on the air quality index scale (color coded)
*   Possibly append health implications and cautionary statement somewhere on DOM
*   Takes in 2 parameters
*   @param aqi - {string} number 
*   @param keyword - state (will work with city or country too)
*   @returns {currently unknown, if any}
*   @calls renderAqiInfoOnDom
*   
*/

function determineAqiLevel(aqi, keyword) {
    var airPollutionLvl;
    var healthImplications;
    var cautionaryStmt;
    var colorLvl;

    if (aqi > 0 && aqi < 50) {
        colorLvl = '#009966'; //green
        airPollutionLvl = 'Good';
        healthImplications = 'Air quality is considered satisfactory, and air pollution poses little or no risk';
        cautionaryStmt = 'None';

    } else if (aqi > 50 && aqi < 100) {
        colorLvl = '#ffde33'; //yellow
        airPollutionLvl = 'Moderate';
        healthImplications = 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.';
        cautionaryStmt = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';

    } else if (aqi > 100 && aqi < 150) {
        colorLvl = '#ff9933'; //orange
        airPollutionLvl = 'Unhealthy for Sensitive Groups';
        healthImplications = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
        cautionaryStmt = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';

    } else if (aqi > 151 && aqi < 200) {
        colorLvl = '#cc0033'; //red
        airPollutionLvl = 'Unhealthy';
        healthImplications = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects';
        cautionaryStmt = 'Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion';

    } else if (aqi > 201 && aqi < 300) {
        colorLvl = '#660099'; //purple
        airPollutionLvl = 'Very Unhealthy';
        healthImplications = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
        cautionaryStmt = 'Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.';
    
    } else if (aqi > 300) {
        colorLvl = '#7e0023'; //dark red
        airPollutionLvl = 'Hazardous';
        healthImplications = 'Health alert: everyone may experience more serious health effects';
        cautionaryStmt = 'Everyone should avoid all outdoor exertion';
    } else {
        console.log('*****NO AQI AVAILABLE*****');
    }
    console.log('*****State: ' + keyword);
    console.log('*****Air Quality Level: ', aqi);
    console.log('*****Air Pollution Level: ' + airPollutionLvl);
    console.log('*****Health Implications: ' + healthImplications);
    console.log('*****Cautionary Statement: ' + cautionaryStmt);
    renderAqiInfoOnDom(keyword,aqi,healthImplications,cautionaryStmt,colorLvl)
}

/*
*   Create a function called renderAqiInfoOnDom
*   Takes in 5 parameters
*   @param keyword - state (will work with city or country too)
*   @param aqi - {string} number
*   @param healthImplications 
*   @param cautionaryStmt 
*   @param  colorLvl 
*   @returns closest station to the lat and lon
*
*/

function renderAqiInfoOnDom(keyword,aqi,healthImplications,cautionaryStmt,colorLvl) {
    $('.aqi-city').text(keyword);
    $('#aqiNum').text(aqi);
    $('#h_implications').text(healthImplications);
    $('#c_statement').text(cautionaryStmt);
    $('#aqi-number-container').css('background-color', colorLvl);
}

/*
*   url: http://api.waqi.info/feed/geo:LAT;LON/?token=TOKEN
*   key/token: 1af10262d0228050ee6334c5273af092b068ca53
*   Create a function called getDataByLocation
*   Takes in 2 parameters
*   @param lat - latitude
*   @param lon - longitude
*   @returns closest station to the lat and lon
*
*/

//HELLO THERE! I HAVE NO IDEA IF THIS FUNCTION IS WORKING :) PLEASE LET ME KNOW IF YOU DECIDE TO USE IT.
function getDataByLocation(lat, lon) {
    $.ajax({
        data: {
            api_key: '1af10262d0228050ee6334c5273af092b068ca53' //variable api_key not being used at the moment, it is hardcoded into the url
        },
        method: 'GET',
        dataType: 'json',
        url: 'http://api.waqi.info/feed/geo:' + lat + ';' + lon + '/?token=1af10262d0228050ee6334c5273af092b068ca53',
        success: function (result) {
            var aqi = result.data[0].aqi; //only grabbing the first element in the array
            determineAqiLevel(aqi);
            return aqi;
            console.log('getDataByLocation call was successful', result);
        },
        error: function (result) {
            console.log('getDataByLocation call resulted in error', result);
        }
    })
}

// **********************CESKA'S CODE -- AIR POLLUTION API -- END**********************


// News API Functionality


function getNewsData() {
    var cityName= formatTextArea();
    $(".newsListDisplay").text("");
    var nationalGeoAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=national-geographic&q=" + cityName + "+climate&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from National Geo: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var abcAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=abc-news&q=" + cityName + "+climate&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from ABC news: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var scienceAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=new-scientist&q=" + cityName + "+climate+environment&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            console.log("Data received from CNN news: ", data);
            displayNewsData(data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    $.ajax(nationalGeoAPIajaxOptions);
    $.ajax(abcAPIajaxOptions);
    $.ajax(scienceAPIajaxOptions);
}

function displayNewsData(data) {
    // if ($("#location-input").val() === "") {
    //     $("#location-input").attr({
    //         placeholder: "Please enter keywords to search."
    //     });
    //     return;
    // }
    var newsInfoArray = [];
    var newsInfo;
    var newsTitleDiv;
    var newsAuthorDiv;
    var newsLinkTag;
    var newsModalLink;
    var newsSourceDiv;
    var image;
    var newsItems;
    for (var newsIndex = 0; newsIndex < data.articles.length; newsIndex++) {
        newsInfo = {
            newsTitle: data.articles[newsIndex].title,
            newsSource: data.articles[newsIndex].source.name,
            newsAuthor: data.articles[newsIndex].author,
            description: data.articles[newsIndex].description,
            newsLink: data.articles[newsIndex].url,
            imgSource: data.articles[newsIndex].urlToImage,
            newsSourceID: data.articles[newsIndex].source.id
        };
        newsInfoArray.push(newsInfo);
    }
    for (var newsInfoArrayIndex = 0; newsInfoArrayIndex < newsInfoArray.length; newsInfoArrayIndex++) {
        newsAuthorDiv = $("<div>", {
            "class": "newsAuthor",
            text: "By: " + newsInfoArray[newsInfoArrayIndex].newsAuthor
        });
        newsLinkTag = $("<a>", {
            text: newsInfoArray[newsInfoArrayIndex].newsTitle
        }).addClass("newsLink");
        newsLinkTag.click(displayModal);
        newsModalLink = $("<a>", {
            text: "here",
            href: newsInfoArray[newsInfoArrayIndex].newsLink
        });
        image = $("<img>", {
            src: newsInfoArray[newsInfoArrayIndex].imgSource,
            class: "newsModalImage"
        });
        newsSourceDiv = $("<div>", {
            "class": "newsSourceLink",
            text: "Source: " + newsInfoArray[newsInfoArrayIndex].newsSource
        });
        newsItems = $("<div>").addClass("newsItem").append(newsLinkTag, newsAuthorDiv, newsSourceDiv);
        $(".newsListDisplay").append(newsItems);
        newsItems[0].indexPosition = newsInfoArrayIndex;
        newsItems[0].newsSource = data.articles[newsInfoArrayIndex].source.id;
        console.log("Here is a news item: ", newsItems);
    }
    function displayModal () {
            var fullArticleLink;
            (function () {
            for (var newsClickIndex = 0; newsClickIndex < newsInfoArray.length; newsClickIndex++) {
                fullArticleLink = $("<a>", {
                    href: newsInfoArray[newsClickIndex].newsLink,
                    text: "here",
                    target: "_blank"
                })
                if ($(event.target).parent()[0].indexPosition === newsClickIndex && $(event.target).parent()[0].newsSource === newsInfoArray[newsClickIndex].newsSourceID) {
                    $(".modal-title").text(newsInfoArray[newsClickIndex].newsTitle);
                    $(".img-container").text("");
                    $(".img-container").append($("<img>", {
                        src: newsInfoArray[newsClickIndex].imgSource,
                        "class": "newsModalImage"
                    }));
                    $(".modal-body p").text(newsInfoArray[newsClickIndex].description);
                    $(".fullArticle").text("See full article: ").append(fullArticleLink);
                    $("#newsModal").modal("show");
                }
            }
        })()
        // console.log(newsInfoArray);
        // console.log($(this).parent()[0].indexPosition);
        // console.log($(this).parent()[0].newsSource);
    }
}

function formatTextArea() {
    //var enteredText = $("#location-input").val().split(" ").join("+");
    var enteredText = geo_info_object.city.split(" ").join('+');
    return enteredText;
}


function drawChart() {

    var data = google.visualization.arrayToDataTable([
        ['Element', 'Presentage'],
        ['Fossil',geo_info_object.fossil],
        ['Hydro',geo_info_object.hydro],
        ['Nuclear',geo_info_object.nuclear],
        ['Renewable',geo_info_object.renewable]
    ]);

    var options = {
        title: geo_info_object.state +' Energy Production'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}

