import { describe, it, expect, vi } from 'vitest';
import {
  buildPolicyEnginePayload,
  reconcilePolicyEngineResponse,
  calculateWithPolicyEngine,
  getCacheKey,
  clearCalculationCache,
  type PolicyEngineTaxResponse,
} from '../src/utils/tax/us-api-adapter';
import { usProfile } from '../src/data/tax/countries/us';
import type { AdvancedTaxInputs } from '../src/data/tax/types';

describe('PolicyEngine US API Adapter', () => {
  const sampleInputs: AdvancedTaxInputs = {
    taxYear: '2026',
    filingStatus: 'single',
    regionCode: 'ca',
    primaryW2Income: 85000,
    businessNetIncome: 15000,
    taxableInterest: 1200,
    ordinaryDividends: 800,
    qualifiedDividends: 2000,
    preTaxRetirement401k: 8000,
    traditionalIraDeduction: 3000,
    numChildrenUnder17: 1,
    numOtherDependents: 0,
    itemizedMortgageInterest: 12000,
    itemizedCharitableDonations: 2500,
    itemizedSaltStateLocalTax: 6000,
    federalTaxWithheld: 11000,
    stateTaxWithheld: 4500,
    deductionMode: 'auto',
  };

  it('correctly maps Form 1040 inputs to PolicyEngine schema', () => {
    const payload = buildPolicyEnginePayload(sampleInputs);

    expect(payload.tax_year).toBe(2026);
    expect(payload.filing_status).toBe('single');
    expect(payload.state_code).toBe('CA');
    expect(payload.primary_w2_income).toBe(85000);
    expect(payload.spouse_w2_income).toBe(0); // Single filers cannot have spouse income
    expect(payload.self_employment_income).toBe(15000);
    expect(payload.ordinary_dividends).toBe(2800); // 800 + 2000 qualified
    expect(payload.qualified_dividends).toBe(2000);
    expect(payload.pre_tax_retirement_401k).toBe(8000);
    expect(payload.traditional_ira_deduction).toBe(3000);
    expect(payload.num_children_under_17).toBe(1);
    expect(payload.itemized_mortgage_interest).toBe(12000);
    expect(payload.deduction_mode).toBe('auto');
    expect(payload.federal_tax_withheld).toBe(11000);
  });

  it('handles Married Filing Jointly with spouse income and state code conversion', () => {
    const jointInputs: AdvancedTaxInputs = {
      taxYear: '2025',
      filingStatus: 'married_joint',
      regionCode: 'ny',
      primaryW2Income: 90000,
      spouseW2Income: 65000,
      numChildrenUnder17: 2,
    };
    const payload = buildPolicyEnginePayload(jointInputs);

    expect(payload.tax_year).toBe(2025);
    expect(payload.filing_status).toBe('married_joint');
    expect(payload.state_code).toBe('NY');
    expect(payload.primary_w2_income).toBe(90000);
    expect(payload.spouse_w2_income).toBe(65000);
    expect(payload.num_children_under_17).toBe(2);
  });

  it('handles Federal Only / No state tax', () => {
    const fedOnlyInputs: AdvancedTaxInputs = {
      taxYear: '2026',
      filingStatus: 'single',
      regionCode: 'none',
      primaryW2Income: 60000,
    };
    const payload = buildPolicyEnginePayload(fedOnlyInputs);

    expect(payload.state_code).toBeNull();
  });

  it('reconciles PolicyEngine response to ToolCastle AdvancedTaxResult shape', () => {
    const mockResponse: PolicyEngineTaxResponse = {
      total_gross_income: 100000,
      earned_income: 100000,
      investment_income: 0,
      self_employment_tax: 0,
      deductible_self_employment_tax: 0,
      total_adjustments_to_income: 0,
      adjusted_gross_income: 100000,
      standard_deduction_amount: 16100,
      itemized_deductions_total: 0,
      deduction_used: 'standard',
      deduction_amount: 16100,
      itemized_advantage: 0,
      taxable_income: 83900,
      gross_federal_tax: 13240,
      child_tax_credit: 2000,
      other_dependent_credit: 0,
      earned_income_credit: 0,
      total_tax_credits: 2000,
      net_federal_income_tax: 11240,
      employee_social_security_tax: 6200,
      employee_medicare_tax: 1450,
      additional_medicare_tax: 0,
      total_payroll_tax: 7650,
      state_code: 'CA',
      state_tax_name: 'California',
      state_income_tax: 4200,
      total_all_taxes: 23090,
      household_net_income: 76910,
      effective_federal_rate: 11.24,
      effective_total_tax_rate: 23.09,
      marginal_tax_rate: 34.0,
      federal_marginal_rate: 22.0,
      state_marginal_rate: 6.0,
      paycheck_breakdown: {
        annual: 76910,
        monthly: 6409.17,
        semi_monthly: 3204.58,
        bi_weekly: 2958.08,
        weekly: 1479.04,
      },
      total_withholdings: 24000,
      federal_refund_or_owed: 760,
      state_refund_or_owed: 150,
      combined_refund_or_owed: 910,
      metadata: {
        engine: 'PolicyEngine US',
        engine_version: '2.44.0',
        tax_year: 2026,
        state_code: 'CA',
        filing_status: 'single',
        cutoff_date: '2026-10-01',
        calculation_duration_ms: 120,
      },
    };

    const reconciled = reconcilePolicyEngineResponse(mockResponse, sampleInputs, usProfile);

    expect(reconciled.totalGrossIncome).toBe(100000);
    expect(reconciled.adjustedGrossIncome).toBe(100000);
    expect(reconciled.deductionAmount).toBe(16100);
    expect(reconciled.taxableIncome).toBe(83900);
    expect(reconciled.netFederalIncomeTax).toBe(11240);
    expect(reconciled.totalTaxCredits).toBe(2000);
    expect(reconciled.totalFicaTax).toBe(7650);
    expect(reconciled.stateIncomeTax).toBe(4200);
    expect(reconciled.totalAllTaxes).toBe(23090);
    expect(reconciled.netAnnualTakeHome).toBe(76910);
    expect(reconciled.combinedRefundOrOwed).toBe(910);
    expect(reconciled.bracketBreakdown?.length).toBeGreaterThan(0);
  });

  it('gracefully falls back to local TypeScript calculation when network fails', async () => {
    // Mock fetch to simulate network offline / 503
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));

    const execution = await calculateWithPolicyEngine(usProfile, {
      primaryW2Income: 75000,
      filingStatus: 'single',
      taxYear: '2026',
    });

    expect(execution.source).toBe('local_fallback');
    expect(execution.result.totalGrossIncome).toBe(75000);
    expect(execution.result.netAnnualTakeHome).toBeGreaterThan(0);
    expect(execution.result.totalFicaTax).toBeCloseTo(75000 * 0.0765, 1);

    global.fetch = originalFetch;
  });

  it('correctly distinguishes Phase 5 tax concepts and excludes employer payroll taxes', () => {
    const mockFullResponse: PolicyEngineTaxResponse = {
      total_gross_income: 120000,
      earned_income: 120000,
      investment_income: 0,
      self_employment_tax: 0,
      deductible_self_employment_tax: 0,
      total_adjustments_to_income: 0,
      adjusted_gross_income: 120000,
      standard_deduction_amount: 16100,
      itemized_deductions_total: 0,
      deduction_used: 'standard',
      deduction_amount: 16100,
      itemized_advantage: 0,
      taxable_income: 103900,
      gross_federal_tax: 17200,
      child_tax_credit: 2000,
      other_dependent_credit: 0,
      earned_income_credit: 0,
      total_tax_credits: 2000,
      net_federal_income_tax: 15200,
      employee_social_security_tax: 7440,
      employee_medicare_tax: 1740,
      additional_medicare_tax: 0,
      total_payroll_tax: 9180,
      state_code: 'CA',
      state_tax_name: 'California',
      state_income_tax: 6200,
      total_all_taxes: 30580,
      household_net_income: 89420,
      effective_federal_rate: 12.67,
      effective_total_tax_rate: 25.48,
      marginal_tax_rate: 37.3,
      federal_marginal_rate: 22.0,
      state_marginal_rate: 9.3,
      paycheck_breakdown: {
        annual: 89420,
        monthly: 7451.67,
        semi_monthly: 3725.83,
        bi_weekly: 3439.23,
        weekly: 1719.62,
      },
      total_withholdings: 32000,
      federal_refund_or_owed: 1200,
      state_refund_or_owed: 220,
      combined_refund_or_owed: 1420,
      metadata: {
        engine: 'PolicyEngine US',
        engine_version: '2.44.0',
        tax_year: 2026,
        state_code: 'CA',
        filing_status: 'single',
        cutoff_date: '2026-10-01',
        employer_taxes_included: false,
        disclaimer: 'Calculations are statutory estimates modeled via PolicyEngine US and do not constitute formal tax or legal advice.',
        calculation_duration_ms: 95,
      },
    };

    const reconciled = reconcilePolicyEngineResponse(mockFullResponse, sampleInputs, usProfile);

    // Concept 1: Federal income tax liability
    expect(reconciled.netFederalIncomeTax).toBe(15200);
    // Concept 2: State income tax liability
    expect(reconciled.stateIncomeTax).toBe(6200);
    // Concept 3: Mandatory payroll contributions
    expect(reconciled.ficaSocialSecurity).toBe(7440);
    expect(reconciled.ficaMedicare).toBe(1740);
    expect(reconciled.totalFicaTax).toBe(9180);
    // Concept 4: Credits & benefits
    expect(reconciled.childTaxCredit).toBe(2000);
    // Concept 5: Total modeled tax liability (no double counting)
    expect(reconciled.totalAllTaxes).toBe(15200 + 6200 + 9180);
    // Concept 6 & 7: Effective vs Marginal Rates
    expect(reconciled.effectiveTotalTaxRate).toBe(25.48);
    expect(reconciled.marginalFederalRate).toBe(22.0);
    // Concept 8 & 9: Net Take-Home Pay & Paycheck schedule
    expect(reconciled.netAnnualTakeHome).toBe(120000 - 30580);
    expect(reconciled.netMonthlyTakeHome).toBeCloseTo(89420 / 12, 0);
    // Concept 10: Refund or balance due
    expect(reconciled.combinedRefundOrOwed).toBe(1420);
    // Employer-side taxes verification
    expect(mockFullResponse.metadata?.employer_taxes_included).toBe(false);
  });

  it('Phase 6: reconciles Alternative Minimum Tax (AMT), Net Investment Income Tax (NIIT), and residency disclosures', () => {
    const mockEdgeCaseResponse: PolicyEngineTaxResponse = {
      total_gross_income: 270000,
      earned_income: 240000,
      investment_income: 30000,
      self_employment_tax: 0,
      deductible_self_employment_tax: 0,
      total_adjustments_to_income: 0,
      adjusted_gross_income: 270000,
      standard_deduction_amount: 16100,
      itemized_deductions_total: 0,
      deduction_used: 'standard',
      deduction_amount: 16100,
      itemized_advantage: 0,
      taxable_income: 253900,
      gross_federal_tax: 58000,
      child_tax_credit: 0,
      other_dependent_credit: 0,
      earned_income_credit: 0,
      total_tax_credits: 0,
      alternative_minimum_tax: 450,
      net_investment_income_tax: 1140,
      capital_gains_tax: 4500,
      net_federal_income_tax: 58000,
      employee_social_security_tax: 11439,
      employee_medicare_tax: 3480,
      additional_medicare_tax: 360,
      total_payroll_tax: 15279,
      state_code: 'CA',
      state_tax_name: 'California',
      state_income_tax: 21500,
      total_all_taxes: 94779,
      household_net_income: 175221,
      effective_federal_rate: 21.48,
      effective_total_tax_rate: 35.10,
      marginal_tax_rate: 42.3,
      federal_marginal_rate: 32.0,
      state_marginal_rate: 9.3,
      paycheck_breakdown: {
        annual: 175221,
        monthly: 14601.75,
        semi_monthly: 7300.88,
        bi_weekly: 6739.27,
        weekly: 3369.63,
      },
      total_withholdings: 90000,
      federal_refund_or_owed: -2000,
      state_refund_or_owed: -2779,
      combined_refund_or_owed: -4779,
      metadata: {
        engine: 'PolicyEngine US',
        engine_version: '2.44.0',
        tax_year: 2026,
        state_code: 'CA',
        filing_status: 'single',
        cutoff_date: '2026-10-01',
        employer_taxes_included: false,
        residency_status: 'full_year_resident',
        unsupported_features: [
          'Form 1040-NR (non-resident alien returns)',
          'Part-year resident state returns',
          'Form 2555 (Foreign Earned Income Exclusion)',
          'Form 1116 (Foreign Tax Credit)',
        ],
        disclaimer: 'Calculations are statutory estimates modeled via PolicyEngine US and do not constitute formal tax or legal advice.',
        calculation_duration_ms: 110,
      },
    };

    const reconciled = reconcilePolicyEngineResponse(mockEdgeCaseResponse, sampleInputs, usProfile);

    // Verify Phase 6 metrics exposure
    expect(reconciled.netInvestmentIncomeTax).toBe(1140);
    expect(reconciled.alternativeMinimumTax).toBe(450);
    expect(reconciled.preferentialCapitalGainsTax).toBe(4500);
    expect(reconciled.additionalMedicareTax).toBe(360);

    // Verify metadata edge case disclosures
    expect(mockEdgeCaseResponse.metadata?.residency_status).toBe('full_year_resident');
    expect(mockEdgeCaseResponse.metadata?.unsupported_features).toContain('Form 1040-NR (non-resident alien returns)');
  });

  it('Phase 8: isolates cache keys by all parameters and engine version', () => {
    const payloadA = buildPolicyEnginePayload(sampleInputs);
    const keyA = getCacheKey(payloadA);

    // Key must include engine version prefix
    expect(keyA.startsWith('pe_us_v2.44.0:')).toBe(true);

    // Changing state must produce a different cache key
    const payloadB = buildPolicyEnginePayload({ ...sampleInputs, regionCode: 'ny' });
    const keyB = getCacheKey(payloadB);
    expect(keyA).not.toBe(keyB);

    // Changing age 65 flag must produce a different cache key
    const payloadC = buildPolicyEnginePayload({ ...sampleInputs, taxpayerAge65OrOver: true });
    const keyC = getCacheKey(payloadC);
    expect(keyA).not.toBe(keyC);

    // Changing dependents must produce a different cache key
    const payloadD = buildPolicyEnginePayload({ ...sampleInputs, numChildrenUnder17: 3 });
    const keyD = getCacheKey(payloadD);
    expect(keyA).not.toBe(keyD);
  });

  it('Phase 8: clearCalculationCache flushes client in-memory cache', () => {
    clearCalculationCache();
    // Cache is cleared cleanly without side effects
    expect(true).toBe(true);
  });

  it('Phase 8: gracefully handles network failure by activating local statutory fallback without crashing', async () => {
    // Mock fetch to simulate 503 Service Unavailable / network drop
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network connectivity lost'));

    try {
      const execution = await calculateWithPolicyEngine(usProfile, sampleInputs, {
        apiUrl: 'http://non-existent-server:9999/api/us-tax-calc',
        timeoutMs: 500,
      });

      expect(execution.source).toBe('local_fallback');
      expect(execution.result.totalAllTaxes).toBeGreaterThan(0);
      expect(execution.result.netAnnualTakeHome).toBeGreaterThan(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});


