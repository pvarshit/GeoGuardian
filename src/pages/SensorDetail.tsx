import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChartPlaceholder from '../components/ChartPlaceholder';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';
import { MOCK_SENSORS } from '../mock/sensors';

export default function SensorDetail() {
    const { id } = useParams();
    const sensor = MOCK_SENSORS.find(s => s.id === id) || MOCK_SENSORS[0];

    return (
        <div className="min-h-screen bg-brand-dark text-white pt-16 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
                    <span>/</span>
                    <span className="text-white">{sensor.name}</span>
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
                            {sensor.name}
                            <span className={`text-xs px-2 py-1 rounded-full border ${sensor.status === 'Online' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                {sensor.status}
                            </span>
                        </h1>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {sensor.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Last ping: {sensor.lastPing}</span>
                        </div>
                    </div>

                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors">
                        Export Data
                    </button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Chart Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                            <ChartPlaceholder title="Real-time Readings (PM2.5)" />
                        </div>

                        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 min-h-[200px] flex flex-col justify-center items-center text-center">
                            <h3 className="text-lg font-bold text-white mb-2">Root Cause Analysis</h3>
                            <p className="text-gray-500 text-sm max-w-md">
                                Our Causal Reasoning Agent is currently analyzing local wind patterns and industrial schedules to verify recent spikes.
                            </p>
                            <button className="mt-4 text-xs text-brand-primary font-bold uppercase tracking-wide hover:underline">
                                View Agent Logs
                            </button>
                        </div>
                    </div>

                    {/* Metadata Side Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Metadata</h3>
                            <div className="space-y-4">
                                <MetaRow label="Sensor Type" value={sensor.type} />
                                <MetaRow label="Sensor ID" value={sensor.id} />
                                <MetaRow label="Coordinates" value={`${sensor.coordinates.lat}, ${sensor.coordinates.lng}`} />
                                <MetaRow label="Install Date" value={sensor.installDate} />
                                <MetaRow label="Data Reliability" value={sensor.reliability} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border border-brand-primary/20 rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-brand-primary shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-1">Anomaly Predicted</h4>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        Based on historical patterns, PM2.5 levels are expected to rise by 25% in the next 3 hours due to rush hour traffic.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

function MetaRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-200 font-medium">{value}</span>
        </div>
    );
}
