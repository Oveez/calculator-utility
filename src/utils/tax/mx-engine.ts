import { mxProfile } from '../../data/tax/countries/mx';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface MxTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  hasImss?: boolean;
  personalDeductions?: number;
}

export interface MxTaxResult extends TaxCalculationResult {
  grossIsr: number;
  subsidioEmpleo: number; // Subsidio para el empleo (Decreto DOF)
  netIsr: number;
  imssContribution: number;
  personalDeductions: number;
}

/**
 * Statutory Subsidio para el Empleo (Decreto DOF 1 de mayo de 2024 / 2025 / 2026):
 * Workers with monthly earnings up to $9,081 MXN ($108,972 MXN/yr) receive
 * 11.82% of the monthly UMA as a tax subsidy credited directly against ISR.
 */
export function calculateSubsidioEmpleo(gross: number, taxYear: string = '2026'): number {
  if (gross <= 0) return 0;
  // Threshold: $9,081 MXN monthly = $108,972 annual
  const monthlyThreshold = 9081;
  const annualThreshold = monthlyThreshold * 12;

  if (gross <= annualThreshold) {
    // 2026 monthly UMA is ~$3,566.22; 2025 was ~$3,300.53
    const monthlyUma = taxYear === '2026' ? 3566.22 : 3300.53;
    const monthlySubsidy = monthlyUma * 0.1182;
    return monthlySubsidy * 12;
  }
  return 0;
}

/**
 * IMSS Social Security (Cuota Obrera):
 * Standard employee contribution is ~2.725% capped at 25 UMAs annualized.
 */
export function calculateImss(
  gross: number,
  taxYear: string = '2026',
  hasImss: boolean = true
): { rate: number; cap: number; amount: number } {
  if (!hasImss || gross <= 0) return { rate: 0, cap: 0, amount: 0 };

  const rate = 0.02725;
  // 25 UMAs annualized
  const cap = taxYear === '2026' ? 1070453.75 : 980000;
  const liableBase = Math.min(gross, cap);
  const amount = liableBase * rate;

  return { rate, cap, amount };
}

export function calculateMxTax(
  paramsOrInputs: MxTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): MxTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || mxProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let hasImss = true;
  let personalDeductions = 0;

  if (isParams) {
    const params = paramsOrInputs as MxTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    hasImss = params.hasImss !== false;
    personalDeductions = Math.max(0, params.personalDeductions || 0);
  } else {
    const inputs = paramsOrInputs as AdvancedTaxInputs;
    gross = Math.max(
      0,
      (inputs.primaryW2Income || 0) +
        (inputs.spouseW2Income || 0) +
        (inputs.businessNetIncome || 0) +
        (inputs.otherIncome || 0)
    );
    taxYear = (inputs.taxYear as '2025' | '2026') || '2026';
    hasImss = true;
    personalDeductions = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. Deducciones personales (Art. 151 LISR cap: max 15% of gross or ~5 UMAs)
  const maxDeductions = Math.min(gross * 0.15, taxYear === '2026' ? 214000 : 196000);
  const allowedDeductions = Math.min(personalDeductions, maxDeductions);
  const taxableIncome = Math.max(0, gross - allowedDeductions);

  // 2. ISR Progressive Calculation (Art. 96 LISR / RMF Anexo 8)
  const activeBrackets = yearData.nationalBrackets;
  let grossIsr = 0;
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
      ? `$${b.threshold.toLocaleString('es-MX')} – $${b.upTo.toLocaleString('es-MX')}`
      : `Más de $${b.threshold.toLocaleString('es-MX')}`;

    if (taxableIncome > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(taxableIncome, b.upTo) - b.threshold
        : taxableIncome - b.threshold;
      const tax = slice * b.rate;
      grossIsr += tax;
      if (slice > 0) marginalRate = b.rate * 100;
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(b.rate * 100).toFixed(2)}%`,
        taxableInBracket: slice,
        taxAmount: tax,
      });
    } else {
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(b.rate * 100).toFixed(2)}%`,
        taxableInBracket: 0,
        taxAmount: 0,
      });
    }
  }

  // 3. Subsidio para el empleo
  const subsidioEmpleo = calculateSubsidioEmpleo(gross, taxYear);
  const netIsr = Math.max(0, grossIsr - subsidioEmpleo);

  // 4. IMSS Social Security
  const imssDetails = calculateImss(gross, taxYear, hasImss);
  const imssContribution = imssDetails.amount;

  // 5. Totals
  const totalAllTaxes = netIsr + imssContribution;
  const netAnnualTakeHome = Math.max(0, gross - totalAllTaxes);

  const effectiveFederalRate = gross > 0 ? (netIsr / gross) * 100 : 0;
  const effectiveTotalTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = hasImss
    ? [
        {
          name: 'IMSS Seguridad Social (Cuota Obrera)',
          ratePercent: `${(imssDetails.rate * 100).toFixed(3)}%`,
          amount: imssContribution,
          description: `Cuota del trabajador (tope 25 UMAs: $${imssDetails.cap.toLocaleString('es-MX')})`,
        },
      ]
    : [];

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: allowedDeductions,
    taxableIncome,
    nationalIncomeTax: netIsr,
    regionalIncomeTax: 0,
    totalIncomeTax: netIsr,
    socialContributions,
    totalSocialContributions: imssContribution,
    totalTaxAndDeductions: totalAllTaxes,
    netIncomeAnnual: netAnnualTakeHome,
    netIncomeMonthly: netAnnualTakeHome / 12,
    netIncomeBiweekly: netAnnualTakeHome / 26,
    netIncomeWeekly: netAnnualTakeHome / 52,
    netIncomeDaily: netAnnualTakeHome / 260,
    netIncomeHourly: netAnnualTakeHome / 2080,
    effectiveTaxRate: effectiveFederalRate,
    effectiveTotalDeductionRate: effectiveTotalTaxRate,
    marginalTaxRate: marginalRate,
    marginalTotalRate: marginalRate + (hasImss ? imssDetails.rate * 100 : 0),
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // Mexico Native Outputs
    grossIsr,
    subsidioEmpleo,
    netIsr,
    imssContribution,
    personalDeductions: allowedDeductions,

    // Legacy AdvancedTaxResult compatibility
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: 0,
    adjustedGrossIncome: gross,
    standardDeductionAmount: allowedDeductions,
    itemizedDeductionsTotal: allowedDeductions,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: allowedDeductions,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    regularIncomeTax: netIsr,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: grossIsr,
    childTaxCredit: subsidioEmpleo,
    otherDependentCredit: 0,
    totalTaxCredits: subsidioEmpleo,
    netFederalIncomeTax: netIsr,
    ficaSocialSecurity: imssContribution,
    ficaMedicare: 0,
    totalFicaTax: imssContribution,
    totalFederalTaxes: totalAllTaxes,
    stateIncomeTax: 0,
    stateTaxName: '',
    totalAllTaxes,
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
