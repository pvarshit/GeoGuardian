import fitz
import os
import json

OUTPUT_DIR = "data/processed_text"
os.makedirs(OUTPUT_DIR, exist_ok=True)

with open("data/document_registry.json") as f:
    registry = json.load(f)

for doc in registry:
    if doc["status"] != "pending":
        continue

    pdf = fitz.open(doc["path"])
    text = ""

    for page in pdf:
        text += page.get_text()

    out_path = os.path.join(
        OUTPUT_DIR,
        f"{doc['doc_id']}.txt"
    )

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(text)

    doc["status"] = "extracted"

with open("data/document_registry.json", "w") as f:
    json.dump(registry, f, indent=2)

print("Text extraction completed.")
