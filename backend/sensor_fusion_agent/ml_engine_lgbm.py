import joblib
import pandas as pd
from datetime import datetime
from pathlib import Path

# Path to the model file
MODEL_PATH = Path(__file__).parent / "india_pm25_lgbm_model.pkl"

# Load the model bundle globally
try:
    print(f"Loading LightGBM model from {MODEL_PATH}...")
    bundle = joblib.load(MODEL_PATH)
    lgbm_model = bundle["model"]
    FEATURE_COLS = bundle["feature_columns"]
    STATE_ID_MAP = bundle["state_id_map"]
    CITY_ID_MAP = bundle["city_id_map"]
    BEST_ITER = bundle.get("best_iteration")
    print("LightGBM model loaded successfully.")
except Exception as e:
    print(f"Error loading LightGBM model: {e}")
    lgbm_model = None

def predict_pm25_next_days(state: str, city: str, current_pm25: float, days: int = 3):
    """
    Predicts PM2.5 for the next `days` days.
    """
    if not lgbm_model:
        raise ValueError("Model not loaded.")

    sid = STATE_ID_MAP.get(state, 0)
    cid = CITY_ID_MAP.get(city, 0)
    preds = []
    cur = float(current_pm25)
    now = datetime.utcnow()

    for i in range(1, days + 1):
        d = now + pd.Timedelta(days=i)
        
        # Construct the feature row
        row_data = {
            "state_id": sid,
            "city_id": cid,
            "day": d.day,
            "month": d.month,
            "year": d.year,
            "day_of_week": d.weekday(),
            "week_of_year": d.isocalendar()[1],
            "lag_1": cur,
            "lag_2": cur,
            "lag_3": cur,
            "pm25_7d_mean": cur,
            "pm25_30d_mean": cur,
        }
        
        # Ensure correct column order
        row = pd.DataFrame([row_data])[FEATURE_COLS]

        if BEST_ITER is not None:
            val = lgbm_model.predict(row, num_iteration=BEST_ITER)[0]
        else:
            val = lgbm_model.predict(row)[0]

        preds.append({
            "date": d.strftime("%Y-%m-%d"),
            "predicted_pm25": round(float(val), 2),
        })
        # Update current value for next lag (simple autoregressive assumption)
        cur = float(val)

    return preds
