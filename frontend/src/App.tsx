import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // We'll add some basic styles here later

interface ForecastData {
  date: string; // Date in 'YYYY-MM-DD' format
  prediction: number; // Predicted sales for that date
}

// 2. Define a union type for our product IDs for better type safety.
// This ensures we can only use valid product strings.
type ProductID = 'coke' | 'chips' | 'ice-cream';


function App() {
  // --- STATE MANAGEMENT ---
  // State to hold the forecast data we get from the backend
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  
  // State to track which product is currently selected
  const [selectedProduct, setSelectedProduct] = useState<ProductID>(
    ()=>localStorage.getItem('selectedProduct') as ProductID || 'coke' // Load from localStorage or default to 'coke'
  ); // Default to 'coke'
  
  // State to handle loading status for better user experience
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State to handle any potential errors during the API call
  const [error, setError] = useState<string | null>(null);

  // --- LOCAL STORAGE ---
  // useEffect hook to save the selected product to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedProduct', selectedProduct); // Save the selected product to localStorage
  }, [selectedProduct]); // This effect runs whenever selectedProduct changes

  // --- DATA FETCHING ---
  // useEffect hook to fetch data whenever the 'selectedProduct' changes
  useEffect(() => {
    // Define the async function to fetch data
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before the API call
      setError(null);     // Clear any previous errors

      try {
        // Make a GET request to our backend's mock endpoint
        const response = await axios.get(`http://localhost:8000/api/predict/${selectedProduct}`);
        
        // Update our state with the data from the response
        setForecastData(response.data);
      } catch (err) {
        // If an error occurs, update the error state
        console.error("Failed to fetch data:", err);
        setError("Could not retrieve forecast data. Is the backend server running?");
      } finally {
        // Set loading to false after the API call is complete (whether it succeeded or failed)
        setIsLoading(false);
      }
    };

    fetchData(); // Call the function to execute the fetch

  }, [selectedProduct]); // The dependency array: this effect runs again whenever selectedProduct changes

  // --- RENDERING LOGIC ---
  return (
    <div className="App">
      <header className="App-header">
        <h1>Predictive Shelf Dashboard</h1>
        <p>A hyper-local demand forecasting tool for Walmart.</p>
      </header>
      
      <main className="App-main">
        <div className="controls">
          <h2>Select a Product to Forecast</h2>
          {/* Buttons to change the selected product. This will trigger the useEffect hook. */}
          <button onClick={() => setSelectedProduct('coke')} disabled={selectedProduct === 'coke'}>
            Coke
          </button>
          <button onClick={() => setSelectedProduct('chips')} disabled={selectedProduct === 'chips'}>
            Chips
          </button>
          <button onClick={() => setSelectedProduct('ice-cream')} disabled={selectedProduct === 'ice-cream'}>
            Ice Cream
          </button>
        </div>

        <div className="forecast-display">
          <h3>7-Day Forecast for: <span className="product-name">{selectedProduct}</span></h3>
          
          {/* Conditional Rendering: Show a loading message, an error, or the data */}
          {isLoading ? (
            <p>Loading forecast...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <ul>
              {/* Map over the forecastData array and render a list item for each day */}
              {forecastData.map((item) => (
                <li key={item.date}>
                  <strong>{item.date}:</strong> Expected Sales - {item.prediction} units
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;