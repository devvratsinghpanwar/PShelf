from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import date, timedelta

# Initialize the FastAPI app
app = FastAPI()

# --- CORS Middleware Setup ---
# This is crucial for allowing your React frontend (running on localhost:5173)
# to communicate with this backend (running on localhost:8000).
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MOCK API ENDPOINT ---

@app.get("/api/predict/{product_id}")
def get_mock_prediction(product_id: str):
    """
    This is a mock endpoint. It does not use a real AI model.
    It returns a hardcoded 7-day forecast for a given product ID.
    The data is slightly randomized to simulate a real-world scenario.
    """
    print(f"Received request for product_id: {product_id}") # For debugging in your terminal
    
    # Base prediction values for different products
    if product_id == "coke":
        base_prediction = 150
    elif product_id == "chips":
        base_prediction = 220
    elif product_id == "ice-cream":
        base_prediction = 90
    else:
        base_prediction = 50 # A default for any other product

    # Generate a list of 7 days of forecast data
    forecast_data = []
    today = date.today()
    for i in range(7):
        current_date = today + timedelta(days=i)
        # Add some random variation to make it look dynamic
        prediction_value = base_prediction + random.randint(-20, 20)
        
        forecast_data.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "prediction": prediction_value
        })
        
    return forecast_data

@app.get("/")
def read_root():
    """A simple root endpoint to check if the server is running."""
    return {"status": "Predictive Shelf API is running!"}