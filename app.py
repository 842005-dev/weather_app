from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Open-Meteo base URL
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather')
def weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'No city provided'}), 400

    # Get coordinates for city
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1"
    geo_res = requests.get(geo_url)
    geo_data = geo_res.json()

    if 'results' not in geo_data or len(geo_data['results']) == 0:
        return jsonify({'error': 'City not found'}), 404

    lat = geo_data['results'][0]['latitude']
    lon = geo_data['results'][0]['longitude']

    # Get current weather
    weather_res = requests.get(WEATHER_URL, params={
        "latitude": lat,
        "longitude": lon,
        "current_weather": True,
        "hourly": "temperature_2m",
    })
    weather_data = weather_res.json()

    return jsonify({
        "city": city.title(),
        "current": weather_data.get('current_weather', {}),
        "latitude": lat,
        "longitude": lon
    })

if __name__ == '__main__':
    app.run(debug=True)
