import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Import Filler for the background gradient
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// --- This registration is CRUCIAL for Chart.js to work in React ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Define the types for our component's props ---
interface ForecastData {
  date: string;
  prediction: number;
}

interface ChartProps {
  data: ForecastData[];
  productName: string;
}

const ForecastChart = ({ data, productName }: ChartProps) => {
  // --- Configure Chart Options ---
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill the container height
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `7-Day Sales Forecast: ${productName.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
        font: {
          size: 18,
        },
        color: '#333'
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start the Y-axis at 0
        ticks: {
          // Add 'units' to the Y-axis labels
          callback: function(value: string | number) {
            return value + ' units';
          }
        }
      }
    }
  };

  // --- Prepare Data in the format Chart.js expects ---
  const chartData = {
    labels: data.map((item) => item.date), // Dates for the X-axis
    datasets: [
      {
        fill: true, // This enables the background color below the line
        label: 'Predicted Sales',
        data: data.map((item) => item.prediction), // Prediction values for the Y-axis
        borderColor: '#0071ce', // Walmart Blue for the line
        backgroundColor: 'rgba(0, 113, 206, 0.4)', // A semi-transparent Walmart Blue for the fill
        tension: 0.3, // Makes the line slightly curved
      },
    ],
  };

  return (
    <div className="flex flex-col flex-1 min-h-95 bg-amber-100 rounded-2xl"> {/* Container to control chart size */}
      <Line options={options} data={chartData} />
    </div>
  );
};

export default ForecastChart;