import type { CountryTaxProfile } from '../types';

export const nlProfile: CountryTaxProfile = {
  id: 'netherlands',
  name: 'Netherlands',
  countryCode: 'NL',
  flagEmoji: '🇳🇱',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Dutch Box 1 income tax, national insurance (volksverzekeringen), and net salary with official 2025 Belastingdienst tax brackets.',
  faqItems: [
    {
      question: 'What are the 2025 Box 1 income tax rates in the Netherlands?',
      answer: 'For 2025, Box 1 features 3 brackets: 35.82% on income up to €38,441; 37.48% on income from €38,441 to €76,817; and 49.50% on income exceeding €76,817.',
    },
    {
      question: 'What are the general tax credits (heffingskortingen) in the Netherlands?',
      answer: 'Dutch wage earners benefit from the Algemene heffingskorting (general tax credit) and Arbeidskorting (labour tax credit), which are directly deducted from the calculated tax amount.',
    },
  ],
  years: {
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
          description: 'Employee contribution toward national social welfare and health insurance.',
        },
      ],
      vatConfig: {
        name: 'BTW',
        standardRate: 0.21, // 21%
        reducedRates: [{ name: 'Verlaagd tarief (food, medicines)', rate: 0.09 }],
      },
      officialSourceName: 'Belastingdienst (Dutch Tax Administration)',
      officialSourceUrl: 'https://www.belastingdienst.nl',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single employee under state pension age (AOW-leeftijd)',
        'Full year Dutch tax resident',
        'Standard tax credits (Algemene heffingskorting and Arbeidskorting) apply as baseline credits',
      ],
    },
  },
};
