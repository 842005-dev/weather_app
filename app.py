from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather')
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'No city provided'}), 400

    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}"
    geo_res = requests.get(geo_url).json()
    if 'results' not in geo_res:
        return jsonify({'error': 'City not found'}), 404

    lat = geo_res['results'][0]['latitude']
    lon = geo_res['results'][0]['longitude']

    weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    weather_res = requests.get(weather_url).json()
    weather = weather_res.get('current_weather', {})

    return jsonify({
        'city': city,
        'temperature': weather.get('temperature'),
        'windspeed': weather.get('windspeed')
    })

if __name__ == '__main__':
    app.run(debug=True)
