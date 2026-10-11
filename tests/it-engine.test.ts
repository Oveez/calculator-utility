import { describe, it, expect } from 'vitest';
import { calculateItTax } from '../src/utils/tax/it-engine';

describe('Italy Tax Engine', () => {
  it('calculates tax for gross income 0', () => {
    const result = calculateItTax({ grossIncome: 0 });
    expect(result.grossIncome).toBe(0);
    expect(result.netIncomeAnnual).toBe(0);
    expect(result.totalIncomeTax).toBe(0);
    expect(result.inpsContribution).toBe(0);
  });

  it('calculates tax for gross income 20000', () => {
    const gross = 20000;
    const result = calculateItTax({ grossIncome: gross });
    
    // INPS = 20000 * 9.19% = 1838
    expect(result.inpsContribution).toBeCloseTo(1838, 0);
    
    // Taxable IRPEF = 20000 - 1838 = 18162
    expect(result.taxableIncomeIrpef).toBeCloseTo(18162, 0);
    
    // Gross IRPEF = 18162 * 23% = 4177.26
    expect(result.grossIrpef).toBeCloseTo(4177.26, 1);
    
    // Detrazione = 1910 + 1190 * ((28000 - 18162) / 13000) = 1910 + 1190 * 0.75677 = 2810.55
    expect(result.employeeTaxCredit).toBeCloseTo(2810.56, 1);
    
    // Net IRPEF = 4177.26 - 2810.56 = 1366.70
    expect(result.netIrpef).toBeCloseTo(1366.70, 1);
    
    // Regional = 18162 * 1.73% = 314.20
    expect(result.regionalSurcharge).toBeCloseTo(314.20, 1);
    
    // Municipal = 18162 * 0.8% = 145.30
    expect(result.municipalSurcharge).toBeCloseTo(145.30, 1);
    
    // Total Tax = 1366.70 + 314.20 + 145.30 = 1826.20
    expect(result.totalIncomeTax).toBeCloseTo(1826.20, 0);
    
    // Total Deductions = 1826.20 + 1838 = 3664.20
    // Net Income = 20000 - 3664.20 = 16335.80
    expect(result.netIncomeAnnual).toBeCloseTo(16335.80, 0);
  });
  
  it('calculates tax for gross income 40000', () => {
    const result = calculateItTax({ grossIncome: 40000 });
    // INPS = 40000 * 0.0919 = 3676
    expect(result.inpsContribution).toBeCloseTo(3676, 0);
    
    // Taxable IRPEF = 40000 - 3676 = 36324
    expect(result.taxableIncomeIrpef).toBeCloseTo(36324, 0);
    
    // Gross IRPEF = 28000 * 0.23 + (36324 - 28000) * 0.33
    // 6440 + 2746.92 = 9186.92
    expect(result.grossIrpef).toBeCloseTo(9186.92, 1);
    
    // Detrazione = 1910 * ((50000 - 36324) / 22000) = 1187.33
    expect(result.employeeTaxCredit).toBeCloseTo(1187.33, 1);
  });

  it('calculates low income with full detrazione and no-tax area (€8,000)', () => {
    const result = calculateItTax({ grossIncome: 8000 });
    // INPS = 8000 * 0.0919 = 735.20
    expect(result.inpsContribution).toBeCloseTo(735.20, 1);
    // Taxable = 7264.80
    expect(result.taxableIncomeIrpef).toBeCloseTo(7264.80, 1);
    // Gross IRPEF = 7264.80 * 0.23 = 1670.90
    expect(result.grossIrpef).toBeCloseTo(1670.90, 1);
    // Max detrazione = 1955
    expect(result.employeeTaxCredit).toBe(1955);
    // Net IRPEF is capped at 0
    expect(result.netIrpef).toBe(0);
  });

  it('calculates high income (€80,000) across 2026 and 2025 brackets', () => {
    // 2026: 2nd bracket rate is 33%
    const res2026 = calculateItTax({ grossIncome: 80000, taxYear: '2026' });
    expect(res2026.inpsContribution).toBeCloseTo(7352, 0);
    expect(res2026.taxableIncomeIrpef).toBeCloseTo(72648, 0);
    // Detrazione is 0 above 50,000 taxable income
    expect(res2026.employeeTaxCredit).toBe(0);
    // Gross IRPEF: 28000 * 0.23 (6440) + 22000 * 0.33 (7260) + (72648 - 50000) * 0.43 (9738.64) = 23438.64
    expect(res2026.grossIrpef).toBeCloseTo(23438.64, 1);
    expect(res2026.netIrpef).toBeCloseTo(23438.64, 1);

    // 2025: 2nd bracket rate was 35%
    const res2025 = calculateItTax({ grossIncome: 80000, taxYear: '2025' });
    // Gross IRPEF: 28000 * 0.23 (6440) + 22000 * 0.35 (7700) + (72648 - 50000) * 0.43 (9738.64) = 23878.64
    expect(res2025.grossIrpef).toBeCloseTo(23878.64, 1);
    expect(res2025.netIrpef).toBeCloseTo(23878.64, 1);
  });
});

