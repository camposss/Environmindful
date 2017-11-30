var dataPlanet = {};
var dataCarma = {};

//GOOGLE FUSION TABLE API: AIzaSyBWgR4nfF3j9TO6kvtsSkTwxeqNu10M60Q
//URL:
$(document).ready(initializeApp);
var geo_info_object = null;

function initializeApp() {
    $(".getNews").click(getNewsData);
    var submit_button = $('#submit_button');
    submit_button.on('click', geocode);
    $("#myModal").show("modal");
}

///////open weather api

function handleWeatherInfo() {
    $.ajax({
        method: 'get',
        data: {
            api_key: '262d0228050ee6334c5273af092b068c',
            latitude: geo_info_object.lat,
            longitude: geo_info_object.lon,
        },
        url: 'http://api.openweathermap.org/data/2.5/weather?lat=' +
        geo_info_object.lat + '&lon=' +
        geo_info_object.lon + '&units=metric&appid=b231606340553d9174136f7f083904b3',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var cityName = geo_info_object.city;
            var temperature = data['main']['temp'];
            var humidity = data['main']['humidity'];
            var minTemp = data['main']['temp_min'];
            var maxTemp = data['main']['temp_max'];
            $('.data').empty();
            $('.data').append('City: ' + cityName, '<br>', 'Current Temperature: ' + temperature + '&deg;', '<br>', 'Temperature: ' + minTemp + '&deg;'+ '-' + maxTemp + '&deg;', '<br>', 'Humidity: ' + humidity);
        },
        error: function () {
            $('.data').text('Sorry, your temperature info is missing!')
        }
    })
}

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

function successfulCarmaPull(data) {
    console.log(data);
    debugger
    // dataCarma = data;

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(function() {
        drawChart(data);
    });
}

function errorPull(data) {
    console.log('something went wrong :(', data);
}

function pullFromPlanetOs() {
    var proxy = 'http://cors-anywhere.herokuapp.com/'
    $.ajax({
        dataType: 'json',
        url: proxy+'https://api.planetos.com/v1/datasets/fmi_silam_global05/point?',
        method: 'get',
        data: {
            origin: 'dataset-details',
            lat: geo_info_object.lat,
            lon: geo_info_object.lon,
            apikey: 'bdbcb059658f4b788838a5d957bf6ba8'
        },
        success: successfulPlanetPull,
        error: errorPull
    });
}

function successfulPlanetPull(data) {
    console.log("PlanetOS Data: " + data.entries);
    dataPlanet = data.entries['0'].data;
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
            geo_info_object = {
                lat: (data.results[0].geometry.location.lat),
                lon: (data.results[0].geometry.location.lng),
                city: (data.results[0].address_components[0].long_name),
                state: (data.results[0].address_components[1].long_name),
                country: (data.results[0].address_components[2].long_name)
            };
            console.log('GeoInfoObj: ' +geo_info_object);
            initMap(geo_info_object.lat, geo_info_object.lon);
            handleWeatherInfo();
            pullFromCarma();
            pullFromPlanetOs();
            getStationsByKeyword(geo_info_object.state);
            // getDataByLocation(geo_info_object.lat, geo_info_object.lon);
            handleWeatherInfo();
            pullFromCarma();
            pullFromPlanetOs();
        }
    });
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
*   Create a function called getStationsByKeyword 
*   Takes in 1 parameter
*   @param keyword - city, state, country
*   @callback determineAqiLevel - takes in aqi as a param, see function for further info
*   @returns aqi - number
*
*/

function getStationsByKeyword(keyword) {
    $.ajax({
        data: {
            api_key: '1af10262d0228050ee6334c5273af092b068ca53' //variable api_key not being used at the moment, it is hardcoded into the url
        },
        method: 'GET',
        dataType: 'json',
        url: 'http://api.waqi.info/search/?token=1af10262d0228050ee6334c5273af092b068ca53&keyword=' + keyword + ',USA',
        success: function(result) {
            var aqi = result.data[0].aqi; //only grabbing the first element in the array
            determineAqiLevel(aqi, keyword);
            return aqi;
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
*   Takes in 1 parameter
*   @param aqi - number 
*   @returns {currently unknown, if any}
*   
*/

function determineAqiLevel(aqi, keyword) {
    console.log('Air Quality Level: ', aqi);
    var airPollutionLvl;
    var healthImplications;
    var cautionaryStmt;
    var colorLvl;

    if (aqi > 0 && aqi < 50) {
        colorLvl = '#009966'; //green
        airPollutionLvl = 'Good';
        healthImplications = 'Air quality is considered satisfactory, and air pollution poses little or no risk';
        cautionaryStmt = 'None';

        // $('.aqi-city').text(keyword);
        // $('#aqiNum').text(aqi);
        // $('#h_implications').text(healthImplications);
        // $('#c_statement').text(cautionaryStmt);

        console.log('Air Pollution Level: ' + airPollutionLvl);
        console.log('Health Implications: ' + healthImplications);
        console.log('Cautionary Statement: ' + cautionaryStmt);
    } else if (aqi > 50 && aqi < 100) {
        colorLvl = '#ffde33'; //yellow
        airPollutionLvl = 'Moderate';
        healthImplications = 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.';
        cautionaryStmt = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';
        console.log('Air Pollution Level: ' + airPollutionLvl);
        console.log('Health Implications: ' + healthImplications);
        console.log('Cautionary Statement: ' + cautionaryStmt);
    } else if (aqi > 100 && aqi < 150) {
        colorLvl = '#ff9933'; //orange
        airPollutionLvl = 'Unhealthy for Sensitive Groups';
        healthImplications = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
        cautionaryStmt = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';
        console.log('Air Pollution Level: ' + airPollutionLvl);
        console.log('Health Implications: ' + healthImplications);
        console.log('Cautionary Statement: ' + cautionaryStmt);
    } else if (aqi > 151 && aqi < 200) {
        colorLvl = '#cc0033'; //red
        airPollutionLvl = 'Unhealthy';
        healthImplications = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects';
        cautionaryStmt = 'Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion';
        console.log('Air Pollution Level: ' + airPollutionLvl);
        console.log('Health Implications: ' + healthImplications);
        console.log('Cautionary Statement: ' + cautionaryStmt);
    } else if (aqi > 201 && aqi < 300) {
        colorLvl = '#660099'; //purple
        airPollutionLvl = 'Very Unhealthy';
        healthImplications = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
        cautionaryStmt = 'Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.';
        console.log('Air Pollution Level: ' + airPollutionLvl);
        console.log('Health Implications: ' + healthImplications);
        console.log('Cautionary Statement: ' + cautionaryStmt);
    } else if (aqi > 300) {
        colorLvl = '#7e0023'; //dark red
        airPollutionLvl = 'Hazardous';
        healthImplications = 'Health alert: everyone may experience more serious health effects';
        cautionaryStmt = 'Everyone should avoid all outdoor exertion';
        console.log('Air Pollution Level: ' + airPollutionLvl);
        console.log('Health Implications: ' + healthImplications);
        console.log('Cautionary Statement: ' + cautionaryStmt);
    }
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
    $(".newsListDisplay").text("");
    var nationalGeoAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=national-geographic&q=" + formatTextArea() + "+climate&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from National Geo: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var abcAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=abc-news&q=" + formatTextArea() + "+climate&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from ABC news: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var scienceAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=new-scientist&q=" + formatTextArea() + "+climate+environment&apiKey=626bed419f824271a515c974d606275b",
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
    if ($("#location-input").val() === "") {
        $("#location-input").attr({
            placeholder: "Please enter keywords to search."
        });
        return;
    }
    var newsInfoArray = [];
    var newsInfo;
    var newsTitleDiv;
    var newsAuthorDiv;
    var newsLinkTag;
    var newsModalLink;
    var newsSourceDiv;
    var image;
    for (var newsIndex = 0; newsIndex < data.articles.length; newsIndex++) {
        newsInfo = {
            newsTitle: data.articles[newsIndex].title,
            newsSource: data.articles[newsIndex].source.name,
            newsAuthor: data.articles[newsIndex].author,
            description: data.articles[newsIndex].description,
            newsLink: data.articles[newsIndex].url,
            imgSource: data.articles[newsIndex].urlToImage
        };
        newsInfoArray.push(newsInfo);
    }
    console.log(newsInfoArray);
    for (var i = 0; i < newsInfoArray.length; i++) {
        newsAuthorDiv = $("<div>", {
            "class": "newsAuthor",
            text: "By: " + newsInfoArray[i].newsAuthor
        });
        newsLinkTag = $("<a>", {
            text: newsInfoArray[i].newsTitle
        }).addClass("newsSourceLink");
        newsModalLink = $("<a>", {
            text: "here",
            href: newsInfoArray[i].newsLink
        });
        image = $("<img>", {
            src: newsInfoArray[i].imgSource,
            class: "newsModalImage"
        });
        newsLinkTag.on('click', function () {
            $("#newsModal").modal('show');
            $(".modal-title").text(newsInfoArray[i].newsTitle);
            $(".modal-body p").text(newsInfoArray[i].description);
            $(".img-container").append(newsInfoArray[i].image);
            $(".fullArticle").text("See full article here: ").append(newsInfoArray[i].newsLink);
        });
        newsSourceDiv = $("<div>", {
            "class": "newsSourceLink",
            text: "Source: " + newsInfoArray[i].newsSource
        });
        var newsItems = $("<div>").addClass("newsItem").append(newsLinkTag, newsAuthorDiv, newsSourceDiv);
        $(".newsListDisplay").append(newsItems);
    }
}

function formatTextArea() {
    var enteredText = $("#location-input").val().split(" ").join("+");
    return enteredText;
}


function drawChart(carma) {
    console.log("draw the chart", carma);
    var airQuality = carma[0];

    var data = google.visualization.arrayToDataTable([
        ['Element', 'Presentage'],
        ['Fossil',parseFloat(airQuality.fossil.present)],
        ['Hydro',parseFloat(airQuality.hydro.present)],
        ['Nuclear',parseFloat(airQuality.nuclear.present)],
        ['Renewable',parseFloat(airQuality.renewable.present)]
    ]);

    var options = {
        title: geo_info_object.state +' Energy Production'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}

