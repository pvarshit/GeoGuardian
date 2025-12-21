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
        let lat = 0, lon = 0;

        if (lowerQ.includes('london')) { lat = 51.5074; lon = -0.1278; }
        else if (lowerQ.includes('paris')) { lat = 48.8566; lon = 2.3522; }
        else if (lowerQ.includes('new york')) { lat = 40.7128; lon = -74.0060; }
        else if (lowerQ.includes('tokyo')) { lat = 35.6762; lon = 139.6503; }
        else {
            // Random location near India for unknown
            return null;
        }

        return {
            lat, lon,
            timestamp_utc: new Date().toISOString(),
            air_quality: {
                aqi_index: 2,
                aqi_category: "Fair",
                components: { co: 200, no: 0, no2: 10, o3: 60, so2: 5, pm2_5: 15, pm10: 25, nh3: 1 }
            },
            weather: {
                temperature_c: 15, humidity: 60, pressure: 1012, wind_speed: 12, wind_deg: 270, clouds: 40
            },
            dispersion_score: 8.5,
            health_risk_level: "Fair",
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
