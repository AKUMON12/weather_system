import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Heart } from "lucide-react"; // To match your dashboard style

interface WeatherChartProps {
  weather: {
    city: string;
    country: string;
    temperature: number;
    condition: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  // We'll keep a fallback for the chart data in case it's not in the main weather object
  forecastData?: any; 
}

const WeatherChart = ({ weather, isFavorite, onToggleFavorite, forecastData }: WeatherChartProps) => {
  
  // 1. Format the data for the chart
  // Check if forecastData exists, otherwise use an empty array to prevent crashes
  const chartData = forecastData?.list?.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temp: Math.round(item.main.temp),
  })) || [];

  return (
    <div className="glass-card p-8 rounded-[2rem] w-full animate-scale-in">
      {/* --- HERO SECTION (New) --- */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-bold text-white mb-1">{weather.city}</h2>
          <p className="text-slate-400 flex items-center gap-2">
            {weather.country} • <span className="capitalize">{weather.condition}</span>
          </p>
        </div>
        
        <button 
          aria-label="Toggle Favorite"
          type="button" // Add this
          onClick={onToggleFavorite}
          className={`p-3 rounded-2xl transition-all ${
            isFavorite 
              ? "bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="mb-10">
        <span className="text-7xl font-bold text-white tracking-tighter">
          {Math.round(weather.temperature)}°
        </span>
      </div>

      {/* --- CHART SECTION --- */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-sm font-medium text-slate-300 mb-6 uppercase tracking-wider">
          24-Hour Temp Trend
        </h3>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}°`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
              Loading forecast trend...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;