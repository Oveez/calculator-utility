import type { CountryTaxProfile, TaxCalculationResult, BracketCalculationDetail, SocialContributionDetail, TaxYearData } from '../../data/tax/types';
import { formatCurrency, formatPercent } from './formatters';
import type { TaxCalculationOptions } from './engine';

export function calculateCaTax(
  profile: CountryTaxProfile,
  grossAnnualIncome: number,
  options: TaxCalculationOptions = {}
): TaxCalculationResult {
  const sanitizedGross = Math.max(0, isNaN(grossAnnualIncome) ? 0 : grossAnnualIncome);
  const selectedYear = options.taxYear && profile.years[options.taxYear]
    ? options.taxYear
    : profile.defaultTaxYear;
  
  const yearData: TaxYearData = profile.years[selectedYear] || profile.years[profile.defaultTaxYear];
  const currency = yearData.currency;
  const currencySymbol = yearData.currencySymbol;

  const standardDeduction = yearData.standardDeduction || 0;
  const customDeductions = Math.max(0, options.customDeductions || 0);
  const adjustedGross = Math.max(0, sanitizedGross - customDeductions);
  const taxableIncome = Math.max(0, adjustedGross - standardDeduction);

  const activeBrackets = yearData.nationalBrackets;
  let nationalIncomeTax = 0;
  let topMarginalRate = 0;
  const bracketBreakdown: BracketCalculationDetail[] = [];

  for (let i = 0; i < activeBrackets.length; i++) {
    const bracket = activeBrackets[i];
    const threshold = bracket.threshold;
    const upTo = bracket.upTo;
    const rate = bracket.rate;

    if (taxableIncome > threshold) {
      const taxableInThisBracket = upTo !== undefined
        ? Math.min(taxableIncome, upTo) - threshold
        : taxableIncome - threshold;

      const taxInBracket = taxableInThisBracket * rate;
      nationalIncomeTax += taxInBracket;

      if (taxableInThisBracket > 0) {
        topMarginalRate = rate * 100;
      }

      const rangeLabel = upTo !== undefined
        ? `${formatCurrency(threshold, currency, currencySymbol)} – ${formatCurrency(upTo, currency, currencySymbol)}`
        : `Over ${formatCurrency(threshold, currency, currencySymbol)}`;

      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: formatPercent(rate * 100, 1),
        taxableInBracket: taxableInThisBracket,
        taxAmount: taxInBracket,
      });
    } else {
      const rangeLabel = upTo !== undefined
        ? `${formatCurrency(threshold, currency, currencySymbol)} – ${formatCurrency(upTo, currency, currencySymbol)}`
        : `Over ${formatCurrency(threshold, currency, currencySymbol)}`;

      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: formatPercent(rate * 100, 1),
        taxableInBracket: 0,
        taxAmount: 0,
      });
    }
  }

  let regionalIncomeTax = 0;
  let topProvincialMarginalRate = 0;
  const selectedRegion = yearData.regions?.find((r) => r.code === options.regionCode);
  if (selectedRegion) {
    if (selectedRegion.brackets && selectedRegion.brackets.length > 0) {
      const provTaxableIncome = Math.max(0, adjustedGross - standardDeduction);
      for (const bracket of selectedRegion.brackets) {
        const threshold = bracket.threshold;
        const upTo = bracket.upTo;
        const rate = bracket.rate;
        if (provTaxableIncome > threshold) {
           const taxableInThisBracket = upTo !== undefined
             ? Math.min(provTaxableIncome, upTo) - threshold
             : provTaxableIncome - threshold;
           regionalIncomeTax += taxableInThisBracket * rate;
           if (taxableInThisBracket > 0) {
             topProvincialMarginalRate = rate * 100;
           }
        }
      }
      topMarginalRate += topProvincialMarginalRate;
    } else if (selectedRegion.flatRate !== undefined && selectedRegion.flatRate > 0) {
      regionalIncomeTax = taxableIncome * selectedRegion.flatRate;
      topMarginalRate += selectedRegion.flatRate * 100;
    } else if (selectedRegion.additionalTaxRate !== undefined && selectedRegion.additionalTaxRate !== 0) {
      regionalIncomeTax = taxableIncome * selectedRegion.additionalTaxRate;
      topMarginalRate += selectedRegion.additionalTaxRate * 100;
    }
  }

  const totalIncomeTax = Math.max(0, nationalIncomeTax + regionalIncomeTax);

  const socialContributions: SocialContributionDetail[] = [];
  let totalSocialContributions = 0;

  for (const rule of yearData.socialContributions) {
    let contributionBase = sanitizedGross;

    if (rule.id === 'cpp') {
       const cap = rule.capAmount || 74600;
       const minThreshold = rule.minThreshold || 3500;
       if (sanitizedGross > minThreshold) {
         contributionBase = Math.min(sanitizedGross, cap) - minThreshold;
       } else {
         contributionBase = 0;
       }
    } else if (rule.id === 'ei') {
       const cap = rule.capAmount || 68900;
       contributionBase = Math.min(sanitizedGross, cap);
    } else {
       if (rule.minThreshold && contributionBase < rule.minThreshold) {
         contributionBase = 0;
       } else if (rule.minThreshold && contributionBase >= rule.minThreshold) {
         contributionBase = sanitizedGross - rule.minThreshold;
       }
       if (rule.capAmount && rule.capAmount > 0) {
         contributionBase = Math.min(contributionBase, rule.capAmount);
       }
    }

    const amount = Math.max(0, contributionBase * rule.employeeRate);
    totalSocialContributions += amount;

    socialContributions.push({
      name: rule.name,
      ratePercent: formatPercent(rule.employeeRate * 100, 2),
      amount: amount,
      description: rule.description,
    });
  }

  const totalTaxAndDeductions = totalIncomeTax + totalSocialContributions;
  const netIncomeAnnual = Math.max(0, sanitizedGross - totalTaxAndDeductions);

  const effectiveTaxRate = sanitizedGross > 0
    ? (totalIncomeTax / sanitizedGross) * 100
    : 0;

  const effectiveTotalDeductionRate = sanitizedGross > 0
    ? (totalTaxAndDeductions / sanitizedGross) * 100
    : 0;

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear: selectedYear,
    currency,
    currencySymbol,
    grossIncome: sanitizedGross,
    standardDeduction,
    taxableIncome,
    nationalIncomeTax,
    regionalIncomeTax,
    totalIncomeTax,
    socialContributions,
    totalSocialContributions,
    totalTaxAndDeductions,
    netIncomeAnnual,
    netIncomeMonthly: netIncomeAnnual / 12,
    netIncomeBiweekly: netIncomeAnnual / 26,
    netIncomeWeekly: netIncomeAnnual / 52,
    netIncomeDaily: netIncomeAnnual / 260,
    netIncomeHourly: netIncomeAnnual / 2080,
    effectiveTaxRate,
    effectiveTotalDeductionRate,
    marginalTaxRate: topMarginalRate,
    marginalTotalRate: topMarginalRate,
    bracketBreakdown,
    assumptions: yearData.assumptions || [],
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,
  };
}
