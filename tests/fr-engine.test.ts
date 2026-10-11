import { describe, it, expect } from 'vitest';
import { calculateFrTax } from '../src/utils/tax/fr-engine';
import { frProfile } from '../src/data/tax/countries/fr';

describe('calculateFrTax', () => {
  it('calculates tax for a single individual in 2026', () => {
    const inputs = {
      taxYear: '2026',
      filingStatus: 'single' as const,
      primaryW2Income: 50000,
    };
    const result = calculateFrTax(inputs, frProfile);
    
    // 10% standard deduction: 50000 * 0.1 = 5000
    // Adjusted gross: 45000
    // Parts: 1
    // Income per part: 45000
    // Taxable after 0% bracket (11600): 33400
    // Bracket 1 (0 to 17978 @ 11%): 1977.58
    // Bracket 2 (17978 to 33400 = 15422 @ 30%): 4626.60
    // Regular Income Tax ~ 6604.18
    
    expect(result.adjustedGrossIncome).toBe(45000);
    expect(result.regularIncomeTax).toBeCloseTo(6604.18, 1);
    
    // CSG/CRDS on 98.25%: 50000 * 0.9825 * 0.097 = 4765.125
    // Pension Base: Math.min(50000, 48060) * 0.073 = 3508.38
    // Pension Comp: 50000 * 0.05 = 2500
    // Total Social: 4765.125 + 3508.38 + 2500 = 10773.505
    expect(result.totalFicaTax).toBeCloseTo(10773.51, 1);
  });

  it('calculates tax for a married couple with 2 children in 2026', () => {
    const inputs = {
      taxYear: '2026',
      filingStatus: 'married_joint' as const,
      primaryW2Income: 80000,
      spouseW2Income: 0,
      numChildrenUnder17: 2,
    };
    const result = calculateFrTax(inputs, frProfile);
    
    // 10% deduction on 80000 = 8000
    // Adjusted gross: 72000
    // Parts: 2 (married) + 1 (2 kids) = 3 parts
    // Income per part: 24000
    // Taxable after 11600: 12400
    // Bracket 1 (0 to 12400 @ 11%): 1364
    // Tax per part = 1364
    // Total Tax = 1364 * 3 = 4092
    
    expect(result.regularIncomeTax).toBeCloseTo(4092, 1);
  });

  it('caps 10% frais professionnels at €14,171 and state pension at PASS for high earner (€200,000)', () => {
    const result = calculateFrTax({
      grossIncome: 200000,
      taxYear: '2026',
      isMarried: false,
    }, frProfile);

    // 10% of 200k = 20k, but statutory cap is 14171
    expect(result.profDeduction).toBe(14171);
    expect(result.adjustedGrossIncome).toBe(200000 - 14171);

    // Pension base should be capped at PASS 2026 (€48,060): 48060 * 7.3% = 3508.38
    expect(result.pensionBase).toBeCloseTo(48060 * 0.073, 2);
  });

  it('uses 2025 tax brackets and PASS ceiling (€47,100) when 2025 is selected', () => {
    const result = calculateFrTax({
      grossIncome: 60000,
      taxYear: '2025',
      isMarried: false,
    }, frProfile);

    // In 2025, PASS ceiling is 47100: pension base = 47100 * 7.3% = 3438.30
    expect(result.pensionBase).toBeCloseTo(47100 * 0.073, 2);
  });
});
