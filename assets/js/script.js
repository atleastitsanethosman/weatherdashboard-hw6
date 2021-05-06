// var holds key to access weather dashboard API
var apiKey = 'aa13545b019a0a330e75fb7d4b324c87';

// var locationFormEl = $('#locationForm');
var PastSearchList = $('#pastSearch');

var repoContainerEl = document.querySelector('#repos-container');
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
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + locationData + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
        console.log(data);
      });
};

$("#locationForm").submit(function(event) {
    event.preventDefault(); 
    var locationEl = $('#location').val();
    console.log(locationEl);
    pullweather(locationEl);

});
