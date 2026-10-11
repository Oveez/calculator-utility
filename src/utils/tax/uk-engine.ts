import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxBracket,
} from '../../data/tax/types';
import { ukProfile } from '../../data/tax/countries/uk';

export interface UkTaxParams {
  taxYear?: string;
  grossIncome?: number;
  primaryW2Income?: number;
  region?: string;
  regionCode?: string;
  pensionPercent?: number; // workplace pension contribution %
  studentLoanPlan?: 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad';
  hasBlindAllowance?: boolean;
  [key: string]: any;
}

export interface UkBracketDetail {
  bracketRange: string;
  ratePercent: string;
  taxableInBracket: number;
  taxAmount: number;
}

export interface UkTaxResult {
  grossIncome: number;
  pensionContribution: number;
  adjustedGrossIncome: number;
  personalAllowance: number;
  taxableIncome: number;
  regularIncomeTax: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  totalDeductions: number;
  netTakeHome: number;
  effectiveTaxRate: number;
  marginalRate: number;
  bracketBreakdown: UkBracketDetail[];

  // Legacy AdvancedTaxResult compatibility
  totalGrossIncome: number;
  earnedIncome: number;
  investmentIncome: number;
  selfEmploymentTax: number;
  deductibleSelfEmploymentTax: number;
  totalAdjustmentsToIncome: number;
  standardDeductionAmount: number;
  itemizedDeductionsTotal: number;
  itemizedSaltAllowed: number;
  itemizedMedicalAllowed: number;
  deductionUsed: 'standard' | 'itemized';
  deductionAmount: number;
  itemizedAdvantage: number;
  ordinaryTaxableIncome: number;
  preferentialTaxableIncome: number;
  preferentialCapitalGainsTax: number;
  additionalMedicareTax: number;
  netInvestmentIncomeTax: number;
  grossFederalTax: number;
  childTaxCredit: number;
  otherDependentCredit: number;
  totalTaxCredits: number;
  netFederalIncomeTax: number;
  ficaSocialSecurity: number;
  ficaMedicare: number;
  totalFicaTax: number;
  totalFederalTaxes: number;
  stateIncomeTax: number;
  stateTaxName: string;
  totalAllTaxes: number;
  totalPaymentsAndWithholdings: number;
  federalRefundOrOwed: number;
  stateRefundOrOwed: number;
  combinedRefundOrOwed: number;
  netAnnualTakeHome: number;
  netMonthlyTakeHome: number;
  netBiweeklyTakeHome: number;
  netWeeklyTakeHome: number;
  netHourlyTakeHome: number;
  effectiveFederalRate: number;
  effectiveTotalTaxRate: number;
  marginalFederalRate: number;
}

export function calculateUkTax(
  params: UkTaxParams | AdvancedTaxInputs,
  profile?: CountryTaxProfile
): UkTaxResult {
  const activeProfile = profile || ukProfile;
  const selectedYear = params.taxYear && activeProfile.years[params.taxYear]
    ? params.taxYear
    : activeProfile.defaultTaxYear;
  const yearData = activeProfile.years[selectedYear] || activeProfile.years[activeProfile.defaultTaxYear];

  // 1. Gross Income Aggregation
  const gross = Math.max(
    0,
    'grossIncome' in params && params.grossIncome !== undefined
      ? params.grossIncome
      : 'primaryW2Income' in params
      ? params.primaryW2Income || 0
      : 0
  );

  // 2. Workplace Pension Contribution (Salary Sacrifice)
  const pensionPct = Math.max(0, Math.min(100, params.pensionPercent || 0));
  const pensionContribution = (gross * pensionPct) / 100;
  const adjustedGrossIncome = Math.max(0, gross - pensionContribution);

  // 3. Personal Allowance with statutory tapering above £100,000
  let personalAllowance = (yearData.personalAllowance || 12570) + (params.hasBlindAllowance ? 3070 : 0);
  if (adjustedGrossIncome > 100000) {
    const reduction = Math.floor((adjustedGrossIncome - 100000) / 2);
    personalAllowance = Math.max(0, personalAllowance - reduction);
  }

  const taxableIncome = Math.max(0, adjustedGrossIncome - personalAllowance);

  // 4. Jurisdiction Brackets: England/Wales/NI vs Scotland
  const region = params.region || ('regionCode' in params ? params.regionCode : undefined) || 'england_wales_ni';
  let activeBrackets: TaxBracket[] = yearData.nationalBrackets;
  if (region === 'scotland') {
    const scotRegion = yearData.regions?.find((r) => r.code === 'scotland');
    if (scotRegion && scotRegion.brackets && scotRegion.brackets.length > 0) {
      activeBrackets = scotRegion.brackets;
    }
  }

  // 5. Income Tax Calculation
  let regularIncomeTax = 0;
  let marginalRate = 0;
  const bracketBreakdown: UkBracketDetail[] = [];

  for (let i = 0; i < activeBrackets.length; i++) {
    const b = activeBrackets[i];
    const rangeLabel = b.upTo !== undefined
      ? `£${b.threshold.toLocaleString('en-GB')} – £${b.upTo.toLocaleString('en-GB')}`
      : `Over £${b.threshold.toLocaleString('en-GB')}`;

    if (taxableIncome > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(taxableIncome, b.upTo) - b.threshold
        : taxableIncome - b.threshold;
      const tax = slice * b.rate;
      regularIncomeTax += tax;
      if (slice > 0) marginalRate = b.rate * 100;
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(b.rate * 100).toFixed(0)}%`,
        taxableInBracket: slice,
        taxAmount: tax,
      });
    } else {
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(b.rate * 100).toFixed(0)}%`,
        taxableInBracket: 0,
        taxAmount: 0,
      });
    }
  }

  // 6. National Insurance (Class 1 Employee NIC)
  // 8% between £12,570 and £50,270, 2% above £50,270
  let nationalInsurance = 0;
  if (adjustedGrossIncome > 12570) {
    const lowerBand = Math.min(adjustedGrossIncome, 50270) - 12570;
    nationalInsurance += lowerBand * 0.08;
  }
  if (adjustedGrossIncome > 50270) {
    const upperBand = adjustedGrossIncome - 50270;
    nationalInsurance += upperBand * 0.02;
  }

  // 7. Student Loan Repayment
  let studentLoan = 0;
  const plan = params.studentLoanPlan || 'none';
  if (plan === 'plan1' && gross > 24990) {
    studentLoan = (gross - 24990) * 0.09;
  } else if (plan === 'plan2' && gross > 27295) {
    studentLoan = (gross - 27295) * 0.09;
  } else if (plan === 'plan4' && gross > 31395) {
    studentLoan = (gross - 31395) * 0.09;
  } else if (plan === 'plan5' && gross > 25000) {
    studentLoan = (gross - 25000) * 0.09;
  } else if (plan === 'postgrad' && gross > 21000) {
    studentLoan = (gross - 21000) * 0.06;
  }

  // 8. Totals and Take-Home
  const totalDeductions = regularIncomeTax + nationalInsurance + studentLoan;
  const netTakeHome = Math.max(0, gross - totalDeductions - pensionContribution);

  const effectiveFederalRate = gross > 0 ? (regularIncomeTax / gross) * 100 : 0;
  const effectiveTotalTaxRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

  return {
    grossIncome: gross,
    pensionContribution,
    adjustedGrossIncome,
    personalAllowance,
    taxableIncome,
    regularIncomeTax,
    incomeTax: regularIncomeTax,
    nationalInsurance,
    studentLoan,
    totalDeductions,
    netTakeHome,
    effectiveTaxRate: effectiveTotalTaxRate,
    marginalRate,
    bracketBreakdown,

    // Legacy AdvancedTaxResult compatibility
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: pensionContribution,
    standardDeductionAmount: personalAllowance,
    itemizedDeductionsTotal: 0,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: personalAllowance,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: regularIncomeTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: 0,
    netFederalIncomeTax: regularIncomeTax,
    ficaSocialSecurity: nationalInsurance,
    ficaMedicare: 0,
    totalFicaTax: nationalInsurance,
    totalFederalTaxes: regularIncomeTax + nationalInsurance,
    stateIncomeTax: 0,
    stateTaxName: region === 'scotland' ? 'Scotland Devolved Income Tax' : '',
    totalAllTaxes: totalDeductions,
    totalPaymentsAndWithholdings: 0,
    federalRefundOrOwed: 0,
    stateRefundOrOwed: 0,
    combinedRefundOrOwed: 0,
    netAnnualTakeHome: netTakeHome,
    netMonthlyTakeHome: netTakeHome / 12,
    netBiweeklyTakeHome: netTakeHome / 26,
    netWeeklyTakeHome: netTakeHome / 52,
    netHourlyTakeHome: netTakeHome / 2080,
    effectiveFederalRate,
    effectiveTotalTaxRate,
    marginalFederalRate: marginalRate,
  };
}
