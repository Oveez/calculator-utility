import { ptProfile } from '../../data/tax/countries/pt';
import type {
  CountryTaxProfile,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxCalculationResult,
  SocialContributionDetail,
} from '../../data/tax/types';

export interface PtTaxParams {
  grossIncome: number;
  taxYear?: '2025' | '2026';
  irsJovem?: 'none' | 'year1' | 'year2' | 'year3' | 'year5';
  dependents?: number;
  months?: 12 | 14;
}

export interface PtTaxResult extends TaxCalculationResult {
  socialSecurity: number;
  deducaoEspecifica: number;
  taxableIncome: number;
  coletaTotal: number;
  dependentsCredit: number;
  irsJovemExemption: number;
  minimoDeExistencia: number;
  minimoExemption: number;
  irsTax: number;
  bracketBreakdown: { range: string; rate: string; taxable: number; tax: number }[];
}

export function calculatePtTax(
  paramsOrInputs: PtTaxParams | AdvancedTaxInputs,
  profileMaybe?: CountryTaxProfile
): PtTaxResult & AdvancedTaxResult {
  const isParams = 'grossIncome' in paramsOrInputs && !('primaryW2Income' in paramsOrInputs);
  const profile = profileMaybe || ptProfile;

  let gross = 0;
  let taxYear: '2025' | '2026' = '2026';
  let irsJovem: 'none' | 'year1' | 'year2' | 'year3' | 'year5' = 'none';
  let dependents = 0;
  let months: 12 | 14 = 14;

  if (isParams) {
    const params = paramsOrInputs as PtTaxParams;
    gross = Math.max(0, params.grossIncome || 0);
    taxYear = params.taxYear || '2026';
    irsJovem = params.irsJovem || 'none';
    dependents = Math.max(0, params.dependents || 0);
    months = params.months === 12 ? 12 : 14;
  } else {
    const inputs = paramsOrInputs as AdvancedTaxInputs;
    gross = Math.max(
      0,
      (inputs.primaryW2Income || 0) +
        (inputs.spouseW2Income || 0) +
        (inputs.businessNetIncome || 0) +
        (inputs.otherIncome || 0) +
        (inputs.taxableInterest || 0) +
        (inputs.ordinaryDividends || 0) +
        (inputs.qualifiedDividends || 0) +
        (inputs.longTermCapitalGains || 0)
    );
    taxYear = (inputs.taxYear as '2025' | '2026') || '2026';
    irsJovem = 'none';
    dependents = Math.max(0, inputs.qualifyingChildrenUnder17 || 0);
    months = 14;
  }

  const yearData = profile.years[taxYear] || profile.years[profile.defaultTaxYear];

  // 1. Segurança Social (11% on gross wages, uncapped)
  const ssRule = yearData.socialContributions?.find((c: any) => c.id === 'seguranca_social');
  const ssRate = ssRule?.employeeRate || 0.11;
  const socialSecurity = gross * ssRate;

  // 2. Dedução específica (Art. 25º CIRS)
  // €4,462.15 in 2026 (€4,104 in 2025) or actual SS contributions if higher
  const baselineDeduction = yearData.standardDeduction || (taxYear === '2025' ? 4104 : 4462.15);
  const deducaoEspecifica = Math.max(baselineDeduction, socialSecurity);
  const taxableIncome = Math.max(0, gross - deducaoEspecifica);

  // 3. Progressive 9-Tier IRS Brackets
  let coletaTotal = 0;
  const bracketBreakdown: { range: string; rate: string; taxable: number; tax: number }[] = [];
  const brackets = yearData.nationalBrackets;

  let marginalRate = 0;
  for (const b of brackets) {
    const threshold = b.threshold || 0;
    const upTo = b.upTo !== undefined ? b.upTo : Infinity;
    if (taxableIncome > threshold) {
      const taxableInTier = Math.min(taxableIncome, upTo) - threshold;
      const taxInTier = taxableInTier * b.rate;
      coletaTotal += taxInTier;
      marginalRate = b.rate * 100;

      bracketBreakdown.push({
        range: upTo === Infinity ? `Superior a €${new Intl.NumberFormat('pt-PT').format(threshold)}` : `€${new Intl.NumberFormat('pt-PT').format(threshold)} – €${new Intl.NumberFormat('pt-PT').format(upTo)}`,
        rate: `${(b.rate * 100).toFixed(2)}%`,
        taxable: taxableInTier,
        tax: taxInTier,
      });
    } else {
      bracketBreakdown.push({
        range: upTo === Infinity ? `Superior a €${new Intl.NumberFormat('pt-PT').format(threshold)}` : `€${new Intl.NumberFormat('pt-PT').format(threshold)} – €${new Intl.NumberFormat('pt-PT').format(upTo)}`,
        rate: `${(b.rate * 100).toFixed(2)}%`,
        taxable: 0,
        tax: 0,
      });
    }
  }

  // 4. Dependents Credit (€600 per child)
  const dependentsCredit = dependents * 600;
  let irsAfterDependents = Math.max(0, coletaTotal - dependentsCredit);

  // 5. IRS Jovem Exemption (Art. 12º-B CIRS)
  let irsJovemExemption = 0;
  if (irsJovem === 'year1') {
    irsJovemExemption = irsAfterDependents; // 100%
  } else if (irsJovem === 'year2') {
    irsJovemExemption = irsAfterDependents * 0.75; // 75%
  } else if (irsJovem === 'year3') {
    irsJovemExemption = irsAfterDependents * 0.50; // 50%
  } else if (irsJovem === 'year5') {
    irsJovemExemption = irsAfterDependents * 0.25; // 25%
  }
  let irsAfterJovem = Math.max(0, irsAfterDependents - irsJovemExemption);

  // 6. Mínimo de Existência (Art. 70º CIRS)
  // Low-income safeguard: net salary after SS and IRS cannot be less than subsistence minimum
  const minimoDeExistencia = taxYear === '2025' ? 11480 : 12180;
  let minimoExemption = 0;
  const netBeforeIrs = gross - socialSecurity;

  let finalIrsTax = irsAfterJovem;
  if (gross > 0 && netBeforeIrs <= minimoDeExistencia) {
    minimoExemption = finalIrsTax;
    finalIrsTax = 0;
  } else if (gross > 0 && netBeforeIrs - finalIrsTax < minimoDeExistencia) {
    const allowableIrs = Math.max(0, netBeforeIrs - minimoDeExistencia);
    minimoExemption = finalIrsTax - allowableIrs;
    finalIrsTax = allowableIrs;
  }

  const totalTax = finalIrsTax;
  const totalDeductions = finalIrsTax + socialSecurity;
  const netTakeHome = Math.max(0, gross - totalDeductions);
  const effectiveTaxRate = gross > 0 ? (finalIrsTax / gross) * 100 : 0;
  const effectiveTotalTaxRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

  const socialContributionsDetails: SocialContributionDetail[] = [
    {
      name: 'Segurança Social (11% TSU Trabalhador)',
      amount: socialSecurity,
      rate: ssRate,
    },
  ];

  return {
    grossIncome: gross,
    netIncome: netTakeHome,
    totalTax: finalIrsTax,
    effectiveTaxRate,
    marginalTaxRate: marginalRate,
    incomeTax: finalIrsTax,
    socialSecurity,
    socialContributionsDetails,
    deducaoEspecifica,
    taxableIncome,
    coletaTotal,
    dependentsCredit,
    irsJovemExemption,
    minimoDeExistencia,
    minimoExemption,
    irsTax: finalIrsTax,
    bracketBreakdown,

    // AdvancedTaxResult compatibility
    totalGrossIncome: gross,
    earnedIncome: gross,
    investmentIncome: 0,
    selfEmploymentTax: 0,
    deductibleSelfEmploymentTax: 0,
    totalAdjustmentsToIncome: 0,
    adjustedGrossIncome: gross,
    standardDeductionAmount: deducaoEspecifica,
    itemizedDeductionsTotal: 0,
    itemizedSaltAllowed: 0,
    itemizedMedicalAllowed: 0,
    deductionUsed: 'standard',
    deductionAmount: deducaoEspecifica,
    itemizedAdvantage: 0,
    ordinaryTaxableIncome: taxableIncome,
    preferentialTaxableIncome: 0,
    regularIncomeTax: finalIrsTax,
    preferentialCapitalGainsTax: 0,
    additionalMedicareTax: 0,
    netInvestmentIncomeTax: 0,
    grossFederalTax: coletaTotal,
    childTaxCredit: dependentsCredit,
    otherDependentCredit: 0,
    totalTaxCredits: dependentsCredit + irsJovemExemption + minimoExemption,
    netFederalIncomeTax: finalIrsTax,
    ficaSocialSecurity: socialSecurity,
    ficaMedicare: 0,
    totalFicaTax: socialSecurity,
    totalFederalTaxes: totalDeductions,
    stateIncomeTax: 0,
    stateTaxName: 'IRS Municipal Derrama',
    totalAllTaxes: totalDeductions,
    totalPaymentsAndWithholdings: 0,
    federalRefundOrOwed: -totalDeductions,
    stateRefundOrOwed: 0,
    combinedRefundOrOwed: -totalDeductions,
    netAnnualTakeHome: netTakeHome,
    netMonthlyTakeHome: netTakeHome / months,
    netBiweeklyTakeHome: netTakeHome / 26,
    netWeeklyTakeHome: netTakeHome / 52,
    netHourlyTakeHome: netTakeHome / 2080,
    effectiveFederalRate: effectiveTaxRate,
    effectiveTotalTaxRate,
    marginalFederalRate: marginalRate,

    // Legacy fields
    totalOrdinaryTax: finalIrsTax,
    totalPreferentialTax: 0,
    bracketsBreakdown: bracketBreakdown,
    creditsBreakdown: [],
    netTakeHome,
    totalSocialContributions: socialSecurity,
  };
}
