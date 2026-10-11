import { fiProfile } from '../../data/tax/countries/fi';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface FiTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  regionCode?: string; // e.g. 'helsinki', 'espoo', 'national_avg'
  churchTax?: boolean;
  customDeductions?: number;
}

export interface FiTaxResult extends TaxCalculationResult {
  pensionContribution: number;
  unemploymentContribution: number;
  healthContribution: number;
  tulonhankkimisvahennys: number;
  perusvahennys: number;
  tyotulovahennys: number;
  stateTax: number;
  regionalTax: number;
  churchTaxAmount: number;
}

export function calculateFiTax(
  paramsOrInputs: FiTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): FiTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || fiProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let regionCode = 'national_avg';
  let churchTax = false;
  let customDeductions = 0;

  if (isParams) {
    const params = paramsOrInputs as FiTaxParams;
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

  // 1. Mandatory Employee Social Contributions
  const pensionRate = 0.073; // Työeläke 7.30%
  const unemploymentRate = 0.0079; // Työttömyysvakuutus 0.79%
  const healthRate = 0.011; // Sairausvakuutus 1.10%

  const pensionContribution = gross * pensionRate;
  const unemploymentContribution = gross * unemploymentRate;
  const healthContribution = gross * healthRate;
  const totalSocial = pensionContribution + unemploymentContribution + healthContribution;

  // 2. Statutory Standard Work Deduction (Tulonhankkimisvähennys, TVL § 95)
  // Standard automatic €750 deduction on employment income (or gross if gross < €750)
  const tulonhankkimisvahennys = Math.min(gross, 750);

  // Net earned income after social and work deduction
  const netEarned = Math.max(0, gross - totalSocial - tulonhankkimisvahennys - customDeductions);

  // 3. Basic Municipal Deduction (Perusvähennys, TVL § 98)
  // Max €4,000 in 2026 (€3,980 in 2025); abated at 18% of net income exceeding €4,000
  let perusvahennys = 0;
  if (netEarned > 0) {
    if (netEarned <= 4000) {
      perusvahennys = netEarned;
    } else {
      perusvahennys = Math.max(0, 4000 - (netEarned - 4000) * 0.18);
    }
  }

  // 4. State Income Tax (Valtion tulovero)
  const stateThreshold = yearData.standardDeduction || 22000;
  const stateTaxableForBrackets = Math.max(0, netEarned - stateThreshold);

  let grossStateTax = 0;
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
    const rangeLabel = b.upTo !== undefined
      ? `€${(b.threshold + stateThreshold).toLocaleString('fi-FI')} – €${(b.upTo + stateThreshold).toLocaleString('fi-FI')}`
      : `Yli €${(b.threshold + stateThreshold).toLocaleString('fi-FI')}`;

    if (stateTaxableForBrackets > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(stateTaxableForBrackets, b.upTo) - b.threshold
        : stateTaxableForBrackets - b.threshold;
      const tax = slice * b.rate;
      grossStateTax += tax;
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

  // 5. Municipal Tax (Kunnallisvero) & Church Tax
  const municipalBase = Math.max(0, netEarned - perusvahennys);
  let kuntaRate = 0.075; // national avg
  const region = yearData.regions?.find((r) => r.code === regionCode);
  if (region && region.additionalTaxRate) {
    kuntaRate = region.additionalTaxRate;
  }

  const churchTaxRate = churchTax ? 0.01 : 0;
  const churchTaxAmount = municipalBase * churchTaxRate;
  const grossRegionalTax = municipalBase * (kuntaRate + churchTaxRate);

  // 6. Earned Income Tax Credit (Työtulovähennys, TVL § 125)
  // In 2026: 12% of earned income above €2,500, max €2,140; abated at 4.5% above €22,000
  let tyotulovahennys = 0;
  if (gross > 2500) {
    const baseCredit = Math.min((gross - 2500) * 0.12, 2140);
    const phaseOut = gross > 22000 ? (gross - 22000) * 0.045 : 0;
    tyotulovahennys = Math.max(0, baseCredit - phaseOut);
  }

  // Total gross income tax before credits
  const totalGrossTax = grossStateTax + grossRegionalTax;
  const totalIncomeTax = Math.max(0, totalGrossTax - tyotulovahennys);

  // Distribute tax credit proportionally or state-first
  const stateTax = Math.max(0, grossStateTax - Math.min(grossStateTax, tyotulovahennys));
  const remainingCredit = Math.max(0, tyotulovahennys - grossStateTax);
  const regionalTax = Math.max(0, grossRegionalTax - remainingCredit);

  const totalAllTaxes = totalIncomeTax + totalSocial;
  const netIncome = Math.max(0, gross - totalAllTaxes);
  const effectiveTotalTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = [
    {
      name: 'Pension Insurance (Työeläkemaksu)',
      ratePercent: '7.30%',
      amount: pensionContribution,
      description: '7.30% lakisääteinen työeläkevakuutusmaksu.',
    },
    {
      name: 'Unemployment Insurance (Työttömyysvakuutus)',
      ratePercent: '0.79%',
      amount: unemploymentContribution,
      description: '0.79% palkansaajan työttömyysvakuutusmaksu.',
    },
    {
      name: 'Health Insurance (Sairausvakuutus)',
      ratePercent: '1.10%',
      amount: healthContribution,
      description: '1.10% sairausvakuutuksen päiväraha- ja sairaanhoitomaksu.',
    },
  ];

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: tulonhankkimisvahennys + perusvahennys + customDeductions,
    taxableIncome: netEarned,
    nationalIncomeTax: stateTax,
    regionalIncomeTax: regionalTax,
    totalIncomeTax,
    socialContributions,
    totalSocialContributions: totalSocial,
    totalTaxAndDeductions: totalAllTaxes,
    netIncomeAnnual: netIncome,
    netIncomeMonthly: netIncome / 12,
    netIncomeBiweekly: netIncome / 26,
    netIncomeWeekly: netIncome / 52,
    netIncomeDaily: netIncome / 260,
    netIncomeHourly: netIncome / 2080,
    effectiveTaxRate: gross > 0 ? (totalIncomeTax / gross) * 100 : 0,
    effectiveTotalDeductionRate: effectiveTotalTaxRate,
    marginalTaxRate: marginalRate + (kuntaRate + churchTaxRate) * 100,
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // Finland native outputs
    pensionContribution,
    unemploymentContribution,
    healthContribution,
    tulonhankkimisvahennys,
    perusvahennys,
    tyotulovahennys,
    stateTax,
    regionalTax,
    churchTaxAmount,
    totalTax: totalAllTaxes,
    netIncome,

    // Backwards compatibility legacy fields
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: totalSocial,
    adjustedGrossIncome: gross - totalSocial,
    standardDeductionAmount: tulonhankkimisvahennys + perusvahennys,
    itemizedDeductionsTotal: customDeductions,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: tulonhankkimisvahennys + perusvahennys + customDeductions,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: netEarned,
    preferentialTaxableIncome: 0,
    regularIncomeTax: stateTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: stateTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: tyotulovahennys,
    netFederalIncomeTax: stateTax,
    ficaSocialSecurity: pensionContribution,
    ficaMedicare: healthContribution,
    totalFicaTax: totalSocial,
    totalFederalTaxes: stateTax + totalSocial,
    stateIncomeTax: regionalTax,
    stateTaxName: `Kunnallisvero (${(kuntaRate * 100).toFixed(2)}%)`,
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
