

//globals
var key = "e1d1e2cf364fa5a4b3adb90e93258ef4"
var historyArray = [];

//html elements
var textInputElement = $("#searchInputBox")
var historyElement = $("#historyList")
var cityDateElement = $("#cityAndDate")
var tempElement = $("#tempNumber")
var humidityElement = $("#humidityNumber")
var windSpeedElement = $("#windSpeed")
var uvElement = $("#uvNumber")
var forecastElement = $("#fiveDayForecast")

init();
function init() {

    var obj = localStorage.getItem('history')
    if(obj != null){
        historyArray = JSON.parse(localStorage.getItem('history'))
        
        for(var i = historyArray.length-1; i >= 0; i--){
            makeNewHistoryItem(historyArray[i])
        }
    }
}

$("#searchButton").on("click", function (event) {
    event.preventDefault();

    var searchText = textInputElement.val();
    textInputElement.val("");
    addToHistory(searchText);
    searchCity(searchText);
})

function searchCity(city) {

    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + key
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        displaySearchResults(response);
        forecastElement.empty();
        showFiveDayForecast(response)
    })
}

function displaySearchResults(object) {
    var name = object.city.name
    name = name + " " + moment().format('L')
    cityDateElement.text(name)
    tempElement.text(object.list[0].main.temp + " °F");
    humidityElement.text(object.list[0].main.humidity + "%");
    windSpeedElement.text(object.list[0].wind.speed + " MPH")
    getUVIndex(object.city.coord.lat, object.city.coord.lon);
}

function getUVIndex(lat, lon) {
    var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + key

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {

        uvElement.text(response.value)
        setUVColor(response.value);
    })


}

function setUVColor(val) {
    if (val < 3) {
        //low
        uvElement.css('background-color', '#4dfc0d')
    } else if (val >= 3 && val < 6) {
        //moderate
        uvElement.css('background-color', '#fcf80d')
    } else if (val >= 6 && val < 8) {
        //high
        uvElement.css('background-color', '#fc8d0d')
    } else if (val >= 8 && val < 11) {
        //very high
        uvElement.css('background-color', '#d90000')
    } else if (val >= 11) {
        //extreme
        uvElement.css('background-color', '#de00cf')
    }
}

function showFiveDayForecast(object) {
    for (i = 8; i <= 40; i += 8) {
        var newElement = $("<div></div>")
        newElement.attr('class', 'col col-md-2 col-sm-3 forecastDiv')
        newElement.css('background-color', '#10c0e3');
        if (i != 40) {
           
            newElement.append("<h4>"+ getDate(object.list[i].dt_txt) +"</h4>")
            var imgCode = object.list[i].weather[0].icon
            newElement.append("<img src=\" http://openweathermap.org/img/wn/"+imgCode+"@2x.png\">")
            newElement.append("<p>Temp: " + object.list[i].main.temp + " °F</p>")
            newElement.append("<p>Humidity: " + object.list[i].main.humidity + " °F</p>")

            forecastElement.append(newElement)
        } else {

            newElement.append("<h4>"+ getDate(object.list[39].dt_txt) +"</h4>")
            var imgCode = object.list[39].weather[0].icon
            newElement.append("<img src=\" http://openweathermap.org/img/wn/"+imgCode+"@2x.png\">")
            newElement.append("<p>Temp: " + object.list[39].main.temp + " °F</p>")
            newElement.append("<p>Humidity: " + object.list[39].main.humidity + " °F</p>")
            forecastElement.append(newElement)
        }

    }
}

function getDate(string){
    var array = string.split(' ');
    var date = moment(array[0]).format('L');
    return date;
}

function addToHistory(text) {
    if (text === '') {
        return;
    }

    if(historyArray.length == 10){
        
        $("#historyList :last-child").remove();
        historyArray.pop();
    }

    historyArray.unshift(text)
    console.log(historyArray);
    

    localStorage.setItem('history', JSON.stringify(historyArray));
    makeNewHistoryItem(text);
    
}

function makeNewHistoryItem(text){
    var newItem = $("<div>" + text + "</div>")
    historyElement.prepend(newItem)
}