import { describe, it, expect } from 'vitest';
import { calculateSeTax } from '../src/utils/tax/se-engine';
import { seProfile } from '../src/data/tax/countries/se';

describe('calculateSeTax (Sweden Tax Engine)', () => {
  it('correctly calculates low-income salary with full Jobbskatteavdrag relief (50,000 SEK)', () => {
    const res = calculateSeTax({
      grossIncome: 50000,
      taxYear: '2026',
    });

    expect(res.grossIncome).toBe(50000);
    expect(res.grundavdrag).toBe(25000);
    expect(res.taxableIncome).toBe(25000);
    // Municipal tax on 25k @ 32.38% = 8,095
    expect(res.municipalTax).toBeCloseTo(8095, 0);
    expect(res.stateTax).toBe(0);
    // Pension fee @ 7% = 3,500
    expect(res.pensionFee).toBeCloseTo(3500, 0);
    // Jobbskatteavdrag reduces municipal tax to 0
    expect(res.jobbskatteavdrag).toBeCloseTo(8095, 0);
    expect(res.netIncomeTax).toBe(0);
    // Total deductions = 3,500 (pension fee only)
    expect(res.totalTax).toBeCloseTo(3500, 0);
    expect(res.netIncome).toBeCloseTo(46500, 0);
  });

  it('correctly calculates medium earner with statutory Jobbskatteavdrag (300,000 SEK in 2026)', () => {
    const res = calculateSeTax({
      grossIncome: 300000,
      taxYear: '2026',
    });

    expect(res.grossIncome).toBe(300000);
    expect(res.grundavdrag).toBe(25000);
    expect(res.taxableIncome).toBe(275000);
    // Municipal tax: 275k * 0.3238 = 89,045
    expect(res.municipalTax).toBeCloseTo(89045, 0);
    expect(res.stateTax).toBe(0);
    // Pension fee: 300k * 0.07 = 21,000
    expect(res.pensionFee).toBeCloseTo(21000, 0);
    // Jobbskatteavdrag underlag:
    // 1.813 * 59200 + 0.251 * (300000 - 3.24 * 59200) - 25000 = 109,485.8
    // Credit = 109,485.8 * 0.3238 ~ 35,451.5
    expect(res.jobbskatteavdrag).toBeCloseTo(35451.5, 0);
    // Total net tax & deductions
    expect(res.totalTax).toBeCloseTo(53593.5, 0);
    expect(res.netIncome).toBeCloseTo(246406.5, 0);
  });

  it('correctly applies state tax (Statlig skatt 20%) above 643,000 SEK skiktgräns (800,000 SEK)', () => {
    const res = calculateSeTax({
      grossIncome: 800000,
      taxYear: '2026',
    });

    expect(res.grossIncome).toBe(800000);
    expect(res.taxableIncome).toBe(775000);
    // State threshold is 643,000 SEK -> taxable state slice = 775,000 - 643,000 = 132,000
    // State tax = 132,000 * 0.20 = 26,400 SEK
    expect(res.stateTax).toBeCloseTo(26400, 0);
    // Pension fee capped at 643,000 * 0.07 = 45,010
    expect(res.pensionFee).toBeCloseTo(45010, 0);
    // Jobbskatteavdrag capped bracket: (3.027 * 59200 - 25000) * 0.3238 ~ 49,929
    expect(res.jobbskatteavdrag).toBeCloseTo(49929, 0);
    expect(res.totalTax).toBeCloseTo(227415.6, 0);
    expect(res.netIncome).toBeCloseTo(572584.4, 0);
  });

  it('correctly handles regional municipal tax differences (Stockholm 29.82%)', () => {
    const resStockholm = calculateSeTax({
      grossIncome: 400000,
      taxYear: '2026',
      municipality: 'stockholm',
    });

    const resAvg = calculateSeTax({
      grossIncome: 400000,
      taxYear: '2026',
      municipality: 'national_avg',
    });

    // Stockholm rate is ~2.56% lower than national average
    expect(resStockholm.municipalRate).toBeLessThan(resAvg.municipalRate);
    expect(resStockholm.netIncome).toBeGreaterThan(resAvg.netIncome);
  });

  it('handles zero gross income boundary condition gracefully', () => {
    const res = calculateSeTax({
      grossIncome: 0,
      taxYear: '2026',
    });

    expect(res.grossIncome).toBe(0);
    expect(res.netIncome).toBe(0);
    expect(res.totalTax).toBe(0);
    expect(res.pensionFee).toBe(0);
    expect(res.stateTax).toBe(0);
  });

  it('supports legacy AdvancedTaxInputs format seamlessly', () => {
    const legacyRes = calculateSeTax({
      primaryW2Income: 500000,
      taxYear: '2026',
      filingStatus: 'single',
    }, seProfile);

    expect(legacyRes.totalGrossIncome).toBe(500000);
    expect(legacyRes.adjustedGrossIncome).toBe(500000);
    expect(legacyRes.netAnnualTakeHome).toBeGreaterThan(390000);
  });
});
