export interface Sensor {
    id: string;
    name: string;
    location: string;
    type: 'Air' | 'Water' | 'Industrial';
    status: 'Online' | 'Offline' | 'Degraded';
    lastPing: string;
    coordinates: { lat: number; lng: number };
    installDate: string;
    reliability: string;
}

export const MOCK_SENSORS: Sensor[] = [
    {
        id: "S-101",
        name: "Downtown Metro Station",
        location: "City Center",
        type: "Air",
        status: "Online",
        lastPing: "2 mins ago",
        coordinates: { lat: 34.0522, lng: -118.2437 },
        installDate: "2024-01-15",
        reliability: "High (99.8%)"
    },
    {
        id: "S-102",
        name: "Industrial Zone A",
        location: "East District",
        type: "Industrial",
        status: "Degraded",
        lastPing: "15 mins ago",
        coordinates: { lat: 34.0450, lng: -118.2300 },
        installDate: "2023-11-20",
        reliability: "Medium (85.2%)"
    },
    {
        id: "S-103",
        name: "River Bank North",
        location: "North River",
        type: "Water",
        status: "Online",
        lastPing: "5 mins ago",
        coordinates: { lat: 34.0600, lng: -118.2500 },
        installDate: "2024-02-10",
        reliability: "High (98.5%)"
    },
    {
        id: "S-104",
        name: "Suburb Park Monitor",
        location: "West Hills",
        type: "Air",
        status: "Offline",
        lastPing: "2 days ago",
        coordinates: { lat: 34.0700, lng: -118.2600 },
        installDate: "2023-05-12",
        reliability: "Low (Needs Maintenance)"
    }
];
