'use strict';

const axios = require('axios');

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULTS = {
  apiUrl: 'https://api.frankfurter.app/latest?from=USD&to=BRL',
  fallbackRate: 6,
  cacheDurationMs: 60 * 60 * 1000, // 1 hour
  timeoutMs: 5_000, // 5 seconds
};

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates an exchange rate service with caching, request coalescing,
 * layered fallback, and injectable dependencies.
 *
 * @param {object}   [opts]
 * @param {string}   [opts.apiUrl]           - External API endpoint
 * @param {number}   [opts.fallbackRate]     - Hardcoded last-resort rate
 * @param {number}   [opts.cacheDurationMs]  - How long a cached value is valid
 * @param {number}   [opts.timeoutMs]        - HTTP request timeout
 * @param {object}   [opts.logger]           - Logger with .info / .warn / .error
 * @returns {{ getUsdToBrlRate: () => Promise<number> }}
 */
function createExchangeRateService(opts = {}) {
  const config = { ...DEFAULTS, ...opts };
  const logger = config.logger ?? console;

  // ── Private state (fully encapsulated — no module-level globals) ──────────
  let cachedRate = null;
  let lastFetchTime = 0;
  let inflightRequest = null; // Promise coalescing: avoids duplicate requests

  // ── Private helpers ───────────────────────────────────────────────────────

  function isCacheValid(now) {
    return cachedRate !== null && now - lastFetchTime < config.cacheDurationMs;
  }

  async function fetchFromApi() {
    const response = await axios.get(config.apiUrl, {
      timeout: config.timeoutMs,
    });

    const rate = Number.parseFloat(response.data?.rates?.BRL);

    if (Number.isNaN(rate) || rate <= 0) {
      throw new TypeError(`Invalid rate value received: ${response.data?.USDBRL?.bid}`);
    }

    return rate;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Returns the current USD→BRL exchange rate.
   * Resolution order:
   *   1. Valid cache (within TTL)
   *   2. Live API response (with request coalescing)
   *   3. Stale cache (expired but available — preferred over hardcoded value)
   *   4. Hardcoded fallback constant
   *
   * @returns {Promise<number>}
   */
  async function getUsdToBrlRate() {
    const now = Date.now();

    // 1. Serve from valid cache immediately — no I/O needed
    if (isCacheValid(now)) {
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
      } catch (err) {
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

  /**
   * Invalidates the cache, forcing the next call to hit the API.
   * Useful for testing or manual refresh triggers.
   */
  function invalidateCache() {
    cachedRate = null;
    lastFetchTime = 0;
    logger.info('[ExchangeRate] Cache manually invalidated');
  }

  return { getUsdToBrlRate, invalidateCache };
}

// ─── Singleton export (matches original module interface) ─────────────────────

// Export a ready-to-use singleton with default config.
// For testing or custom config, use createExchangeRateService() directly.
const exchangeRateService = createExchangeRateService();

module.exports = exchangeRateService;
module.exports.createExchangeRateService = createExchangeRateService;
