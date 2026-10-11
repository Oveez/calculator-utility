import { describe, it, expect } from 'vitest';
import { calculateEsTax } from '../src/utils/tax/es-engine';
import { esProfile } from '../src/data/tax/countries/es';

describe('Spain Tax Engine (es-engine)', () => {
  it('calculates 2026 taxes correctly with state/regional split', () => {
    const inputs = {
      taxYear: '2026',
      primaryW2Income: 50000,
    };
    const result = calculateEsTax(inputs, esProfile);

    // Gross = 50000
    // Social Security = 50000 * 0.0647 = 3235
    expect(result.totalSocialContributions).toBeCloseTo(3235, 1);

    // Mínimo personal = 5550
    // State tax = calcScale(50k) - calcScale(5550) 
    // State Brackets:
    // up to 12450 @ 9.5% = 1182.75
    // 12450-20200 (7750) @ 12% = 930
    // 20200-35200 (15000) @ 15% = 2250
    // 35200-50000 (14800) @ 18.5% = 2738
    // Gross state tax = 1182.75 + 930 + 2250 + 2738 = 7100.75
    // Credit = 5550 @ 9.5% = 527.25
    // Net state tax = 7100.75 - 527.25 = 6573.5
    
    // Regional is same in general region
    // Net regional tax = 6573.5
    // Total ordinary tax = 13147

    expect(result.totalOrdinaryTax).toBeCloseTo(13147, 1);
    expect(result.netTakeHome).toBeCloseTo(50000 - 13147 - 3235, 1);
  });
  
  it('applies social security cap', () => {
    const inputs = {
      taxYear: '2026',
      primaryW2Income: 70000,
    };
    const result = calculateEsTax(inputs, esProfile);
    
    // Cap is 61214.40, rate 6.47% => 3960.57
    expect(result.totalSocialContributions).toBeCloseTo(3960.57, 1);
  });

  it('adjusts regional IRPF for Comunidad de Madrid (-1.5% autonomous discount)', () => {
    const resultGeneral = calculateEsTax({ grossIncome: 50000, taxYear: '2026', regionCode: 'general' }, esProfile);
    const resultMadrid = calculateEsTax({ grossIncome: 50000, taxYear: '2026', regionCode: 'madrid' }, esProfile);

    // Madrid regional tax is reduced by 1.5% of taxable base = 50,000 * 0.015 = 750
    expect(resultMadrid.regionalTax).toBeCloseTo(resultGeneral.regionalTax - 750, 1);
    expect(resultMadrid.totalOrdinaryTax).toBeCloseTo(resultGeneral.totalOrdinaryTax - 750, 1);
  });

  it('calculates tax for low earner (€12,000) entirely within Tramo 1 (19%)', () => {
    const result = calculateEsTax({ grossIncome: 12000, taxYear: '2026', regionCode: 'general' }, esProfile);

    // Gross = 12,000 <= 12,450
    // Gross state: 12000 * 0.095 = 1140; Credit: 5550 * 0.095 = 527.25; Net state = 612.75
    // Regional is same: 612.75; Total ordinary = 1225.50
    expect(result.totalOrdinaryTax).toBeCloseTo(1225.50, 1);
  });
});
