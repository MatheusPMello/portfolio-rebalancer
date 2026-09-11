import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';
import { Asset } from '../models/Asset.js';
import exchangeRateService from '../services/exchangeRateService.js';

jest.mock('../models/Asset.js');
jest.mock('../services/exchangeRateService.js', () => ({
  __esModule: true,
  default: {
    getUsdToBrlRate: jest.fn(),
    invalidateCache: jest.fn(),
  },
}));

describe('Rebalance Routes Integration Tests', () => {
  const secret = 'test-secret';
  let token: string;

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
    token = jwt.sign({ id: 1, email: 'user@example.com' }, secret);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/rebalance - should return 401 when unauthenticated', async () => {
    const response = await request(app)
      .post('/api/rebalance')
      .send({ amount: 1000, mainCurrency: 'BRL' });

    expect(response.status).toBe(401);
  });

  it('POST /api/rebalance - should return 400 when amount is missing or <= 0', async () => {
    const response = await request(app)
      .post('/api/rebalance')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 0, mainCurrency: 'BRL' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('valid contribution amount');
  });

  it('POST /api/rebalance - should return 400 when user has no assets', async () => {
    (exchangeRateService.getUsdToBrlRate as jest.Mock).mockResolvedValueOnce(5.5);
    (Asset.findByUserId as jest.Mock).mockResolvedValueOnce([]);

    const response = await request(app)
      .post('/api/rebalance')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1000, mainCurrency: 'BRL' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Add assets before rebalancing.');
  });

  it('POST /api/rebalance - should return 200 with calculated plan', async () => {
    (exchangeRateService.getUsdToBrlRate as jest.Mock).mockResolvedValueOnce(5.0);
    (Asset.findByUserId as jest.Mock).mockResolvedValueOnce([
      {
        id: 1,
        user_id: 1,
        name: 'Asset A',
        current_value: 0,
        target_percentage: 100,
        currency: 'BRL',
      },
    ]);

    const response = await request(app)
      .post('/api/rebalance')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1000, mainCurrency: 'BRL' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('suggestions');
    expect(response.body.contribution).toBe(1000);
    expect(response.body.mainCurrency).toBe('BRL');
    expect(response.body.rateUsed).toBe(5.0);
    expect(response.body.suggestions).toHaveLength(1);
    expect(response.body.suggestions[0].name).toBe('Asset A');
    expect(response.body.suggestions[0].amountToBuy).toBe(1000);
  });

  it('POST /api/rebalance - should return 500 when database throws an error', async () => {
    (exchangeRateService.getUsdToBrlRate as jest.Mock).mockResolvedValueOnce(5.0);
    (Asset.findByUserId as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

    const response = await request(app)
      .post('/api/rebalance')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1000, mainCurrency: 'BRL' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Server error');
  });
});
