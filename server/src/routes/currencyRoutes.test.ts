import request from 'supertest';
import app from '../server.js';
import exchangeRateService from '../services/exchangeRateService.js';

jest.mock('../services/exchangeRateService.js', () => ({
  __esModule: true,
  default: {
    getUsdToBrlRate: jest.fn(),
    invalidateCache: jest.fn(),
  },
}));

describe('Currency Routes Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/currency/exchange-rate - should return 200 with exchange rate', async () => {
    (exchangeRateService.getUsdToBrlRate as jest.Mock).mockResolvedValueOnce(5.75);

    const response = await request(app).get('/api/currency/exchange-rate');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ rate: 5.75 });
  });

  it('GET /api/currency/exchange-rate - should return 500 with fallback rate on error', async () => {
    (exchangeRateService.getUsdToBrlRate as jest.Mock).mockRejectedValueOnce(
      new Error('API failure'),
    );

    const response = await request(app).get('/api/currency/exchange-rate');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: 'Failed to fetch exchange rate',
      rate: 6,
    });
  });
});
