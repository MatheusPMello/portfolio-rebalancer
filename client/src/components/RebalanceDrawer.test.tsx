import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RebalanceDrawer } from './RebalanceDrawer';
import rebalanceService from '../services/rebalanceService';

vi.mock('../services/rebalanceService', () => ({
  default: {
    calculate: vi.fn(),
  },
}));

describe('RebalanceDrawer Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input step with amount input and currency toggle', () => {
    render(<RebalanceDrawer show={true} onClose={onClose} />);

    expect(screen.getByText('Rebalance Portfolio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(screen.getByText('Reais (BRL)')).toBeInTheDocument();
    expect(screen.getByText('Dollars (USD)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calculate Action Plan/i })).toBeDisabled();
  });

  it('toggles currency selection between BRL and USD', () => {
    render(<RebalanceDrawer show={true} onClose={onClose} />);

    const usdBtn = screen.getByText('Dollars (USD)').closest('button')!;
    fireEvent.click(usdBtn);
    expect(usdBtn).toHaveClass('btn-primary');

    const brlBtn = screen.getByText('Reais (BRL)').closest('button')!;
    fireEvent.click(brlBtn);
    expect(brlBtn).toHaveClass('btn-primary');
  });

  it('submits calculation, displays recommended trades and calculates subtotals', async () => {
    vi.mocked(rebalanceService.calculate).mockResolvedValueOnce({
      contribution: 1500,
      mainCurrency: 'BRL',
      rateUsed: 5.0,
      suggestions: [
        {
          assetId: 1,
          name: 'Tesouro Selic',
          currency: 'BRL',
          currentPercentage: '20.00',
          targetPercentage: 50,
          amountToBuy: 1000,
        },
        {
          assetId: 2,
          name: 'S&P 500',
          currency: 'USD',
          currentPercentage: '10.00',
          targetPercentage: 50,
          amountToBuy: 100, // $100 USD
        },
      ],
    });

    render(<RebalanceDrawer show={true} onClose={onClose} />);

    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '1500' } });

    const calcBtn = screen.getByRole('button', { name: /Calculate Action Plan/i });
    expect(calcBtn).not.toBeDisabled();
    fireEvent.click(calcBtn);

    await waitFor(() => {
      expect(screen.getByText('Your Action Plan')).toBeInTheDocument();
      expect(screen.getByText('Tesouro Selic')).toBeInTheDocument();
      expect(screen.getByText('S&P 500')).toBeInTheDocument();
      expect(screen.getByText('Total Allocation')).toBeInTheDocument();
    });

    // Check Done button closes drawer
    fireEvent.click(screen.getByRole('button', { name: /Done/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays "Perfectly Balanced!" message when no trades are suggested', async () => {
    vi.mocked(rebalanceService.calculate).mockResolvedValueOnce({
      contribution: 1000,
      mainCurrency: 'BRL',
      rateUsed: 5.0,
      suggestions: [],
    });

    render(<RebalanceDrawer show={true} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
    fireEvent.click(screen.getByRole('button', { name: /Calculate Action Plan/i }));

    await waitFor(() => {
      expect(screen.getByText('Perfectly Balanced!')).toBeInTheDocument();
    });
  });

  it('displays error alert on calculation failure', async () => {
    vi.mocked(rebalanceService.calculate).mockRejectedValueOnce(new Error('Calculation failed'));

    render(<RebalanceDrawer show={true} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /Calculate Action Plan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to calculate/i)).toBeInTheDocument();
    });
  });

  it('resets to input step when reopening drawer', async () => {
    vi.mocked(rebalanceService.calculate).mockResolvedValueOnce({
      contribution: 1000,
      mainCurrency: 'BRL',
      rateUsed: 5.0,
      suggestions: [],
    });

    const { rerender } = render(<RebalanceDrawer show={true} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
    fireEvent.click(screen.getByRole('button', { name: /Calculate Action Plan/i }));

    await waitFor(() => {
      expect(screen.getByText('Perfectly Balanced!')).toBeInTheDocument();
    });

    // Close drawer
    rerender(<RebalanceDrawer show={false} onClose={onClose} />);

    // Reopen drawer
    rerender(<RebalanceDrawer show={true} onClose={onClose} />);

    expect(screen.getByText('Rebalance Portfolio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toHaveValue(null);
  });
});
