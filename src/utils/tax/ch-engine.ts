import { chProfile } from '../../data/tax/countries/ch';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface ChTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  regionCode?: string; // e.g. 'zh', 'be', 'zg', 'ge', 'fed_only'
  pillar3a?: number; // Pillar 3a private pension deduction
}

export interface ChTaxResult extends TaxCalculationResult {
  federalTax: number;
  cantonalTax: number;
  cantonRate: number;
  ahvContribution: number;
  alvContribution: number;
  pillar3aDeduction: number;
}

export function calculateChTax(
  paramsOrInputs: ChTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): ChTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || chProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let regionCode = 'zh';
  let pillar3a = 0;

  if (isParams) {
    const params = paramsOrInputs as ChTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    regionCode = params.regionCode || 'zh';
    pillar3a = Math.max(0, params.pillar3a || 0);
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
    regionCode = inputs.stateProvCode || 'zh';
    pillar3a = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. Social Contributions (AHV/IV/EO 5.3% uncapped + ALV 1.1% capped at 148,200)
  const ahv = gross * 0.053;
  const alvCap = 148200;
  const alv = Math.min(gross, alvCap) * 0.011;
  const totalSocial = ahv + alv;

  // 2. Deductions (Statutory federal exemption threshold + optional Pillar 3a capped at CHF 7,056)
  const stdDeduction = yearData.standardDeduction || 15400;
  const maxPillar3a = 7056;
  const allowedPillar3a = Math.min(pillar3a, maxPillar3a);
  const totalDeductions = stdDeduction + totalSocial + allowedPillar3a;

  // 3. Taxable Income (taxable for federal and cantonal taxes)
  const taxableIncome = Math.max(0, gross - totalDeductions);

  // 4. Direct Federal Tax (Direkte Bundessteuer - progressive)
  const brackets = yearData.nationalBrackets || [];
  let federalTax = 0;
  let marginalFederalRate = 0;
  const bracketBreakdown: {
    bracketRange: string;
    ratePercent: string;
    taxableInBracket: number;
    taxAmount: number;
  }[] = [];

  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    const rangeLabel = b.upTo !== undefined
      ? `CHF ${b.threshold.toLocaleString('de-CH')} – CHF ${b.upTo.toLocaleString('de-CH')}`
      : `Over CHF ${b.threshold.toLocaleString('de-CH')}`;

    if (taxableIncome > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(taxableIncome, b.upTo) - b.threshold
        : taxableIncome - b.threshold;
      const tax = slice * b.rate;
      federalTax += tax;
      if (slice > 0) marginalFederalRate = b.rate * 100;
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

  // 5. Cantonal & Communal Tax
  let cantonRate = 0.12; // default Zurich
  const region = yearData.regions?.find((r) => r.code === regionCode);
  if (region) {
    cantonRate = region.additionalTaxRate ?? (region.flatRate ?? 0.12);
  }

  const cantonalTax = taxableIncome * cantonRate;

  // 6. Totals
  const totalIncomeTax = federalTax + cantonalTax;
  const totalAllTaxes = totalIncomeTax + totalSocial;
  const netAnnualTakeHome = Math.max(0, gross - totalAllTaxes);

  const effectiveFederalRate = gross > 0 ? (federalTax / gross) * 100 : 0;
  const effectiveTotalTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = [
    {
      name: 'AHV / IV / EO (1st Pillar)',
      ratePercent: '5.30%',
      amount: ahv,
      description: 'Mandatory state pension and disability insurance (uncapped)',
    },
    {
      name: 'ALV (Unemployment Insurance)',
      ratePercent: '1.10%',
      amount: alv,
      description: `Mandatory unemployment contribution (capped at CHF ${alvCap.toLocaleString('de-CH')})`,
    },
  ];

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: stdDeduction + allowedPillar3a,
    taxableIncome,
    nationalIncomeTax: federalTax,
    regionalIncomeTax: cantonalTax,
    totalIncomeTax,
    socialContributions,
    totalSocialContributions: totalSocial,
    totalTaxAndDeductions: totalAllTaxes,
    netIncomeAnnual: netAnnualTakeHome,
    netIncomeMonthly: netAnnualTakeHome / 12,
    netIncomeBiweekly: netAnnualTakeHome / 26,
    netIncomeWeekly: netAnnualTakeHome / 52,
    netIncomeDaily: netAnnualTakeHome / 260,
    netIncomeHourly: netAnnualTakeHome / 2080,
    effectiveTaxRate: effectiveFederalRate,
    effectiveTotalDeductionRate: effectiveTotalTaxRate,
    marginalTaxRate: marginalFederalRate,
    marginalTotalRate: marginalFederalRate + cantonRate * 100 + (gross <= alvCap ? 6.4 : 5.3),
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // Switzerland Native Outputs
    federalTax,
    cantonalTax,
    cantonRate,
    ahvContribution: ahv,
    alvContribution: alv,
    pillar3aDeduction: allowedPillar3a,

    // Legacy compatibility fields
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: totalSocial,
    adjustedGrossIncome: gross - totalSocial,
    standardDeductionAmount: stdDeduction,
    itemizedDeductionsTotal: allowedPillar3a,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: totalDeductions,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    regularIncomeTax: federalTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: federalTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: 0,
    netFederalIncomeTax: federalTax,
    ficaSocialSecurity: ahv,
    ficaMedicare: alv,
    totalFicaTax: totalSocial,
    totalFederalTaxes: federalTax + totalSocial,
    stateIncomeTax: cantonalTax,
    stateTaxName: `Cantonal Tax (${(cantonRate * 100).toFixed(0)}%)`,
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
    marginalFederalRate,
    totalTax: totalAllTaxes,
    netIncome: netAnnualTakeHome,
  };
}
