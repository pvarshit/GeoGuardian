import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { MapPin, Info, X, Layers, Wind, Search, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import LiveMap, { type Hotspot } from '../components/LiveMap';
import { fetchSensorFusion, searchAgent, fetchLiveHotspots, triggerSatelliteScan, type SatelliteScanResponse } from '../services/agentApi';
import { AiChat } from '../components/AiChat';
import { NewsWidget } from '../components/NewsWidget';
import { Scan, Loader2 } from 'lucide-react';

const INITIAL_HOTSPOTS: Hotspot[] = [
    {
        id: '1',
        name: 'New Delhi',
        aqi: 401,
        pm25: 250,
        pm10: 300,
        temperature: 15,
        description: 'Severe pollution',
        status: 'Severe',
        lat: 28.6139,
        lng: 77.2090,
        forecast: []
    },
    {
        id: '2',
        name: 'Hyderabad',
        aqi: 186,
        pm25: 86,
        pm10: 100,
        temperature: 17,
        description: 'Moderate air quality',
        status: 'Moderate',
        lat: 17.3850,
        lng: 78.4867,
        forecast: []
    },
];

export default function GlobalMap() {
    const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
    const [agentData, setAgentData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<Hotspot | null>(null);
    const [hotspots, setHotspots] = useState<Hotspot[]>(INITIAL_HOTSPOTS);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<SatelliteScanResponse | null>(null);

    // Fetch live hotspots on mount
    useEffect(() => {
        const loadHotspots = async () => {
            const liveData = await fetchLiveHotspots();
            if (liveData && liveData.length > 0) {
                const mappedHotspots: Hotspot[] = liveData.map((d: any) => ({
                    id: `live-${d.lat}-${d.lon}`,
                    name: d.agent_insight.split(':')[0] || 'Unknown',
                    aqi: d.air_quality.aqi_index,
                    pm25: d.air_quality.components.pm2_5,
                    pm10: d.air_quality.components.pm10 || 0,
                    temperature: d.weather.temperature_c,
                    description: d.agent_insight,
                    status: d.health_risk_level,
                    lat: d.lat,
                    lng: d.lon,
                    forecast: []
                }));
                setHotspots(mappedHotspots);
            }
        };
        loadHotspots();
    }, []);

    // Fetch live data from Sensor Fusion Agent when a hotspot is selected
    useEffect(() => {
        if (selectedHotspot && !selectedHotspot.id.startsWith('search-')) {
            setAgentData(null); // Reset previous data
            fetchSensorFusion(selectedHotspot.lat, selectedHotspot.lng)
                .then(data => {
                    if (data) {
                        setAgentData(data);
                    }
                });
        }
    }, [selectedHotspot]);



    const [viewCenter, setViewCenter] = useState<[number, number] | undefined>(undefined);

    // Draggable Hotspots State
    const [hotspotsPos, setHotspotsPos] = useState({ x: 20, y: 80 }); // Default top-left but below navbar
    const [isHotspotsMinimized, setIsHotspotsMinimized] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - hotspotsPos.x,
            y: e.clientY - hotspotsPos.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setHotspotsPos({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // ... useEffect ... (existing loadHotspots)

    // ... useEffect ... (existing fetchSensorFusion)

    const performSearch = async (query: string) => {
        // ... (existing logic)
        // Ensure reset of viewCenter so LiveMap can take over or stay focused on search
        setViewCenter(undefined);

        const data = await searchAgent(query);
        if (data) {
            setAgentData(data);
            const newHotspot: Hotspot = {
                id: `search-${data.lat}-${data.lon}`,
                name: query,
                aqi: data.air_quality.aqi_index,
                pm25: data.air_quality.components.pm2_5,
                pm10: data.air_quality.components.pm10 || 0, // Ensure PM10 is passed
                status: data.health_risk_level,
                lat: data.lat,
                lng: data.lon,
                forecast: (data as any).data?.forecast_3day || []
            } as Hotspot;
            setSearchResult(newHotspot);

            // Add to list if not exists, or update
            setHotspots(prev => {
                const existingIndex = prev.findIndex(h => h.id === newHotspot.id || h.name.toLowerCase() === newHotspot.name.toLowerCase());
                if (existingIndex >= 0) {
                    // Update existing
                    const updated = [...prev];
                    updated[existingIndex] = newHotspot;
                    return updated;
                }
                return [...prev, newHotspot];
            });

            setSelectedHotspot(newHotspot);
        }
        setIsSearching(false);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        await performSearch(searchQuery);
    };

    const handleAiNavigate = (_lat: number, _lon: number, name: string) => {
        setSearchQuery(name);
        performSearch(name);
    };

    const resetView = () => {
        // Clear search data
        setSearchResult(null);
        setSelectedHotspot(null);
        setAgentData(null);
        setSearchQuery('');

        // Force view reset to India
        setViewCenter([22.5937, 78.9629]);
    };

    const handleSatelliteScan = async () => {
        if (!selectedHotspot) return;
        setIsScanning(true);
        setScanResult(null);
        try {
            const result = await triggerSatelliteScan(selectedHotspot.lat, selectedHotspot.lng, selectedHotspot.name);
            if (result) {
                setScanResult(result);
            }
        } catch (error) {
            console.error("Scan failed", error);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-brand-dark text-white font-sans overflow-hidden flex flex-col pt-16"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >

            <Navbar />

            <div className="flex-1 flex relative">

                {/* Draggable & Minimizable Sidebar Overlay */}
                <aside
                    style={{ left: hotspotsPos.x, top: hotspotsPos.y }}
                    className={`absolute w-80 bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-2xl z-[1000] flex flex-col shadow-2xl transition-opacity duration-300 ${isHotspotsMinimized ? 'h-auto' : 'max-h-[80vh]'} ${searchResult ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    {/* Header - Draggable Handle */}
                    <div
                        className="p-4 border-b border-white/10 bg-white/5 cursor-move flex items-center justify-between select-none"
                        onMouseDown={handleMouseDown}
                    >
                        <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                            <MapPin className="text-brand-primary" />
                            Live Hotspots
                        </h2>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsHotspotsMinimized(!isHotspotsMinimized); }}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                            {isHotspotsMinimized ? <Layers className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                    </div>

                    {!isHotspotsMinimized && (
                        <>
                            <div className="p-2 border-b border-white/5 text-xs text-gray-400 bg-black/20">
                                Focus Region: India (Real-time Simulation)
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {hotspots.map((hotspot) => (
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
                                                'bg-red-500/20 text-red-500': hotspot.status === 'Very Poor' || hotspot.status === 'Critical' || hotspot.status === 'Severe',
                                                'bg-orange-500/20 text-orange-500': hotspot.status === 'Poor',
                                                'bg-yellow-500/20 text-yellow-500': hotspot.status === 'Moderate',
                                                'bg-emerald-500/20 text-emerald-500': hotspot.status === 'Good' || hotspot.status === 'Fair',
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

                            <div className="p-3 bg-brand-primary/10 border-t border-brand-primary/20 text-xs text-brand-primary flex items-center gap-2 rounded-b-2xl">
                                <Info className="w-4 h-4 shrink-0" />
                                Showing simulated sensor data.
                            </div>
                        </>
                    )}
                </aside>

                {/* Map Area */}
                <main className="flex-1 relative bg-[#0B1121] flex items-center justify-center overflow-hidden z-0">
                    <LiveMap
                        hotspots={hotspots}
                        onSelect={setSelectedHotspot}
                        selectedId={selectedHotspot?.id}
                        center={selectedHotspot ? [selectedHotspot.lat, selectedHotspot.lng] : (viewCenter || [22.5937, 78.9629])}
                        zoom={selectedHotspot ? 10 : (viewCenter ? 5 : 5)}
                    />

                    {/* Quick City Selector (Top Right) */}
                    <div className="absolute top-20 right-8 z-[1000] flex gap-2">
                        <select
                            className="bg-gray-900/90 backdrop-blur-md border border-white/10 text-white text-sm rounded-lg px-4 py-2 shadow-xl focus:outline-none focus:border-brand-primary"
                            onChange={(e) => {
                                if (e.target.value) {
                                    handleAiNavigate(0, 0, e.target.value);
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Famous City...</option>
                            <option value="New Delhi">New Delhi</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Pune">Pune</option>
                            <option value="Ahmedabad">Ahmedabad</option>
                            <option value="Jaipur">Jaipur</option>
                            <option value="Lucknow">Lucknow</option>
                        </select>
                    </div>

                    {/* Integrated AI Chat - Positioned ABOVE Search Bar on Right */}
                    <AiChat
                        onNavigate={handleAiNavigate}
                        className="bottom-24 right-8 left-auto"
                    />

                    {/* Search Bar (Bottom Right) */}
                    <div className="absolute bottom-6 right-8 z-[1000] flex flex-col items-end gap-3 pointer-events-none">
                        <div className="pointer-events-auto flex flex-col items-end gap-3">
                            {searchResult && (
                                <button
                                    onClick={resetView}
                                    className="bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all animate-fade-in-up font-bold text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Return to India View
                                </button>
                            )}

                            <form onSubmit={handleSearch} className="bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-full p-1 pl-4 shadow-xl flex items-center w-80">
                                <input
                                    type="text"
                                    placeholder="Search location (e.g. Paris)..."
                                    className="bg-transparent border-none focus:ring-0 text-white text-sm w-full placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={isSearching}
                                />
                                <button
                                    type="submit"
                                    disabled={isSearching}
                                    className="p-2 bg-white/10 hover:bg-brand-primary rounded-full text-white transition-colors disabled:opacity-50"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </form>


                        </div>
                    </div>


                    {/* Selected Hotspot Detail Card (Floating) */}
                    {selectedHotspot && (
                        <div className="absolute top-32 right-8 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl z-[1000] animate-fade-in-up max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <button
                                onClick={() => setSelectedHotspot(null)}
                                className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-heading font-bold capitalize">{selectedHotspot.name}</h3>
                                <span className={clsx("text-xs px-2 py-1 rounded badge font-bold", {
                                    'bg-red-500/20 text-red-500': selectedHotspot.status === 'Critical' || selectedHotspot.status === 'Very Poor' || selectedHotspot.status === 'Severe',
                                    'bg-orange-500/20 text-orange-500': selectedHotspot.status === 'Poor',
                                    'bg-yellow-500/20 text-yellow-500': selectedHotspot.status === 'Moderate',
                                    'bg-emerald-500/20 text-emerald-500': selectedHotspot.status === 'Good' || selectedHotspot.status === 'Fair',
                                })}>
                                    {selectedHotspot.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <span className="text-xs text-gray-400 block mb-1">Temperature</span>
                                        <span className="text-2xl font-bold flex items-center gap-2">
                                            {agentData && agentData.weather ? (
                                                <>
                                                    {Math.round(agentData.weather.temperature_c)}°C
                                                    <span className="text-[10px] text-gray-500 font-normal">
                                                        {agentData.weather.description?.includes('RealFeel') ?
                                                            agentData.weather.description.match(/\(RealFeel.*?\)/)?.[0] :
                                                            ''}
                                                    </span>
                                                </>
                                            ) : (
                                                selectedHotspot.temperature ? `${selectedHotspot.temperature}°C` : '--'
                                            )}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <span className="text-xs text-gray-400 block mb-1">AQI Index</span>
                                        <span className="text-2xl font-bold flex items-center gap-2">
                                            <Wind className="w-5 h-5 text-gray-400" />
                                            {agentData ? agentData.air_quality.aqi_index : selectedHotspot.aqi}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg col-span-2">
                                        <span className="text-xs text-gray-400 block mb-1">Particulate Matter (PM 2.5)</span>
                                        <span className="text-2xl font-bold">
                                            {agentData ? agentData.air_quality.components.pm2_5 : selectedHotspot.pm25} µg/m³
                                        </span>
                                    </div>
                                </div>

                                {/* 3-Day Forecast Section */}
                                {(selectedHotspot.forecast && selectedHotspot.forecast.length > 0) && (
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">3-Day Forecast</h4>
                                        <div className="space-y-2">
                                            {selectedHotspot.forecast.map((f: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-400">{new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                    <span className="text-white font-medium flex items-center gap-1">
                                                        {f.min_temp && <span>{Math.round(f.min_temp)}°</span>}
                                                        {f.max_temp && <span className="text-gray-500"> / {Math.round(f.max_temp)}°</span>}
                                                    </span>
                                                    <span className="text-gray-300 w-16 text-right truncate" title={f.phrase || f.condition}>{f.phrase || f.condition}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                    <Layers className="w-3 h-3" /> Agent Insights (Live)
                                </h4>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {agentData ? (
                                        <span className="animate-pulse-once">
                                            {agentData.agent_insight}
                                            <br />
                                            <span className="text-brand-secondary text-xs mt-1 block">
                                                *Live Verification via Sensor Fusion Agent
                                            </span>
                                        </span>
                                    ) : (
                                        <>
                                            Sensor Fusion Agent detects elevated particle levels consistent with {selectedHotspot.status === 'Critical' ? 'heavy industrial activity and crop burning nearby' : 'local vehicular traffic congestion'}.
                                            <br />
                                            <span className="text-brand-primary block mt-2 text-xs">Lat: {selectedHotspot.lat}, Lng: {selectedHotspot.lng}</span>
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* News Widget Integration */}
                            <NewsWidget city={selectedHotspot.name} />

                            {/* Satellite Scan Integration */}
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <Scan className="w-3 h-3" /> Satellite Vision Agent
                                    </h4>
                                    {scanResult && <span className="text-[10px] text-green-400">Scan Complete</span>}
                                </div>

                                {!scanResult ? (
                                    <button
                                        onClick={handleSatelliteScan}
                                        disabled={isScanning}
                                        className="w-full py-2 bg-brand-primary/20 hover:bg-brand-primary/40 border border-brand-primary/50 rounded-lg text-brand-primary text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                                        {isScanning ? 'Analyzing Satellite Imagery...' : 'Run Area Scan'}
                                    </button>
                                ) : (
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/10 animate-fade-in-up">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs text-gray-400">Tiles Scanned: <b className="text-white">{scanResult.tiles_scanned}</b></span>
                                            <span className={clsx("text-xs font-bold px-1.5 py-0.5 rounded", scanResult.anomalies_found > 0 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400")}>
                                                {scanResult.anomalies_found} Anomalies
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed italic border-l-2 border-brand-secondary pl-2">
                                            "{scanResult.scan_insight}"
                                        </p>
                                        <button
                                            onClick={() => setScanResult(null)}
                                            className="mt-2 text-[10px] text-gray-500 hover:text-white underline w-full text-center"
                                        >
                                            Reset Scan
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}
