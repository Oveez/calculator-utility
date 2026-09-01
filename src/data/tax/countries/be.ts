import type { CountryTaxProfile } from '../types';

export const beProfile: CountryTaxProfile = {
  id: 'belgium',
  name: 'Belgium',
  countryCode: 'BE',
  flagEmoji: '🇧🇪',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Belgian income tax (IPP / Personenbelasting), ONSS/RSZ social security (13.07%), and take-home pay with official 2026 SPF Finances data (€11,180 quotité exemptée).',
  faqItems: [
    {
      question: 'What are the 2026 tax brackets in Belgium?',
      answer: 'Belgium uses 4 progressive federal brackets for 2026: 25% up to €16,720; 40% from €16,720 to €29,510; 45% from €29,510 to €51,070; and 50% on income over €51,070.',
    },
    {
      question: 'What is the basic tax-free allowance (Quotité exemptée) in Belgium for 2026?',
      answer: 'The base tax-free amount for 2026 is €11,180 (indexed from €10,910 for 2025).',
    },
    {
      question: 'What is the ONSS / RSZ social security rate for Belgian employees?',
      answer: 'Employees pay a mandatory 13.07% social security contribution on 100% of their gross earnings with no cap.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 11180, // Quotité exemptée d'impôt de base 2026
      nationalBrackets: [
        { threshold: 0, upTo: 5540, rate: 0.25, label: 'Tranche 25%' }, // €11,180 to €16,720
        { threshold: 5540, upTo: 18330, rate: 0.40, label: 'Tranche 40%' }, // €16,720 to €29,510
        { threshold: 18330, upTo: 39890, rate: 0.45, label: 'Tranche 45%' }, // €29,510 to €51,070
        { threshold: 39890, rate: 0.50, label: 'Tranche 50%' }, // Over €51,070
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
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single employee without dependents',
        'Basic tax-free allowance (€11,180) applied',
        'Standard 13.07% ONSS contribution deducted prior to income tax',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 10570,
      nationalBrackets: [
        { threshold: 0, upTo: 5250, rate: 0.25, label: 'Tranche 25%' },
        { threshold: 5250, upTo: 17350, rate: 0.40, label: 'Tranche 40%' },
        { threshold: 17350, upTo: 37750, rate: 0.45, label: 'Tranche 45%' },
        { threshold: 37750, rate: 0.50, label: 'Tranche 50%' },
      ],
      socialContributions: [
        {
          id: 'onss',
          name: 'ONSS / RSZ Social Security',
          rate: 0.1307,
          employeeRate: 0.1307,
        },
      ],
      vatConfig: {
        name: 'TVA / BTW',
        standardRate: 0.21,
      },
      officialSourceName: 'SPF Finances / FOD Financiën',
      officialSourceUrl: 'https://finances.belgium.be',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single employee for 2025 tax year'],
    },
  },
};
