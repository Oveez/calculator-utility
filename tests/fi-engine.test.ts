import { describe, it, expect } from 'vitest';
import { calculateFiTax } from '../src/utils/tax/fi-engine';

describe('Finland Tax Engine', () => {
  it('calculates 2026 Finnish taxes correctly for €50,000 gross (national average kunta 7.50%)', () => {
    const result = calculateFiTax({ grossIncome: 50000, taxYear: '2026', regionCode: 'national_avg' });
    expect(result.grossIncome).toBe(50000);

    // 1. Employee social contributions (9.19%)
    // Pension (7.30%) = 3,650; Unemployment (0.79%) = 395; Health (1.10%) = 550; Total = 4,595
    expect(result.pensionContribution).toBeCloseTo(3650, 2);
    expect(result.unemploymentContribution).toBeCloseTo(395, 2);
    expect(result.healthContribution).toBeCloseTo(550, 2);
    expect(result.totalSocialContributions).toBeCloseTo(4595, 2);

    // 2. Statutory Tulonhankkimisvähennys (standard work deduction) = €750
    expect(result.tulonhankkimisvahennys).toBe(750);

    // 3. Net earned income: 50,000 - 4,595 - 750 = 44,655
    expect(result.taxableIncome).toBeCloseTo(44655, 2);

    // 4. Perusvähennys: completely phased out above €26,222
    expect(result.perusvahennys).toBe(0);

    // 5. Työtulovähennys (Earned Income Tax Credit):
    // Base: min((50,000 - 2,500) * 12%, 2,140) = 2,140
    // Phase-out: (50,000 - 22,000) * 4.5% = 1,260
    // Credit = 2,140 - 1,260 = 880 EUR
    expect(result.tyotulovahennys).toBeCloseTo(880, 2);

    // 6. State Tax (Valtionvero) on 44,655 - 22,000 = 22,655
    // 0 - 10,600 @ 19% = 2,014.00
    // 10,600 - 18,100 (7,500) @ 30.25% = 2,268.75
    // 18,100 - 22,655 (4,555) @ 33.25% = 1,514.54
    // Gross state tax = 5,797.29 EUR
    // Municipal tax: 44,655 * 7.50% = 3,349.13 EUR
    // Total income tax after 880 EUR credit = 5,797.29 + 3,349.13 - 880 = 8,266.41 EUR
    expect(result.totalIncomeTax).toBeCloseTo(8266.41, 1);

    // 7. Total taxes & Net income:
    expect(result.totalTax).toBeCloseTo(8266.41 + 4595, 1);
    expect(result.netIncome).toBeCloseTo(50000 - (8266.41 + 4595), 1);
  });

  it('calculates Perusvähennys correctly for low income (€15,000 gross)', () => {
    const result = calculateFiTax({ grossIncome: 15000, taxYear: '2026' });

    // Social = 15,000 * 9.19% = 1,378.50
    // Net earned = 15,000 - 1,378.50 - 750 = 12,871.50
    // Perusvähennys = 4,000 - (12,871.50 - 4,000) * 0.18 = 4,000 - 1,596.87 = 2,403.13 EUR
    expect(result.perusvahennys).toBeCloseTo(2403.13, 1);
    expect(result.stateTax).toBe(0); // below €22,000 threshold
  });

  it('calculates municipal tax variation between Helsinki (5.30%) and Tampere (7.60%)', () => {
    const resHelsinki = calculateFiTax({ grossIncome: 50000, taxYear: '2026', regionCode: 'helsinki' });
    const resTampere = calculateFiTax({ grossIncome: 50000, taxYear: '2026', regionCode: 'tampere' });

    expect(resHelsinki.totalIncomeTax).toBeLessThan(resTampere.totalIncomeTax);
    expect(resHelsinki.netIncome).toBeGreaterThan(resTampere.netIncome);
  });

  it('includes church tax when selected', () => {
    const withoutChurch = calculateFiTax({ grossIncome: 50000, taxYear: '2026', churchTax: false });
    const withChurch = calculateFiTax({ grossIncome: 50000, taxYear: '2026', churchTax: true });

    expect(withChurch.totalIncomeTax).toBeGreaterThan(withoutChurch.totalIncomeTax);
    expect(withChurch.churchTaxAmount).toBeCloseTo(withChurch.taxableIncome * 0.01, 1);
  });

  it('maintains backwards compatibility with legacy AdvancedTaxInputs signature', () => {
    const legacyResult = calculateFiTax({
      primaryW2Income: 45000,
      taxYear: '2026',
    });
    expect(legacyResult.grossIncome).toBe(45000);
    expect(legacyResult.totalSocialContributions).toBeGreaterThan(0);
    expect(legacyResult.totalIncomeTax).toBeGreaterThan(0);
    expect(legacyResult.netIncome).toBeGreaterThan(0);
  });
});
