import { describe, it, expect } from 'vitest';
import { calculateNlTax } from '../src/utils/tax/nl-engine';

describe('calculateNlTax 2026', () => {
  it('calculates tax for a standard employee earning 40,000 without 30% ruling', () => {
    const result = calculateNlTax({ grossIncome: 40000, taxYear: '2026', has30PercentRuling: false });
    
    expect(result.grossIncome).toBe(40000);
    expect(result.taxableIncome).toBe(40000);
    
    // Bracket 1: 38883 * 0.3575 = 13900.67
    // Bracket 2: (40000 - 38883) * 0.3756 = 419.55
    // Total Box 1 Base ~ 14320.22
    expect(result.box1Tax).toBeCloseTo(14320.22, 1);
    
    // Zvw: 40000 * 0.0545 = 2180
    expect(result.zvwContribution).toBeCloseTo(2180, 1);
    
    // General Tax Credit:
    // Max 3362
    // Phase out: (40000 - 24812) * 0.0663 = 1006.96
    // GTC = 3362 - 1006.96 = 2355.04
    expect(result.generalTaxCredit).toBeCloseTo(2355.04, 1);
    
    // Labour Tax Credit:
    // > 39957 so: 5529 - (40000 - 39957)*0.0651 = 5529 - 2.80 = 5526.20
    expect(result.labourTaxCredit).toBeCloseTo(5526.20, 1);
    
    expect(result.totalTaxCredits).toBeCloseTo(2355.04 + 5526.20, 1);
    expect(result.netBox1Tax).toBeCloseTo(14320.22 - (2355.04 + 5526.20), 1);
    expect(result.totalTax).toBeCloseTo(14320.22 - (2355.04 + 5526.20) + 2180, 1);
    expect(result.netIncome).toBeCloseTo(40000 - result.totalTax, 1);
  });

  it('calculates tax for an employee earning 100,000 with 30% ruling', () => {
    const result = calculateNlTax({ grossIncome: 100000, taxYear: '2026', has30PercentRuling: true });
    
    expect(result.grossIncome).toBe(100000);
    expect(result.taxableIncome).toBe(70000); // 30% off
    
    // Total tax should be lower due to ruling
    expect(result.netIncome).toBeGreaterThan(60000); 
  });

  it('correctly uses 2025 parameters when 2025 tax year is selected', () => {
    const result = calculateNlTax({ grossIncome: 50000, taxYear: '2025', has30PercentRuling: false });

    expect(result.grossIncome).toBe(50000);
    // 2025 brackets: 38441 * 0.3582 + (50000 - 38441) * 0.3748
    const expectedBox1 = (38441 * 0.3582) + ((50000 - 38441) * 0.3748);
    expect(result.box1Tax).toBeCloseTo(expectedBox1, 1);

    // 2025 GTC: max 3068, phase-out above 28406 at 6.337%
    const expectedGtc = Math.max(0, 3068 - ((50000 - 28406) * 0.06337));
    expect(result.generalTaxCredit).toBeCloseTo(expectedGtc, 1);
  });

  it('calculates exact Labour Tax Credit at peak boundary (€39,957)', () => {
    const result = calculateNlTax({ grossIncome: 39957, taxYear: '2026', has30PercentRuling: false });

    // Peak tier 3 formula: 5155 + (39957 - 24812) * 0.02471 = 5155 + 374.23 = 5529.23
    expect(result.labourTaxCredit).toBeCloseTo(5529.23, 1);
  });

  it('calculates tax for low income (€20,000) with near-max credits', () => {
    const result = calculateNlTax({ grossIncome: 20000, taxYear: '2026', has30PercentRuling: false });

    // In 2026, 20000 <= 24812, so General Tax Credit is at statutory max €3,362
    expect(result.generalTaxCredit).toBe(3362);

    // Box 1: 20000 * 0.3575 = 7150
    expect(result.box1Tax).toBeCloseTo(7150, 1);

    // LTC tier 2: 968 + (20000 - 11490) * 0.31433 = 968 + 2674.95 = 3642.95
    expect(result.labourTaxCredit).toBeCloseTo(3642.95, 1);

    // Total credits = 3362 + 3642.95 = 7004.95
    // Net Box 1 Tax = 7150 - 7004.95 = 145.05
    expect(result.netBox1Tax).toBeCloseTo(145.05, 1);
  });
});
