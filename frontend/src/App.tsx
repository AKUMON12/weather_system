import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./index.css";
import WeatherChart from "./components/dashboard/WeatherChart";
import Auth from "./components/auth/AuthCard";
import InteractiveBackground from "./components/backgrounds/InteractiveBackground";

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface Favorite {
  favorite_id: number;
  city_name: string;
}

function App() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // 1. STATE DECLARATIONS
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // FIXED: Re-added missing state declarations
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. MEMOIZED FETCHING
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

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  // 3. HANDLERS
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

  const fetchWeather = async (e: any, cityName = city) => {
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
    if (!weather) return;
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

  // 4. RENDER LOGIC
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              !user ? (
                /* Change the line below to use your atmospheric classes */
                <div className="relative min-h-screen bg-background gradient-night flex items-center justify-center p-4 overflow-hidden">
                  {/* This renders the stars/particles */}
                  <InteractiveBackground />

                  {/* Content wrapper with z-index to stay above the background */}
                  <div className="relative z-10 w-full max-w-md animate-fade-in">
                    <Auth onAuthSuccess={(userData) => {
                      setUser(userData);
                      localStorage.setItem("user", JSON.stringify(userData));
                    }} />
                  </div>
                </div>
              ) : (
                // inside App.tsx return block...
                <div className={`min-h-screen p-6 transition-all duration-700 font-sans ${weather?.list[0].weather[0].main.includes('Rain') ? 'theme-rainy gradient-rainy' :
                  weather?.list[0].weather[0].main.includes('Clear') ? 'theme-sunny gradient-sunny' : 'gradient-night'
                  }`}>
                  <div className="max-w-6xl mx-auto">
                    {/* Header with Glassmorphism */}
                    <header className="glass-card p-6 mb-8 flex justify-between items-center animate-fade-in">
                      <h1 className="text-4xl font-black gradient-text uppercase tracking-tighter">
                        🌤️ {user.username}'s Sky
                      </h1>
                      <div className="flex gap-4">
                        <button onClick={toggleDarkMode} className="p-3 glass-card-subtle hover-lift">
                          {darkMode ? "🌙" : "☀️"}
                        </button>
                        <button onClick={handleLogout} className="px-6 py-2 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-full hover:bg-destructive/40 transition-colors">
                          Logout
                        </button>
                      </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {/* Sidebar - Using your .glass-card class */}
                      <aside className="glass-card p-6 h-fit sticky top-6">
                        <h3 className="font-bold mb-6 text-primary border-b border-white/10 pb-2 uppercase tracking-widest text-xs">
                          ⭐ Favorites
                        </h3>
                        <div className="space-y-2 custom-scrollbar max-h-[400px] overflow-y-auto">
                          {favorites.map((fav) => (
                            <button
                              key={fav.favorite_id}
                              onClick={() => fetchWeather(null, fav.city_name)}
                              className="block w-full text-left p-3 rounded-xl glass-card-subtle hover-lift text-sm transition-all"
                            >
                              📍 {fav.city_name}
                            </button>
                          ))}
                        </div>
                      </aside>

                      {/* Main Content */}
                      <main className="md:col-span-3">
                        <form onSubmit={fetchWeather} className="flex gap-3 mb-12">
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Search atmospheric data..."
                            className="flex-1 px-6 py-4 glass-card bg-white/5 border-white/10 neon-focus text-white placeholder:text-white/30"
                          />
                          <button disabled={loading} className="glass-card px-8 py-4 bg-primary/20 hover:bg-primary/40 border-primary/50 neon-glow transition-all font-bold">
                            {loading ? "..." : "SCAN"}
                          </button>
                        </form>

                        {weather && (
                          <div className="animate-slide-up">
                            <div className="glass-card p-10 relative overflow-hidden">
                              {/* This pulls from your WeatherChart.tsx */}
                              <WeatherChart
                                weather={{
                                  city: weather.city.name,
                                  country: weather.city.country || "", // 👈 Add this line
                                  temperature: weather.list[0].main.temp,
                                  condition: weather.list[0].weather[0].description
                                }}
                                isFavorite={favorites.some(f => f.city_name === weather.city.name)}
                                onToggleFavorite={saveFavorite}
                                forecastData={weather}
                              />
                            </div>
                          </div>
                        )}
                      </main>
                    </div>
                  </div>
                </div>
              )
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;