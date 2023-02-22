const apikey = '97436b7a7cd00fd666dc78d53977d438';
const cityForm = document.getElementById('cityForm');
const cityBox = document.getElementById('cityBox');
const weatherContainer = document.getElementById('weather-container')
const today = new Date().toLocaleDateString('ukr')

cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cityBox.validity.typeMismatch) {
        cityBox.setCustomValidity("Please enter a valid city");
    } else {
        setLocation();
    }
});

function setLocation() {
    const cityName = (cityBox.value).trim();
    loadCoordinates(cityName);
}

function loadCoordinates(cityName) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apikey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => loadForcast(data))
}

function loadForcast(data) {
    let lat = data[0].lat;
    let lon = data[0].lon;
    let state = data[0].state;
    if (typeof state !== 'undefined') {
        state = `${state}, `
    }else{
        state = ''
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => showWeather(data,state))
}

function showWeather(data,state) {
    const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });
    weatherContainer.innerHTML = `
        <div class="main-info">
            <p class="city">${((cityBox.value).toUpperCase()) + ', '+ state + (regionNamesInEnglish.of(data.sys.country))}</p>
            <p class="date">${today}</p>
            <div class="wrapper">
                <p class="temperature">${(Math.round(data.main.temp)) + '°'}</p>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                </div>
            <p class="conditions">${data.weather[0].description}</p>
            </div>
        </div>
        <div class="add-info">
            <ul>
                <li>Feels like</li>
                <li>${(Math.round(data.main.feels_like)) + '°'}</li>
            </ul>
            <ul>
                <li>Pressure</li>
                <li>${(data.main.pressure + 'mm')}</li>
            </ul>
            <ul>
                <li>Humidity</li>
                <li>${(data.main.humidity + '%')}</li>
            </ul>
            <ul>
                <li>Wind</li>
                <li>${(data.wind.speed + 'm/s')}</li>
            </ul>
        </div>
    `
    console.log(data)
}


