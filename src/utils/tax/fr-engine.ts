import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxBracket,
  BracketCalculationDetail,
} from '../../data/tax/types';
import { frProfile } from '../../data/tax/countries/fr';

export interface FrTaxParams {
  grossIncome: number;
  taxYear?: string;
  isMarried?: boolean;
  numChildren?: number;
  customDeductions?: number;
  withheldTax?: number;
}

export interface FrTaxResult extends AdvancedTaxResult {
  profDeduction: number;
  parts: number;
  taxableIncomePerPart: number;
  incomeTax: number;
  csgCrds: number;
  pensionBase: number;
  pensionComp: number;
  totalSocial: number;
}

export function calculateFrTax(
  inputsOrParams: AdvancedTaxInputs | FrTaxParams,
  profile: CountryTaxProfile = frProfile
): FrTaxResult {
  const isParams = 'grossIncome' in inputsOrParams;
  const primaryW2 = isParams
    ? Math.max(0, (inputsOrParams as FrTaxParams).grossIncome || 0)
    : Math.max(0, (inputsOrParams as AdvancedTaxInputs).primaryW2Income || 0);

  const spouseW2 = !isParams ? Math.max(0, (inputsOrParams as AdvancedTaxInputs).spouseW2Income || 0) : 0;
  const businessNet = !isParams ? Math.max(0, (inputsOrParams as AdvancedTaxInputs).businessNetIncome || 0) : 0;
  const otherInc = !isParams ? Math.max(0, (inputsOrParams as AdvancedTaxInputs).otherIncome || 0) : 0;

  const earnedIncome = primaryW2 + spouseW2 + businessNet;
  const totalGrossIncome = earnedIncome + otherInc;

  const selectedYear = inputsOrParams.taxYear && profile.years[inputsOrParams.taxYear]
    ? inputsOrParams.taxYear
    : profile.defaultTaxYear;
  const yearData = profile.years[selectedYear] || profile.years[profile.defaultTaxYear];

  // 1. Professional Expenses (10% capped at €14,171 or custom deduction)
  const customDeductions = isParams
    ? Math.max(0, (inputsOrParams as FrTaxParams).customDeductions || 0)
    : 0;
  const std10Pct = Math.min(earnedIncome * 0.10, 14171);
  const profDeduction = Math.max(std10Pct, customDeductions);
  const adjustedGrossIncome = Math.max(0, totalGrossIncome - profDeduction);

  // 2. Quotient Familial (Parts)
  let parts = 1.0;
  if (isParams) {
    if ((inputsOrParams as FrTaxParams).isMarried) parts = 2.0;
  } else {
    if ((inputsOrParams as AdvancedTaxInputs).filingStatus === 'married_joint') parts = 2.0;
  }

  const children = isParams
    ? Math.max(0, (inputsOrParams as FrTaxParams).numChildren || 0)
    : Math.max(0, (inputsOrParams as AdvancedTaxInputs).numChildrenUnder17 || 0);

  if (children === 1) parts += 0.5;
  else if (children === 2) parts += 1.0;
  else if (children >= 3) parts += 1.0 + (children - 2) * 1.0;

  // 3. Taxable Income per Part
  const incomePerPart = adjustedGrossIncome / parts;
  const standardDeductionAmount = yearData.standardDeduction || 11600;
  const taxableIncomePerPart = Math.max(0, incomePerPart - standardDeductionAmount);

  // 4. Progressive Brackets per Part
  let regularIncomeTaxPerPart = 0;
  let marginalFederalRate = 0;
  const activeBrackets = yearData.nationalBrackets;
  const bracketBreakdown: BracketCalculationDetail[] = [];

  for (let i = 0; i < activeBrackets.length; i++) {
    const b = activeBrackets[i];
    const rangeLabel = b.upTo !== undefined
      ? `€${b.threshold.toLocaleString('fr-FR')} – €${b.upTo.toLocaleString('fr-FR')}`
      : `Au-delà de €${b.threshold.toLocaleString('fr-FR')}`;

    if (taxableIncomePerPart > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(taxableIncomePerPart, b.upTo) - b.threshold
        : taxableIncomePerPart - b.threshold;
      regularIncomeTaxPerPart += slice * b.rate;
      if (slice > 0) marginalFederalRate = b.rate * 100;
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: `${(b.rate * 100).toFixed(0)}%`,
        taxableInBracket: slice * parts,
        taxAmount: slice * b.rate * parts,
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

  const regularIncomeTax = regularIncomeTaxPerPart * parts;
  const grossFederalTax = regularIncomeTax;
  const netFederalIncomeTax = regularIncomeTax;

  // 5. Social Contributions
  const csgCrdsRate = 0.097;
  const csgCrdsBase = earnedIncome * 0.9825;
  const csgCrds = csgCrdsBase * csgCrdsRate;

  const pensionBaseRule = yearData.socialContributions.find((c: any) => c.id === 'pension_base');
  const passCap = pensionBaseRule?.capAmount || 48060;
  const pensionBaseRate = pensionBaseRule?.employeeRate || 0.073;
  const pensionBase = Math.min(earnedIncome, passCap) * pensionBaseRate;

  const pensionCompRule = yearData.socialContributions.find((c: any) => c.id === 'pension_complementaire');
  const pensionCompRate = pensionCompRule?.employeeRate || 0.05;
  const pensionComp = earnedIncome * pensionCompRate;

  const totalFicaTax = csgCrds + pensionBase + pensionComp;
  const totalAllTaxes = netFederalIncomeTax + totalFicaTax;

  const fedWithheld = isParams
    ? Math.max(0, (inputsOrParams as FrTaxParams).withheldTax || 0)
    : Math.max(0, (inputsOrParams as AdvancedTaxInputs).federalTaxWithheld || 0);

  const combinedRefundOrOwed = fedWithheld - totalAllTaxes;
  const netAnnualTakeHome = Math.max(0, totalGrossIncome - totalAllTaxes);

  const effectiveFederalRate = totalGrossIncome > 0
    ? (netFederalIncomeTax / totalGrossIncome) * 100
    : 0;

  const effectiveTotalTaxRate = totalGrossIncome > 0
    ? (totalAllTaxes / totalGrossIncome) * 100
    : 0;

  return {
    totalGrossIncome,
    earnedIncome,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: profDeduction,
    adjustedGrossIncome,
    standardDeductionAmount: standardDeductionAmount * parts,
    itemizedDeductionsTotal: 0,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: standardDeductionAmount * parts + profDeduction,
    itemizedAdvantage: 0,
    taxableIncome: taxableIncomePerPart * parts,
    ordinaryTaxableIncome: taxableIncomePerPart * parts,
    preferentialTaxableIncome: 0,
    regularIncomeTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: 0,
    netFederalIncomeTax,
    ficaSocialSecurity: totalFicaTax,
    ficaMedicare: 0,
    totalFicaTax,
    totalFederalTaxes: totalAllTaxes,
    stateIncomeTax: 0,
    stateTaxName: '',
    totalAllTaxes,
    totalPaymentsAndWithholdings: fedWithheld,
    federalRefundOrOwed: combinedRefundOrOwed,
    stateRefundOrOwed: 0,
    combinedRefundOrOwed,
    netAnnualTakeHome,
    netMonthlyTakeHome: netAnnualTakeHome / 12,
    netBiweeklyTakeHome: netAnnualTakeHome / 26,
    netWeeklyTakeHome: netAnnualTakeHome / 52,
    netHourlyTakeHome: netAnnualTakeHome / 2080,
    effectiveFederalRate,
    effectiveTotalTaxRate,
    marginalFederalRate,
    bracketBreakdown,
    // Native French properties
    profDeduction,
    parts,
    taxableIncomePerPart,
    incomeTax: regularIncomeTax,
    csgCrds,
    pensionBase,
    pensionComp,
    totalSocial: totalFicaTax,
  };
}
