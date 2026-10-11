import { describe, it, expect } from 'vitest';
import {
  calculateKrTax,
  calculateEarnedIncomeDeduction,
  calculateFourMajorInsurances,
} from '../src/utils/tax/kr-engine';

describe('South Korea Tax Engine', () => {
  it('Earned Income Deduction adheres to statutory 5-tier Article 47 formula', () => {
    // Up to 5M @ 70%
    expect(calculateEarnedIncomeDeduction(4000000)).toBe(2800000);
    // 5M to 15M: 3.5M + 40% excess
    expect(calculateEarnedIncomeDeduction(10000000)).toBe(5500000);
    // 15M to 45M: 7.5M + 15% excess
    expect(calculateEarnedIncomeDeduction(30000000)).toBe(9750000);
    // 45M to 100M: 12M + 5% excess
    expect(calculateEarnedIncomeDeduction(50000000)).toBe(12250000);
    // Over 100M: 14.75M + 2% excess
    expect(calculateEarnedIncomeDeduction(120000000)).toBe(15150000);
    // Over 100M capped at 20M
    expect(calculateEarnedIncomeDeduction(500000000)).toBe(20000000);
  });

  it('calculates low-income earner exempt from income tax (₩5,000,000)', () => {
    const result = calculateKrTax({ grossIncome: 5000000, taxYear: '2026' });
    expect(result.grossIncome).toBe(5000000);
    expect(result.earnedIncomeDeduction).toBe(3500000);
    expect(result.basicPersonalDeduction).toBe(1500000);
    expect(result.taxableIncome).toBe(0);
    expect(result.nationalIncomeTax).toBe(0);
    expect(result.localIncomeTax).toBe(0);
  });

  it('calculates 2026 tax correctly for ₩50,000,000 single employee', () => {
    const result = calculateKrTax({ grossIncome: 50000000, taxYear: '2026' });

    expect(result.grossIncome).toBe(50000000);
    // Earned income deduction: 12.0M + (50M - 45M) * 5% = 12,250,000
    expect(result.earnedIncomeDeduction).toBe(12250000);
    expect(result.basicPersonalDeduction).toBe(1500000);
    expect(result.standardDeduction).toBe(13750000);

    // Taxable base = 50,000,000 - 13,750,000 = 36,250,000
    expect(result.taxableIncome).toBe(36250000);

    // National tax: 14M @ 6% (840,000) + (36.25M - 14M) @ 15% (3,337,500) = 4,177,500
    expect(result.nationalIncomeTax).toBe(4177500);
    // Local tax: 10% = 417,750
    expect(result.localIncomeTax).toBe(417750);
    expect(result.totalIncomeTax).toBe(4595250);

    // 4 Major Insurances (Pension 4.75% = 2.375M, Health 3.595% = 1.7975M, Care = 236,191.5, Emp = 450k)
    expect(result.fourMajorInsurances.pension).toBe(2375000);
    expect(result.fourMajorInsurances.total).toBeCloseTo(4858691.5, 0);

    // Net take-home = 50,000,000 - 4,595,250 - 4,858,691.5 = 40,546,058.5
    expect(result.netIncomeAnnual).toBeCloseTo(40546058.5, 0);
  });

  it('year-awareness: 2026 (4.75%) vs 2025 (4.50%) National Pension rates', () => {
    const res2026 = calculateKrTax({ grossIncome: 50000000, taxYear: '2026' });
    const res2025 = calculateKrTax({ grossIncome: 50000000, taxYear: '2025' });

    expect(res2026.fourMajorInsurances.pension).toBe(50000000 * 0.0475);
    expect(res2025.fourMajorInsurances.pension).toBe(50000000 * 0.0450);
  });

  it('calculates family basic deductions (Married with 2 children = 4 persons)', () => {
    const result = calculateKrTax({
      grossIncome: 80000000,
      taxYear: '2026',
      hasDependentSpouse: true,
      dependentsCount: 2,
    });

    // 4 persons * ₩1.5M = ₩6,000,000
    expect(result.basicPersonalDeduction).toBe(6000000);
    // Earned income deduction for 80M: 12M + (80M - 45M) * 5% = 13,750,000
    expect(result.earnedIncomeDeduction).toBe(13750000);
    // Taxable base = 80,000,000 - 13,750,000 - 6,000,000 = 60,250,000
    expect(result.taxableIncome).toBe(60250000);
  });
});
