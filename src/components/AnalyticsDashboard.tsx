import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, CloudSun, TrendingUp, Cpu, RefreshCw, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ForecastItem {
    date: string;
    predicted_aqi: number;
}

interface AnalyticsData {
    city: string;
    current_aqi_estimate: number;
    forecast: ForecastItem[];
    history?: any[]; // Allow history if we enhance backend later
    weather_detailed?: any; // AccuWeather data
    status: string;
    model_source?: string;
}

const AnalyticsDashboard: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [training, setTraining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            // Determine base URL dynamically or assume generic relative path if proxied, 
            // but for prototype using direct localhost:8100
            const res = await fetch('http://localhost:8100/analytics?city=Hyderabad');
            if (!res.ok) throw new Error('Failed to fetch analytics');
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            setError(err.message || 'Error loading data');
        } finally {
            setLoading(false);
        }
    };

    const handleTrain = async () => {
        try {
            setTraining(true);
            const res = await fetch('http://localhost:8100/train', { method: 'POST' });
            const json = await res.json();
            if (json.status === 'success') {
                alert(`Training Complete! RMSE: ${json.rmse}`);
                fetchAnalytics(); // Refresh
            } else {
                alert('Training failed: ' + (json.message || json.detail || 'Unknown error'));
            }
        } catch (err) {
            alert('Error triggering training');
        } finally {
            setTraining(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading && !data) return <div className="p-8 text-center">Loading Analytics Engine...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Predictive Analytics
                    </h1>
                    <p className="text-gray-500">AI-Powered Forecasting Model &bull; {data?.city}</p>
                </div>

                <div className="flex gap-3">
                    <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                        Return Home
                    </Link>
                    <button
                        onClick={fetchAnalytics}
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <button
                        onClick={handleTrain}
                        disabled={training}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {training ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                        {training ? 'Training Model...' : 'Retrain Model'}
                    </button>
                </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <CloudSun className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Current AQI (Est.)</p>
                            <h3 className="text-2xl font-bold">{data?.current_aqi_estimate}</h3>
                        </div>
                    </div>
                    <div className="text-xs text-gray-400">Based on live sensor fusion</div>
                </div>

                {/* AccuWeather Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-2 relative z-10">
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                            {data?.weather_detailed ? <CloudSun className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">AccuWeather® RealFeel</p>
                            <h3 className="text-2xl font-bold">
                                {data?.weather_detailed
                                    ? `${data.weather_detailed.RealFeelTemperature?.Metric?.Value}°${data.weather_detailed.RealFeelTemperature?.Metric?.Unit}`
                                    : 'N/A'}
                            </h3>
                        </div>
                    </div>
                    {data?.weather_detailed && (
                        <div className="text-xs text-gray-400 mt-2 grid grid-cols-2 gap-1 relative z-10">
                            <span>UV Index: {data.weather_detailed.UVIndexText}</span>
                            <span>Wind: {data.weather_detailed.Wind?.Speed?.Metric?.Value} km/h</span>
                        </div>
                    )}
                    <div className="absolute -right-4 -bottom-4 opacity-5">
                        <img src="/accuweather_logo.png" alt="" className="w-32" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Model Source</p>
                            <h3 className="text-lg font-bold">{data?.model_source || 'Random Forest'}</h3>
                        </div>
                    </div>
                    <div className="text-xs text-gray-400">
                        {data?.model_source?.includes('LightGBM')
                            ? 'Powered by LightGBM (City-Aware)'
                            : 'Trained on Hyderabad Data (2023-2025)'}
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Forecast Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        3-Day AQI Forecast
                    </h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        {data?.forecast && data.forecast.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.forecast}>
                                    <defs>
                                        <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => format(new Date(str), 'MMM d')}
                                        tick={{ fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="predicted_aqi"
                                        stroke="#8884d8"
                                        fillOpacity={1}
                                        fill="url(#colorAqi)"
                                        name="Predicted AQI"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-gray-400">
                                <p>Model not trained yet.</p>
                                <p className="text-sm">Click "Retrain Model" to generate forecasts.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info / Insights Panel */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold mb-4">Model Insights</h3>
                    <ul className="space-y-4 text-gray-600">
                        <li className="flex gap-3">
                            <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                            <p>The prediction model analyzes historical patterns from 2023-2025 data to forecast future AQI levels.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-2 h-2 mt-2 rounded-full bg-purple-500 shrink-0" />
                            <p>Factors included in the model: Seasonality (Day, Month), Historical Trends, and previous day's air quality.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0" />
                            <p>Use the "Retrain Model" button to update predictions whenever new data is added to the backend.</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
