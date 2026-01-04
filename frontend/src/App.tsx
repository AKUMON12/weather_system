import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./index.css";
import WeatherChart from "./components/dashboard/WeatherChart.js";
import Auth from "./components/auth/Auth.js";

// Better UI in this part:
/*  ---  */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
/*  ---  */


const queryClient = new QueryClient();


function App() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // 1. LAZY INITIALIZERS: Load from localStorage immediately (Fixes Error 1 & 3)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // 2. USE CALLBACK: Memoize the fetch function
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
  }, [user, API_URL]);

  // 3. EFFECT: Load favorites when user logs in
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        await fetchFavorites();
      }
    };
    loadData();
  }, [user, fetchFavorites]); // The linter is happy now because the state update is wrapped in an async flow

  // UI Handlers
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
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
      setError("City not found.");
    }
    setLoading(false);
  };

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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFavorites();
    } catch (err) {
      alert("Already in favorites!");
    }
  };

  if (!user)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Auth
          onLoginSuccess={(userData) => {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }}
        />
      </div>
    );

  return (
    // Improved UI with these implementations:
    /*  ---  */
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            !user ? (
              <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <Auth
                  onLoginSuccess={(userData) => {
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                  }}
                />
              </div>
            ) : (
    /*  ---  */


            // Applied darkMode class to the container
            <div
              className={`min-h-screen p-6 transition-colors duration-300 ${
                darkMode ? "bg-slate-900 text-white" : "bg-blue-50 text-slate-900"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
                <h1 className="text-3xl font-bold">🌤️ {user.username}'s Weather</h1>
                <div className="flex gap-4 items-center">
                  {/* FIXED: Using toggleDarkMode here resolves the 'unused variable' error */}
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 bg-gray-200 dark:bg-slate-700 rounded-full"
                  >
                    {darkMode ? "🌙" : "☀️"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 font-semibold underline"
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div
                  className={`p-4 rounded-xl shadow-md h-fit ${
                    darkMode ? "bg-slate-800" : "bg-white"
                  }`}
                >
                  <h3 className="font-bold mb-4 border-b pb-2">⭐ Favorites</h3>
                  {favorites.map((fav) => (
                    <button
                      key={fav.favorite_id}
                      onClick={() => fetchWeather(null, fav.city_name)}
                      className={`block w-full text-left p-2 rounded text-sm mb-1 ${
                        darkMode ? "hover:bg-slate-700" : "hover:bg-blue-100"
                      }`}
                    >
                      📍 {fav.city_name}
                    </button>
                  ))}
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 flex flex-col items-center">
                  <form
                    onSubmit={fetchWeather}
                    className="flex gap-2 mb-8 w-full max-w-md"
                  >
                    {/* Add this inside your return block, under the search form */}
                    {error && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-md animate-pulse">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                      </div>
                    )}
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Search city..."
                      className={`flex-1 px-4 py-2 rounded-lg border shadow-sm ${
                        darkMode ? "bg-slate-800 border-slate-700" : "bg-white"
                      }`}
                    />
                    <button
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
                    >
                      {loading ? "..." : "Search"}
                    </button>
                  </form>

                  {weather && (
                    <div className="w-full flex flex-col items-center animate-fade-in">
                      <div
                        className={`p-8 rounded-2xl shadow-xl w-80 text-center relative ${
                          darkMode ? "bg-slate-800" : "bg-white"
                        }`}
                      >
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


    /*  ---  */
    } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  /*  ---  */
  );
}

export default App;

{
  /* --- IGNORE --- */
  //   What fixed the errors?
  // Cascading Renders Fix: I removed the useEffect that was calling setUser and setDarkMode after the first render. Instead, I put that logic inside the useState(() => { ... }). Now, the very first time the component "wakes up," it already knows the user and the theme.
  // Unused Variable Fix: The ESLint error for toggleDarkMode occurred because the function was defined but never called in your JSX. I added the toggle button back into the header.
  // Redundancy Fix: I consolidated your useEffect calls. You had two different effects trying to load favorites; I combined them into one clean logic flow using useCallback.
  // Definitions for your notes:
  // Lazy Initialization: Passing a function to useState. React only runs this function on the very first render to determine the initial state.
  // Cascading Render: A situation where a state update inside an effect triggers a second render immediately after the first one, leading to poor performance.
  // Does your IDE show a clean slate now with no red/yellow lines? If so, your Weather Dashboard is officially complete! Would you like to talk about how to host this online (e.g., using Vercel or Render)?
}
