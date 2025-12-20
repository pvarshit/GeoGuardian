import httpx
import os
from datetime import datetime

ACCUWEATHER_API_KEY = os.getenv("ACCUWEATHER_API_KEY")
BASE_URL = "http://dataservice.accuweather.com"

async def get_location_key(client: httpx.AsyncClient, city_name: str):
    """
    Search for a city to get its Location Key.
    """
    if not ACCUWEATHER_API_KEY:
        print("AccuWeather API Key missing.")
        return None

    url = f"{BASE_URL}/locations/v1/cities/search"
    params = {
        "apikey": ACCUWEATHER_API_KEY,
        "q": city_name,
        "language": "en-us"
    }
    
    try:
        r = await client.get(url, params=params, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data:
                return data[0]["Key"] # Return first match
    except Exception as e:
        print(f"Error fetching location key: {e}")
    return None

async def get_current_conditions(client: httpx.AsyncClient, location_key: str):
    """
    Get current weather conditions for a Location Key.
    """
    if not ACCUWEATHER_API_KEY:
        return None
        
    url = f"{BASE_URL}/currentconditions/v1/{location_key}"
    params = {
        "apikey": ACCUWEATHER_API_KEY,
        "language": "en-us",
        "details": "true" 
    }
    
    try:
        r = await client.get(url, params=params, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data:
                # Extract RealFeel if available
                condition = data[0]
                if "RealFeelTemperature" in condition:
                    condition["RealFeelTemperature"] = condition["RealFeelTemperature"]
                return condition
    except Exception as e:
        print(f"Error fetching conditions: {e}")
    return None

async def get_5day_forecast(client: httpx.AsyncClient, location_key: str):
    """
    Get 5-day weather forecast for a Location Key.
    """
    if not ACCUWEATHER_API_KEY:
        return None
        
    url = f"{BASE_URL}/forecasts/v1/daily/5day/{location_key}"
    params = {
        "apikey": ACCUWEATHER_API_KEY,
        "language": "en-us",
        "metric": "true"
    }
    
    try:
        r = await client.get(url, params=params, timeout=10)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"Error fetching forecast: {e}")
    return None

async def fetch_accuweather_data(client: httpx.AsyncClient, city_name: str):
    """
    Orchestrator to get weather data for a city.
    """
    key = await get_location_key(client, city_name)
    if not key:
        return None
        
    current = await get_current_conditions(client, key)
    forecast = await get_5day_forecast(client, key)
    
    return {
        "current": current,
        "forecast": forecast
    }
