import type {
  CountryTaxProfile,
  TaxCalculationResult,
  BracketCalculationDetail,
  SocialContributionDetail,
  TaxYearData,
} from '../../data/tax/types';
import { formatCurrency, formatPercent } from './formatters';

export interface TaxCalculationOptions {
  taxYear?: string;
  regionCode?: string;
  filingStatus?: string;
  customDeductions?: number;
}

export function calculateTaxForCountry(
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

  // 1. Resolve Standard Deduction / Personal Allowance with country-specific tapering
  let standardDeduction = yearData.standardDeduction || 0;

  // Special UK Personal Allowance Tapering (£1 reduction per £2 over £100,000)
  if (profile.id === 'uk' && yearData.personalAllowance) {
    if (sanitizedGross > 100000) {
      const reduction = Math.floor((sanitizedGross - 100000) / 2);
      standardDeduction = Math.max(0, yearData.personalAllowance - reduction);
    } else {
      standardDeduction = yearData.personalAllowance;
    }
  }

  // Add custom deductions if provided
  const totalDeduction = standardDeduction + (options.customDeductions ? Math.max(0, options.customDeductions) : 0);
  const taxableIncome = Math.max(0, sanitizedGross - totalDeduction);

  // 2. Determine brackets to use (Regional brackets if available, e.g. Scotland, or National brackets)
  let activeBrackets = yearData.nationalBrackets;
  let selectedRegion = yearData.regions?.find((r) => r.code === options.regionCode);

  if (selectedRegion && selectedRegion.brackets && selectedRegion.brackets.length > 0) {
    activeBrackets = selectedRegion.brackets;
  }

  // 3. Compute Progressive Income Tax & Generate Bracket Breakdown
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
      // Bracket not reached
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

  // 4. Calculate Regional Tax if applicable
  let regionalIncomeTax = 0;
  if (selectedRegion) {
    if (selectedRegion.flatRate !== undefined && selectedRegion.flatRate > 0) {
      regionalIncomeTax = taxableIncome * selectedRegion.flatRate;
    } else if (selectedRegion.additionalTaxRate !== undefined && selectedRegion.additionalTaxRate !== 0) {
      regionalIncomeTax = taxableIncome * selectedRegion.additionalTaxRate;
    }
  }

  const totalIncomeTax = Math.max(0, nationalIncomeTax + regionalIncomeTax);

  // 5. Calculate Social Security / Welfare Contributions
  const socialContributions: SocialContributionDetail[] = [];
  let totalSocialContributions = 0;

  for (const rule of yearData.socialContributions) {
    let contributionBase = sanitizedGross;

    if (rule.minThreshold && contributionBase < rule.minThreshold) {
      contributionBase = 0;
    } else if (rule.minThreshold && contributionBase >= rule.minThreshold) {
      // Some countries like UK only tax the slice above threshold for NI
      if (profile.id === 'uk' || profile.id === 'ca') {
        contributionBase = sanitizedGross - rule.minThreshold;
      }
    }

    if (rule.capAmount && rule.capAmount > 0) {
      contributionBase = Math.min(contributionBase, rule.capAmount);
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

  // 6. Net Pay & Rates
  const totalTaxAndDeductions = totalIncomeTax + totalSocialContributions;
  const netIncomeAnnual = Math.max(0, sanitizedGross - totalTaxAndDeductions);

  const effectiveTaxRate = sanitizedGross > 0 ? (totalIncomeTax / sanitizedGross) * 100 : 0;
  const effectiveTotalDeductionRate = sanitizedGross > 0 ? (totalTaxAndDeductions / sanitizedGross) * 100 : 0;

  // Compute marginal total rate (top tax rate + active social security rate)
  const activeSocialRateSum = yearData.socialContributions.reduce((sum, r) => {
    if (!r.capAmount || sanitizedGross < r.capAmount) {
      return sum + r.employeeRate * 100;
    }
    return sum;
  }, 0);
  const marginalTotalRate = topMarginalRate + activeSocialRateSum;

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear: selectedYear,
    currency: currency,
    currencySymbol: currencySymbol,
    grossIncome: sanitizedGross,
    standardDeduction: totalDeduction,
    taxableIncome: taxableIncome,
    nationalIncomeTax: nationalIncomeTax,
    regionalIncomeTax: regionalIncomeTax,
    totalIncomeTax: totalIncomeTax,
    socialContributions: socialContributions,
    totalSocialContributions: totalSocialContributions,
    totalTaxAndDeductions: totalTaxAndDeductions,
    netIncomeAnnual: netIncomeAnnual,
    netIncomeMonthly: netIncomeAnnual / 12,
    netIncomeBiweekly: netIncomeAnnual / 26,
    netIncomeWeekly: netIncomeAnnual / 52,
    netIncomeDaily: netIncomeAnnual / 260, // Standard 260 working days/yr
    netIncomeHourly: netIncomeAnnual / 2080, // Standard 40 hrs/wk * 52 wks = 2080 hrs
    effectiveTaxRate: effectiveTaxRate,
    effectiveTotalDeductionRate: effectiveTotalDeductionRate,
    marginalTaxRate: topMarginalRate,
    marginalTotalRate: marginalTotalRate,
    bracketBreakdown: bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,
  };
}
