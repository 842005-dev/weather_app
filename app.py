from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

weather_details = {
    0: ("Clear sky", "clear"),
    1: ("Mainly clear", "clear"),
    2: ("Partly cloudy", "cloudy"),
    3: ("Overcast", "cloudy"),
    45: ("Fog", "fog"),
    48: ("Fog", "fog"),
    51: ("Drizzle", "rain"),
    53: ("Drizzle", "rain"),
    55: ("Drizzle", "rain"),
    61: ("Rain", "rain"),
    63: ("Rain", "rain"),
    65: ("Heavy rain", "rain"),
    71: ("Snow", "snow"),
    73: ("Snow", "snow"),
    75: ("Heavy snow", "snow"),
    95: ("Thunderstorm", "thunder"),
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather')
def weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City required'}), 400

    geo_url = f"https://nominatim.openstreetmap.org/search?city={city}&format=json&limit=1"
    geo = requests.get(geo_url, headers={'User-Agent': 'weather-app'})
    if geo.status_code != 200 or not geo.json():
        return jsonify({'error': 'City not found'}), 400

    data = geo.json()[0]
    lat, lon = data['lat'], data['lon']

    api_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto"
    weather = requests.get(api_url).json()

    current = weather['current_weather']
    daily = weather['daily']

    code = current['weathercode']
    description, condition = weather_details.get(code, ("Unknown", "clear"))

    result = {
        'city': city.title(),
        'temperature': current['temperature'],
        'windspeed': current['windspeed'],
        'description': description,
        'condition': condition,
        'temp_max': daily['temperature_2m_max'][0],
        'temp_min': daily['temperature_2m_min'][0]
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
