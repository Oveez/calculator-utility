import { dkProfile } from '../../data/tax/countries/dk';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface DkTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  regionCode?: string; // e.g. 'copenhagen', 'aarhus', 'national_avg'
  churchTax?: boolean;
  customDeductions?: number;
}

export interface DkTaxResult extends TaxCalculationResult {
  amBidrag: number;
  personfradrag: number;
  beskaeftigelsesfradrag: number;
  baseMunicipalTax: number;
  upperBracketTaxes: number;
  regionalAdjustment: number;
  churchTaxAmount: number;
}

export function calculateDkTax(
  paramsOrInputs: DkTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): DkTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || dkProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let regionCode = 'national_avg';
  let churchTax = false;
  let customDeductions = 0;

  if (isParams) {
    const params = paramsOrInputs as DkTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    regionCode = params.regionCode || 'national_avg';
    churchTax = Boolean(params.churchTax);
    customDeductions = Math.max(0, params.customDeductions || 0);
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
    regionCode = inputs.stateProvCode || 'national_avg';
    churchTax = false;
    customDeductions = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. AM-bidrag (Arbejdsmarkedsbidrag 8% flat on gross)
  const amBidragRate = yearData.socialContributions.find((c) => c.id === 'am_bidrag')?.employeeRate || 0.08;
  const amBidrag = gross * amBidragRate;

  // 2. Personal Income Base
  const personalIncome = Math.max(0, gross - amBidrag);

  // 3. Deductions: Personfradrag + Beskæftigelsesfradrag (10.65% up to statutory cap)
  const personfradrag = yearData.standardDeduction || 54100;
  const maxBeskaeftigelsesfradrag = taxYear === '2025' ? 45100 : 54600;
  const beskaeftigelsesfradrag = Math.min(gross * 0.1065, maxBeskaeftigelsesfradrag);
  const totalDeductions = personfradrag + beskaeftigelsesfradrag + customDeductions;
  const taxableIncome = Math.max(0, personalIncome - totalDeductions);

  // 4. Regional Rate Adjustment & Church Tax
  let regionalAdjustment = 0;
  if (regionCode === 'copenhagen') regionalAdjustment = -0.013;
  else if (regionCode === 'frederiksberg') regionalAdjustment = -0.017;
  else if (regionCode === 'aarhus') regionalAdjustment = -0.004;
  else if (regionCode === 'odense') regionalAdjustment = 0.006;
  else if (regionCode === 'aalborg') regionalAdjustment = 0.002;

  const churchTaxRate = churchTax ? 0.007 : 0;
  const churchTaxAmount = taxableIncome * churchTaxRate;

  // 5. Progressive Brackets
  let baseRate = taxYear === '2025' ? 0.3696 : 0.3691;
  baseRate += regionalAdjustment + churchTaxRate;

  let totalIncomeTax = 0;
  let baseMunicipalTax = 0;
  let upperBracketTaxes = 0;
  let marginalRate = 0;
  const bracketBreakdown: {
    bracketRange: string;
    ratePercent: string;
    taxableInBracket: number;
    taxAmount: number;
  }[] = [];

  const brackets = yearData.nationalBrackets || [];
  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    const effectiveRate = b.rate + regionalAdjustment + churchTaxRate;
    const rangeLabel = b.upTo !== undefined
      ? `${b.threshold.toLocaleString('da-DK')} – ${b.upTo.toLocaleString('da-DK')} kr`
      : `Over ${b.threshold.toLocaleString('da-DK')} kr`;

    if (taxableIncome > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(taxableIncome, b.upTo) - b.threshold
        : taxableIncome - b.threshold;
      const tax = slice * effectiveRate;
      totalIncomeTax += tax;
      if (i === 0) baseMunicipalTax += tax;
      else upperBracketTaxes += tax;
      if (slice > 0) marginalRate = effectiveRate * 100;

      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(effectiveRate * 100).toFixed(2)}%`,
        taxableInBracket: slice,
        taxAmount: tax,
      });
    } else {
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(effectiveRate * 100).toFixed(2)}%`,
        taxableInBracket: 0,
        taxAmount: 0,
      });
    }
  }

  const totalAllTaxes = totalIncomeTax + amBidrag;
  const netIncome = Math.max(0, gross - totalAllTaxes);
  const effectiveTotalTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = [
    {
      name: 'Labour Market Contribution (AM-bidrag)',
      ratePercent: '8.00%',
      amount: amBidrag,
      description: '8% statutory flat social contribution on gross employment earnings.',
    },
  ];

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: totalDeductions,
    taxableIncome,
    nationalIncomeTax: upperBracketTaxes,
    regionalIncomeTax: baseMunicipalTax,
    totalIncomeTax,
    socialContributions,
    totalSocialContributions: amBidrag,
    totalTaxAndDeductions: totalAllTaxes,
    netIncomeAnnual: netIncome,
    netIncomeMonthly: netIncome / 12,
    netIncomeBiweekly: netIncome / 26,
    netIncomeWeekly: netIncome / 52,
    netIncomeDaily: netIncome / 260,
    netIncomeHourly: netIncome / 2080,
    effectiveTaxRate: gross > 0 ? (totalIncomeTax / gross) * 100 : 0,
    effectiveTotalDeductionRate: effectiveTotalTaxRate,
    marginalTaxRate: marginalRate,
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // Denmark native outputs
    amBidrag,
    personfradrag,
    beskaeftigelsesfradrag,
    baseMunicipalTax,
    upperBracketTaxes,
    regionalAdjustment,
    churchTaxAmount,
    totalTax: totalAllTaxes,
    netIncome,
    stateTax: totalIncomeTax,
    regionalTax: baseMunicipalTax,

    // Backwards compatibility legacy fields
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: amBidrag,
    adjustedGrossIncome: gross - amBidrag,
    standardDeductionAmount: personfradrag,
    itemizedDeductionsTotal: beskaeftigelsesfradrag + customDeductions,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: totalDeductions,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    regularIncomeTax: totalIncomeTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: totalIncomeTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: 0,
    netFederalIncomeTax: totalIncomeTax,
    ficaSocialSecurity: amBidrag,
    ficaMedicare: 0,
    totalFicaTax: amBidrag,
    totalFederalTaxes: totalAllTaxes,
    stateIncomeTax: baseMunicipalTax,
    stateTaxName: `Kommuneskat`,
    totalAllTaxes,
    totalPaymentsAndWithholdings: 0,
    federalRefundOrOwed: 0,
    stateRefundOrOwed: 0,
    combinedRefundOrOwed: 0,
    netAnnualTakeHome: netIncome,
    netMonthlyTakeHome: netIncome / 12,
    netBiweeklyTakeHome: netIncome / 26,
    netWeeklyTakeHome: netIncome / 52,
    netHourlyTakeHome: netIncome / 2080,
    effectiveTotalTaxRate,
    marginalFederalRate: marginalRate,
  };
}
