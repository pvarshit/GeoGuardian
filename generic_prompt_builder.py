def json_to_natural_language(data, indent=0):
    """
    Converts arbitrary JSON into readable text.
    Handles unknown schemas safely.
    """
    lines = []
    prefix = "  " * indent

    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, (dict, list)):
                lines.append(f"{prefix}{k}:")
                lines.extend(json_to_natural_language(v, indent + 1))
            else:
                lines.append(f"{prefix}{k}: {v}")

    elif isinstance(data, list):
        for idx, item in enumerate(data):
            lines.append(f"{prefix}- Item {idx+1}:")
            lines.extend(json_to_natural_language(item, indent + 1))

    return lines


def build_rag_prompt_from_unknown_json(agent_outputs: list) -> str:
    """
    agent_outputs: List of JSON objects from different agents
    """

    context_blocks = []

    for idx, output in enumerate(agent_outputs, start=1):
        readable = "\n".join(json_to_natural_language(output))
        context_blocks.append(f"Agent Signal {idx}:\n{readable}")

    context = "\n\n".join(context_blocks)

    prompt = f"""
The following signals were detected by different monitoring agents:

{context}

Using historical environmental reports, regulatory documents, and past violations:

- Why might this event be occurring?
- Have similar incidents been reported in the past?
- Which entities or activities were historically involved?

Provide only evidence-based insights grounded in historical records.
"""

    return prompt.strip()
if __name__ == "__main__":
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

    prompt = build_rag_prompt_from_unknown_json(agent_outputs)
    print(prompt)
