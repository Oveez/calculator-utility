import type { CountryTaxProfile } from '../types';

export const ptProfile: CountryTaxProfile = {
  id: 'portugal',
  name: 'Portugal',
  countryCode: 'PT',
  flagEmoji: '🇵🇹',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Portuguese IRS income tax, Segurança Social worker contributions (11%), and net take-home salary with official 2025 Autoridade Tributária rates.',
  faqItems: [
    {
      question: 'What are the 2025 IRS tax brackets in Portugal?',
      answer: 'Portugal features 9 IRS brackets starting at 13.00% on taxable income up to €7,703, up to 48.00% on taxable income over €81,199.',
    },
    {
      question: 'What is the standard deduction for employees in Portugal?',
      answer: 'The standard specific deduction (Dedução específica) for employment income is €4,104 (or the total mandatory social security contributions if higher).',
    },
    {
      question: 'What is the employee Social Security rate in Portugal?',
      answer: 'Employees pay a statutory 11% Social Security (Taxa Social Única - TSU) contribution on their gross monthly salary with no cap.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 4104, // Dedução específica
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
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single taxpayer with no dependents (Trabalho dependente / Categoria A)',
        'Dedução específica of €4,104 applied',
        'Standard 11% social security contribution',
        'Mainland Portugal (Continente) rates applied',
      ],
    },
  },
};
