import { describe, it, expect } from 'vitest';
import { calculateNoTax } from '../src/utils/tax/no-engine';

describe('Norway Tax Engine', () => {
  it('calculates 2026 Norwegian taxes correctly for 600,000 NOK gross', () => {
    const result = calculateNoTax({ grossIncome: 600000, taxYear: '2026' });
    expect(result.grossIncome).toBe(600000);

    // 1. Trygdeavgift (7.6% on gross): 600,000 * 0.076 = 45,600 NOK
    expect(result.trygdeavgift).toBeCloseTo(45600, 2);

    // 2. Minstefradrag (46% capped at 104,300 NOK) = 104,300 NOK
    expect(result.minstefradrag).toBeCloseTo(104300, 2);

    // 3. Personfradrag = 114,540 NOK
    expect(result.personfradrag).toBe(114540);

    // 4. Alminnelig inntekt: 600,000 - 104,300 = 495,700 NOK
    expect(result.alminneligInntekt).toBeCloseTo(495700, 2);

    // 5. Flat 22% tax: (495,700 - 114,540) * 0.22 = 381,160 * 0.22 = 83,855.20 NOK
    expect(result.flatTax).toBeCloseTo(83855.2, 2);

    // 6. Trinnskatt on 600,000 NOK:
    // Trinn 1 (226,100 - 318,300): 92,200 * 1.7% = 1,567.40
    // Trinn 2 (318,300 - 600,000): 281,700 * 4.0% = 11,268.00
    // Total Trinnskatt = 12,835.40 NOK
    expect(result.trinnskatt).toBeCloseTo(12835.4, 2);

    // 7. Total income tax: 83,855.20 + 12,835.40 = 96,690.60 NOK
    expect(result.totalIncomeTax).toBeCloseTo(96690.6, 2);

    // 8. Total tax & Net take-home:
    expect(result.totalTax).toBeCloseTo(96690.6 + 45600, 2);
    expect(result.netIncome).toBeCloseTo(600000 - (96690.6 + 45600), 2);
  });

  it('exempts low earner below frikort threshold from taxes', () => {
    const result = calculateNoTax({ grossIncome: 80000, taxYear: '2026' });
    expect(result.trygdeavgift).toBe(0);
    expect(result.flatTax).toBe(0);
    expect(result.trinnskatt).toBe(0);
    expect(result.totalTax).toBe(0);
    expect(result.netIncome).toBe(80000);
  });

  it('calculates top Trinn steps for high earner (1,500,000 NOK)', () => {
    const result = calculateNoTax({ grossIncome: 1500000, taxYear: '2026' });
    // Should reach Trinn 5 (> 1,467,200 NOK)
    expect(result.trinnskatt).toBeGreaterThan(100000);
    expect(result.flatTax).toBeGreaterThan(200000);
    expect(result.netIncome).toBeLessThan(1500000);
  });

  it('supports custom deductions reducing alminnelig inntekt', () => {
    const resBase = calculateNoTax({ grossIncome: 600000, taxYear: '2026', customDeductions: 0 });
    const resDed = calculateNoTax({ grossIncome: 600000, taxYear: '2026', customDeductions: 20000 });
    // Flat 22% tax should reduce by 20,000 * 0.22 = 4,400 NOK
    expect(resDed.flatTax).toBeCloseTo(resBase.flatTax - 4400, 2);
    // Trinnskatt is on gross and remains unchanged
    expect(resDed.trinnskatt).toBeCloseTo(resBase.trinnskatt, 2);
  });

  it('maintains backwards compatibility with legacy AdvancedTaxInputs signature', () => {
    const legacyResult = calculateNoTax({
      primaryW2Income: 500000,
      taxYear: '2026',
    });
    expect(legacyResult.grossIncome).toBe(500000);
    expect(legacyResult.totalSocialContributions).toBeGreaterThan(0);
    expect(legacyResult.totalIncomeTax).toBeGreaterThan(0);
    expect(legacyResult.netIncome).toBeGreaterThan(0);
  });
});
