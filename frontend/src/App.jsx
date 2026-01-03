// UPDATED to include useCallback
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./index.css";
import WeatherChart from "./WeatherChart.jsx";

// Make sure you created this file in Step 8
import Auth from "./Auth.jsx";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // 1. Check for existing token on load (Persistent Login)
  // UPDATED: use try-catch to handle JSON parsing errors or lazy state initialization
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // 2. Fetch Favorites when user is logged in
  // UPDATED to Move the logic into the effect, not the function:
  // inside App()
  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  }, [user, API_URL]); // <- dependencies

  // Call it when the component mounts or user changes
  // UPDATED to use the fetchFavorites function defined above
  useEffect(() => {
    if (!user) return;

    // define async function inside effect
    const loadFavorites = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data); // this runs after the async fetch, not synchronously
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    loadFavorites(); // call async function
  }, [user, API_URL]);

  // 3. Save a City to Favorites
  const saveFavorite = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_URL}/api/favorites`,
        {
          city_name: weather.city.name,
          lat: weather.city.coord.lat,
          lon: weather.city.coord.lon,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchFavorites(); // Refresh list
    } catch (err) {
      alert("Already in favorites!", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setWeather(null);
  };

  const fetchWeather = async (e, cityName = city) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/api/weather/${cityName}`);
      setWeather(response.data.data);
    } catch (err) {
      setError("City not found.", err);
    }
    setLoading(false);
  };

  if (!user)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Auth
          onLoginSuccess={(userData) => {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }}
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          🌤️ {user.username}'s Weather
        </h1>
        <button
          onClick={handleLogout}
          className="text-red-500 font-semibold underline"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar: Favorites */}
        <div className="bg-white p-4 rounded-xl shadow-md h-fit">
          <h3 className="font-bold mb-4 border-b pb-2 text-gray-700">
            ⭐ Favorites
          </h3>
          {favorites.map((fav) => (
            <button
              key={fav.favorite_id}
              onClick={() => fetchWeather(null, fav.city_name)}
              className="block w-full text-left p-2 hover:bg-blue-100 rounded text-sm mb-1"
            >
              📍 {fav.city_name}
            </button>
          ))}
        </div>

        {/* Main Section: Search & Dashboard */}
        <div className="md:col-span-3 flex flex-col items-center">
          <form
            onSubmit={fetchWeather}
            className="flex gap-2 mb-8 w-full max-w-md"
          >
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city..."
              className="flex-1 px-4 py-2 rounded-lg border shadow-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg shadow-md text-white
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"}`}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </form>

          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

          {weather && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <div className="bg-white p-8 rounded-2xl shadow-xl w-80 text-center relative">
                <button
                  onClick={saveFavorite}
                  className="absolute top-4 right-4 text-2xl"
                >
                  ⭐
                </button>
                <h2 className="text-2xl font-bold">{weather.city.name}</h2>
                <p className="text-5xl font-extrabold text-blue-600 my-4">
                  {Math.round(weather.list[0].main.temp)}°C
                </p>
                <WeatherChart data={weather} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

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
