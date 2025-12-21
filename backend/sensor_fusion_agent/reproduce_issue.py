
import os
import asyncio
import pandas as pd
import glob
from datetime import datetime

# Mock env vars if needed
os.environ["OPENWEATHER_API_KEY"] = "mock"

async def test_explorer_history(city="Hyderabad"):
    print(f"Testing explorer history for {city}...")
    try:
        data_dir = "data"
        all_files = glob.glob(f"{data_dir}/*.xlsx")
        print(f"All files: {all_files}")
        files = [f for f in all_files if city.lower() in f.lower()]
        print(f"Matching files: {files}")
        
        if not files:
            print("No files found via glob.")
            # absolute path check
            abs_dir = os.path.abspath(data_dir)
            print(f"Absolute data dir: {abs_dir}")
            print(f"Files in abs dir: {os.listdir(abs_dir)}")
            return

        dfs = []
        for f in files:
            print(f"Reading {f}...")
            try:
                df = pd.read_excel(f)
                print(f"Read {f}")
                print(f"Columns: {df.columns.tolist()}")
                print(f"Head: \n{df.head(3)}")
                dfs.append((f, df)) # Store filename with df
            except Exception as e:
                print(f"Error reading {f}: {e}")
        
        if not dfs:
            print("No dfs loaded.")
            return

        full_df = pd.concat(dfs, ignore_index=True)
        print(f"Concatenated shape: {full_df.shape}")
        
    except Exception as e:
        print(f"Explorer History Error: {e}")
        import traceback
        traceback.print_exc()

def test_lgbm_prediction():
    print("Testing LightGBM prediction...")
    try:
        import ml_engine_lgbm
        print("Imported ml_engine_lgbm")
        # Ensure model is compatible
        preds = ml_engine_lgbm.predict_pm25_next_days(state="Telangana", city="Hyderabad", current_pm25=50.0, days=3)
        print(f"Predictions: {preds}")
    except Exception as e:
        print(f"LightGBM Error: {e}")
        import traceback
        traceback.print_exc()

async def main():
    await test_explorer_history()
    test_lgbm_prediction()

if __name__ == "__main__":
    asyncio.run(main())
