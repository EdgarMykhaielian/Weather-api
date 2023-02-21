const apikey = '97436b7a7cd00fd666dc78d53977d438';
const cityForm = document.getElementById('cityForm');

cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setLocation();
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
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => showWeather(data))
}

function showWeather(data){
    const weatherContainer = document.createElement('div');
    weatherContainer.innerHTML = `
    <p class="temperature">${Math.round(data.main.temp)}</p>
    <div class="icon">
    </div>
    `
    console.log(data)
    document.body.append(weatherContainer);
}


