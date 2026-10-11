import { describe, it, expect } from 'vitest';
import { calculateDeTax, computeGermanESt } from '../src/utils/tax/de-engine';

describe('DE Tax Engine (§ 32a EStG Statutory Implementation)', () => {
  it('correctly exempts income at or below statutory Grundfreibetrag (€12,348 for 2026)', () => {
    const under = calculateDeTax({ grossIncome: 12000, taxYear: '2026' });
    expect(under.incomeTax).toBe(0);
    expect(under.solidaritySurcharge).toBe(0);

    const exact = calculateDeTax({ grossIncome: 12348, taxYear: '2026' });
    expect(exact.incomeTax).toBe(0);
    expect(exact.solidaritySurcharge).toBe(0);
  });

  it('calculates § 32a linear progression for standard €50,000 salary (Klasse 1)', () => {
    const result = calculateDeTax({ grossIncome: 50000, taxYear: '2026', steuerklasse: '1' });
    
    // Taxable income is in Zone 3 (€17,006 - €66,760)
    // Exact statutory ESt under § 32a Abs. 1 EStG Zone 3 formula is €11,150
    expect(result.incomeTax).toBe(11150);

    // Income tax is well below Soli Freigrenze (€18,130), so Soli must be exactly €0
    expect(result.solidaritySurcharge).toBe(0);

    // Social security contributions check
    // RV: 50,000 * 9.3% = 4,650
    expect(result.socialInsurances.rentenversicherung).toBeCloseTo(4650);
    // AV: 50,000 * 1.3% = 650
    expect(result.socialInsurances.arbeitslosenversicherung).toBeCloseTo(650);
    // Total deductions > 0 and net income < 50,000
    expect(result.netIncome).toBe(50000 - result.totalTax);
  });

  it('correctly applies Solidaritätszuschlag Freigrenze (€18,130 of ESt)', () => {
    // A gross income of €80,000 produces income tax around €19,000, which enters the Soli Milderungszone
    const result80k = calculateDeTax({ grossIncome: 80000, taxYear: '2026' });
    if (result80k.incomeTax > 18130) {
      expect(result80k.solidaritySurcharge).toBeGreaterThan(0);
    } else {
      expect(result80k.solidaritySurcharge).toBe(0);
    }

    // A high gross income of €150,000 pays full 5.5% Soli
    const result150k = calculateDeTax({ grossIncome: 150000, taxYear: '2026' });
    expect(result150k.incomeTax).toBeGreaterThan(18130);
    expect(result150k.solidaritySurcharge).toBeGreaterThan(0);
    expect(result150k.solidaritySurcharge).toBeLessThanOrEqual(result150k.incomeTax * 0.055);
  });

  it('applies church tax (Kirchensteuer) at selected state rate', () => {
    const noChurch = calculateDeTax({ grossIncome: 60000, taxYear: '2026', hasChurchTax: false });
    const church9 = calculateDeTax({ grossIncome: 60000, taxYear: '2026', hasChurchTax: true, churchTaxRate: 0.09 });
    const church8 = calculateDeTax({ grossIncome: 60000, taxYear: '2026', hasChurchTax: true, churchTaxRate: 0.08 });

    expect(noChurch.churchTax).toBe(0);
    expect(church9.churchTax).toBeCloseTo(church9.incomeTax * 0.09);
    expect(church8.churchTax).toBeCloseTo(church8.incomeTax * 0.08);
  });

  it('correctly computes statutory Ehegattensplitting for Steuerklasse 3', () => {
    const single = calculateDeTax({ grossIncome: 60000, steuerklasse: '1' });
    const splitting = calculateDeTax({ grossIncome: 60000, steuerklasse: '3' });
    const secondJob = calculateDeTax({ grossIncome: 60000, steuerklasse: '6' });

    // Splitting tax on €60k is 2x tax on €30k, which is strictly less than tax on €60k single
    expect(splitting.incomeTax).toBeLessThan(single.incomeTax);
    // Class 6 (secondary job) has no allowance and pays higher tax
    expect(secondJob.incomeTax).toBeGreaterThan(single.incomeTax);
  });

  it('respects statutory Beitragsbemessungsgrenzen for 2026 (€101,400 pension / €69,750 health)', () => {
    const highEarner = calculateDeTax({ grossIncome: 150000, taxYear: '2026' });

    // RV cap at €101,400 * 9.3% = 9,430.20
    expect(highEarner.socialInsurances.rentenversicherung).toBeCloseTo(101400 * 0.093);
    // KV cap at €69,750 * 8.15% = 5,684.625
    expect(highEarner.socialInsurances.krankenversicherung).toBeCloseTo(69750 * 0.0815);
  });
});
