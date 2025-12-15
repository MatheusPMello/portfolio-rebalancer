// client/src/utils/financialMath.test.ts
import { calculateDrift, calculateTotalPortfolio } from './financialMath';

describe('calculateDrift', () => {
  const MOCK_RATE = 5; // Easier math for testing

  it('calculates correct drift for BRL asset', () => {
    // Scenario: Total Portfolio is 1000. Asset is 100 (10%). Target is 20%.
    // Drift should be -10%.
    const result = calculateDrift(100, 'BRL', 1000, 20, MOCK_RATE);
    expect(result).toBe(-10);
  });

  it('calculates correct drift for USD asset', () => {
    // Scenario: Total Portfolio is 1000 BRL.
    // Asset is $20 USD. Rate is 5.
    // 20 * 5 = 100 BRL (which is 10% of portfolio).
    // Target is 15%.
    // Drift should be -5%.
    const result = calculateDrift(20, 'USD', 1000, 15, MOCK_RATE);
    expect(result).toBe(-5);
  });

  it('returns 0 if total portfolio value is 0', () => {
    const result = calculateDrift(100, 'BRL', 0, 20, MOCK_RATE);
    expect(result).toBe(0);
  });

  test('calculates total correctly with USD conversion', () => {
   const mockAssets = [
     { 
       current_value: '100',
       currency: 'USD',
       target_percentage: 10 
     } as any
   ];

   const total = calculateTotalPortfolio(mockAssets, 5);
   expect(total).toBe(500);
  });
});