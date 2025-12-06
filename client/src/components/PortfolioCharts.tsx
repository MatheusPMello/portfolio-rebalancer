// /client/src/components/PortfolioCharts.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { type Asset } from '../services/assetService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface PortfolioChartsProps {
  assets: Asset[];
}

export function PortfolioCharts({ assets }: PortfolioChartsProps) {
  if (assets.length === 0) return null;

  // --- 2. CALCULATE ACTUAL PERCENTAGES ---

  const ESTIMATED_USD_RATE = 6;

  const totalPortfolioValueBrl = assets.reduce((sum, asset) => {
    const val = Number(asset.current_value);
    return sum + (asset.currency === 'USD' ? val * ESTIMATED_USD_RATE : val);
  }, 0);

  const getActualPercentage = (asset: Asset) => {
    if (totalPortfolioValueBrl === 0) return 0;
    const val = Number(asset.current_value);
    const valInBrl = asset.currency === 'USD' ? val * ESTIMATED_USD_RATE : val;
    return (valInBrl / totalPortfolioValueBrl) * 100;
  };

  // --- 3. CHART DATA ---
  const data = {
    labels: assets.map((a) => a.name),
    datasets: [
      {
        label: 'Target %',
        data: assets.map((a) => a.target_percentage),
        backgroundColor: 'rgba(59, 59, 255, 0.7)',
        borderColor: 'rgba(59, 59, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual %',
        data: assets.map((a) => getActualPercentage(a)),
        backgroundColor: 'rgba(220, 53, 69, 0.7)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return (
              context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%'
            );
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Allocation (%)',
        },
        max: 100,
      },
    },
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card-custom">
          <h5 className="fw-bold mb-4">Allocation Comparison</h5>
          <div style={{ height: '350px' }}>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
