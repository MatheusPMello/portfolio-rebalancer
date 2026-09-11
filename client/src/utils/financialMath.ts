// client/src/utils/financialMath.ts
import { type Asset } from '../services/assetService';

/**
 * Calculates the deviation (drift) of an asset's current allocation compared to its target percentage.
 *
 * @param currentValue - The current value of the asset in its native currency.
 * @param currency - The currency code of the asset (e.g., 'USD', 'BRL').
 * @param totalPortfolioValue - The total value of the portfolio normalized to BRL.
 * @param targetPercentage - The target weight percentage of this asset (e.g., 25).
 * @param usdRate - The current USD to BRL exchange rate.
 * @returns The difference between the current allocation percentage and the target percentage.
 */
export function calculateDrift(
  currentValue: number,
  currency: string,
  totalPortfolioValue: number,
  targetPercentage: number,
  usdRate: number,
): number {
  if (totalPortfolioValue === 0) return 0;

  // 1. Convert to BRL if needed
  const valInBrl = currency === 'USD' ? currentValue * usdRate : currentValue;

  // 2. Calculate current allocation %
  const currentAllocation = (valInBrl / totalPortfolioValue) * 100;

  // 3. Return the difference
  return currentAllocation - targetPercentage;
}

/**
 * Calculates the total value of all assets in the portfolio, normalized to BRL.
 *
 * @param assets - An array of user assets.
 * @param usdRate - The current USD to BRL exchange rate.
 * @returns The total portfolio valuation in BRL.
 */
export function calculateTotalPortfolio(assets: Asset[], usdRate: number): number {
  return assets.reduce((sum, asset) => {
    const val = Number(asset.current_value);
    if (Number.isNaN(val)) return sum;
    const convertedValue = asset.currency === 'USD' ? val * usdRate : val;

    return sum + convertedValue;
  }, 0);
}

export interface CurrencySubtotals {
  totalBRL: number;
  totalUSD: number;
  estimatedTotalInBRL: number;
}

/**
 * Calculates currency subtotals (BRL and USD) and estimated total portfolio valuation in BRL.
 *
 * @param assets - An array of user assets.
 * @param usdRate - The current USD to BRL exchange rate.
 * @returns Object containing totalBRL, totalUSD, and estimatedTotalInBRL.
 */
export function calculateCurrencySubtotals(assets: Asset[], usdRate: number): CurrencySubtotals {
  let totalBRL = 0;
  let totalUSD = 0;

  for (const asset of assets) {
    const val = Number(asset.current_value);
    if (!Number.isNaN(val)) {
      if (asset.currency === 'USD') {
        totalUSD += val;
      } else {
        totalBRL += val;
      }
    }
  }

  const estimatedTotalInBRL = totalBRL + totalUSD * usdRate;

  return { totalBRL, totalUSD, estimatedTotalInBRL };
}

/**
 * Calculates the current percentage allocation of an asset within the portfolio.
 *
 * @param currentValue - The current value of the asset.
 * @param currency - The currency of the asset.
 * @param totalPortfolioValue - Total portfolio value in BRL.
 * @param usdRate - Current USD to BRL exchange rate.
 * @returns Current allocation percentage.
 */
export function calculateAssetAllocation(
  currentValue: number,
  currency: string,
  totalPortfolioValue: number,
  usdRate: number,
): number {
  if (totalPortfolioValue <= 0) return 0;
  const valInBrl = currency === 'USD' ? currentValue * usdRate : currentValue;
  return (valInBrl / totalPortfolioValue) * 100;
}

