import { expect, test, describe } from 'vitest';
import { calculateSgTax, getCpfRules, getEarnedIncomeRelief } from '../src/utils/tax/sg-engine';

describe('Singapore Tax Engine', () => {
  test('CPF rules adhere to year-aware Ordinary Wage caps and age tiers', () => {
    // 2026 cap: $96,000 ($8,000/mo)
    const y2026_young = getCpfRules('2026', '55below');
    expect(y2026_young.rate).toBe(0.20);
    expect(y2026_young.annualCap).toBe(96000);

    // 2025 cap: $88,800 ($7,400/mo)
    const y2025_young = getCpfRules('2025', '55below');
    expect(y2025_young.rate).toBe(0.20);
    expect(y2025_young.annualCap).toBe(88800);

    // Age tiers (56-60: 15%, 61-65: 9.5%, 65+: 5%)
    expect(getCpfRules('2026', '56to60').rate).toBe(0.15);
    expect(getCpfRules('2026', '61to65').rate).toBe(0.095);
    expect(getCpfRules('2026', '65plus').rate).toBe(0.05);
  });

  test('Earned income relief scales with age', () => {
    expect(getEarnedIncomeRelief('55below')).toBe(1000);
    expect(getEarnedIncomeRelief('56to60')).toBe(6000);
    expect(getEarnedIncomeRelief('61to65')).toBe(8000);
    expect(getEarnedIncomeRelief('65plus')).toBe(8000);
  });

  test('Calculates low-income earner exempt from IRAS tax ($18,000)', () => {
    const result = calculateSgTax({ grossIncome: 18000, taxYear: '2026' });
    expect(result.grossIncome).toBe(18000);
    // CPF = 18000 * 20% = 3600
    expect(result.cpfContribution).toBe(3600);
    expect(result.earnedIncomeRelief).toBe(1000);
    // Chargeable = 18000 - 3600 - 1000 = 13400 <= 20000
    expect(result.chargeableIncome).toBe(13400);
    expect(result.incomeTax).toBe(0);
    expect(result.netIncomeAnnual).toBe(18000 - 3600);
  });

  test('Calculates 2026 tax correctly for 80,000 SGD gross income', () => {
    const result = calculateSgTax({ grossIncome: 80000, taxYear: '2026' });

    expect(result.grossIncome).toBe(80000);
    // CPF = 80,000 * 20% = 16,000
    expect(result.cpfContribution).toBe(16000);
    // Standard earned income relief = 1,000
    expect(result.earnedIncomeRelief).toBe(1000);
    // Chargeable = 80,000 - 16,000 - 1,000 = 63,000
    expect(result.chargeableIncome).toBe(63000);

    // Progressive tax:
    // 0 to 20k: 0
    // 20k to 30k (10k) @ 2% = 200
    // 30k to 40k (10k) @ 3.5% = 350
    // 40k to 63k (23k) @ 7% = 1610
    // Total = 2160
    expect(result.incomeTax).toBeCloseTo(2160, 2);
    expect(result.netIncomeAnnual).toBeCloseTo(80000 - 16000 - 2160, 2);
  });

  test('Year-aware CPF Ordinary Wage ceiling difference (2026 vs 2025) for high earner ($150,000)', () => {
    const res2026 = calculateSgTax({ grossIncome: 150000, taxYear: '2026' });
    const res2025 = calculateSgTax({ grossIncome: 150000, taxYear: '2025' });

    // 2026 ceiling is $96,000 ($8,000/mo) -> CPF is 19,200
    expect(res2026.cpfContribution).toBe(19200);
    // 2025 ceiling was $88,800 ($7,400/mo) -> CPF was 17,760
    expect(res2025.cpfContribution).toBe(17760);
  });

  test('Calculates senior employee (age 58) with higher relief and reduced CPF', () => {
    const result = calculateSgTax({
      grossIncome: 60000,
      taxYear: '2026',
      ageGroup: '56to60',
    });

    // CPF @ 15% = 9,000
    expect(result.cpfContribution).toBe(9000);
    // Relief = 6,000
    expect(result.earnedIncomeRelief).toBe(6000);
    // Chargeable = 60,000 - 9,000 - 6,000 = 45,000
    expect(result.chargeableIncome).toBe(45000);
    // Tax on 45,000: 200 + 350 + (5000 * 0.07 = 350) = 900
    expect(result.incomeTax).toBe(900);
  });
});
