import type { CountryTaxProfile } from '../types';

export const nlProfile: CountryTaxProfile = {
  id: 'netherlands',
  name: 'Netherlands',
  countryCode: 'NL',
  flagEmoji: '🇳🇱',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Dutch Box 1 income tax, national insurance (volksverzekeringen), and net salary with official 2026 Belastingdienst tax brackets.',
  faqItems: [
    {
      question: 'What are the 2026 Box 1 income tax rates in the Netherlands?',
      answer: 'For 2026, Box 1 features 3 brackets for individuals under state pension age: 35.75% on income up to €38,883; 37.56% on income from €38,883 to €78,426; and 49.50% on income exceeding €78,426.',
    },
    {
      question: 'What do the Dutch Box 1 tax rates include?',
      answer: 'The first bracket rate (35.75%) is a combined rate comprising 8.10% national income tax and 27.65% national insurance (volksverzekeringen: AOW, Anw, Wlz).',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 0,
      nationalBrackets: [
        { threshold: 0, upTo: 38883, rate: 0.3575, label: 'Schijf 1 (35.75%)' },
        { threshold: 38883, upTo: 78426, rate: 0.3756, label: 'Schijf 2 (37.56%)' },
        { threshold: 78426, rate: 0.4950, label: 'Schijf 3 (49.50%)' },
      ],
      socialContributions: [
        {
          id: 'zvw_volks',
          name: 'Social Security / Healthcare (Zvw / AOW)',
          rate: 0.0545,
          employeeRate: 0.0545,
          capAmount: 78426,
          description: 'Employee contribution toward national social welfare and health insurance.',
        },
      ],
      vatConfig: {
        name: 'BTW',
        standardRate: 0.21, // 21%
        reducedRates: [{ name: 'Verlaagd tarief (food, medicines)', rate: 0.09 }],
      },
      officialSourceName: 'Belastingdienst (Dutch Tax Administration) & Rijksoverheid',
      officialSourceUrl: 'https://www.belastingdienst.nl',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single employee under state pension age (AOW-leeftijd)',
        'Full year Dutch tax resident',
        'Standard tax credits (Algemene heffingskorting and Arbeidskorting) apply as baseline credits',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 0,
      nationalBrackets: [
        { threshold: 0, upTo: 38441, rate: 0.3582, label: 'Schijf 1 (35.82%)' },
        { threshold: 38441, upTo: 76817, rate: 0.3748, label: 'Schijf 2 (37.48%)' },
        { threshold: 76817, rate: 0.4950, label: 'Schijf 3 (49.50%)' },
      ],
      socialContributions: [
        {
          id: 'zvw_volks',
          name: 'Social Security / Healthcare (Zvw / AOW)',
          rate: 0.0545,
          employeeRate: 0.0545,
          capAmount: 75860,
        },
      ],
      vatConfig: {
        name: 'BTW',
        standardRate: 0.21,
      },
      officialSourceName: 'Belastingdienst',
      officialSourceUrl: 'https://www.belastingdienst.nl',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single employee under state pension age for 2025'],
    },
  },
};
