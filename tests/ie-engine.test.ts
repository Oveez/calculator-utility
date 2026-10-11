import { describe, it, expect } from 'vitest';
import { calculateIeTax } from '../src/utils/tax/ie-engine';
import { ieProfile } from '../src/data/tax/countries/ie';
import type { AdvancedTaxInputs } from '../src/data/tax/types';

describe('IE Tax Engine (2026)', () => {
  it('calculates 0 income correctly', () => {
    const inputs: AdvancedTaxInputs = {
      primaryW2Income: 0,
    };
    const result = calculateIeTax(inputs, ieProfile);
    
    expect(result.totalGrossIncome).toBe(0);
    expect(result.netFederalIncomeTax).toBe(0);
    expect(result.totalUsc || result.ficaMedicare).toBe(0);
    expect(result.totalPrsi || result.ficaSocialSecurity).toBe(0);
    expect(result.netAnnualTakeHome).toBe(0);
  });

  it('calculates 50,000 income correctly', () => {
    const inputs: AdvancedTaxInputs = {
      primaryW2Income: 50000,
    };
    const result = calculateIeTax(inputs, ieProfile);
    
    // 50k breakdown:
    // Income Tax:
    // first 44k @ 20% = 8800
    // next 6k @ 40% = 2400
    // Gross IT = 11200
    // Credits = 4000
    // Net IT = 7200
    expect(result.netFederalIncomeTax).toBe(7200);

    // USC:
    // 12012 @ 0.5% = 60.06
    // 16688 (28700 - 12012) @ 2% = 333.76
    // 21300 (50000 - 28700) @ 3% = 639.00
    // Total USC = 1032.82
    expect(result.ficaMedicare).toBeCloseTo(1032.82, 2);

    // PRSI:
    // 50000 @ 4.2% = 2100
    expect(result.ficaSocialSecurity).toBeCloseTo(2100, 2);

    // Total FICA = 3132.82
    // Total All Taxes = 7200 + 3132.82 = 10332.82
    // Net = 50000 - 10332.82 = 39667.18
    expect(result.netAnnualTakeHome).toBeCloseTo(39667.18, 2);
  });

  it('correctly provides marginal PAYE relief for pension contributions', () => {
    const result = calculateIeTax({
      grossIncome: 60000,
      pensionContributions: 6000,
      maritalStatus: 'single',
    }, ieProfile);

    // Taxable income = 60000 - 6000 = 54000
    expect(result.taxableIncome).toBe(54000);
    // Standard: 44k @ 20% = 8800, Higher: 10k @ 40% = 4000; Gross = 12800; Net = 12800 - 4000 = 8800
    expect(result.netIncomeTax).toBe(8800);
    // USC remains on full gross (60,000): 60.06 + 333.76 + (60000-28700)*0.03 = 1332.82
    expect(result.totalUsc).toBeCloseTo(1332.82, 2);
    // PRSI on full gross: 60000 * 4.2% = 2520
    expect(result.totalPrsi).toBeCloseTo(2520, 2);
    // Take-home pay = 60k - (8800 + 1332.82 + 2520) - 6000 pension = 41347.18
    expect(result.netAnnualTakeHome).toBeCloseTo(41347.18, 2);
  });

  it('applies married one-earner cut-off (€53,000) and married credits (€6,000)', () => {
    const result = calculateIeTax({
      grossIncome: 70000,
      maritalStatus: 'married_one',
    }, ieProfile);

    expect(result.cutOffPoint).toBe(53000);
    expect(result.totalTaxCredits).toBe(6000);
    // Standard: 53k * 20% = 10600; Higher: 17k * 40% = 6800; Gross = 17400; Net = 17400 - 6000 = 11400
    expect(result.netIncomeTax).toBe(11400);
  });

  it('exempts low income (€12,000) from USC and PRSI', () => {
    const result = calculateIeTax({
      grossIncome: 12000,
      maritalStatus: 'single',
    }, ieProfile);

    expect(result.netIncomeTax).toBe(0); // 12k * 20% = 2400 < 4000 credits
    expect(result.totalUsc).toBe(0); // Exempt under €13,000 threshold
    expect(result.totalPrsi).toBe(0); // Under €18,304 threshold
    expect(result.netAnnualTakeHome).toBe(12000);
  });
});
