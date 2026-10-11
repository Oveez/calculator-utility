import { describe, it, expect } from 'vitest';
import { calculateCaTax } from '../src/utils/tax/ca-engine';
import { caProfile } from '../src/data/tax/countries/ca';

describe('Canada Tax Engine (2026)', () => {
  it('calculates federal tax correctly for 100k gross (Ontario)', () => {
    const result = calculateCaTax(caProfile, 100000, { taxYear: '2026', regionCode: 'on' });
    
    expect(result.grossIncome).toBe(100000);
    expect(result.standardDeduction).toBe(16452); // Basic personal amount
    
    // Taxable income = 100k - 16452 = 83548
    expect(result.taxableIncome).toBe(83548);
    
    // Fed Tax:
    // 14% on first 58523 = 8193.22
    // 20.5% on (83548 - 58523) = 5130.125
    // Total fed tax = 13323.345
    expect(result.nationalIncomeTax).toBeCloseTo(13323.345, 1);
    
    // Ontario Tax:
    // Taxable income for Ontario is also 83548
    // 5.05% on first 53891 = 2721.4955
    // 9.15% on (83548 - 53891 = 29657) = 2713.6155
    // Total prov tax = 5435.111
    expect(result.regionalIncomeTax).toBeCloseTo(5435.111, 1);
    
    // CPP: 5.95% on (74600 - 3500) = 4230.45
    // EI: 1.63% on 68900 = 1123.07
    expect(result.totalSocialContributions).toBeCloseTo(4230.45 + 1123.07, 1);
    
    // Marginal rate should be combined marginal: 20.5% (Fed) + 9.15% (ON) = 29.65%
    // represented as 29.65
    expect(result.marginalTaxRate).toBeCloseTo(29.65, 1);
  });

  it('correctly reduces taxable income with RRSP / custom deductions', () => {
    const result = calculateCaTax(caProfile, 100000, {
      taxYear: '2026',
      regionCode: 'on',
      customDeductions: 10000,
    });

    expect(result.grossIncome).toBe(100000);
    // Adjusted gross = 100k - 10k RRSP = 90k; Taxable = 90k - 16452 = 73548
    expect(result.taxableIncome).toBe(73548);
    // Fed Tax: 14% on 58523 (8193.22) + 20.5% on 15025 (3080.125) = 11273.345
    expect(result.nationalIncomeTax).toBeCloseTo(11273.345, 1);
    // Ontario Tax: 5.05% on 53891 (2721.4955) + 9.15% on 19657 (1798.6155) = 4520.111
    expect(result.regionalIncomeTax).toBeCloseTo(4520.111, 1);
    // CPP & EI remain based on gross wages
    expect(result.totalSocialContributions).toBeCloseTo(4230.45 + 1123.07, 1);
  });

  it('calculates British Columbia provincial tax with multi-bracket progression', () => {
    const result = calculateCaTax(caProfile, 80000, { taxYear: '2026', regionCode: 'bc' });

    expect(result.taxableIncome).toBe(80000 - 16452); // 63548
    // BC Tax: 5.6% on 50363 (2820.328) + 7.7% on (63548 - 50363 = 13185) (1015.245) = 3835.573
    expect(result.regionalIncomeTax).toBeCloseTo(3835.573, 1);
    // Combined marginal rate: 20.5% Fed + 7.7% BC = 28.2%
    expect(result.marginalTaxRate).toBeCloseTo(28.2, 1);
  });

  it('calculates Alberta regional tax with flat rate', () => {
    const result = calculateCaTax(caProfile, 120000, { taxYear: '2026', regionCode: 'ab' });

    const taxable = 120000 - 16452; // 103548
    expect(result.taxableIncome).toBe(taxable);
    // AB 10% flat rate on taxable income
    expect(result.regionalIncomeTax).toBeCloseTo(taxable * 0.10, 1);
  });

  it('handles low-income below CPP exemption threshold ($3,500)', () => {
    const result = calculateCaTax(caProfile, 3000, { taxYear: '2026', regionCode: 'on' });

    expect(result.taxableIncome).toBe(0);
    expect(result.nationalIncomeTax).toBe(0);
    expect(result.regionalIncomeTax).toBe(0);
    // CPP: 0 because gross is under $3,500 exemption
    // EI: 3000 * 1.63% = 48.90
    expect(result.totalSocialContributions).toBeCloseTo(48.9, 1);
    expect(result.netIncomeAnnual).toBeCloseTo(3000 - 48.9, 1);
  });
});
