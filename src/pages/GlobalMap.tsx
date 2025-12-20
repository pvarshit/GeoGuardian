import { useState } from 'react';
import Navbar from '../components/Navbar';
import { MapPin, Wind, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

interface Hotspot {
    id: string;
    name: string;
    aqi: number;
    pm25: number;
    status: 'Critical' | 'Poor' | 'Moderate' | 'Good';
    coordinates: { x: number; y: number }; // Percentage for CSS positioning on the map image
}

const INDIAN_HOTSPOTS: Hotspot[] = [
    { id: 'h1', name: 'New Delhi', aqi: 450, pm25: 350, status: 'Critical', coordinates: { x: 28, y: 32 } },
    { id: 'h2', name: 'Mumbai', aqi: 180, pm25: 120, status: 'Moderate', coordinates: { x: 20, y: 65 } },
    { id: 'h3', name: 'Bangalore', aqi: 85, pm25: 45, status: 'Good', coordinates: { x: 26, y: 82 } },
    { id: 'h4', name: 'Kolkata', aqi: 280, pm25: 210, status: 'Poor', coordinates: { x: 55, y: 50 } },
    { id: 'h5', name: 'Chennai', aqi: 120, pm25: 60, status: 'Moderate', coordinates: { x: 32, y: 85 } },
    { id: 'h6', name: 'Hyderabad', aqi: 150, pm25: 85, status: 'Moderate', coordinates: { x: 30, y: 68 } },
];

export default function GlobalMap() {
    const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans overflow-hidden flex flex-col pt-16">
            <Navbar />

            <div className="flex-1 flex relative">

                {/* Sidebar Overlay */}
                <aside className="absolute left-4 top-4 bottom-4 w-80 bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-2xl z-20 flex flex-col shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                            <MapPin className="text-brand-primary" />
                            Live Hotspots
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Focus Region: India</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {INDIAN_HOTSPOTS.map((hotspot) => (
                            <div
                                key={hotspot.id}
                                onClick={() => setSelectedHotspot(hotspot)}
                                className={clsx(
                                    "p-3 rounded-lg border cursor-pointer transition-all hover:translate-x-1",
                                    selectedHotspot?.id === hotspot.id ? "bg-white/10 border-brand-primary" : "bg-white/5 border-transparent hover:border-white/20"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-sm">{hotspot.name}</h3>
                                    <span className={clsx("text-[10px] px-1.5 py-0.5 rounded uppercase font-bold", {
                                        'bg-red-500/20 text-red-500': hotspot.status === 'Critical',
                                        'bg-orange-500/20 text-orange-500': hotspot.status === 'Poor',
                                        'bg-yellow-500/20 text-yellow-500': hotspot.status === 'Moderate',
                                        'bg-emerald-500/20 text-emerald-500': hotspot.status === 'Good',
                                    })}>
                                        {hotspot.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>AQI: <b className="text-white">{hotspot.aqi}</b></span>
                                    <span>PM2.5: <b className="text-white">{hotspot.pm25}</b></span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 bg-brand-primary/10 border-t border-brand-primary/20 text-xs text-brand-primary flex items-center gap-2">
                        <Info className="w-4 h-4 shrink-0" />
                        Showing real-time data from 120+ sensors.
                    </div>
                </aside>

                {/* Map Area */}
                <main className="flex-1 relative bg-[#0B1121] flex items-center justify-center overflow-hidden">
                    {/* Map Background Image */}
                    {/* NOTE: Using a placeholder visually dark map image. In a real app, this would be a refined SVG or Leaflet map. */}
                    <div className="relative w-full h-full max-w-5xl max-h-[800px] aspect-[4/3] p-8">
                        {/* Simulated India Map Shape using a high-fidelity image component/placeholder */}
                        {/* For this mock, we will place markers relative to a container that conceptually represents India's bounds */}
                        <div
                            className="w-full h-full bg-cover bg-no-repeat bg-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
                            style={{
                                backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/India_%28orthographic_projection%29.svg/1200px-India_%28orthographic_projection%29.svg.png")',
                                // This is a generic public domain map image of India for the "placeholder" requirement.
                            }}
                        ></div>

                        {/* Hotspot Markers */}
                        {/* We map the mock coordinates to % positions. Note: The image is orthographic, so precise lat/long to % is mocked */}
                        <div className="absolute inset-0 pointer-events-none">
                            {INDIAN_HOTSPOTS.map((hotspot) => (
                                <div
                                    key={hotspot.id}
                                    className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                    style={{ left: `${hotspot.coordinates.x + 20}%`, top: `${hotspot.coordinates.y - 10}%` }} // Adjusted offset for the specific map image framing
                                    onClick={() => setSelectedHotspot(hotspot)}
                                >
                                    {/* Pulsing Effect */}
                                    <div className={clsx("w-4 h-4 rounded-full relative z-10 box-content border-2 border-white/20 shadow-[0_0_15px_currentColor]", {
                                        'bg-red-500 text-red-500': hotspot.status === 'Critical',
                                        'bg-orange-500 text-orange-500': hotspot.status === 'Poor',
                                        'bg-yellow-500 text-yellow-500': hotspot.status === 'Moderate',
                                        'bg-emerald-500 text-emerald-500': hotspot.status === 'Good',
                                    })}>
                                        <div className="absolute inset-0 rounded-full bg-current animate-ping opacity-75"></div>
                                    </div>

                                    {/* Tooltip on Hover */}
                                    <div className="absolute top-full text-center left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        <span className="bg-gray-900 text-xs px-2 py-1 rounded border border-white/10">{hotspot.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Hotspot Detail Card (Floating) */}
                    {selectedHotspot && (
                        <div className="absolute top-4 right-4 w-72 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl z-30 animate-fade-in-up">
                            <button
                                onClick={() => setSelectedHotspot(null)}
                                className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-heading font-bold">{selectedHotspot.name}</h3>
                                <span className={clsx("text-xs px-2 py-1 rounded badge font-bold", {
                                    'bg-red-500/20 text-red-500': selectedHotspot.status === 'Critical',
                                    'bg-orange-500/20 text-orange-500': selectedHotspot.status === 'Poor',
                                    'bg-yellow-500/20 text-yellow-500': selectedHotspot.status === 'Moderate',
                                    'bg-emerald-500/20 text-emerald-500': selectedHotspot.status === 'Good',
                                })}>{selectedHotspot.status}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-gray-400 flex items-center gap-2"><Wind className="w-4 h-4" /> AQI</span>
                                    <span className="text-xl font-bold">{selectedHotspot.aqi}</span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-gray-400">PM 2.5</span>
                                    <span className="text-xl font-bold">{selectedHotspot.pm25} µg/m³</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Analysis from Agents</h4>
                                <p className="text-xs text-gray-300 leading-relaxed">
                                    Sensor Fusion Agent detects elevated particle levels consistent with {selectedHotspot.status === 'Critical' ? 'heavy industrial activity and crop burning' : 'local traffic congestion'}.
                                </p>
                            </div>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}
