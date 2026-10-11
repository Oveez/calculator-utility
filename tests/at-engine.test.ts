import { describe, it, expect } from 'vitest';
import { calculateAtTax } from '../src/utils/tax/at-engine';

describe('AT Tax Engine', () => {
  it('calculates 2026 Austrian taxes for standard 14-salaries employee (€50,000 gross)', () => {
    const result = calculateAtTax({ grossIncome: 50000, taxYear: '2026', paymentsCount: 14 });
    expect(result.grossIncome).toBe(50000);
    expect(result.paymentsCount).toBe(14);

    // Regular gross: 50,000 * 12/14 = 42,857.14
    // Special gross: 50,000 * 2/14 = 7,142.86
    // Regular SV: 42,857.14 * 18.12% = 7,765.71
    // Special SV: 7,142.86 * 17.12% = 1,222.86
    // Total SV: 7,765.71 + 1,222.86 = 8,988.57
    expect(result.socialInsurance).toBeCloseTo(8988.57, 1);

    // Special tax (§ 67 EStG):
    // Special taxable: 7,142.86 - 1,222.86 = 5,920.00
    // Taxable above €620 Freibetrag: 5,300.00 * 6% = 318.00
    expect(result.specialTax).toBeCloseTo(318.0, 1);

    // Total tax should yield net take-home of ~€35,570 (matching Austrian BMF benchmark)
    expect(result.netIncome).toBeCloseTo(35572.7, 0);
    expect(result.totalTax).toBeCloseTo(50000 - 35572.7, 0);
  });

  it('applies statutory Höchstbeitragsgrundlage SV cap for high earner (€100,000 gross)', () => {
    const result = calculateAtTax({ grossIncome: 100000, taxYear: '2026', paymentsCount: 14 });
    expect(result.grossIncome).toBe(100000);

    // Höchstbeitragsgrundlage is €82,200 annual
    // Regular SV capped at 82,200 * (12/14) * 18.12% = 12,766.77
    // Special SV capped at 82,200 * (2/14) * 17.12% = 2,010.44
    // Total SV = 14,777.21
    expect(result.socialInsurance).toBeCloseTo(14777.21, 1);
    expect(result.specialTax).toBeGreaterThan(0);
    expect(result.regularTax).toBeGreaterThan(0);
    expect(result.netIncome).toBeLessThan(100000);
  });

  it('correctly compares 12 vs 14 payments models', () => {
    const res14 = calculateAtTax({ grossIncome: 60000, taxYear: '2026', paymentsCount: 14 });
    const res12 = calculateAtTax({ grossIncome: 60000, taxYear: '2026', paymentsCount: 12 });

    // Under Austrian tax law (§ 67), receiving 14 salaries gives preferential 6% taxation on 13th & 14th pay,
    // resulting in lower total tax and higher net take-home than 12 flat monthly salaries
    expect(res14.totalTax).toBeLessThan(res12.totalTax);
    expect(res14.netIncome).toBeGreaterThan(res12.netIncome);
  });

  it('calculates Freier Dienstnehmer social security correctly', () => {
    const result = calculateAtTax({
      grossIncome: 40000,
      taxYear: '2026',
      status: 'freier_dienstnehmer',
      paymentsCount: 12,
    });
    // Freier Dienstnehmer rate is 14.12%
    expect(result.socialInsurance).toBeCloseTo(40000 * 0.1412, 1);
  });

  it('exempts low income below Grundfreibetrag from income tax', () => {
    const result = calculateAtTax({ grossIncome: 12000, taxYear: '2026', paymentsCount: 12 });
    // Income is below €13,539 Grundfreibetrag, so income tax is €0
    expect(result.incomeTax).toBe(0);
    // Only social insurance is deducted
    expect(result.socialInsurance).toBeCloseTo(12000 * 0.1812, 1);
    expect(result.netIncome).toBeCloseTo(12000 - (12000 * 0.1812), 1);
  });

  it('supports backwards compatibility with legacy AdvancedTaxInputs signature', () => {
    const legacyResult = calculateAtTax({
      primaryW2Income: 50000,
      taxYear: '2026',
    });
    expect(legacyResult.grossIncome).toBe(50000);
    expect(legacyResult.totalTax).toBeGreaterThan(0);
    expect(legacyResult.netIncome).toBeGreaterThan(0);
  });
});
