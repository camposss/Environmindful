function pullFromCarma() {
    $.ajax({
        dataType: 'json',
        url: 'https://carma.org/api/1.1/searchLocations?name=Idaho',
        method: 'post',
        success: successfulPull,
        error:  errorPull
    });   
    
}

function successfulPull(data) {
    console.log(data);
    var dataCarma = data;
}

function errorPull(){
    console.log('something went wrong :(');
}

function pullFromPlanetOs () {
        $.ajax({
        dataType: 'json',
        url: 'https://api.planetos.com/v1/datasets/fmi_silam_global05/point?',
        method: 'get',
            data: {
                origin: 'dataset-details',
                lat: '49.5',
                lon: '-50.5',
                apikey: 'bdbcb059658f4b788838a5d957bf6ba8'
            },
        success: successfulPlanetPull,
        error:  errorPull
    });   
}

function successfulPlanetPull(data) {
    console.log(data);
    var dataPlanet = data;
}