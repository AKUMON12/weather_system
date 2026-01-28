import { useState, useCallback } from 'react';
import InteractiveBackground from '@/components/backgrounds/InteractiveBackground';
import SearchBar from '@/components/dashboard/SearchBar';

// Note: I'm renaming WeatherHero to WeatherChart here to match your new file
import { WeatherChart } from '@/components/dashboard/WeatherChart';
import { WeatherMetricsGrid } from "@/components/dashboard/WeatherMetricsGrid";

import FavoritesSidebar from '@/components/dashboard/FavoritesSidebar';
import InsightsSidebar from '@/components/dashboard/InsightsSidebar';
import { Cloud, LogOut } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'night' | 'stormy' | 'snowy';

// --- MOCK DATA ---
const mockWeather = {
  city: 'New York',
  country: 'United States',
  temperature: 24,
  condition: 'sunny' as WeatherCondition,
  humidity: 65,
  windSpeed: 12,
  windGust: 15,
  pressure: 1012,
  visibility: 10000,
  feelsLike: 26,
};

// This matches the format the new WeatherChart expects
const mockForecastList = [
  { dt: 1769547600, main: { temp: 24, feels_like: 26, humidity: 65, pressure: 1012 }, pop: 0.1, wind: { speed: 12 } },
  { dt: 1769558400, main: { temp: 26, feels_like: 28, humidity: 60, pressure: 1011 }, pop: 0.0, wind: { speed: 10 } },
  { dt: 1769569200, main: { temp: 28, feels_like: 30, humidity: 55, pressure: 1010 }, pop: 0.0, wind: { speed: 14 } },
  { dt: 1769580000, main: { temp: 27, feels_like: 29, humidity: 58, pressure: 1010 }, pop: 0.2, wind: { speed: 11 } },
  { dt: 1769590800, main: { temp: 23, feels_like: 24, humidity: 70, pressure: 1012 }, pop: 0.4, wind: { speed: 8 } },
  { dt: 1769601600, main: { temp: 21, feels_like: 21, humidity: 75, pressure: 1013 }, pop: 0.1, wind: { speed: 6 } },
  { dt: 1769612400, main: { temp: 20, feels_like: 20, humidity: 80, pressure: 1014 }, pop: 0.0, wind: { speed: 5 } },
  { dt: 1769623200, main: { temp: 19, feels_like: 19, humidity: 82, pressure: 1015 }, pop: 0.0, wind: { speed: 4 } },
];

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [weather, setWeather] = useState(mockWeather);
  const [favorites, setFavorites] = useState([
    { id: '1', name: 'Tokyo', country: 'Japan', temperature: 18, condition: 'cloudy' as WeatherCondition },
    { id: '2', name: 'London', country: 'UK', temperature: 12, condition: 'rainy' as WeatherCondition },
  ]);
  const [isSearching, setIsSearching] = useState(false);

  const getWeatherCondition = useCallback(() => {
    if (['sunny', 'cloudy'].includes(weather.condition)) return 'sunny';
    if (['rainy', 'stormy'].includes(weather.condition)) return 'rainy';
    return 'night';
  }, [weather.condition]);

  return (
    <div className="min-h-screen">
      <InteractiveBackground weatherCondition={getWeatherCondition()} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold gradient-text">SkyCast OS</h1>
              <p className="text-xs text-muted-foreground">Atmospheric Portal</p>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 rounded-lg bg-muted/50 hover:bg-destructive/20 transition-colors" title="Log Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8"><SearchBar onSearch={() => { }} isLoading={isSearching} /></div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left - Favorites */}
            <div className="lg:col-span-3">
              <FavoritesSidebar
                favorites={favorites}
                selectedCity={null}
                onSelectCity={() => { }}
                textColor="text-gray-900"
                subTextColor="text-gray-500"
              />
            </div>

            {/* Center - MAIN CHART & METRICS */}
            <div className="lg:col-span-6 space-y-6">
              {/* The Temperature Chart */}
              <WeatherChart data={{ list: mockForecastList }} />

              {/* The Metric Grid (Humidity, Wind, etc.) */}
              <WeatherMetricsGrid currentData={{
                main: { humidity: weather.humidity, pressure: weather.pressure },
                wind: { speed: weather.windSpeed, gust: weather.windGust },
                visibility: weather.visibility
              }} />
            </div>

            {/* Right - Insights */}
            <div className="lg:col-span-3">
              <InsightsSidebar forecast={[]} chartData={[]} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;