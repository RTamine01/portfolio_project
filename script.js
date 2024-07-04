// Sidebar Button and Date
document.querySelector('.sidebar-button').addEventListener('mouseover', function () {
    document.querySelector('.sidebar-container').style.width = '250px';
});
document.querySelector('.sidebar-container').addEventListener('mouseleave', function () {
    document.querySelector('.sidebar-container').style.width = '0';
});

// Update live date every second
function updateLiveDate() {
    const now = new Date();
    const dateString = now.toLocaleString();
    document.getElementById('live-date').innerText = dateString;
}
setInterval(updateLiveDate, 1000);
updateLiveDate();

// Existing WeatherWise App JavaScript
document.getElementById('get-weather-btn').addEventListener('click', function () {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('weather-app').classList.add('active');
});

document.getElementById('weather-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('city').value;
    getWeather(city);
});

let unit = 'metric';

document.getElementById('unit-toggle').addEventListener('click', function () {
    unit = (unit === 'metric') ? 'imperial' : 'metric';
    const city = document.getElementById('city').value;
    if (city) {
        getWeather(city);
    }
});

document.getElementById('geo-button').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherByLocation(latitude, longitude);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

async function getWeather(city) {
    const apiKey = 'd5d2212968f66390693622317328c9a2';
    const unitSymbol = (unit === 'metric') ? '°C' : '°F';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;

    try {
        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            throw new Error(weatherData.message);
        }

        displayWeather(weatherData, unitSymbol);

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData, unitSymbol);

    } catch (error) {
        displayError(error.message);
    }
}

async function getWeatherByLocation(lat, lon) {
    const apiKey = 'd5d2212968f66390693622317328c9a2';
    const unitSymbol = (unit === 'metric') ? '°C' : '°F';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

    try {
        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            throw new Error(weatherData.message);
        }

        displayWeather(weatherData, unitSymbol);

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData, unitSymbol);

    } catch (error) {
        displayError(error.message);
    }
}

function displayWeather(data, unitSymbol) {
    const weatherResult = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img class="weather-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp} ${unitSymbol}</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} ${(unitSymbol === '°C') ? 'm/s' : 'mph'}</p>
    `;
    document.getElementById('weather-result').innerHTML = weatherResult;
}

function displayForecast(data, unitSymbol) {
    const forecastResult = document.getElementById('forecast-result');
    let forecastHtml = '<h2>5-Day Forecast</h2><div class="forecast">';

    // Filter to get one forecast per day, close to midday
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    for (const forecast of dailyForecasts) {
        const date = new Date(forecast.dt_txt);
        forecastHtml += `
            <div class="forecast-day">
                <p>${date.toLocaleDateString()}</p>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
                <p>${forecast.main.temp} ${unitSymbol}</p>
            </div>
        `;
    }
    
    forecastHtml += '</div>'; // Close the forecast container
    forecastResult.innerHTML = forecastHtml;
}

function displayError(message) {
    const weatherResult = document.getElementById('weather-result');
    weatherResult.innerHTML = `<p class="error">${message}</p>`;
    document.getElementById('forecast-result').innerHTML = '';
}
