// /client/src/components/PortfolioCharts.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { type Asset } from '../services/assetService';
import { calculateDrift, calculateTotalPortfolio } from '../utils/financialMath';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Props for the PortfolioCharts component.
 */
interface PortfolioChartsProps {
  /** The list of user assets to calculate drift for. */
  assets: Asset[];
  /** The current USD to BRL exchange rate. */
  usdRate?: number;
}

/**
 * Renders a horizontal bar chart showing deviation (drift) percentages for each asset.
 * Green bars represent target weight surplus, red bars represent buy-need allocation deficits.
 *
 * @param props - Component props containing assets list and exchange rate.
 * @returns React component rendering the Chart.js visual canvas.
 */
export function PortfolioCharts({ assets, usdRate = 6 }: Readonly<PortfolioChartsProps>) {
  if (assets.length === 0) return null;

  const totalPortfolioValue = calculateTotalPortfolio(assets, usdRate);

  // --- CHART DATA ---
  const driftValues = assets.map((asset) =>
    calculateDrift(
      Number(asset.current_value),
      asset.currency,
      totalPortfolioValue,
      asset.target_percentage,
      usdRate,
    ),
  );

  const data = {
    labels: assets.map((a, idx) => {
      const val = driftValues[idx];
      return `${a.name} ${val < 0 ? '(-)' : '(+)'}`;
    }),
    datasets: [
      {
        label: 'Deviation %',
        data: driftValues,
        backgroundColor: driftValues.map((val) => (val < 0 ? '#d32f2f' : '#047857')),
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
          label: function (context: TooltipItem<'bar'>) {
            const val = context.parsed.x;
            if (val === null) return 'No Data';
            const status = val < 0 ? 'Buy needed (-)' : 'Surplus (+)';
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
          callback: function (value: string | number) {
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
            <span style={{ color: 'var(--app-danger-color)', fontWeight: 'bold' }}>
              Red bars (-)
            </span>{' '}
            mean you need to buy.{' '}
            <span
              style={{
                color: 'var(--app-success-color)',
                fontWeight: 'bold',
              }}
            >
              Green bars (+)
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
