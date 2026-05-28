import axios from 'axios';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULTS = {
  apiUrl: 'https://api.frankfurter.app/latest?from=USD&to=BRL',
  fallbackRate: 6,
  cacheDurationMs: 60 * 60 * 1000, // 1 hour
  timeoutMs: 5_000, // 5 seconds
};

export interface ExchangeRateServiceConfig {
  apiUrl?: string;
  fallbackRate?: number;
  cacheDurationMs?: number;
  timeoutMs?: number;
  logger?: {
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
  };
}

export interface ExchangeRateService {
  getUsdToBrlRate: () => Promise<number>;
  invalidateCache: () => void;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates an exchange rate service with caching, request coalescing,
 * layered fallback, and injectable dependencies.
 */
export function createExchangeRateService(opts: ExchangeRateServiceConfig = {}): ExchangeRateService {
  const config = { ...DEFAULTS, ...opts };
  const logger = config.logger ?? console;

  // ── Private state (fully encapsulated — no module-level globals) ──────────
  let cachedRate: number | null = null;
  let lastFetchTime = 0;
  let inflightRequest: Promise<number> | null = null; // Promise coalescing

  // ── Private helpers ───────────────────────────────────────────────────────

  function isCacheValid(now: number): boolean {
    return cachedRate !== null && now - lastFetchTime < config.cacheDurationMs;
  }

  async function fetchFromApi(): Promise<number> {
    const response = await axios.get<{ rates?: { BRL?: number } }>(config.apiUrl, {
      timeout: config.timeoutMs,
    });

    const rate = Number.parseFloat(response.data?.rates?.BRL?.toString() ?? '');

    if (Number.isNaN(rate) || rate <= 0) {
      throw new TypeError(`Invalid rate value received: ${response.data?.rates?.BRL}`);
    }

    return rate;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  async function getUsdToBrlRate(): Promise<number> {
    const now = Date.now();

    // 1. Serve from valid cache immediately — no I/O needed
    if (isCacheValid(now) && cachedRate !== null) {
      logger.info(
        `[ExchangeRate] Serving from cache (age: ${Math.round((now - lastFetchTime) / 1000)}s): R$ ${cachedRate}`,
      );
      return cachedRate;
    }

    // 2. Coalesce concurrent requests: if a fetch is already in-flight,
    //    all callers wait for the same promise instead of spawning duplicates.
    if (inflightRequest) {
      logger.info('[ExchangeRate] Request already in-flight — awaiting shared result');
      return inflightRequest;
    }

    inflightRequest = (async () => {
      try {
        logger.info('[ExchangeRate] Fetching real-time rate from API...');
        const rate = await fetchFromApi();

        // Update cache on success
        cachedRate = rate;
        lastFetchTime = Date.now();

        logger.info(`[ExchangeRate] Rate updated: R$ ${rate}`);
        return rate;
      } catch (err: any) {
        // 3. API failed — prefer stale cache over hardcoded constant
        if (cachedRate !== null) {
          const staleAgeMin = Math.round((now - lastFetchTime) / 60_000);
          logger.warn(
            `[ExchangeRate] API error — using stale cache (${staleAgeMin}m old): R$ ${cachedRate}. Reason: ${err.message}`,
          );
          return cachedRate;
        }

        // 4. No cache at all — last resort
        logger.error(
          `[ExchangeRate] API error and no cache available — using hardcoded fallback R$ ${config.fallbackRate}. Reason: ${err.message}`,
        );
        return config.fallbackRate;
      } finally {
        // Always release the in-flight lock so future calls retry normally
        inflightRequest = null;
      }
    })();

    return inflightRequest;
  }

  function invalidateCache(): void {
    cachedRate = null;
    lastFetchTime = 0;
    logger.info('[ExchangeRate] Cache manually invalidated');
  }

  return { getUsdToBrlRate, invalidateCache };
}

// ─── Singleton export (matches original module interface) ─────────────────────

const exchangeRateService = createExchangeRateService();
export default exchangeRateService;
