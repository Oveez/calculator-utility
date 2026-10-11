import type { BracketCalculationDetail, CountryTaxProfile, FilingStatus, SocialContributionDetail, TaxCalculationResult } from '../../data/tax/types';
import { formatCurrency, formatPercent } from './formatters';

/** Shared arithmetic only; country engines decide the tax-law inputs. */
export interface ProfileTaxOptions { taxYear?: string; regionCode?: string; filingStatus?: FilingStatus; customDeductions?: number; }

export function calculateTaxForProfile(profile: CountryTaxProfile, grossAnnualIncome: number, options: ProfileTaxOptions = {}): TaxCalculationResult {
  const grossIncome = Math.max(0, Number.isFinite(grossAnnualIncome) ? grossAnnualIncome : 0);
  const taxYear = options.taxYear && profile.years[options.taxYear] ? options.taxYear : profile.defaultTaxYear;
  const year = profile.years[taxYear];
  const filing = options.filingStatus ? year.filingStatuses?.[options.filingStatus] : undefined;
  const standardDeduction = (filing?.standardDeduction ?? year.standardDeduction) + Math.max(0, options.customDeductions ?? 0);
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);
  const brackets = filing?.brackets?.length ? filing.brackets : year.nationalBrackets;
  const bracketBreakdown: BracketCalculationDetail[] = [];
  let nationalIncomeTax = 0;
  let marginalTaxRate = 0;
  for (const bracket of brackets) {
    const taxableInBracket = taxableIncome > bracket.threshold ? Math.max(0, Math.min(taxableIncome, bracket.upTo ?? Infinity) - bracket.threshold) : 0;
    const taxAmount = taxableInBracket * bracket.rate;
    nationalIncomeTax += taxAmount;
    if (taxableInBracket > 0) marginalTaxRate = bracket.rate * 100;
    bracketBreakdown.push({ bracketRange: bracket.upTo === undefined ? `Over ${formatCurrency(bracket.threshold, year.currency, year.currencySymbol)}` : `${formatCurrency(bracket.threshold, year.currency, year.currencySymbol)} – ${formatCurrency(bracket.upTo, year.currency, year.currencySymbol)}`, ratePercent: formatPercent(bracket.rate * 100, 1), taxableInBracket, taxAmount });
  }
  const selectedRegion = year.regions?.find((region) => region.code === options.regionCode);
  const regionalIncomeTax = selectedRegion?.flatRate !== undefined ? taxableIncome * selectedRegion.flatRate : taxableIncome * (selectedRegion?.additionalTaxRate ?? 0);
  const socialContributions: SocialContributionDetail[] = year.socialContributions.map((rule) => {
    const afterThreshold = rule.minThreshold ? Math.max(0, grossIncome - rule.minThreshold) : grossIncome;
    const amount = (rule.capAmount ? Math.min(afterThreshold, rule.capAmount) : afterThreshold) * rule.employeeRate;
    return { name: rule.name, ratePercent: formatPercent(rule.employeeRate * 100, 2), amount, description: rule.description };
  });
  const totalSocialContributions = socialContributions.reduce((sum, item) => sum + item.amount, 0);
  const totalIncomeTax = nationalIncomeTax + regionalIncomeTax;
  const totalTaxAndDeductions = totalIncomeTax + totalSocialContributions;
  const netIncomeAnnual = Math.max(0, grossIncome - totalTaxAndDeductions);
  return { countryId: profile.id, countryName: profile.name, taxYear, currency: year.currency, currencySymbol: year.currencySymbol, grossIncome, standardDeduction, taxableIncome, nationalIncomeTax, regionalIncomeTax, totalIncomeTax, socialContributions, totalSocialContributions, totalTaxAndDeductions, netIncomeAnnual, netIncomeMonthly: netIncomeAnnual / 12, netIncomeBiweekly: netIncomeAnnual / 26, netIncomeWeekly: netIncomeAnnual / 52, netIncomeDaily: netIncomeAnnual / 260, netIncomeHourly: netIncomeAnnual / 2080, effectiveTaxRate: grossIncome ? (totalIncomeTax / grossIncome) * 100 : 0, effectiveTotalDeductionRate: grossIncome ? (totalTaxAndDeductions / grossIncome) * 100 : 0, marginalTaxRate, marginalTotalRate: marginalTaxRate, bracketBreakdown, assumptions: year.assumptions, officialSourceName: year.officialSourceName, officialSourceUrl: year.officialSourceUrl, lastVerifiedDate: year.lastVerifiedDate };
}
