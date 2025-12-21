import os
import json
import uuid

BASE_DIR = "data/raw_documents"
registry = []

for category in os.listdir(BASE_DIR):
    cat_path = os.path.join(BASE_DIR, category)
    if os.path.isdir(cat_path):
        for file in os.listdir(cat_path):
            if file.endswith(".pdf"):
                registry.append({
                    "doc_id": str(uuid.uuid4()),
                    "file_name": file,
                    "path": os.path.join(cat_path, file),
                    "category": category,
                    "status": "pending"
                })

with open("data/document_registry.json", "w") as f:
    json.dump(registry, f, indent=2)

print("Document registry created.")
