import { describe, it, expect } from 'vitest';
import { calculateUkTax } from '../src/utils/tax/uk-engine';
import { ukProfile } from '../src/data/tax/countries/uk';

describe('UK Tax Engine', () => {
  it('calculates standard 2026/27 basic rules for England (£50k)', () => {
    const result = calculateUkTax({
      grossIncome: 50000,
      taxYear: '2026/27',
      region: 'england_wales_ni',
    });

    // Personal Allowance: £12,570
    expect(result.personalAllowance).toBe(12570);
    // Taxable Income: £50,000 - £12,570 = £37,430
    expect(result.taxableIncome).toBe(37430);
    // Basic rate (20%) up to £37,700: 37430 * 0.20 = 7486
    expect(result.incomeTax).toBe(7486);
    // NI: 8% on £50,000 - £12,570 = 37430 * 0.08 = 2994.40
    expect(result.nationalInsurance).toBeCloseTo(2994.40);
    // Net take-home
    expect(result.netTakeHome).toBeCloseTo(50000 - 7486 - 2994.40);
  });

  it('calculates standard employee (£35,000)', () => {
    const result = calculateUkTax({
      grossIncome: 35000,
      taxYear: '2026/27',
    });

    expect(result.personalAllowance).toBe(12570);
    expect(result.taxableIncome).toBe(22430);
    expect(result.incomeTax).toBe(4486); // 22430 * 0.20
    expect(result.nationalInsurance).toBeCloseTo(1794.40); // 22430 * 0.08
    expect(result.netTakeHome).toBeCloseTo(28719.60);
  });

  it('tapers personal allowance over £100,000', () => {
    const result = calculateUkTax({
      grossIncome: 110000,
      taxYear: '2026/27',
      region: 'england_wales_ni',
    });

    // £10,000 over 100k -> £5,000 reduction in allowance
    expect(result.personalAllowance).toBe(12570 - 5000); // 7570
    expect(result.taxableIncome).toBe(110000 - 7570); // 102430

    // Income tax: Basic (37700 @ 20% = 7540) + Higher ((102430 - 37700) @ 40% = 25892)
    expect(result.incomeTax).toBe(7540 + 25892); // 33432
  });

  it('correctly calculates the statutory £125,140 Personal Allowance phase-out boundary', () => {
    const result = calculateUkTax({
      grossIncome: 125140,
      taxYear: '2026/27',
      region: 'england_wales_ni',
    });

    // PA fully phased out at £125,140
    expect(result.personalAllowance).toBe(0);
    expect(result.taxableIncome).toBe(125140);

    // Basic (37700 @ 20% = 7540) + Higher ((125140 - 37700) = 87440 @ 40% = 34976)
    // Additional Rate (45%) strictly does NOT apply below £125,140
    expect(result.incomeTax).toBe(7540 + 34976); // 42516

    // NI: (50270 - 12570) * 0.08 = 3016; (125140 - 50270) * 0.02 = 1497.40; Total NI = 4513.40
    expect(result.nationalInsurance).toBeCloseTo(4513.40);
    expect(result.netTakeHome).toBeCloseTo(125140 - 42516 - 4513.40); // 78110.60
  });

  it('handles Scotland 6-band statutory rates', () => {
    const result = calculateUkTax({
      grossIncome: 50000,
      taxYear: '2026/27',
      region: 'scotland',
    });

    expect(result.personalAllowance).toBe(12570);
    expect(result.taxableIncome).toBe(37430);

    // Scotland brackets:
    // Starter: 3967 @ 19% = 753.73
    // Basic: (16956 - 3967 = 12989) @ 20% = 2597.80
    // Intermediate: (31092 - 16956 = 14136) @ 21% = 2968.56
    // Higher: (37430 - 31092 = 6338) @ 42% = 2661.96
    // Total: 753.73 + 2597.80 + 2968.56 + 2661.96 = 8982.05
    expect(result.incomeTax).toBeCloseTo(8982.05);
  });

  it('correctly calculates workplace pension salary sacrifice and student loan', () => {
    const result = calculateUkTax({
      grossIncome: 60000,
      taxYear: '2026/27',
      pensionPercent: 5, // 5% salary sacrifice = £3,000
      studentLoanPlan: 'plan2',
    });

    expect(result.pensionContribution).toBe(3000);
    expect(result.adjustedGrossIncome).toBe(57000);
    expect(result.personalAllowance).toBe(12570);
    expect(result.taxableIncome).toBe(57000 - 12570); // 44430

    // Income tax: 37700 * 0.20 (7540) + (44430 - 37700) * 0.40 (2692) = 10232
    expect(result.incomeTax).toBe(10232);

    // NI on adjusted gross £57,000:
    // (50270 - 12570) * 0.08 = 3016
    // (57000 - 50270) * 0.02 = 134.60
    // Total NI = 3150.60
    expect(result.nationalInsurance).toBeCloseTo(3150.60);

    // Student loan Plan 2: (60000 - 27295) * 0.09 = 32705 * 0.09 = 2943.45
    expect(result.studentLoan).toBeCloseTo(2943.45);

    // Total deductions = 10232 + 3150.60 + 2943.45 = 16326.05
    expect(result.totalDeductions).toBeCloseTo(16326.05);
    // Net take-home = 60000 - 16326.05 - 3000 = 40673.95
    expect(result.netTakeHome).toBeCloseTo(40673.95);
  });
});
