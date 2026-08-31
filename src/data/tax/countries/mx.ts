import type { CountryTaxProfile } from '../types';

export const mxProfile: CountryTaxProfile = {
  id: 'mexico',
  name: 'Mexico',
  countryCode: 'MX',
  flagEmoji: '🇲🇽',
  defaultCurrency: 'MXN',
  defaultCurrencySymbol: '$',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Mexican ISR income tax (Impuesto Sobre la Renta), IMSS worker contributions, and net take-home salary (Sueldo Neto) with official 2025 SAT tables.',
  faqItems: [
    {
      question: 'How is ISR (Impuesto Sobre la Renta) calculated in Mexico?',
      answer: 'ISR is calculated using the official progressive scale from Article 96 of the Income Tax Law (LISR), with 11 marginal tax brackets ranging from 1.92% on lower earnings up to 35.00% on annual taxable income exceeding $4,000,000 MXN.',
    },
    {
      question: 'What is the employee IMSS contribution rate in Mexico?',
      answer: 'Workers contribute approximately 2.725% of their Base Quotation Salary (Salario Base de Cotización - SBC) towards the Mexican Social Security Institute (IMSS) for health, disability, and retirement insurance, capped at 25 UMAs.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'MXN',
      currencySymbol: '$',
      standardDeduction: 0,
      nationalBrackets: [
        { threshold: 0, upTo: 9000, rate: 0.0192, label: 'Límite 1 (1.92%)' },
        { threshold: 9000, upTo: 76000, rate: 0.0640, label: 'Límite 2 (6.40%)' },
        { threshold: 76000, upTo: 133000, rate: 0.1088, label: 'Límite 3 (10.88%)' },
        { threshold: 133000, upTo: 155000, rate: 0.1600, label: 'Límite 4 (16.00%)' },
        { threshold: 155000, upTo: 185000, rate: 0.1792, label: 'Límite 5 (17.92%)' },
        { threshold: 185000, upTo: 373000, rate: 0.2136, label: 'Límite 6 (21.36%)' },
        { threshold: 373000, upTo: 588000, rate: 0.2352, label: 'Límite 7 (23.52%)' },
        { threshold: 588000, upTo: 1122000, rate: 0.3000, label: 'Límite 8 (30.00%)' },
        { threshold: 1122000, upTo: 1496000, rate: 0.3200, label: 'Límite 9 (32.00%)' },
        { threshold: 1496000, upTo: 4490000, rate: 0.3400, label: 'Límite 10 (34.00%)' },
        { threshold: 4490000, rate: 0.3500, label: 'Límite 11 (35.00%)' },
      ],
      socialContributions: [
        {
          id: 'imss_obrero',
          name: 'IMSS Seguridad Social (Cuota Obrera)',
          rate: 0.02725,
          employeeRate: 0.02725,
          capAmount: 980000, // 25 UMAs annualized
          description: '2.725% worker IMSS social security contribution up to 25 UMAs.',
        },
      ],
      vatConfig: {
        name: 'IVA',
        standardRate: 0.16, // 16% standard IVA
        reducedRates: [
          { name: 'Zona Fronteriza Norte (8%)', rate: 0.08 },
          { name: 'Tasa 0% (medicinas y alimentos no preparados)', rate: 0.00 },
        ],
      },
      officialSourceName: 'Servicio de Administración Tributaria (SAT) / Secretaría de Hacienda',
      officialSourceUrl: 'https://www.sat.gob.mx',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Employee under standard Mexican labor contract (Sueldos y Salarios)',
        'Tarifa anual Art. 96 de la Ley del Impuesto Sobre la Renta (LISR) applied',
        'Standard IMSS worker quota (~2.725%) deducted',
      ],
    },
  },
};
