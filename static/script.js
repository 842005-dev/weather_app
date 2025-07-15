const input = document.getElementById('cityInput');
const suggestions = document.getElementById('suggestions');
const btn = document.getElementById('getWeatherBtn');
const result = document.getElementById('result');

input.addEventListener('input', async () => {
  const query = input.value.trim();
  if (query.length < 2) {
    suggestions.innerHTML = '';
    return;
  }

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`);
  const data = await res.json();
  suggestions.innerHTML = '';

  if (data.results) {
    data.results.forEach(place => {
      const item = document.createElement('button');
      item.textContent = `${place.name}, ${place.country}`;
      item.className = 'list-group-item list-group-item-action';
      item.onclick = () => {
        input.value = `${place.name}`;
        suggestions.innerHTML = '';
      };
      suggestions.appendChild(item);
    });
  }
});

btn.addEventListener('click', async () => {
  const city = input.value.trim();
  if (!city) return;

  const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
  const data = await res.json();

  if (data.error) {
    result.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
  } else {
    const temp = data.current.temperature || 'N/A';
    const wind = data.current.windspeed || 'N/A';

    result.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${data.city}</h5>
          <p>Temperature: ${temp} °C</p>
          <p>Wind Speed: ${wind} km/h</p>
        </div>
      </div>
    `;
  }
});
