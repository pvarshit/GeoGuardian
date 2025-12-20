import { useState } from 'react';
import Navbar from '../components/Navbar';
import { MapPin, Info, X, Layers, Wind } from 'lucide-react';
import { clsx } from 'clsx';
import LiveMap, { type Hotspot } from '../components/LiveMap';



const INDIAN_HOTSPOTS: Hotspot[] = [
    { id: 'h1', name: 'New Delhi', aqi: 450, pm25: 350, status: 'Critical', lat: 28.6139, lng: 77.2090 },
    { id: 'h2', name: 'Mumbai', aqi: 180, pm25: 120, status: 'Moderate', lat: 19.0760, lng: 72.8777 },
    { id: 'h3', name: 'Bangalore', aqi: 85, pm25: 45, status: 'Good', lat: 12.9716, lng: 77.5946 },
    { id: 'h4', name: 'Kolkata', aqi: 280, pm25: 210, status: 'Poor', lat: 22.5726, lng: 88.3639 },
    { id: 'h5', name: 'Chennai', aqi: 120, pm25: 60, status: 'Moderate', lat: 13.0827, lng: 80.2707 },
    { id: 'h6', name: 'Hyderabad', aqi: 150, pm25: 85, status: 'Moderate', lat: 17.3850, lng: 78.4867 },
];

export default function GlobalMap() {
    const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans overflow-hidden flex flex-col pt-16">

            <Navbar />

            <div className="flex-1 flex relative">

                {/* Sidebar Overlay */}
                <aside className="absolute left-4 top-4 bottom-4 w-80 bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-2xl z-[1000] flex flex-col shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                            <MapPin className="text-brand-primary" />
                            Live Hotspots
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Focus Region: India (Real-time Simulation)</p>
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
                        Showing simulated sensor data.
                    </div>
                </aside>

                {/* Map Area */}
                <main className="flex-1 relative bg-[#0B1121] flex items-center justify-center overflow-hidden z-0">
                    <LiveMap
                        hotspots={INDIAN_HOTSPOTS}
                        onSelect={setSelectedHotspot}
                        selectedId={selectedHotspot?.id}
                    />

                    {/* Selected Hotspot Detail Card (Floating) */}
                    {selectedHotspot && (
                        <div className="absolute top-4 right-4 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl z-[1000] animate-fade-in-up">
                            <button
                                onClick={() => setSelectedHotspot(null)}
                                className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-heading font-bold">{selectedHotspot.name}</h3>
                                <span className={clsx("text-xs px-2 py-1 rounded badge font-bold", {
                                    'bg-red-500/20 text-red-500': selectedHotspot.status === 'Critical',
                                    'bg-orange-500/20 text-orange-500': selectedHotspot.status === 'Poor',
                                    'bg-yellow-500/20 text-yellow-500': selectedHotspot.status === 'Moderate',
                                    'bg-emerald-500/20 text-emerald-500': selectedHotspot.status === 'Good',
                                })}>{selectedHotspot.status}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <span className="text-xs text-gray-400 block mb-1">AQI Index</span>
                                        <span className="text-2xl font-bold flex items-center gap-2">
                                            <Wind className="w-5 h-5 text-gray-400" />
                                            {selectedHotspot.aqi}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <span className="text-xs text-gray-400 block mb-1">PM 2.5</span>
                                        <span className="text-2xl font-bold">{selectedHotspot.pm25}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                    <Layers className="w-3 h-3" /> Agent Analysis
                                </h4>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    Sensor Fusion Agent detects elevated particle levels consistent with {selectedHotspot.status === 'Critical' ? 'heavy industrial activity and crop burning nearby' : 'local vehicular traffic congestion'}.
                                    <br />
                                    <span className="text-brand-primary block mt-2 text-xs">Lat: {selectedHotspot.lat}, Lng: {selectedHotspot.lng}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}

