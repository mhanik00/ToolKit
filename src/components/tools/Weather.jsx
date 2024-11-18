import { useState, useEffect } from 'react';

function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentWeatherSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem('recentWeatherSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const fetchWeather = async (searchCity) => {
    try {
      setLoading(true);
      setError(null);

      // First, get coordinates from the geocoding API
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results?.[0]) {
        throw new Error('City not found');
      }

      const location = geoData.results[0];
      
      // Then fetch weather data using the coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl&timezone=auto`
      );
      const weatherData = await weatherResponse.json();

      setWeather({
        location: {
          name: location.name,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude
        },
        current: weatherData.current
      });

      // Add to recent searches
      if (!recentSearches.includes(searchCity)) {
        setRecentSearches(prev => [searchCity, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const getWeatherIcon = (code) => {
    // WMO Weather interpretation codes (WW)
    const codeMap = {
      0: '☀️', // Clear sky
      1: '🌤️', // Mainly clear
      2: '⛅', // Partly cloudy
      3: '☁️', // Overcast
      45: '🌫️', // Foggy
      48: '🌫️', // Depositing rime fog
      51: '🌧️', // Light drizzle
      53: '🌧️', // Moderate drizzle
      55: '🌧️', // Dense drizzle
      61: '🌧️', // Slight rain
      63: '🌧️', // Moderate rain
      65: '🌧️', // Heavy rain
      71: '🌨️', // Slight snow
      73: '🌨️', // Moderate snow
      75: '🌨️', // Heavy snow
      77: '🌨️', // Snow grains
      80: '🌧️', // Slight rain showers
      81: '🌧️', // Moderate rain showers
      82: '🌧️', // Violent rain showers
      85: '🌨️', // Slight snow showers
      86: '🌨️', // Heavy snow showers
      95: '⛈️', // Thunderstorm
      96: '⛈️', // Thunderstorm with slight hail
      99: '⛈️', // Thunderstorm with heavy hail
    };
    return codeMap[code] || '❓';
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown';
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Weather Forecast
          </h2>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setCity(search);
                      fetchWeather(search);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          {/* Weather Display */}
          {weather && (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {weather.location.name}, {weather.location.country}
              </h3>
              
              <div className="flex justify-center items-center mb-6">
                <div className="text-6xl mr-4">
                  {getWeatherIcon(weather.current.weather_code)}
                </div>
                <div className="text-5xl font-bold text-gray-900 dark:text-white">
                  {Math.round(weather.current.temperature_2m)}°C
                </div>
              </div>

              <p className="text-xl text-gray-700 dark:text-gray-300 capitalize mb-6">
                {getWeatherDescription(weather.current.weather_code)}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Feels Like</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {Math.round(weather.current.apparent_temperature)}°C
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {weather.current.relative_humidity_2m}%
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {Math.round(weather.current.wind_speed_10m)} km/h
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pressure</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {Math.round(weather.current.pressure_msl)} hPa
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Weather; 