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
import { calculateDrift, calculateTotalPortfolio } from '../utils/financialMath';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PortfolioChartsProps {
  assets: Asset[];
}

export function PortfolioCharts({ assets }: Readonly<PortfolioChartsProps>) {
  if (assets.length === 0) return null;

  const ESTIMATED_USD_RATE = 6;

  const totalPortfolioValue = calculateTotalPortfolio(assets, ESTIMATED_USD_RATE);

  // --- CHART DATA ---
  const driftValues = assets.map((asset) =>
    calculateDrift(
      Number(asset.current_value),
      asset.currency,
      totalPortfolioValue,
      asset.target_percentage,
      ESTIMATED_USD_RATE,
    ),
  );

  const data = {
    labels: assets.map((a) => a.name),
    datasets: [
      {
        label: 'Deviation %',
        data: driftValues,
        backgroundColor: driftValues.map((val) => (val < 0 ? '#FF8080' : '#20C997')),
        borderWidth: 0,
        borderRadius: 6,
        barThickness: 25,
        borderSkipped: false,
      },
    ],
  };

  // --- CONFIGURATION ---
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e1e',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            const val = context.parsed.x;
            const status = val < 0 ? 'Buy needed' : 'Surplus';
            return ` ${status}: ${val.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
          borderDash: [5, 5],
          drawBorder: false,
        },
        ticks: {
          color: '#888',
          callback: function (value: any) {
            return value + '%';
          },
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            weight: 'bold' as const,
            size: 13,
          },
          color: '#444',
        },
      },
    },
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card shadow-sm p-4">
          <h5 className="fw-bold mb-4">Portfolio Drift</h5>
          <p className="text-muted small mb-3">
            <span style={{ color: 'rgba(220, 53, 69, 1)', fontWeight: 'bold' }}>Red bars</span> mean
            you need to buy.{' '}
            <span
              style={{
                color: 'rgba(25, 135, 84, 1)',
                fontWeight: 'bold',
                //marginLeft: '8px',
              }}
            >
              Green bars
            </span>{' '}
            mean you have enough.
          </p>
          <div style={{ height: '350px' }}>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
