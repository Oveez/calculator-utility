import type { CountryTaxProfile } from '../types';

export const beProfile: CountryTaxProfile = {
  id: 'belgium',
  name: 'Belgium',
  countryCode: 'BE',
  flagEmoji: '🇧🇪',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Belgian income tax (IPP / Personenbelasting), ONSS/RSZ social security (13.07%), and take-home pay with official 2025 SPF Finances data.',
  faqItems: [
    {
      question: 'What are the 2025 tax brackets in Belgium?',
      answer: 'Belgium uses 4 progressive federal brackets: 25% up to €15,820; 40% from €15,820 to €27,920; 45% from €27,920 to €48,320; and 50% on income over €48,320.',
    },
    {
      question: 'What is the ONSS / RSZ social security rate for Belgian employees?',
      answer: 'Employees pay a mandatory 13.07% social security contribution on 100% of their gross earnings with no cap.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 10570, // Quotité exemptée d'impôt de base
      nationalBrackets: [
        { threshold: 0, upTo: 5250, rate: 0.25, label: 'Tranche 25%' }, // €10,570 to €15,820
        { threshold: 5250, upTo: 17350, rate: 0.40, label: 'Tranche 40%' }, // €15,820 to €27,920
        { threshold: 17350, upTo: 37750, rate: 0.45, label: 'Tranche 45%' }, // €27,920 to €48,320
        { threshold: 37750, rate: 0.50, label: 'Tranche 50%' }, // Over €48,320
      ],
      socialContributions: [
        {
          id: 'onss',
          name: 'ONSS / RSZ Social Security',
          rate: 0.1307,
          employeeRate: 0.1307,
          description: '13.07% mandatory employee contribution on gross salary.',
        },
      ],
      vatConfig: {
        name: 'TVA / BTW',
        standardRate: 0.21, // 21%
        reducedRates: [
          { name: 'Taux réduit (12%)', rate: 0.12 },
          { name: 'Taux réduit (6% - alimentation, livres)', rate: 0.06 },
        ],
      },
      officialSourceName: 'SPF Finances / FOD Financiën (Belgium Federal Public Service)',
      officialSourceUrl: 'https://finances.belgium.be',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single employee without dependents',
        'Basic tax-free allowance (€10,570) applied',
        'Standard 13.07% ONSS contribution deducted prior to income tax',
      ],
    },
  },
};
