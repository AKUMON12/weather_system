import { MapPin, Sun, CloudRain, Cloud, Moon, CloudLightning, Snowflake, Plus, X } from 'lucide-react';

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
  onSelectCity: (cityName: string) => void;
  onRemoveCity?: (id: string) => void;
  // Add these two props
  textColor: string;
  subTextColor: string;
}

const getConditionIcon = (condition: string) => {
  const iconClass = "w-5 h-5"; // Slightly larger for better visibility
  switch (condition) {
    case 'sunny':
      return <Sun className={`${iconClass} text-amber-400`} />;
    case 'rainy':
      return <CloudRain className={`${iconClass} text-blue-400`} />;
    case 'cloudy':
      return <Cloud className={`${iconClass} text-slate-400`} />;
    case 'night':
      return <Moon className={`${iconClass} text-purple-400`} />;
    case 'stormy':
      return <CloudLightning className={`${iconClass} text-indigo-400`} />;
    case 'snowy':
      return <Snowflake className={`${iconClass} text-sky-200`} />;
    default:
      return <Sun className={`${iconClass} text-amber-400`} />;
  }
};

const FavoritesSidebar = ({
  favorites,
  selectedCity,
  onSelectCity,
  onRemoveCity,
  textColor,      // Destructure here
  subTextColor    // Destructure here
}: FavoritesSidebarProps) => {
  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className={`font-display text-lg font-bold uppercase tracking-wider ${textColor}`}>Favorites</h3>
          <p className={`text-[10px] uppercase tracking-widest ${subTextColor}`}>Saved Portals</p>
        </div>
        {/* ... Plus button remains same ... */}
      </div>

      <div className="space-y-3 custom-scrollbar overflow-y-auto flex-1 pr-2">
        {favorites.map((city) => (
          <div key={city.id} className="group relative">
            <button
              onClick={() => onSelectCity(city.name)}
              className={`w-full p-4 rounded-2xl text-left transition-all duration-500 flex items-center justify-between group-hover:translate-x-1 ${selectedCity === city.id
                ? 'bg-primary/20 border border-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.1)]'
                : 'bg-white/5 border border-white/5 hover:border-white/20'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 shadow-inner">
                  {getConditionIcon(city.condition)}
                </div>

                <div>
                  {/* Applied textColor here */}
                  <p className={`font-bold text-sm leading-tight mb-0.5 ${textColor}`}>{city.name}</p>
                  {/* Applied subTextColor here */}
                  <p className={`text-[10px] uppercase tracking-widest font-medium ${subTextColor}`}>
                    {city.country}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {/* Applied textColor here */}
                <span className={`text-xl font-black tracking-tighter ${textColor}`}>
                  {Math.round(city.temperature)}°
                </span>
              </div>
            </button>
            {/* ... Delete button remains same ... */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesSidebar;