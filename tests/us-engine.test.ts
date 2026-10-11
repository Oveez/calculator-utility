import { describe, it, expect } from 'vitest';
import { calculateTaxForCountry, calculateAdvancedTax } from '../src/utils/tax/us-engine';
import { usProfile } from '../src/data/tax/countries/us';

describe('US Tax Calculation Engine (2026)', () => {
  it('should return zero tax for zero income', () => {
    const result = calculateTaxForCountry(usProfile, 0, { filingStatus: 'single' });
    expect(result.grossIncome).toBe(0);
    expect(result.taxableIncome).toBe(0);
    expect(result.totalIncomeTax).toBe(0);
    expect(result.totalSocialContributions).toBe(0);
    expect(result.netIncomeAnnual).toBe(0);
  });

  it('should return zero tax for income below standard deduction (Single)', () => {
    const standardDeduction = usProfile.years['2026'].filingStatuses?.single?.standardDeduction || 16100;
    const result = calculateTaxForCountry(usProfile, standardDeduction, { filingStatus: 'single' });
    expect(result.taxableIncome).toBe(0);
    expect(result.totalIncomeTax).toBe(0);
  });

  it('should calculate proper FICA (Social Security + Medicare) for $65,000 Single', () => {
    const result = calculateTaxForCountry(usProfile, 65000, { filingStatus: 'single' });
    const expectedFica = 65000 * 0.0765;
    expect(result.totalSocialContributions).toBeCloseTo(expectedFica, 2);
  });

  it('should cap Social Security tax for high earners and apply Additional Medicare Tax', () => {
    const SS_CAP = 184500; // 2026
    const SS_RATE = 0.062;
    const expectedMaxSS = SS_CAP * SS_RATE;
    const result = calculateAdvancedTax(usProfile, { 
      primaryW2Income: 250000, 
      filingStatus: 'single', 
      taxYear: '2026' 
    });
    
    // Total FICA = Max SS + Medicare (1.45% on all) + Additional Medicare (0.9% over $200k for single)
    const expectedMedicare = 250000 * 0.0145;
    const expectedAdditionalMedicare = (250000 - 200000) * 0.009;
    
    const expectedTotalFica = expectedMaxSS + expectedMedicare + expectedAdditionalMedicare;
    expect(result.totalFicaTax).toBeCloseTo(expectedTotalFica, 2);
  });
});
