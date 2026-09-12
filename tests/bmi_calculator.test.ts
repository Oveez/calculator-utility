import assert from 'node:assert/strict';
import { calculators } from '../src/data/calculators';

function getCalc(slug: string) {
  const calc = calculators.find((c) => c.slug === slug);
  if (!calc) throw new Error(`Calculator not found: ${slug}`);
  return calc;
}

console.log('=== RUNNING BMI CALCULATOR TEST SUITE ===\n');

const calc = getCalc('bmi-calculator');

// ==========================================
// 1. US CUSTOMARY SYSTEM TESTS
// ==========================================
console.log('1. Testing US Customary Units...');
{
  // Standard Adult Normal: 5'10" (70 in), 160 lbs
  // Math: 703 * 160 / (70^2) = 112,480 / 4900 = 22.955 kg/m^2 -> rounds to 23.0
  const res = calc.formula({
    unitSystem: 'us',
    heightFeet: 5,
    heightInches: 10,
    weightLbs: 160,
  }) as any;

  assert.equal(Number(res.primary.value.toFixed(2)), 22.96);
  assert.equal(res.primary.formattedValue, '23.0 kg/m²');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Normal weight');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.badge, 'Healthy');
  assert.match(res.secondary.find((s: any) => s.id === 'healthyRange')?.value, /128\.9 – 173\.6 lbs/);
  assert.equal(res.secondary.find((s: any) => s.id === 'weightDiff')?.value, 'Within recommended healthy weight range');
  assert.equal(res.secondary.find((s: any) => s.id === 'weightDiff')?.badge, 'On Target');
  console.log('  ✔ US Normal Weight test passed (5\'10", 160 lbs -> 23.0 kg/m²)');
}

{
  // US Underweight (Moderate Thinness): 5'6" (66 in), 100 lbs
  // Math: 703 * 100 / (66^2) = 70,300 / 4356 = 16.138 kg/m^2 -> 16.1
  const res = calc.formula({
    unitSystem: 'us',
    heightFeet: 5,
    heightInches: 6,
    weightLbs: 100,
  }) as any;

  assert.equal(Number(res.primary.value.toFixed(2)), 16.14);
  assert.equal(res.primary.formattedValue, '16.1 kg/m²');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Moderate Thinness');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.badge, 'Underweight');
  assert.match(res.secondary.find((s: any) => s.id === 'weightDiff')?.value, /below healthy minimum/);
  console.log('  ✔ US Underweight test passed (5\'6", 100 lbs -> 16.1 kg/m²)');
}

{
  // US Overweight: 5'8" (68 in), 190 lbs
  // Math: 703 * 190 / (68^2) = 133,570 / 4624 = 28.886 kg/m^2 -> 28.9
  const res = calc.formula({
    unitSystem: 'us',
    heightFeet: 5,
    heightInches: 8,
    weightLbs: 190,
  }) as any;

  assert.equal(Number(res.primary.value.toFixed(2)), 28.89);
  assert.equal(res.primary.formattedValue, '28.9 kg/m²');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Overweight (Pre-obesity)');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.badge, 'Overweight');
  assert.match(res.secondary.find((s: any) => s.id === 'weightDiff')?.value, /above healthy maximum/);
  console.log('  ✔ US Overweight test passed (5\'8", 190 lbs -> 28.9 kg/m²)');
}

{
  // US Obese Class I: 5'10" (70 in), 220 lbs
  // Math: 703 * 220 / 4900 = 31.563 kg/m^2
  const res = calc.formula({
    unitSystem: 'us',
    heightFeet: 5,
    heightInches: 10,
    weightLbs: 220,
  }) as any;

  assert.equal(Number(res.primary.value.toFixed(2)), 31.57);
  assert.equal(res.primary.formattedValue, '31.6 kg/m²');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Obese Class I (Moderate)');
  console.log('  ✔ US Obese Class I test passed (5\'10", 220 lbs -> 31.6 kg/m²)');
}

// ==========================================
// 2. METRIC SYSTEM TESTS
// ==========================================
console.log('\n2. Testing Metric Units...');
{
  // Metric Normal: 175 cm, 70 kg
  // Math: 70 / (1.75^2) = 70 / 3.0625 = 22.857 kg/m^2 -> 22.9
  const res = calc.formula({
    unitSystem: 'metric',
    heightCm: 175,
    weightKg: 70,
  }) as any;

  assert.equal(Number(res.primary.value.toFixed(2)), 22.86);
  assert.equal(res.primary.formattedValue, '22.9 kg/m²');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Normal weight');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.badge, 'Healthy');
  assert.match(res.secondary.find((s: any) => s.id === 'healthyRange')?.value, /56\.7 – 76\.3 kg/);
  assert.equal(res.secondary.find((s: any) => s.id === 'weightDiff')?.value, 'Within recommended healthy weight range');
  console.log('  ✔ Metric Normal Weight test passed (175 cm, 70 kg -> 22.9 kg/m²)');
}

{
  // Metric Calculator.net Benchmark 1: 180 cm, 65 kg
  // Math: 65 / (1.80^2) = 65 / 3.24 = 20.0617 kg/m^2 -> 20.1
  const res = calc.formula({
    unitSystem: 'metric',
    heightCm: 180,
    weightKg: 65,
  }) as any;

  assert.equal(Number(res.primary.value.toFixed(1)), 20.1);
  assert.equal(res.primary.formattedValue, '20.1 kg/m²');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Normal weight');
  console.log('  ✔ Calculator.net Metric Benchmark 1 passed (180 cm, 65 kg -> 20.1 kg/m²)');
}

{
  // Metric Calculator.net Benchmark 2: 170 cm, 80 kg
  // Math: 80 / (1.70^2) = 80 / 2.89 = 27.6816 kg/m^2 -> 27.7
  const res = calc.formula({
    unitSystem: 'metric',
    heightCm: 170,
    weightKg: 80,
  }) as any;

  assert.equal(Number(res.primary.value.toFixed(1)), 27.7);
  assert.equal(res.primary.formattedValue, '27.7 kg/m²');
  assert.equal(res.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Overweight (Pre-obesity)');
  console.log('  ✔ Calculator.net Metric Benchmark 2 passed (170 cm, 80 kg -> 27.7 kg/m²)');
}

// ==========================================
// 3. WHO CLINICAL CATEGORY BOUNDARIES
// ==========================================
console.log('\n3. Testing WHO Clinical Thresholds...');
{
  // Severe Thinness: < 16.0
  const res1 = calc.formula({ unitSystem: 'metric', heightCm: 100, weightKg: 15.9 }) as any;
  assert.equal(res1.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Severe Thinness');

  // Moderate Thinness: 16.0 to 16.99
  const res2 = calc.formula({ unitSystem: 'metric', heightCm: 100, weightKg: 16.5 }) as any;
  assert.equal(res2.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Moderate Thinness');

  // Mild Thinness: 17.0 to 18.49
  const res3 = calc.formula({ unitSystem: 'metric', heightCm: 100, weightKg: 18.0 }) as any;
  assert.equal(res3.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Mild Thinness (Underweight)');

  // Normal Weight exact boundary: 18.5
  const res4 = calc.formula({ unitSystem: 'metric', heightCm: 100, weightKg: 18.5 }) as any;
  assert.equal(res4.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Normal weight');

  // Normal Weight upper boundary: 24.9
  const res5 = calc.formula({ unitSystem: 'metric', heightCm: 100, weightKg: 24.9 }) as any;
  assert.equal(res5.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Normal weight');

  // Overweight exact boundary: 25.0
  const res6 = calc.formula({ unitSystem: 'metric', heightCm: 100, weightKg: 25.0 }) as any;
  assert.equal(res6.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Overweight (Pre-obesity)');

  // Obese Class I exact boundary: 30.0
  const res7 = calc.formula({ unitSystem: 'metric', heightCm: 100, weightKg: 30.0 }) as any;
  assert.equal(res7.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Obese Class I (Moderate)');

  // Obese Class II exact boundary: 35.0
  const res8 = calc.formula({ unitSystem: 'metric', heightCm: 100, weightKg: 35.0 }) as any;
  assert.equal(res8.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Obese Class II (Severe)');

  // Obese Class III exact boundary: 40.0
  const res9 = calc.formula({ unitSystem: 'metric', heightCm: 100, weightKg: 40.0 }) as any;
  assert.equal(res9.secondary.find((s: any) => s.id === 'bmiCategory')?.value, 'Obese Class III (Very Severe / Morbid)');

  console.log('  ✔ All 9 WHO category boundary checks passed');
}

// ==========================================
// 4. INVALID AND BOUNDARY INPUT HANDLING
// ==========================================
console.log('\n4. Testing Edge Cases & Invalid Inputs...');
{
  // Zero values (US)
  const resZeroUs = calc.formula({ unitSystem: 'us', heightFeet: 0, heightInches: 0, weightLbs: 0 }) as any;
  assert.equal(resZeroUs.primary.value, 0);
  assert.equal(resZeroUs.primary.formattedValue, 'Enter Height & Weight');

  // Zero values (Metric)
  const resZeroMetric = calc.formula({ unitSystem: 'metric', heightCm: 0, weightKg: 0 }) as any;
  assert.equal(resZeroMetric.primary.value, 0);
  assert.equal(resZeroMetric.primary.formattedValue, 'Enter Height & Weight');

  // Negative values
  const resNeg = calc.formula({ unitSystem: 'metric', heightCm: -170, weightKg: 70 }) as any;
  assert.equal(resNeg.primary.value, 0);
  assert.equal(resNeg.primary.formattedValue, 'Enter Height & Weight');

  console.log('  ✔ Edge cases and invalid input guards passed');
}

// ==========================================
// 5. STRUCTURE, CONTENT & GUIDE VERIFICATION
// ==========================================
console.log('\n5. Testing Metadata, FAQ, & Content Structure...');
{
  assert.ok(calc.inputs.length >= 6, 'Should have at least 6 input parameters');
  assert.ok(calc.inputs.some((i) => i.id === 'unitSystem'), 'Must include unitSystem selector');
  assert.ok(calc.inputs.some((i) => i.id === 'heightFeet'), 'Must include heightFeet');
  assert.ok(calc.inputs.some((i) => i.id === 'heightCm'), 'Must include heightCm');

  assert.ok(calc.faq && calc.faq.length >= 5, 'Must provide comprehensive FAQs');
  assert.ok(calc.faq.some((f) => f.question.includes('healthy weight matter')), 'Must explain why healthy weight matters');
  assert.ok(calc.faq.some((f) => f.question.includes('health tips')), 'Must provide evidence-based health tips');
  assert.ok(calc.faq.some((f) => f.question.includes('limitations')), 'Must address BMI limitations');

  assert.ok(calc.parametersGuide && calc.parametersGuide.length >= 6, 'Must provide comprehensive parameter guidance');
  console.log('  ✔ Metadata, FAQ, and Educational Content verified');
}

console.log('\n=== ALL BMI CALCULATOR TESTS PASSED SUCCESSFULLY! ===\n');
