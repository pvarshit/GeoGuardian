from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="GeoGuardian API",
    description="Backend for GeoGuardian: Agentic AI Pollution Detection System",
    version="0.1.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite Frontend
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "system": "GeoGuardian",
        "status": "operational",
        "agents": {
            "vision": "standby",
            "sensor": "standby",
            "document": "standby",
            "causal": "active"
        }
    }

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
