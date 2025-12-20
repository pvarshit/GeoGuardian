export interface Insight {
    id: string;
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
    timestamp: string;
    sourceAgent: string; // e.g., "Causal Reasoning Agent"
}

export const MOCK_INSIGHTS: Insight[] = [
    {
        id: "I-1",
        title: "High PM2.5 detected in Industrial Zone",
        description: "Correlation found between factory exhaust schedule and PM2.5 spike.",
        severity: "High",
        timestamp: "10 mins ago",
        sourceAgent: "Causal Reasoning Agent"
    },
    {
        id: "I-2",
        title: "Water Clarity Decreasing",
        description: "Turbidity levels in North River exceed seasonal average by 15%.",
        severity: "Medium",
        timestamp: "1 hour ago",
        sourceAgent: "Sensor Fusion Agent"
    },
    {
        id: "I-3",
        title: "New Citizen Report Cluster",
        description: "3 reports of 'Strange Smell' verified near Downtown.",
        severity: "Medium",
        timestamp: "2 hours ago",
        sourceAgent: "Document Intelligence Agent" // Assuming verifies text reports
    }
];
