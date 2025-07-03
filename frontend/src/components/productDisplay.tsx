import { useState, useEffect } from "react";
import axios from "axios";
import ForecastChart from "./ForecastChart";

interface ForecastData {
  date: string;
  prediction: number;
}

type ProductID = "coke" | "chips" | "ice-cream";

const products: ProductID[] = ["coke", "chips", "ice-cream"];

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
        setError(
          "Could not retrieve forecast data. Is the backend server running?"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedProduct]);

  return (
    <main className="flex flex-col items-center px-4 mt-4">
      <div className="text-center mb-6 bg-[#bc6c25] p-6 rounded-xl shadow-lg w-180">
        <h2 className="text-2xl font-semibold mb-4 text-[#fefae0] bg-[#606c38] rounded-lg p-2">
          Select a Product to Forecast
        </h2>
        <div className="space-x-4">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value as ProductID)}
            className="p-2 rounded-md text-[#fefae0] font-semibold bg-[#606c38] border-none focus:outline-none  "
          >
            {products.map((prod) => (
              <option key={prod} value={prod}>
                {prod.charAt(0).toUpperCase() + prod.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-6 w-full">
        <div className="bg-transparent text-black p-6 rounded-lg shadow-2xl w-full min-w-80">
          <h3 className="text-xl font-semibold mb-4">
            7-Day Forecast for:{" "}
            <span className="capitalize text-black dark:text-white">
              {selectedProduct}
            </span>
          </h3>

          {isLoading ? (
            <p className="text-sm">Loading forecast...</p>
          ) : error ? (
            <p className="text-red-500 font-bold">{error}</p>
          ) : (
            <ul className="divide-y divide-white/20">
              {forecastData.map((item) => (
                <li key={item.date} className="py-2">
                  <strong>{item.date}:</strong> Expected Sales –{" "}
                  {item.prediction} units
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-shrink w-full min-h-95">
          <ForecastChart
            data={forecastData}
            productName={selectedProduct.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          />
        </div>
      </div>
    </main>
  );
};

export default ProductDisplay;
