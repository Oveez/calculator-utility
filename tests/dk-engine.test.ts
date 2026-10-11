import { describe, it, expect } from 'vitest';
import { calculateDkTax } from '../src/utils/tax/dk-engine';

describe('Denmark Tax Engine', () => {
  it('calculates 2026 Danish taxes correctly for 500,000 DKK (national average)', () => {
    const result = calculateDkTax({ grossIncome: 500000, taxYear: '2026', regionCode: 'national_avg' });
    expect(result.grossIncome).toBe(500000);

    // 1. AM-bidrag (8% flat on gross) = 40,000 DKK
    expect(result.amBidrag).toBeCloseTo(40000, 2);

    // 2. Beskæftigelsesfradrag: 500,000 * 10.65% = 53,250 DKK (under 54,600 cap)
    expect(result.beskaeftigelsesfradrag).toBeCloseTo(53250, 2);

    // 3. Personfradrag: 54,100 DKK
    expect(result.personfradrag).toBe(54100);

    // 4. Total deductions: 54,100 + 53,250 = 107,350 DKK
    expect(result.standardDeduction).toBe(107350);

    // 5. Personal income = 460,000 DKK. Taxable income = 460,000 - 107,350 = 352,650 DKK
    expect(result.taxableIncome).toBe(352650);

    // 6. Base tax (Bundskat + Kommune 36.91%): 352,650 * 0.3691 = 130,163.12 DKK
    expect(result.totalIncomeTax).toBeCloseTo(130163.12, 1);

    // 7. Total taxes & Net income:
    expect(result.totalTax).toBeCloseTo(40000 + 130163.12, 1);
    expect(result.netIncome).toBeCloseTo(500000 - (40000 + 130163.12), 1);
  });

  it('applies Copenhagen municipality rate discount (-1.30%)', () => {
    const result = calculateDkTax({ grossIncome: 500000, taxYear: '2026', regionCode: 'copenhagen' });
    // Copenhagen base rate = 36.91% - 1.30% = 35.61%
    // Tax on 352,650 = 352,650 * 0.3561 = 125,578.67 DKK
    expect(result.totalIncomeTax).toBeCloseTo(352650 * (0.3691 - 0.013), 1);
  });

  it('applies statutory Beskæftigelsesfradrag cap and Mellemskat for high earner (800,000 DKK)', () => {
    const result = calculateDkTax({ grossIncome: 800000, taxYear: '2026' });

    // AM-bidrag = 64,000
    expect(result.amBidrag).toBe(64000);

    // Beskæftigelsesfradrag capped at 54,600 DKK
    expect(result.beskaeftigelsesfradrag).toBe(54600);

    // Taxable: (800,000 - 64,000) - (54,100 + 54,600) = 736,000 - 108,700 = 627,300 DKK
    expect(result.taxableIncome).toBe(627300);

    // Reaches Mellemskat bracket (> 587,100 DKK)
    expect(result.upperBracketTaxes).toBeGreaterThan(0);
    expect(result.netIncome).toBeLessThan(800000);
  });

  it('includes church tax when requested', () => {
    const withoutChurch = calculateDkTax({ grossIncome: 500000, taxYear: '2026', churchTax: false });
    const withChurch = calculateDkTax({ grossIncome: 500000, taxYear: '2026', churchTax: true });

    expect(withChurch.totalIncomeTax).toBeGreaterThan(withoutChurch.totalIncomeTax);
    expect(withChurch.churchTaxAmount).toBeCloseTo(withChurch.taxableIncome * 0.007, 1);
  });

  it('maintains backwards compatibility with legacy AdvancedTaxInputs signature', () => {
    const legacyResult = calculateDkTax({
      primaryW2Income: 450000,
      taxYear: '2026',
    });
    expect(legacyResult.grossIncome).toBe(450000);
    expect(legacyResult.amBidrag).toBeGreaterThan(0);
    expect(legacyResult.totalTax).toBeGreaterThan(0);
    expect(legacyResult.netIncome).toBeGreaterThan(0);
  });
});
