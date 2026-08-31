import type { CountryTaxProfile } from '../types';

export const usProfile: CountryTaxProfile = {
  id: 'us',
  name: 'United States',
  countryCode: 'US',
  flagEmoji: '🇺🇸',
  defaultCurrency: 'USD',
  defaultCurrencySymbol: '$',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025', '2026'],
  hasRegionalTax: true,
  regionalEntityName: 'State',
  metaDescription: 'Calculate US Federal income tax, FICA (Social Security & Medicare), and take-home pay with the official 2025 IRS tax brackets and standard deductions.',
  faqItems: [
    {
      question: 'What is the 2025 standard deduction for single filers in the US?',
      answer: 'Under IRS Revenue Procedure 2024-40, the standard deduction for the 2025 tax year is $15,750 for Single filers ($31,500 for Married Filing Jointly, and $23,625 for Head of Household).',
    },
    {
      question: 'What are the 2025 FICA Social Security and Medicare tax rates?',
      answer: 'Employees pay 6.2% for Social Security on wages up to $176,100 (the 2025 wage base limit) and 1.45% for Medicare on all earnings with no cap. An additional 0.9% Medicare tax applies to earnings above $200,000 for single filers.',
    },
    {
      question: 'How do US federal marginal tax brackets work?',
      answer: 'The US uses a progressive tax system with seven tax brackets (10%, 12%, 22%, 24%, 32%, 35%, and 37%). You only pay each rate on income within that specific bracket after subtracting your standard deduction.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'USD',
      currencySymbol: '$',
      standardDeduction: 15750,
      nationalBrackets: [
        { threshold: 0, upTo: 11925, rate: 0.10, label: '10% Bracket' },
        { threshold: 11925, upTo: 48475, rate: 0.12, label: '12% Bracket' },
        { threshold: 48475, upTo: 103350, rate: 0.22, label: '22% Bracket' },
        { threshold: 103350, upTo: 197300, rate: 0.24, label: '24% Bracket' },
        { threshold: 197300, upTo: 250525, rate: 0.32, label: '32% Bracket' },
        { threshold: 250525, upTo: 626350, rate: 0.35, label: '35% Bracket' },
        { threshold: 626350, rate: 0.37, label: '37% Bracket' },
      ],
      socialContributions: [
        {
          id: 'social_security',
          name: 'Social Security (OASDI)',
          rate: 0.062,
          employeeRate: 0.062,
          capAmount: 176100,
          description: '6.2% on earnings up to the $176,100 maximum taxable earnings limit.',
        },
        {
          id: 'medicare',
          name: 'Medicare (HI)',
          rate: 0.0145,
          employeeRate: 0.0145,
          description: '1.45% on all earnings with no cap (plus 0.9% additional Medicare on income over $200,000).',
        },
      ],
      regions: [
        { code: 'none', name: 'No State Income Tax (e.g. TX, FL, WA, NV, TN, WY, SD, AK)', flatRate: 0 },
        { code: 'ca', name: 'California (Est. Progressive avg)', additionalTaxRate: 0.06 },
        { code: 'ny', name: 'New York (Est. Progressive avg)', additionalTaxRate: 0.055 },
        { code: 'tx', name: 'Texas (No State Income Tax)', flatRate: 0 },
        { code: 'fl', name: 'Florida (No State Income Tax)', flatRate: 0 },
        { code: 'il', name: 'Illinois (Flat 4.95%)', flatRate: 0.0495 },
        { code: 'pa', name: 'Pennsylvania (Flat 3.07%)', flatRate: 0.0307 },
        { code: 'nc', name: 'North Carolina (Flat 4.5%)', flatRate: 0.045 },
      ],
      vatConfig: {
        name: 'Sales Tax',
        standardRate: 0.07, // Typical US combined state/local average
        reducedRates: [{ name: 'Zero-rated items', rate: 0.0 }],
      },
      officialSourceName: 'IRS (Internal Revenue Service) - Rev. Proc. 2024-40',
      officialSourceUrl: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2025',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single filing status without dependents',
        'Standard deduction applied ($15,750)',
        'Full year resident employee (W-2)',
        'Does not account for itemized deductions, 401(k) pre-tax contributions, or state-specific credits',
      ],
    },
    '2026': {
      taxYear: '2026',
      currency: 'USD',
      currencySymbol: '$',
      standardDeduction: 16100, // Estimated baseline before legislative expiration
      nationalBrackets: [
        { threshold: 0, upTo: 12200, rate: 0.10, label: '10% Bracket' },
        { threshold: 12200, upTo: 49600, rate: 0.12, label: '12% Bracket' },
        { threshold: 49600, upTo: 105700, rate: 0.22, label: '22% Bracket' },
        { threshold: 105700, upTo: 201800, rate: 0.24, label: '24% Bracket' },
        { threshold: 201800, upTo: 256200, rate: 0.32, label: '32% Bracket' },
        { threshold: 256200, upTo: 640700, rate: 0.35, label: '35% Bracket' },
        { threshold: 640700, rate: 0.37, label: '37% Bracket' },
      ],
      socialContributions: [
        {
          id: 'social_security',
          name: 'Social Security (OASDI)',
          rate: 0.062,
          employeeRate: 0.062,
          capAmount: 181800,
          description: '6.2% on earnings up to statutory wage base.',
        },
        {
          id: 'medicare',
          name: 'Medicare (HI)',
          rate: 0.0145,
          employeeRate: 0.0145,
          description: '1.45% on all covered wages.',
        },
      ],
      vatConfig: {
        name: 'Sales Tax',
        standardRate: 0.07,
      },
      officialSourceName: 'IRS Treasury Preliminary Projections',
      officialSourceUrl: 'https://www.irs.gov',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Preliminary projected 2026 inflation parameters for Single filing status'],
    },
  },
};
