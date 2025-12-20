import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib
import os
from datetime import datetime
import glob

# Constants
MODEL_PATH = os.path.join(os.path.dirname(__file__), "aqi_model.pkl")
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def load_local_data():
    """Load and combine Hyderabad Excel files."""
    print("Loading local Hyderabad data...")
    all_files = glob.glob(os.path.join(DATA_DIR, "*.xlsx"))
    if not all_files:
        print("No Excel files found in data directory.")
        return None
    
    dfs = []
    for f in all_files:
        try:
            print(f"Reading {f}...")
            # specific logic for the user's files
            df = pd.read_excel(f)
            dfs.append(df)
        except Exception as e:
            print(f"Error reading {f}: {e}")
            
    if not dfs:
        return None
        
    return pd.concat(dfs, ignore_index=True)

def preprocess_data(df):
    """Clean and feature engineer the data."""
    if df is None:
        return None

    # Standardize column names
    df.columns = [c.strip().lower() for c in df.columns]
    
    # Identify Date and AQI columns
    # Based on standard CPCB data formats often found in these files
    date_col = next((c for c in df.columns if 'date' in c), None)
    target_col = next((c for c in df.columns if 'aqi' in c and 'index' not in c), 'aqi') # Avoid 'aqi_index' if 'aqi' exists
    
    if not date_col or target_col not in df.columns:
        print(f"Columns not found. Available: {df.columns}")
        # Fallback: Assume first column is date, and look for 'aqi'
        if not date_col: date_col = df.columns[0]
        if target_col not in df.columns: return None

    print(f"Using Date Col: {date_col}, Target: {target_col}")

    # Convert date
    df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
    df = df.dropna(subset=[date_col, target_col])
    
    # Ensure numeric AQI
    df[target_col] = pd.to_numeric(df[target_col], errors='coerce')
    df = df.dropna(subset=[target_col])
    
    df = df.sort_values(by=date_col)
    
    # Feature Engineering
    df['day'] = df[date_col].dt.day
    df['month'] = df[date_col].dt.month
    df['year'] = df[date_col].dt.year
    df['day_of_week'] = df[date_col].dt.dayofweek
    
    # Lag features
    df['prev_aqi'] = df[target_col].shift(1)
    df = df.dropna()
    
    # Keep minimal cols for training
    return df[[date_col, 'day', 'month', 'year', 'day_of_week', 'prev_aqi', target_col]], target_col

def train_model():
    """Load data, train, and save model."""
    df_raw = load_local_data()
    result = preprocess_data(df_raw)
    if not result:
        return {"status": "error", "message": "Failed to process data"}
        
    df, target_col = result
    
    features = ['day', 'month', 'year', 'day_of_week', 'prev_aqi']
    X = df[features]
    y = df[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    rmse = np.sqrt(mse)
    
    print(f"Model trained. RMSE: {rmse}")
    joblib.dump(model, MODEL_PATH)
    
    # Return recent history for visualization
    history = df.tail(30).to_dict(orient='records')
    # Convert timestamps to str for JSON
    for h in history:
        for k, v in h.items():
            if isinstance(v, pd.Timestamp):
                h[k] = v.isoformat()

    return {
        "status": "success",
        "rmse": rmse,
        "message": "Model trained on Hyderabad data.",
        "history": history
    }

def predict_days(current_aqi, days=3):
    """Predict AQI for next N days."""
    if not os.path.exists(MODEL_PATH):
        return None
        
    model = joblib.load(MODEL_PATH)
    predictions = []
    
    current_val = current_aqi
    current_date = datetime.now()
    
    for i in range(1, days + 1):
        # future date logic
        next_date = current_date + pd.Timedelta(days=i)
        
        features = pd.DataFrame([{
            'day': next_date.day,
            'month': next_date.month,
            'year': next_date.year,
            'day_of_week': next_date.weekday(),
            'prev_aqi': current_val
        }])
        
        pred = model.predict(features)[0]
        predictions.append({
            "date": next_date.strftime("%Y-%m-%d"),
            "predicted_aqi": round(pred, 2)
        })
        current_val = pred
        
    return predictions

if __name__ == "__main__":
    train_model()
