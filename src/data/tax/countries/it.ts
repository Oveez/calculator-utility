import type { CountryTaxProfile } from '../types';

export const itProfile: CountryTaxProfile = {
  id: 'italy',
  name: 'Italy',
  countryCode: 'IT',
  flagEmoji: '🇮🇹',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Region / Municipality',
  metaDescription: 'Calculate Italian IRPEF income tax, INPS employee social contributions, and net monthly salary (Stipendio Netto) with official 2026 Agenzia delle Entrate rates (33% second bracket).',
  faqItems: [
    {
      question: 'What are the 2026 IRPEF tax brackets in Italy?',
      answer: 'Under the 2026 tax structure, Italy uses 3 IRPEF brackets: Up to €28,000 at 23%; from €28,001 to €50,000 at 33% (reduced from 35%); and over €50,000 at 43%.',
    },
    {
      question: 'What is the no-tax area for employees in Italy?',
      answer: 'The no-tax area for employees is €8,500, realized through the progressive employment tax credit (detrazione da lavoro dipendente).',
    },
    {
      question: 'What is the INPS contribution rate for Italian employees?',
      answer: 'Standard private sector employees contribute 9.19% of their gross earnings to INPS for statutory pension and social welfare.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 8500, // No-tax area (Detrazioni lavoro dipendente)
      nationalBrackets: [
        { threshold: 0, upTo: 19500, rate: 0.23, label: 'Scaglione 23%' }, // €8,500 to €28,000
        { threshold: 19500, upTo: 41500, rate: 0.33, label: 'Scaglione 33%' }, // €28,001 to €50,000 (reduced to 33%)
        { threshold: 41500, rate: 0.43, label: 'Scaglione 43%' }, // Over €50,000
      ],
      socialContributions: [
        {
          id: 'inps',
          name: 'INPS Contributi Previdenziali',
          rate: 0.0919,
          employeeRate: 0.0919,
          description: '9.19% statutory worker social security contribution.',
        },
      ],
      regions: [
        { code: 'national_avg', name: 'National Average Regional Surcharge (~1.73%)', additionalTaxRate: 0.0173 },
        { code: 'lombardy', name: 'Lombardia', additionalTaxRate: 0.0123 },
        { code: 'lazio', name: 'Lazio', additionalTaxRate: 0.0333 },
        { code: 'veneto', name: 'Veneto', additionalTaxRate: 0.0123 },
        { code: 'piedmont', name: 'Piemonte', additionalTaxRate: 0.0203 },
      ],
      vatConfig: {
        name: 'IVA',
        standardRate: 0.22, // 22%
        reducedRates: [
          { name: 'Ridotta (10%)', rate: 0.10 },
          { name: 'Minima (4%)', rate: 0.04 },
          { name: 'Speciale (5%)', rate: 0.05 },
        ],
      },
      officialSourceName: 'Agenzia delle Entrate & Ministero dell’Economia e delle Finanze',
      officialSourceUrl: 'https://www.agenziaentrate.gov.it',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single employee without dependents (Lavoratore dipendente a tempo indeterminato)',
        'Standard INPS rate (9.19%) applied',
        'Official 2026 IRPEF rates (23%, 33%, 43%) applied',
        'Standard employee tax credit (Detrazione lavoro dipendente) integrated in base allowance',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 8500,
      nationalBrackets: [
        { threshold: 0, upTo: 19500, rate: 0.23, label: 'Scaglione 23%' },
        { threshold: 19500, upTo: 41500, rate: 0.35, label: 'Scaglione 35%' },
        { threshold: 41500, rate: 0.43, label: 'Scaglione 43%' },
      ],
      socialContributions: [
        {
          id: 'inps',
          name: 'INPS Contributi Previdenziali',
          rate: 0.0919,
          employeeRate: 0.0919,
        },
      ],
      regions: [
        { code: 'national_avg', name: 'National Average Regional Surcharge (~1.73%)', additionalTaxRate: 0.0173 },
      ],
      vatConfig: {
        name: 'IVA',
        standardRate: 0.22,
      },
      officialSourceName: 'Agenzia delle Entrate',
      officialSourceUrl: 'https://www.agenziaentrate.gov.it',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single employee for 2025 tax year'],
    },
  },
};
