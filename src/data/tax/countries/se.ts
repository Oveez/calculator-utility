import type { CountryTaxProfile } from '../types';

export const seProfile: CountryTaxProfile = {
  id: 'sweden',
  name: 'Sweden',
  countryCode: 'SE',
  flagEmoji: '🇸🇪',
  defaultCurrency: 'SEK',
  defaultCurrencySymbol: 'kr',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Municipality (Kommun)',
  metaDescription: 'Calculate Swedish municipal and state income tax (Inkomstskatt), jobbskatteavdrag, and net salary with official Skatteverket 2025 data.',
  faqItems: [
    {
      question: 'How does the Swedish two-tier income tax system work?',
      answer: 'All workers pay municipal tax (kommunalskatt, averaging ~32.37%) on taxable income after the basic deduction (grundavdrag). High earners whose taxable income exceeds the state tax threshold (~SEK 625,800) pay an additional 20% state income tax (statlig inkomstskatt).',
    },
    {
      question: 'What is Jobbskatteavdrag in Sweden?',
      answer: 'Jobbskatteavdrag is an earned income tax reduction for employed individuals that substantially lowers the effective tax rate on wage income.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'SEK',
      currencySymbol: 'kr',
      standardDeduction: 24000, // Grundavdrag baseline
      nationalBrackets: [
        { threshold: 0, upTo: 601800, rate: 0.3237, label: 'Municipal Tax (~32.37%)' },
        { threshold: 601800, rate: 0.5237, label: 'Municipal + State Tax (52.37%)' }, // 32.37% + 20%
      ],
      socialContributions: [
        {
          id: 'pension_fee',
          name: 'Public Pension Fee (Allmän pensionsavgift)',
          rate: 0.07,
          employeeRate: 0.07,
          capAmount: 614000,
          description: '7% public pension fee (fully offset by tax credit for wage earners).',
        },
      ],
      regions: [
        { code: 'stockholm', name: 'Stockholm (~29.82%)', additionalTaxRate: -0.0255 },
        { code: 'national_avg', name: 'National Average (~32.37%)', flatRate: 0 },
        { code: 'gothenburg', name: 'Göteborg (~32.60%)', additionalTaxRate: 0.0023 },
        { code: 'malmo', name: 'Malmö (~32.42%)', additionalTaxRate: 0.0005 },
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
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Swedish resident worker under 66 years old',
        'National average municipal tax rate of 32.37% applied',
        'Includes Grundavdrag and standard Jobbskatteavdrag deduction',
      ],
    },
  },
};
