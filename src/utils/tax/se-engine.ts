import { seProfile } from '../../data/tax/countries/se';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface SeTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  municipality?: string;
  isChurchMember?: boolean;
  customDeductions?: number;
}

export interface SeTaxResult extends TaxCalculationResult {
  pensionFee: number;
  pensionCredit: number;
  grundavdrag: number;
  customDeductions: number;
  taxableIncome: number;
  municipalRate: number;
  municipalTax: number;
  stateTax: number;
  grossTax: number;
  jobbskatteavdrag: number;
  netIncomeTax: number;
  bracketBreakdown: { range: string; rate: string; taxable: number; tax: number }[];
}

export function calculateSeTax(
  paramsOrInputs: SeTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): SeTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || seProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let municipality = 'national_avg';
  let isChurchMember = false;
  let customDeductions = 0;

  if (isParams) {
    const params = paramsOrInputs as SeTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    municipality = params.municipality || 'national_avg';
    isChurchMember = !!params.isChurchMember;
    customDeductions = Math.max(0, params.customDeductions || 0);
  } else {
    const inputs = paramsOrInputs as AdvancedTaxInputs;
    gross = Math.max(
      0,
      (inputs.primaryW2Income || 0) +
        (inputs.spouseW2Income || 0) +
        (inputs.businessNetIncome || 0) +
        (inputs.otherIncome || 0) +
        (inputs.taxableInterest || 0) +
        (inputs.ordinaryDividends || 0) +
        (inputs.qualifiedDividends || 0) +
        (inputs.longTermCapitalGains || 0)
    );
    taxYear = (inputs.taxYear as '2025' | '2026') || '2026';
    municipality = 'national_avg';
    isChurchMember = false;
    customDeductions = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // Statutory parameters
  // Prisbasbelopp (PBB): 59,200 SEK in 2026, 57,300 SEK in 2025
  const pbb = taxYear === '2025' ? 57300 : 59200;

  // Grundavdrag baseline
  const grundavdrag = yearData.standardDeduction || (taxYear === '2025' ? 24000 : 25000);
  const totalDeductions = grundavdrag + customDeductions;

  // 1. Allmän pensionsavgift (7% public pension fee, capped at 643,000 in 2026 / 614,000 in 2025)
  const pensionRule = yearData.socialContributions?.find((c: any) => c.id === 'pension_fee');
  const pensionRate = pensionRule?.employeeRate || 0.07;
  const pensionCap = pensionRule?.capAmount || (taxYear === '2025' ? 614000 : 643000);
  const pensionFee = Math.min(gross, pensionCap) * pensionRate;

  // 2. Taxable Income (Taxerad förvärvsinkomst)
  const taxableIncome = Math.max(0, gross - totalDeductions);

  // 3. Municipal Tax Rate Calculation
  let municipalDiff = 0;
  if (municipality === 'stockholm') municipalDiff = -0.0256;
  else if (municipality === 'gothenburg') municipalDiff = 0.0022;
  else if (municipality === 'malmo') municipalDiff = 0.0004;
  else if (municipality === 'uppsala') municipalDiff = -0.0016;
  else if (municipality === 'linkoping') municipalDiff = -0.0044;

  const baseAverageKommun = taxYear === '2025' ? 0.3237 : 0.3238;
  const churchRate = isChurchMember ? 0.01 : 0.0025; // Begravningsavgift ~0.25% included or church ~1.0%
  const municipalRate = baseAverageKommun + municipalDiff + (isChurchMember ? 0.0075 : 0);

  // 4. Municipal Tax (Kommunalskatt)
  const municipalTax = taxableIncome * municipalRate;

  // 5. State Tax (Statlig inkomstskatt 20%)
  const stateThreshold = taxYear === '2025' ? 601800 : 643000;
  const stateTaxRate = 0.20;
  let stateTax = 0;
  let taxableStateSlice = 0;
  if (taxableIncome > stateThreshold) {
    taxableStateSlice = taxableIncome - stateThreshold;
    stateTax = taxableStateSlice * stateTaxRate;
  }

  const grossTax = municipalTax + stateTax;

  // 6. Tax Credits (Skattereduktioner)
  // Under Chapter 67 IL:
  // a) Skattereduktion för allmän pensionsavgift (100% of pension fee)
  const pensionCredit = Math.min(grossTax, pensionFee);

  // b) Jobbskatteavdrag (Earned Income Tax Credit under 67 kap. 7 § IL)
  // Only applies to earned income for taxpayers under 66
  let jobbskatteavdragUnderlag = 0;
  if (gross > 0) {
    if (gross <= 0.91 * pbb) {
      jobbskatteavdragUnderlag = Math.max(0, gross - grundavdrag);
    } else if (gross <= 3.24 * pbb) {
      jobbskatteavdragUnderlag = Math.max(
        0,
        0.91 * pbb + 0.3874 * (gross - 0.91 * pbb) - grundavdrag
      );
    } else if (gross <= 8.08 * pbb) {
      jobbskatteavdragUnderlag = Math.max(
        0,
        1.813 * pbb + 0.251 * (gross - 3.24 * pbb) - grundavdrag
      );
    } else {
      jobbskatteavdragUnderlag = Math.max(0, 3.027 * pbb - grundavdrag);
    }
  }

  // Jobbskatteavdrag is multiplied by municipal tax rate and capped at municipal tax
  const jobbskatteavdrag = Math.max(0, jobbskatteavdragUnderlag * municipalRate);
  const maxJobbCredit = Math.max(0, municipalTax);
  const appliedJobbskatteavdrag = Math.min(maxJobbCredit, jobbskatteavdrag);

  // 7. Net Income Tax & Total Taxes
  // Total tax bill after statutory credits
  const netIncomeTax = Math.max(0, grossTax - pensionCredit - appliedJobbskatteavdrag);
  const totalTax = netIncomeTax + pensionFee;
  const netSalary = Math.max(0, gross - totalTax);

  const effectiveTaxRate = gross > 0 ? (totalTax / gross) * 100 : 0;
  const marginalFederalRate = taxableIncome > stateThreshold ? (municipalRate + stateTaxRate) * 100 : municipalRate * 100;

  // Bracket breakdown for UI table
  const bracketBreakdown = [
    {
      range: `0 – ${new Intl.NumberFormat('sv-SE').format(stateThreshold)} kr`,
      rate: `${(municipalRate * 100).toFixed(2)}%`,
      taxable: Math.min(taxableIncome, stateThreshold),
      tax: Math.min(taxableIncome, stateThreshold) * municipalRate,
    },
    {
      range: `Over ${new Intl.NumberFormat('sv-SE').format(stateThreshold)} kr`,
      rate: `${((municipalRate + stateTaxRate) * 100).toFixed(2)}%`,
      taxable: taxableStateSlice,
      tax: stateTax,
    },
  ];

  const socialContributionsDetails: SocialContributionDetail[] = [
    {
      name: 'Allmän pensionsavgift (7% Public Pension Fee)',
      amount: pensionFee,
      rate: pensionRate,
    },
  ];

  return {
    grossIncome: gross,
    netIncome: netSalary,
    totalTax,
    effectiveTaxRate,
    marginalTaxRate: marginalFederalRate,
    incomeTax: netIncomeTax,
    socialSecurity: pensionFee,
    socialContributionsDetails,
    pensionFee,
    pensionCredit,
    grundavdrag,
    customDeductions,
    taxableIncome,
    municipalRate,
    municipalTax,
    stateTax,
    grossTax,
    jobbskatteavdrag: appliedJobbskatteavdrag,
    netIncomeTax,
    bracketBreakdown,

    // AdvancedTaxResult compatibility
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: 0,
    adjustedGrossIncome: gross,
    standardDeductionAmount: grundavdrag,
    itemizedDeductionsTotal: customDeductions,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: customDeductions > 0 ? 'itemized' : 'standard',
    deductionAmount: totalDeductions,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    regularIncomeTax: netIncomeTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: grossTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: pensionCredit + appliedJobbskatteavdrag,
    netFederalIncomeTax: netIncomeTax,
    ficaSocialSecurity: pensionFee,
    ficaMedicare: 0,
    totalFicaTax: pensionFee,
    totalFederalTaxes: totalTax,
    stateIncomeTax: 0,
    stateTaxName: 'Kommunalskatt',
    totalAllTaxes: totalTax,
    totalPaymentsAndWithholdings: 0,
    federalRefundOrOwed: -totalTax,
    stateRefundOrOwed: 0,
    combinedRefundOrOwed: -totalTax,
    netAnnualTakeHome: netSalary,
    netMonthlyTakeHome: netSalary / 12,
    netBiweeklyTakeHome: netSalary / 26,
    netWeeklyTakeHome: netSalary / 52,
    netHourlyTakeHome: netSalary / 2080,
    effectiveFederalRate: gross > 0 ? (netIncomeTax / gross) * 100 : 0,
    effectiveTotalTaxRate: effectiveTaxRate,
    marginalFederalRate,
  };
}
