$(document).ready(initializeApp);
/* Upon loading page default location is set to Los Angeles
Accompanying data will reflect this
 */
var geo_info_object = {
    lat: 34.0522 ,
    lon: -118.2437,
    city: "Los Angeles",
    state: "California"
};

/*
Set click handler for submit button; call geocode function
load pie chart for future use using google source link found in head of index.html
callApi function to coordinate api calls.
 */
function initializeApp() {
    var submit_button = $('#submit_button');
    submit_button.on('click', geocode);
    google.charts.load('current', {'packages':['corechart']});
    callApi();

}

//*********************** open weather api *************************
/*
url:http://api.openweathermap.org/data/2.5/weather?lat=' +
        geo_info_object.lat + '&lon=' +
        geo_info_object.lon + '&units=metric&appid=b231606340553d9174136f7f083904b3
api-key: 262d0228050ee6334c5273af092b068c
@param: none
@return: none
Call function weatherOutput
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
            console.log('weather description: '+ data['weather'][0]['description']);
            if(data['weather'][0]['description'] === 'broken clouds'){
              $('#weatherIcon').attr('src', 'images/weather_icon/sun-rays-cloud.png');
            }else if(data['weather'][0]['description'] === 'clear sky'){
                $('#weatherIcon').attr('src', 'images/weather_icon/sun-rays-small.png');
            }else if(data['weather'][0]['description'] === 'scattered clouds'){
                $('#weatherIcon').attr('src', 'images/weather_icon/cloud.png');
            }else if(data['weather'][0]['description'] === 'shower rain'){
                $('#weatherIcon').attr('src', 'images/weather_icon/cloud-rain.png');
            }else if(data['weather'][0]['description'] === 'rain'){
                $('#weatherIcon').attr('src', 'images/weather_icon/cloud-rain.png');
            }else if(data['weather'][0]['description'] === 'thunderstorm'){
                $('#weatherIcon').attr('src', 'images/weather_icon/cloud-dark-multiple-lightning.png');
            }else if(data['weather'][0]['description'] === 'snow'){
                $('#weatherIcon').attr('src', 'images/weather_icon/cloud-dark-snow.png');
            }else if(data['weather'][0]['description'] === 'mist'){
                $('#weatherIcon').attr('src', 'images/weather_icon/cloud-fog.png');
            }
        },
        error: function () {
            $('.data').text('Sorry, your temperature info is missing!')
        }
    })
}

/*
Called by handleWeatherInfo
return: none
param: none
 */
function weatherOutput() {
    $('#weatherCity').empty();
    $('#weatherCurrent').empty();
    $('#weatherTemp').empty();
    $('#weatherHumidity').empty();
    $('#weatherCity').append('City: ' + geo_info_object.city);
    $('#weatherCurrent').append('Current Temperature: ' + geo_info_object.temperature + '&deg; C');
    $('#weatherTemp').append('Temperature: ' + geo_info_object.minTemp + '&deg; C'+ ' - ' + geo_info_object.maxTemp + '&deg; C');
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
/* geocode function takes the click event as a parameter in order to prevent its default behavior
    -grabs value of input and makes ajax call to google maps geocode API
    -gather geolocation data from the API and call the callApi.
    -Function skeleton taken from google maps geocode documentation.
 */
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
            geo_info_object = {
                lat: (data.results[0].geometry.location.lat),
                lon: (data.results[0].geometry.location.lng),
                city: city,
                state: state
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
/*
function takes 2 params: latitude and longitude found in geocode function
map location is centered on the these params
function skeleton taken from google maps API documentation
 */
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
                $('#aqi-city').text(keyword);
                $('#aqiNum').text('N/A');
                $('#h_implications').text('No health implications at this time, please try again later.');
                $('#c_statement').text('No cautionary statements at this time, please try again later.');
                $('#aqi-number-container').css({
                    'background-color':'#80d6f9',
                    'font-size':'2vmin'
                });
                return;
            }
            // if the first station in the array does not have an aqi available, it will check until it finds one
            for (var i=0; i<result.data.length; i++) {
                geo_info_object.aqi = result.data[i].aqi;
                if (geo_info_object.aqi !== '' && geo_info_object.aqi !== '-') {
                    determineAqiLevel(geo_info_object.aqi, keyword);
                    return;
                }  
                // determineAqiLevel(geo_info_object.aqi, keyword);
            }
            console.log('**************NO AQI AVAILABLE FOR ' + keyword);
            $('#aqi-city').text(keyword);
            $('#aqiNum').text('N/A');
            $('#h_implications').text('No health implications at this time, please try again later.');
            $('#c_statement').text('No cautionary statements at this time, please try again later.');
            $('#aqi-number-container').css({
                'background-color':'#80d6f9',
                'font-size':'2vmin'
            });
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
    renderAqiInfoOnDom(keyword,aqi,healthImplications,cautionaryStmt,colorLvl);
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
    debugger;
    $('#aqi-city').text(keyword);
    $('#aqiNum').text(aqi);
    $('#h_implications').text(healthImplications);
    $('#c_statement').text(cautionaryStmt);
    $('#aqi-number-container').css({
        'background-color': colorLvl,
        'font-size':'2vmin'
    });
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

/*
*   url: https://newsapi.org/v2/everything?sources=national-geographic&&apiKey=API_key
*   key: 626bed419f824271a515c974d606275b
*   Create a function called getDataByLocation
*   Takes in 2 parameters
*   @param q - keywords
*   @param source - news sources
*   @returns Object of status and array of articles container article info
*
*/

// Function for news data retrieval
function getNewsData() {
    // Calling format text area function to retrieve data from input, formats string to pass api param properly
    var cityName= formatTextArea();
    // Clears news list display to repopulate updated search
    $(".newsListDisplay").text("");
    // Different news sources pulled from National Geo, Google News, New Scientist, and The Huffington Post through News API
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
    var googleAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=google-news&q=" + cityName + "+climate&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from Google news: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var scienceAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=new-scientist&q=" + cityName + "+climate+environment&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            console.log("Data received from New Scientist news: ", data);
            displayNewsData(data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var huffingtonAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=the-huffington-post&q=" + cityName + "+climate+environment&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            console.log("Data received from Huffington news: ", data);
            displayNewsData(data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    // Ajax calls from news sources
    $.ajax(nationalGeoAPIajaxOptions);
    $.ajax(googleAPIajaxOptions);
    $.ajax(scienceAPIajaxOptions);
    $.ajax(huffingtonAPIajaxOptions);
}

// Function to display proper news data to div
function displayNewsData(data) {
    // Declare variables to use when storing data from News API and displaying on DOM
    var newsInfoArray = [];
    var newsInfo;
    var newsTitleDiv;
    var newsAuthorDiv;
    var newsLinkTag;
    var newsModalLink;
    var newsSourceDiv;
    var image;
    var newsItems;
    // Loops through data retrieved from news API to store data in object needed for app
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
        // Create on object of necessary values from API and push into array for later use
        newsInfoArray.push(newsInfo);
    }
    // Loop to create dom element for each news article pulled from News API
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
    // Function to display detailed info of article on modal
    function displayModal () {
            // Declare variable to store news article link
            var fullArticleLink;
            // Created function to loop through array and pull up the correct info according what was clicked. Used closure to get snapshot of what is being clicked to populate modal with correct data
            (function () {
            for (var newsClickIndex = 0; newsClickIndex < newsInfoArray.length; newsClickIndex++) {
                fullArticleLink = $("<a>", {
                    href: newsInfoArray[newsClickIndex].newsLink,
                    text: "here",
                    target: "_blank"
                })
                // Compares the index position property with the index of the current iterated item and clicked items news source property and the current iterated items news source
                if ($(event.target).parent()[0].indexPosition === newsClickIndex && $(event.target).parent()[0].newsSource === newsInfoArray[newsClickIndex].newsSourceID) {
                    // If so, populate info on modal with corresponding info
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
    }
}
// Function to format value from user input to send as param to ajax api request
function formatTextArea() {
    var enteredText = geo_info_object.city.split(" ").join('+');
    return enteredText;
}

// Drawing Pie Chart
/*
function drawChart updates the initial chart that was loaded earlier (on page load) with data collected after Carma ajax call
returns a pie chart that shows various forms of energy production in the given state that was inputted
function skeleton taken from google pie chart documentation
 */

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