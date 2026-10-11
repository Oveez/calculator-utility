import { expect, test, describe } from 'vitest';
import {
  calculateJpTax,
  calculateEmploymentIncomeDeduction,
  calculateBasicDeduction,
  calculateShakaiHoken,
} from '../src/utils/tax/jp-engine';

describe('Japan Tax Engine', () => {
  test('Employment income deduction formula adheres to statutory brackets', () => {
    // Under ¥550,000: full amount
    expect(calculateEmploymentIncomeDeduction(500000)).toBe(500000);
    // Up to ¥1,625,000: ¥550,000
    expect(calculateEmploymentIncomeDeduction(1500000)).toBe(550000);
    // ¥1,625,001 to ¥1,800,000: gross * 40% - 100,000
    expect(calculateEmploymentIncomeDeduction(1800000)).toBe(620000);
    // ¥1,800,001 to ¥3,600,000: gross * 30% + 80,000
    expect(calculateEmploymentIncomeDeduction(3000000)).toBe(980000);
    // ¥3,600,001 to ¥6,600,000: gross * 20% + 440,000
    expect(calculateEmploymentIncomeDeduction(5000000)).toBe(1440000);
    // ¥6,600,001 to ¥8,500,000: gross * 10% + 1,100,000
    expect(calculateEmploymentIncomeDeduction(8000000)).toBe(1900000);
    // Over ¥8,500,000: capped at ¥1,950,000
    expect(calculateEmploymentIncomeDeduction(10000000)).toBe(1950000);
  });

  test('Basic personal deduction adheres to statutory income phase-outs', () => {
    expect(calculateBasicDeduction(5000000)).toBe(480000);
    expect(calculateBasicDeduction(24200000)).toBe(320000);
    expect(calculateBasicDeduction(24800000)).toBe(160000);
    expect(calculateBasicDeduction(26000000)).toBe(0);
  });

  test('Calculates low-income earner exempt from income tax (103万円 wall)', () => {
    const result = calculateJpTax({ grossIncome: 1000000, taxYear: '2026' });
    expect(result.grossIncome).toBe(1000000);
    expect(result.employmentIncomeDeduction).toBe(550000);
    expect(result.basicDeduction).toBe(480000);
    expect(result.taxableIncome).toBe(0);
    expect(result.nationalIncomeTax).toBe(0);
    expect(result.inhabitantTax).toBe(0);
  });

  test('Calculates 2026 tax correctly for 5,000,000 JPY gross income', () => {
    const result = calculateJpTax({ grossIncome: 5000000, taxYear: '2026' });

    expect(result.grossIncome).toBe(5000000);
    // Social Insurance: 5M * 14.75% = 737,500
    expect(result.totalSocialContributions).toBe(737500);

    // Statutory deductions: Kyūyo (1.44M) + Kiso (480k) = 1,920,000
    expect(result.employmentIncomeDeduction).toBe(1440000);
    expect(result.basicDeduction).toBe(480000);
    expect(result.standardDeduction).toBe(1920000);

    // Taxable Income = 5,000,000 - 1,920,000 - 737,500 = 2,342,500
    expect(result.taxableIncome).toBe(2342500);

    // National base tax: 1.95M @ 5% + (2,342,500 - 1.95M) @ 10% = 97,500 + 39,250 = 136,750
    // Surtax 2.1% = 2,871.75 -> National tax = 139,621.75
    expect(result.nationalIncomeTax).toBeCloseTo(139621.75, 1);

    // Inhabitant tax (10% flat) = 234,250
    expect(result.inhabitantTax).toBe(234250);

    // Net take-home = 5M - 737,500 - 139,621.75 - 234,250 = 3,888,628.25
    expect(result.netIncomeAnnual).toBeCloseTo(3888628.25, 1);
  });

  test('Calculates high earner (¥10,000,000) with social insurance caps', () => {
    const result = calculateJpTax({ grossIncome: 10000000, taxYear: '2026' });
    expect(result.grossIncome).toBe(10000000);
    expect(result.employmentIncomeDeduction).toBe(1950000); // capped

    // Pension is capped at ¥7.80M (713,700), Health is 500,000, Employment is 60,000
    expect(result.shakaiHoken.pension).toBe(713700);
    expect(result.shakaiHoken.total).toBe(1273700);

    // Taxable = 10,000,000 - 1,950,000 - 480,000 - 1,273,700 = 6,296,300
    expect(result.taxableIncome).toBe(6296300);
  });
});
