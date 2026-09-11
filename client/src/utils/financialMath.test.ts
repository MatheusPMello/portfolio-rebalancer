// client/src/utils/financialMath.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateDrift,
  calculateTotalPortfolio,
  calculateCurrencySubtotals,
  calculateAssetAllocation,
} from './financialMath';
import { type Asset } from '../services/assetService';

describe('financialMath utilities', () => {
  const MOCK_RATE = 5; // 1 USD = 5 BRL for clean testing math

  describe('calculateDrift', () => {
    it('calculates correct negative drift for underweight BRL asset', () => {
      // Total: 1000 BRL, Asset: 100 BRL (10%), Target: 20% -> Drift: -10%
      const result = calculateDrift(100, 'BRL', 1000, 20, MOCK_RATE);
      expect(result).toBe(-10);
    });

    it('calculates correct positive drift for overweight BRL asset (surplus)', () => {
      // Total: 1000 BRL, Asset: 300 BRL (30%), Target: 20% -> Drift: +10%
      const result = calculateDrift(300, 'BRL', 1000, 20, MOCK_RATE);
      expect(result).toBe(10);
    });

    it('calculates 0 drift when asset is exactly on target', () => {
      // Total: 1000 BRL, Asset: 250 BRL (25%), Target: 25% -> Drift: 0%
      const result = calculateDrift(250, 'BRL', 1000, 25, MOCK_RATE);
      expect(result).toBe(0);
    });

    it('calculates correct drift for USD asset converted to BRL', () => {
      // Total: 1000 BRL, Asset: $20 USD * 5 = 100 BRL (10%), Target: 15% -> Drift: -5%
      const result = calculateDrift(20, 'USD', 1000, 15, MOCK_RATE);
      expect(result).toBe(-5);
    });

    it('returns 0 if total portfolio value is 0', () => {
      const result = calculateDrift(100, 'BRL', 0, 20, MOCK_RATE);
      expect(result).toBe(0);
    });
  });

  describe('calculateTotalPortfolio', () => {
    it('calculates total correctly for USD asset with exchange conversion', () => {
      const mockAssets = [
        { current_value: 100, currency: 'USD', target_percentage: 50 } as Asset,
      ];
      const total = calculateTotalPortfolio(mockAssets, 5);
      expect(total).toBe(500);
    });

    it('calculates total correctly for pure BRL assets', () => {
      const mockAssets = [
        { current_value: 200, currency: 'BRL', target_percentage: 50 } as Asset,
        { current_value: 300, currency: 'BRL', target_percentage: 50 } as Asset,
      ];
      const total = calculateTotalPortfolio(mockAssets, 5);
      expect(total).toBe(500);
    });

    it('calculates total correctly for mixed USD and BRL assets', () => {
      const mockAssets = [
        { current_value: 200, currency: 'BRL', target_percentage: 50 } as Asset,
        { current_value: 100, currency: 'USD', target_percentage: 50 } as Asset, // 100 * 5 = 500
      ];
      const total = calculateTotalPortfolio(mockAssets, 5);
      expect(total).toBe(700);
    });

    it('returns 0 for an empty assets list', () => {
      expect(calculateTotalPortfolio([], 5)).toBe(0);
    });

    it('skips non-numeric or invalid current_value values gracefully', () => {
      const mockAssets = [
        { current_value: 200, currency: 'BRL', target_percentage: 50 } as Asset,
        {
          current_value: 'invalid' as unknown as number,
          currency: 'BRL',
          target_percentage: 50,
        } as Asset,
      ];
      expect(calculateTotalPortfolio(mockAssets, 5)).toBe(200);
    });
  });

  describe('calculateCurrencySubtotals', () => {
    it('calculates separate BRL and USD totals and estimated BRL total', () => {
      const mockAssets = [
        { current_value: 250, currency: 'BRL', target_percentage: 50 } as Asset,
        { current_value: 750, currency: 'BRL', target_percentage: 50 } as Asset,
        { current_value: 100, currency: 'USD', target_percentage: 50 } as Asset, // 100 * 6 = 600
      ];
      const result = calculateCurrencySubtotals(mockAssets, 6);
      expect(result.totalBRL).toBe(1000);
      expect(result.totalUSD).toBe(100);
      expect(result.estimatedTotalInBRL).toBe(1600);
    });

    it('handles empty assets list', () => {
      const result = calculateCurrencySubtotals([], 6);
      expect(result.totalBRL).toBe(0);
      expect(result.totalUSD).toBe(0);
      expect(result.estimatedTotalInBRL).toBe(0);
    });

    it('handles BRL only assets', () => {
      const mockAssets = [
        { current_value: 500, currency: 'BRL', target_percentage: 100 } as Asset,
      ];
      const result = calculateCurrencySubtotals(mockAssets, 6);
      expect(result.totalBRL).toBe(500);
      expect(result.totalUSD).toBe(0);
      expect(result.estimatedTotalInBRL).toBe(500);
    });

    it('handles USD only assets', () => {
      const mockAssets = [
        { current_value: 50, currency: 'USD', target_percentage: 100 } as Asset,
      ];
      const result = calculateCurrencySubtotals(mockAssets, 6);
      expect(result.totalBRL).toBe(0);
      expect(result.totalUSD).toBe(50);
      expect(result.estimatedTotalInBRL).toBe(300);
    });
  });

  describe('calculateAssetAllocation', () => {
    it('calculates current percentage allocation for BRL asset', () => {
      const pct = calculateAssetAllocation(250, 'BRL', 1000, 5);
      expect(pct).toBe(25);
    });

    it('calculates current percentage allocation for USD asset converted to BRL', () => {
      // 50 USD * 5 = 250 BRL, 250 / 1000 = 25%
      const pct = calculateAssetAllocation(50, 'USD', 1000, 5);
      expect(pct).toBe(25);
    });

    it('returns 0 if total portfolio value is 0 or negative', () => {
      expect(calculateAssetAllocation(100, 'BRL', 0, 5)).toBe(0);
      expect(calculateAssetAllocation(100, 'BRL', -100, 5)).toBe(0);
    });
  });
});
