import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./index.css";
import WeatherChart from "./components/dashboard/WeatherChart";

// Add these imports at the top of App.tsx
import { WeatherHero } from "./components/dashboard/WeatherHero";
import { WeatherMetricsGrid } from "./components/dashboard/WeatherMetricsGrid";

import FavoritesSidebar from "./components/dashboard/FavoritesSidebar";

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
  temp?: number;    // Added this
  country?: string; // Added this
}

function App() {

  // Page Title
  useEffect(() => {
    document.title = "Weather Monitoring";
  }, []);

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

  // 2. PLACE YOUR LOGIC HERE (Before the return)
  const weatherMain = displayWeather?.list?.[0]?.weather?.[0]?.main || "Night";

  const themeClass =
    weatherMain.includes('Rain') ? 'theme-rainy' :
      weatherMain.includes('Clear') ? 'theme-sunny' :
        weatherMain.includes('Clouds') ? 'theme-cloudy' :
          'theme-night';

  console.log("Current Weather:", weatherMain, "Applying Theme:", themeClass);

  // 2. MEMOIZED FETCHING
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 💡 Fetch weather for each favorite to get temperature/country
      const favoritesWithWeather = await Promise.all(
        res.data.map(async (fav: Favorite) => {
          try {
            const wRes = await axios.get(`${API_URL}/api/weather/${fav.city_name}`);
            const data = typeof wRes.data.data === 'string' ? JSON.parse(wRes.data.data) : wRes.data.data;
            return {
              ...fav,
              temp: data.list[0].main.temp,
              country: data.city.country
            };
          } catch {
            return fav; // Fallback if one city fails
          }
        })
      );

      setFavorites(favoritesWithWeather);
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
        toast.success(`Searched: ${newData.city.name}`);
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
    } catch (err: any) {
      console.error("Action failed", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        handleLogout(); // This clears the bad token
      } else {
        toast.error("Failed to update favorites.");
      }
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

  // Inside your App component, near your other states:
  const [showSync, setShowSync] = useState(false);

  useEffect(() => {
    if (isFetching) {
      setShowSync(true);
    } else {
      // When fetching stops, wait a bit before hiding the indicator
      const timer = setTimeout(() => {
        setShowSync(false);
      }, 2000); // 2 seconds minimum display time
      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  // Inside App.tsx, before the return:
  const isSunny = weatherMain.includes('Clear') || weatherMain.includes('Sunny');
  const textColor = isSunny ? 'text-slate-900' : 'text-white';
  const subTextColor = isSunny ? 'text-slate-800/60' : 'text-white/40';

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            !user ? (
              /* Auth screen remains dark for focus */
              <div className="fixed inset-0 w-full h-full flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0c]">
                <InteractiveBackground
                  weatherCondition={
                    displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('rain') ? 'rainy' :
                      displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('clear') ? 'sunny' :
                        displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('cloud') ? 'cloudy' :
                          displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('storm') ? 'stormy' : 'night'
                  }
                />
                <div className="relative z-10 w-full max-w-md animate-fade-in">
                  <Auth onAuthSuccess={(userData) => {
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                  }} />
                </div>
              </div>
            ) : (
              /* Dashboard with Dynamic Theme and Text Color */
              <div className={`skycast-bg min-h-screen p-6 transition-all duration-1000 font-sans ${themeClass} ${textColor}`}>

                <InteractiveBackground
                  weatherCondition={
                    displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('rain') ? 'rainy' :
                      displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('clear') ? 'sunny' :
                        displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('cloud') ? 'cloudy' :
                          displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('storm') ? 'stormy' : 'night'
                  }
                />

                <div className="relative z-10 max-w-[100rem] mx-auto">
                  <header className="glass-card flex justify-between items-center py-4 px-6 mb-8 mt-4 rounded-2xl border-white/5 shadow-2xl animate-fade-in">
                    {/* Left Branding */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-xl">☁️</div>
                      <div>
                        <h1 className="text-sm font-bold tracking-tight opacity-90">SkyCast OS</h1>
                        <p className={`text-[10px] uppercase tracking-widest leading-none ${subTextColor}`}>Atmospheric Portal</p>
                      </div>
                    </div>

                    {/* Center Title */}
                    <h1 className={`text-xl md:text-2xl font-black uppercase tracking-tighter text-center flex-1 transition-colors duration-500 ${textColor}`}>
                      🌤️ {user?.username}'s Sky
                      {weather?.city?.name ? ` - ${weather.city.name}` : ''}

                      {/* Changed isFetching to showSync */}
                      {showSync && (
                        <span className="ml-2 text-xs animate-pulse block md:inline transition-opacity duration-300">
                          ● LIVE SYNCING
                        </span>
                      )}
                    </h1>

                    {/* Right Controls */}
                    <div className="flex items-center gap-4">
                      <div className={`text-xs md:text-sm font-medium ${subTextColor} hidden md:block`}>
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                        })}
                        <span className="ml-2 opacity-50">|</span>
                        <span className="ml-2 font-mono">{new Date().toLocaleTimeString()}</span>
                      </div>

                      <button onClick={handleLogout} className="px-6 py-2 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-full hover:bg-destructive/40 transition-colors">
                        Logout
                      </button>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Inside the return of App.tsx */}
                    <aside className="md:col-span-1 h-full">
                      <FavoritesSidebar
                        favorites={favorites.map((fav: any) => ({
                          id: fav.favorite_id.toString(),
                          name: fav.city_name,
                          country: fav.country || "PH",
                          temperature: fav.temp || 0,
                          condition: fav.temp ? (
                            // Mapping logic for icons
                            displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('rain') ? 'rainy' :
                              displayWeather?.list?.[0]?.weather?.[0]?.main?.toLowerCase().includes('cloud') ? 'cloudy' :
                                'sunny'
                          ) : 'sunny'
                        }))}
                        selectedCity={displayWeather?.city?.name}
                        onSelectCity={(cityName) => fetchWeather(null, cityName)}
                        onRemoveCity={(id) => removeFavoriteById(Number(id))}
                        // 💡 PASS THE COLOR PROPS HERE
                        textColor={textColor}
                        subTextColor={subTextColor}
                      />
                    </aside>

                    {/* Main Content */}
                    <main className="md:col-span-3">
                      <form onSubmit={fetchWeather} className="flex gap-3 mb-12">
                        <input
                          type="text"
                          id="city-search"
                          name="city-search"
                          autoComplete="off"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Search atmospheric data..."
                          className={`flex-1 px-6 py-4 glass-card bg-white/5 border-white/10 neon-focus placeholder:opacity-50 ${textColor}`}
                        />
                        <button
                          disabled={loading}
                          type="submit"
                          className={`glass-card px-8 py-4 border-primary/50 transition-all font-bold flex items-center gap-2 ${loading
                            ? "bg-primary/10 cursor-not-allowed opacity-70"
                            : "bg-primary/20 hover:bg-primary/40 neon-glow"
                            }`}
                        >
                          {loading ? "SCANNING..." : "SCAN"}
                        </button>
                      </form>

                      {displayWeather && displayWeather.city ? (
                        <div className="animate-slide-up space-y-6" key={`weather-box-${searchId}`}>
                          <WeatherHero
                            city={displayWeather.city.name}
                            country={displayWeather.city.country}
                            temperature={displayWeather.list?.[0]?.main?.temp || 0}
                            condition={displayWeather.list?.[0]?.weather?.[0]?.description || ""}
                            isFavorite={favorites.some(f => f.city_name.toLowerCase() === displayWeather.city.name.toLowerCase())}
                            onToggleFavorite={toggleFavorite}
                            isSunny={isSunny}
                          />

                          <div className="glass-card p-6">
                            <WeatherChart data={displayWeather} />
                          </div>

                          <WeatherMetricsGrid
                            currentData={{
                              main: displayWeather.list[0].main,
                              wind: displayWeather.list[0].wind,
                              visibility: displayWeather.list[0].visibility
                            }}
                            isSunny={isSunny}
                          />
                        </div>
                      ) : (
                        <div className={`glass-card p-20 text-center ${subTextColor}`}>
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