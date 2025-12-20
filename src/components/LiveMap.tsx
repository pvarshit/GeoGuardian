import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { clsx } from 'clsx';
import { Layers, Wind, Info } from 'lucide-react';

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
    status: 'Critical' | 'Poor' | 'Moderate' | 'Good';
    lat: number;
    lng: number;
}

interface LiveMapProps {
    hotspots: Hotspot[];
    selectedId?: string | null;
    onSelect: (hotspot: Hotspot) => void;
    center?: [number, number];
    zoom?: number;
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

export default function LiveMap({ hotspots, selectedId, onSelect, center = [22.5937, 78.9629], zoom = 5 }: LiveMapProps) {

    const createPulseIcon = (status: string) => {
        let colorClass = '';
        switch (status) {
            case 'Critical': colorClass = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'; break;
            case 'Poor': colorClass = 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]'; break;
            case 'Moderate': colorClass = 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)]'; break;
            case 'Good': colorClass = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]'; break;
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

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "100%", width: "100%" }}
            className="z-0 bg-gray-900"
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

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
                        <div className="p-1">
                            <h3 className="font-bold text-gray-900">{hotspot.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={clsx("text-xs font-bold px-2 py-0.5 rounded text-white", {
                                    'bg-red-500': hotspot.status === 'Critical',
                                    'bg-orange-500': hotspot.status === 'Poor',
                                    'bg-yellow-500': hotspot.status === 'Moderate',
                                    'bg-emerald-500': hotspot.status === 'Good',
                                })}>{hotspot.status}</span>
                                <span className="text-xs text-gray-600 font-medium">AQI: {hotspot.aqi}</span>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
