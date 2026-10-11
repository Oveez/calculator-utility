import { deProfile } from '../../data/tax/countries/de';
import type { BracketCalculationDetail } from '../../data/tax/types';
import { formatCurrency, formatPercent } from './formatters';

export interface DeTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026' | string;
  steuerklasse?: '1' | '2' | '3' | '4' | '5' | '6';
  hasChurchTax?: boolean;
  churchTaxRate?: number; // 0.08 (Bayern, Baden-Württemberg) or 0.09 (other states)
  customDeductions?: number;
  primaryW2Income?: number; // legacy alias
  [key: string]: any;
}

export interface DeTaxResult {
  grossIncome: number;
  taxableIncome: number;
  standardDeduction: number;
  incomeTax: number;
  solidaritySurcharge: number;
  churchTax: number;
  socialInsurances: {
    rentenversicherung: number;
    krankenversicherung: number;
    pflegeversicherung: number;
    arbeitslosenversicherung: number;
    total: number;
  };
  totalSocialContributions: number;
  totalTax: number;
  totalTaxAndDeductions: number;
  netIncome: number;
  netIncomeAnnual: number;
  netIncomeMonthly: number;
  netIncomeBiweekly: number;
  netIncomeWeekly: number;
  netIncomeDaily: number;
  netIncomeHourly: number;
  effectiveTaxRate: number;
  effectiveTotalDeductionRate: number;
  marginalTaxRate: number;
  bracketBreakdown: BracketCalculationDetail[];

  // Legacy compatibility fields
  totalGrossIncome?: number;
  regularIncomeTax?: number;
  netTakeHome?: number;
}

/**
 * Computes statutory German Einkommensteuer under § 32a Abs. 1 EStG
 * using the linear-progressive formula zones for 2025 and 2026.
 */
export function computeGermanESt(
  zve: number,
  year: '2025' | '2026' = '2026'
): { tax: number; marginalRate: number } {
  if (zve <= 0) return { tax: 0, marginalRate: 0 };
  const x = Math.floor(zve);

  if (year === '2025') {
    const gf = 12084;
    if (x <= gf) return { tax: 0, marginalRate: 0 };
    if (x <= 17005) {
      const y = (x - gf) / 10000;
      const tax = (995.21 * y + 1400) * y;
      const marginalRate = (2 * 995.21 * y + 1400) / 100;
      return { tax: Math.floor(tax), marginalRate };
    }
    if (x <= 66760) {
      const z = (x - 17005) / 10000;
      const tax = (208.85 * z + 2397) * z + 1014;
      const marginalRate = (2 * 208.85 * z + 2397) / 100;
      return { tax: Math.floor(tax), marginalRate };
    }
    if (x <= 277825) {
      const tax = 0.42 * x - 10600;
      return { tax: Math.floor(tax), marginalRate: 42 };
    }
    const tax = 0.45 * x - 18935;
    return { tax: Math.floor(tax), marginalRate: 45 };
  }

  // Statutory 2026 tariff (§ 32a EStG 2026)
  const gf = 12348;
  if (x <= gf) return { tax: 0, marginalRate: 0 };
  if (x <= 17005) {
    const y = (x - gf) / 10000;
    const tax = (995.21 * y + 1400) * y;
    const marginalRate = (2 * 995.21 * y + 1400) / 100;
    return { tax: Math.floor(tax), marginalRate };
  }
  if (x <= 66760) {
    const z = (x - 17005) / 10000;
    const tax = (208.85 * z + 2397) * z + 967.64;
    const marginalRate = (2 * 208.85 * z + 2397) / 100;
    return { tax: Math.floor(tax), marginalRate };
  }
  if (x <= 277825) {
    const tax = 0.42 * x - 10632.86;
    return { tax: Math.floor(tax), marginalRate: 42 };
  }
  const tax = 0.45 * x - 18967.61;
  return { tax: Math.floor(tax), marginalRate: 45 };
}

export function calculateDeTax(params: DeTaxParams): DeTaxResult {
  const rawGross = 'grossIncome' in params && params.grossIncome !== undefined
    ? params.grossIncome
    : params.primaryW2Income || 0;

  const {
    taxYear = '2026',
    steuerklasse = '1',
    hasChurchTax = false,
    churchTaxRate = 0.09,
    customDeductions = 0,
  } = params;

  const grossIncome = Math.max(0, Number.isFinite(rawGross) ? rawGross : 0);
  const selectedYear: '2025' | '2026' = taxYear === '2025' ? '2025' : '2026';
  const yearData = deProfile.years[selectedYear] || deProfile.years[deProfile.defaultTaxYear];

  // Base Grundfreibetrag (€12,348 for 2026, €12,084 for 2025)
  const baseGrundfreibetrag = yearData.standardDeduction;

  // Steuerklasse adjustments
  let standardDeduction = baseGrundfreibetrag;
  let taxableIncome = grossIncome;
  let incomeTax = 0;
  let marginalTaxRate = 0;

  if (steuerklasse === '2') {
    // Single parent: Grundfreibetrag + Entlastungsbetrag für Alleinerziehende (€4,260)
    standardDeduction = baseGrundfreibetrag + 4260;
    taxableIncome = Math.max(0, grossIncome - 4260 - Math.max(0, customDeductions));
    const res = computeGermanESt(taxableIncome, selectedYear);
    incomeTax = res.tax;
    marginalTaxRate = res.marginalRate;
  } else if (steuerklasse === '3') {
    // Married splitting (Ehegattensplitting § 32a Abs. 5 EStG)
    standardDeduction = baseGrundfreibetrag * 2;
    taxableIncome = Math.max(0, grossIncome - Math.max(0, customDeductions));
    const res = computeGermanESt(taxableIncome / 2, selectedYear);
    incomeTax = res.tax * 2;
    marginalTaxRate = res.marginalRate;
  } else if (steuerklasse === '5') {
    // Partner of Class 3 (no Grundfreibetrag, higher progression)
    standardDeduction = 0;
    taxableIncome = Math.max(0, grossIncome - Math.max(0, customDeductions));
    const res = computeGermanESt(taxableIncome + baseGrundfreibetrag, selectedYear);
    const baseRes = computeGermanESt(baseGrundfreibetrag, selectedYear);
    incomeTax = Math.max(0, res.tax - baseRes.tax);
    marginalTaxRate = res.marginalRate;
  } else if (steuerklasse === '6') {
    // Secondary job (no Grundfreibetrag)
    standardDeduction = 0;
    taxableIncome = Math.max(0, grossIncome - Math.max(0, customDeductions));
    const res = computeGermanESt(taxableIncome + baseGrundfreibetrag, selectedYear);
    const baseRes = computeGermanESt(baseGrundfreibetrag, selectedYear);
    incomeTax = Math.max(0, res.tax - baseRes.tax);
    marginalTaxRate = res.marginalRate;
  } else {
    // Klasse 1 or 4 (Standard individual)
    taxableIncome = Math.max(0, grossIncome - Math.max(0, customDeductions));
    const res = computeGermanESt(taxableIncome, selectedYear);
    incomeTax = res.tax;
    marginalTaxRate = res.marginalRate;
  }

  // Solidarity Surcharge (§ 4 SolzG with statutory Milderungszone)
  const soliFreigrenze = steuerklasse === '3' ? 36260 : 18130;
  let solidaritySurcharge = 0;
  if (incomeTax > soliFreigrenze) {
    const fullSoli = incomeTax * 0.055;
    const milderung = (incomeTax - soliFreigrenze) * 0.119;
    solidaritySurcharge = Math.min(fullSoli, Math.max(0, milderung));
  }

  // Church Tax (Kirchensteuer)
  let churchTax = 0;
  if (hasChurchTax && incomeTax > 0) {
    churchTax = incomeTax * churchTaxRate;
  }

  // Statutory Social Insurance Contributions (Beitragsbemessungsgrenzen 2026)
  const pensionCap = 101400; // BBG Rentenversicherung 2026
  const healthCap = 69750;   // BBG Krankenversicherung 2026

  const rvRate = 0.093;  // 9.3%
  const avRate = 0.013;  // 1.3%
  const kvRate = 0.0815; // 7.3% base + 0.85% Zusatzbeitrag
  const pvRate = 0.022;  // 2.2% standard

  const rentenversicherung = Math.min(grossIncome, pensionCap) * rvRate;
  const arbeitslosenversicherung = Math.min(grossIncome, pensionCap) * avRate;
  const krankenversicherung = Math.min(grossIncome, healthCap) * kvRate;
  const pflegeversicherung = Math.min(grossIncome, healthCap) * pvRate;

  const totalSocialContributions =
    rentenversicherung + arbeitslosenversicherung + krankenversicherung + pflegeversicherung;

  const totalDeductions = incomeTax + solidaritySurcharge + churchTax + totalSocialContributions;
  const netIncome = Math.max(0, grossIncome - totalDeductions);

  const effectiveTaxRate = grossIncome > 0 ? (incomeTax / grossIncome) * 100 : 0;
  const effectiveTotalDeductionRate = grossIncome > 0 ? (totalDeductions / grossIncome) * 100 : 0;

  // Visual Breakdown Zones for table
  const bracketBreakdown: BracketCalculationDetail[] = [
    {
      bracketRange: `Zone 1: bis €${baseGrundfreibetrag.toLocaleString('de-DE')} (Grundfreibetrag)`,
      ratePercent: '0.0%',
      taxableInBracket: Math.min(taxableIncome, baseGrundfreibetrag),
      taxAmount: 0,
    },
    {
      bracketRange: `Zone 2: €${baseGrundfreibetrag.toLocaleString('de-DE')} – €17.005 (Progression 1)`,
      ratePercent: '14.0% – 24.0%',
      taxableInBracket: Math.max(0, Math.min(taxableIncome, 17005) - baseGrundfreibetrag),
      taxAmount: Math.max(0, Math.min(incomeTax, 967)),
    },
    {
      bracketRange: 'Zone 3: €17.006 – €66.760 (Progression 2)',
      ratePercent: '24.0% – 42.0%',
      taxableInBracket: Math.max(0, Math.min(taxableIncome, 66760) - 17005),
      taxAmount: taxableIncome > 17005 ? Math.max(0, Math.min(incomeTax, 17406) - 967) : 0,
    },
    {
      bracketRange: 'Zone 4: €66.761 – €277.825 (Spitzensteuersatz)',
      ratePercent: '42.0%',
      taxableInBracket: Math.max(0, Math.min(taxableIncome, 277825) - 66760),
      taxAmount: taxableIncome > 66760 ? Math.max(0, (Math.min(taxableIncome, 277825) - 66760) * 0.42) : 0,
    },
    {
      bracketRange: 'Zone 5: über €277.825 (Reichensteuer)',
      ratePercent: '45.0%',
      taxableInBracket: Math.max(0, taxableIncome - 277825),
      taxAmount: taxableIncome > 277825 ? (taxableIncome - 277825) * 0.45 : 0,
    },
  ];

  return {
    grossIncome,
    taxableIncome,
    standardDeduction,
    incomeTax,
    solidaritySurcharge,
    churchTax,
    socialInsurances: {
      rentenversicherung,
      krankenversicherung,
      pflegeversicherung,
      arbeitslosenversicherung,
      total: totalSocialContributions,
    },
    totalSocialContributions,
    totalTax: totalDeductions,
    totalTaxAndDeductions: totalDeductions,
    netIncome,
    netIncomeAnnual: netIncome,
    netIncomeMonthly: netIncome / 12,
    netBiweekly: netIncome / 26,
    netIncomeBiweekly: netIncome / 26,
    netWeekly: netIncome / 52,
    netIncomeWeekly: netIncome / 52,
    netDaily: netIncome / 260,
    netIncomeDaily: netIncome / 260,
    netHourly: netIncome / 2080,
    netIncomeHourly: netIncome / 2080,
    effectiveTaxRate,
    effectiveTotalDeductionRate,
    marginalTaxRate,
    bracketBreakdown,

    // Legacy aliases
    totalGrossIncome: grossIncome,
    regularIncomeTax: incomeTax,
    netTakeHome: netIncome,
  };
}
