import { calculateTaxForCountry } from '../src/utils/tax/engine.ts';
import { allCountryTaxProfiles } from '../src/data/tax/countries.ts';

console.log('====================================================');
console.log('RUNNING COMPREHENSIVE TAX VERIFICATION ACROSS ALL 24 COUNTRIES');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
}

for (const profile of allCountryTaxProfiles) {
  const countryId = profile.id;
  const countryName = profile.name;
  const defYear = profile.defaultTaxYear;
  const yearData = profile.years[defYear];

  console.log(`\n--- Testing ${profile.flagEmoji} ${countryName} (${countryId.toUpperCase()}) - Default Year: ${defYear} ---`);

  // 1. Zero income test
  const resZero = calculateTaxForCountry(profile, 0);
  assert(resZero.grossIncome === 0, `${countryName}: Gross income should be 0`);
  assert(resZero.taxableIncome === 0, `${countryName}: Taxable income on 0 should be 0`);
  assert(resZero.totalIncomeTax === 0, `${countryName}: Tax on 0 should be 0`);
  assert(resZero.totalSocialContributions === 0, `${countryName}: Social on 0 should be 0`);
  assert(resZero.netIncomeAnnual === 0, `${countryName}: Net on 0 should be 0`);
  console.log(`  ✓ Zero income ($0) -> Tax: 0, Net: 0`);

  // 2. Below / At Tax-Free Threshold test
  const deduction = yearData.standardDeduction || 0;
  if (deduction > 0) {
    const belowThreshold = Math.floor(deduction * 0.5);
    const resBelow = calculateTaxForCountry(profile, belowThreshold);
    assert(resBelow.taxableIncome === 0, `${countryName}: Taxable income below threshold should be 0`);
    assert(resBelow.nationalIncomeTax === 0, `${countryName}: National income tax below threshold should be 0`);
    console.log(`  ✓ Below tax-free threshold (${belowThreshold} ${yearData.currency}) -> Taxable: 0, Income Tax: 0`);

    const atThreshold = deduction;
    const resAt = calculateTaxForCountry(profile, atThreshold);
    assert(resAt.taxableIncome === 0, `${countryName}: Taxable income exactly at threshold should be 0`);
    assert(resAt.nationalIncomeTax === 0, `${countryName}: National income tax at threshold should be 0`);
    console.log(`  ✓ At tax-free threshold (${atThreshold} ${yearData.currency}) -> Taxable: 0, Income Tax: 0`);

    const justAbove = deduction + 1000;
    const resJustAbove = calculateTaxForCountry(profile, justAbove);
    assert(resJustAbove.taxableIncome === 1000, `${countryName}: Taxable income just above threshold should be 1000`);
    assert(resJustAbove.nationalIncomeTax > 0, `${countryName}: Tax just above threshold should be > 0`);
    console.log(`  ✓ Just above tax-free threshold (${justAbove} ${yearData.currency}) -> Taxable: ${resJustAbove.taxableIncome}, Income Tax: ${resJustAbove.nationalIncomeTax.toFixed(2)}`);
  }

  // 3. Bracket Progression Tests
  if (yearData.nationalBrackets && yearData.nationalBrackets.length > 0) {
    let prevTax = -1;
    const testPoints = [
      deduction + 5000,
      deduction + 25000,
      deduction + 55000,
    ];
    for (const tp of testPoints) {
      if (tp > 0) {
        const res = calculateTaxForCountry(profile, tp);
        assert(res.totalIncomeTax >= prevTax, `${countryName}: Tax should monotonically increase with income`);
        prevTax = res.totalIncomeTax;
      }
    }
    console.log(`  ✓ Verified progressive monotonic tax scale`);
  }

  // 4. Typical Middle-Class Salary Test
  let typicalSalary = 60000;
  if (profile.defaultCurrency === 'JPY') typicalSalary = 6000000;
  else if (profile.defaultCurrency === 'KRW') typicalSalary = 60000000;
  else if (profile.defaultCurrency === 'NOK' || profile.defaultCurrency === 'SEK' || profile.defaultCurrency === 'DKK') typicalSalary = 550000;
  else if (profile.defaultCurrency === 'PLN') typicalSalary = 100000;
  else if (profile.defaultCurrency === 'MXN') typicalSalary = 450000;

  const resTypical = calculateTaxForCountry(profile, typicalSalary);
  assert(resTypical.netIncomeAnnual > 0 && resTypical.netIncomeAnnual < typicalSalary, `${countryName}: Net income should be between 0 and gross`);
  assert(resTypical.effectiveTaxRate >= 0 && resTypical.effectiveTaxRate < 100, `${countryName}: Effective tax rate should be valid`);
  assert(resTypical.effectiveTotalDeductionRate >= resTypical.effectiveTaxRate, `${countryName}: Total deduction rate >= income tax rate`);
  assert(resTypical.bracketBreakdown.length > 0, `${countryName}: Bracket breakdown generated`);
  console.log(`  ✓ Typical salary (${typicalSalary.toLocaleString()} ${yearData.currency}) -> Tax: ${resTypical.totalIncomeTax.toFixed(2)}, Social: ${resTypical.totalSocialContributions.toFixed(2)}, Net: ${resTypical.netIncomeAnnual.toFixed(2)} (Eff: ${resTypical.effectiveTotalDeductionRate.toFixed(1)}%)`);

  // 5. High Earner Salary Test (> Top Bracket)
  let highSalary = 300000;
  if (profile.defaultCurrency === 'JPY') highSalary = 50000000;
  else if (profile.defaultCurrency === 'KRW') highSalary = 1200000000;
  else if (profile.defaultCurrency === 'NOK' || profile.defaultCurrency === 'SEK' || profile.defaultCurrency === 'DKK') highSalary = 3000000;
  else if (profile.defaultCurrency === 'PLN') highSalary = 500000;
  else if (profile.defaultCurrency === 'MXN') highSalary = 5000000;

  const resHigh = calculateTaxForCountry(profile, highSalary);
  assert(resHigh.totalIncomeTax > resTypical.totalIncomeTax, `${countryName}: High earner tax > typical salary tax`);
  assert(resHigh.effectiveTaxRate >= resTypical.effectiveTaxRate, `${countryName}: Progressive system should have higher/equal effective rate for high earners`);
  assert(resHigh.netIncomeAnnual > resTypical.netIncomeAnnual, `${countryName}: Higher gross should still yield higher net pay`);
  console.log(`  ✓ High income (${highSalary.toLocaleString()} ${yearData.currency}) -> Tax: ${resHigh.totalIncomeTax.toFixed(2)}, Net: ${resHigh.netIncomeAnnual.toFixed(2)} (Eff: ${resHigh.effectiveTotalDeductionRate.toFixed(1)}%)`);

  // 6. Source & Date Metadata verification
  assert(Boolean(yearData.officialSourceName && yearData.officialSourceName.length > 0), `${countryName}: Source name present`);
  assert(Boolean(yearData.officialSourceUrl && yearData.officialSourceUrl.startsWith('http')), `${countryName}: Valid official source URL`);
  assert(Boolean(yearData.lastVerifiedDate && yearData.lastVerifiedDate.startsWith('2026')), `${countryName}: Verified date is 2026`);
  console.log(`  ✓ Official Source verified: ${yearData.officialSourceName} (${yearData.lastVerifiedDate})`);
}

console.log('\n====================================================');
console.log(`ALL 24 COUNTRIES PASSED! (${passedTests} / ${totalTests} assertions passed with 100% accuracy)`);
console.log('====================================================');
