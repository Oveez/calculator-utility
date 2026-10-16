import type {
  AdvancedTaxInputs,
  AdvancedTaxResult,
  CountryTaxProfile,
} from '../../data/tax/types';
import { calculateAdvancedTax } from './us-engine';

/**
 * PolicyEngine US Calculation API Request Payload Schema
 */
export interface PolicyEngineTaxRequest {
  tax_year: number;
  filing_status: 'single' | 'married_joint' | 'married_separate' | 'head_of_household' | 'qualifying_widow';
  state_code: string | null;
  primary_w2_income: number;
  spouse_w2_income: number;
  self_employment_income: number;
  taxable_interest: number;
  ordinary_dividends: number;
  qualified_dividends: number;
  long_term_capital_gains: number;
  other_income: number;
  num_children_under_17: number;
  num_other_dependents: number;
  taxpayer_age_65_or_over: boolean;
  spouse_age_65_or_over: boolean;
  taxpayer_blind: boolean;
  spouse_blind: boolean;
  pre_tax_retirement_401k: number;
  traditional_ira_deduction: number;
  hsa_deduction: number;
  student_loan_interest: number;
  deduction_mode: 'auto' | 'standard' | 'itemized';
  itemized_mortgage_interest: number;
  itemized_charitable_donations: number;
  itemized_real_estate_taxes: number;
  itemized_state_local_tax: number;
  itemized_medical_expenses: number;
  federal_tax_withheld: number;
  state_tax_withheld: number;
}

/**
 * PolicyEngine US Calculation API Response Payload Schema
 */
export interface PolicyEngineTaxResponse {
  total_gross_income: number;
  earned_income: number;
  investment_income: number;
  self_employment_tax: number;
  deductible_self_employment_tax: number;
  total_adjustments_to_income: number;
  adjusted_gross_income: number;
  standard_deduction_amount: number;
  itemized_deductions_total: number;
  deduction_used: 'standard' | 'itemized';
  deduction_amount: number;
  itemized_advantage: number;
  taxable_income: number;
  gross_federal_tax: number;
  child_tax_credit: number;
  other_dependent_credit: number;
  earned_income_credit: number;
  total_tax_credits: number;
  alternative_minimum_tax?: number;
  net_investment_income_tax?: number;
  capital_gains_tax?: number;
  net_federal_income_tax: number;
  employee_social_security_tax: number;
  employee_medicare_tax: number;
  additional_medicare_tax: number;
  total_payroll_tax: number;
  state_code: string | null;
  state_tax_name: string;
  state_income_tax: number;
  total_all_taxes: number;
  household_net_income: number;
  effective_federal_rate: number;
  effective_total_tax_rate: number;
  marginal_tax_rate: number;
  federal_marginal_rate: number;
  state_marginal_rate: number;
  paycheck_breakdown: {
    annual: number;
    monthly: number;
    semi_monthly: number;
    bi_weekly: number;
    weekly: number;
  };
  total_withholdings: number;
  federal_refund_or_owed: number;
  state_refund_or_owed: number;
  combined_refund_or_owed: number;
  metadata?: {
    engine: string;
    engine_version: string;
    tax_year: number;
    state_code: string | null;
    filing_status: string;
    cutoff_date: string;
    employer_taxes_included?: boolean;
    residency_status?: string;
    unsupported_features?: string[];
    disclaimer?: string;
    calculation_duration_ms: number;
  };
}

export interface CalculationExecutionResult {
  result: AdvancedTaxResult;
  source: 'policyengine_api' | 'local_fallback';
  latencyMs: number;
  engineVersion?: string;
}

/**
 * In-memory LRU calculation cache to avoid duplicate network roundtrips.
 * Privacy guarantee: Stored purely in ephemeral client memory; never persisted to localStorage or cookies.
 */
const calculationCache = new Map<string, PolicyEngineTaxResponse>();
const MAX_CACHE_SIZE = 100;
const ENGINE_CACHE_PREFIX = 'pe_us_v2.44.0:';

export function getCacheKey(payload: PolicyEngineTaxRequest): string {
  return ENGINE_CACHE_PREFIX + JSON.stringify(payload);
}

export function clearCalculationCache(): void {
  calculationCache.clear();
}

function setCache(key: string, data: PolicyEngineTaxResponse): void {
  if (calculationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = calculationCache.keys().next().value;
    if (firstKey) calculationCache.delete(firstKey);
  }
  calculationCache.set(key, data);
}

/**
 * Transforms Form 1040 inputs into the strict PolicyEngine request contract.
 */
export function buildPolicyEnginePayload(inputs: AdvancedTaxInputs): PolicyEngineTaxRequest {
  const rawYear = parseInt(inputs.taxYear || '2026', 10);
  const taxYear = rawYear === 2025 ? 2025 : 2026;

  const validStatuses = ['single', 'married_joint', 'married_separate', 'head_of_household', 'qualifying_widow'];
  const filingStatus = validStatuses.includes(inputs.filingStatus)
    ? (inputs.filingStatus as PolicyEngineTaxRequest['filing_status'])
    : 'single';

  const isJoint = filingStatus === 'married_joint';
  const region = inputs.regionCode?.trim().toUpperCase();
  const stateCode = region && region !== 'NONE' && region !== '' ? region : null;

  return {
    tax_year: taxYear,
    filing_status: filingStatus,
    state_code: stateCode,
    primary_w2_income: Math.max(0, inputs.primaryW2Income || 0),
    spouse_w2_income: isJoint ? Math.max(0, inputs.spouseW2Income || 0) : 0,
    self_employment_income: Math.max(0, inputs.businessNetIncome || 0),
    taxable_interest: Math.max(0, inputs.taxableInterest || 0),
    ordinary_dividends: Math.max(0, (inputs.ordinaryDividends || 0) + (inputs.qualifiedDividends || 0)),
    qualified_dividends: Math.max(0, inputs.qualifiedDividends || 0),
    long_term_capital_gains: Math.max(0, inputs.longTermCapitalGains || 0),
    other_income: Math.max(0, inputs.otherIncome || 0),
    num_children_under_17: Math.max(0, Math.min(15, inputs.numChildrenUnder17 || 0)),
    num_other_dependents: Math.max(0, Math.min(15, inputs.numOtherDependents || 0)),
    taxpayer_age_65_or_over: Boolean(inputs.taxpayerAge65OrOver),
    spouse_age_65_or_over: isJoint ? Boolean(inputs.spouseAge65OrOver) : false,
    taxpayer_blind: Boolean(inputs.taxpayerBlind),
    spouse_blind: isJoint ? Boolean(inputs.spouseBlind) : false,
    pre_tax_retirement_401k: Math.max(0, inputs.preTaxRetirement401k || 0),
    traditional_ira_deduction: Math.max(0, inputs.traditionalIraDeduction || 0),
    hsa_deduction: Math.max(0, inputs.hsaDeduction || 0),
    student_loan_interest: Math.max(0, inputs.studentLoanInterest || 0),
    deduction_mode: inputs.deductionMode || 'auto',
    itemized_mortgage_interest: Math.max(0, inputs.itemizedMortgageInterest || 0),
    itemized_charitable_donations: Math.max(0, inputs.itemizedCharitableDonations || 0),
    itemized_real_estate_taxes: Math.max(0, inputs.itemizedPropertyTax || 0),
    itemized_state_local_tax: Math.max(0, inputs.itemizedSaltStateLocalTax || 0),
    itemized_medical_expenses: Math.max(0, inputs.itemizedMedicalDentalExpenses || 0),
    federal_tax_withheld: Math.max(0, inputs.federalTaxWithheld || 0),
    state_tax_withheld: Math.max(0, inputs.stateTaxWithheld || 0),
  };
}

/**
 * Reconciles PolicyEngine API response with ToolCastle's AdvancedTaxResult UI data shape.
 */
export function reconcilePolicyEngineResponse(
  pe: PolicyEngineTaxResponse,
  inputs: AdvancedTaxInputs,
  profile: CountryTaxProfile
): AdvancedTaxResult {
  const agi = pe.adjusted_gross_income;
  const prefGains = (inputs.qualifiedDividends || 0) + (inputs.longTermCapitalGains || 0);
  const taxableIncome = pe.taxable_income;
  const prefTaxable = Math.min(taxableIncome, prefGains);
  const ordinaryTaxable = Math.max(0, taxableIncome - prefTaxable);

  // Compute SALT and Medical allowed amounts for display transparency
  const saltRaw = (inputs.itemizedSaltStateLocalTax || 0) + (inputs.itemizedPropertyTax || 0);
  const itemizedSaltAllowed = Math.min(10000, saltRaw);
  const medicalRaw = Math.max(0, inputs.itemizedMedicalDentalExpenses || 0);
  const itemizedMedicalAllowed = Math.max(0, medicalRaw - 0.075 * agi);

  // Build bracket breakdown for display table
  const selectedYear = inputs.taxYear && profile.years[inputs.taxYear] ? inputs.taxYear : profile.defaultTaxYear;
  const yearData = profile.years[selectedYear] || profile.years[profile.defaultTaxYear];
  const fsConfig = yearData.filingStatuses?.[inputs.filingStatus];
  const activeBrackets = fsConfig?.brackets || yearData.nationalBrackets || [];

  const bracketBreakdown = activeBrackets.map((b) => {
    const threshold = b.threshold;
    const upTo = b.upTo;
    const rate = b.rate;
    const range = upTo !== undefined ? `$${threshold.toLocaleString()} – $${upTo.toLocaleString()}` : `Over $${threshold.toLocaleString()}`;
    if (ordinaryTaxable > threshold) {
      const taxableInBracket = upTo !== undefined ? Math.min(ordinaryTaxable, upTo) - threshold : ordinaryTaxable - threshold;
      return {
        bracketRange: range,
        ratePercent: `${(rate * 100).toFixed(1)}%`,
        taxableInBracket,
        taxAmount: taxableInBracket * rate,
      };
    }
    return {
      bracketRange: range,
      ratePercent: `${(rate * 100).toFixed(1)}%`,
      taxableInBracket: 0,
      taxAmount: 0,
    };
  });

  return {
    totalGrossIncome: pe.total_gross_income,
    earnedIncome: pe.earned_income,
    investmentIncome: pe.investment_income,
    selfEmploymentTax: pe.self_employment_tax,
    deductibleSelfEmploymentTax: pe.deductible_self_employment_tax,
    totalAdjustmentsToIncome: pe.total_adjustments_to_income,
    adjustedGrossIncome: pe.adjusted_gross_income,
    standardDeductionAmount: pe.standard_deduction_amount,
    itemizedDeductionsTotal: pe.itemized_deductions_total,
    itemizedSaltAllowed,
    itemizedMedicalAllowed,
    deductionUsed: pe.deduction_used,
    deductionAmount: pe.deduction_amount,
    itemizedAdvantage: pe.itemized_advantage,
    taxableIncome: pe.taxable_income,
    ordinaryTaxableIncome: ordinaryTaxable,
    preferentialTaxableIncome: prefTaxable,
    regularIncomeTax: Math.max(0, pe.gross_federal_tax),
    preferentialCapitalGainsTax: pe.capital_gains_tax ?? 0,
    additionalMedicareTax: pe.additional_medicare_tax,
    netInvestmentIncomeTax: pe.net_investment_income_tax ?? 0,
    alternativeMinimumTax: pe.alternative_minimum_tax ?? 0,
    grossFederalTax: pe.gross_federal_tax,
    childTaxCredit: pe.child_tax_credit,
    otherDependentCredit: pe.other_dependent_credit,
    totalTaxCredits: pe.total_tax_credits,
    netFederalIncomeTax: pe.net_federal_income_tax,
    ficaSocialSecurity: pe.employee_social_security_tax,
    ficaMedicare: pe.employee_medicare_tax,
    totalFicaTax: pe.total_payroll_tax,
    totalFederalTaxes: pe.net_federal_income_tax + pe.total_payroll_tax,
    stateIncomeTax: pe.state_income_tax,
    stateTaxName: pe.state_tax_name || 'State Income Tax',
    totalAllTaxes: pe.total_all_taxes,
    totalPaymentsAndWithholdings: pe.total_withholdings,
    federalRefundOrOwed: pe.federal_refund_or_owed,
    stateRefundOrOwed: pe.state_refund_or_owed,
    combinedRefundOrOwed: pe.combined_refund_or_owed,
    netAnnualTakeHome: pe.household_net_income,
    netMonthlyTakeHome: pe.paycheck_breakdown?.monthly || Math.round(pe.household_net_income / 12),
    netBiweeklyTakeHome: pe.paycheck_breakdown?.bi_weekly || Math.round(pe.household_net_income / 26),
    netWeeklyTakeHome: pe.paycheck_breakdown?.weekly || Math.round(pe.household_net_income / 52),
    netHourlyTakeHome: Math.round(pe.household_net_income / 2080),
    effectiveFederalRate: pe.effective_federal_rate,
    effectiveTotalTaxRate: pe.effective_total_tax_rate,
    marginalFederalRate: pe.federal_marginal_rate,
    bracketBreakdown,
  };
}

/**
 * Primary calculation coordinator:
 * Calls PolicyEngine API asynchronously with caching and instant local fallback.
 */
export async function calculateWithPolicyEngine(
  profile: CountryTaxProfile,
  inputs: AdvancedTaxInputs,
  options: {
    apiUrl?: string;
    signal?: AbortSignal;
    timeoutMs?: number;
  } = {}
): Promise<CalculationExecutionResult> {
  const t0 = performance.now();
  const payload = buildPolicyEnginePayload(inputs);
  const cacheKey = getCacheKey(payload);

  // 1. Check in-memory cache
  const cached = calculationCache.get(cacheKey);
  if (cached) {
    const latencyMs = Math.round(performance.now() - t0);
    return {
      result: reconcilePolicyEngineResponse(cached, inputs, profile),
      source: 'policyengine_api',
      latencyMs,
      engineVersion: cached.metadata?.engine_version || '2.44.0',
    };
  }

  // 2. Execute network request through Cloudflare proxy or direct microservice URL
  const endpoint = options.apiUrl || '/api/us-tax-calc';
  const timeoutMs = options.timeoutMs || 8000;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Merge abort signals if external signal passed
    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`PolicyEngine API returned status ${response.status}`);
    }

    const data: PolicyEngineTaxResponse = await response.json();
    setCache(cacheKey, data);

    const latencyMs = Math.round(performance.now() - t0);
    return {
      result: reconcilePolicyEngineResponse(data, inputs, profile),
      source: 'policyengine_api',
      latencyMs,
      engineVersion: data.metadata?.engine_version || '2.44.0',
    };
  } catch (err) {
    // 3. Graceful fallback to verified TypeScript tax engine
    const latencyMs = Math.round(performance.now() - t0);
    const fallbackResult = calculateAdvancedTax(profile, inputs);

    return {
      result: fallbackResult,
      source: 'local_fallback',
      latencyMs,
    };
  }
}

