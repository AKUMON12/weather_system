import { Droplets, Wind, Gauge, Eye } from "lucide-react"; // Standard icon library

interface WeatherMetricsGridProps {
    currentData: {
        main: any;
        wind: any;
        visibility: any;
    };
    isSunny?: boolean; // 💡 Add this line
}

export const WeatherMetricsGrid = ({
    currentData,
    isSunny = false
}: WeatherMetricsGridProps) => {
    const { main, wind, visibility } = currentData;
    const textColor = isSunny ? 'text-slate-900' : 'text-white';
    const labelColor = isSunny ? 'text-slate-700/60' : 'text-white/40';

    const metrics = [
        {
            label: "Humidity", value: `${main.humidity}%`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
            )
        },

        {
            label: "Wind Speed", value: `${wind.speed} m/s`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                </svg>
            )
        },

        {
            label: "Pressure", value: `${main.pressure} hPa`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
            )
        },

        {
            label: "Visibility", value: `${(visibility / 1000).toFixed(1)} km`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m) => (
                <div key={m.label} className="glass-card p-4 flex flex-col items-center">
                    <span className="text-2xl mb-2">{m.icon}</span>
                    <span className={`text-xs uppercase tracking-widest ${labelColor}`}>{m.label}</span>
                    <span className={`text-xl font-bold ${textColor}`}>{m.value}</span>
                </div>
            ))}
        </div>
    );
};