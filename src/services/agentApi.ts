export interface AgentResponse {
    lat: number;
    lon: number;
    timestamp_utc: string;
    air_quality: {
        aqi_index: number;
        aqi_category: string;
        components: {
            co: number;
            no: number;
            no2: number;
            o3: number;
            so2: number;
            pm2_5: number;
            pm10: number;
            nh3: number;
        };
    };
    weather: {
        temperature_c: number;
        humidity: number;
        pressure: number;
        wind_speed: number;
        wind_deg: number;
        clouds: number;
        description?: string;
    };
    dispersion_score: number;
    health_risk_level: 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor';
    agent_insight: string;
}

const AGENT_API_URL = "http://localhost:8100";

export async function fetchSensorFusion(lat: number, lon: number): Promise<AgentResponse | null> {
    try {
        const response = await fetch(`${AGENT_API_URL}/fusion?lat=${lat}&lon=${lon}`);
        if (!response.ok) {
            console.warn("Sensor Fusion Agent unreachable or error:", response.statusText);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.warn("Failed to connect to Sensor Fusion Agent:", error);
        return null;
    }
}


export async function searchAgent(query: string): Promise<AgentResponse | null> {
    try {
        const response = await fetch(`${AGENT_API_URL}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn("Using Mock Search Fallback for:", query);

        // Mock Geocoding for Demo
        const lowerQ = query.toLowerCase();
        let lat = 20.5937; // Default India Center
        let lon = 78.9629;

        // Expanded City Map
        if (lowerQ.includes('london')) { lat = 51.5074; lon = -0.1278; }
        else if (lowerQ.includes('paris')) { lat = 48.8566; lon = 2.3522; }
        else if (lowerQ.includes('new york')) { lat = 40.7128; lon = -74.0060; }
        else if (lowerQ.includes('tokyo')) { lat = 35.6762; lon = 139.6503; }
        else if (lowerQ.includes('mumbai')) { lat = 19.0760; lon = 72.8777; }
        else if (lowerQ.includes('delhi')) { lat = 28.6139; lon = 77.2090; }
        else if (lowerQ.includes('hyderabad')) { lat = 17.3850; lon = 78.4867; }
        else if (lowerQ.includes('bangalore') || lowerQ.includes('bengaluru')) { lat = 12.9716; lon = 77.5946; }
        else if (lowerQ.includes('chennai')) { lat = 13.0827; lon = 80.2707; }
        else if (lowerQ.includes('kolkata')) { lat = 22.5726; lon = 88.3639; }
        else if (lowerQ.includes('pune')) { lat = 18.5204; lon = 73.8567; }
        else if (lowerQ.includes('ahmedabad')) { lat = 23.0225; lon = 72.5714; }
        else if (lowerQ.includes('jaipur')) { lat = 26.9124; lon = 75.7873; }
        else if (lowerQ.includes('lucknow')) { lat = 26.8467; lon = 80.9462; }
        else {
            // Generate a deterministic random-ish offset for unknown/generic queries so they don't all stack
            const hash = query.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            lat = 20 + (hash % 10);
            lon = 75 + (hash % 10);
        }

        return {
            lat, lon,
            timestamp_utc: new Date().toISOString(),
            air_quality: {
                aqi_index: 2,
                aqi_category: "Fair",
                components: { co: 200, no: 0, no2: 10, o3: 60, so2: 5, pm2_5: 35, pm10: 45, nh3: 1 }
            },
            weather: {
                temperature_c: 28, humidity: 60, pressure: 1012, wind_speed: 12, wind_deg: 270, clouds: 40, description: "Partly Cloudy"
            },
            dispersion_score: 8.5,
            health_risk_level: "Moderate",
            agent_insight: `Simulated result for ${query}: Moderate air quality expected based on historical trends.`
        };
    }
}

export interface AskResponse {
    answer: string;
    location?: {
        lat: number;
        lon: number;
        name: string;
    };
    data?: {
        location: string;
        current: any;
        forecast_3day?: {
            date: string;
            min_temp: number;
            max_temp: number;
            unit: string;
            phrase: string;
        }[];
    };
}

export async function askAgent(query: string): Promise<AskResponse | null> {
    try {
        const response = await fetch(`${AGENT_API_URL}/ask?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            console.warn("Sensor Fusion Agent ask failed:", response.statusText);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.warn("Failed to connect to Sensor Fusion Agent for ask:", error);
        return null;
    }
}

export async function fetchLiveHotspots(): Promise<any[]> {
    try {
        const response = await fetch(`${AGENT_API_URL}/hotspots`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        return [];
    }
}

const SATELLITE_API_URL = "http://localhost:8200";

export interface SatelliteScanResponse {
    status: string;
    region: string;
    tiles_scanned: number;
    anomalies_found: number;
    events: {
        location: number[];
        type: string;
        confidence: number;
        source_tile: string;
    }[];
    scan_insight: string;
}

export async function triggerSatelliteScan(lat: number, lon: number, name: string): Promise<SatelliteScanResponse | null> {
    try {
        const response = await fetch(`${SATELLITE_API_URL}/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, lat, lon, zoom: 16, grid_width: 15 }),
        });
        if (!response.ok) throw new Error('Scan failed');
        return await response.json();
    } catch (error) {
        console.error("Satellite Scan Error:", error);
        return null;
    }
}
