import google.generativeai as genai
import os

key = "AIzaSyAlCy4tMTstMl1m_PxaShMWpH8MyAKglSo"
genai.configure(api_key=key)

print("Checking models...")
try:
    with open("models_log.txt", "w") as f:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"Available: {m.name}")
                f.write(f"{m.name}\n")
except Exception as e:
    print(f"Error listing models: {e}")
