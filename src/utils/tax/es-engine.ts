import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxBracket,
} from '../../data/tax/types';

export interface EsTaxParams {
  grossIncome: number;
  taxYear?: string;
  regionCode?: string;
  numPayments?: number;
}

export function calculateEsTax(
  inputsOrParams: AdvancedTaxInputs | EsTaxParams,
  profile: CountryTaxProfile
): AdvancedTaxResult {
  const isParams = 'grossIncome' in inputsOrParams;
  const selectedYear = inputsOrParams.taxYear && profile.years[inputsOrParams.taxYear]
    ? inputsOrParams.taxYear
    : profile.defaultTaxYear;
  const yearData = profile.years[selectedYear] || profile.years[profile.defaultTaxYear];

  const totalGrossIncome = isParams
    ? Math.max(0, (inputsOrParams as EsTaxParams).grossIncome || 0)
    : Math.max(0, (inputsOrParams as AdvancedTaxInputs).primaryW2Income || 0);

  const adjustedGrossIncome = totalGrossIncome;
  let socialSecurityContributions = 0;

  // Calculate Social Security
  if (yearData.socialContributions) {
    for (const sc of yearData.socialContributions) {
      const basis = sc.capAmount ? Math.min(totalGrossIncome, sc.capAmount) : totalGrossIncome;
      socialSecurityContributions += basis * (sc.employeeRate || sc.rate);
    }
  }

  const taxableIncome = adjustedGrossIncome;

  let stateTax = 0;
  let regionalTax = 0;
  let totalOrdinaryTax = 0;
  const bracketsBreakdown: any[] = [];

  // Mínimo personal y familiar (Personal Allowance)
  const personalMinimum = yearData.standardDeduction || 5550;

  if (selectedYear === '2026' && (yearData as any).regionalBrackets) {
    const stateBrackets = yearData.nationalBrackets;
    const regionalBrackets = (yearData as any).regionalBrackets;

    const calculateScale = (income: number, brackets: TaxBracket[], type: string) => {
      let tax = 0;
      for (const bracket of brackets) {
        const threshold = bracket.threshold || 0;
        if (income > threshold) {
          const upTo = bracket.upTo ?? Infinity;
          const taxableInBracket = Math.min(income, upTo) - threshold;
          const taxInBracket = taxableInBracket * bracket.rate;
          tax += taxInBracket;
          bracketsBreakdown.push({
            bracket: `${type} ${bracket.label || (bracket.rate * 100) + '%'}`,
            taxableAmount: taxableInBracket,
            rate: bracket.rate,
            taxAmount: taxInBracket,
          });
        }
      }
      return tax;
    };

    const grossStateTax = calculateScale(taxableIncome, stateBrackets, 'State');
    const grossRegionalTax = calculateScale(taxableIncome, regionalBrackets, 'Regional');

    let stateMinCredit = 0;
    for (const b of stateBrackets) {
      const threshold = b.threshold || 0;
      if (personalMinimum > threshold) {
        const upTo = b.upTo ?? Infinity;
        const taxable = Math.min(personalMinimum, upTo) - threshold;
        stateMinCredit += taxable * b.rate;
      }
    }
    
    let regionalMinCredit = 0;
    for (const b of regionalBrackets) {
      const threshold = b.threshold || 0;
      if (personalMinimum > threshold) {
        const upTo = b.upTo ?? Infinity;
        const taxable = Math.min(personalMinimum, upTo) - threshold;
        regionalMinCredit += taxable * b.rate;
      }
    }

    stateTax = Math.max(0, grossStateTax - stateMinCredit);
    regionalTax = Math.max(0, grossRegionalTax - regionalMinCredit);
    totalOrdinaryTax = stateTax + regionalTax;

    const regionCode = (inputsOrParams as any).regionCode || 'general';
    const regionInfo = yearData.regions?.find(r => r.code === regionCode);
    if (regionInfo && regionInfo.additionalTaxRate) {
      const regionalAdj = taxableIncome * regionInfo.additionalTaxRate;
      regionalTax = Math.max(0, regionalTax + regionalAdj);
      totalOrdinaryTax = stateTax + regionalTax;
    }

  } else {
    // Legacy combined calculation for 2025
    const brackets = yearData.nationalBrackets;
    let tax = 0;
    const base = Math.max(0, taxableIncome - personalMinimum);
    for (const bracket of brackets) {
      const threshold = bracket.threshold || 0;
      if (base > threshold) {
        const upTo = bracket.upTo ?? Infinity;
        const taxableInBracket = Math.min(base, upTo) - threshold;
        const taxInBracket = taxableInBracket * bracket.rate;
        tax += taxInBracket;
        bracketsBreakdown.push({
          bracket: bracket.label || (bracket.rate * 100) + '%',
          taxableAmount: taxableInBracket,
          rate: bracket.rate,
          taxAmount: taxInBracket,
        });
      }
    }
    totalOrdinaryTax = tax;
    stateTax = tax / 2;
    regionalTax = tax / 2;
  }

  const totalTax = totalOrdinaryTax;
  const netTakeHome = Math.max(0, totalGrossIncome - totalTax - socialSecurityContributions);
  const effectiveTaxRate = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0;
  const effectiveTotalTaxRate = totalGrossIncome > 0 ? ((totalTax + socialSecurityContributions) / totalGrossIncome) * 100 : 0;

  const bracketBreakdown = [
    {
      bracketRange: `€0 – €12,450 (Tramo 1)`,
      ratePercent: `19.0% (9.5% Estatal + 9.5% Autonómico)`,
      taxableInBracket: Math.min(Math.max(0, taxableIncome), 12450),
      taxAmount: Math.min(Math.max(0, taxableIncome), 12450) * 0.19,
    },
    {
      bracketRange: `€12,450 – €20,200 (Tramo 2)`,
      ratePercent: `24.0% (12.0% Estatal + 12.0% Autonómico)`,
      taxableInBracket: Math.max(0, Math.min(taxableIncome, 20200) - 12450),
      taxAmount: Math.max(0, Math.min(taxableIncome, 20200) - 12450) * 0.24,
    },
    {
      bracketRange: `€20,200 – €35,200 (Tramo 3)`,
      ratePercent: `30.0% (15.0% Estatal + 15.0% Autonómico)`,
      taxableInBracket: Math.max(0, Math.min(taxableIncome, 35200) - 20200),
      taxAmount: Math.max(0, Math.min(taxableIncome, 35200) - 20200) * 0.30,
    },
    {
      bracketRange: `€35,200 – €60,000 (Tramo 4)`,
      ratePercent: `37.0% (18.5% Estatal + 18.5% Autonómico)`,
      taxableInBracket: Math.max(0, Math.min(taxableIncome, 60000) - 35200),
      taxAmount: Math.max(0, Math.min(taxableIncome, 60000) - 35200) * 0.37,
    },
    {
      bracketRange: `€60,000 – €300,000 (Tramo 5)`,
      ratePercent: `45.0% (22.5% Estatal + 22.5% Autonómico)`,
      taxableInBracket: Math.max(0, Math.min(taxableIncome, 300000) - 60000),
      taxAmount: Math.max(0, Math.min(taxableIncome, 300000) - 60000) * 0.45,
    },
    {
      bracketRange: `Más de €300,000 (Tramo 6)`,
      ratePercent: `47.0% (24.5% Estatal + 22.5% Autonómico)`,
      taxableInBracket: Math.max(0, taxableIncome - 300000),
      taxAmount: Math.max(0, taxableIncome - 300000) * 0.47,
    },
  ];

  return {
    taxYear: selectedYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    totalGrossIncome,
    adjustedGrossIncome,
    deductionUsed: 'standard',
    deductionAmount: personalMinimum,
    itemizedDeductionsTotal: 0,
    itemizedAdvantage: 0,
    taxableIncome,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    totalOrdinaryTax,
    totalPreferentialTax: 0,
    totalTax,
    stateTax,
    regionalTax,
    netFederalIncomeTax: stateTax,
    stateIncomeTax: regionalTax,
    effectiveTaxRate,
    effectiveTotalTaxRate,
    marginalTaxRate: totalGrossIncome > 0 ? (bracketsBreakdown.length > 0 ? bracketsBreakdown[bracketsBreakdown.length - 1].rate * 100 : 0) : 0,
    bracketsBreakdown,
    bracketBreakdown,
    creditsBreakdown: [],
    netTakeHome,
    netAnnualTakeHome: netTakeHome,
    netMonthlyTakeHome: netTakeHome / 12,
    netBiweeklyTakeHome: netTakeHome / 26,
    netWeeklyTakeHome: netTakeHome / 52,
    netHourlyTakeHome: netTakeHome / 2080,
    totalSocialContributions: socialSecurityContributions,
    totalFicaTax: socialSecurityContributions,
    totalAllTaxes: totalOrdinaryTax + socialSecurityContributions,
  };
}
