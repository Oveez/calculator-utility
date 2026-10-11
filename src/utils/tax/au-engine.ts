import { calculateTaxForProfile } from './calculate-profile-tax';
import { auProfile } from '../../data/tax/countries/au';
import type { TaxCalculationResult } from '../../data/tax/types';

export interface AuTaxInputs {
  taxYear?: string;
  grossIncome: number;
  hasPrivateHealthInsurance?: boolean;
  numDependentChildren?: number;
  isResident?: boolean; // Defaults to true
  spouseIncome?: number;
  customDeductions?: number;
}

export interface AuTaxResult extends TaxCalculationResult {
  litoAmount: number;
  medicareLevy: number;
  medicareLevySurcharge: number;
}

export function calculateAuTax(inputs: AuTaxInputs): AuTaxResult {
  const profile = auProfile;
  const year = inputs.taxYear || '2026-27';
  const gross = Math.max(0, inputs.grossIncome || 0);
  const deductions = Math.max(0, inputs.customDeductions || 0);

  // We only support resident calculation for now as per assumptions
  const baseResult = calculateTaxForProfile(profile, gross, { taxYear: year, customDeductions: deductions });
  const taxable = baseResult.taxableIncome;

  // 1. LITO (Low Income Tax Offset)
  let litoAmount = 0;
  if (taxable <= 37500) {
    litoAmount = 700;
  } else if (taxable <= 45000) {
    litoAmount = 700 - (taxable - 37500) * 0.05;
  } else if (taxable <= 66667) {
    litoAmount = 325 - (taxable - 45000) * 0.015;
  }
  litoAmount = Math.max(0, litoAmount);

  // Apply LITO to reduce the income tax (can't reduce below 0)
  let actualIncomeTax = baseResult.nationalIncomeTax - litoAmount;
  actualIncomeTax = Math.max(0, actualIncomeTax);

  // 2. Medicare Levy (using 2026-27 rules logic)
  const mlThreshold = 26000;
  const mlPhaseInRate = 0.10;
  const mlStandardRate = 0.02;
  
  let medicareLevy = 0;
  if (taxable <= mlThreshold) {
    medicareLevy = 0;
  } else {
    // phase-in up to where 2% catches up: 26000 * 0.10 / (0.10 - 0.02) = 32500
    const phaseIn = (taxable - mlThreshold) * mlPhaseInRate;
    const standard = taxable * mlStandardRate;
    medicareLevy = Math.min(phaseIn, standard);
  }

  // 3. Medicare Levy Surcharge (MLS) for 2026-27
  let medicareLevySurcharge = 0;
  if (!inputs.hasPrivateHealthInsurance) {
    const isFamily = inputs.spouseIncome !== undefined || (inputs.numDependentChildren || 0) > 0;
    const numKids = inputs.numDependentChildren || 0;
    const totalFamilyIncome = gross + (inputs.spouseIncome || 0);

    // 2026-27 MLS thresholds
    const baseThreshold = isFamily ? 210000 + Math.max(0, numKids - 1) * 1500 : 105000;
    const tier1 = isFamily ? 246000 + Math.max(0, numKids - 1) * 1500 : 123000;
    const tier2 = isFamily ? 328000 + Math.max(0, numKids - 1) * 1500 : 164000;

    let mlsRate = 0;
    const testIncome = isFamily ? totalFamilyIncome : gross;
    
    if (testIncome > tier2) {
      mlsRate = 0.015;
    } else if (testIncome > tier1) {
      mlsRate = 0.0125;
    } else if (testIncome > baseThreshold) {
      mlsRate = 0.010;
    }

    medicareLevySurcharge = gross * mlsRate;
  }

  const totalIncomeTax = actualIncomeTax;
  const totalTaxAndDeductions = totalIncomeTax + medicareLevy + medicareLevySurcharge;
  const netIncomeAnnual = Math.max(0, gross - totalTaxAndDeductions);

  return {
    ...baseResult,
    nationalIncomeTax: actualIncomeTax,
    totalIncomeTax: actualIncomeTax,
    medicareLevy,
    medicareLevySurcharge,
    litoAmount,
    totalSocialContributions: medicareLevy + medicareLevySurcharge,
    socialContributions: [
      {
        name: 'Medicare Levy',
        ratePercent: '2.00%',
        amount: medicareLevy,
        description: 'Standard 2% levy with phase-in for low income'
      },
      ...(medicareLevySurcharge > 0 ? [{
        name: 'Medicare Levy Surcharge',
        ratePercent: `${((medicareLevySurcharge / gross) * 100).toFixed(2)}%`,
        amount: medicareLevySurcharge,
        description: 'Surcharge for not having private health insurance'
      }] : [])
    ],
    totalTaxAndDeductions,
    netIncomeAnnual,
    netIncomeMonthly: netIncomeAnnual / 12,
    netIncomeBiweekly: netIncomeAnnual / 26,
    netIncomeWeekly: netIncomeAnnual / 52,
    netIncomeDaily: netIncomeAnnual / 260,
    netIncomeHourly: netIncomeAnnual / 2080,
    effectiveTaxRate: gross > 0 ? (totalIncomeTax / gross) * 100 : 0,
    effectiveTotalDeductionRate: gross > 0 ? (totalTaxAndDeductions / gross) * 100 : 0,
  };
}
