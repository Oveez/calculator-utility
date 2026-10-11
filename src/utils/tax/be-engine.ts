import { beProfile } from '../../data/tax/countries/be';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface BeTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  communeRate?: number; // e.g. 0.07 for 7%
  customDeductions?: number;
}

export interface BeTaxResult extends TaxCalculationResult {
  onss: number;
  fraisProfessionnels: number;
  federalTax: number;
  communeTax: number;
  communeRate: number;
}

export function calculateBeTax(
  paramsOrInputs: BeTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): BeTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || beProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let communeRate = 0.07;
  let customDeductions = 0;

  if (isParams) {
    const params = paramsOrInputs as BeTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    communeRate = params.communeRate !== undefined ? params.communeRate : 0.07;
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
    communeRate = 0.07;
    customDeductions = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. Cotisation ONSS / RSZ (13.07% non plafonné)
  const onssRate = yearData.socialContributions.find((c) => c.id === 'onss')?.employeeRate || 0.1307;
  const onss = gross * onssRate;

  // 2. Déduction forfaitaire pour frais professionnels (Art. 51 CIR 92)
  // 30% du revenu après ONSS, plafonné à €5,750 (2025/2026)
  const netBeforeForfait = Math.max(0, gross - onss);
  const maxForfait = 5750;
  const fraisProfessionnels = Math.min(netBeforeForfait * 0.30, maxForfait);

  // 3. Base imposable
  const taxableNet = Math.max(0, netBeforeForfait - fraisProfessionnels - customDeductions);
  const quotiteExemptee = yearData.standardDeduction || 11180;
  const taxableForBrackets = Math.max(0, taxableNet - quotiteExemptee);

  // 4. Impôt fédéral (IPP / Personenbelasting)
  const brackets = yearData.nationalBrackets || [];
  let federalTax = 0;
  let marginalRate = 0;
  const bracketBreakdown: {
    bracketRange: string;
    ratePercent: string;
    taxableInBracket: number;
    taxAmount: number;
  }[] = [];

  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    const rangeLabel = b.upTo !== undefined
      ? `€${b.threshold.toLocaleString('fr-BE')} – €${b.upTo.toLocaleString('fr-BE')}`
      : `Plus de €${b.threshold.toLocaleString('fr-BE')}`;

    if (taxableForBrackets > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(taxableForBrackets, b.upTo) - b.threshold
        : taxableForBrackets - b.threshold;
      const tax = slice * b.rate;
      federalTax += tax;
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

  // 5. Taxe communale additionnelle (sur impôt fédéral de base)
  const communeTax = federalTax * communeRate;

  // 6. Totaux
  const totalIncomeTax = federalTax + communeTax;
  const totalAllTaxes = totalIncomeTax + onss;
  const netIncome = Math.max(0, gross - totalAllTaxes);
  const effectiveTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = [
    {
      name: 'ONSS / RSZ Social Security',
      ratePercent: '13.07%',
      amount: onss,
      description: 'Cotisation travailleur obligatoire de 13.07% sur le salaire brut non plafonné.',
    },
  ];

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: quotiteExemptee + fraisProfessionnels + customDeductions,
    taxableIncome: taxableNet,
    nationalIncomeTax: federalTax,
    regionalIncomeTax: communeTax,
    totalIncomeTax,
    socialContributions,
    totalSocialContributions: onss,
    totalTaxAndDeductions: totalAllTaxes,
    netIncomeAnnual: netIncome,
    netIncomeMonthly: netIncome / 12,
    netIncomeBiweekly: netIncome / 26,
    netIncomeWeekly: netIncome / 52,
    netIncomeDaily: netIncome / 260,
    netIncomeHourly: netIncome / 2080,
    effectiveTaxRate: gross > 0 ? (totalIncomeTax / gross) * 100 : 0,
    effectiveTotalDeductionRate: effectiveTaxRate,
    marginalTaxRate: marginalRate,
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // Belgium native outputs
    onss,
    fraisProfessionnels,
    federalTax,
    communeTax,
    communeRate,
    totalTax: totalAllTaxes,
    netIncome,

    // Backwards compatibility legacy fields
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: onss,
    adjustedGrossIncome: gross - onss,
    standardDeductionAmount: quotiteExemptee,
    itemizedDeductionsTotal: fraisProfessionnels + customDeductions,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: quotiteExemptee + fraisProfessionnels + customDeductions,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: taxableNet,
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
    ficaSocialSecurity: onss,
    ficaMedicare: 0,
    totalFicaTax: onss,
    totalFederalTaxes: federalTax + onss,
    stateIncomeTax: communeTax,
    stateTaxName: `Taxe communale (${(communeRate * 100).toFixed(1)}%)`,
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
    effectiveTotalTaxRate: effectiveTaxRate,
    marginalFederalRate: marginalRate,
  };
}
