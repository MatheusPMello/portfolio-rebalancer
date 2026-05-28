import { calculateRebalancePlan } from './rebalanceService.js';
import { type AssetRecord } from '../models/Asset.js';

describe('Rebalance Service Logic', () => {
  // --- SCENARIO 1: The Basics ---
  test('should correct an underweight asset', () => {
    // 1. SETUP: Define the scenario
    const contribution = 1000;
    const rate = 1; // Simplify math for this test
    const currency = 'BRL';

    const assets: AssetRecord[] = [
      // Asset A is perfect (50% target, has 5000)
      {
        id: 1,
        user_id: 1,
        name: 'Safe Asset',
        current_value: 5000,
        target_percentage: 50,
        currency: 'BRL',
      },
      // Asset B is empty (50% target, has 0) -> It needs money.
      {
        id: 2,
        user_id: 1,
        name: 'Risky Asset',
        current_value: 0,
        target_percentage: 50,
        currency: 'BRL',
      },
    ];

    // 2. ACT: Run the function
    const result = calculateRebalancePlan(contribution, assets, rate, currency);

    // 3. ASSERT: Check the result
    expect(result.length).toBe(1); // Should only suggest buying Asset B
    expect(result[0].name).toBe('Risky Asset');
    expect(result[0].amountToBuy).toBe(1000);
  });

  // --- SCENARIO 2: Currency Conversion ---
  test('should handle USD assets correctly', () => {
    // Contribute R$ 600. The dollar is R$ 6.00.
    const contribution = 600;
    const rate = 6;
    const currency = 'BRL';

    const assets: AssetRecord[] = [
      // Target 100%, currently 0. It is in USD.
      {
        id: 1,
        user_id: 1,
        name: 'Apple Stock',
        current_value: 0,
        target_percentage: 100,
        currency: 'USD',
      },
    ];

    const result = calculateRebalancePlan(contribution, assets, rate, currency);

    // Logic:
    // Allocate R$ 600 to Apple.
    // But Apple is USD. So we divide by 6.00.
    // Result should be $100 USD.

    expect(result[0].amountToBuy).toBe(100);
    expect(result[0].currency).toBe('USD');
  });

  // --- SCENARIO 3: The "Future Weight" Logic ---
  test('should reduce buy amount by current holding value', () => {
    // ARRANGE
    const contribution = 10000;
    const rate = 1;
    const currency = 'BRL';

    const assets: AssetRecord[] = [
      {
        id: 1,
        user_id: 1,
        name: 'Apple',
        current_value: 800,
        target_percentage: 50,
        currency: 'BRL',
      },
      {
        id: 2,
        user_id: 1,
        name: 'Google',
        current_value: 200,
        target_percentage: 50,
        currency: 'BRL',
      },
    ];

    // ACT
    const result = calculateRebalancePlan(contribution, assets, rate, currency);

    // ASSERT
    const applePlan = result.find((a) => a.name === 'Apple');
    const googlePlan = result.find((a) => a.name === 'Google');

    expect(applePlan).toBeDefined();
    expect(googlePlan).toBeDefined();
    expect(applePlan!.amountToBuy).toBe(4700);
    expect(googlePlan!.amountToBuy).toBe(5300);
  });
});
