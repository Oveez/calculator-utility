import { atProfile } from '../../data/tax/countries/at';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface AtTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  paymentsCount?: 12 | 14;
  status?: 'angestellter' | 'freier_dienstnehmer';
  customDeductions?: number;
}

export interface AtTaxResult extends TaxCalculationResult {
  socialInsurance: number;
  regularTax: number;
  specialTax: number;
  verkehrsabsetzbetrag: number;
  paymentsCount: 12 | 14;
}

export function calculateAtTax(
  paramsOrInputs: AtTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): AtTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || atProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let paymentsCount: 12 | 14 = 14;
  let status: 'angestellter' | 'freier_dienstnehmer' = 'angestellter';
  let customDeductions = 0;

  if (isParams) {
    const params = paramsOrInputs as AtTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    paymentsCount = params.paymentsCount === 12 ? 12 : 14;
    status = params.status || 'angestellter';
    customDeductions = Math.max(0, params.customDeductions || 0);
  } else {
    const inputs = paramsOrInputs as AdvancedTaxInputs;
    gross = Math.max(
      0,
      (inputs.primaryW2Income || 0) +
        (inputs.spouseW2Income || 0) +
        (inputs.businessNetIncome || 0) +
        (inputs.otherIncome || 0)
    );
    taxYear = (inputs.taxYear as '2025' | '2026') || '2026';
    paymentsCount = 14;
    status = 'angestellter';
    customDeductions = Math.max(0, inputs.itemizedDeductionAmount || 0);
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. Social Insurance (SV) Rates & Höchstbeitragsgrundlage
  const svProfile = yearData.socialContributions.find((c) => c.id === 'sozialversicherung');
  const baseSvRate = status === 'freier_dienstnehmer' ? 0.1412 : (svProfile?.employeeRate || 0.1812);
  const svAnnualCap = yearData.socialContributions[0]?.capAmount || 82200;

  let totalSv = 0;
  let incomeTax = 0;
  let regularTax = 0;
  let specialTax = 0;
  let marginalRate = 0;
  let taxableIncome = 0;
  const verkehrsabsetzbetrag = 463; // Statutory general employee tax credit (§ 33 Abs. 5 EStG)

  const bracketBreakdown: {
    bracketRange: string;
    ratePercent: string;
    taxableInBracket: number;
    taxAmount: number;
  }[] = [];

  const grundfreibetrag = yearData.standardDeduction || 13539;

  if (paymentsCount === 14 && gross > 0) {
    // Austrian 14-salaries payroll model (§ 67 EStG):
    // 12 regular monthly payments (12/14) + 2 special payments (2/14)
    const regularGross = gross * (12 / 14);
    const specialGross = gross * (2 / 14);

    const regularSvCap = svAnnualCap * (12 / 14);
    const specialSvCap = svAnnualCap * (2 / 14);

    const regularSv = Math.min(regularGross, regularSvCap) * baseSvRate;
    // Special payments (13th & 14th) have no housing contribution (0.5%) or AK-Umlage (0.5%), so 17.12% for employees
    const specialSvRate = status === 'freier_dienstnehmer' ? 0.1412 : 0.1712;
    const specialSv = Math.min(specialGross, specialSvCap) * specialSvRate;
    totalSv = regularSv + specialSv;

    // A. Regular Income Tax:
    const regularTaxable = Math.max(0, regularGross - regularSv - customDeductions);
    const regularTaxableForBrackets = Math.max(0, regularTaxable - grundfreibetrag);

    let grossRegularTax = 0;
    for (const b of yearData.nationalBrackets) {
      const rangeLabel = b.upTo !== undefined
        ? `€${b.threshold.toLocaleString('de-AT')} – €${b.upTo.toLocaleString('de-AT')}`
        : `Über €${b.threshold.toLocaleString('de-AT')}`;

      if (regularTaxableForBrackets > b.threshold) {
        const slice = b.upTo !== undefined
          ? Math.min(regularTaxableForBrackets, b.upTo) - b.threshold
          : regularTaxableForBrackets - b.threshold;
        const tax = slice * b.rate;
        grossRegularTax += tax;
        if (slice > 0) marginalRate = b.rate * 100;

        bracketBreakdown.push({
          bracketRange: rangeLabel,
          ratePercent: `${(b.rate * 100).toFixed(0)}%`,
          taxableInBracket: slice,
          taxAmount: tax,
        });
      } else {
        bracketBreakdown.push({
          bracketRange: rangeLabel,
          ratePercent: `${(b.rate * 100).toFixed(0)}%`,
          taxableInBracket: 0,
          taxAmount: 0,
        });
      }
    }

    // Apply Verkehrsabsetzbetrag
    regularTax = Math.max(0, grossRegularTax - verkehrsabsetzbetrag);

    // B. Special Payments Tax (§ 67 EStG):
    const specialTaxable = Math.max(0, specialGross - specialSv);
    const freibetrag67 = 620; // § 67 Abs. 1 tax-free amount

    if (specialTaxable > freibetrag67) {
      const taxableSpecialAboveFreibetrag = specialTaxable - freibetrag67;
      // Up to €25,000 taxed at preferential 6%
      const tier1Special = Math.min(taxableSpecialAboveFreibetrag, 25000);
      specialTax = tier1Special * 0.06;

      // Next €25,000 (€25,000–€50,000) taxed at 27%
      if (taxableSpecialAboveFreibetrag > 25000) {
        const tier2Special = Math.min(taxableSpecialAboveFreibetrag - 25000, 25000);
        specialTax += tier2Special * 0.27;
      }
    }

    incomeTax = regularTax + specialTax;
    taxableIncome = regularTaxable + specialTaxable;
  } else {
    // 12 Payments standard model:
    totalSv = Math.min(gross, svAnnualCap) * baseSvRate;
    taxableIncome = Math.max(0, gross - totalSv - customDeductions);
    const taxableForBrackets = Math.max(0, taxableIncome - grundfreibetrag);

    let grossTax = 0;
    for (const b of yearData.nationalBrackets) {
      const rangeLabel = b.upTo !== undefined
        ? `€${b.threshold.toLocaleString('de-AT')} – €${b.upTo.toLocaleString('de-AT')}`
        : `Über €${b.threshold.toLocaleString('de-AT')}`;

      if (taxableForBrackets > b.threshold) {
        const slice = b.upTo !== undefined
          ? Math.min(taxableForBrackets, b.upTo) - b.threshold
          : taxableForBrackets - b.threshold;
        const tax = slice * b.rate;
        grossTax += tax;
        if (slice > 0) marginalRate = b.rate * 100;

        bracketBreakdown.push({
          bracketRange: rangeLabel,
          ratePercent: `${(b.rate * 100).toFixed(0)}%`,
          taxableInBracket: slice,
          taxAmount: tax,
        });
      } else {
        bracketBreakdown.push({
          bracketRange: rangeLabel,
          ratePercent: `${(b.rate * 100).toFixed(0)}%`,
          taxableInBracket: 0,
          taxAmount: 0,
        });
      }
    }

    incomeTax = Math.max(0, grossTax - verkehrsabsetzbetrag);
    regularTax = incomeTax;
    specialTax = 0;
  }

  const totalAllTaxes = incomeTax + totalSv;
  const netIncome = Math.max(0, gross - totalAllTaxes);
  const effectiveTaxRate = gross > 0 ? (totalAllTaxes / gross) * 100 : 0;

  const socialContributions: SocialContributionDetail[] = [
    {
      name: 'Sozialversicherung Dienstnehmer (SV)',
      ratePercent: `${(baseSvRate * 100).toFixed(2)}%`,
      amount: totalSv,
      description: `Gesetzliche SV (Pensions-, Kranken-, Arbeitslosen- & Wohnbauförderung; Höchstbeitragsgrundlage €${svAnnualCap.toLocaleString('de-AT')})`,
    },
  ];

  return {
    countryId: profile.id,
    countryName: profile.name,
    taxYear,
    currency: yearData.currency,
    currencySymbol: yearData.currencySymbol,
    grossIncome: gross,
    standardDeduction: grundfreibetrag + customDeductions,
    taxableIncome,
    nationalIncomeTax: incomeTax,
    regionalIncomeTax: 0,
    totalIncomeTax: incomeTax,
    socialContributions,
    totalSocialContributions: totalSv,
    totalTaxAndDeductions: totalAllTaxes,
    netIncomeAnnual: netIncome,
    netIncomeMonthly: netIncome / paymentsCount,
    netIncomeBiweekly: netIncome / 26,
    netIncomeWeekly: netIncome / 52,
    netIncomeDaily: netIncome / 260,
    netIncomeHourly: netIncome / 2080,
    effectiveTaxRate: gross > 0 ? (incomeTax / gross) * 100 : 0,
    effectiveTotalDeductionRate: effectiveTaxRate,
    marginalTaxRate: marginalRate,
    bracketBreakdown,
    assumptions: yearData.assumptions,
    officialSourceName: yearData.officialSourceName,
    officialSourceUrl: yearData.officialSourceUrl,
    lastVerifiedDate: yearData.lastVerifiedDate,

    // Austria native outputs
    socialInsurance: totalSv,
    incomeTax,
    totalTax: totalAllTaxes,
    netIncome,
    regularTax,
    specialTax,
    verkehrsabsetzbetrag,
    paymentsCount,

    // Backwards compatibility legacy fields
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: totalSv,
    adjustedGrossIncome: gross - totalSv,
    standardDeductionAmount: grundfreibetrag,
    itemizedDeductionsTotal: customDeductions,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: grundfreibetrag + customDeductions,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    regularIncomeTax: incomeTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: incomeTax,
    childTaxCredit: 0,
    otherDependentCredit: 0,
    totalTaxCredits: verkehrsabsetzbetrag,
    netFederalIncomeTax: incomeTax,
    ficaSocialSecurity: totalSv * (10.25 / 18.12),
    ficaMedicare: totalSv * (3.87 / 18.12),
    totalFicaTax: totalSv,
    totalFederalTaxes: totalAllTaxes,
    stateIncomeTax: 0,
    stateTaxName: 'Länder / Gemeinde (0%)',
    totalAllTaxes,
    totalPaymentsAndWithholdings: 0,
    federalRefundOrOwed: 0,
    stateRefundOrOwed: 0,
    combinedRefundOrOwed: 0,
    netAnnualTakeHome: netIncome,
    netMonthlyTakeHome: netIncome / paymentsCount,
    netBiweeklyTakeHome: netIncome / 26,
    netWeeklyTakeHome: netIncome / 52,
    netHourlyTakeHome: netIncome / 2080,
    effectiveTotalTaxRate: effectiveTaxRate,
    marginalFederalRate: marginalRate,
  };
}
