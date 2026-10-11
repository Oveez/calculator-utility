import { describe, it, expect } from 'vitest';
import { calculateAuTax } from '../src/utils/tax/au-engine';

describe('AU Tax Engine 2026/27', () => {
  it('calculates zero tax for income below threshold', () => {
    const result = calculateAuTax({ grossIncome: 18000 });
    expect(result.nationalIncomeTax).toBe(0);
    expect(result.medicareLevy).toBe(0);
    expect(result.medicareLevySurcharge).toBe(0);
    expect(result.litoAmount).toBe(700);
    expect(result.netIncomeAnnual).toBe(18000);
  });

  it('calculates tax with full LITO ($30k income)', () => {
    // Income 30,000 -> Tax is (30000 - 18200) * 0.16 = 11800 * 0.16 = 1888
    // LITO = 700
    // Net tax = 1888 - 700 = 1188
    // Medicare phase-in: 30000 > 26000. Phase-in = (30000 - 26000) * 0.10 = 400
    // Standard 2% = 600. Min(400, 600) = 400
    // Net income = 30000 - 1188 - 400 = 28412
    const result = calculateAuTax({ grossIncome: 30000 });
    expect(result.nationalIncomeTax).toBe(1188);
    expect(result.litoAmount).toBe(700);
    expect(result.medicareLevy).toBe(400);
    expect(result.netIncomeAnnual).toBe(28412);
  });

  it('calculates standard medicare levy and LITO phase-out ($50k income)', () => {
    // Income 50,000. 
    // Base Tax: 18200 -> 0. 18201-45000 @ 16% = 4288. 45001-50000 @ 30% = 1500
    // Total base tax = 5788
    // LITO: 50,000 is between 45000 and 66667. LITO = 325 - (50000-45000)*0.015 = 325 - 75 = 250
    // Net tax = 5788 - 250 = 5538
    // Medicare: 50,000 * 2% = 1000
    // Net income = 50000 - 5538 - 1000 = 43462
    const result = calculateAuTax({ grossIncome: 50000 });
    expect(result.nationalIncomeTax).toBe(5538);
    expect(result.litoAmount).toBe(250);
    expect(result.medicareLevy).toBe(1000);
    expect(result.netIncomeAnnual).toBe(43462);
  });

  it('calculates Medicare Levy Surcharge for single above threshold', () => {
    // Single, $110,000 income, no private health insurance
    // 110,000 > 105,000 so Tier 1 MLS applies (1%)
    const result = calculateAuTax({ grossIncome: 110000, hasPrivateHealthInsurance: false });
    expect(result.medicareLevySurcharge).toBe(110000 * 0.01);
  });

  it('calculates Medicare Levy Surcharge for family above threshold', () => {
    // Family (has spouse), 220,000 combined (120k + 100k), no private health
    // Base family threshold is 210,000. Combined 220,000 > 210,000. 
    // Tier 1 MLS for family is 210,001 - 246,000 (1%)
    // The surcharge applies to their own income. So 1% of 120,000.
    const result = calculateAuTax({ 
      grossIncome: 120000, 
      spouseIncome: 100000,
      hasPrivateHealthInsurance: false 
    });
    expect(result.medicareLevySurcharge).toBe(120000 * 0.01);
  });

  it('does not calculate MLS if has private health insurance', () => {
    const result = calculateAuTax({ grossIncome: 150000, hasPrivateHealthInsurance: true });
    expect(result.medicareLevySurcharge).toBe(0);
  });
});
