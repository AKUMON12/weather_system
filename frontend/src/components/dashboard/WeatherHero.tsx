
interface WeatherHeroProps {
    city: string;
    country: string;
    temperature: number;
    condition: string;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    isSunny?: boolean; // 💡 Add this line
}

export const WeatherHero = ({
    city,
    country,
    temperature,
    condition,
    isFavorite,
    onToggleFavorite,
    isSunny = false, // 💡 Default to false
}: WeatherHeroProps) => {
    // Use a dynamic color variable for internal text
    const textColor = isSunny ? 'text-slate-900' : 'text-white';

    return (
        <div className={`glass-card p-8 relative overflow-hidden ${textColor}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-bold">{city}</h2>
                    <p className="text-xl opacity-70">{country}</p>
                </div>
                <button
                    onClick={onToggleFavorite}
                    className="text-2xl hover:scale-110 transition-transform"
                >
                    {isFavorite ? "⭐" : "☆"}
                </button>
            </div>

            <div className="mt-8 flex items-end gap-4">
                <span className="text-7xl font-black tracking-tighter">
                    {Math.round(temperature)}°
                </span>
                <span className="text-2xl font-medium pb-2 capitalize opacity-80">
                    {condition}
                </span>
            </div>
        </div>
    );
};