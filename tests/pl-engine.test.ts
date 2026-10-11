import { describe, it, expect } from 'vitest';
import { calculatePlTax } from '../src/utils/tax/pl-engine';
import { plProfile } from '../src/data/tax/countries/pl';

describe('Poland Tax Engine (pl-engine)', () => {
  it('calculates 2026 taxes correctly for 100,000 PLN with statutory KUP', () => {
    const result = calculatePlTax({
      grossIncome: 100000,
      taxYear: '2026',
    });

    // Gross = 100000
    // ZUS = 100000 * 0.1371 = 13710
    // Health = (100000 - 13710) * 0.09 = 86290 * 0.09 = 7766.10
    // Total Social = 13710 + 7766.10 = 21476.10
    expect(result.totalSocialContributions).toBeCloseTo(21476.10, 1);

    // KUP deduction = 3000
    expect(result.kupDeduction).toBe(3000);

    // Taxable base before allowance = 100000 - 13710 - 3000 = 83290
    // Taxable PIT base = 83290 - 30000 = 53290
    // PIT = 53290 * 0.12 = 6394.80
    expect(result.pitTax).toBeCloseTo(6394.80, 1);
    expect(result.totalTax).toBeCloseTo(6394.80, 1);

    // Net take home = 100000 - 21476.10 - 6394.80 = 72129.10
    expect(result.netTakeHome).toBeCloseTo(72129.10, 1);
  });

  it('calculates 2026 taxes correctly for 200,000 PLN (crosses second threshold)', () => {
    const result = calculatePlTax({
      grossIncome: 200000,
      taxYear: '2026',
    });

    // Gross = 200000
    // ZUS = 200000 * 0.1371 = 27420
    // Health = (200000 - 27420) * 0.09 = 172580 * 0.09 = 15532.20
    // Total Social = 27420 + 15532.20 = 42952.20
    expect(result.totalSocialContributions).toBeCloseTo(42952.20, 1);

    // Taxable base = 200000 - 27420 - 3000 - 30000 = 139580
    // PIT = (90000 * 0.12) + ((139580 - 90000) * 0.32)
    // PIT = 10800 + (49580 * 0.32) = 10800 + 15865.60 = 26665.60
    expect(result.pitTax).toBeCloseTo(26665.60, 1);
    
    // Net = 200000 - 42952.20 - 26665.60 = 130382.20
    expect(result.netTakeHome).toBeCloseTo(130382.20, 1);
  });
  
  it('caps ZUS contributions but not health', () => {
    const result = calculatePlTax({
      grossIncome: 300000,
      taxYear: '2026',
    });
    
    // ZUS cap is 260000 * 0.1371 = 35646
    // Health = (300000 - 35646) * 0.09 = 264354 * 0.09 = 23791.86
    // Total Social = 35646 + 23791.86 = 59437.86
    expect(result.totalSocialContributions).toBeCloseTo(59437.86, 1);
  });

  it('exempts young workers under 26 (Ulga dla Młodych)', () => {
    const result = calculatePlTax({
      grossIncome: 60000,
      taxYear: '2026',
      isUnder26: true,
    });

    expect(result.pitTax).toBe(0);
    expect(result.totalSocialContributions).toBeGreaterThan(0);
    expect(result.netTakeHome).toBe(60000 - result.totalSocialContributions);
  });
});

