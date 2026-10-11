import { noProfile } from '../../data/tax/countries/no';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface NoTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  customDeductions?: number;
}

export interface NoTaxResult extends TaxCalculationResult {
  trygdeavgift: number;
  minstefradrag: number;
  personfradrag: number;
  alminneligInntekt: number;
  flatTax: number;
  trinnskatt: number;
}

export function calculateNoTax(
  paramsOrInputs: NoTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): NoTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || noProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let customDeductions = 0;

  if (isParams) {
    const params = paramsOrInputs as NoTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
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
    customDeductions = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. National Insurance (Trygdeavgift)
  // 7.6% on gross personal income in 2026 (7.8% in 2025)
  const trygdeRate = taxYear === '2025' ? 0.078 : 0.076;
  const frikortGrense = taxYear === '2025' ? 70000 : 99650;
  const trygdeavgift = gross < frikortGrense ? 0 : gross * trygdeRate;

  // 2. Minstefradrag (Standard Minimum Employment Deduction, Skatteloven § 6-32)
  // 46% of gross salary, capped at 104,300 NOK in 2026 (104,450 NOK in 2025)
  const maxMinstefradrag = taxYear === '2025' ? 104450 : 104300;
  const minstefradrag = Math.min(gross * 0.46, maxMinstefradrag);

  // 3. Personfradrag (Basic Personal Allowance)
  const personfradrag = yearData.standardDeduction || 114540;

  // 4. Alminnelig Inntekt (General Net Income) & Flat 22% Tax
  const alminneligInntekt = Math.max(0, gross - minstefradrag - customDeductions);
  const taxableAlminnelig = Math.max(0, alminneligInntekt - personfradrag);
  const flatTax = taxableAlminnelig * 0.22;

  // 5. Trinnskatt (Progressive Bracket Tax on Gross Income)
  const trinnSteps = taxYear === '2025'
    ? [
        { threshold: 216400, upTo: 292850, rate: 0.017, label: 'Trinn 1 (1.7%)' },
        { threshold: 292850, upTo: 670000, rate: 0.040, label: 'Trinn 2 (4.0%)' },
        { threshold: 670000, upTo: 937900, rate: 0.136, label: 'Trinn 3 (13.6%)' },
        { threshold: 937900, upTo: 1350000, rate: 0.166, label: 'Trinn 4 (16.6%)' },
        { threshold: 1350000, upTo: Infinity, rate: 0.176, label: 'Trinn 5 (17.6%)' },
      ]
    : [
        { threshold: 226100, upTo: 318300, rate: 0.017, label: 'Trinn 1 (1.7%)' },
        { threshold: 318300, upTo: 725050, rate: 0.040, label: 'Trinn 2 (4.0%)' },
        { threshold: 725050, upTo: 980100, rate: 0.137, label: 'Trinn 3 (13.7%)' },
        { threshold: 980100, upTo: 1467200, rate: 0.168, label: 'Trinn 4 (16.8%)' },
        { threshold: 1467200, upTo: Infinity, rate: 0.178, label: 'Trinn 5 (17.8%)' },
      ];

  let trinnskatt = 0;
  let maxTrinnRate = 0;
  const bracketBreakdown: {
    bracketRange: string;
    ratePercent: string;
    taxableInBracket: number;
    taxAmount: number;
  }[] = [];

  for (const b of trinnSteps) {
    const rangeLabel = b.upTo === Infinity
      ? `Over ${b.threshold.toLocaleString('nb-NO')} kr`
      : `${b.threshold.toLocaleString('nb-NO')} – ${b.upTo.toLocaleString('nb-NO')} kr`;

    if (gross > b.threshold) {
      const slice = b.upTo !== Infinity
        ? Math.min(gross, b.upTo) - b.threshold
        : gross - b.threshold;
      const tax = slice * b.rate;
      trinnskatt += tax;
      if (slice > 0) maxTrinnRate = b.rate * 100;

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

  // 6. Totals
  const totalIncomeTax = flatTax + trinnskatt;
  const totalAllTaxes = totalIncomeTax + trygdeavgift;
  const netIncome = Math.max(0, gross - totalAllTaxes);
  const effectiveTotalTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = [
    {
      name: 'National Insurance (Trygdeavgift)',
      ratePercent: `${(trygdeRate * 100).toFixed(1)}%`,
      amount: trygdeavgift,
      description: `${(trygdeRate * 100).toFixed(1)}% trygdeavgift på personinntekt.`,
    },
  ];

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: minstefradrag + personfradrag + customDeductions,
    taxableIncome: alminneligInntekt,
    nationalIncomeTax: trinnskatt,
    regionalIncomeTax: flatTax,
    totalIncomeTax,
    socialContributions,
    totalSocialContributions: trygdeavgift,
    totalTaxAndDeductions: totalAllTaxes,
    netIncomeAnnual: netIncome,
    netIncomeMonthly: netIncome / 12,
    netIncomeBiweekly: netIncome / 26,
    netIncomeWeekly: netIncome / 52,
    netIncomeDaily: netIncome / 260,
    netIncomeHourly: netIncome / 2080,
    effectiveTaxRate: gross > 0 ? (totalIncomeTax / gross) * 100 : 0,
    effectiveTotalDeductionRate: effectiveTotalTaxRate,
    marginalTaxRate: 22.0 + maxTrinnRate + (gross >= frikortGrense ? trygdeRate * 100 : 0),
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // Norway native outputs
    trygdeavgift,
    minstefradrag,
    personfradrag,
    alminneligInntekt,
    flatTax,
    trinnskatt,
    totalTax: totalAllTaxes,
    netIncome,

    // Backwards compatibility legacy fields
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: trygdeavgift,
    adjustedGrossIncome: gross - trygdeavgift,
    standardDeductionAmount: personfradrag,
    itemizedDeductionsTotal: minstefradrag + customDeductions,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: minstefradrag + personfradrag + customDeductions,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: alminneligInntekt,
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
    ficaSocialSecurity: trygdeavgift,
    ficaMedicare: 0,
    totalFicaTax: trygdeavgift,
    totalFederalTaxes: totalAllTaxes,
    stateIncomeTax: flatTax,
    stateTaxName: 'Kommune/Fylkesskatt (22%)',
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
    marginalFederalRate: maxTrinnRate,
  };
}
