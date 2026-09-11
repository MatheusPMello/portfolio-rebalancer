import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PortfolioCharts } from './PortfolioCharts';
import { type Asset } from '../services/assetService';

vi.mock('react-chartjs-2', () => ({
  Bar: ({ data }: { data: { labels?: (string | number)[] } }) => (
    <div data-testid="mock-bar-chart">{JSON.stringify(data.labels)}</div>
  ),
}));

describe('PortfolioCharts Component', () => {
  it('returns null when assets array is empty', () => {
    const { container } = render(<PortfolioCharts assets={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders chart with labels when assets are provided', () => {
    const mockAssets: Asset[] = [
      {
        id: 1,
        user_id: 1,
        name: 'Bitcoin',
        current_value: 1000,
        currency: 'USD',
        target_percentage: 50,
      },
      {
        id: 2,
        user_id: 1,
        name: 'Real Estate Fund',
        current_value: 5000,
        currency: 'BRL',
        target_percentage: 50,
      },
    ];

    render(<PortfolioCharts assets={mockAssets} usdRate={5} />);

    expect(screen.getByText('Portfolio Drift')).toBeInTheDocument();
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    expect(screen.getByText(/Bitcoin/)).toBeInTheDocument();
  });
});
