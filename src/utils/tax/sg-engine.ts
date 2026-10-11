import { sgProfile } from '../../data/tax/countries/sg';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface SgTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  ageGroup?: '55below' | '56to60' | '61to65' | '65plus';
  isCitizenOrPr?: boolean;
  additionalReliefs?: number;
}

export interface SgTaxResult extends TaxCalculationResult {
  cpfContribution: number;
  cpfRate: number;
  earnedIncomeRelief: number;
  totalReliefs: number;
  chargeableIncome: number;
  incomeTax: number;
}

/**
 * Returns statutory employee CPF contribution rate and wage ceiling for citizens/PRs
 */
export function getCpfRules(
  taxYear: '2025' | '2026',
  ageGroup: '55below' | '56to60' | '61to65' | '65plus' = '55below'
): { rate: number; annualCap: number } {
  // Annualized Ordinary Wage (OW) Ceiling:
  // 2025: $7,400/mo * 12 = $88,800
  // 2026: $8,000/mo * 12 = $96,000
  const annualCap = taxYear === '2025' ? 88800 : 96000;

  let rate = 0.20;
  if (ageGroup === '56to60') {
    rate = 0.15;
  } else if (ageGroup === '61to65') {
    rate = 0.095;
  } else if (ageGroup === '65plus') {
    rate = 0.05;
  }

  return { rate, annualCap };
}

/**
 * Statutory Earned Income Relief based on age
 */
export function getEarnedIncomeRelief(
  ageGroup: '55below' | '56to60' | '61to65' | '65plus' = '55below'
): number {
  if (ageGroup === '56to60') return 6000;
  if (ageGroup === '61to65' || ageGroup === '65plus') return 8000;
  return 1000;
}

export function calculateSgTax(
  paramsOrInputs: SgTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): SgTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || sgProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let ageGroup: '55below' | '56to60' | '61to65' | '65plus' = '55below';
  let isCitizenOrPr = true;
  let additionalReliefs = 0;

  if (isParams) {
    const params = paramsOrInputs as SgTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    ageGroup = params.ageGroup || '55below';
    isCitizenOrPr = params.isCitizenOrPr !== false;
    additionalReliefs = Math.max(0, params.additionalReliefs || 0);
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
    isCitizenOrPr = true;
    additionalReliefs = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. CPF Contribution (Central Provident Fund)
  const { rate: cpfRate, annualCap: cpfCap } = getCpfRules(taxYear, ageGroup);
  const cpfContribution = isCitizenOrPr ? Math.min(gross, cpfCap) * cpfRate : 0;

  // 2. Personal Reliefs (Earned income relief + additional, subject to $80,000 statutory cap)
  const earnedIncomeRelief = getEarnedIncomeRelief(ageGroup);
  const totalReliefs = Math.min(80000, earnedIncomeRelief + additionalReliefs);

  // 3. Chargeable Income (CPF is deductible from income in Singapore)
  const chargeableIncome = Math.max(0, gross - cpfContribution - totalReliefs);

  // 4. IRAS Progressive Resident Tax
  const activeBrackets = yearData.nationalBrackets;
  let incomeTax = 0;
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
      ? `$${b.threshold.toLocaleString('en-SG')} – $${b.upTo.toLocaleString('en-SG')}`
      : `Above $${b.threshold.toLocaleString('en-SG')}`;

    if (chargeableIncome > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(chargeableIncome, b.upTo) - b.threshold
        : chargeableIncome - b.threshold;
      const tax = slice * b.rate;
      incomeTax += tax;
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

  const totalAllTaxes = incomeTax + cpfContribution;
  const netAnnualTakeHome = Math.max(0, gross - totalAllTaxes);

  const effectiveFederalRate = gross > 0 ? (incomeTax / gross) * 100 : 0;
  const effectiveTotalTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = isCitizenOrPr
    ? [
        {
          name: 'Central Provident Fund (CPF)',
          ratePercent: `${(cpfRate * 100).toFixed(1)}%`,
          amount: cpfContribution,
          description: `Mandatory employee share (capped at $${(cpfCap / 12).toLocaleString()}/month)`,
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
    standardDeduction: totalReliefs,
    taxableIncome: chargeableIncome,
    nationalIncomeTax: incomeTax,
    regionalIncomeTax: 0,
    totalIncomeTax: incomeTax,
    socialContributions,
    totalSocialContributions: cpfContribution,
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
    marginalTotalRate: marginalRate + (isCitizenOrPr ? cpfRate * 100 : 0),
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // Singapore Native Outputs
    cpfContribution,
    cpfRate,
    earnedIncomeRelief,
    totalReliefs,
    chargeableIncome,
    incomeTax,

    // Legacy AdvancedTaxResult compatibility
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: cpfContribution,
    adjustedGrossIncome: gross - cpfContribution,
    standardDeductionAmount: totalReliefs,
    itemizedDeductionsTotal: additionalReliefs,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: totalReliefs + cpfContribution,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: chargeableIncome,
    preferentialTaxableIncome: 0,
    regularIncomeTax: incomeTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: incomeTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: 0,
    netFederalIncomeTax: incomeTax,
    ficaSocialSecurity: cpfContribution,
    ficaMedicare: 0,
    totalFicaTax: cpfContribution,
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
