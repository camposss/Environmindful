
///////open weather api

function handleWeatherInfo(lat, lon, addr){
    $.ajax({
        method:'get',
        data:{
            api_key:'262d0228050ee6334c5273af092b068c',
            inputAddress:$('#inputBox').val()
        },
        url:'http://api.openweathermap.org/data/2.5/weather?lat=' +
        lat + '&lon=' +
        lon + '&units=metric&appid=b231606340553d9174136f7f083904b3',
        dataType:'json',
        success: function(data){
            console.log(data)
            var temperature = data.'main'.'temp';
            var humidity = data.'main'.'humidity';
        }
    })
}