import json
import faiss
import numpy as np
import os
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from generic_prompt_builder import build_rag_prompt_from_unknown_json, json_to_natural_language

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
gen_model = genai.GenerativeModel("gemini-1.5-flash")

# Load Retrieval Models
model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("data/vector.index")

with open("data/chunk_metadata.json") as f:
    meta = json.load(f)

def retrieve(query, k=5):
    q = model.encode([query])
    _, idxs = index.search(np.array(q), k)
    return [meta[i] for i in idxs[0]]

def generate_answer(agent_outputs):
    # 1. Build the base prompt from signals
    base_prompt = build_rag_prompt_from_unknown_json(agent_outputs)
    
    # 2. Create a search query from signals (using the readable format)
    # We combine the signals into a string to find relevant historical documents
    query_text = " ".join([line.strip() for signal in agent_outputs for line in json_to_natural_language(signal)])
    
    # 3. Retrieve context
    print(f"Retrieving context for query derived from signals...")
    retrieved_docs = retrieve(query_text, k=3)
    context_text = "\n\n".join([f"Source ({r['doc_id']}): {r['text']}" for r in retrieved_docs])
    
    # 4. Construct Final Prompt
    final_prompt = f"""
{base_prompt}

### Relevant Context from Historical Records:
{context_text}

Please synthesis the signals with the historical context to answer the questions.
"""
    
    # 5. Generate Answer
    # 5. Generate Answer
    print("Finding available Gemini model...")
    target_model_name = None
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                if 'gemini' in m.name:
                    target_model_name = m.name
                    break
    except Exception as e:
        print(f"Warning: Could not list models ({e}). Defaulting to 'gemini-pro'.")
        target_model_name = "gemini-pro"

    if not target_model_name:
        target_model_name = "gemini-pro"

    print("Generating answer with gemini-1.5-flash...")
    try:
        current_model = genai.GenerativeModel(target_model_name)
        response = current_model.generate_content(final_prompt)
        return response.text
    except Exception as e:
        return f"Error generation failed with {target_model_name}: {e}"

if __name__ == "__main__":
    # Sample Unknown JSON Signals
    agent_outputs = [
        {
            "type": "satellite_detection",
            "anomaly": {
                "category": "water_color_change",
                "confidence": 0.81
            },
            "coordinates": [17.38, 78.48]
        },
        {
            "sensor_reading": {
                "metric": "BOD",
                "value": 42,
                "unit": "mg/L"
            },
            "location": "Godavari upstream"
        }
    ]

    answer = generate_answer(agent_outputs)
    print("\nXXX RAG Output XXX\n")
    print(answer)
