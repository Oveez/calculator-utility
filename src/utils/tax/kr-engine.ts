import { krProfile } from '../../data/tax/countries/kr';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface KrTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  dependentsCount?: number;
  hasDependentSpouse?: boolean;
  customDeductions?: number;
}

export interface KrTaxResult extends TaxCalculationResult {
  earnedIncomeDeduction: number; // 근로소득공제
  basicPersonalDeduction: number; // 기본공제 (₩1,500,000 per person)
  fourMajorInsurances: {
    pension: number;
    health: number;
    longTermCare: number;
    employment: number;
    total: number;
  };
  nationalIncomeTax: number;
  localIncomeTax: number; // 10% surtax on national tax
}

/**
 * Statutory Earned Income Deduction (근로소득공제) under Korean Income Tax Act Article 47:
 * - Up to ₩5,000,000: 70% of gross
 * - ₩5,000,001 to ₩15,000,000: ₩3.5M + 40% of excess
 * - ₩15,000,001 to ₩45,000,000: ₩7.5M + 15% of excess
 * - ₩45,000,001 to ₩100,000,000: ₩12.0M + 5% of excess
 * - Over ₩100,000,000: ₩14.75M + 2% of excess (capped at ₩20,000,000)
 */
export function calculateEarnedIncomeDeduction(gross: number): number {
  if (gross <= 0) return 0;
  if (gross <= 5000000) return gross * 0.70;
  if (gross <= 15000000) return 3500000 + (gross - 5000000) * 0.40;
  if (gross <= 45000000) return 7500000 + (gross - 15000000) * 0.15;
  if (gross <= 100000000) return 12000000 + (gross - 45000000) * 0.05;
  const uncapped = 14750000 + (gross - 100000000) * 0.02;
  return Math.min(20000000, uncapped);
}

/**
 * 4 Major Social Insurances (4대보험)
 */
export function calculateFourMajorInsurances(
  gross: number,
  taxYear: '2025' | '2026' = '2026'
): {
  pension: number;
  health: number;
  longTermCare: number;
  employment: number;
  total: number;
} {
  if (gross <= 0) return { pension: 0, health: 0, longTermCare: 0, employment: 0, total: 0 };

  const is2026 = taxYear === '2026';
  const pensionRate = is2026 ? 0.0475 : 0.0450;
  const pensionCap = is2026 ? 76000000 : 74040000;
  const pension = Math.min(gross, pensionCap) * pensionRate;

  const healthRate = 0.03595;
  const health = gross * healthRate;

  const longTermCareRate = 0.1314;
  const longTermCare = health * longTermCareRate;

  const employmentRate = 0.0090;
  const employment = gross * employmentRate;

  return {
    pension,
    health,
    longTermCare,
    employment,
    total: pension + health + longTermCare + employment,
  };
}

export function calculateKrTax(
  paramsOrInputs: KrTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): KrTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || krProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let persons = 1;
  let customDeductions = 0;

  if (isParams) {
    const params = paramsOrInputs as KrTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    if (params.hasDependentSpouse) persons += 1;
    if (params.dependentsCount) persons += Math.max(0, params.dependentsCount);
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
    if (inputs.filingStatus === 'married_joint') persons += 1;
    if (inputs.numChildrenUnder17) persons += inputs.numChildrenUnder17;
    customDeductions = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. Earned Income Deduction (근로소득공제)
  const earnedIncomeDeduction = calculateEarnedIncomeDeduction(gross);

  // 2. Basic Personal Deduction (기본공제)
  const basicPersonalDeduction = (yearData.standardDeduction || 1500000) * persons;

  // 3. 4 Major Social Insurances (4대보험)
  const fourMajorInsurances = calculateFourMajorInsurances(gross, taxYear);

  // 4. Taxable Base (과세표준)
  const totalDeductions = earnedIncomeDeduction + basicPersonalDeduction + customDeductions;
  const taxableIncome = Math.max(0, gross - totalDeductions);

  // 5. National Income Tax (종합소득세)
  const activeBrackets = yearData.nationalBrackets;
  let nationalIncomeTax = 0;
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
      ? `₩${b.threshold.toLocaleString('ko-KR')} – ₩${b.upTo.toLocaleString('ko-KR')}`
      : `Over ₩${b.threshold.toLocaleString('ko-KR')}`;

    if (taxableIncome > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(taxableIncome, b.upTo) - b.threshold
        : taxableIncome - b.threshold;
      const tax = slice * b.rate;
      nationalIncomeTax += tax;
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

  // 6. Local Income Tax (지방소득세 - 10% surtax on national tax)
  const localIncomeTax = nationalIncomeTax * 0.10;

  // 7. Totals
  const totalIncomeTax = nationalIncomeTax + localIncomeTax;
  const totalAllTaxes = totalIncomeTax + fourMajorInsurances.total;
  const netAnnualTakeHome = Math.max(0, gross - totalAllTaxes);

  const effectiveFederalRate = gross > 0 ? (nationalIncomeTax / gross) * 100 : 0;
  const effectiveTotalTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = [
    {
      name: 'National Pension (국민연금)',
      ratePercent: taxYear === '2026' ? '4.75%' : '4.50%',
      amount: fourMajorInsurances.pension,
      description: 'Statutory pension contribution',
    },
    {
      name: 'Health Insurance (건강보험)',
      ratePercent: '3.595%',
      amount: fourMajorInsurances.health,
      description: 'National health insurance scheme',
    },
    {
      name: 'Long-term Care (장기요양)',
      ratePercent: '0.472%',
      amount: fourMajorInsurances.longTermCare,
      description: 'Elderly care support (13.14% of health insurance)',
    },
    {
      name: 'Employment Insurance (고용보험)',
      ratePercent: '0.90%',
      amount: fourMajorInsurances.employment,
      description: 'Unemployment protection benefit',
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
    nationalIncomeTax,
    regionalIncomeTax: localIncomeTax,
    totalIncomeTax,
    socialContributions,
    totalSocialContributions: fourMajorInsurances.total,
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
    marginalTotalRate: marginalRate * 1.1 + (taxYear === '2026' ? 9.72 : 9.47),
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // South Korea Native Outputs
    earnedIncomeDeduction,
    basicPersonalDeduction,
    fourMajorInsurances,
    localIncomeTax,

    // Legacy AdvancedTaxResult compatibility
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: fourMajorInsurances.total,
    adjustedGrossIncome: gross - fourMajorInsurances.total,
    standardDeductionAmount: totalDeductions,
    itemizedDeductionsTotal: customDeductions,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: totalDeductions,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    regularIncomeTax: nationalIncomeTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: nationalIncomeTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: 0,
    netFederalIncomeTax: nationalIncomeTax,
    ficaSocialSecurity: fourMajorInsurances.pension,
    ficaMedicare: fourMajorInsurances.health + fourMajorInsurances.longTermCare + fourMajorInsurances.employment,
    totalFicaTax: fourMajorInsurances.total,
    totalFederalTaxes: nationalIncomeTax + fourMajorInsurances.total,
    stateIncomeTax: localIncomeTax,
    stateTaxName: 'Local Income Tax (지방소득세 10%)',
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
