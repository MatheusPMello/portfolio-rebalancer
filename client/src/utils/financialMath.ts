// client/src/utils/financialMath.ts

export function calculateDrift(
  currentValue: number,
  currency: string,
  totalPortfolioValue: number,
  targetPercentage: number,
  usdRate: number
): number {
  if (totalPortfolioValue === 0) return 0;

  // 1. Convert to BRL if needed
  const valInBrl = currency === 'USD' ? currentValue * usdRate : currentValue;

  // 2. Calculate current allocation %
  const currentAllocation = (valInBrl / totalPortfolioValue) * 100;

  // 3. Return the difference
  return currentAllocation - targetPercentage;
}