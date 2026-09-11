import axios from 'axios';
import { createExchangeRateService } from './exchangeRateService.js';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExchangeRateService', () => {
  const silentLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return exchange rate from API on initial call', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { rates: { BRL: 5.85 } },
    });

    const service = createExchangeRateService({
      apiUrl: 'https://api.test.com/rate',
      logger: silentLogger,
    });

    const rate = await service.getUsdToBrlRate();

    expect(rate).toBe(5.85);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.test.com/rate', { timeout: 5000 });
  });

  it('should serve from cache within cache duration without calling API again', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { rates: { BRL: 5.5 } },
    });

    const service = createExchangeRateService({
      cacheDurationMs: 60000,
      logger: silentLogger,
    });

    const rate1 = await service.getUsdToBrlRate();
    const rate2 = await service.getUsdToBrlRate();

    expect(rate1).toBe(5.5);
    expect(rate2).toBe(5.5);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should refetch from API when cache expires', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { rates: { BRL: 5.1 } } })
      .mockResolvedValueOnce({ data: { rates: { BRL: 5.9 } } });

    const service = createExchangeRateService({
      cacheDurationMs: 100, // 100ms TTL
      logger: silentLogger,
    });

    const rate1 = await service.getUsdToBrlRate();
    expect(rate1).toBe(5.1);

    // Wait for cache to expire
    await new Promise((resolve) => setTimeout(resolve, 150));

    const rate2 = await service.getUsdToBrlRate();
    expect(rate2).toBe(5.9);
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('should coalesce concurrent calls into a single in-flight API request', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedAxios.get.mockImplementationOnce(() => pendingPromise as any);

    const service = createExchangeRateService({
      logger: silentLogger,
    });

    // Fire 3 simultaneous calls
    const p1 = service.getUsdToBrlRate();
    const p2 = service.getUsdToBrlRate();
    const p3 = service.getUsdToBrlRate();

    resolvePromise!({ data: { rates: { BRL: 6.25 } } });

    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);

    expect(r1).toBe(6.25);
    expect(r2).toBe(6.25);
    expect(r3).toBe(6.25);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should fallback to stale cache when API request fails after initial success', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { rates: { BRL: 5.75 } } })
      .mockRejectedValueOnce(new Error('Network Timeout'));

    const service = createExchangeRateService({
      cacheDurationMs: 50,
      logger: silentLogger,
    });

    const rate1 = await service.getUsdToBrlRate();
    expect(rate1).toBe(5.75);

    // Wait for cache to expire
    await new Promise((resolve) => setTimeout(resolve, 80));

    const rate2 = await service.getUsdToBrlRate();
    expect(rate2).toBe(5.75); // Stale cache served
  });

  it('should fallback to hardcoded rate when API fails and no cache exists', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Down'));

    const service = createExchangeRateService({
      fallbackRate: 6.0,
      logger: silentLogger,
    });

    const rate = await service.getUsdToBrlRate();
    expect(rate).toBe(6.0);
  });

  it('should use fallback when API returns invalid non-numeric rate', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { rates: { BRL: 'not-a-number' } },
    });

    const service = createExchangeRateService({
      fallbackRate: 6.0,
      logger: silentLogger,
    });

    const rate = await service.getUsdToBrlRate();
    expect(rate).toBe(6.0);
  });

  it('should invalidate cache when invalidateCache is called', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { rates: { BRL: 5.2 } } })
      .mockResolvedValueOnce({ data: { rates: { BRL: 5.4 } } });

    const service = createExchangeRateService({
      cacheDurationMs: 60000,
      logger: silentLogger,
    });

    const rate1 = await service.getUsdToBrlRate();
    expect(rate1).toBe(5.2);

    service.invalidateCache();

    const rate2 = await service.getUsdToBrlRate();
    expect(rate2).toBe(5.4);
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });
});
