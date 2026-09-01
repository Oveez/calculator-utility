import type { CalculatorConfig, BreadcrumbItem } from '../types/calculator';
import { withBasePath } from './site';

export interface CategoryMeta {
  name: string;
  icon: 'finance' | 'converter' | 'math' | 'education' | 'health' | 'calendar' | 'text';
  description: string;
}

export const CATEGORY_METAS: Record<string, { icon: 'finance' | 'converter' | 'math' | 'education' | 'health' | 'calendar' | 'text'; description: string }> = {
  Finance: { icon: 'finance', description: 'Loans, compound interest, mortgages, salary, and financial planning.' },
  Converters: { icon: 'converter', description: 'Real-time currency rates, length, mass, temperature, and digital storage.' },
  Math: { icon: 'math', description: 'Percentages, percentage differences, ratios, fractions, and averages.' },
  Education: { icon: 'education', description: 'GPA, CGPA, grade weighting, and academic achievement calculators.' },
  Health: { icon: 'health', description: 'Body mass index (BMI), calorie burn, and daily hydration requirements.' },
  'Date & Time': { icon: 'calendar', description: 'Age computation, date spans, countdown timers, and working business days.' },
  'Text Tools': { icon: 'text', description: 'Word counts, character measurements, and text casing transformations.' },
};

export const CATEGORY_ORDER = [
  'Finance',
  'Converters',
  'Math',
  'Education',
  'Health',
  'Date & Time',
  'Text Tools',
];

export function getCalculatorPath(slug: string): string {
  return withBasePath(`/calculators/${slug}/`);
}

export function getCalculatorBreadcrumbs(calculator: CalculatorConfig): BreadcrumbItem[] {
  return [
    { label: 'Home', href: withBasePath('/') },
    { label: 'Calculators', href: withBasePath('/#calculators') },
    { label: calculator.title },
  ];
}

export function getUniqueCategories(calculators: readonly CalculatorConfig[]): string[] {
  const existingCategories = new Set(calculators.map((calculator) => calculator.category));
  const ordered = CATEGORY_ORDER.filter((cat) => existingCategories.has(cat));
  const others = Array.from(existingCategories).filter((cat) => !CATEGORY_ORDER.includes(cat)).sort();
  return [...ordered, ...others];
}
