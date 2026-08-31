import type { CalculatorConfig, BreadcrumbItem } from '../types/calculator';
import { withBasePath } from './site';

export interface CategoryMeta {
  name: string;
  emoji: string;
  description: string;
}

export const CATEGORY_METAS: Record<string, { emoji: string; description: string }> = {
  Finance: { emoji: '💰', description: 'Loans, compound interest, mortgages, salary, and financial planning.' },
  Converters: { emoji: '🔄', description: 'Real-time currency rates, length, mass, temperature, and digital storage.' },
  Math: { emoji: '📐', description: 'Percentages, percentage differences, ratios, fractions, and averages.' },
  Education: { emoji: '🎓', description: 'GPA, CGPA, grade weighting, and academic achievement calculators.' },
  Health: { emoji: '🩺', description: 'Body mass index (BMI), calorie burn, and daily hydration requirements.' },
  'Date & Time': { emoji: '📅', description: 'Age computation, date spans, countdown timers, and working business days.' },
  'Text Tools': { emoji: '✍️', description: 'Word counts, character measurements, and text casing transformations.' },
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
