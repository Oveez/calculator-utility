import { describe, it, expect } from 'vitest';
import { calculateChTax } from '../src/utils/tax/ch-engine';

describe('CH Tax Engine', () => {
  it('calculates 2026 taxes correctly for CHF 100k gross (Zurich)', () => {
    const result = calculateChTax({ grossIncome: 100000, taxYear: '2026', regionCode: 'zh' });
    expect(result.grossIncome).toBe(100000);

    // AHV/IV/EO (5.3%) + ALV (1.1%) = 6.4% of 100k = 6,400
    expect(result.ahvContribution).toBeCloseTo(5300, 2);
    expect(result.alvContribution).toBeCloseTo(1100, 2);
    expect(result.totalSocialContributions).toBeCloseTo(6400, 2);

    // Taxable = 100,000 - 6,400 (social) - 15,400 (standard deduction) = 78,200
    expect(result.taxableIncome).toBe(78200);

    // Cantonal tax (Zurich 12%) = 78,200 * 0.12 = 9,384
    expect(result.cantonRate).toBe(0.12);
    expect(result.cantonalTax).toBeCloseTo(9384, 2);

    // Direct Federal Tax (Direkte Bundessteuer) on 78,200:
    // 0 - 17,800 (17,800) * 0.77% = 137.06
    // 17,800 - 29,700 (11,900) * 0.88% = 104.72
    // 29,700 - 44,000 (14,300) * 2.64% = 377.52
    // 44,000 - 60,600 (16,600) * 2.97% = 493.02
    // 60,600 - 78,200 (17,600) * 5.94% = 1,045.44
    // Total Federal: 137.06 + 104.72 + 377.52 + 493.02 + 1045.44 = 2,157.76
    expect(result.federalTax).toBeCloseTo(2157.76, 2);

    // Total tax and deductions
    const totalTax = 2157.76 + 9384;
    expect(result.totalIncomeTax).toBeCloseTo(totalTax, 2);
    expect(result.totalTaxAndDeductions).toBeCloseTo(totalTax + 6400, 2);
    expect(result.netIncomeAnnual).toBeCloseTo(100000 - (totalTax + 6400), 2);
  });

  it('calculates cantonal tax correctly for Geneva (17%)', () => {
    const result = calculateChTax({ grossIncome: 100000, taxYear: '2026', regionCode: 'ge' });
    expect(result.cantonRate).toBe(0.17);
    expect(result.taxableIncome).toBe(78200);
    // Cantonal tax = 78,200 * 0.17 = 13,294
    expect(result.cantonalTax).toBeCloseTo(13294, 2);
    expect(result.federalTax).toBeCloseTo(2157.76, 2);
  });

  it('applies statutory ALV cap for high income earner (CHF 200k)', () => {
    const result = calculateChTax({ grossIncome: 200000, taxYear: '2026', regionCode: 'zh' });

    // AHV uncapped: 5.3% of 200,000 = 10,600
    expect(result.ahvContribution).toBeCloseTo(10600, 2);
    // ALV capped at 148,200: 1.1% of 148,200 = 1,630.20
    expect(result.alvContribution).toBeCloseTo(1630.2, 2);
    // Total social = 10,600 + 1,630.20 = 12,230.20
    expect(result.totalSocialContributions).toBeCloseTo(12230.2, 2);
  });

  it('deducts Pillar 3a contributions up to statutory CHF 7,056 limit', () => {
    // Under the cap
    const resUnder = calculateChTax({ grossIncome: 100000, taxYear: '2026', regionCode: 'zh', pillar3a: 5000 });
    expect(resUnder.pillar3aDeduction).toBe(5000);
    expect(resUnder.taxableIncome).toBe(78200 - 5000);

    // Over the cap (capped at 7,056)
    const resOver = calculateChTax({ grossIncome: 100000, taxYear: '2026', regionCode: 'zh', pillar3a: 10000 });
    expect(resOver.pillar3aDeduction).toBe(7056);
    expect(resOver.taxableIncome).toBe(78200 - 7056);
  });

  it('calculates low income below standard threshold correctly', () => {
    // Zero income test
    const zeroRes = calculateChTax({ grossIncome: 0, taxYear: '2026', regionCode: 'zh' });
    expect(zeroRes.grossIncome).toBe(0);
    expect(zeroRes.taxableIncome).toBe(0);
    expect(zeroRes.federalTax).toBe(0);
    expect(zeroRes.cantonalTax).toBe(0);
    expect(zeroRes.totalTaxAndDeductions).toBe(0);
    expect(zeroRes.netIncomeAnnual).toBe(0);

    // Income below standard deduction (CHF 15,000)
    const lowRes = calculateChTax({ grossIncome: 15000, taxYear: '2026', regionCode: 'zh' });
    // Social: 15,000 * 6.4% = 960
    // Total deductions = 15,400 + 960 = 16,360 > 15,000 => Taxable income is 0
    expect(lowRes.taxableIncome).toBe(0);
    expect(lowRes.federalTax).toBe(0);
    expect(lowRes.cantonalTax).toBe(0);
    expect(lowRes.totalTaxAndDeductions).toBe(960);
    expect(lowRes.netIncomeAnnual).toBe(15000 - 960);
  });

  it('maintains backwards compatibility with legacy AdvancedTaxInputs signature', () => {
    const legacyResult = calculateChTax({
      primaryW2Income: 120000,
      taxYear: '2026',
      stateProvCode: 'zg',
    });
    expect(legacyResult.grossIncome).toBe(120000);
    expect(legacyResult.cantonRate).toBe(0.08); // Zug 8%
    expect(legacyResult.cantonalTax).toBeGreaterThan(0);
    expect(legacyResult.federalTax).toBeGreaterThan(0);
  });
});
