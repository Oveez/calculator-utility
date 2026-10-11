import { describe, it, expect } from 'vitest';
import {
  calculateMxTax,
  calculateSubsidioEmpleo,
  calculateImss,
} from '../src/utils/tax/mx-engine';

describe('Mexico Tax Engine', () => {
  it('Subsidio para el empleo applies to workers earning under $108,972 MXN/yr', () => {
    // Under threshold: receives 2026 subsidy (~$5,058/yr)
    expect(calculateSubsidioEmpleo(80000, '2026')).toBeCloseTo(5058.33, 0);
    // Over threshold: 0
    expect(calculateSubsidioEmpleo(150000, '2026')).toBe(0);
  });

  it('calculates low-income earner benefiting from Subsidio para el empleo ($80,000)', () => {
    const result = calculateMxTax({ grossIncome: 80000, taxYear: '2026' });

    expect(result.grossIncome).toBe(80000);
    // Gross ISR: 9600 * 1.92% (184.32) + (80000 - 9600) * 6.40% (4505.60) = 4689.92
    expect(result.grossIsr).toBeCloseTo(4689.92, 1);
    // Subsidio is ~$5,058, which completely eliminates ISR
    expect(result.subsidioEmpleo).toBeCloseTo(5058.33, 0);
    expect(result.netIsr).toBe(0);

    // IMSS = 80,000 * 2.725% = 2,180
    expect(result.imssContribution).toBe(2180);
    expect(result.netIncomeAnnual).toBe(80000 - 2180);
  });

  it('calculates 2026 tax correctly for $300,000 MXN salary employee', () => {
    const result = calculateMxTax({ grossIncome: 300000, taxYear: '2026' });

    expect(result.grossIncome).toBe(300000);
    expect(result.subsidioEmpleo).toBe(0); // Over $108,972 threshold

    // Gross ISR = 42,678.72
    expect(result.grossIsr).toBeCloseTo(42678.72, 1);
    expect(result.netIsr).toBeCloseTo(42678.72, 1);

    // IMSS: 300,000 * 2.725% = 8,175
    expect(result.imssContribution).toBe(8175);

    // Total deductions = 42,678.72 + 8,175 = 50,853.72
    expect(result.totalTaxAndDeductions).toBeCloseTo(50853.72, 1);
    expect(result.netIncomeAnnual).toBeCloseTo(249146.28, 1);
  });

  it('applies statutory 25 UMA IMSS contribution cap for high income ($1,500,000 MXN)', () => {
    const res2026 = calculateMxTax({ grossIncome: 1500000, taxYear: '2026' });
    // 2026: 25 UMAs cap = $1,070,453.75 * 2.725% = $29,169.86
    expect(res2026.imssContribution).toBeCloseTo(29169.86, 1);

    const res2025 = calculateMxTax({ grossIncome: 1500000, taxYear: '2025' });
    // 2025: cap = $980,000 * 2.725% = $26,705.00
    expect(res2025.imssContribution).toBeCloseTo(26705.00, 1);
  });

  it('allows personal deductions within statutory 15% limit', () => {
    const result = calculateMxTax({
      grossIncome: 400000,
      taxYear: '2026',
      personalDeductions: 30000,
    });

    expect(result.personalDeductions).toBe(30000);
    expect(result.taxableIncome).toBe(370000);
  });
});
