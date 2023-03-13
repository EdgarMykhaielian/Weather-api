const apikey = "97436b7a7cd00fd666dc78d53977d438";
const cityForm = document.getElementById("cityForm");
const cityBox = document.getElementById("cityBox");
const weatherContainer = document.getElementById("weather-container");
const cache = [];

getLocation()
    .then(({ lat, lon }) => getForcast(lat, lon))
    .then((data) => showWeather(data))
    .catch(console.error);

cityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cityBox.validity.typeMismatch) {
        cityBox.setCustomValidity("Please enter a valid city");
    } else {
        getLocation(cityBox.value.trim())
            .then(({ lat, lon }) => getForcast(lat, lon))
            .then((data) => showWeather(data))
            .catch(console.error);
    }
});

function getLocation(city) {
    if (!city)
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(({ coords }) => {
                    resolve({ lat: coords.latitude, lon: coords.longitude });
                });
            } else {
                reject();
            }
        });

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;
    return fetch(url)
        .then((response) => response.json())
        .then(([{ lat, lon }]) => ({ lat, lon }));
}

function getForcast(lat, lon) {
    let latFixed = lat.toFixed(0);
    let lonFixed = lon.toFixed(0);
    const localData = JSON.parse(localStorage.getItem("cache")) || [];
    const matchCoords = localData.find(
        (data) =>
            data.coord.lat.toFixed(0) == latFixed &&
            data.coord.lon.toFixed(0) == lonFixed
    );
    if (matchCoords) {
        return matchCoords;
    } else {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
        return fetch(url).then((response) => response.json());
    }
}

function showWeather(data) {
    const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
        type: "region",
    });
    const today = new Date().toLocaleDateString("ukr");
    const preloader = document.getElementById("preloader");
    weatherContainer.innerHTML = `
            <div class="main-info">
            <p class="city">${
                data.name + ", " + regionNamesInEnglish.of(data.sys.country)
            }</p>
                <p class="date">${today}</p>
                <div class="wrapper">
                    <p class="temperature">${
                        Math.round(data.main.temp) + "°"
                    }</p>
                    <div class="icon">
                        <img src="https://openweathermap.org/img/wn/${
                            data.weather[0].icon
                        }@2x.png">
                    </div>
                <p class="conditions">${data.weather[0].description}</p>
                </div>
            </div>
            <div class="add-info">
                <ul>
                    <li>Feels like</li>
                    <li>${Math.round(data.main.feels_like) + "°"}</li>
                </ul>
                <ul>
                    <li>Pressure</li>
                    <li>${data.main.pressure + "mm"}</li>
                </ul>
                <ul>
                    <li>Humidity</li>
                    <li>${data.main.humidity + "%"}</li>
                </ul>
                <ul>
                    <li>Wind</li>
                    <li>${data.wind.speed + "m/s"}</li>
                </ul>
            </div>
        `;
    /* remove preloader */
    if (preloader) {
        preloader.remove();
    }
    setExpiry(data);
}

function setExpiry(data) {
    data.dateInfo = new Date();
    data.expiry = data.dateInfo.getTime() + 60000;
    if (cache.length < 10) {
        cache.push(data);
    }
    localStorage.setItem("cache", JSON.stringify(cache));
    clearLocalData();
}

function clearLocalData() {
    const now = new Date();
    const localData = JSON.parse(localStorage.getItem("cache"));
    const validItems = localData.filter((data) => now.getTime() < data.expiry);
    console.log("validitems:", validItems);
    localStorage.setItem("cache", JSON.stringify(validItems));
}
