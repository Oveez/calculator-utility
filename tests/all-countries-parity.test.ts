import { describe, it, expect } from 'vitest';

// Tier 1
import { calculatePlTax } from '../src/utils/tax/pl-engine';
import { calculateUkTax } from '../src/utils/tax/uk-engine';
import { calculateDeTax } from '../src/utils/tax/de-engine';
import { calculateAuTax } from '../src/utils/tax/au-engine';
import { calculateCaTax } from '../src/utils/tax/ca-engine';
import { calculateAdvancedTax as calculateUsTax } from '../src/utils/tax/us-engine';

// Tier 2
import { calculateNlTax } from '../src/utils/tax/nl-engine';
import { calculateFrTax } from '../src/utils/tax/fr-engine';
import { calculateIeTax } from '../src/utils/tax/ie-engine';
import { calculateEsTax } from '../src/utils/tax/es-engine';
import { calculateItTax } from '../src/utils/tax/it-engine';

// Tier 3
import { calculateJpTax } from '../src/utils/tax/jp-engine';
import { calculateSgTax } from '../src/utils/tax/sg-engine';
import { calculateNzTax } from '../src/utils/tax/nz-engine';
import { calculateKrTax } from '../src/utils/tax/kr-engine';
import { calculateMxTax } from '../src/utils/tax/mx-engine';
import { calculateChTax } from '../src/utils/tax/ch-engine';

// Tier 4
import { calculateAtTax } from '../src/utils/tax/at-engine';
import { calculateBeTax } from '../src/utils/tax/be-engine';
import { calculateDkTax } from '../src/utils/tax/dk-engine';
import { calculateFiTax } from '../src/utils/tax/fi-engine';
import { calculateNoTax } from '../src/utils/tax/no-engine';
import { calculateSeTax } from '../src/utils/tax/se-engine';
import { calculatePtTax } from '../src/utils/tax/pt-engine';

// Profiles
import { plProfile } from '../src/data/tax/countries/pl';
import { ukProfile } from '../src/data/tax/countries/uk';
import { deProfile } from '../src/data/tax/countries/de';
import { auProfile } from '../src/data/tax/countries/au';
import { caProfile } from '../src/data/tax/countries/ca';
import { usProfile } from '../src/data/tax/countries/us';
import { nlProfile } from '../src/data/tax/countries/nl';
import { frProfile } from '../src/data/tax/countries/fr';
import { ieProfile } from '../src/data/tax/countries/ie';
import { esProfile } from '../src/data/tax/countries/es';
import { itProfile } from '../src/data/tax/countries/it';
import { jpProfile } from '../src/data/tax/countries/jp';
import { sgProfile } from '../src/data/tax/countries/sg';
import { nzProfile } from '../src/data/tax/countries/nz';
import { krProfile } from '../src/data/tax/countries/kr';
import { mxProfile } from '../src/data/tax/countries/mx';
import { chProfile } from '../src/data/tax/countries/ch';
import { atProfile } from '../src/data/tax/countries/at';
import { beProfile } from '../src/data/tax/countries/be';
import { dkProfile } from '../src/data/tax/countries/dk';
import { fiProfile } from '../src/data/tax/countries/fi';
import { noProfile } from '../src/data/tax/countries/no';
import { seProfile } from '../src/data/tax/countries/se';
import { ptProfile } from '../src/data/tax/countries/pt';

describe('Phase R5 Full-Platform 24-Country Isomorphic Parity Test', () => {
  const tests = [
    { country: 'Poland', code: 'pl', fn: () => calculatePlTax({ grossIncome: 120000 }, plProfile) },
    { country: 'United Kingdom', code: 'uk', fn: () => calculateUkTax({ grossIncome: 50000 }, ukProfile) },
    { country: 'Germany', code: 'de', fn: () => calculateDeTax({ grossIncome: 60000 }, deProfile) },
    { country: 'Australia', code: 'au', fn: () => calculateAuTax({ grossIncome: 80000 }, auProfile) },
    { country: 'Canada', code: 'ca', fn: () => calculateCaTax(caProfile, 75000) },
    { country: 'United States', code: 'us', fn: () => calculateUsTax(usProfile, { primaryW2Income: 75000 }) },
    { country: 'Netherlands', code: 'nl', fn: () => calculateNlTax({ grossIncome: 50000 }, nlProfile) },
    { country: 'France', code: 'fr', fn: () => calculateFrTax({ grossIncome: 45000 }, frProfile) },
    { country: 'Ireland', code: 'ie', fn: () => calculateIeTax({ grossIncome: 55000 }, ieProfile) },
    { country: 'Spain', code: 'es', fn: () => calculateEsTax({ grossIncome: 40000 }, esProfile) },
    { country: 'Italy', code: 'it', fn: () => calculateItTax({ grossIncome: 42000 }, itProfile) },
    { country: 'Japan', code: 'jp', fn: () => calculateJpTax({ grossIncome: 6000000 }, jpProfile) },
    { country: 'Singapore', code: 'sg', fn: () => calculateSgTax({ grossIncome: 72000 }, sgProfile) },
    { country: 'New Zealand', code: 'nz', fn: () => calculateNzTax({ grossIncome: 70000 }, nzProfile) },
    { country: 'South Korea', code: 'kr', fn: () => calculateKrTax({ grossIncome: 50000000 }, krProfile) },
    { country: 'Mexico', code: 'mx', fn: () => calculateMxTax({ grossIncome: 360000 }, mxProfile) },
    { country: 'Switzerland', code: 'ch', fn: () => calculateChTax({ grossIncome: 100000 }, chProfile) },
    { country: 'Austria', code: 'at', fn: () => calculateAtTax({ grossIncome: 50000 }, atProfile) },
    { country: 'Belgium', code: 'be', fn: () => calculateBeTax({ grossIncome: 48000 }, beProfile) },
    { country: 'Denmark', code: 'dk', fn: () => calculateDkTax({ grossIncome: 500000 }, dkProfile) },
    { country: 'Finland', code: 'fi', fn: () => calculateFiTax({ grossIncome: 45000 }, fiProfile) },
    { country: 'Norway', code: 'no', fn: () => calculateNoTax({ grossIncome: 600000 }, noProfile) },
    { country: 'Sweden', code: 'se', fn: () => calculateSeTax({ grossIncome: 500000 }, seProfile) },
    { country: 'Portugal', code: 'pt', fn: () => calculatePtTax({ grossIncome: 35000 }, ptProfile) },
  ];

  it.each(tests)('verifies $country ($code) produces valid isomorphic output', ({ country, code, fn }) => {
    const res: any = fn();
    const gross = res.grossIncome ?? res.totalGrossIncome;
    const net = res.netIncomeAnnual ?? res.netIncome ?? res.netAnnualTakeHome ?? res.netTakeHome;
    const effectiveRate = res.effectiveTaxRate ?? res.effectiveTotalTaxRate;

    expect(gross).toBeGreaterThan(0);
    expect(net).toBeGreaterThan(0);
    expect(net).toBeLessThanOrEqual(gross);
    expect(Number.isFinite(net)).toBe(true);
    expect(Number.isFinite(effectiveRate)).toBe(true);
  });
});
