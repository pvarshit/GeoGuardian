import asyncio
import httpx
import json
import os

# usage: python generate_rag_data.py

CITIES = [
    "New Delhi",
    "Hyderabad",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow"
]

OUTPUT_FILE = "rag_knowledge_base.json"
BASE_URL = "http://localhost:8100"

async def fetch_city_data(client, city):
    print(f"Fetching data for {city}...")
    try:
        # We use the /search endpoint because it does the full fusion (Weather + AQI + ML Insight)
        response = await client.get(f"{BASE_URL}/search", params={"q": city}, timeout=30.0)
        if response.status_code == 200:
            data = response.json()
            # Add metadata for RAG context
            data["rag_context"] = f"Real-time sensor data for {city}."
            data["source_agent"] = "SensorFusionAgent"
            return data
        else:
            print(f"Failed to fetch {city}: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching {city}: {e}")
        return None

async def main():
    print("Starting RAG Data Generation Pipeline...")
    results = []
    
    async with httpx.AsyncClient() as client:
        tasks = [fetch_city_data(client, city) for city in CITIES]
        responses = await asyncio.gather(*tasks)
        
        for res in responses:
            if res:
                results.append(res)
    
    # Save to JSON
    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=2)
        
    print(f"\nSUCCESS! Generated {len(results)} records.")
    print(f"Saved to: {os.path.abspath(OUTPUT_FILE)}")
    print("Give this file to your friend for the RAG pipeline.")

if __name__ == "__main__":
    asyncio.run(main())
