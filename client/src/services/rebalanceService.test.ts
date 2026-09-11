import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import rebalanceService from './rebalanceService';

vi.mock('./api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('rebalanceService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should post amount and mainCurrency to /rebalance and return response data', async () => {
    const mockResponse = {
      contribution: 1000,
      mainCurrency: 'BRL',
      rateUsed: 5.5,
      suggestions: [
        {
          assetId: 1,
          name: 'Asset A',
          currency: 'BRL',
          currentPercentage: '0.00',
          targetPercentage: 100,
          amountToBuy: 1000,
        },
      ],
    };

    vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

    const result = await rebalanceService.calculate(1000, 'BRL');

    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith('/rebalance', {
      amount: 1000,
      mainCurrency: 'BRL',
    });
  });
});
