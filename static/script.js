document.getElementById('getWeather').addEventListener('click', () => {
  const city = document.getElementById('city').value.trim();
  if (!city) {
    alert('Please enter a city!');
    return;
  }

  fetch(`/weather?city=${city}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      document.getElementById('weatherCity').innerText = data.city;
      document.getElementById('weatherDesc').innerText = data.description;
      document.getElementById('weatherTemp').innerText = `Temp: ${data.temperature}°C`;
      document.getElementById('weatherMaxMin').innerText = `Max: ${data.temp_max}°C | Min: ${data.temp_min}°C`;
      document.getElementById('weatherWind').innerText = `Windspeed: ${data.windspeed} km/h`;

      document.getElementById('result').classList.remove('d-none');

      const bg = document.querySelector('.bg-overlay');
      if (data.condition === 'clear') {
        bg.style.background = 'linear-gradient(135deg, #fceabb, #f8b500)';
      } else if (data.condition === 'cloudy') {
        bg.style.background = 'linear-gradient(135deg, #bdc3c7, #2c3e50)';
      } else if (data.condition === 'rain') {
        bg.style.background = 'linear-gradient(135deg, #4e54c8, #8f94fb)';
      } else if (data.condition === 'snow') {
        bg.style.background = 'linear-gradient(135deg, #e0eafc, #cfdef3)';
      } else if (data.condition === 'thunder') {
        bg.style.background = 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)';
      } else if (data.condition === 'fog') {
        bg.style.background = 'linear-gradient(135deg, #757f9a, #d7dde8)';
      } else {
        bg.style.background = 'linear-gradient(135deg, #83a4d4, #b6fbff)';
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error fetching weather.');
    });
});
