import type {
  CountryTaxProfile,
  TaxCalculationResult,
  BracketCalculationDetail,
  SocialContributionDetail,
  TaxYearData,
  FilingStatus,
  AdvancedTaxInputs,
  AdvancedTaxResult,
  TaxBracket,
} from '../../data/tax/types';
import { formatCurrency, formatPercent } from './formatters';

export interface TaxCalculationOptions {
  taxYear?: string;
  regionCode?: string;
  filingStatus?: FilingStatus;
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

  // 1. Resolve Standard Deduction / Personal Allowance
  let standardDeduction = yearData.standardDeduction || 0;
  let activeBrackets = yearData.nationalBrackets;

  // Check filing status if country has filing statuses configured
  if (options.filingStatus && yearData.filingStatuses && yearData.filingStatuses[options.filingStatus]) {
    const fsConfig = yearData.filingStatuses[options.filingStatus];
    if (fsConfig) {
      standardDeduction = fsConfig.standardDeduction;
      if (fsConfig.brackets && fsConfig.brackets.length > 0) {
        activeBrackets = fsConfig.brackets;
      }
    }
  }

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

  // 2. Determine brackets (Regional brackets if available, e.g. Scotland)
  const selectedRegion = yearData.regions?.find((r) => r.code === options.regionCode);
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

/**
 * Advanced Multi-Income, Deductions, Credits, and Refund/Owed Engine (Form 1040 model)
 */
export function calculateAdvancedTax(
  profile: CountryTaxProfile,
  inputs: AdvancedTaxInputs
): AdvancedTaxResult {
  const selectedYear = inputs.taxYear && profile.years[inputs.taxYear]
    ? inputs.taxYear
    : profile.defaultTaxYear;
  const yearData = profile.years[selectedYear] || profile.years[profile.defaultTaxYear];
  const filingStatus: FilingStatus = inputs.filingStatus || 'single';

  // 1. Incomes Aggregation
  const primaryW2 = Math.max(0, inputs.primaryW2Income || 0);
  const spouseW2 = Math.max(0, inputs.spouseW2Income || 0);
  const businessNet = Math.max(0, inputs.businessNetIncome || 0);
  const interest = Math.max(0, inputs.taxableInterest || 0);
  const ordinaryDiv = Math.max(0, inputs.ordinaryDividends || 0);
  const qualifiedDiv = Math.max(0, inputs.qualifiedDividends || 0);
  const ltCapGains = Math.max(0, inputs.longTermCapitalGains || 0);
  const otherInc = Math.max(0, inputs.otherIncome || 0);

  const earnedIncome = primaryW2 + spouseW2 + businessNet;
  const investmentIncome = interest + ordinaryDiv + qualifiedDiv + ltCapGains;
  const totalGrossIncome = primaryW2 + spouseW2 + businessNet + interest + ordinaryDiv + qualifiedDiv + ltCapGains + otherInc;

  // 2. Self-Employment Tax (Schedule SE)
  let selfEmploymentTax = 0;
  let deductibleSelfEmploymentTax = 0;
  if (businessNet > 400) {
    const netSEEarnings = businessNet * 0.9235;
    const ssaCap = 184500; // 2026 Social Security base
    const wagesAlreadySubjectToSS = primaryW2 + spouseW2;
    const remainingSSCap = Math.max(0, ssaCap - wagesAlreadySubjectToSS);
    const ssPortion = 0.124 * Math.min(netSEEarnings, remainingSSCap);
    const medicarePortion = 0.029 * netSEEarnings;
    selfEmploymentTax = ssPortion + medicarePortion;
    deductibleSelfEmploymentTax = selfEmploymentTax * 0.50; // 50% above-the-line deduction
  }

  // 3. Above-the-Line Adjustments (Deductions to AGI)
  const ret401k = Math.min(47000, Math.max(0, inputs.preTaxRetirement401k || 0)); // Up to $23.5k per person
  const tradIra = Math.min(16000, Math.max(0, inputs.traditionalIraDeduction || 0)); // Up to $7k/$8k
  const hsa = Math.min(8550, Math.max(0, inputs.hsaDeduction || 0));
  const studentLoan = Math.min(2500, Math.max(0, inputs.studentLoanInterest || 0));

  const totalAdjustmentsToIncome = deductibleSelfEmploymentTax + ret401k + tradIra + hsa + studentLoan;
  const adjustedGrossIncome = Math.max(0, totalGrossIncome - totalAdjustmentsToIncome);

  // 4. Deductions: Standard vs. Itemized Comparison
  const fsConfig = yearData.filingStatuses?.[filingStatus];
  let standardDeductionAmount = fsConfig?.standardDeduction || yearData.standardDeduction || 16100;

  // Senior (65+) & Blindness Extra Deductions
  const seniorBonus = fsConfig?.seniorAdditionalDeduction || (filingStatus === 'married_joint' ? 1600 : 2000);
  const blindBonus = fsConfig?.blindAdditionalDeduction || (filingStatus === 'married_joint' ? 1600 : 2000);

  if (inputs.taxpayerAge65OrOver) standardDeductionAmount += seniorBonus;
  if (inputs.spouseAge65OrOver && (filingStatus === 'married_joint' || filingStatus === 'qualifying_widow')) standardDeductionAmount += seniorBonus;
  if (inputs.taxpayerBlind) standardDeductionAmount += blindBonus;
  if (inputs.spouseBlind && (filingStatus === 'married_joint' || filingStatus === 'qualifying_widow')) standardDeductionAmount += blindBonus;

  // Itemized Deductions (Schedule A)
  const saltRaw = (inputs.itemizedSaltStateLocalTax || 0) + (inputs.itemizedPropertyTax || 0);
  const itemizedSaltAllowed = Math.min(10000, saltRaw); // Statutory $10,000 SALT cap
  const mortgageInterest = Math.max(0, inputs.itemizedMortgageInterest || 0);
  const charity = Math.max(0, inputs.itemizedCharitableDonations || 0);
  const medicalRaw = Math.max(0, inputs.itemizedMedicalDentalExpenses || 0);
  const itemizedMedicalAllowed = Math.max(0, medicalRaw - (0.075 * adjustedGrossIncome));

  const itemizedDeductionsTotal = itemizedSaltAllowed + mortgageInterest + charity + itemizedMedicalAllowed;

  // Deduction Selection Mode
  let deductionUsed: 'standard' | 'itemized' = 'standard';
  let deductionAmount = standardDeductionAmount;
  const mode = inputs.deductionMode || 'auto';

  if (mode === 'itemized') {
    deductionUsed = 'itemized';
    deductionAmount = itemizedDeductionsTotal;
  } else if (mode === 'standard') {
    deductionUsed = 'standard';
    deductionAmount = standardDeductionAmount;
  } else {
    // Auto: Choose whichever yields the greater deduction
    if (itemizedDeductionsTotal > standardDeductionAmount) {
      deductionUsed = 'itemized';
      deductionAmount = itemizedDeductionsTotal;
    } else {
      deductionUsed = 'standard';
      deductionAmount = standardDeductionAmount;
    }
  }

  const itemizedAdvantage = itemizedDeductionsTotal - standardDeductionAmount;
  const taxableIncome = Math.max(0, adjustedGrossIncome - deductionAmount);

  // 5. Preferential Capital Gains & Qualified Dividends Tax
  const preferentialEligible = qualifiedDiv + ltCapGains;
  const preferentialTaxableIncome = Math.min(taxableIncome, preferentialEligible);
  const ordinaryTaxableIncome = Math.max(0, taxableIncome - preferentialTaxableIncome);

  // Compute Regular Tax on Ordinary Taxable Income
  const activeBrackets: TaxBracket[] = fsConfig?.brackets || yearData.nationalBrackets;
  let regularIncomeTax = 0;
  let marginalFederalRate = 0;

  for (let i = 0; i < activeBrackets.length; i++) {
    const b = activeBrackets[i];
    if (ordinaryTaxableIncome > b.threshold) {
      const slice = b.upTo !== undefined
        ? Math.min(ordinaryTaxableIncome, b.upTo) - b.threshold
        : ordinaryTaxableIncome - b.threshold;
      regularIncomeTax += slice * b.rate;
      if (slice > 0) marginalFederalRate = b.rate * 100;
    }
  }

  // Compute Preferential Capital Gains Tax (0%, 15%, 20%)
  const capGainsBrackets: TaxBracket[] = fsConfig?.capitalGainsBrackets || yearData.capitalGainsBrackets || [
    { threshold: 0, upTo: 49450, rate: 0.00 },
    { threshold: 49450, upTo: 540800, rate: 0.15 },
    { threshold: 540800, rate: 0.20 },
  ];

  let preferentialCapitalGainsTax = 0;
  if (preferentialTaxableIncome > 0) {
    const bottomOfStack = ordinaryTaxableIncome;
    const topOfStack = ordinaryTaxableIncome + preferentialTaxableIncome;

    for (let i = 0; i < capGainsBrackets.length; i++) {
      const b = capGainsBrackets[i];
      const bracketFloor = b.threshold;
      const bracketCeiling = b.upTo !== undefined ? b.upTo : Infinity;

      const overlapStart = Math.max(bottomOfStack, bracketFloor);
      const overlapEnd = Math.min(topOfStack, bracketCeiling);

      if (overlapEnd > overlapStart) {
        preferentialCapitalGainsTax += (overlapEnd - overlapStart) * b.rate;
      }
    }
  }

  // 6. Net Investment Income Tax (NIIT 3.8%)
  const niitThreshold = filingStatus === 'married_joint' ? 250000 : 200000;
  let netInvestmentIncomeTax = 0;
  if (adjustedGrossIncome > niitThreshold) {
    const niitSubjectAmount = Math.min(investmentIncome, adjustedGrossIncome - niitThreshold);
    netInvestmentIncomeTax = Math.max(0, niitSubjectAmount * 0.038);
  }

  // 7. Additional Medicare Tax (0.9% on wages/SE above $200k/$250k)
  const medThreshold = filingStatus === 'married_joint' ? 250000 : 200000;
  let additionalMedicareTax = 0;
  if (earnedIncome > medThreshold) {
    additionalMedicareTax = (earnedIncome - medThreshold) * 0.009;
  }

  // 8. Tax Credits: Child Tax Credit & Other Dependent Credit
  const numKids = Math.max(0, inputs.numChildrenUnder17 || 0);
  const numOther = Math.max(0, inputs.numOtherDependents || 0);
  const ctcThreshold = filingStatus === 'married_joint' ? 400000 : 200000;
  let childTaxCredit = numKids * 2000;
  let otherDependentCredit = numOther * 500;

  // Phase-out: $50 per $1,000 above threshold
  if (adjustedGrossIncome > ctcThreshold) {
    const phaseOutChunks = Math.ceil((adjustedGrossIncome - ctcThreshold) / 1000);
    const reduction = phaseOutChunks * 50;
    childTaxCredit = Math.max(0, childTaxCredit - reduction);
    otherDependentCredit = Math.max(0, otherDependentCredit - Math.max(0, reduction - (numKids * 2000)));
  }

  const totalTaxCredits = childTaxCredit + otherDependentCredit;
  const grossFederalTax = regularIncomeTax + preferentialCapitalGainsTax;
  const netFederalIncomeTax = Math.max(0, grossFederalTax - totalTaxCredits);

  // 9. FICA Payroll Taxes on W-2 Wages
  const ssaWageCap = 184500;
  const ss1 = Math.min(primaryW2, ssaWageCap) * 0.062;
  const ss2 = Math.min(spouseW2, ssaWageCap) * 0.062;
  const ficaSocialSecurity = ss1 + ss2;
  const ficaMedicare = (primaryW2 + spouseW2) * 0.0145;
  const totalFicaTax = ficaSocialSecurity + ficaMedicare + additionalMedicareTax;

  const totalFederalTaxes = netFederalIncomeTax + totalFicaTax + selfEmploymentTax + netInvestmentIncomeTax;

  // 10. State Income Tax
  let stateIncomeTax = 0;
  let stateTaxName = 'State Income Tax';
  const region = yearData.regions?.find((r) => r.code === inputs.regionCode);

  if (region) {
    stateTaxName = region.name;
    if (region.flatRate !== undefined && region.flatRate > 0) {
      stateIncomeTax = taxableIncome * region.flatRate;
    } else if (region.additionalTaxRate !== undefined && region.additionalTaxRate > 0) {
      stateIncomeTax = taxableIncome * region.additionalTaxRate;
    }
  }

  const totalAllTaxes = totalFederalTaxes + stateIncomeTax;

  // 11. Payments & Refund / Owed Calculation
  const fedWithheld = Math.max(0, inputs.federalTaxWithheld || 0);
  const stateWithheld = Math.max(0, inputs.stateTaxWithheld || 0);
  const totalPaymentsAndWithholdings = fedWithheld + stateWithheld;

  // Form 1040 Federal Liability reconciled against withholdings
  const federal1040Liability = netFederalIncomeTax + netInvestmentIncomeTax + selfEmploymentTax;
  const federalRefundOrOwed = fedWithheld - federal1040Liability;
  const stateRefundOrOwed = stateWithheld - stateIncomeTax;
  const combinedRefundOrOwed = federalRefundOrOwed + stateRefundOrOwed;

  // 12. Net Take-Home Pay & Discretionary Cash
  const netAnnualTakeHome = Math.max(0, totalGrossIncome - totalAllTaxes - (ret401k + tradIra + hsa));

  const effectiveFederalRate = totalGrossIncome > 0
    ? (netFederalIncomeTax / totalGrossIncome) * 100
    : 0;

  const effectiveTotalTaxRate = totalGrossIncome > 0
    ? (totalAllTaxes / totalGrossIncome) * 100
    : 0;

  return {
    totalGrossIncome,
    earnedIncome,
    investmentIncome,
    selfEmploymentTax,
    deductibleSelfEmploymentTax,
    totalAdjustmentsToIncome,
    adjustedGrossIncome,
    standardDeductionAmount,
    itemizedDeductionsTotal,
    itemizedSaltAllowed,
    itemizedMedicalAllowed,
    deductionUsed,
    deductionAmount,
    itemizedAdvantage,
    taxableIncome,
    ordinaryTaxableIncome,
    preferentialTaxableIncome,
    regularIncomeTax,
    preferentialCapitalGainsTax,
    additionalMedicareTax,
    netInvestmentIncomeTax,
    grossFederalTax,
    childTaxCredit,
    otherDependentCredit,
    totalTaxCredits,
    netFederalIncomeTax,
    ficaSocialSecurity,
    ficaMedicare,
    totalFicaTax,
    totalFederalTaxes,
    stateIncomeTax,
    stateTaxName,
    totalAllTaxes,
    totalPaymentsAndWithholdings,
    federalRefundOrOwed,
    stateRefundOrOwed,
    combinedRefundOrOwed,
    netAnnualTakeHome,
    netMonthlyTakeHome: netAnnualTakeHome / 12,
    netBiweeklyTakeHome: netAnnualTakeHome / 26,
    netWeeklyTakeHome: netAnnualTakeHome / 52,
    netHourlyTakeHome: netAnnualTakeHome / 2080,
    effectiveFederalRate,
    effectiveTotalTaxRate,
    marginalFederalRate,
  };
}
