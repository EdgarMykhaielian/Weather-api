const apikey = '97436b7a7cd00fd666dc78d53977d438';
const cityForm = document.getElementById('cityForm');
const cityBox = document.getElementById('cityBox');
const weatherContainer = document.getElementById('weather-container')
const today = new Date().toLocaleDateString('ukr')

getLocation().then(({ lat, lon }) => Promise.all([
    getCityName(lat, lon),
    getForcast(lat, lon),
])).then(([city, data]) => showWeather(data,city)).catch(console.error)

cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cityBox.validity.typeMismatch) {
        cityBox.setCustomValidity("Please enter a valid city");
    } else {
        getLocation(cityBox.value.trim()).then(({ lat, lon }) => Promise.all([
            getCityName(lat, lon),
            getForcast(lat, lon),
        ])).then(([city, data]) => showWeather(data,city)).catch(console.error)
    }
});

function getLocation(city) {
    if (!city) return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(({coords}) => {
                resolve({ lat: coords.latitude, lon:coords.longitude })
            });
        } else {
            reject()
        }
    })

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;
    return fetch(url)
        .then(response => response.json())
        .then(([{lat,lon}]) => ({lat,lon}))
}

function getForcast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
    return fetch(url).then(response => response.json())
}

function getCityName(lat, lon) {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apikey}`
    return fetch(url)
        .then(response => response.json())
        .then(data => data[0].name)
}

function showWeather(data, city) {
    const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });
    weatherContainer.innerHTML = `
            <div class="main-info">
            <p class="city">${((city)) + ', ' + (regionNamesInEnglish.of(data.sys.country))}</p>
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
}
