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

import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface Favorite {
  favorite_id: number;
  city_name: string;
}

function App() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const queryClient = useQueryClient();

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState(0);

  // 1. Add a new state specifically for the display logic
  const [displayWeather, setDisplayWeather] = useState<any>(null);

  // 1.1 IMPROVED REACT QUERY
  const { data: weatherData, isFetching } = useQuery({
    queryKey: ["weather", weather?.city?.name],
    queryFn: async () => {
      if (!weather?.city?.name) return null;
      try {
        const response = await axios.get(`${API_URL}/api/weather/${weather.city.name}`);
        // newData will be populated from the cache if the status is 304
        const newData = response.data.data;

        // Force state updates even if data is the same
        setWeather(newData);
        setDisplayWeather(newData);

        return newData;
      } catch (err) {
        console.error("Auto-sync failed", err);
        throw err;
      }
    },
    enabled: !!weather?.city?.name,
    staleTime: 0,            // 👈 Tell React Query to always check the server
    refetchInterval: 30000,  // 👈 Check every 30 seconds
  });

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

  // 2. CLEANER fetchWeather
  const fetchWeather = async (e: any, cityName = city) => {
    if (e) e.preventDefault();
    const targetCity = cityName?.trim();
    if (!targetCity) return;

    setLoading(true);
    setDisplayWeather(null);

    try {
      const response = await axios.get(`${API_URL}/api/weather/${targetCity}?t=${Date.now()}`);

      // 💡 THE CRITICAL FIX: Handle stringified database data
      let rawData = response.data.data;

      // If the data is a string (from your database source), parse it!
      if (typeof rawData === 'string') {
        try {
          rawData = JSON.parse(rawData);
        } catch (parseErr) {
          console.error("Failed to parse DB weather data", parseErr);
        }
      }

      const newData = { ...rawData };

      setWeather(newData);

      setTimeout(() => {
        setSearchId(prev => prev + 1);
        setDisplayWeather(newData);
        setLoading(false);
        toast.success(`Synced from ${response.data.source}: ${newData.city.name}`);
      }, 500);

      setCity("");
    } catch (err) {
      toast.error("City not found");
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    // 1. Use displayWeather instead of weather
    if (!displayWeather || !displayWeather.city) {
      toast.error("No active weather data to save.");
      return;
    };

    const token = localStorage.getItem("token");
    const cityName = displayWeather.city.name;

    // 2. Match current city with favorites list
    const existingFav = favorites.find(f =>
      f.city_name.toLowerCase() === cityName.toLowerCase()
    );

    try {
      if (existingFav) {
        // DELETE
        await axios.delete(`${API_URL}/api/favorites/${existingFav.favorite_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.info(`${cityName} removed from favorites.`);
      } else {
        // SAVE
        await axios.post(`${API_URL}/api/favorites`, {
          city_name: cityName,
          lat: displayWeather.city.coord.lat,
          lon: displayWeather.city.coord.lon,
        }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success(`${cityName} saved to favorites!`);
      }
      fetchFavorites(); // Refresh the sidebar list
    } catch (err) {
      console.error("Action failed", err);
      toast.error("Failed to update favorites.");
    }
  };

  const removeFavoriteById = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/api/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFavorites();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    // <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            !user ? (
              <div className="relative min-h-screen bg-transparent flex items-center justify-center p-4 overflow-hidden">
                <InteractiveBackground />
                <div className="relative z-10 w-full max-w-md animate-fade-in">
                  <Auth onAuthSuccess={(userData) => {
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                  }} />
                </div>
              </div>
            ) : (
              <div className={`min-h-screen p-6 transition-all duration-700 font-sans ${weather?.list?.[0]?.weather?.[0]?.main?.includes('Rain') ? 'theme-rainy gradient-rainy' :
                weather?.list?.[0]?.weather?.[0]?.main?.includes('Clear') ? 'theme-sunny gradient-sunny' : 'gradient-night'
                }`}>
                <div className="max-w-6xl mx-auto">
                  <header className="glass-card p-6 mb-8 flex justify-between items-center animate-fade-in">
                    <h1 className="text-4xl font-black gradient-text uppercase tracking-tighter">
                      🌤️ {user?.username}'s Sky {weather?.city?.name ? `- ${weather.city.name}` : ''}
                      {isFetching && <span className="ml-2 text-xs animate-pulse text-primary">● LIVE SYNCING</span>}
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
                    {/* Sidebar */}
                    <aside className="glass-card p-6 h-fit sticky top-6">
                      <h3 className="font-bold mb-6 text-primary border-b border-white/10 pb-2 uppercase tracking-widest text-xs">
                        ⭐ Favorites
                      </h3>
                      <div className="space-y-2 custom-scrollbar max-h-[400px] overflow-y-auto">
                        {favorites.map((fav) => (
                          <div key={fav.favorite_id} className="group flex items-center gap-2">
                            <button
                              onClick={() => fetchWeather(null, fav.city_name)}
                              className="flex-1 text-left p-3 rounded-xl glass-card-subtle hover-lift text-sm transition-all"
                            >
                              📍 {fav.city_name}
                            </button>
                            <button
                              onClick={() => removeFavoriteById(fav.favorite_id)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-white/40 hover:text-red-400 transition-all"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {favorites.length === 0 && (
                          <p className="text-xs text-white/30 text-center py-4">No saved locations</p>
                        )}
                      </div>
                    </aside>

                    {/* Main Content */}
                    <main className="md:col-span-3">
                      <form onSubmit={fetchWeather} className="flex gap-3 mb-12">
                        <input
                          type="text"
                          id="city-search"       // 👈 Fixes "Missing ID"
                          name="city-search"     // 👈 Fixes "Missing Name"
                          autoComplete="off"     // 👈 Fixes "Missing Autocomplete" (use "off" for search bars)
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Search atmospheric data..."
                          className="flex-1 px-6 py-4 glass-card bg-white/5 border-white/10 neon-focus text-white placeholder:text-white/30"
                        />
                        <button
                          disabled={loading}
                          type="submit"
                          className={`glass-card px-8 py-4 border-primary/50 transition-all font-bold flex items-center gap-2 ${loading
                            ? "bg-primary/10 cursor-not-allowed opacity-70"
                            : "bg-primary/20 hover:bg-primary/40 neon-glow"
                            }`}
                        >
                          {loading ? (
                            <>
                              <span className="animate-spin text-lg">⚙️</span>
                              SCANNING...
                            </>
                          ) : (
                            "SCAN"
                          )}
                        </button>
                      </form>

                      {displayWeather && displayWeather.city ? (
                        <div
                          className="animate-slide-up"
                          // 💡 This unique key forces the UI to re-appear even if data is the same
                          key={`weather-box-${displayWeather.city.name}-${searchId}`}
                        >
                          <div className="glass-card p-10 relative overflow-hidden">
                            <WeatherChart
                              weather={{
                                city: displayWeather.city.name,
                                country: displayWeather.city.country || "",
                                temperature: displayWeather.list?.[0]?.main?.temp || 0,
                                condition: displayWeather.list?.[0]?.weather?.[0]?.description || "N/A"
                              }}
                              isFavorite={favorites.some(f => f.city_name.toLowerCase() === displayWeather.city.name.toLowerCase())}
                              onToggleFavorite={toggleFavorite}
                              forecastData={displayWeather}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="glass-card p-20 text-center opacity-40">
                          {loading ? (
                            <p className="text-xl animate-pulse uppercase tracking-widest">Scanning Atmosphere...</p>
                          ) : (
                            <p className="text-xl italic">Ready for Scanning...</p>
                          )}
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

  );
}

export default App;