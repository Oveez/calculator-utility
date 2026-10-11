import { describe, it, expect } from 'vitest';
import { calculateNzTax, calculateIetc, calculateAccLevy, calculateStudentLoan } from '../src/utils/tax/nz-engine';

describe('New Zealand Tax Engine', () => {
  it('IETC calculates correct credits across income zones', () => {
    // Under 24k: 0
    expect(calculateIetc(20000, true)).toBe(0);
    // 24k to 44k: full $520
    expect(calculateIetc(35000, true)).toBe(520);
    // 44k to 48k: $520 - (46,000 - 44,000) * 0.13 = 520 - 260 = 260
    expect(calculateIetc(46000, true)).toBe(260);
    // Over 48k: 0
    expect(calculateIetc(50000, true)).toBe(0);
    // Ineligible: 0
    expect(calculateIetc(35000, false)).toBe(0);
  });

  it('calculates student loan repayment on gross income over $24,128', () => {
    expect(calculateStudentLoan(20000, true)).toBe(0);
    // $50,000: (50000 - 24128) * 0.12 = 25872 * 0.12 = 3104.64
    expect(calculateStudentLoan(50000, true)).toBeCloseTo(3104.64, 2);
    expect(calculateStudentLoan(50000, false)).toBe(0);
  });

  it('calculates tax correctly for $80,000 income in 2026/27', () => {
    const result = calculateNzTax({
      grossIncome: 80000,
      taxYear: '2026/27',
      kiwiSaverRate: 0.03,
      hasAccLevy: true,
    });
    
    // Taxable Income: 80000
    // Brackets for 2026/27:
    // 0 to 15600 @ 10.5% = 1638
    // 15600 to 53500 (37900) @ 17.5% = 6632.5
    // 53500 to 78100 (24600) @ 30% = 7380
    // 78100 to 80000 (1900) @ 33% = 627
    // Total income tax = 16277.5
    expect(result.taxableIncome).toBe(80000);
    expect(result.payeNetTax).toBeCloseTo(16277.5, 1);
    
    // ACC Levy: 80000 * 1.75% = 1400
    // KiwiSaver: 80000 * 3% = 2400
    // Total Social = 3800
    expect(result.accLevy).toBeCloseTo(1400, 2);
    expect(result.kiwiSaver).toBe(2400);
    expect(result.totalSocialContributions).toBeCloseTo(3800, 2);
    
    // Total taxes = 16277.5 + 3800 = 20077.5
    expect(result.totalTaxAndDeductions).toBeCloseTo(20077.5, 1);
    
    // Net take home = 80000 - 20077.5 = 59922.5
    expect(result.netIncomeAnnual).toBeCloseTo(59922.5, 1);
  });

  it('calculates tax accurately with ACC Levy cap in 2026/27 vs 2025/26', () => {
    const res2026 = calculateNzTax({
      grossIncome: 200000,
      taxYear: '2026/27',
    });
    // 2026/27: ACC Cap is 156,641 @ 1.75% = 2741.2175
    expect(res2026.accLevy).toBeCloseTo(2741.22, 1);

    const res2025 = calculateNzTax({
      grossIncome: 200000,
      taxYear: '2025/26',
    });
    // 2025/26: ACC Cap was 142,283 @ 1.60% = 2276.528
    expect(res2025.accLevy).toBeCloseTo(2276.53, 1);
  });

  it('calculates full take-home including IETC and Student Loan on $35,000', () => {
    const result = calculateNzTax({
      grossIncome: 35000,
      taxYear: '2026/27',
      eligibleForIetc: true,
      hasStudentLoan: true,
      kiwiSaverRate: 0.03,
    });

    // PAYE gross:
    // 0 to 15.6k @ 10.5% = 1638
    // 15.6k to 35k (19.4k) @ 17.5% = 3395
    // PAYE Gross = 5033
    expect(result.payeGrossTax).toBeCloseTo(5033, 1);
    // IETC = $520
    expect(result.ietcCredit).toBe(520);
    // Net PAYE = 5033 - 520 = 4513
    expect(result.payeNetTax).toBeCloseTo(4513, 1);

    // ACC: 35000 * 0.0175 = 612.50
    expect(result.accLevy).toBeCloseTo(612.50, 1);
    // Kiwi: 35000 * 0.03 = 1050
    expect(result.kiwiSaver).toBe(1050);
    // Student Loan: (35000 - 24128) * 0.12 = 10872 * 0.12 = 1304.64
    expect(result.studentLoan).toBeCloseTo(1304.64, 2);

    // Net take-home = 35000 - 4513 - 612.50 - 1050 - 1304.64 = 27519.86
    expect(result.netIncomeAnnual).toBeCloseTo(27519.86, 1);
  });
});
