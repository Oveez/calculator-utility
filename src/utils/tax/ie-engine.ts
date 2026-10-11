import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxBracket,
  BracketCalculationDetail,
} from '../../data/tax/types';
import { ieProfile } from '../../data/tax/countries/ie';

export interface IeTaxParams {
  grossIncome: number;
  taxYear?: string;
  maritalStatus?: 'single' | 'married_one' | 'married_two' | string;
  pensionContributions?: number;
  additionalTaxCredits?: number;
  federalTaxWithheld?: number;
}

export interface IeTaxResult extends AdvancedTaxResult {
  standardRateTax: number;
  higherRateTax: number;
  grossIncomeTax: number;
  baseTaxCredits: number;
  additionalTaxCredits: number;
  totalUsc: number;
  totalPrsi: number;
  cutOffPoint: number;
}

export function calculateIeTax(
  inputsOrParams: AdvancedTaxInputs | IeTaxParams,
  profile: CountryTaxProfile = ieProfile
): IeTaxResult {
  const isParams = 'grossIncome' in inputsOrParams;
  const primaryW2 = isParams
    ? Math.max(0, (inputsOrParams as IeTaxParams).grossIncome || 0)
    : Math.max(0, (inputsOrParams as AdvancedTaxInputs).primaryW2Income || 0);

  const spouseW2 = !isParams ? Math.max(0, (inputsOrParams as AdvancedTaxInputs).spouseW2Income || 0) : 0;
  const businessNet = !isParams ? Math.max(0, (inputsOrParams as AdvancedTaxInputs).businessNetIncome || 0) : 0;
  const otherInc = !isParams ? Math.max(0, (inputsOrParams as AdvancedTaxInputs).otherIncome || 0) : 0;

  const totalGrossIncome = primaryW2 + spouseW2 + businessNet + otherInc;
  const selectedYear = inputsOrParams.taxYear && profile.years[inputsOrParams.taxYear]
    ? inputsOrParams.taxYear
    : profile.defaultTaxYear;
  const yearData = profile.years[selectedYear] || profile.years[profile.defaultTaxYear];

  const maritalStatus = isParams
    ? (inputsOrParams as IeTaxParams).maritalStatus || 'single'
    : (inputsOrParams as AdvancedTaxInputs).filingStatus || 'single';

  const pension = isParams
    ? Math.max(0, (inputsOrParams as IeTaxParams).pensionContributions || 0)
    : Math.max(0, (inputsOrParams as AdvancedTaxInputs).preTaxRetirement401k || 0);

  const extraCredits = isParams
    ? Math.max(0, (inputsOrParams as IeTaxParams).additionalTaxCredits || 0)
    : 0;

  // 1. Taxable income for PAYE (gross minus pension relief)
  const taxableIncome = Math.max(0, totalGrossIncome - pension);

  // 2. Standard Rate Cut-Off Point (SRCOP) & Credits based on marital status
  let cutOff = 44000;
  let baseCredits = 4000; // €2,000 Single Personal + €2,000 Employee/PAYE credit
  if (maritalStatus === 'married_one' || maritalStatus === 'married_joint') {
    cutOff = 53000;
    baseCredits = 6000; // €4,000 Married Personal + €2,000 Employee credit
  } else if (maritalStatus === 'married_two') {
    cutOff = 88000;
    baseCredits = 8000; // €4,000 Married Personal + €4,000 Employee credits (2 workers)
  }

  const totalCredits = baseCredits + extraCredits;

  // 3. PAYE Income Tax Calculation
  let standardRateTax = 0;
  let higherRateTax = 0;
  let marginalFederalRate = 0;
  const bracketBreakdown: BracketCalculationDetail[] = [];

  if (taxableIncome > cutOff) {
    standardRateTax = cutOff * 0.20;
    higherRateTax = (taxableIncome - cutOff) * 0.40;
    marginalFederalRate = 40;

    bracketBreakdown.push({
      bracketRange: `€0 – €${cutOff.toLocaleString('en-IE')}`,
      ratePercent: '20%',
      taxableInBracket: cutOff,
      taxAmount: standardRateTax,
    });
    bracketBreakdown.push({
      bracketRange: `Over €${cutOff.toLocaleString('en-IE')}`,
      ratePercent: '40%',
      taxableInBracket: taxableIncome - cutOff,
      taxAmount: higherRateTax,
    });
  } else {
    standardRateTax = taxableIncome * 0.20;
    higherRateTax = 0;
    marginalFederalRate = taxableIncome > 0 ? 20 : 0;

    bracketBreakdown.push({
      bracketRange: `€0 – €${cutOff.toLocaleString('en-IE')}`,
      ratePercent: '20%',
      taxableInBracket: taxableIncome,
      taxAmount: standardRateTax,
    });
    bracketBreakdown.push({
      bracketRange: `Over €${cutOff.toLocaleString('en-IE')}`,
      ratePercent: '40%',
      taxableInBracket: 0,
      taxAmount: 0,
    });
  }

  const grossIncomeTax = standardRateTax + higherRateTax;
  const netIncomeTax = Math.max(0, grossIncomeTax - totalCredits);

  // 4. Universal Social Charge (USC) - based on gross income
  let totalUsc = 0;
  if (totalGrossIncome > 13000) {
    const uscBands = [
      { threshold: 0, upTo: 12012, rate: 0.005 },
      { threshold: 12012, upTo: 28700, rate: 0.02 },
      { threshold: 28700, upTo: 70044, rate: 0.03 },
      { threshold: 70044, upTo: Infinity, rate: 0.08 },
    ];

    for (const b of uscBands) {
      if (totalGrossIncome > b.threshold) {
        const slice = Math.min(totalGrossIncome, b.upTo) - b.threshold;
        totalUsc += slice * b.rate;
      }
    }
  }

  // 5. PRSI (Pay Related Social Insurance - Class A @ 4.2%)
  let totalPrsi = 0;
  if (totalGrossIncome > 18304) {
    totalPrsi = totalGrossIncome * 0.042;
  }

  const totalFicaTax = totalUsc + totalPrsi;
  const totalAllTaxes = netIncomeTax + totalFicaTax;

  const fedWithheld = Math.max(0, (inputsOrParams as any).federalTaxWithheld || 0);
  const federalRefundOrOwed = fedWithheld - totalAllTaxes;
  const netAnnualTakeHome = Math.max(0, totalGrossIncome - totalAllTaxes - pension);

  const effectiveFederalRate = totalGrossIncome > 0
    ? (netIncomeTax / totalGrossIncome) * 100
    : 0;

  const effectiveTotalTaxRate = totalGrossIncome > 0
    ? (totalAllTaxes / totalGrossIncome) * 100
    : 0;

  return {
    totalGrossIncome,
    earnedIncome: totalGrossIncome,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: pension,
    adjustedGrossIncome: taxableIncome,
    standardDeductionAmount: 0,
    itemizedDeductionsTotal: 0,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: 0,
    itemizedAdvantage: 0,
    taxableIncome,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    regularIncomeTax: grossIncomeTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: grossIncomeTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: totalCredits,
    netFederalIncomeTax: netIncomeTax,
    ficaSocialSecurity: totalPrsi,
    ficaMedicare: totalUsc,
    totalFicaTax,
    totalFederalTaxes: totalAllTaxes,
    stateIncomeTax: 0,
    stateTaxName: '',
    totalAllTaxes,
    totalPaymentsAndWithholdings: fedWithheld,
    federalRefundOrOwed,
    stateRefundOrOwed: 0,
    combinedRefundOrOwed: federalRefundOrOwed,
    netAnnualTakeHome,
    netMonthlyTakeHome: netAnnualTakeHome / 12,
    netBiweeklyTakeHome: netAnnualTakeHome / 26,
    netWeeklyTakeHome: netAnnualTakeHome / 52,
    netHourlyTakeHome: netAnnualTakeHome / 2080,
    effectiveFederalRate,
    effectiveTotalTaxRate,
    marginalFederalRate,
    bracketBreakdown,
    // Native Irish properties
    standardRateTax,
    higherRateTax,
    grossIncomeTax,
    netIncomeTax,
    baseTaxCredits: baseCredits,
    additionalTaxCredits: extraCredits,
    totalUsc,
    totalPrsi,
    cutOffPoint: cutOff,
  };
}
