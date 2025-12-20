import { useState } from 'react';
import Navbar from '../components/Navbar';
import SidebarFilterCard from '../components/SidebarFilterCard';
import LiveMap, { type Hotspot } from '../components/LiveMap';
import MetricCard from '../components/MetricCard';
import InsightCard from '../components/InsightCard';
import { MOCK_INSIGHTS } from '../mock/insights';
import { Wind, Activity, FileText, Layers, Info } from 'lucide-react';

const DASHBOARD_HOTSPOTS: Hotspot[] = [
    { id: 'h1', name: 'New Delhi', aqi: 450, pm25: 350, status: 'Critical', lat: 28.6139, lng: 77.2090 },
    { id: 'h6', name: 'Hyderabad', aqi: 150, pm25: 85, status: 'Moderate', lat: 17.3850, lng: 78.4867 },
    { id: 'h2', name: 'Mumbai', aqi: 180, pm25: 120, status: 'Moderate', lat: 19.0760, lng: 72.8777 },
];

export default function Dashboard() {
    const [dateRange, setDateRange] = useState({ from: '2024-05-10', to: '2024-05-17' });
    const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

    const handleHotspotSelect = (hotspot: Hotspot) => {
        setSelectedHotspotId(hotspot.id);
    };

    return (
        <div className="min-h-screen bg-brand-dark overflow-hidden flex flex-col">
            <Navbar />

            <div className="flex-1 pt-16 h-[calc(100vh-64px)] overflow-hidden">
                <div className="h-full flex flex-col lg:flex-row">

                    {/* Left Sidebar */}
                    <aside className="w-full lg:w-80 bg-gray-900/50 border-r border-white/5 p-4 overflow-y-auto space-y-6 z-10">
                        <div>
                            <h2 className="text-lg font-heading font-semibold text-white mb-4">Filters</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">From</label>
                                        <input
                                            type="date"
                                            value={dateRange.from}
                                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                            className="w-full bg-gray-800 border-none rounded text-xs text-gray-300 focus:ring-1 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">To</label>
                                        <input
                                            type="date"
                                            value={dateRange.to}
                                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                            className="w-full bg-gray-800 border-none rounded text-xs text-gray-300 focus:ring-1 focus:ring-brand-primary"
                                        />
                                    </div>
                                </div>

                                <SidebarFilterCard />
                            </div>
                        </div>
                    </aside>

                    {/* Center Main Area */}
                    <main className="flex-1 relative flex flex-col min-h-[400px]">
                        <div className="absolute inset-0 z-0">
                            <LiveMap
                                hotspots={DASHBOARD_HOTSPOTS}
                                selectedId={selectedHotspotId}
                                onSelect={handleHotspotSelect}
                            />
                        </div>

                        {/* Top Overlay Chips */}
                        <div className="absolute top-4 left-4 z-10 flex space-x-2 pointer-events-none">
                            <div className="bg-gray-900/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 pointer-events-auto">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                System Operational
                            </div>
                            <div className="bg-gray-900/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 pointer-events-auto">
                                <Layers className="w-3 h-3 text-brand-primary" />
                                Multi-Agent Fusion Active
                            </div>
                        </div>

                        {/* Floating Agent Analysis Panel (Visible when hotspot selected) */}
                        {selectedHotspotId && (
                            <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-96 bg-gray-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-20 animate-fade-in-up">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                                        <Info className="w-5 h-5 text-brand-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Causal Reasoning Agent</h4>
                                        <p className="text-sm text-gray-200 leading-snug">
                                            Correlation Found: High PM2.5 levels in this sector align with
                                            <span className="text-brand-primary"> satellite-detected smoke plumes </span>
                                            and
                                            <span className="text-brand-primary"> 3 recent crop burning reports</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Right Panel */}
                    <aside className="w-full lg:w-96 bg-gray-900/50 border-l border-white/5 p-4 overflow-y-auto z-10">
                        <h2 className="text-xl font-heading font-bold text-white mb-6">City Overview</h2>

                        {/* Metric Grid */}
                        <div className="grid grid-cols-1 gap-4 mb-8">
                            <MetricCard
                                title="Avg PM2.5 (24h)"
                                value="45.2"
                                unit="µg/m³"
                                trend={{ value: 12, direction: 'up' }}
                                icon={<Wind className="w-5 h-5" />}
                            />
                            <MetricCard
                                title="Active Sensors"
                                value="124"
                                unit="/ 130"
                                trend={{ value: 2, direction: 'down' }}
                                icon={<Activity className="w-5 h-5" />}
                            />
                            <MetricCard
                                title="Reports Today"
                                value="8"
                                trend={{ value: 0, direction: 'neutral' }}
                                icon={<FileText className="w-5 h-5" />}
                            />
                        </div>

                        {/* Insights Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-heading font-semibold text-white">AI Insights</h3>
                                <span className="text-xs text-brand-primary font-medium cursor-pointer hover:underline">View All</span>
                            </div>

                            <div className="space-y-3">
                                {MOCK_INSIGHTS.map((insight) => (
                                    <InsightCard key={insight.id} insight={insight} />
                                ))}
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
