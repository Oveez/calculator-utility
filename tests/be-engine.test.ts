import { describe, it, expect } from 'vitest';
import { calculateBeTax } from '../src/utils/tax/be-engine';

describe('BE Tax Engine', () => {
  it('calculates 2026 Belgian taxes correctly for €45,000 gross (commune 7%)', () => {
    const result = calculateBeTax({ grossIncome: 45000, taxYear: '2026', communeRate: 0.07 });
    expect(result.grossIncome).toBe(45000);

    // 1. ONSS (13.07% uncapped) = 45,000 * 0.1307 = 5,881.50
    expect(result.onss).toBeCloseTo(5881.5, 2);

    // 2. Frais professionnels (30% capped at €5,750):
    // Net after ONSS = 39,118.50. 30% of 39,118.50 = 11,735.55 -> Capped at 5,750
    expect(result.fraisProfessionnels).toBeCloseTo(5750, 2);

    // 3. Taxable net: 39,118.50 - 5,750 = 33,368.50
    expect(result.taxableIncome).toBeCloseTo(33368.5, 2);

    // 4. Taxable for brackets: 33,368.50 - 11,180 = 22,188.50
    // Federal IPP:
    // 0 - 5,540 (5,540) * 25% = 1,385.00
    // 5,540 - 18,330 (12,790) * 40% = 5,116.00
    // 18,330 - 22,188.50 (3,858.50) * 45% = 1,736.325
    // Federal Tax = 8,237.325
    expect(result.federalTax).toBeCloseTo(8237.325, 2);

    // 5. Commune tax (7%): 8,237.325 * 0.07 = 576.61
    expect(result.communeTax).toBeCloseTo(576.61, 2);
    expect(result.totalIncomeTax).toBeCloseTo(8237.325 + 576.61, 1);

    // 6. Net Take-Home: 45,000 - 5,881.50 - 8,813.94 = 30,304.56
    expect(result.netIncome).toBeCloseTo(30304.56, 1);
  });

  it('exempts low earner below quotité exemptée from income tax', () => {
    const result = calculateBeTax({ grossIncome: 15000, taxYear: '2026' });
    // ONSS: 15,000 * 13.07% = 1,960.50
    expect(result.onss).toBeCloseTo(1960.5, 2);
    // Frais pro: (15,000 - 1,960.50) * 30% = 3,911.85
    expect(result.fraisProfessionnels).toBeCloseTo(3911.85, 2);
    // Taxable net: 13,039.50 - 3,911.85 = 9,127.65 <= 11,180 Quotité exemptée
    expect(result.federalTax).toBe(0);
    expect(result.communeTax).toBe(0);
    expect(result.totalIncomeTax).toBe(0);
    expect(result.netIncome).toBeCloseTo(15000 - 1960.5, 2);
  });

  it('calculates zero communal tax when commune rate is 0%', () => {
    const result = calculateBeTax({ grossIncome: 60000, taxYear: '2026', communeRate: 0 });
    expect(result.communeTax).toBe(0);
    expect(result.totalIncomeTax).toBe(result.federalTax);
  });

  it('applies custom deductions in advanced mode', () => {
    const resBase = calculateBeTax({ grossIncome: 60000, taxYear: '2026', customDeductions: 0 });
    const resDed = calculateBeTax({ grossIncome: 60000, taxYear: '2026', customDeductions: 2000 });
    expect(resDed.taxableIncome).toBe(resBase.taxableIncome - 2000);
    expect(resDed.totalIncomeTax).toBeLessThan(resBase.totalIncomeTax);
  });

  it('maintains backwards compatibility with legacy AdvancedTaxInputs signature', () => {
    const legacyResult = calculateBeTax({
      primaryW2Income: 50000,
      taxYear: '2026',
    });
    expect(legacyResult.grossIncome).toBe(50000);
    expect(legacyResult.onss).toBeGreaterThan(0);
    expect(legacyResult.federalTax).toBeGreaterThan(0);
    expect(legacyResult.netIncome).toBeGreaterThan(0);
  });
});
