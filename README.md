# GeoGuardian – AI-Ready Pollution Monitoring Dashboard

GeoGuardian is a frontend prototype for an AI-powered environmental monitoring platform. It visualizes data from satellites, IoT sensors, and citizen reports to detect and track pollution.

> **Note**: This is the frontend layer only (React + Vite + TypeScript). The backend agents and data ingestion layers shown in architectural diagrams are to be integrated in future phases.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or pnpm

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/pvarshit/GeoGuardian.git
    cd GeoGuardian
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```

## 🎨 Configuration

### Hero Background Image
The landing page hero image is a full-bleed background configurable via code.
To change it, edit:
`src/config/branding.ts`

```typescript
export const BRANDING = {
  // ...
  heroImage: "YOUR_IMAGE_URL_HERE",
  // ...
};
```

### Colors & Fonts
Tailwind configuration is located in `tailwind.config.js`.
Global styles and CSS variables are in `src/index.css`.

## 📂 Project Structure

- `src/components`: Reusable UI components (Navbar, Cards, FeatureGrid).
- `src/pages`: Page components (Landing, Dashboard, Explorer, etc.).
- `src/mock`: **Mock Data**. This folder simulates the API responses from the future backend.
- `src/config`: Global configuration constants.

## 🔗 Backend Integration Guide

Currently, the app uses static mock data to simulate the ecosystem.
When the backend (Agents + API Gateway) is ready, replace the mock imports with API calls.

1.  **Sensors**: `src/mock/sensors.ts` → `GET /api/v1/sensors`
2.  **Readings**: `src/mock/readings.ts` → `GET /api/v1/readings`
3.  **Insights**: `src/mock/insights.ts` → `GET /api/v1/insights` (Output from Alerts & Insights Agent)

The frontend components (`MetricCard`, `InsightCard`, `DataTable`) are designed to accept data props matching these interfaces, making the transition to real data seamless.

## 🤝 Contributing
1.  Checkout branch `Mayoor`.
2.  Make changes.
3.  Submit a Pull Request.
