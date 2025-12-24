import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { clsx } from 'clsx';
import { useState } from 'react';
import { Scan, AlertOctagon, Loader2 } from 'lucide-react';
import { triggerSatelliteScan, type SatelliteScanResponse } from '../services/agentApi';


// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface Hotspot {
    id: string;
    name: string;
    aqi: number;
    pm25: number;
    pm10: number; // Added PM10
    temperature: number;
    description: string;
    status: 'Critical' | 'Severe' | 'Very Poor' | 'Poor' | 'Moderate' | 'Fair' | 'Good';
    lat: number;
    lng: number;
    forecast?: {
        date: string;
        min_temp: number;
        max_temp: number;
        unit: string;
        phrase: string;
    }[];
}



interface LiveMapProps {
    hotspots: Hotspot[];
    selectedId?: string | null;
    onSelect: (hotspot: Hotspot) => void;
    center?: [number, number];
    zoom?: number;
    overlayImage?: {
        url: string;
        bounds: [[number, number], [number, number]];
    } | null;
}

// Helper to fly to location
function MapUpdater({ center }: { center: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 10, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

// Satellite Control Component
function SatelliteScanner({ onScanComplete }: { onScanComplete: (data: SatelliteScanResponse) => void }) {
    const map = useMap();
    const [scanning, setScanning] = useState(false);

    const handleScan = async () => {
        setScanning(true);
        const center = map.getCenter();
        try {
            const result = await triggerSatelliteScan(center.lat, center.lng, `LiveMap Scan ${center.lat.toFixed(2)},${center.lng.toFixed(2)}`);
            if (result) {
                onScanComplete(result);
            }
        } catch (e) {
            console.error("Scan failed", e);
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="leaflet-top leaflet-right !mt-20">
            {/* Moved slightly down to not conflict with other controls if any */}
            <div className="leaflet-control leaflet-bar border-0 shadow-xl">
                <button
                    onClick={handleScan}
                    disabled={scanning}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed group border border-white/10"
                    title="Run Satellite Vision Analysis"
                >
                    {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4 group-hover:rotate-90 transition-transform" />}
                    <span className="text-xs uppercase tracking-wider">{scanning ? 'Scanning Sector...' : 'Run Area Scan'}</span>
                </button>
            </div>
        </div>
    );
}

export default function LiveMap({ hotspots, selectedId, onSelect, center = [22.5937, 78.9629], zoom = 5, overlayImage }: LiveMapProps) {

    const createPulseIcon = (status: string) => {
        let colorClass = '';
        switch (status) {
            case 'Critical':
            case 'Severe':
            case 'Very Poor':
                colorClass = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'; break;
            case 'Poor': colorClass = 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]'; break;
            case 'Moderate':
            case 'Fair':
                colorClass = 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)]'; break;
            case 'Good': colorClass = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]'; break;
            default: colorClass = 'bg-gray-500'; // Fallback
        }

        return L.divIcon({
            className: 'custom-pulse-marker',
            html: `<div class="w-4 h-4 rounded-full ${colorClass} border-2 border-white relative">
                     <div class="absolute inset-0 rounded-full bg-current animate-ping opacity-75"></div>
                   </div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    };

    const selectedHotspot = hotspots.find(h => h.id === selectedId);
    const [scanData, setScanData] = useState<SatelliteScanResponse | null>(null);

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "100%", width: "100%" }}
            className="z-0 bg-gray-900"
        >
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />

            {overlayImage && (
                <ImageOverlay
                    url={`data:image/jpeg;base64,${overlayImage.url}`}
                    bounds={overlayImage.bounds}
                    opacity={0.8}
                    zIndex={10}
                />
            )}

            <MapUpdater center={selectedHotspot ? [selectedHotspot.lat, selectedHotspot.lng] : null} />

            {hotspots.map((hotspot) => (
                <Marker
                    key={hotspot.id}
                    position={[hotspot.lat, hotspot.lng]}
                    icon={createPulseIcon(hotspot.status)}
                    eventHandlers={{
                        click: () => onSelect(hotspot),
                    }}
                >
                    <Popup className="custom-popup">
                        <div className="p-1 min-w-[200px]">
                            <h3 className="font-bold text-gray-900">{hotspot.name}</h3>
                            <div className="flex items-center gap-2 mt-1 mb-2">
                                <span className={clsx("text-xs font-bold px-2 py-0.5 rounded text-white", {
                                    'bg-red-500': hotspot.status === 'Critical' || hotspot.status === 'Very Poor',
                                    'bg-orange-500': hotspot.status === 'Poor',
                                    'bg-yellow-500': hotspot.status === 'Moderate',
                                    'bg-emerald-500': hotspot.status === 'Good' || hotspot.status === 'Fair',
                                })}>
                                    {hotspot.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2 bg-gray-50/50 p-2 rounded">
                                <span>AQI: <b className="text-gray-900">{hotspot.aqi}</b></span>
                                <span>Temp: <b className="text-gray-900">{Math.round(hotspot.temperature)}°C</b></span>
                                <span>PM2.5: <b className="text-gray-900">{hotspot.pm25.toFixed(1)}</b></span>
                                <span>PM10: <b className="text-gray-900">{((hotspot as any).pm10 || 0).toFixed(1)}</b></span>
                            </div>

                            {/* 3-Day Forecast Section */}
                            {hotspot.forecast && (
                                <div className="mt-2 border-t border-gray-200 pt-2">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">3-Day Forecast</p>
                                    <div className="grid grid-cols-3 gap-1">
                                        {hotspot.forecast.map((day, i) => (
                                            <div key={i} className="bg-gray-50 rounded p-1 text-center">
                                                <div className="text-[9px] text-gray-400 font-bold mb-0.5">
                                                    {i === 0 ? 'Today' : i === 1 ? 'Tmrw' : 'Day 3'}
                                                </div>
                                                <div className="text-xs font-bold text-gray-800">
                                                    {Math.round(day.max_temp)}°
                                                </div>
                                                <div className="text-[8px] text-gray-500 truncate px-0.5" title={day.phrase}>
                                                    {day.phrase}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}

            <SatelliteScanner onScanComplete={setScanData} />

            {/* Satellite Live Feed Panel */}
            {scanData?.preview_images && scanData.preview_images.length > 0 && (
                <div className="leaflet-bottom leaflet-left !mb-8 !ml-4 pointer-events-auto z-[1000]">
                    <div className="bg-gray-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl max-w-sm">
                        <h4 className="text-xs font-bold text-brand-primary uppercase mb-3 flex items-center gap-2">
                            <Scan className="w-4 h-4" /> Live Satellite Feed
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                            {scanData.preview_images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="aspect-square rounded-lg overflow-hidden border border-white/30 hover:border-brand-primary transition-colors cursor-pointer">
                                        <img
                                            src={`data:image/jpeg;base64,${img}`}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            alt={`Zone ${idx + 1}`}
                                        />
                                    </div>
                                    <span className="absolute bottom-1 right-1 text-[8px] font-bold bg-black/60 text-white px-1 rounded">
                                        ZONE {idx + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 leading-tight">
                            Real-time optical capture from Sentinel-2 / WorldImagery. Scanning adjacent sectors.
                        </p>
                    </div>
                </div>
            )}

            {/* Satellite Scan Results */}
            {scanData?.events.map((evt, idx) => (
                <Marker
                    key={`scan-${idx}`}
                    position={[evt.location[0], evt.location[1]]}
                    icon={L.divIcon({
                        className: 'satellite-marker',
                        html: `<div class="w-6 h-6 rounded-none bg-purple-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                                 !
                               </div>`,
                        iconSize: [24, 24]
                    })}
                >
                    <Popup>
                        <div className="p-1">
                            <h4 className="font-bold text-purple-700 flex items-center gap-2">
                                <AlertOctagon className="w-4 h-4" /> Satellite Detection
                            </h4>
                            <p className="text-sm font-semibold mt-1">{evt.type}</p>
                            <p className="text-xs text-gray-600">Confidence: {(evt.confidence * 100).toFixed(1)}%</p>
                            <p className="text-[10px] text-gray-400 mt-1">Source: {evt.source_tile}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
