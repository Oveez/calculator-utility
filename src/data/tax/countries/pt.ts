import type { CountryTaxProfile } from '../types';

export const ptProfile: CountryTaxProfile = {
  id: 'portugal',
  name: 'Portugal',
  countryCode: 'PT',
  flagEmoji: '🇵🇹',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Portuguese IRS income tax, Segurança Social worker contributions (11%), and net take-home salary with official 2026 Autoridade Tributária 9-tier rates.',
  faqItems: [
    {
      question: 'What are the 2026 IRS tax brackets in Portugal?',
      answer: 'Portugal features 9 IRS brackets starting at 12.50% on taxable income up to €8,342, up to 48.00% on taxable income over €86,634.',
    },
    {
      question: 'What is the standard deduction for employees in Portugal for 2026?',
      answer: 'The standard specific deduction (Dedução específica) for employment income is €4,462.15 (or the total mandatory social security contributions if higher).',
    },
    {
      question: 'What is the employee Social Security rate in Portugal?',
      answer: 'Employees pay a statutory 11% Social Security (Taxa Social Única - TSU) contribution on their gross monthly salary with no cap.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 4462.15, // Dedução específica 2026
      nationalBrackets: [
        { threshold: 0, upTo: 8342, rate: 0.125, label: '1º Escalão (12.50%)' },
        { threshold: 8342, upTo: 12587, rate: 0.157, label: '2º Escalão (15.70%)' },
        { threshold: 12587, upTo: 17838, rate: 0.212, label: '3º Escalão (21.20%)' },
        { threshold: 17838, upTo: 23089, rate: 0.241, label: '4º Escalão (24.10%)' },
        { threshold: 23089, upTo: 29397, rate: 0.311, label: '5º Escalão (31.10%)' },
        { threshold: 29397, upTo: 43090, rate: 0.349, label: '6º Escalão (34.90%)' },
        { threshold: 43090, upTo: 46566, rate: 0.431, label: '7º Escalão (43.10%)' },
        { threshold: 46566, upTo: 86634, rate: 0.446, label: '8º Escalão (44.60%)' },
        { threshold: 86634, rate: 0.480, label: '9º Escalão (48.00%)' },
      ],
      socialContributions: [
        {
          id: 'seguranca_social',
          name: 'Segurança Social (Trabalhador)',
          rate: 0.11,
          employeeRate: 0.11,
          description: '11.0% flat worker social security contribution on gross earnings.',
        },
      ],
      vatConfig: {
        name: 'IVA',
        standardRate: 0.23, // 23% (Continent)
        reducedRates: [
          { name: 'Taxa intermédia (restauração)', rate: 0.13 },
          { name: 'Taxa reduzida (bens essenciais)', rate: 0.06 },
        ],
      },
      officialSourceName: 'Autoridade Tributária e Aduaneira (AT) - Portal das Finanças',
      officialSourceUrl: 'https://www.portaldasfinancas.gov.pt',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single taxpayer with no dependents (Trabalho dependente / Categoria A)',
        'Dedução específica of €4,462.15 applied',
        'Standard 11% social security contribution',
        'Mainland Portugal (Continente) rates applied',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 4104,
      nationalBrackets: [
        { threshold: 0, upTo: 7703, rate: 0.13, label: '1º Escalão (13.00%)' },
        { threshold: 7703, upTo: 11623, rate: 0.165, label: '2º Escalão (16.50%)' },
        { threshold: 11623, upTo: 16472, rate: 0.22, label: '3º Escalão (22.00%)' },
        { threshold: 16472, upTo: 21321, rate: 0.25, label: '4º Escalão (25.00%)' },
        { threshold: 21321, upTo: 27146, rate: 0.32, label: '5º Escalão (32.00%)' },
        { threshold: 27146, upTo: 39791, rate: 0.355, label: '6º Escalão (35.50%)' },
        { threshold: 39791, upTo: 51997, rate: 0.435, label: '7º Escalão (43.50%)' },
        { threshold: 51997, upTo: 81199, rate: 0.45, label: '8º Escalão (45.00%)' },
        { threshold: 81199, rate: 0.48, label: '9º Escalão (48.00%)' },
      ],
      socialContributions: [
        {
          id: 'seguranca_social',
          name: 'Segurança Social (Trabalhador)',
          rate: 0.11,
          employeeRate: 0.11,
        },
      ],
      vatConfig: {
        name: 'IVA',
        standardRate: 0.23,
      },
      officialSourceName: 'Autoridade Tributária e Aduaneira (AT)',
      officialSourceUrl: 'https://www.portaldasfinancas.gov.pt',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single taxpayer for 2025 tax year'],
    },
  },
};
