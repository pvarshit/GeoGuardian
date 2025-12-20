import { Map } from 'lucide-react';

export default function MapPlaceholder() {
    return (
        <div className="w-full h-full min-h-[500px] bg-gray-800/50 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            {/* Mock Map Elements */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-brand-primary rounded-full animate-ping" />
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-brand-secondary rounded-full animate-ping delay-300" />
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-brand-secondary rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]" />

            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping delay-700" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)]" />

            {/* Watermark */}
            <div className="z-10 text-center space-y-3 p-6 bg-brand-dark/80 backdrop-blur-md rounded-xl border border-white/5">
                <Map className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="text-xl font-heading font-bold text-gray-400">Interactive Map Coming Soon</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                    Mapbox integration will act as the GIS Output Dashboard layer for visualizing localized sensor data and agent traces.
                </p>
            </div>

            {/* Legend Mock */}
            <div className="absolute bottom-4 left-4 bg-brand-dark/90 backdrop-blur border border-white/10 p-3 rounded-lg z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-brand-primary"></span> Safe
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-brand-accent"></span> Moderate
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
                </div>
            </div>
        </div>
    );
}
