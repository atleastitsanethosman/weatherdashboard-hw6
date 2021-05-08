// var holds key to access weather dashboard API
var apiKey = 'aa13545b019a0a330e75fb7d4b324c87';

// var locationFormEl = $('#locationForm');
var PastSearchList = $('#pastSearch');
var latData = "";
var lonData = "";


// var cityDisplay = $('#searchCity');
var repoSearchTerm = document.querySelector('#repo-search-term');

// Pull search history if it exists.
var priorSearches = []
if (localStorage.getItem('pastSearchData') !== null) {
    var priorSearches = JSON.parse(window.localStorage.getItem('pastSearchData'));
    for ( var i = 0; i < priorSearches.length; i ++) {
        var pastButton = $('<button>').addClass('btn pastBtn');
        pastButton.text(priorSearches[i]);
    };
};

function pullweather(locationData) {
    // removes any existing weather data to be overwritten by new.
    $('#weather-container').empty();
    // send get using fetch command to get data for city and current weather
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + locationData + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
        console.log(data);
        // pull out latitude and longitude which is needed to make onecall to get all needed forecast data.
        latData = data.coord.lat;
        console.log(latData);
        lonData = data.coord.lon;
        console.log(lonData);
        // update display to indicate the city you are showing weather for
        $('#searchCity').text(data.name);
        pullAllWeather();
    });
    
}
// pulls all needed weather detail from weatherwise onecall API
function pullAllWeather() {
    var apiURLOneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latData + "&lon=" + lonData + "&units=imperial&exclude=minutely,hourly,alerts&appid="+apiKey;
    fetch(apiURLOneCall)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
    console.log(data);
        // create card for today's weather
        var weatherToday = $('<div>').addClass('card col-12');
        // use moment to parse date from unix timestamp and append as header to card.
        var dateLineToday = $('<h2>').text(moment.unix(data.current.dt).format('l'));
        weatherToday.append(dateLineToday);
        var weatherDetailToday = $('<ul>').addClass('list-group');
            // code to pull up the icon for weather conditions and add to card.
            var weatherIconTodayURL = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"
            var weatherIconToday = $('<img>').attr('src', weatherIconTodayURL);
            weatherDetailToday.append(weatherIconToday);
            // pull todays temperature and append to card
            var tempToday = $('<li>').text('Temperature:  ' + data.current.temp + ' fahrenheit');
            weatherDetailToday.append(tempToday);
            // pull todays wind speed and add to card.
            var windSpeedToday = $('<li>').text('Wind Speed:  ' + data.current.wind_speed + " MPH");
            weatherDetailToday.append(windSpeedToday);
            // pull todays humidity and add to card.
            var humidityToday = $('<li>').text('Humidity:  ' + data.current.humidity)
            weatherDetailToday.append(humidityToday);
            // pull today's UVI and add it to card
            var uviToday = $('<li>').text('UV Index:  '+ data.current.uvi);
            weatherDetailToday.append(uviToday);
        // append todays weather to webpage
        weatherToday.append(weatherDetailToday);
        $('#weather-container').append(weatherToday);
        
        // loop to create cards for 5 day forecast.
        for ( var i = 1; i < 6; i++) {
            // create card and add date to top
            var dayBlock = $('<div>').addClass('card col-3');
            var dateForecast = $('<h2>').text(moment.unix(data.daily[i].dt).format('l'));
            dayBlock.append(dateForecast);
            // add list to collect detail information on daily weather.
            var weatherDetailDate = $('<ul>').addClass('list-group');
            
                // pull icon for the daily forecast
                var weatherIconDateURL = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"
                var weatherIconDate = $('<img>').attr('src', weatherIconDateURL);
                weatherDetailDate.append(weatherIconDate);
                // Pull data for current temp and appends
                var tempDate = $('<li>').text(data.daily[i].temp.day + ' F');
                weatherDetailDate.append(tempDate);
                // pull wind speed and add to card.
                var windSpeedDate = $('<li>').text('Wind Speed: ' + data.daily[i].wind_speed + " MPH");
                weatherDetailDate.append(windSpeedDate);
                // pull humidity and add to card.
                var humidityDate = $('<li>').text('Humidity:  ' + data.daily[i].humidity + '%')
                weatherDetailDate.append(humidityDate);

                dayBlock.append(weatherDetailDate);
                $('#weather-container').append(dayBlock);
        }
      });
};


$("#locationForm").submit(function(event) {
    event.preventDefault(); 
    var locationEl = $('#location').val();
    console.log(locationEl);
    pullweather(locationEl);

});
