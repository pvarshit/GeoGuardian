import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

function startService(command, args, name) {
    const service = spawn(command, args, { stdio: 'inherit', shell: true });

    service.on('close', (code) => {
        console.log(`${name} process exited with code ${code}`);
    });

    return service;
}

console.log('Starting GeoGuardian Services...');

// 1. Start Backend Services
// Sensor Fusion Agent (Port 8100)
// Sensor Fusion Agent (Port 8100)
const sensorFusion = spawn('python', ['-m', 'uvicorn', 'sensor_fusion_agent.main:app', '--host', '0.0.0.0', '--port', '8100'], { stdio: 'inherit', shell: true, cwd: join(__dirname, 'backend') });

// Satellite Vision Agent (Port 8200)
const satelliteVision = startService('python', ['satellite_vision_agent/data_ingestion.py'], 'Satellite Vision Agent');

// 2. Serve Frontend
app.use(express.static(join(__dirname, 'dist')));

// SPA Fallback (Catch-all)
app.use((req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// 3. Start Server
// 3. Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n> GeoGuardian is running at http://localhost:${PORT}`);
    console.log(`> Network Access: http://0.0.0.0:${PORT}`);
    console.log(`> Backend (Fusion) running at http://localhost:8100`);
});

const shutdown = () => {
    console.log('\nShutting down services...');
    sensorFusion.kill();
    satelliteVision.kill();
    server.close(() => {
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
