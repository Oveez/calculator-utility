import { plProfile } from '../../data/tax/countries/pl';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
} from '../../data/tax/types';

export interface PlBracketDetail {
  range: string;
  rate: string;
  taxable: number;
  tax: number;
}

export interface PlTaxParams {
  grossIncome?: number;
  primaryW2Income?: number; // for backward compatibility with legacy tests
  taxYear?: string;
  isUnder26?: boolean;
  hasAuthorCosts?: boolean;
  hasPpk?: boolean;
}

export interface PlTaxResult {
  grossIncome: number;
  zusSocial: number;
  nfzHealth: number;
  ppkEmployee: number;
  totalSocialContributions: number;
  kupDeduction: number;
  taxBaseBeforeAllowance: number;
  taxableIncome: number;
  kwotaWolna: number;
  taxablePitBase: number;
  pitTax: number;
  totalTax: number;
  totalDeductions: number;
  netTakeHome: number;
  effectiveTaxRate: number; // in percent (e.g. 6.39)
  marginalTaxRate: number;
  bracketBreakdown: PlBracketDetail[];

  // Legacy fields for backward compatibility
  totalGrossIncome: number;
  totalOrdinaryTax: number;
  deductionAmount: number;
}

export function calculatePlTax(
  params: PlTaxParams | AdvancedTaxInputs,
  profile: CountryTaxProfile = plProfile
): PlTaxResult {
  const selectedYear = params.taxYear && profile.years[params.taxYear]
    ? params.taxYear
    : profile.defaultTaxYear;
  const yearData = profile.years[selectedYear] || profile.years[profile.defaultTaxYear];

  const gross = Math.max(
    0,
    'grossIncome' in params && params.grossIncome !== undefined
      ? params.grossIncome
      : 'primaryW2Income' in params
      ? params.primaryW2Income || 0
      : 0
  );

  const isUnder26 = Boolean('isUnder26' in params && params.isUnder26);
  const hasAuthorCosts = Boolean('hasAuthorCosts' in params && params.hasAuthorCosts);
  const hasPpk = Boolean('hasPpk' in params && params.hasPpk);

  // 1. ZUS Social Contributions (13.71% capped at 30x average salary, e.g. 260,000 PLN)
  const zusConfig = yearData.socialContributions.find((c: any) => c.id === 'zus_spoleczne');
  const zusRate = zusConfig?.employeeRate || 0.1371;
  const zusCap = zusConfig?.capAmount || 260000;
  const zusBasis = Math.min(gross, zusCap);
  const zusSocial = zusBasis * zusRate;

  // 2. NFZ Health Insurance (9.0% on gross minus ZUS social)
  const nfzConfig = yearData.socialContributions.find((c: any) => c.id === 'nfz_zdrowotna');
  const nfzRate = nfzConfig?.employeeRate || 0.09;
  const nfzBasis = Math.max(0, gross - zusSocial);
  const nfzHealth = nfzBasis * nfzRate;

  // 3. PPK Employee Contribution (2.0%)
  const ppkEmployee = hasPpk ? gross * 0.02 : 0;
  const totalSocialContributions = zusSocial + nfzHealth + ppkEmployee;

  // 4. Koszty uzyskania przychodów (KUP - statutory Art. 22 ust. 2: 3,000 PLN/yr or 50% copyright)
  let kupDeduction = gross > 0 ? 3000 : 0;
  if (hasAuthorCosts && gross > 0) {
    kupDeduction = Math.max(kupDeduction, (gross - zusSocial) * 0.50);
  }

  const taxBaseBeforeAllowance = Math.max(0, gross - zusSocial - kupDeduction);
  const kwotaWolna = yearData.standardDeduction || 30000;
  const taxablePitBase = Math.max(0, taxBaseBeforeAllowance - kwotaWolna);

  // 5. PIT Tax & Brackets
  let pitTax = 0;
  let marginalTaxRate = 0;
  const bracketBreakdown: PlBracketDetail[] = [];

  if (isUnder26) {
    // Youth relief (Ulga dla młodych): 0% up to 85,528 zł
    const reliefThreshold = 85528;
    const taxableAfterRelief = Math.max(0, taxBaseBeforeAllowance - reliefThreshold);
    const pitTaxBaseUnder26 = Math.max(0, taxableAfterRelief - kwotaWolna);

    if (pitTaxBaseUnder26 > 0) {
      const slice1 = Math.min(pitTaxBaseUnder26, 90000);
      const slice2 = Math.max(0, pitTaxBaseUnder26 - 90000);
      pitTax = slice1 * 0.12 + slice2 * 0.32;
      marginalTaxRate = slice2 > 0 ? 32 : 12;
    }

    bracketBreakdown.push({
      range: 'Ulga dla Młodych (do 85,528 zł)',
      rate: '0.00%',
      taxable: Math.min(gross, reliefThreshold),
      tax: 0,
    });
    bracketBreakdown.push({
      range: 'I Próg (12%)',
      rate: '12.00%',
      taxable: Math.max(0, Math.min(pitTaxBaseUnder26, 90000)),
      tax: Math.max(0, Math.min(pitTaxBaseUnder26, 90000)) * 0.12,
    });
    bracketBreakdown.push({
      range: 'II Próg (32%)',
      rate: '32.00%',
      taxable: Math.max(0, pitTaxBaseUnder26 - 90000),
      tax: Math.max(0, pitTaxBaseUnder26 - 90000) * 0.32,
    });
  } else {
    const tier1Taxable = Math.min(taxablePitBase, 90000);
    const tier2Taxable = Math.max(0, taxablePitBase - 90000);
    const tier1Tax = tier1Taxable * 0.12;
    const tier2Tax = tier2Taxable * 0.32;
    pitTax = tier1Tax + tier2Tax;
    marginalTaxRate = tier2Taxable > 0 ? 32 : (tier1Taxable > 0 ? 12 : 0);

    bracketBreakdown.push({
      range: 'Kwota Wolna (do 30,000 zł)',
      rate: '0.00%',
      taxable: Math.min(taxBaseBeforeAllowance, kwotaWolna),
      tax: 0,
    });
    bracketBreakdown.push({
      range: 'I Próg (30,000 – 120,000 zł)',
      rate: '12.00%',
      taxable: tier1Taxable,
      tax: tier1Tax,
    });
    bracketBreakdown.push({
      range: 'II Próg (powyżej 120,000 zł)',
      rate: '32.00%',
      taxable: tier2Taxable,
      tax: tier2Tax,
    });
  }

  const totalDeductions = pitTax + totalSocialContributions;
  const netTakeHome = Math.max(0, gross - totalDeductions);
  const effectiveTaxRate = gross > 0 ? (pitTax / gross) * 100 : 0;

  return {
    grossIncome: gross,
    zusSocial,
    nfzHealth,
    ppkEmployee,
    totalSocialContributions,
    kupDeduction,
    taxBaseBeforeAllowance,
    taxableIncome: taxBaseBeforeAllowance,
    kwotaWolna,
    taxablePitBase,
    pitTax,
    totalTax: pitTax,
    totalDeductions,
    netTakeHome,
    effectiveTaxRate,
    marginalTaxRate,
    bracketBreakdown,

    // Legacy fields
    totalGrossIncome: gross,
    totalOrdinaryTax: pitTax,
    deductionAmount: kwotaWolna,
  };
}

