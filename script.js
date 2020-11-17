//globals

var textInputElement = $("#searchInputBox")
var historyElement = $("#historyList")

var key = "e1d1e2cf364fa5a4b3adb90e93258ef4"


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
    
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="+ city +"&appid="+key
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    })
}

function addToHistory(text) {
    if (text === '') {
        return;
    }

    var newItem = $("<div>" + text + "</div>")
    historyElement.prepend(newItem)
}