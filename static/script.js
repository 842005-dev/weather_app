async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  const res = await fetch(`/weather?city=${city}`);
  const data = await res.json();

  if (data.error) {
    document.getElementById("weatherResult").innerHTML = `<p class="text-red-200">${data.error}</p>`;
  } else {
    document.getElementById("weatherResult").innerHTML = `
      <p><strong>City:</strong> ${data.city}</p>
      <p><strong>Temperature:</strong> ${data.temperature} °C</p>
      <p><strong>Windspeed:</strong> ${data.windspeed} km/h</p>
    `;
  }
}

async function suggestCities() {
  const input = document.getElementById("cityInput");
  const query = input.value;
  if (query.length < 2) return;

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
  const data = await res.json();

  const datalist = document.getElementById("suggestions");
  datalist.innerHTML = "";

  if (data.results) {
    data.results.forEach(city => {
      const option = document.createElement("option");
      option.value = city.name;
      datalist.appendChild(option);
    });
  }
}

document.getElementById("cityInput").addEventListener("input", suggestCities);
