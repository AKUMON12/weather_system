import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// This is how we map your JSON 'list' to the chart
const formatChartData = (list: any[]) => {
  return list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
    rain: item.pop * 100, // Probability of precipitation
    feelsLike: Math.round(item.main.feels_like)
  }));
};

export const WeatherChart = ({ data }: { data: any }) => {
  const chartData = formatChartData(data.list);

  return (
    <div className="glass-card p-6 h-[400px] w-full">
      <h3 className="text-lg font-semibold mb-4 font-outfit">24-Hour Temperature Trend</h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          {/* 2. Use lowercase standard SVG tags here */}
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />

          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />

          <YAxis
            hide={true}
            domain={['dataMin - 5', 'dataMax + 5']}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white'
            }}
            itemStyle={{ color: 'hsl(var(--primary))' }}
          />

          <Area
            type="monotone"
            dataKey="temp"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTemp)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;