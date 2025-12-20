# GeoGuardian Backend Architecture Guide

This guide explains how the GeoGuardian backend is built, step-by-step. It is designed for someone starting from scratch who wants to understand "how it works" and "what to do".

## 1. The Goal (The "Why")
We need a central "Brain" that:
1.  **Listens** for requests from the Frontend (React website).
2.  **Fetches** data from the real world (OpenWeather, AccuWeather).
3.  **Thinks** using AI/ML (Generates Insights, Forecasts AQI).
4.  **Responds** with clean JSON data.

## 2. The Tools (The "Stack")
*   **Language:** Python (Easy to read, great for AI).
*   **Web Server:** FastAPI (Fast, modern way to build APIs).
*   **AI/ML:** Scikit-Learn / LightGBM (For predictions), Groq/Gemini (For text insights).
*   **Data Handling:** Pandas (For excel/table data).

## 3. Step-by-Step Implementation

### Step 1: The "Listener" (main.py)
The core of the backend is the `app`. It listens on a specific port (like `8100`).
*   **Code:** `app = FastAPI()`
*   **Component:** `main.py`
*   **What it does:** It defines "Endpoints" (URLs) like `/search` or `/analytics`. When you visit these URLs, the function runs.

### Step 2: The "Eyes" (External APIs)
We can't measure air quality ourselves, so we ask services that can.
*   **Components:** `fetch_air_quality`, `fetch_weather`, `accuweather_client.py`
*   **What they do:**
    *   Take a `city` name.
    *   Turn it into `latitude` & `longitude`.
    *   Request data from OpenWeatherMap/AccuWeather.
    *   Return a dictionary of numbers (PM2.5, Temp, etc.).

### Step 3: The "Brain" (Sensor Fusion & ML)
Raw numbers are boring. We want *intelligence*.
*   **Component:** `ml_engine.py` / `ml_engine_lgbm.py`
*   **What it does:**
    *   **Training (`/train`):** reads historical Excel files (`data/*.xlsx`), learns patterns (e.g., "Winter = High Pollution"), and saves a file (`.pkl`).
    *   **Prediction (`/analytics`):** Uses the saved "Brain" (`.pkl` file) to guess what AQI will be tomorrow based on today's value.

### Step 4: The "Voice" (LLM/AI Agent)
We want the app to talk like a human.
*   **Component:** `/ask` endpoint (using Groq/Gemini).
*   **What it does:**
    *   Takes user text ("Is it safe to run?").
    *   Looks at the *current* pollution numbers.
    *   Sends both to an LLM (Large Language Model).
    *   Returns a helpful sentence ("No, PM2.5 is too high today.").

### Step 5: Caching (The Memory)
To be fast and save money, we don't ask mostly the same questions twice.
*   **Component:** `search_cache.json` logic in `main.py`.
*   **What it does:** Before asking an API, check if we asked for "Hyderabad" 5 minutes ago. If yes, return the saved answer.

## 4. How to Run It
1.  **Install Tools:** `pip install -r requirements.txt` (Installs Python libraries).
2.  **Setup Keys:** Create a `.env` file with API keys (Groq, OpenWeather).
3.  **Start Server:** `uvicorn main:app --reload`.
4.  **Frontend:** Connects to `http://localhost:8100`.

## 5. Summary Diagram
`Frontend` -> `FastAPI (main.py)` -> `External APIs` & `ML Engine` -> `Frontend`
