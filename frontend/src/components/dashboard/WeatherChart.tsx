import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeatherChart = ({ data }) => {
  // 1. Format the data for the chart
  // We'll take the first 8 items (which represents the next 24 hours)
  const chartData = data.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temp: Math.round(item.main.temp),
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        24-Hour Temp Trend (°C)
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;
