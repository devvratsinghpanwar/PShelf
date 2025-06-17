# 📈 Predictive Shelf

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-0.95%2B-green?logo=fastapi) ![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-4.4.5-purple?logo=vite)

> A hyper-local demand forecasting tool built for the Walmart Hackathon. This project aims to transform retail supply chains by providing store managers with AI-powered insights to prevent stockouts and reduce waste.

---

## 🎯 The Problem
**Who:** Walmart store managers and inventory planners.

**What:** They struggle with inaccurate demand forecasting, which leads to unexpected stockouts of popular items and overstocking of unwanted goods. This is because current forecasting models are too broad and fail to account for unique, hyper-local demand drivers.

**Where:** The problem occurs at the individual store level, where demand for certain products can be drastically different from another store just a few miles away.

**When:** This issue becomes most critical during periods of sharp, localized demand shifts, such as during major local sporting events, community festivals, sudden weather changes, or demographic-specific holidays.

## ✨ The Solution: Predictive Shelf
**Predictive Shelf** is an intelligent dashboard that provides store managers with actionable, 7-day demand predictions. Instead of only using historical sales, our solution integrates real-time external data sources like local weather forecasts and public events to understand the *context* behind customer demand.

This allows managers to proactively adjust inventory, preventing lost sales from stockouts and reducing food waste from overstock, ultimately leading to higher revenue and greater customer satisfaction.

## 🌟 Key Features
- **Hyper-Local Forecasting:** Generates demand predictions tailored to a specific store's environment.
- **External Data Integration:** Leverages weather and local event data to enrich predictions.
- **Dynamic Product Selection:** Allows managers to view forecasts for different products (e.g., Coke, Chips, Ice Cream).
- **Intuitive UI:** A clean, simple dashboard for at-a-glance insights.
- **Scalable Backend:** Built with FastAPI for high-performance and a clear path to production.

<!-- 
DEMO SCREENSHOT: Once your UI is looking good, take a screenshot or a GIF and place it here.
<p align="center">
  <img src="path/to/your/demo.gif" alt="Predictive Shelf Demo" width="800"/>
</p>
-->

## 🛠️ Tech Stack

| Category      | Technology                               | Reason                                                                          |
|---------------|------------------------------------------|---------------------------------------------------------------------------------|
| **Backend**   | Python, FastAPI                          | High-performance async framework, perfect for ML and data-heavy APIs.           |
| **AI/ML**     | Facebook Prophet, Pandas, Scikit-learn   | State-of-the-art time-series forecasting, ideal for this use case.              |
| **Frontend**  | React, TypeScript, Vite                  | Modern, fast, and type-safe environment for building a robust user interface.   |
| **Data Viz**  | Chart.js                                 | Simple and effective library for creating beautiful, interactive forecast charts. |
| **Database**  | SQLite (Prototype), PostgreSQL (Prod)    | Zero-setup for hackathon speed; clear scalability path with PostgreSQL.         |
| **DevOps**    | Docker                                   | Ensures a consistent and reproducible environment for development and deployment. |

---

## 🚀 Getting Started: Local Setup

Follow these steps to set up and run the project on your local machine.

### Prerequisites
- [Git](https://git-scm.com/downloads)
- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js v16+ and npm](https://nodejs.org/en/download/)

### 1. Clone the Repository
Open your terminal and clone the project:
```bash
git clone https://github.com/your-username/predictive-shelf.git
cd predictive-shelf
```

### 2. Backend Setup
First, we'll set up the Python backend server.

```bash
# Navigate to the backend directory
cd backend

# Create a Python virtual environment
# On macOS/Linux:
python3 -m venv venv
# On Windows:
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

# Install the required Python packages
pip install "fastapi[all]" pandas prophet scikit-learn requests

# (Optional but good practice) Create a requirements.txt file for future use
pip freeze > requirements.txt
```

### 3. Frontend Setup
Next, set up the React frontend application.

```bash
# Navigate to the frontend directory from the project root
cd ../frontend

# Install the required npm packages
npm install
```

## ▶️ Running the Application

You will need to run the backend and frontend in two separate terminals.

### Terminal 1: Run the Backend
```bash
# Make sure you are in the `backend` directory and the virtual environment is activated
cd /path/to/project/backend

# Start the FastAPI server
uvicorn app.main:app --reload
```
✅ The backend should now be running on **`http://127.0.0.1:8000`**.

### Terminal 2: Run the Frontend
```bash
# Make sure you are in the `frontend` directory
cd /path/to/project/frontend

# Start the Vite development server
npm run dev
```
✅ The frontend application should now be running and will automatically open in your browser at **`http://localhost:5173`** (Vite's default port) or **`http://localhost:3000`**.

You can now view and interact with the Predictive Shelf dashboard!

## 📝 API Endpoints (Mock)
The backend provides the following mock endpoint for the frontend:

- **GET `/api/predict/{product_id}`**
  - **Description:** Returns a 7-day mock sales forecast for a given product.
  - **URL Params:** `product_id` (string) - e.g., `coke`, `chips`, `ice-cream`.
  - **Success Response (200 OK):**
    ```json
    [
        {"date": "YYYY-MM-DD", "prediction": 150},
        {"date": "YYYY-MM-DD", "prediction": 165},
        ...
    ]
    ```

## 🔮 Future Improvements
- [ ] **Integrate Real AI Model:** Replace the mock API with a fully trained Prophet model.
- [ ] **Add More Data Sources:** Integrate real-time local event APIs (e.g., Ticketmaster) and social trend data.
- [ ] **"Why?" Explanations:** Display the key drivers for a prediction spike (e.g., "Heatwave forecast").
- [ ] **User Authentication:** Add a login system for store managers.
- [ ] **Full-Scale Deployment:** Deploy the application to a cloud service like AWS or Heroku.
