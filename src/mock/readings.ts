export interface Reading {
    id: string;
    sensorId: string;
    metric: string;
    value: number;
    unit: string;
    timestamp: string;
}

export const MOCK_READINGS: Reading[] = [
    { id: "R-1", sensorId: "S-101", metric: "PM2.5", value: 45, unit: "µg/m³", timestamp: "2024-05-10 08:00" },
    { id: "R-2", sensorId: "S-101", metric: "PM2.5", value: 48, unit: "µg/m³", timestamp: "2024-05-10 09:00" },
    { id: "R-3", sensorId: "S-101", metric: "PM2.5", value: 52, unit: "µg/m³", timestamp: "2024-05-10 10:00" },
    { id: "R-4", sensorId: "S-102", metric: "NO2", value: 120, unit: "ppb", timestamp: "2024-05-10 08:30" },
    { id: "R-5", sensorId: "S-102", metric: "AQI", value: 155, unit: "Index", timestamp: "2024-05-10 09:15" },
    { id: "R-6", sensorId: "S-103", metric: "pH", value: 6.8, unit: "pH", timestamp: "2024-05-10 08:15" },
];
