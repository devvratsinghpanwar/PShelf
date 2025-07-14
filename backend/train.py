import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import joblib
import os

# 1. Load Data from the Kaggle CSV file
try:
    # Assuming 'Walmart.csv' is in the root directory, same level as 'backend'
    df = pd.read_csv('Walmart.csv')
    print("Dataset loaded successfully.")
except FileNotFoundError:
    print("Error: 'Walmart.csv' not found. Please place it in the project root directory.")
    exit()

# 2. Feature Engineering
df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y')
df['Month'] = df['Date'].dt.month
df['Year'] = df['Date'].dt.year
df['Day'] = df['Date'].dt.day
df['DayOfWeek'] = df['Date'].dt.dayofweek

# --- KEY CHANGE: Create a Daily_Sales target ---
# We are creating an average daily sales figure to train the model on a daily basis.
df['Daily_Sales'] = df['Weekly_Sales'] / 7

# Define features (X) and new target (y)
features = ['Store', 'Holiday_Flag', 'Temperature', 'Month', 'Year', 'Day', 'DayOfWeek', 'Fuel_Price', 'CPI']
target = 'Daily_Sales' # Our new target variable

X = df[features]
y = df[target]

# 3. Train the XGBoost Regressor model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training the new daily sales model...")
model = XGBRegressor(objective='reg:squarederror', n_estimators=150, max_depth=5, learning_rate=0.1, n_jobs=-1)
model.fit(X_train, y_train)
print("Model training complete.")

# 4. Save the trained model to the backend app directory
# Ensure the 'app' directory exists within 'backend'
output_dir = 'backend/app'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

joblib.dump(model, os.path.join(output_dir, 'sales_model.pkl'))
print(f"Model saved to {output_dir}/sales_model.pkl")