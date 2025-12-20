import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def create_dummy_data():
    base = datetime.today()
    date_list = [base - timedelta(days=x) for x in range(100)]
    
    df = pd.DataFrame({
        'Date': date_list,
        'AQI': np.random.randint(50, 300, size=100),
        'PM2.5': np.random.randint(20, 150, size=100),
        'PM10': np.random.randint(40, 200, size=100),
        'NO2': np.random.randint(10, 80, size=100),
        'SO2': np.random.randint(5, 40, size=100),
        'CO': np.random.uniform(0.1, 2.0, size=100),
        'Ozone': np.random.randint(10, 100, size=100)
    })
    
    os.makedirs('data', exist_ok=True)
    df.to_excel('data/dummy_aqi.xlsx', index=False)
    print("Created dummy_aqi.xlsx")

if __name__ == "__main__":
    create_dummy_data()
