import { jpProfile } from '../../data/tax/countries/jp';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface JpTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  hasInhabitantTax?: boolean;
  customDeductions?: number;
  age?: number | string;
}

export interface JpTaxResult extends TaxCalculationResult {
  employmentIncomeDeduction: number; // 給与所得控除
  basicDeduction: number; // 基礎控除
  shakaiHoken: {
    health: number;
    pension: number;
    employment: number;
    total: number;
  };
  nationalIncomeTax: number; // 所得税 (inclusive of 2.1% reconstruction surtax)
  nationalBaseTax: number;
  reconstructionSurtax: number; // 復興特別所得税 (2.1%)
  inhabitantTax: number; // 住民税 (10%)
}

/**
 * Statutory Employment Income Deduction (給与所得控除) under Japanese Income Tax Act Art. 28.
 */
export function calculateEmploymentIncomeDeduction(gross: number): number {
  if (gross <= 0) return 0;
  if (gross <= 550000) return gross;
  if (gross <= 1625000) return 550000;
  if (gross <= 1800000) return Math.floor(gross * 0.40 - 100000);
  if (gross <= 3600000) return Math.floor(gross * 0.30 + 80000);
  if (gross <= 6600000) return Math.floor(gross * 0.20 + 440000);
  if (gross <= 8500000) return Math.floor(gross * 0.10 + 1100000);
  return 1950000; // Capped at ¥1,950,000 for gross > ¥8,500,000
}

/**
 * Statutory Basic Deduction (基礎控除) under Art. 86.
 */
export function calculateBasicDeduction(gross: number): number {
  if (gross <= 0) return 0;
  if (gross <= 24000000) return 480000;
  if (gross <= 24500000) return 320000;
  if (gross <= 25000000) return 160000;
  return 0;
}

/**
 * Statutory Social Insurance (社会保険料 / Shakai Hoken):
 * - Health Insurance (健康保険): ~5.00% (monthly cap ¥1,390,000 = ¥16.68m annualized)
 * - Employees' Pension (厚生年金): 9.15% (monthly cap ¥650,000 = ¥7.80m annualized)
 * - Employment Insurance (雇用保険): 0.60% (uncapped)
 */
export function calculateShakaiHoken(gross: number): {
  health: number;
  pension: number;
  employment: number;
  total: number;
} {
  if (gross <= 0) return { health: 0, pension: 0, employment: 0, total: 0 };
  const pensionCap = 7800000;
  const healthCap = 16680000;
  const pension = Math.min(gross, pensionCap) * 0.0915;
  const health = Math.min(gross, healthCap) * 0.050;
  const employment = gross * 0.0060;
  return {
    health,
    pension,
    employment,
    total: pension + health + employment,
  };
}

export function calculateJpTax(
  paramsOrInputs: JpTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): JpTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || jpProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let hasInhabitant = true;
  let customDeductions = 0;

  if (isParams) {
    const params = paramsOrInputs as JpTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    hasInhabitant = params.hasInhabitantTax !== false;
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
    hasInhabitant = inputs.stateProvCode !== 'national_only';
    customDeductions = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. Social Insurance (社会保険)
  const shakaiHoken = calculateShakaiHoken(gross);

  // 2. Statutory Deductions
  const employmentIncomeDeduction = calculateEmploymentIncomeDeduction(gross);
  const basicDeduction = calculateBasicDeduction(gross);
  const totalStandardDeductions = employmentIncomeDeduction + basicDeduction + customDeductions;

  // 3. Taxable Income for National Tax
  // In Japan, social insurance is fully deductible from gross income
  const totalDeductions = totalStandardDeductions + shakaiHoken.total;
  const taxableIncome = Math.max(0, gross - totalDeductions);

  // 4. National Income Tax (所得税)
  let nationalBaseTax = 0;
  const activeBrackets = yearData.nationalBrackets;
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
      ? `¥${b.threshold.toLocaleString('ja-JP')} – ¥${b.upTo.toLocaleString('ja-JP')}`
      : `Over ¥${b.threshold.toLocaleString('ja-JP')}`;

    if (taxableIncome > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(taxableIncome, b.upTo) - b.threshold
        : taxableIncome - b.threshold;
      // In national brackets, the statutory base rate is before 2.1% reconstruction surtax
      // For reference: base rates are 5%, 10%, 20%, 23%, 33%, 40%, 45%
      const baseRate = b.rate / 1.021;
      const baseTax = slice * baseRate;
      nationalBaseTax += baseTax;
      if (slice > 0) marginalRate = b.rate * 100;
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(b.rate * 100).toFixed(3)}%`,
        taxableInBracket: slice,
        taxAmount: slice * b.rate,
      });
    } else {
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(b.rate * 100).toFixed(3)}%`,
        taxableInBracket: 0,
        taxAmount: 0,
      });
    }
  }

  // Reconstruction Surtax (復興特別所得税 2.1% through 2037)
  const reconstructionSurtax = nationalBaseTax * 0.021;
  const nationalIncomeTax = nationalBaseTax + reconstructionSurtax;

  // 5. Inhabitant Tax (住民税 - 10% flat)
  const inhabitantTax = hasInhabitant ? taxableIncome * 0.10 : 0;

  // 6. Totals
  const totalIncomeTax = nationalIncomeTax + inhabitantTax;
  const totalAllTaxes = totalIncomeTax + shakaiHoken.total;
  const netAnnualTakeHome = Math.max(0, gross - totalAllTaxes);

  const effectiveFederalRate = gross > 0 ? (nationalIncomeTax / gross) * 100 : 0;
  const effectiveTotalTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = [
    {
      name: "Employees' Pension (厚生年金)",
      ratePercent: '9.15%',
      amount: shakaiHoken.pension,
      description: 'Statutory pension insurance (cap ¥7.80M/yr)',
    },
    {
      name: 'Health Insurance (健康保険)',
      ratePercent: '5.00%',
      amount: shakaiHoken.health,
      description: 'Statutory medical care insurance (cap ¥16.68M/yr)',
    },
    {
      name: 'Employment Insurance (雇用保険)',
      ratePercent: '0.60%',
      amount: shakaiHoken.employment,
      description: 'Unemployment protection scheme',
    },
  ];

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: totalStandardDeductions,
    taxableIncome,
    nationalIncomeTax,
    regionalIncomeTax: inhabitantTax,
    totalIncomeTax,
    socialContributions,
    totalSocialContributions: shakaiHoken.total,
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
    marginalTotalRate: marginalRate + (hasInhabitant ? 10 : 0) + 14.75,
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // Country-specific native outputs
    employmentIncomeDeduction,
    basicDeduction,
    shakaiHoken,
    nationalBaseTax,
    reconstructionSurtax,
    inhabitantTax,

    // Legacy AdvancedTaxResult compatibility
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: shakaiHoken.total,
    adjustedGrossIncome: gross - shakaiHoken.total,
    standardDeductionAmount: totalStandardDeductions,
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
    ficaSocialSecurity: shakaiHoken.pension,
    ficaMedicare: shakaiHoken.health + shakaiHoken.employment,
    totalFicaTax: shakaiHoken.total,
    totalFederalTaxes: nationalIncomeTax + shakaiHoken.total,
    stateIncomeTax: inhabitantTax,
    stateTaxName: 'Inhabitant Tax (住民税 10%)',
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
