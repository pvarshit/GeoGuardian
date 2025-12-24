import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Download, Calendar,
    TrendingUp, Activity, AlertTriangle, Wind, BarChart2, Thermometer, Droplets, Scan
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, ScatterChart, Scatter
} from 'recharts';

interface HistoryData {
    summary: {
        total_records: number;
        avg_aqi: number;
        avg_pm25: number;
        max_aqi: number;
    };
    trend: {
        date: string;
        aqi: number;
        pm25: number;
        temp: number;
        humidity: number;
        wind_speed: number;
    }[];
    monthly: {
        name: string;
        avg_pm25: number;
        max_pm25: number;
        min_pm25: number;
    }[];
    city: string;
}

import { getSatellitePreview } from '../services/agentApi';

const Explorer = () => {
    const [data, setData] = useState<HistoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [selectedCity, setSelectedCity] = useState('Hyderabad');

    const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
        'Hyderabad': { lat: 17.3850, lon: 78.4867 },
        'New Delhi': { lat: 28.6139, lon: 77.2090 },
        'Mumbai': { lat: 19.0760, lon: 72.8777 }
    };

    useEffect(() => {
        fetchData(selectedCity);
        // Fetch Preview
        const coords = CITY_COORDS[selectedCity];
        if (coords) {
            setPreviewImage(null);
            getSatellitePreview(coords.lat, coords.lon).then(data => setPreviewImage(data ? data.image : null));
        }
    }, [selectedCity]);

    const fetchData = async (city: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`http://localhost:8100/explorer/history?city=${city}`);
            if (!res.ok) throw new Error('Failed to fetch data');
            const result = await res.json();
            if (result.error) throw new Error(result.error);
            setData(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!data) return;
        const headers = ["Date", "AQI", "PM2.5", "Temperature (C)", "Humidity (%)", "Wind Speed (m/s)"];
        const rows = data.trend.map(d => [
            d.date, d.aqi, d.pm25, d.temp, d.humidity, d.wind_speed
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${selectedCity}_air_quality_history.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-gray-900 text-white">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                        Research Explorer
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Deep dive into environmental datastores for <span className="text-white font-bold">{selectedCity}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="bg-gray-800/80 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary outline-none backdrop-blur-md"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="New Delhi">New Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                    </select>
                    <button
                        onClick={handleExport}
                        disabled={!data || loading}
                        className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-brand-primary/20"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <Link to="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>

            {/* Satellite Preview Header */}
            {
                previewImage && (
                    <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 shadow-2xl overflow-hidden animate-fade-in relative group h-48">
                        <img
                            src={`data:image/jpeg;base64,${previewImage}`}
                            alt="Satellite Preview"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="text-center">
                                <h3 className="text-2xl font-heading font-bold text-white flex items-center justify-center gap-2">
                                    <Scan className="w-6 h-6 text-brand-secondary" /> {selectedCity} Satellite Feed
                                </h3>
                                <p className="text-sm text-gray-300">Live Optical Imagery • Sentinel-2 / Maps API</p>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-brand-secondary border-b-transparent rounded-full animate-spin-reverse opacity-50"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-2xl text-center max-w-2xl mx-auto backdrop-blur-md">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Data Unavailable</h3>
                        <p className="text-gray-300">{error}</p>
                        <div className="mt-6 p-4 bg-black/30 rounded-lg text-left text-sm font-mono text-gray-400">
                            <p>Troubleshooting:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Ensure `{selectedCity}.xlsx` exists in `backend/sensor_fusion_agent/data/`</li>
                                <li>Check if backend server is running on port 8100</li>
                            </ul>
                        </div>
                    </div>
                ) : data && (
                    <div className="space-y-8 animate-fade-in-up">

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Records', icon: Calendar, value: data.summary.total_records.toLocaleString(), color: 'text-white' },
                                { label: 'Avg AQI Level', icon: Activity, value: data.summary.avg_aqi, color: data.summary.avg_aqi > 100 ? 'text-orange-400' : 'text-green-400' },
                                { label: 'Avg PM2.5 Concentration', icon: Wind, value: `${data.summary.avg_pm25.toFixed(1)} µg/m³`, color: 'text-blue-400' },
                                { label: 'Max Peak Recorded', icon: TrendingUp, value: data.summary.max_aqi, color: 'text-red-500' },
                            ].map((kpi, idx) => (
                                <div key={idx} className="bg-gray-900/40 border border-white/5 p-5 rounded-2xl backdrop-blur-md hover:bg-gray-900/60 transition-colors group">
                                    <div className="flex items-center gap-3 mb-2 text-gray-500 group-hover:text-gray-300 transition-colors text-sm uppercase font-bold tracking-wider">
                                        <kpi.icon className="w-4 h-4" /> {kpi.label}
                                    </div>
                                    <div className={`text-3xl font-heading font-bold ${kpi.color}`}>
                                        {kpi.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Trend Chart */}
                        <div className="bg-gray-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-brand-primary" /> Pollution Trends (PM2.5 vs AQI)
                                </h3>
                                <div className="text-xs text-gray-500 font-mono">
                                    Source: Local Sensor Archives
                                </div>
                            </div>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPm" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#666"
                                            fontSize={12}
                                            tickFormatter={(val) => {
                                                const d = new Date(val);
                                                return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
                                            }}
                                            minTickGap={50}
                                        />
                                        <YAxis stroke="#666" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                            labelStyle={{ color: '#94a3b8', marginBottom: '8px', borderBottom: '1px solid #334155', paddingBottom: '4px' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Area type="monotone" dataKey="pm25" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPm)" name="PM2.5 Conc. (µg/m³)" />
                                        <Area type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAqi)" name="AQI Index" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Correlation Analysis Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Thermometer className="w-5 h-5 text-orange-400" /> Correlation: Temp vs PM2.5
                                </h3>
                                <p className="text-gray-400 text-sm mb-6">Does higher temperature reduce pollution?</p>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                            <XAxis type="number" dataKey="temp" name="Temperature" unit="°C" stroke="#666" fontSize={12} />
                                            <YAxis type="number" dataKey="pm25" name="PM2.5" unit="µg/m³" stroke="#666" fontSize={12} />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #333' }} />
                                            <Scatter name="Temp Correlation" data={data.trend} fill="#f97316" fillOpacity={0.6} />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-gray-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Droplets className="w-5 h-5 text-blue-400" /> Correlation: Humidity vs PM2.5
                                </h3>
                                <p className="text-gray-400 text-sm mb-6">Impact of moisture on particle suspension.</p>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                            <XAxis type="number" dataKey="humidity" name="Humidity" unit="%" stroke="#666" fontSize={12} />
                                            <YAxis type="number" dataKey="pm25" name="PM2.5" unit="µg/m³" stroke="#666" fontSize={12} />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #333' }} />
                                            <Scatter name="Humidity Correlation" data={data.trend} fill="#3b82f6" fillOpacity={0.6} />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Distribution - Bar Charts */}
                        <div className="bg-gray-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-6">Seasonal Analysis: Monthly Peak Pollution</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.monthly}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} />
                                        <YAxis stroke="#666" fontSize={12} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                                        />
                                        <Bar dataKey="avg_pm25" fill="#3b82f6" name="Average PM2.5" stackId="a" />
                                        <Bar dataKey="max_pm25" fill="#ef4444" name="Peak PM2.5" stackId="a" radius={[4, 4, 0, 0]} />
                                        <Legend />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                )
            }
        </div >
    );
};

export default Explorer;
