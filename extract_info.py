import os
import json
import time
import google.generativeai as genai

# --------------------
# CONFIG
# --------------------
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

MODEL_NAME = "gemini-1.5-flash"
TEXT_DIR = "data/processed_text"
OUTPUT_FILE = "data/extracted_insights.json"

MAX_CHARS = 1500
RETRIES = 3

model = genai.GenerativeModel(MODEL_NAME)

# --------------------
# JSON-SAFE EXTRACTION
# --------------------

def extract_info(text):
    prompt = f"""
You are an information extraction system.

Extract the following fields from the text:
- entity
- violation_type
- location
- date

IMPORTANT RULES:
1. Return ONLY valid JSON
2. Do NOT include explanations
3. Do NOT include markdown
4. Use empty string "" if not found

JSON FORMAT (EXACT):
{{
  "entity": "",
  "violation_type": "",
  "location": "",
  "date": ""
}}

TEXT:
{text[:MAX_CHARS]}
"""

    for attempt in range(RETRIES):
        try:
            response = model.generate_content(prompt)
            raw = response.text.strip()

            # Try parsing to ensure valid JSON
            parsed = json.loads(raw)
            return parsed

        except Exception as e:
            time.sleep(1)

    # fallback (never breaks pipeline)
    return {
        "entity": "",
        "violation_type": "",
        "location": "",
        "date": ""
    }

# --------------------
# MAIN PIPELINE
# --------------------

def main():
    results = []

    files = [f for f in os.listdir(TEXT_DIR) if f.endswith(".txt")]

    for file in files:
        path = os.path.join(TEXT_DIR, file)
        doc_id = file.replace(".txt", "")

        with open(path, encoding="utf-8") as f:
            text = f.read()

        extracted = extract_info(text)

        results.append({
            "doc_id": doc_id,
            "entity": extracted["entity"],
            "violation_type": extracted["violation_type"],
            "location": extracted["location"],
            "date": extracted["date"]
        })

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print("✅ Structured extraction completed")

# --------------------
# RUN
# --------------------
if __name__ == "__main__":
    main()
