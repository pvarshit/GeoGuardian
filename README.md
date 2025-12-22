# GeoGuardian

GeoGuardian is a comprehensive system integrating satellite vision and sensor fusion for environmental monitoring.

## System Components

1.  **Backend**: Sensor Fusion Agent (Python/FastAPI) & Satellite Vision Agent.
2.  **Frontend**: React/Vite application.

## Prerequisites

-   Node.js & npm
-   Python 3.8+ (with dependencies installed)

## Deployment / Production Start

To run the entire application (Frontend + Backend) using a single command:

1.  **Build the Frontend** (First time or after changes):
    ```bash
    npm run build
    ```

2.  **Start the Server**:
    ```bash
    npm start
    ```

    This will:
    -   Launch the Express server on port **3000** (giving you the Frontend).
    -   Automatically spawn the **Sensor Fusion Agent** (Port 8100).
    -   Automatically spawn the **Satellite Vision Agent** (Port 8200).

    Access the app at: **http://localhost:3000**

## Development

To run services individually for development:

### Backend
```bash
cd backend
uvicorn sensor_fusion_agent.main:app --host 0.0.0.0 --port 8100 --reload
```

### Vision Agent
```bash
python satellite_vision_agent/data_ingestion.py
```

### Frontend
```bash
npm run dev
```
