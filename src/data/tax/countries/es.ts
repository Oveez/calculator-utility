import type { CountryTaxProfile } from '../types';

export const esProfile: CountryTaxProfile = {
  id: 'spain',
  name: 'Spain',
  countryCode: 'ES',
  flagEmoji: '🇪🇸',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Autonomous Community',
  metaDescription: 'Calculate Spanish IRPF income tax, Seguridad Social employee contributions, and net take-home salary with official Agencia Tributaria rates.',
  faqItems: [
    {
      question: 'How is IRPF calculated in Spain?',
      answer: 'IRPF consists of a state portion (gravamen estatal) and an autonomous community portion (gravamen autonómico). Rates range from 19% on income up to €12,450 to 47% on income over €300,000.',
    },
    {
      question: 'What is the Spanish Mínimo Personal?',
      answer: 'The general personal and family minimum (Mínimo personal y familiar) is €5,550 for individual taxpayers under 65, which is taxed at 0% effectively through the tax credit calculation.',
    },
    {
      question: 'What percentage do employees pay for Social Security in Spain?',
      answer: 'Employees pay 6.47% to 6.50% of their gross monthly salary (up to the maximum monthly contribution base of €4,720.50), covering common contingencies (4.70%), unemployment (1.55%), professional training (0.10%), and the Intergenerational Equity Mechanism MEI (0.12%).',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 5550, // Mínimo personal general
      nationalBrackets: [
        { threshold: 0, upTo: 6900, rate: 0.19, label: 'Tramo 1 (19%)' }, // €5,550 to €12,450
        { threshold: 6900, upTo: 14650, rate: 0.24, label: 'Tramo 2 (24%)' }, // €12,450 to €20,200
        { threshold: 14650, upTo: 29650, rate: 0.30, label: 'Tramo 3 (30%)' }, // €20,200 to €35,200
        { threshold: 29650, upTo: 54450, rate: 0.37, label: 'Tramo 4 (37%)' }, // €35,200 to €60,000
        { threshold: 54450, upTo: 294450, rate: 0.45, label: 'Tramo 5 (45%)' }, // €60,000 to €300,000
        { threshold: 294450, rate: 0.47, label: 'Tramo 6 (47%)' }, // Over €300,000
      ],
      socialContributions: [
        {
          id: 'seguridad_social',
          name: 'Seguridad Social (Trabajador)',
          rate: 0.0647,
          employeeRate: 0.0647,
          capAmount: 56646, // Base máxima anual (€4,720.50 * 12)
          description: 'Contingencias comunes (4.70%) + Desempleo (1.55%) + Formación (0.10%) + MEI (0.12%).',
        },
      ],
      regions: [
        { code: 'general', name: 'General State/Regional Baseline', flatRate: 0 },
        { code: 'madrid', name: 'Comunidad de Madrid (Lower regional scale)', additionalTaxRate: -0.015 },
        { code: 'catalonia', name: 'Cataluña (Slightly higher top scale)', additionalTaxRate: 0.015 },
        { code: 'andalucia', name: 'Andalucía', flatRate: 0 },
        { code: 'valencia', name: 'Comunidad Valenciana', additionalTaxRate: 0.01 },
      ],
      vatConfig: {
        name: 'IVA',
        standardRate: 0.21, // 21%
        reducedRates: [
          { name: 'Reducido (10%)', rate: 0.10 },
          { name: 'Superreducido (4%)', rate: 0.04 },
        ],
      },
      officialSourceName: 'Agencia Estatal de Administración Tributaria (AEAT)',
      officialSourceUrl: 'https://sede.agenciatributaria.gob.es',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single individual under 65 years with no dependent children',
        'Standard employee contract (Régimen General de la Seguridad Social)',
        'Mínimo personal general applied (€5,550)',
      ],
    },
  },
};
