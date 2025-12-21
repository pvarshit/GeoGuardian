import faiss
import json
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

with open("data/chunks.json") as f:
    chunks = json.load(f)

texts = [c["text"] for c in chunks]
embeddings = model.encode(texts)

index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings))

faiss.write_index(index, "data/vector.index")

with open("data/chunk_metadata.json", "w") as f:
    json.dump(chunks, f, indent=2)

print("Vector DB ready.")
