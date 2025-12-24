import { useState } from "react";
import axios from "axios";
import "./index.css";
import WeatherChart from "./WeatherChart.jsx";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(`${API_URL}/api/weather/${city}`);
      setWeather(response.data.data);
      console.log("Source:", response.data.source);
    } catch (err) {
      setError(
        err.response?.data?.error || "City not found. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10 font-sans">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">
        🌤️ Weather Finder
      </h1>

      {/* Search Form */}
      <form onSubmit={fetchWeather} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Enter city name (e.g., Manila)"
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}

      {/* Weather Display Content */}
      {weather && (
        <div className="flex flex-col items-center w-full max-w-4xl px-4 animate-fade-in">
          {/* 1. Main Weather Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl w-80 text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {weather.city?.name}, {weather.city?.country}
            </h2>

            <div className="my-4">
              <img
                src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`}
                alt="weather-icon"
                className="mx-auto"
              />
              <p className="text-5xl font-extrabold text-blue-600">
                {Math.round(weather.list[0].main.temp)}°C
              </p>
              <p className="text-gray-500 capitalize mt-2">
                {weather.list[0].weather[0].description}
              </p>
            </div>

            {/* FIXED: Bottom Grid paths updated to weather.list[0] */}
            <div className="grid grid-cols-2 gap-4 mt-6 border-t pt-4 text-sm text-gray-600">
              <div>
                <p className="font-bold">Humidity</p>
                <p>{weather.list[0].main.humidity}%</p>
              </div>
              <div>
                <p className="font-bold">Wind</p>
                <p>{weather.list[0].wind.speed} m/s</p>
              </div>
            </div>
          </div>

          {/* 2. Chart Section */}
          <WeatherChart data={weather} />
        </div>
      )}
    </div>
  );
}

export default App;

{
  /*
Understanding the Code

useState:
Used to track the city the user types, the weather data returned from the API,
and whether the app is currently loading.

e.preventDefault():
Prevents the default form behavior of refreshing the page,
allowing React to handle the form submission with JavaScript.

Conditional Rendering:
The syntax {weather && (...)} means the JSX will only render
if the `weather` variable is not null.

Dynamic Icons:
OpenWeatherMap provides weather icons.
The icon is loaded dynamically using the icon code
(weather.weather[0].icon) in the image URL.
*/
}
