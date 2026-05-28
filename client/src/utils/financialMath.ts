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
