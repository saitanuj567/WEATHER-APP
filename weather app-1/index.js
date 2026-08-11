// WEATHER APP

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "750f43b2d0eb991a1ccf0e59311c4f49";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        displayError("Please enter a city");
        return;
    }

    try {
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
    } catch (error) {
        console.error(error);
        displayError(error.message || "Could not fetch weather data");
    }
});

function setWeatherBackground(data) {
    const mainCondition = data?.weather?.[0]?.main?.toLowerCase() || "";
    const weatherId = data?.weather?.[0]?.id;

    let condition = "default";

    if (mainCondition.includes("clear")) {
        condition = "clear";
    } else if (mainCondition.includes("cloud")) {
        condition = "clouds";
    } else if (mainCondition.includes("rain") || mainCondition.includes("drizzle") || (weatherId >= 500 && weatherId < 600)) {
        condition = "rain";
    } else if (mainCondition.includes("snow") || (weatherId >= 600 && weatherId < 700)) {
        condition = "snow";
    }

    document.body.className = `weather-${condition}`;
}

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Could not fetch weather data for that city");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }]
    } = data;

    setWeatherBackground(data);
    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp.toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case weatherId >= 200 && weatherId < 300:
            return "⛈";
        case weatherId >= 300 && weatherId < 400:
            return "🌧";
        case weatherId >= 500 && weatherId < 600:
            return "🌦";
        case weatherId >= 600 && weatherId < 700:
            return "❄";
        case weatherId >= 700 && weatherId < 800:
            return "〰";
        case weatherId === 800:
            return "☀";
        case weatherId >= 801 && weatherId < 810:
            return "⛅";
        default:
            return "?";
    }
}

function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}

