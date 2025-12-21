import json
import os

CHUNK_SIZE = 500
OVERLAP = 50

def chunk_text(text):
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + CHUNK_SIZE
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += CHUNK_SIZE - OVERLAP

    return chunks

chunks_db = []

for file in os.listdir("data/processed_text"):
    if not file.endswith(".txt"):
        continue

    doc_id = file.replace(".txt", "")
    with open(f"data/processed_text/{file}", encoding="utf-8") as f:
        text = f.read()

    chunks = chunk_text(text)

    for idx, chunk in enumerate(chunks):
        chunks_db.append({
            "chunk_id": f"{doc_id}_c{idx}",
            "doc_id": doc_id,
            "text": chunk
        })

with open("data/chunks.json", "w") as f:
    json.dump(chunks_db, f, indent=2)

print("Chunking completed.")
