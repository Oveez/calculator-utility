import type { CountryTaxProfile } from '../types';

export const deProfile: CountryTaxProfile = {
  id: 'germany',
  name: 'Germany',
  countryCode: 'DE',
  flagEmoji: '🇩🇪',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate German income tax (Einkommensteuer), Solidaritätszuschlag, and social security contributions (Pension, Health, Nursing, Unemployment) with 2025 BMF data.',
  faqItems: [
    {
      question: 'What is the German Grundfreibetrag in 2025?',
      answer: 'The Grundfreibetrag (basic tax-free allowance) for 2025 is €12,084 for single individuals (Tax Class 1). Income below this threshold is completely tax-free.',
    },
    {
      question: 'What are the employee social security rates (Sozialabgaben) in Germany?',
      answer: 'Employees contribute approximately 20.95% of gross income: 9.30% for statutory pension (Rentenversicherung), ~8.15% for health insurance (Krankenversicherung including average Zusatzbeitrag), 2.20% for long-term care (Pflegeversicherung), and 1.30% for unemployment insurance (Arbeitslosenversicherung).',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 12084, // Grundfreibetrag
      nationalBrackets: [
        { threshold: 0, upTo: 5200, rate: 0.14, label: 'Progression Zone 1 (14% - 24%)' }, // Starting formula approximation
        { threshold: 5200, upTo: 54676, rate: 0.28, label: 'Progression Zone 2 (24% - 42%)' },
        { threshold: 54676, upTo: 265741, rate: 0.42, label: 'Standard Top Rate (42%)' },
        { threshold: 265741, rate: 0.45, label: 'Reichensteuer (45%)' },
      ],
      socialContributions: [
        {
          id: 'pension',
          name: 'Pension Insurance (Rentenversicherung)',
          rate: 0.093,
          employeeRate: 0.093,
          capAmount: 90600, // Beitragsbemessungsgrenze West annual
          description: '9.3% employee share up to €90,600 annual income ceiling.',
        },
        {
          id: 'health',
          name: 'Health Insurance (Krankenversicherung)',
          rate: 0.0815,
          employeeRate: 0.0815,
          capAmount: 62100, // Beitragsbemessungsgrenze Krankenversicherung
          description: '7.3% base + 0.85% average additional contribution (Zusatzbeitrag).',
        },
        {
          id: 'nursing',
          name: 'Care Insurance (Pflegeversicherung)',
          rate: 0.022,
          employeeRate: 0.022,
          capAmount: 62100,
          description: '2.2% employee share (standard for parents / baseline).',
        },
        {
          id: 'unemployment',
          name: 'Unemployment (Arbeitslosenversicherung)',
          rate: 0.013,
          employeeRate: 0.013,
          capAmount: 90600,
          description: '1.3% employee share up to statutory ceiling.',
        },
      ],
      vatConfig: {
        name: 'Umsatzsteuer (MwSt.)',
        standardRate: 0.19, // 19%
        reducedRates: [{ name: 'Ermäßigter Steuersatz (food, books)', rate: 0.07 }],
      },
      officialSourceName: 'Bundesministerium der Finanzen (BMF) & BZSt',
      officialSourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Steuerklasse 1 (Single, unmarried, no children)',
        'Statutory public health insurance (Gesetzliche Krankenversicherung)',
        'Excludes church tax (Kirchensteuer 8%-9% if registered)',
        'Solidarity surcharge applied only above statutory tax threshold (€18,130 income tax)',
      ],
    },
  },
};
