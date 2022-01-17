


var apiKey = '27fe40ac962f97b07505616bfabc04a7'
var searchHistory = [];


// load local storage
loadHistory()

// assign the length of the array to count
var count = searchHistory.length;


// event listener
$("#blue-btn").on("click", function(){
    
    // retrieve the value from input field
    var city = $("#input-field").val();

    // copy the array
    var arr = searchHistory;
        // set value and key
        arr[count] = city;

    // create a button
    createButton(city, count);
 
    // increment count
    count++;

    // fetch the data using the input from the user
    fetchData(city);
    
    
    // reset the input field to empty
    $("#input-field").val("")

    // save the array to local storage
    localStorage.setItem("history", JSON.stringify(arr))
    
})



// listen for user click
$(".history-btn").click(function(e){
    // listen for the target element
     var eventEl = e.target;
     // retrieve the text from the target element
     var city = eventEl.innerHTML;
     // check if city is has a value
     if(city !== null || city !== undefined){  
         // call the function       
        fetchData(city);
     }
 })

 

 // create a weather dashboard for the current weather
function createCurrentDashBoard(city, temp, wind, humidity, uv, icon){
    // get today's date
    var today = moment().format("(M/D/YYYY)")
    // get the image from the url
    var weatherIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`
    
    // display the city and today's date
    $("#city-name").text(`${city} ${today}`)

    // add an image 
    $("#city-name").append(`<img src="${weatherIcon}" alt="weather image"></img>`)

    // show the current weather dashboard
    $("#current-weather-dashboard").show()

    // add temperature to the page
    $("#temp").text(`Temp: ${temp} `)

    // add the fahrenheit symbol on to the page
    $("#temp").append("&#8457;")

    // add the wind speed on to the page
    $("#wind").text(`Wind: ${wind} MPH`)

    // add the humidity on to the page
    $("#humidity").text(`Humidity: ${humidity} %`)

    // add the uv index on to the page
    $("#uvi").text("UV Index: ").append(`<span>${uv}</span>`)
 

    // check for uv level for favorable, moderate, and severe
    if(uv <= 2){
        // favorable
        $("span").css({"background-color" : "green", "color":"white", "border-radius":"2px", "padding":"2px 5px"});
    }else if(uv <= 5){
        // moderate
        $("span").css({"background-color" : "orange", "color":"white", "border-radius":"2px", "padding":"2px 5px"});
    }else{
        // severe
        $("span").css({"background-color" : "red", "color":"white", "border-radius":"2px", "padding":"2px 5px"});
    }
}

// fetch the data
function fetchData(city){
    var geoApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + city +"&limit=1&appid=" + apiKey
    fetch(geoApi)
    .then(res => res.json())
    .then(function(data){
                    
        // get the latitude and longitude of the city
        var lat = data[0].lat;
        var lon = data[0].lon;

        // get the weather of the city
       var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,minutely&appid="+ apiKey;
        fetch(url)
        .then(res => res.json())
        .then(function(data){
         
            var temp =  data.current.temp;
            var wind = data.current.wind_speed;
            var humidity =  data.current.humidity;
            var uvi = data.current.uvi;
            var icon = data.current.weather[0].icon;

            createCurrentDashBoard(city,temp,wind,humidity,uvi,icon);

            // create 5 day forecast
            for( var i = 0; i < 5; i++){
                
                // get the image for each day of the forecast
                var weatherIcon = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`
                var icon = data.daily[i].weather[0].icon;
                // get the tomorrow's date
                var today = moment().add((i+1), "day")
                var nextDay = today.format("M/D/YYYY");
               

                $(`#date-${i+1}`).text(`${nextDay}`)
                $(`#temp-${i+1}`).text(`Temp: ${data.daily[i].temp.day}`)
                $(`#temp-${i+1}`).append(" &#8457;")
                $(`#wind-${i+1}`).text(`Wind: ${data.daily[i].wind_speed} MPH`)
                $(`#humidity-${i+1}`).text(`Humidity: ${data.daily[i].humidity} %`)
                $(`#img-${i+1}`).attr("src", `${weatherIcon}`)

                // display the 5 day forecast
                $(".weekly-forecast").show()

            }

            
        })
    })
 }



// create the history button
function createButton(city, index){
    $(".history-btn").append('<button  type="button" style="width: 100%" class="btn gray-btn  btn-lg btn-block mt-2  " id="'+index+'">'+city +'</button>');

}



// load the local storage
function loadHistory(){
    var history = JSON.parse(localStorage.getItem("history"))
   
    if(history){
         searchHistory = history;
        for(var i = 0; i < searchHistory.length; i++){
            $(".history-btn").append('<button  type="button" style="width: 100%" class="btn gray-btn  btn-lg btn-block mt-2 id="'+i+'">'+searchHistory[i] +'</button>');
        }
    }

}




