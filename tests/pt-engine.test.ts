import { describe, it, expect } from 'vitest';
import { calculatePtTax } from '../src/utils/tax/pt-engine';
import { ptProfile } from '../src/data/tax/countries/pt';

describe('Portugal Tax Engine (pt-engine)', () => {
  it('safeguards low earners under Mínimo de Existência (€11,000)', () => {
    const result = calculatePtTax({
      grossIncome: 11000,
      taxYear: '2026',
    });

    // Gross = 11,000
    // Social Security (11%) = 1,210
    expect(result.socialSecurity).toBe(1210);
    // Net before IRS = 9,790 <= 12,180 Mínimo de Existência -> IRS must be 0
    expect(result.irsTax).toBe(0);
    expect(result.netIncome).toBe(9790);
  });

  it('calculates 2026 taxes correctly for standard salary (€30,000)', () => {
    const result = calculatePtTax({
      grossIncome: 30000,
      taxYear: '2026',
    });

    // Gross = 30,000
    // Social Security = 30,000 * 0.11 = 3,300
    expect(result.socialSecurity).toBeCloseTo(3300, 1);

    // Standard deduction = max(4462.15, 3300) = 4462.15
    // Taxable Income = 30000 - 4462.15 = 25537.85
    expect(result.taxableIncome).toBeCloseTo(25537.85, 1);

    // Brackets:
    // 1st: up to 8342 @ 12.5% = 1042.75
    // 2nd: 8342 to 12587 (4245) @ 15.7% = 666.465
    // 3rd: 12587 to 17838 (5251) @ 21.2% = 1113.212
    // 4th: 17838 to 23089 (5251) @ 24.1% = 1265.491
    // 5th: 23089 to 25537.85 (2448.85) @ 31.1% = 761.592
    // Total Tax ~ 4849.51
    expect(result.irsTax).toBeCloseTo(4849.51, 1);
    
    // Net Take Home = 30000 - 3300 - 4849.51 = 21850.49
    expect(result.netIncome).toBeCloseTo(21850.49, 1);
  });

  it('uses actual social security when higher than standard €4,462.15 allowance (€60,000)', () => {
    const result = calculatePtTax({
      grossIncome: 60000,
      taxYear: '2026',
    });

    // Gross = 60,000
    // Social Security = 60,000 * 0.11 = 6,600
    expect(result.socialSecurity).toBeCloseTo(6600, 1);

    // Standard deduction = max(4462.15, 6600) = 6600
    // Taxable Income = 60000 - 6600 = 53400
    expect(result.taxableIncome).toBeCloseTo(53400, 1);
  });

  it('applies IRS Jovem 1st year 100% tax exemption (€25,000)', () => {
    const result = calculatePtTax({
      grossIncome: 25000,
      taxYear: '2026',
      irsJovem: 'year1',
    });

    expect(result.socialSecurity).toBeCloseTo(2750, 1);
    expect(result.irsTax).toBe(0);
    expect(result.netIncome).toBeCloseTo(22250, 1);
  });

  it('applies dependents tax credit correctly (€600 per dependent)', () => {
    const noKids = calculatePtTax({
      grossIncome: 30000,
      taxYear: '2026',
      dependents: 0,
    });

    const twoKids = calculatePtTax({
      grossIncome: 30000,
      taxYear: '2026',
      dependents: 2,
    });

    // 2 children provide 2 * 600 = €1,200 tax credit
    expect(noKids.irsTax - twoKids.irsTax).toBeCloseTo(1200, 1);
    expect(twoKids.netIncome - noKids.netIncome).toBeCloseTo(1200, 1);
  });

  it('handles zero gross income boundary gracefully', () => {
    const result = calculatePtTax({
      grossIncome: 0,
      taxYear: '2026',
    });

    expect(result.grossIncome).toBe(0);
    expect(result.netIncome).toBe(0);
    expect(result.socialSecurity).toBe(0);
    expect(result.irsTax).toBe(0);
  });

  it('maintains legacy AdvancedTaxInputs compatibility', () => {
    const legacyResult = calculatePtTax({
      primaryW2Income: 30000,
      taxYear: '2026',
    }, ptProfile);

    expect(legacyResult.totalGrossIncome).toBe(30000);
    expect(legacyResult.netTakeHome).toBeCloseTo(21850.49, 1);
  });
});
