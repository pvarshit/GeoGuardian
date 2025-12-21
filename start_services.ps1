Write-Host "Starting GeoGuardian Services..." -ForegroundColor Green

# 1. Start Sensor Fusion Agent
Write-Host "Launching Sensor Fusion Agent (Port 8100)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; uvicorn sensor_fusion_agent.main:app --host 0.0.0.0 --port 8100 --reload"

# 2. Start Satellite Vision Agent
Write-Host "Launching Satellite Vision Agent (Port 8200)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python satellite_vision_agent/data_ingestion.py"

# 3. Start Frontend
Write-Host "Launching Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "All services launched! Please check the opened windows for logs." -ForegroundColor Green
