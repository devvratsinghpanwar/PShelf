import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { LoaderOne } from "./ui/loader";

// Updated interface to match the new API response
interface DailyForecast {
  date: string;
  predicted_sales: number;
  is_holiday: boolean;
}

interface ForecastResponse {
  forecast: DailyForecast[];
  location_data: {
    temperature_celsius: number;
  };
}

const ProductDisplay = () => {
  // State for inputs
  const [productId, setProductId] = useState<string>("coke");
  const [storeId, setStoreId] = useState<number>(1);
  const [city, setCity] = useState<string>("New York");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // State for autocomplete
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allProducts, setAllProducts] = useState<string[]>([]);
  
  // State for API response
  const [prediction, setPrediction] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the list of all products once on component mount
  useEffect(() => {
    axios.get<string[]>("http://localhost:8000/api/products")
      .then(response => {
        setAllProducts(response.data);
      })
      .catch(err => {
        console.error("Failed to fetch product list:", err);
      });
  }, []);
  
  // Memoized filtering for the product autocomplete
  const filteredProducts = useMemo(() => {
    if (searchTerm === "") return [];
    return allProducts.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, allProducts]);

  // Main data fetching effect
  useEffect(() => {
    // Basic validation to prevent API calls with empty inputs
    if (!productId || !city || !startDate) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const requestBody = {
          product_id: productId,
          store_id: storeId,
          city: city,
          start_date: startDate,
          fuel_price: 3.75, // These can be dynamic inputs later
          cpi: 219.5,
        };

        const response = await axios.post<ForecastResponse>(
          "http://localhost:8000/api/predict",
          requestBody
        );
        setPrediction(response.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not retrieve forecast data. Please check inputs and ensure the backend is running.");
        setPrediction(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, storeId, city, startDate]);

  const handleProductSelect = (product: string) => {
    setProductId(product);
    setSearchTerm(""); // Clear search term after selection
  };

  return (
    <main className="flex flex-col items-center px-4 mt-4">
      {/* --- INPUT CONTROLS --- */}
      <div className="text-center mb-6 bg-[#1C2F44]/60 p-6 rounded-xl shadow-lg w-180 backdrop-blur-md border border-white/10">
        <h2 className="text-2xl font-semibold mb-4 text-white bg-[#253B52]/70 rounded-lg p-2 backdrop-blur-sm border border-white/10">
          Forecast Weekly Sales
        </h2>

        <div className="flex flex-col gap-4 items-center">
          {/* Product Autocomplete Input */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search for a product (e.g., coke)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded-md text-white font-semibold bg-[#253B52]/70 border border-white/10 focus:outline-none backdrop-blur-sm w-full"
            />
            {filteredProducts.length > 0 && (
              <ul className="absolute z-10 w-full bg-[#253B52] border border-white/10 rounded-md mt-1">
                {filteredProducts.map(p => (
                  <li 
                    key={p} 
                    className="p-2 text-white hover:bg-[#1C2F44] cursor-pointer"
                    onClick={() => handleProductSelect(p)}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-left mt-1 text-gray-400">Selected: <span className="font-bold text-white">{productId}</span></p>
          </div>
          
          <input
            type="number"
            placeholder="Store ID (e.g., 1)"
            value={storeId}
            onChange={(e) => setStoreId(parseInt(e.target.value) || 1)}
            className="p-2 rounded-md text-white font-semibold bg-[#253B52]/70 border border-white/10 focus:outline-none backdrop-blur-sm w-64"
          />

          <input
            type="text"
            placeholder="City (e.g., New York)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 rounded-md text-white font-semibold bg-[#253B52]/70 border border-white/10 focus:outline-none backdrop-blur-sm w-64"
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded-md text-white font-semibold bg-[#253B52]/70 border border-white/10 focus:outline-none backdrop-blur-sm w-64"
          />
        </div>
      </div>

      {/* --- RESULTS DISPLAY --- */}
      <div className="text-[#E0E6ED] p-6 rounded-lg shadow-2xl w-full max-w-2xl bg-[#142437]/60 backdrop-blur-md border border-white/10">
        <h3 className="text-xl font-semibold mb-4">
          7-Day Forecast for {productId}
        </h3>

        {isLoading ? (
          <div className="flex justify-center"><LoaderOne /></div>
        ) : error ? (
          <p className="text-[#E06C75] font-bold">{error}</p>
        ) : prediction && prediction.forecast.length > 0 ? (
          <table className="w-full text-left">
            <thead className="border-b border-white/20">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Predicted Sales</th>
                <th className="py-2">Holiday</th>
              </tr>
            </thead>
            <tbody>
              {prediction.forecast.map((day) => (
                <tr key={day.date} className="border-b border-white/10">
                  <td className="py-2">{day.date}</td>
                  <td className="py-2">{Math.round(day.predicted_sales)} units</td>
                  <td className="py-2">{day.is_holiday ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No forecast data available.</p>
        )}
      </div>
    </main>
  );
};

export default ProductDisplay;