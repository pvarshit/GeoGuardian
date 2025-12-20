# GeoGuardian Technical Roadmap

**Project Goal**: Build an autonomous, agentic pollution detection system that correlates satellite imagery, sensor data, and document intelligence to provide actionable, causally-reasoned alerts to authorities.

---

## 1. System Architecture & Tech Stack

### High-Level Architecture
The system follows a **Modern Agentic Architecture**:
1.  **Data Sourcing Layer**: Ingests raw data (Satellite images, IoT streams, PDFs).
2.  **Intelligence Layer (Backend)**: hosted on **FastAPI**.
    *   **Orchestrator**: Manages agent execution flows.
    *   **Specialized Agents**: 
        *   *Vision Agent*: Vertex AI / Custom CV models for imagery.
        *   *Fusion Agent*: Statistical models for sensor spikes.
        *   *Doc Agent*: OCR + LLM (RAG) for regulations/reports.
        *   *Causal/Judge Agent*: Synthesizes outputs from above to find "Why".
3.  **Storage Layer**:
    *   **Structured**: Firestore (or MongoDB) for alerts, user profiles, metadata.
    *   **Unstructured**: Google Cloud Storage (GCS) for raw images and PDFs.
    *   **Vector DB**: (Optional) ChromaDB/Pinecone for RAG on regulations.
4.  **Presentation Layer**:
    *   **Frontend**: React (Vite) + Tailwind + Mapbox GL JS.
    *   **Desicion Support**: Dashboards, drill-down views.

### Technology Stack
*   **Frontend**: React, TypeScript, TailwindCSS, Mapbox/Leaflet, Recharts.
*   **Backend**: Python FastAPI (Async), Pydantic.
*   **AI/Agents**: LangChain, Google Vertex AI (Gemini Pro Vision, Gemini Pro).
*   **Database**: Firestore (NoSQL) or MongoDB Atlas.
*   **DevOps**: Docker, Google Cloud Run.

---

## 2. Implementation Roadmap

### Phase 1: Repository & Backend Core Setup
**Goal**: Establish the foundation for the API and database.
- [ ] **Restructure Project**: Create a `backend/` directory alongside the existing frontend.
- [ ] **FastAPI Setup**: Initialize a modular FastAPI app with `APIRouter`.
- [ ] **Database Connection**: Set up connection to Firestore/MongoDB.
- [ ] **Authentication System**: Implement JWT-based RBAC (Roles: Officer, Planner, Admin).
    - `POST /api/auth/login`
    - `GET /api/auth/verify`

### Phase 2: Data Ingestion Layers
**Goal**: Build pipelines to accept raw data.
- [ ] **Satellite Service**:
    - Integration with Sentinel-2 or mock satellite API.
    - `POST /api/satellite/fetch`: Trigger fetching of latest imagery for a ROI (Region of Interest).
- [ ] **Sensor Service**:
    - Ingestion endpoint for IoT payloads (AQI, pH, PM2.5).
    - `POST /api/sensors/ingest`: High-throughput endpoint.
- [ ] **Document Service**:
    - File upload handling with GCS/S3 storage.
    - `POST /api/documents/upload`: Handle PDF uploads and generate unique IDs.

### Phase 3: The Agentic Core (The "Brain")
**Goal**: Implement the specialized agents using LangChain/Vertex AI.
- [ ] **Agent: Satellite Vision**:
    - Function: Detect oil slicks, smoke plumes, or deforestation.
    - Output: JSON bounding boxes + confidence scores.
- [ ] **Agent: Sensor Fusion**:
    - Function: Time-series anomaly detection (e.g., "Sudden spike in PM2.5 at 3 AM").
- [ ] **Agent: Document Intelligence (RAG)**:
    - Function: Extract company names, chemical limits, and legal violations from text.
- [ ] **Agent: Causal Reasoning (The "Judge")**:
    - **CRITICAL**: This is the differentiator.
    - Logic: "If Satellite sees smoke at [Loc] AND Sensor sees high PM2.5 at [Loc] AND Document allows 0 emissions -> **High Confidence Violation**."
    - Output: Explained reasoning chain.

### Phase 4: Insights & Dashboard API
**Goal**: Serve processed data to the frontend.
- [ ] **Alerts & Incidents Endpoints**:
    - `GET /api/alerts/active`: Ranked list of current threats.
    - `GET /api/incidents/{id}`: Detailed view (Evidence packet).
- [ ] **Map Layers Endpoint**:
    - `GET /api/map/layers`: GeoJSON features for the dashboard map.
- [ ] **Dashboard Stats**:
    - `GET /api/overview/live-stats`: Real-time counters.

### Phase 5: Frontend Integration
**Goal**: Connect the React UI to the real backend.
- [ ] **API Client**: Create a typed Axios/Fetch wrapper in React.
- [ ] **Real Data Hookup**: Replace mock data in:
    - Dashboard Cards.
    - Map Layers (Live GeoJSON).
    - Incident Drill-down pages.
- [ ] **Agent Interaction UI**:
    - Build the "Reasoning Drawer" to show the LLM's explanation chain.

### Phase 6: System Control & Feedback
**Goal**: Admin features and model tuning.
- [ ] **Feedback Loop**:
    - `POST /api/feedback/submit`: User flags False Positives to retrain agents.
- [ ] **Agent Status Panel**:
    - Monitor agent health and token usage.

---

## 3. Immediate Next Steps (Execution Plan)
1.  **Initialize Backend**: Create the `backend/` folder and `requirements.txt`.
2.  **Define Models**: Create Pydantic models for `Alert`, `SensorReading`, and `Incident`.
3.  **Mock Agents**: Initially, create "dummy" agents that return structured data so we can build the UI flow immediately, then plug in real AI models.

## 4. API Specification Summary (Swagger/OpenAPI)
*   **Auth**: `POST /login`, `POST /refresh`
*   **Satellite**: `POST /satellite/analyze`
*   **Sensors**: `POST /sensors/stream`
*   **Agents**: `POST /agents/trigger/{agent_type}`
*   **Query**: `GET /query/incidents`
