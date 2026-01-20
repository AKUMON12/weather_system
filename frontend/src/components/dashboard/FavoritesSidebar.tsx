import { MapPin, Sun, CloudRain, Cloud, Moon, CloudLightning, Snowflake, Plus } from 'lucide-react';

interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  temperature: number;
  condition: 'sunny' | 'rainy' | 'cloudy' | 'night' | 'stormy' | 'snowy';
}

interface FavoritesSidebarProps {
  favorites: FavoriteCity[];
  selectedCity: string | null;
  onSelectCity: (cityId: string) => void;
}

const getConditionIcon = (condition: string) => {
  const iconClass = "w-4 h-4";
  switch (condition) {
    case 'sunny':
      return <Sun className={`${iconClass} text-neon-amber`} />;
    case 'rainy':
      return <CloudRain className={`${iconClass} text-neon-blue`} />;
    case 'cloudy':
      return <Cloud className={`${iconClass} text-muted-foreground`} />;
    case 'night':
      return <Moon className={`${iconClass} text-neon-purple`} />;
    case 'stormy':
      return <CloudLightning className={`${iconClass} text-neon-purple`} />;
    case 'snowy':
      return <Snowflake className={`${iconClass} text-neon-blue`} />;
    default:
      return <Sun className={`${iconClass} text-neon-amber`} />;
  }
};

const FavoritesSidebar = ({ favorites, selectedCity, onSelectCity }: FavoritesSidebarProps) => {
  return (
    <div className="glass-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">Favorites</h3>
        <button aria-label="Add new favorite city" title="Add Favorite" className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 custom-scrollbar overflow-y-auto max-h-[calc(100vh-200px)]">
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No favorites yet</p>
            <p className="text-xs mt-1">Search and save cities</p>
          </div>
        ) : (
          favorites.map((city) => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city.id)}
              className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                selectedCity === city.id
                  ? 'bg-primary/20 border border-primary/50'
                  : 'bg-muted/30 hover:bg-muted/50 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getConditionIcon(city.condition)}
                  <div>
                    <p className="font-medium text-foreground text-sm">{city.name}</p>
                    <p className="text-xs text-muted-foreground">{city.country}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-foreground">{city.temperature}°</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesSidebar;
