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

  const ESTIMATED_USD_RATE = 6;

  const totalPortfolioValueBrl = assets.reduce((sum, asset) => {
    const val = Number(asset.current_value);
    return sum + (asset.currency === 'USD' ? val * ESTIMATED_USD_RATE : val);
  }, 0);


  const getDriftData = (asset: Asset) => {
    if (totalPortfolioValueBrl === 0) return 0;
    
    const val = Number(asset.current_value);
    const valInBrl = asset.currency === 'USD' ? val * ESTIMATED_USD_RATE : val;
    const actualPercentage = (valInBrl / totalPortfolioValueBrl) * 100;
    
    return actualPercentage - asset.target_percentage;
  };

  // --- PREPARE CHART DATA ---
  const driftValues = assets.map(getDriftData);
  
  const data = {
    labels: assets.map((a) => a.name),
    datasets: [
      {
        label: 'Deviation %',
        data: driftValues,
        backgroundColor: driftValues.map((val) => 
          val < 0 ? 'rgba(220, 53, 69, 0.8)' : 'rgba(25, 135, 84, 0.8)'
        ),
        borderColor: driftValues.map((val) => 
          val < 0 ? 'rgba(220, 53, 69, 1)' : 'rgba(25, 135, 84, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  // --- CONFIGURATION ---
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const val = context.parsed.x;
            const status = val < 0 ? 'Underweight (Buy)' : 'Overweight';
            return `${status}: ${val.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Deviation from Target (%)',
        },
        grid: {
          color: (context: any) => 
            context.tick.value === 0 ? '#333' : 'rgba(0,0,0,0.1)',
          lineWidth: (context: any) => context.tick.value === 0 ? 2 : 1,
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
            <span style={{ color: 'rgba(220, 53, 69, 1)', fontWeight: 'bold' }}>Red bars</span> mean you need to buy. 
            <span style={{ color: 'rgba(25, 135, 84, 1)', fontWeight: 'bold', marginLeft: '8px' }}>Green bars</span> mean you have enough.
          </p>
          <div style={{ height: '350px' }}>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}