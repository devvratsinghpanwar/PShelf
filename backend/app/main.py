from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import joblib
import pandas as pd
from datetime import datetime, timedelta
import requests
from googleapiclient.discovery import build
from functools import lru_cache

# --- App Initialization & Environment Variables ---
load_dotenv(dotenv_path="../.env") 
app = FastAPI()

# --- CORS ---
origins = ["*","http://localhost:5173", "http://localhost:3000"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# --- Model & Product List Loading ---
try:
    model = joblib.load("sales_model.pkl")
    print("ML Model loaded successfully.")
except FileNotFoundError:
    print("ERROR: Model file 'sales_model.pkl' not found. Please run train.py.")
    model = None

# Predefined list of products for autocomplete feature
PREDEFINED_PRODUCTS = ["coke", "chips", "ice-cream", "bread", "milk", "eggs", "cheese", "apples", "bananas", "orange juice"]

# --- External API Services with Caching ---
@lru_cache(maxsize=128) # Cache results to avoid repeated calls for the same city
def get_temperature(city: str, api_key: str) -> float | None:
    base_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    try:
        response = requests.get(base_url)
        response.raise_for_status()
        return response.json()['main']['temp']
    except requests.exceptions.RequestException as e:
        print(f"Error fetching temperature: {e}")
        return None

@lru_cache(maxsize=128) # Cache results to avoid repeated calls for the same date
def is_holiday(date_str: str, api_key: str, country_code: str) -> bool:
    try:
        service = build('calendar', 'v3', developerKey=api_key)
        calendar_id = f'{country_code}#holiday@group.v.calendar.google.com'
        time_min = f"{date_str}T00:00:00Z"
        time_max = f"{date_str}T23:59:59Z"
        events_result = service.events().list(calendarId=calendar_id, timeMin=time_min, timeMax=time_max, singleEvents=True).execute()
        return len(events_result.get('items', [])) > 0
    except Exception as e:
        print(f"Error checking for holidays: {e}")
        return False

# --- API Endpoint Definitions ---
class PredictionInput(BaseModel):
    product_id: str
    store_id: int
    city: str
    start_date: str # New field: user selects the start of the week
    fuel_price: float = 3.8
    cpi: float = 220.0

@app.get("/api/products")
async def get_products():
    """Returns the list of predefined products for the frontend."""
    return PREDEFINED_PRODUCTS

@app.post("/api/predict")
async def get_prediction(input_data: PredictionInput):
    if not model:
        raise HTTPException(status_code=503, detail="ML Model is not available.")

    # Fetch temperature once for the location (it won't change much in 7 days)
    temperature = get_temperature(input_data.city, os.getenv("OPENWEATHER_API_KEY"))
    if temperature is None:
        raise HTTPException(status_code=500, detail="Could not fetch weather data.")

    forecast_data = []
    start_date_obj = datetime.strptime(input_data.start_date, "%Y-%m-%d")

    # Loop for the next 7 days to create a daily forecast
    for i in range(7):
        current_date_obj = start_date_obj + timedelta(days=i)
        current_date_str = current_date_obj.strftime("%Y-%m-%d")

        # Fetch holiday status for each specific day (this is cached)
        holiday_flag = is_holiday(current_date_str, os.getenv("GOOGLE_API_KEY"),"en.indian")

        try:
            feature_data = {
                'Store': input_data.store_id,
                'Holiday_Flag': 1 if holiday_flag else 0,
                'Temperature': temperature,
                'Month': current_date_obj.month,
                'Year': current_date_obj.year,
                'Day': current_date_obj.day,
                'DayOfWeek': current_date_obj.weekday(),
                'Fuel_Price': input_data.fuel_price,
                'CPI': input_data.cpi,
            }
            input_df = pd.DataFrame([feature_data])
            input_df = input_df[model.get_booster().feature_names]

            prediction = model.predict(input_df)
            predicted_sales = round(float(prediction[0]), 2)
            
            # Append daily results
            forecast_data.append({
                "date": current_date_str,
                "predicted_sales": predicted_sales if predicted_sales > 0 else 0, # Ensure sales aren't negative
                "is_holiday": holiday_flag
            })

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error preparing data for model on {current_date_str}: {e}")

    return {
        "request_input": input_data.model_dump(),
        "location_data": {
            "city": input_data.city,
            "temperature_celsius": float(temperature),
        },
        "forecast": forecast_data
    }

@app.get("/")
def read_root():
    return {"status": "Predictive Shelf API is running!"}