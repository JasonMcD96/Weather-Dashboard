//globals

var textInputElement = $("#searchInputBox")
var historyElement = $("#historyList")
var cityDateElement = $("#cityAndDate")
var tempElement = $("#tempNumber")
var humidityElement = $("#humidityNumber")
var windSpeedElement = $("#windSpeed")
var uvElement = $("#uvNumber")

var key = "e1d1e2cf364fa5a4b3adb90e93258ef4"

// font awesome for weather images 
// switch statement will probably be usefull


// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).then(function(response){
//     console.log(response);
// })

init();
function init() {
    //need to make local data if it doesnt exist, for later


}

$("#searchButton").on("click", function (event) {
    event.preventDefault();

    console.log(event.target)
    var searchText = textInputElement.val();
    textInputElement.val("");
    console.log(searchText)

    addToHistory(searchText);
    searchCity(searchText);
})

function searchCity(city) {
    
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="+ city +"&units=imperial&appid="+key
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        displaySearchResults(response);
    })
}

function displaySearchResults(object){
    var name = object.city.name
    name = name + " " + moment().format('L')
    cityDateElement.text(name)
    tempElement.text(object.list[0].main.temp + " °F");
    humidityElement.text(object.list[0].main.humidity+"%");
    windSpeedElement.text(object.list[0].wind.speed + " MPH")

   getUVIndex(object.city.coord.lat, object.city.coord.lon);
}

function getUVIndex(lat, lon){
    console.log(lat +" "+lon)
    var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+key

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        console.log(response)
        uvElement.text(response.value)
        setUVColor(response.value);
    })
    
  
}

function setUVColor(val){
    if(val < 3){
        //low
        uvElement.css('background-color', '#4dfc0d')
    } else if(val >= 3 && val < 6){
        //moderate
        uvElement.css('background-color', '#fcf80d')
    } else if(val >= 6 && val < 8){
        //high
        uvElement.css('background-color', '#fc8d0d')
    } else if(val >= 8 && val < 11){
        //very high
        uvElement.css('background-color', '#d90000')
    } else if(val >= 11){
        //extreme
        uvElement.css('background-color', '#de00cf')
    }
}

function addToHistory(text) {
    if (text === '') {
        return;
    }

    var newItem = $("<div>" + text + "</div>")
    historyElement.prepend(newItem)
}