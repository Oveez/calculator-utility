import { nlProfile } from '../../data/tax/countries/nl';
import type { BracketCalculationDetail } from '../../data/tax/types';
import { formatCurrency, formatPercent } from './formatters';

export interface NlTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026' | string;
  has30PercentRuling?: boolean;
}

export interface NlTaxResult {
  grossIncome: number;
  taxableIncome: number;
  taxFreeAllowance: number;
  box1Tax: number;
  zvwContribution: number;
  generalTaxCredit: number;
  labourTaxCredit: number;
  totalTaxCredits: number;
  netBox1Tax: number;
  totalTax: number;
  netIncome: number;
  netIncomeAnnual: number;
  netIncomeMonthly: number;
  netIncomeBiweekly: number;
  netIncomeWeekly: number;
  netIncomeDaily: number;
  netIncomeHourly: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  bracketBreakdown: BracketCalculationDetail[];
}

export function calculateNlTax(params: NlTaxParams): NlTaxResult {
  const { grossIncome: rawGross, taxYear = '2026', has30PercentRuling = false } = params;
  const grossIncome = Math.max(0, Number.isFinite(rawGross) ? rawGross : 0);
  const selectedYear = taxYear === '2025' ? '2025' : '2026';
  const yearData = nlProfile.years[selectedYear] || nlProfile.years[nlProfile.defaultTaxYear];
  
  if (!yearData) throw new Error(`Tax year ${taxYear} not found for Netherlands.`);

  // 30% ruling reduces taxable income by 30% up to Balkenendenorm (~€233,000)
  const max30RulingBase = 233000;
  let taxableIncome = grossIncome;
  let taxFreeAllowance = 0;
  
  if (has30PercentRuling) {
    const rulingBase = Math.min(grossIncome, max30RulingBase);
    taxFreeAllowance = rulingBase * 0.30;
    taxableIncome = grossIncome - taxFreeAllowance;
  }

  // Box 1 Progressive Tax
  let box1Tax = 0;
  let marginalTaxRate = 0;
  const bracketBreakdown: BracketCalculationDetail[] = [];

  for (const bracket of yearData.nationalBrackets) {
    const rangeLabel = bracket.upTo !== undefined
      ? `${formatCurrency(bracket.threshold, yearData.currency, yearData.currencySymbol)} – ${formatCurrency(bracket.upTo, yearData.currency, yearData.currencySymbol)}`
      : `Over ${formatCurrency(bracket.threshold, yearData.currency, yearData.currencySymbol)}`;

    if (taxableIncome > bracket.threshold) {
      const taxableInBracket = bracket.upTo 
        ? Math.min(taxableIncome, bracket.upTo) - bracket.threshold
        : taxableIncome - bracket.threshold;
      
      const taxAmount = taxableInBracket * bracket.rate;
      box1Tax += taxAmount;
      if (taxableInBracket > 0) marginalTaxRate = bracket.rate * 100;

      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: formatPercent(bracket.rate * 100, 2),
        taxableInBracket,
        taxAmount,
      });
    } else {
      bracketBreakdown.push({
        bracketRange: rangeLabel,
        ratePercent: formatPercent(bracket.rate * 100, 2),
        taxableInBracket: 0,
        taxAmount: 0,
      });
    }
  }

  // Zvw (Health Insurance Act) Contribution
  const zvwConfig = yearData.socialContributions.find((c: any) => c.id === 'zvw_volks');
  const zvwRate = zvwConfig?.employeeRate || 0.0545;
  const zvwCap = zvwConfig?.capAmount || 78426;
  
  const zvwIncome = Math.min(taxableIncome, zvwCap);
  const zvwContribution = zvwIncome * zvwRate;

  // General Tax Credit (Algemene heffingskorting)
  const gtcMax = selectedYear === '2025' ? 3068 : 3362;
  const gtcThreshold = selectedYear === '2025' ? 28406 : 24812;
  const gtcPhaseOutRate = selectedYear === '2025' ? 0.06337 : 0.0663;
  let generalTaxCredit = gtcMax;
  if (taxableIncome > gtcThreshold) {
    generalTaxCredit = Math.max(0, gtcMax - (taxableIncome - gtcThreshold) * gtcPhaseOutRate);
  }

  // Labour Tax Credit (Arbeidskorting)
  let labourTaxCredit = 0;
  if (taxableIncome > 0) {
    if (selectedYear === '2025') {
      if (taxableIncome <= 11490) {
        labourTaxCredit = taxableIncome * 0.08425;
      } else if (taxableIncome <= 24812) {
        labourTaxCredit = 968 + (taxableIncome - 11490) * 0.31433;
      } else if (taxableIncome <= 39957) {
        labourTaxCredit = 5155 + (taxableIncome - 24812) * 0.02471;
      } else {
        labourTaxCredit = Math.max(0, 5529 - (taxableIncome - 39957) * 0.0651);
      }
    } else {
      // 2026 Statutory Belastingdienst parameters
      if (taxableIncome <= 11490) {
        labourTaxCredit = taxableIncome * 0.08425;
      } else if (taxableIncome <= 24812) {
        labourTaxCredit = 968 + (taxableIncome - 11490) * 0.31433;
      } else if (taxableIncome <= 39957) {
        labourTaxCredit = 5155 + (taxableIncome - 24812) * 0.02471;
      } else {
        labourTaxCredit = Math.max(0, 5529 - (taxableIncome - 39957) * 0.0651);
      }
    }
  }

  const totalTaxCredits = generalTaxCredit + labourTaxCredit;
  const netBox1Tax = Math.max(0, box1Tax - totalTaxCredits);
  
  const totalTax = netBox1Tax + zvwContribution;
  const netIncome = Math.max(0, grossIncome - totalTax);
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    taxableIncome,
    taxFreeAllowance,
    box1Tax,
    zvwContribution,
    generalTaxCredit,
    labourTaxCredit,
    totalTaxCredits,
    netBox1Tax,
    totalTax,
    netIncome,
    netIncomeAnnual: netIncome,
    netIncomeMonthly: netIncome / 12,
    netIncomeBiweekly: netIncome / 26,
    netWeekly: netIncome / 52,
    netIncomeWeekly: netIncome / 52,
    netIncomeDaily: netIncome / 260,
    netIncomeHourly: netIncome / 2080,
    effectiveTaxRate,
    marginalTaxRate,
    bracketBreakdown,
  };
}
