import { nzProfile } from '../../data/tax/countries/nz';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface NzTaxParams {
  grossIncome: number;
  taxYear?: '2026/27' | '2025/26' | '2024/25';
  hasAccLevy?: boolean;
  kiwiSaverRate?: number; // 0, 0.03, 0.04, 0.06, 0.08, 0.10
  hasStudentLoan?: boolean;
  eligibleForIetc?: boolean; // Independent Earner Tax Credit
}

export interface NzTaxResult extends TaxCalculationResult {
  payeGrossTax: number;
  ietcCredit: number;
  payeNetTax: number;
  accLevy: number;
  kiwiSaver: number;
  studentLoan: number;
}

/**
 * Statutory Independent Earner Tax Credit (IETC) under Section LC 13 of the Income Tax Act 2007:
 * - Up to $24,000: $0
 * - $24,000 to $44,000: $520 ($10/week)
 * - $44,001 to $48,000: $520 abated at 13c per dollar above $44,000
 * - Over $48,000: $0
 */
export function calculateIetc(gross: number, isEligible: boolean = true): number {
  if (!isEligible || gross < 24000) return 0;
  if (gross <= 44000) return 520;
  if (gross < 48000) {
    const abatement = (gross - 44000) * 0.13;
    return Math.max(0, 520 - abatement);
  }
  return 0;
}

/**
 * ACC Earners' Levy based on official tax year caps and rates
 */
export function calculateAccLevy(
  gross: number,
  taxYear: string = '2026/27',
  hasAcc: boolean = true
): { rate: number; cap: number; amount: number } {
  if (!hasAcc || gross <= 0) return { rate: 0, cap: 0, amount: 0 };

  const is2026 = taxYear === '2026/27';
  const rate = is2026 ? 0.0175 : 0.0160;
  const cap = is2026 ? 156641 : 142283;
  const liableIncome = Math.min(gross, cap);
  const amount = liableIncome * rate;

  return { rate, cap, amount };
}

/**
 * Student Loan Repayments: 12% on income over statutory threshold ($24,128)
 */
export function calculateStudentLoan(gross: number, hasLoan: boolean = false): number {
  if (!hasLoan || gross <= 24128) return 0;
  return (gross - 24128) * 0.12;
}

export function calculateNzTax(
  paramsOrInputs: NzTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): NzTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || nzProfile;

  let gross = 0;
  let taxYear = profile.defaultTaxYear;
  let hasAcc = true;
  let kiwiSaverRate = 0.03;
  let hasStudentLoan = false;
  let eligibleForIetc = false;

  if (isParams) {
    const params = paramsOrInputs as NzTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || profile.defaultTaxYear;
    hasAcc = params.hasAccLevy !== false;
    kiwiSaverRate = params.kiwiSaverRate !== undefined ? params.kiwiSaverRate : 0.03;
    hasStudentLoan = params.hasStudentLoan === true;
    eligibleForIetc = params.eligibleForIetc === true;
  } else {
    const inputs = paramsOrInputs as AdvancedTaxInputs;
    gross = Math.max(
      0,
      (inputs.primaryW2Income || 0) +
        (inputs.spouseW2Income || 0) +
        (inputs.businessNetIncome || 0) +
        (inputs.otherIncome || 0)
    );
    taxYear = inputs.taxYear || profile.defaultTaxYear;
    hasAcc = true;
    kiwiSaverRate = 0.03;
    hasStudentLoan = false;
    eligibleForIetc = false;
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. IRD Progressive Income Tax (PAYE)
  const activeBrackets = yearData.nationalBrackets;
  let payeGrossTax = 0;
  let marginalRate = 0;
  const bracketBreakdown: {
    bracketRange: string;
    ratePercent: string;
    taxableInBracket: number;
    taxAmount: number;
  }[] = [];

  for (let i = 0; i < activeBrackets.length; i++) {
    const b = activeBrackets[i];
    const rangeLabel = b.upTo !== undefined
      ? `$${b.threshold.toLocaleString('en-NZ')} – $${b.upTo.toLocaleString('en-NZ')}`
      : `Above $${b.threshold.toLocaleString('en-NZ')}`;

    if (gross > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(gross, b.upTo) - b.threshold
        : gross - b.threshold;
      const tax = slice * b.rate;
      payeGrossTax += tax;
      if (slice > 0) marginalRate = b.rate * 100;
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(b.rate * 100).toFixed(1)}%`,
        taxableInBracket: slice,
        taxAmount: tax,
      });
    } else {
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(b.rate * 100).toFixed(1)}%`,
        taxableInBracket: 0,
        taxAmount: 0,
      });
    }
  }

  // 2. Independent Earner Tax Credit (IETC)
  const ietcCredit = calculateIetc(gross, eligibleForIetc);
  const payeNetTax = Math.max(0, payeGrossTax - ietcCredit);

  // 3. ACC Earners' Levy
  const accDetails = calculateAccLevy(gross, taxYear, hasAcc);
  const accLevy = accDetails.amount;

  // 4. KiwiSaver Employee Contribution
  const kiwiSaver = gross * kiwiSaverRate;

  // 5. Student Loan Repayment
  const studentLoan = calculateStudentLoan(gross, hasStudentLoan);

  // 6. Totals
  const totalSocialDeductions = accLevy + kiwiSaver;
  const totalTaxAndDeductions = payeNetTax + totalSocialDeductions + studentLoan;
  const netAnnualTakeHome = Math.max(0, gross - totalTaxAndDeductions);

  const effectiveFederalRate = gross > 0 ? (payeNetTax / gross) * 100 : 0;
  const effectiveTotalTaxRate = gross > 0 ? (totalTaxAndDeductions / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = [
    {
      name: "ACC Earners' Levy",
      ratePercent: `${(accDetails.rate * 100).toFixed(2)}%`,
      amount: accLevy,
      description: `Injuries compensation scheme (capped at $${accDetails.cap.toLocaleString('en-NZ')})`,
    },
    {
      name: 'KiwiSaver',
      ratePercent: `${(kiwiSaverRate * 100).toFixed(1)}%`,
      amount: kiwiSaver,
      description: 'Superannuation retirement savings contribution',
    },
  ];

  if (studentLoan > 0) {
    socialContributions.push({
      name: 'Student Loan Repayment',
      ratePercent: '12.00%',
      amount: studentLoan,
      description: '12% on income over $24,128 threshold',
    });
  }

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: 0,
    taxableIncome: gross,
    nationalIncomeTax: payeNetTax,
    regionalIncomeTax: 0,
    totalIncomeTax: payeNetTax,
    socialContributions,
    totalSocialContributions: totalSocialDeductions,
    totalTaxAndDeductions,
    netIncomeAnnual: netAnnualTakeHome,
    netIncomeMonthly: netAnnualTakeHome / 12,
    netIncomeBiweekly: netAnnualTakeHome / 26,
    netIncomeWeekly: netAnnualTakeHome / 52,
    netIncomeDaily: netAnnualTakeHome / 260,
    netIncomeHourly: netAnnualTakeHome / 2080,
    effectiveTaxRate: effectiveFederalRate,
    effectiveTotalDeductionRate: effectiveTotalTaxRate,
    marginalTaxRate: marginalRate,
    marginalTotalRate: marginalRate + (hasAcc ? accDetails.rate * 100 : 0) + (kiwiSaverRate * 100) + (hasStudentLoan && gross > 24128 ? 12 : 0),
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // New Zealand Native Outputs
    payeGrossTax,
    ietcCredit,
    payeNetTax,
    accLevy,
    kiwiSaver,
    studentLoan,

    // Legacy AdvancedTaxResult compatibility
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: 0,
    adjustedGrossIncome: gross,
    standardDeductionAmount: 0,
    itemizedDeductionsTotal: 0,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: 0,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: gross,
    preferentialTaxableIncome: 0,
    regularIncomeTax: payeNetTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: payeGrossTax,
    childTaxCredit: ietcCredit,
    otherDependentCredit: 0,
    totalTaxCredits: ietcCredit,
    netFederalIncomeTax: payeNetTax,
    ficaSocialSecurity: totalSocialDeductions,
    ficaMedicare: 0,
    totalFicaTax: totalSocialDeductions,
    totalFederalTaxes: totalTaxAndDeductions,
    stateIncomeTax: 0,
    stateTaxName: '',
    totalAllTaxes: totalTaxAndDeductions,
    totalPaymentsAndWithholdings: 0,
    federalRefundOrOwed: 0,
    stateRefundOrOwed: 0,
    combinedRefundOrOwed: 0,
    netAnnualTakeHome,
    netMonthlyTakeHome: netAnnualTakeHome / 12,
    netBiweeklyTakeHome: netAnnualTakeHome / 26,
    netWeeklyTakeHome: netAnnualTakeHome / 52,
    netHourlyTakeHome: netAnnualTakeHome / 2080,
    effectiveTotalTaxRate,
    marginalFederalRate: marginalRate,
  };
}
