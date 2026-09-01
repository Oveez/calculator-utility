import type { CountryTaxProfile } from '../types';

export const deProfile: CountryTaxProfile = {
  id: 'germany',
  name: 'Germany',
  countryCode: 'DE',
  flagEmoji: '🇩🇪',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate German income tax (Einkommensteuer), Solidaritätszuschlag, and social security contributions with official 2026 BMF data (€12,348 Grundfreibetrag).',
  faqItems: [
    {
      question: 'What is the German Grundfreibetrag in 2026?',
      answer: 'The Grundfreibetrag (basic tax-free allowance) for 2026 is €12,348 for single individuals (Tax Class 1). Income below this threshold is completely tax-free.',
    },
    {
      question: 'What are the employee social security contribution limits in Germany for 2026?',
      answer: 'The annual Beitragsbemessungsgrenze for statutory pension and unemployment insurance is €101,400 (€8,450/month), and for statutory health and nursing care insurance it is €69,750 (€5,812.50/month).',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 12348, // Grundfreibetrag 2026
      nationalBrackets: [
        { threshold: 0, upTo: 5300, rate: 0.14, label: 'Progression Zone 1 (14% - 24%)' },
        { threshold: 5300, upTo: 55800, rate: 0.28, label: 'Progression Zone 2 (24% - 42%)' },
        { threshold: 55800, upTo: 277825, rate: 0.42, label: 'Standard Top Rate (42%)' },
        { threshold: 277825, rate: 0.45, label: 'Reichensteuer (45%)' },
      ],
      socialContributions: [
        {
          id: 'pension',
          name: 'Pension Insurance (Rentenversicherung)',
          rate: 0.093,
          employeeRate: 0.093,
          capAmount: 101400, // BBG Rentenversicherung 2026
          description: '9.3% employee share up to €101,400 annual income ceiling.',
        },
        {
          id: 'health',
          name: 'Health Insurance (Krankenversicherung)',
          rate: 0.0815,
          employeeRate: 0.0815,
          capAmount: 69750, // BBG Krankenversicherung 2026
          description: '7.3% base + 0.85% average additional contribution (Zusatzbeitrag).',
        },
        {
          id: 'nursing',
          name: 'Care Insurance (Pflegeversicherung)',
          rate: 0.022,
          employeeRate: 0.022,
          capAmount: 69750,
          description: '2.2% employee share (standard baseline for parents).',
        },
        {
          id: 'unemployment',
          name: 'Unemployment (Arbeitslosenversicherung)',
          rate: 0.013,
          employeeRate: 0.013,
          capAmount: 101400,
          description: '1.3% employee share up to statutory ceiling.',
        },
      ],
      vatConfig: {
        name: 'Umsatzsteuer (MwSt.)',
        standardRate: 0.19, // 19%
        reducedRates: [{ name: 'Ermäßigter Steuersatz (food, books)', rate: 0.07 }],
      },
      officialSourceName: 'Bundesministerium der Finanzen (BMF) & Bundesregierung',
      officialSourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Steuerklasse 1 (Single, unmarried, no children)',
        'Statutory public health insurance (Gesetzliche Krankenversicherung)',
        'Grundfreibetrag of €12,348 applied',
        'Excludes church tax (Kirchensteuer 8%-9% if registered)',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 12084,
      nationalBrackets: [
        { threshold: 0, upTo: 5200, rate: 0.14, label: 'Progression Zone 1 (14% - 24%)' },
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
          capAmount: 90600,
        },
        {
          id: 'health',
          name: 'Health Insurance (Krankenversicherung)',
          rate: 0.0815,
          employeeRate: 0.0815,
          capAmount: 62100,
        },
        {
          id: 'nursing',
          name: 'Care Insurance (Pflegeversicherung)',
          rate: 0.022,
          employeeRate: 0.022,
          capAmount: 62100,
        },
        {
          id: 'unemployment',
          name: 'Unemployment (Arbeitslosenversicherung)',
          rate: 0.013,
          employeeRate: 0.013,
          capAmount: 90600,
        },
      ],
      vatConfig: {
        name: 'Umsatzsteuer (MwSt.)',
        standardRate: 0.19,
      },
      officialSourceName: 'Bundesministerium der Finanzen (BMF)',
      officialSourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Steuerklasse 1 for tax year 2025'],
    },
  },
};
