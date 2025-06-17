import { useState, useEffect } from "react";
import axios from "axios";

interface ForecastData {
  date: string;
  prediction: number;
}

type ProductID = "coke" | "chips" | "ice-cream";

const ProductDisplay = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductID>(
    () => (localStorage.getItem("selectedProduct") as ProductID) || "coke"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("selectedProduct", selectedProduct);
  }, [selectedProduct]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:8000/api/predict/${selectedProduct}`
        );
        setForecastData(response.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not retrieve forecast data. Is the backend server running?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedProduct]);

  return (
    <main className="flex flex-col items-center px-4">
      <div className="text-center mb-6 bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-white bg-amber-300 rounded-2xl">Select a Product to Forecast</h2>
        <div className="space-x-4">
          {(["coke", "chips", "ice-cream"] as ProductID[]).map((product) => (
            <button
              key={product}
              onClick={() => setSelectedProduct(product)}
              disabled={selectedProduct === product}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                selectedProduct === product
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-yellow-400 hover:bg-yellow-500 text-black"
              }`}
            >
              {product.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0071ce] text-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          7-Day Forecast for:{" "}
          <span className="capitalize text-yellow-300">{selectedProduct}</span>
        </h3>

        {isLoading ? (
          <p className="text-sm">Loading forecast...</p>
        ) : error ? (
          <p className="text-red-500 font-bold">{error}</p>
        ) : (
          <ul className="divide-y divide-white/20">
            {forecastData.map((item) => (
              <li key={item.date} className="py-2">
                <strong>{item.date}:</strong> Expected Sales – {item.prediction} units
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default ProductDisplay;
