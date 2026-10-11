import { itProfile } from '../../data/tax/countries/it';
import type { TaxCalculationResult } from '../../data/tax/types';

export interface ItTaxInputs {
  taxYear?: string;
  grossIncome: number;
  regionCode?: string;
  municipalRate?: number; // Optional custom municipal rate
}

export interface ItTaxResult extends TaxCalculationResult {
  inpsContribution: number;
  taxableIncomeIrpef: number;
  grossIrpef: number;
  employeeTaxCredit: number; // Detrazione lavoro dipendente
  netIrpef: number;
  regionalSurcharge: number;
  municipalSurcharge: number;
}

export function calculateItTax(inputs: ItTaxInputs): ItTaxResult {
  const profile = itProfile;
  const year = inputs.taxYear || '2026';
  const gross = Math.max(0, inputs.grossIncome || 0);

  // 1. INPS Social Security (9.19%)
  const inpsRate = 0.0919;
  const inpsContribution = gross * inpsRate;

  // 2. Taxable Income for IRPEF (Imponibile IRPEF)
  const taxableIncomeIrpef = Math.max(0, gross - inpsContribution);

  // 3. Gross IRPEF based on tax year brackets
  const secondRate = year === '2025' ? 0.35 : 0.33;
  let grossIrpef = 0;
  if (taxableIncomeIrpef <= 28000) {
    grossIrpef = taxableIncomeIrpef * 0.23;
  } else if (taxableIncomeIrpef <= 50000) {
    grossIrpef = (28000 * 0.23) + ((taxableIncomeIrpef - 28000) * secondRate);
  } else {
    grossIrpef = (28000 * 0.23) + (22000 * secondRate) + ((taxableIncomeIrpef - 50000) * 0.43);
  }

  // 4. Employee Tax Credit (Detrazione lavoro dipendente)
  let employeeTaxCredit = 0;
  if (taxableIncomeIrpef <= 15000) {
    employeeTaxCredit = Math.max(690, 1955);
  } else if (taxableIncomeIrpef <= 28000) {
    employeeTaxCredit = 1910 + 1190 * ((28000 - taxableIncomeIrpef) / 13000);
  } else if (taxableIncomeIrpef <= 50000) {
    employeeTaxCredit = 1910 * ((50000 - taxableIncomeIrpef) / 22000);
  } else {
    employeeTaxCredit = 0;
  }

  // 5. Net IRPEF
  const netIrpef = Math.max(0, grossIrpef - employeeTaxCredit);

  // 6. Regional Surcharge
  // Look up region if provided, otherwise default to national average
  const yearData = profile.years[year] || profile.years[profile.defaultTaxYear];
  let regionalRate = 0.0173; // Default National Average
  if (inputs.regionCode && yearData.regions) {
    const region = yearData.regions.find((r) => r.code === inputs.regionCode);
    if (region && region.additionalTaxRate) {
      regionalRate = region.additionalTaxRate;
    }
  }
  const regionalSurcharge = taxableIncomeIrpef * regionalRate;

  // 7. Municipal Surcharge
  // Default to 0.8% (0.008) which is typical max, or use provided
  const municipalRate = inputs.municipalRate ?? 0.008;
  const municipalSurcharge = taxableIncomeIrpef * municipalRate;

  // 8. Totals
  const totalIncomeTax = netIrpef + regionalSurcharge + municipalSurcharge;
  const totalTaxAndDeductions = totalIncomeTax + inpsContribution;
  const netIncomeAnnual = Math.max(0, gross - totalTaxAndDeductions);


  const bracketBreakdown = [
    {
      bracketRange: `€0 – €28,000 (1° Scaglione)`,
      ratePercent: `23.0%`,
      taxableInBracket: Math.min(Math.max(0, taxableIncomeIrpef), 28000),
      taxAmount: Math.min(Math.max(0, taxableIncomeIrpef), 28000) * 0.23,
    },
    {
      bracketRange: `€28,000 – €50,000 (2° Scaglione)`,
      ratePercent: `${(secondRate * 100).toFixed(0)}.0%`,
      taxableInBracket: Math.max(0, Math.min(taxableIncomeIrpef, 50000) - 28000),
      taxAmount: Math.max(0, Math.min(taxableIncomeIrpef, 50000) - 28000) * secondRate,
    },
    {
      bracketRange: `Oltre €50,000 (3° Scaglione)`,
      ratePercent: `43.0%`,
      taxableInBracket: Math.max(0, taxableIncomeIrpef - 50000),
      taxAmount: Math.max(0, taxableIncomeIrpef - 50000) * 0.43,
    },
  ];

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear: year,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: employeeTaxCredit, // Representing the credit as standard deduction equivalent for UI
    taxableIncome: taxableIncomeIrpef,
    nationalIncomeTax: netIrpef,
    regionalIncomeTax: regionalSurcharge + municipalSurcharge,
    totalIncomeTax: totalIncomeTax,
    socialContributions: [
      {
        name: 'INPS',
        ratePercent: '9.19%',
        amount: inpsContribution,
        description: 'Statutory worker social security'
      }
    ],
    totalSocialContributions: inpsContribution,
    totalTaxAndDeductions,
    netIncomeAnnual,
    netIncomeMonthly: netIncomeAnnual / 12,
    netIncomeBiweekly: netIncomeAnnual / 26,
    netIncomeWeekly: netIncomeAnnual / 52,
    netIncomeDaily: netIncomeAnnual / 260,
    netIncomeHourly: netIncomeAnnual / 2080,
    effectiveTaxRate: gross > 0 ? (totalIncomeTax / gross) * 100 : 0,
    effectiveTotalDeductionRate: gross > 0 ? (totalTaxAndDeductions / gross) * 100 : 0,
    marginalTaxRate: taxableIncomeIrpef > 50000 ? 43 : taxableIncomeIrpef > 28000 ? 33 : 23,
    marginalTotalRate: (taxableIncomeIrpef > 50000 ? 43 : taxableIncomeIrpef > 28000 ? 33 : 23) + 9.19 + (regionalRate * 100) + (municipalRate * 100),
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,
    inpsContribution,
    taxableIncomeIrpef,
    grossIrpef,
    employeeTaxCredit,
    netIrpef,
    regionalSurcharge,
    municipalSurcharge
  };
}
