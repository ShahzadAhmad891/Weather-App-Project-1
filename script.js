const API_KEY = `36b6e4d4100fb9d7bc4ee66a404de4e1`;
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const errorDiv = document.querySelector("#error");
const weatherInfoDiv = document.querySelector("#weatherInfo");
const cityName = document.querySelector("#cityName");
const condition = document.querySelector("#condition");
const temperature = document.querySelector("#temperature");
const windSpeed = document.querySelector("#windSpeed");
const humidity = document.querySelector("#humidity");
const localTime = document.querySelector("#localTime");

// Adding Event Listener to Button
searchBtn.addEventListener("click", fetchWeather);


cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {   // check if Enter key is pressed
        fetchWeather();            // call the same function
    }
});

// Fetch Weather Function 
async function fetchWeather() {
    const city = cityInput.value.trim();// trim removes extra spaces.
    if (!city) {
        displayError("Please Enter City Name");
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City Not Found");
        }
        const data = await response.json(); // converting from json to js object
        displayWeather(data);
    } catch (error) {
        displayError("Incorrect City Name");
    }
}
// writing function display Error
function displayError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block"; // show error message
    weatherInfoDiv.classList.add("hidden");

}

let clockInterval = null;  // global variable to store interval ID
// writting function to display weather
function displayWeather(data) {
    errorDiv.style.display = "none"; // hide error message
    weatherInfoDiv.classList.remove("hidden");
    cityName.textContent = data.name;
    const weatherCondition = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);

    // --- ICON + COLOR SELECTION ---
    let iconClass = "fa-solid fa-cloud";
    let iconColor = "#6b7075ff"; // default grey

    const desc = data.weather[0].description.toLowerCase();

    if (desc.includes("clear")) {
        iconClass = "fa-solid fa-sun";
        iconColor = "#f4c542"; // yellow
    } else if (desc.includes("cloud")) {
        iconClass = "fa-solid fa-cloud";
        iconColor = "#f4b400"; // light gray-blue
    } else if (desc.includes("rain")) {
        iconClass = "fa-solid fa-cloud-showers-heavy";
        iconColor = "#1e81b0"; // blue
    } else if (desc.includes("thunder")) {
        iconClass = "fa-solid fa-cloud-bolt";
        iconColor = "#f4b400"; // gold/yellow lightning
    } else if (desc.includes("drizzle")) {
        iconClass = "fa-solid fa-cloud-rain";
        iconColor = "#00aaff"; // sky blue
    } else if (desc.includes("snow")) {
        iconClass="fa-solid fa-person-skiing-nordic";
        // iconClass = "fa-solid fa-snowflake";
        iconColor = "#a8e6ff"; // icy blue
    } else if (desc.includes("mist") || desc.includes("fog") || desc.includes("haze")) {
        iconClass = "fa-solid fa-smog";
        iconColor = "#e7e3e3ff"; // smoky gray
    } else if (desc.includes("dust") || desc.includes("sand")) {
        iconClass = "fa-solid fa-wind";
        iconColor = "#c2a476"; // sandy brown
    }

    // Display weather condition with colored icon
    condition.innerHTML = `<i class="${iconClass}" style="color: ${iconColor};"></i> ${weatherCondition}`;





    // condition.innerHTML = `<i class="fa-solid fa-cloud"></i> ${weatherCodition}`;
    temperature.textContent = data.main.temp;
    windSpeed.textContent = data.wind.speed;
    humidity.textContent = data.main.humidity;


    // Calculate local time
    const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const cityTime = new Date(utcTime + (data.timezone * 1000));

    // Format time nicely
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    localTime.textContent = `Local Time: ${cityTime.toLocaleTimeString([], options)}`;

    // --- CLEAR OLD INTERVAL ---
    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }

    // Function to update city time
    function updateCityTime() {
        const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
        const cityTimeObj = new Date(utcTime + data.timezone * 1000);

        const options = {
            weekday: 'long',     // e.g., Tuesday
            // year: 'numeric',     // e.g., 2025
            // month: 'long',       // e.g., November
            // day: 'numeric',      // e.g., 11
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true         // 12-hour clock
        };

        const formattedDateTime = cityTimeObj.toLocaleString([], options);
        localTime.textContent = `Local Time in ${data.name}: ${formattedDateTime}`;


        // localTime.textContent = `Local Time: ${cityTimeObj.toLocaleString([], options)}`;
    }

    // Initial display
    updateCityTime();

    // Start interval for live clock
    clockInterval = setInterval(updateCityTime, 1000);
}