import pandas as pd
import glob
import os

data_dir = "data"
files = glob.glob(f"{data_dir}/*.xlsx")

print(f"Found {len(files)} Excel files in {data_dir}:")
for f in files:
    try:
        df = pd.read_excel(f)
        print(f"\n--- {os.path.basename(f)} ---")
        print(f"Shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        print(f"First row: {df.iloc[0].to_dict() if not df.empty else 'Empty'}")
        
        # Check for required columns
        required = ['AQI', 'PM2.5', 'Temp (degree C)', 'RH (%)', 'WS (m/s)']
        missing = [c for c in required if c not in df.columns and c.lower() not in df.columns] # simple check
        if missing:
            print(f"WARNING: Potential missing columns: {missing}")
        else:
            print("OK: All key columns appear present.")
            
    except Exception as e:
        print(f"ERROR reading {f}: {e}")
