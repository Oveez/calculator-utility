import type { CountryTaxProfile } from '../types';

export const seProfile: CountryTaxProfile = {
  id: 'sweden',
  name: 'Sweden',
  countryCode: 'SE',
  flagEmoji: '🇸🇪',
  defaultCurrency: 'SEK',
  defaultCurrencySymbol: 'kr',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Municipality (Kommun)',
  metaDescription: 'Calculate Swedish municipal and state income tax (Inkomstskatt), jobbskatteavdrag, and net salary with official Skatteverket 2026 data (skiktgräns 643,000 SEK).',
  faqItems: [
    {
      question: 'How does the Swedish two-tier income tax system work in 2026?',
      answer: 'All workers pay municipal tax (kommunalskatt, averaging ~32.38%) on taxable income after the basic deduction (grundavdrag). High earners whose taxable income exceeds the state tax threshold (skiktgräns 643,000 SEK) pay an additional 20% state income tax (statlig inkomstskatt).',
    },
    {
      question: 'What is Jobbskatteavdrag in Sweden?',
      answer: 'Jobbskatteavdrag is an earned income tax reduction for employed individuals that substantially lowers the effective tax rate on wage income.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'SEK',
      currencySymbol: 'kr',
      standardDeduction: 25000, // Grundavdrag baseline 2026
      nationalBrackets: [
        { threshold: 0, upTo: 643000, rate: 0.3238, label: 'Municipal Tax (~32.38%)' },
        { threshold: 643000, rate: 0.5238, label: 'Municipal + State Tax (52.38%)' }, // 32.38% + 20%
      ],
      socialContributions: [
        {
          id: 'pension_fee',
          name: 'Public Pension Fee (Allmän pensionsavgift)',
          rate: 0.07,
          employeeRate: 0.07,
          capAmount: 643000,
          description: '7% public pension fee (fully offset by tax credit for wage earners).',
        },
      ],
      regions: [
        { code: 'stockholm', name: 'Stockholm (~29.82%)', additionalTaxRate: -0.0256 },
        { code: 'gothenburg', name: 'Göteborg (~32.60%)', additionalTaxRate: 0.0022 },
        { code: 'malmo', name: 'Malmö (~32.42%)', additionalTaxRate: 0.0004 },
        { code: 'uppsala', name: 'Uppsala (~32.22%)', additionalTaxRate: -0.0016 },
        { code: 'linkoping', name: 'Linköping (~31.94%)', additionalTaxRate: -0.0044 },
        { code: 'national_avg', name: 'National Average (~32.38%)', flatRate: 0 },
      ],
      vatConfig: {
        name: 'Moms',
        standardRate: 0.25, // 25%
        reducedRates: [
          { name: '12% (livsmedel, hotell)', rate: 0.12 },
          { name: '6% (böcker, kollektivtrafik)', rate: 0.06 },
        ],
      },
      officialSourceName: 'Skatteverket (Swedish Tax Agency)',
      officialSourceUrl: 'https://www.skatteverket.se',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Swedish resident worker under 66 years old',
        'National average municipal tax rate of 32.38% applied',
        'Skiktgräns for state income tax of 643,000 SEK applied',
        'Includes Grundavdrag and standard Jobbskatteavdrag deduction',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'SEK',
      currencySymbol: 'kr',
      standardDeduction: 24000,
      nationalBrackets: [
        { threshold: 0, upTo: 601800, rate: 0.3237, label: 'Municipal Tax (~32.37%)' },
        { threshold: 601800, rate: 0.5237, label: 'Municipal + State Tax (52.37%)' },
      ],
      socialContributions: [
        {
          id: 'pension_fee',
          name: 'Public Pension Fee (Allmän pensionsavgift)',
          rate: 0.07,
          employeeRate: 0.07,
          capAmount: 614000,
        },
      ],
      regions: [
        { code: 'stockholm', name: 'Stockholm (~29.82%)', additionalTaxRate: -0.0256 },
        { code: 'gothenburg', name: 'Göteborg (~32.60%)', additionalTaxRate: 0.0022 },
        { code: 'malmo', name: 'Malmö (~32.42%)', additionalTaxRate: 0.0004 },
        { code: 'uppsala', name: 'Uppsala (~32.22%)', additionalTaxRate: -0.0016 },
        { code: 'linkoping', name: 'Linköping (~31.94%)', additionalTaxRate: -0.0044 },
        { code: 'national_avg', name: 'National Average (~32.37%)', flatRate: 0 },
      ],
      vatConfig: {
        name: 'Moms',
        standardRate: 0.25,
      },
      officialSourceName: 'Skatteverket',
      officialSourceUrl: 'https://www.skatteverket.se',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Swedish resident worker for 2025 tax year'],
    },
  },
};
