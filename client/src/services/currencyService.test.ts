import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import { fetchExchangeRate } from './currencyService';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('currencyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return valid rate from /currency/exchange-rate', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { rate: 5.82 },
    });

    const rate = await fetchExchangeRate();

    expect(rate).toBe(5.82);
    expect(api.get).toHaveBeenCalledWith('/currency/exchange-rate');
  });

  it('should return fallback 6 when rate is non-numeric', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { rate: 'invalid' },
    });

    const rate = await fetchExchangeRate();
    expect(rate).toBe(6);
  });

  it('should return fallback 6 when rate is <= 0', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { rate: -1 },
    });

    const rate = await fetchExchangeRate();
    expect(rate).toBe(6);
  });

  it('should return fallback 6 when request throws an error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

    const rate = await fetchExchangeRate();
    expect(rate).toBe(6);
  });
});
