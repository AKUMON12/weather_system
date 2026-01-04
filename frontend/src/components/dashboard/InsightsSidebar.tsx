import { TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: 'sunny' | 'rainy' | 'cloudy' | 'night' | 'stormy' | 'snowy';
}

interface InsightsSidebarProps {
  forecast: ForecastDay[];
  chartData: { name: string; temp: number }[];
}

const InsightsSidebar = ({ forecast, chartData }: InsightsSidebarProps) => {
  return (
    <div className="glass-card p-4 h-full">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">5-Day Forecast</h3>

      {/* Temperature Chart */}
      <div className="mb-6">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(280, 100%, 70%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(280, 100%, 70%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 10 }}
              />
              <YAxis 
                hide
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(260, 50%, 10%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
                labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
                itemStyle={{ color: 'hsl(280, 100%, 70%)' }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="hsl(280, 100%, 70%)"
                strokeWidth={2}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Forecast List */}
      <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[calc(100vh-400px)]">
        {forecast.map((day, index) => (
          <div
            key={day.day}
            className="glass-card-subtle p-3 flex items-center justify-between animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground w-12">{day.day}</span>
              <div className="flex items-center gap-1">
                {day.high > day.low + 5 ? (
                  <TrendingUp className="w-3 h-3 text-neon-amber" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-neon-blue" />
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-foreground font-semibold">{day.high}°</span>
              <span className="text-muted-foreground text-sm">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>

      {/* Additional insights */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Today's Summary</p>
        <p className="text-sm text-foreground">
          Expect {forecast[0]?.condition === 'sunny' ? 'clear skies' : 
                  forecast[0]?.condition === 'rainy' ? 'scattered showers' :
                  forecast[0]?.condition === 'cloudy' ? 'cloudy conditions' :
                  'variable weather'} throughout the day with temperatures 
          ranging from {forecast[0]?.low}° to {forecast[0]?.high}°.
        </p>
      </div>
    </div>
  );
};

export default InsightsSidebar;
