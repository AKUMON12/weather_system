import { useState, useCallback } from 'react';
import InteractiveBackground from '@/components/backgrounds/InteractiveBackground';
import SearchBar from '@/components/dashboard/SearchBar';
import WeatherHero from '@/components/dashboard/WeatherChart';
import FavoritesSidebar from '@/components/dashboard/FavoritesSidebar';
import InsightsSidebar from '@/components/dashboard/InsightsSidebar';
import { Cloud, LogOut } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'night' | 'stormy' | 'snowy';

// Mock data
const mockWeather: {
  city: string;
  country: string;
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  feelsLike: number;
} = {
  city: 'New York',
  country: 'United States',
  temperature: 24,
  condition: 'sunny',
  humidity: 65,
  windSpeed: 12,
  uvIndex: 6,
  feelsLike: 26,
};

const mockFavorites: {
  id: string;
  name: string;
  country: string;
  temperature: number;
  condition: WeatherCondition;
}[] = [
  { id: '1', name: 'Tokyo', country: 'Japan', temperature: 18, condition: 'cloudy' },
  { id: '2', name: 'London', country: 'UK', temperature: 12, condition: 'rainy' },
  { id: '3', name: 'Sydney', country: 'Australia', temperature: 28, condition: 'sunny' },
  { id: '4', name: 'Paris', country: 'France', temperature: 15, condition: 'cloudy' },
];

const mockForecast = [
  { day: 'Today', high: 24, low: 18, condition: 'sunny' as const },
  { day: 'Tue', high: 22, low: 16, condition: 'cloudy' as const },
  { day: 'Wed', high: 19, low: 14, condition: 'rainy' as const },
  { day: 'Thu', high: 21, low: 15, condition: 'cloudy' as const },
  { day: 'Fri', high: 25, low: 17, condition: 'sunny' as const },
];

const mockChartData = [
  { name: 'Mon', temp: 24 },
  { name: 'Tue', temp: 22 },
  { name: 'Wed', temp: 19 },
  { name: 'Thu', temp: 21 },
  { name: 'Fri', temp: 25 },
];

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [weather, setWeather] = useState(mockWeather);
  const [favorites, setFavorites] = useState(mockFavorites);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const getWeatherCondition = useCallback((): 'sunny' | 'rainy' | 'night' | 'stormy' | 'clear' => {
    if (weather.condition === 'sunny' || weather.condition === 'cloudy') {
      return 'sunny';
    } else if (weather.condition === 'rainy' || weather.condition === 'stormy') {
      return 'rainy';
    }
    return 'night';
  }, [weather.condition]);

  const handleSearch = (city: string) => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setWeather({
        ...mockWeather,
        city,
        temperature: Math.floor(Math.random() * 20) + 10,
        condition: (['sunny', 'rainy', 'cloudy', 'night', 'stormy'] as WeatherCondition[])[Math.floor(Math.random() * 5)],
      });
      setIsSearching(false);
      setIsFavorite(favorites.some(f => f.name.toLowerCase() === city.toLowerCase()));
    }, 1000);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(f => f.name !== weather.city));
    } else {
      setFavorites([
        ...favorites,
        {
          id: Date.now().toString(),
          name: weather.city,
          country: weather.country,
          temperature: weather.temperature,
          condition: weather.condition,
        },
      ]);
    }
    setIsFavorite(!isFavorite);
  };

  const handleSelectCity = (cityId: string) => {
    setSelectedCity(cityId);
    const city = favorites.find(f => f.id === cityId);
    if (city) {
      setWeather({
        ...mockWeather,
        city: city.name,
        country: city.country,
        temperature: city.temperature,
        condition: city.condition,
      });
      setIsFavorite(true);
    }
  };

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

          <button
            onClick={onLogout}
            className="p-2 rounded-lg bg-muted/50 hover:bg-destructive/20 hover:text-destructive transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto">
          {/* Search Bar */}
          <div className="mb-8 animate-fade-in">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Favorites */}
            <div className="lg:col-span-3 order-2 lg:order-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <FavoritesSidebar
                favorites={favorites}
                selectedCity={selectedCity}
                onSelectCity={handleSelectCity}
              />
            </div>

            {/* Center - Weather Hero */}
            <div className="lg:col-span-6 order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <WeatherHero
                weather={weather}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>

            {/* Right Sidebar - Insights */}
            <div className="lg:col-span-3 order-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <InsightsSidebar
                forecast={mockForecast}
                chartData={mockChartData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
