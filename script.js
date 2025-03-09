const searchbtn = document.querySelector('.search-btn');
const cityinput = document.querySelector('.city-input');
const weatherdiv = document.querySelector('.weather-cards');
const currentweather = document.querySelector('.current-weather');
const locationbtn = document.querySelector('.location-btn');


// api key for openweather 
const API_KEY = "d23b279407090963dc3b63ea7f85dc41";

const createweathercard = (cityname,weather_item,index) => {
    if(index === 0){
        // FOR MAIN WEATHER CARD AT TOP
        return `<div class="details">
                    <h2>${cityname} (${weather_item.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature:${(weather_item.main.temp - 273.15).toFixed(2)}C</h4>
                    <h4>Wind:${weather_item.wind.speed} M/S</h4>
                    <h4>Humidity: ${weather_item.main.humidity} %</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weather_item.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>${weather_item.weather[0].description}</h4>
                </div>`;
    }
    else{
    return `<li class="cards">
                       <h2>(${weather_item.dt_txt.split(" ")[0]})</h2>
                       <img src="https://openweathermap.org/img/wn/${weather_item.weather[0].icon}@4x.png" alt="weather-icon">
                       <h4>Temp:${(weather_item.main.temp - 273.15).toFixed(2)} C</h4>
                       <h4>Wind:${weather_item.wind.speed} M/S</h4>
                       <h4>Humidity:${weather_item.main.humidity}%</h4>
            </li>`
    }
}

const getweatherdetails = (cityname,lat,lon) => {
    const weather_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(weather_url).then(res => res.json()).then(data => {
       const forecastdays = [];
       const fivedaysforecast = data.list.filter(forecast =>{
            const forecastdate = new Date(forecast.dt_txt).getDate();
            if(!forecastdays.includes(forecastdate)){
                return forecastdays.push(forecastdate);
            }
       })

       //clearing previous fields
       currentweather.innerHTML = ""
       cityinput.value = "";
       weatherdiv.innerHTML = "";
    
    //    creating weather cards and adding them to  DOM
       fivedaysforecast.forEach((weather_item,index) => {
            if(index === 0){
                currentweather.insertAdjacentHTML('beforeend',createweathercard(cityname,weather_item,index));
            }
            else{
            weatherdiv.insertAdjacentHTML("beforeend",createweathercard(cityname,weather_item,index));
            }
       })
    }).catch(() => {
        alert('An error occurred while fetching the forecast');
    });

}



const getcoordinates = () => {
    // to get only name and not any extra spaces
    const cityname = cityinput.value.trim();
    
    // if cityname empty
    if(!cityname) return;

    const geocoding_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${API_KEY}`;

    // here,getting coordinates and name of the place from data
    fetch(geocoding_url).then(res => res.json()).then(data =>{
        if(!data.length){
            return alert(`no coordintes for given city -${cityname}`);
        }
        const {name,lat,lon} = data[0];
        getweatherdetails(name,lat,lon);
    }).catch(() => {
        alert('An error occurred while fetching coordinates');
    });
    
}

const getusercoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const {latitude ,longitude} = position.coords;
            const reverse_url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            // getting city name and coordinates of live location
            fetch(reverse_url).then(res => res.json()).then(data =>{
                console.log(data);
                const {name} = data[0];
                getweatherdetails(name,latitude,longitude);
            }).catch(() => {
                alert('An error occurred while fetching city');
            });
            
        },
        error => {
            if(error.code === error.PERMISSION_DENIED){
                alert('GEOLOCATION access denied');
            }
        }
    )
}

// search button for search
searchbtn.addEventListener('click',getcoordinates);

// location of user
locationbtn.addEventListener('click',getusercoordinates);

// on enter click
cityinput.addEventListener('keyup',e => e.key === "Enter" && getcoordinates());