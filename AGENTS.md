# GeoGuardian Agent Architecture

This document explains the "Brain" of GeoGuardian. Unlike traditional dashboards that just show data, GeoGuardian uses a **Multi-Agent System** to reason about what is happening.

## 1. The Core Concept: "The Courtroom Model"
Think of the system like a courtroom. You have different "experts" (Agents) who look at evidence, and a "Judge" who makes the final decision.

## 2. The Specialized Agents

### 🕵️ Satellite Vision Agent (The Eye)
*   **Role**: Analyzes raw satellite imagery (Sentinel-2 / Landsat).
*   **Task**: "Look at this image coordinate. Do you see smoke, oil slicks, or deforestation?"
*   **Tech**: Custom Computer Vision models (YOLO/UNet) or Vertex AI Vision.
*   **Output**: `{"detected": "smoke_plume", "confidence": 0.92, "bbox": [...]}`

### 🔬 Sensor Fusion Agent (The Analyst)
*   **Role**: Monitors the 24/7 stream of IoT sensor data (AQI, PM2.5, NO2).
*   **Task**: Detect spikes and correlates them with external factors (News, Weather).
*   **Implemented Features**:
    *   **Smart News Scraper**: Fetches city-specific news from Google News RSS to explain pollution causes.
    *   **Historical Explorer**: Aggregates Excel data archives to visualize long-term trends (PM2.5 vs Temp).
    *   **Live Prediction**: Uses LightGBM/RF models to forecast future AQI.
*   **Output**: `{"anomaly": true, "news_context": [...], "forecast": [...]}`

### 📜 Document Intelligence Agent (The Lawyer)
*   **Role**: Reads environmental regulations and company compliance reports (PDFs).
*   **Task**: "Does this factory have a permit to emit smoke on weekends?"
*   **Tech**: RAG (Retrieval Augmented Generation) + OCR.
*   **Output**: `{"violation_risk": "high", "regulation_cited": "EPA-Act-Section-4"}`

## 3. The Orchestrator & The Judge

### ⚖️ Causal Reasoning Agent (The Judge)
*   **Role**: This is the most important agent. It combines the outputs of the other three.
*   **Logic**:
    > "The Vision Agent sees smoke at Location X."
    > "AND The Sensor Agent sees a PM2.5 spike at Location X."
    > "BUT The Document Agent says this factory is closed on Sundays."
    > **CONCLUSION**: "This is an unauthorized fire event. High Probability Violation."
*   **Output**: A human-readable text explanation for the officer.

## 4. How It Fits in the Backend
1.  **Ingestion**: Python agents run on a schedule (Cron) or Trigger.
2.  **Processing**: They process data in parallel using `LangChain` flows.
3.  **Synthesis**: The "Judge" Agent (Gemini Pro) runs last to synthesize the alert.
4.  **Delivery**: The final JSON is sent to the Frontend Dashboard.
