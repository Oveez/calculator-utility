import type { CountryTaxProfile, TaxCalculationResult } from '../../data/tax/types';
import { calculateTaxForCountry, type TaxCalculationOptions } from './engine';

export function calculateGrossFromNet(
  profile: CountryTaxProfile,
  targetNetAnnualIncome: number,
  options: TaxCalculationOptions = {}
): TaxCalculationResult {
  const targetNet = Math.max(0, isNaN(targetNetAnnualIncome) ? 0 : targetNetAnnualIncome);

  if (targetNet === 0) {
    return calculateTaxForCountry(profile, 0, options);
  }

  // Binary search bounds: Gross is always >= Net and usually <= Net * 3
  let low = targetNet;
  let high = targetNet * 3.5 + 50000;
  let bestGross = targetNet;
  const maxIterations = 50;
  const tolerance = 0.5; // Within 50 cents

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const result = calculateTaxForCountry(profile, mid, options);
    const diff = result.netIncomeAnnual - targetNet;

    if (Math.abs(diff) <= tolerance) {
      bestGross = mid;
      break;
    }

    if (diff < 0) {
      // Net pay was too low -> Gross needs to be higher
      low = mid;
    } else {
      // Net pay was too high -> Gross needs to be lower
      high = mid;
      bestGross = mid;
    }
  }

  return calculateTaxForCountry(profile, bestGross, options);
}
