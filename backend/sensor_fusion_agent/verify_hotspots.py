import requests
import json

try:
    response = requests.get('http://localhost:8100/hotspots')
    data = response.json()
    with open('hotspots_verified_log.json', 'w') as f:
        json.dump(data, f, indent=2)
    print("Verification data saved.")
except Exception as e:
    print(f"Error: {e}")
