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
