# Agentic RAG for Environmental Monitoring

This project implements an Agentic Retrieval-Augmented Generation (RAG) system designed to analyze environmental signals (e.g., satellite anomalies, sensor readings) and synthesize insights using historical records.

## Overview

The system operates in a workflow where "Agent Signals" (JSON data) are converted into natural language queries to retrieve relevant historical context. A Generative AI model (Gemini) then synthesizes the signals and context to provide evidence-based answers.

## Architecture & Components

### 1. Data Ingestion Pipeline
*   **`extract_text.py`**: Extracts raw text from source documents (e.g., PDFs) located in `data/`.
*   **`chunk_text.py`**: Splits extracted text into manageable chunks for processing.
*   **`build_vector_db.py`**: Generates embeddings for text chunks using `SentenceTransformer` and stores them in a FAISS vector index (`data/vector.index`) along with metadata.

### 2. Core RAG Engine
*   **`rag_query.py`** (Main Entry Point): requires `GOOGLE_API_KEY`.
    *   Takes input signals (JSON) representing detected events.
    *   Uses `generic_prompt_builder.py` to create a coherent prompt.
    *   Retrieves relevant historical documents from the vector index.
    *   Calls the Google Gemini API to generate a final answer based on both signals and history.
    *   **Features**: Includes dynamic model selection to handle API variations (e.g., `gemini-1.5-flash`, `gemini-pro`).

### 3. Utilities
*   **`generic_prompt_builder.py`**: A utility to convert arbitrary JSON objects (agent outputs) into readable natural language text for LLM consumption.
*   **`extract_info.py`**: A specialized script using Gemini to extract structured fields (entities, violations, locations) from raw text files.

## Setup

1.  **Prerequisites**: Python 3.10+
2.  **Install Dependencies**:
    ```bash
    pip install -r requirments.txt
    ```
    *(Note: `requirments.txt` encompasses `pymupdf`, `google-generativeai`, `faiss-cpu`, `sentence-transformers`)*

3.  **Environment Variables**:
    You must set your Google API Key for Gemini functionalities.
    ```powershell
    $env:GOOGLE_API_KEY="your_api_key_here"
    ```

## Usage

### Running the RAG Query
To test the end-to-end flow with sample signals:
```bash
python rag_query.py
```
This will:
1.  Load the sample signals (satellite detection, sensor readings) defined in the script.
2.  Retrieve context from `data/vector.index`.
3.  Print the synthesized answer from Gemini.

### Running Data Ingestion (If adding new data)
```bash
python extract_text.py
python chunk_text.py
python build_vector_db.py
```
