<<<<<<< HEAD
function handleAirQuality() {
    $.ajax({
        data: {
            api_key: '1af10262d0228050ee6334c5273af092b068ca53'
        },
        method: 'GET',
        dataType: 'json',
        url: 'http://api.waqi.info/feed/' + cityNumber + '/?token=1af10262d0228050ee6334c5273af092b068ca53',
        success: function(data) {
            ajax_result = data;
            console.log('handleAirQuality ajax call was successful');
        },
        error: function(data) {
            console.log('handleAirQuality ajax call resulted in error');
        }
    })
}


function getStationsByKeyword(keyword){
    //http://api.waqi.info/search/?token=TOKEN&keyword=KEYWORD
    //return array of stations
/*
 [
        {
            "uid": 289,
            "aqi": "87",
            "time": {
                "tz": "-08:00",
                "stime": "2017-11-29 10:00:00",
                "vtime": 1511978400
            },
            "station": {
                "name": "Visalia, Tulare, California",
                "geo": [
                    36.33252,
                    -119.29095
                ],
                "url": "california/tulare/visalia"
            }
        },
    ]

*/
}

function getDataByLocation(lat, lon){
    //http://api.waqi.info/feed/geo:LAT;LON/?token=TOKEN
/*
{

        "aqi": 31,
        "idx": 317,
        "attributions": [
            {
                "url": "http://www.arb.ca.gov/",
                "name": "CARB - California Air Resources Board"
            },
            {
                "url": "http://www.airnow.gov/",
                "name": "Air Now - US EPA"
            }
        ],
        "city": {
            "geo": [
                33.83061,
                -117.9385
            ],
            "name": "Anaheim-Loara School, Orange, California",
            "url": "http://aqicn.org/city/california/orange/anaheim-loara-school/"
        },
        "dominentpol": "pm10",
        "iaqi": {
            "co": {
                "v": 10.2
            },
            "h": {
                "v": 76
            },
            "no2": {
                "v": 25.1
            },
            "o3": {
                "v": 0.8
            },
            "p": {
                "v": 961.19
            },
            "pm10": {
                "v": 31
            },
            "pm25": {
                "v": 91
            },
            "so2": {
                "v": 1.5
            },
            "t": {
                "v": 11.5
            }
        },
        "time": {
            "s": "2017-11-29 09:00:00",
            "tz": "-08:00",
            "v": 1511946000
        }
    }
*/
}
=======
// News API Functionality
$(document).ready(initializeApp);

function initializeApp () {
    $(".searchButton").click(getNewsData);
}

function getNewsData () {
    var nationalGeoAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=national-geographic&q="+ formatTextArea() +"+climate&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from National Geo: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var abcAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=abc-news&q="+ formatTextArea() +"+climate&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from ABC news: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var cnnAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=cnn&q="+ formatTextArea() +"+environment&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from CNN news: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    $.ajax(abcAPIajaxOptions);
    $.ajax(nationalGeoAPIajaxOptions);
    $.ajax(cnnAPIajaxOptions);
}

function displayNewsData (data) {
    if ($(".searchNews").val() === "") {
        $(".searchNews").attr({
            placeholder: "Please enter keywords to search."
        });
        return;
    }
    for (var newsIndex = 0; newsIndex < data.articles.length; newsIndex++) {
        var newsTitle = data.articles[newsIndex].title;
        var newsSource = data.articles[newsIndex].source.name;
        var newsAuthor = data.articles[newsIndex].author;
        var newsLink = data.articles[newsIndex].url;
        var newsTitleDiv = $("<div>", {
            "class": "newsTitle",
            text: newsTitle
        });
        var newsAuthorDiv = $("<div>", {
            "class": "newsAuthor",
            text: "By: " + newsAuthor
        });
        var newsLinkTag = $("<a>", {
           text: newsTitle,
           href: newsLink
        });
        var newsSourceDiv = $("<div>", {
            "class": "newsSourceLink",
            text: "Source: " + newsSource
        });
        $(".newsListDisplay").append(newsTitleDiv, newsAuthorDiv, newsLinkTag, newsSourceDiv);
        // console.log(data.articles[newsIndex]);
    }
}
function formatTextArea () {
    var enteredText = $(".searchNews").val().split(" ").join("+");
    return enteredText;
}
>>>>>>> 717f1dd795571fcb88031a7056b61f791563b6ad
