import assert from 'node:assert/strict';
import { calculators } from '../src/data/calculators';

function getCalc(slug: string) {
  const calc = calculators.find((c) => c.slug === slug);
  if (!calc) throw new Error(`Calculator not found: ${slug}`);
  return calc;
}

console.log('=== RUNNING EDUCATION CALCULATOR TEST SUITE ===\n');

// ==========================================
// 1. GPA CALCULATOR
// ==========================================
describe('GPA Calculator', () => {
  const calc = getCalc('gpa-calculator');

  // Normal Cases
  console.log('Testing GPA Calculator - Normal Cases...');
  {
    // Normal Case 1: 3 courses (3.7@3cr, 3.3@3cr, 4.0@4cr)
    const res = calc.formula({
      course1Grade: 3.7, course1Credits: 3,
      course2Grade: 3.3, course2Credits: 3,
      course3Grade: 4.0, course3Credits: 4,
      course4Credits: 0, course5Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 3.7);
    assert.equal(res.primary.formattedValue, '3.70 GPA');
    assert.equal(res.secondary.find((s: any) => s.id === 'qualityPoints')?.value, 37);
    assert.equal(res.secondary.find((s: any) => s.id === 'enrolledCredits')?.value, 10);
    assert.equal(res.secondary.find((s: any) => s.id === 'letterGrade')?.value, 'A-');
    assert.match(res.secondary.find((s: any) => s.id === 'academicStanding')?.value, /Dean's List/);
  }

  {
    // Normal Case 2: Mixed workload (3.0@2cr, 3.8@5cr, 2.7@1cr) -> 27.7 / 8 = 3.4625
    const res = calc.formula({
      course1Grade: 3.0, course1Credits: 2,
      course2Grade: 3.8, course2Credits: 5,
      course3Grade: 2.7, course3Credits: 1,
      course4Credits: 0, course5Credits: 0,
    }) as any;
    assert.equal(Number(res.primary.value.toFixed(4)), 3.4625);
    assert.equal(res.primary.formattedValue, '3.46 GPA');
    assert.match(res.secondary.find((s: any) => s.id === 'academicStanding')?.value, /Good Academic Standing/);
    assert.equal(res.secondary.find((s: any) => s.id === 'letterGrade')?.value, 'B+');
  }

  {
    // Normal Case 3: 5 courses filled
    const res = calc.formula({
      course1Grade: 4.0, course1Credits: 3,
      course2Grade: 3.0, course2Credits: 3,
      course3Grade: 2.0, course3Credits: 3,
      course4Grade: 3.3, course4Credits: 3,
      course5Grade: 3.7, course5Credits: 3,
    }) as any;
    // (12 + 9 + 6 + 9.9 + 11.1) / 15 = 48 / 15 = 3.20
    assert.equal(res.primary.value, 3.2);
    assert.equal(res.primary.formattedValue, '3.20 GPA');
    assert.equal(res.secondary.find((s: any) => s.id === 'letterGrade')?.value, 'B+');
  }

  // Boundary Cases
  console.log('Testing GPA Calculator - Boundary Cases...');
  {
    // Boundary Case 1: Empty / Zero credits - must be neutral, NOT academic probation
    const res = calc.formula({
      course1Grade: 0, course1Credits: 0,
      course2Grade: 0, course2Credits: 0,
      course3Grade: 0, course3Credits: 0,
      course4Grade: 0, course4Credits: 0,
      course5Grade: 0, course5Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 0);
    assert.equal(res.primary.formattedValue, '0.00 GPA');
    assert.equal(res.secondary.find((s: any) => s.id === 'academicStanding')?.value, 'No completed credits entered');
    assert.equal(res.secondary.find((s: any) => s.id === 'letterGrade')?.value, '—');
  }

  {
    // Boundary Case 2: Maximum 4.0 across all courses
    const res = calc.formula({
      course1Grade: 4.0, course1Credits: 4,
      course2Grade: 4.0, course2Credits: 4,
      course3Credits: 0, course4Credits: 0, course5Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 4.0);
    assert.equal(res.primary.formattedValue, '4.00 GPA');
    assert.equal(res.secondary.find((s: any) => s.id === 'academicStanding')?.badge, 'Highest Honors');
    assert.equal(res.secondary.find((s: any) => s.id === 'letterGrade')?.value, 'A');
  }

  {
    // Boundary Case 3: Actual failing term with credits (0.0 across 12 credits) -> Academic probation
    const res = calc.formula({
      course1Grade: 0.0, course1Credits: 6,
      course2Grade: 0.0, course2Credits: 6,
      course3Credits: 0, course4Credits: 0, course5Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 0.0);
    assert.match(res.secondary.find((s: any) => s.id === 'academicStanding')?.value, /Academic Probation Risk/);
    assert.equal(res.secondary.find((s: any) => s.id === 'letterGrade')?.value, 'F');
  }

  // Invalid Cases
  console.log('Testing GPA Calculator - Invalid Cases...');
  {
    // Invalid Case 1: Negative credits entered
    const res = calc.formula({
      course1Grade: 3.5, course1Credits: -5,
      course2Grade: 4.0, course2Credits: 3,
      course3Credits: 0, course4Credits: 0, course5Credits: 0,
    }) as any;
    // -5 credits clamped to 0, only Course 2 (4.0@3cr) counts
    assert.equal(res.primary.value, 4.0);
    assert.equal(res.secondary.find((s: any) => s.id === 'enrolledCredits')?.value, 3);
  }

  {
    // Invalid Case 2: Grade points out of bounds (> 4.0 clamped to 4.0, negative clamped to 0.0)
    const res = calc.formula({
      course1Grade: 5.5, course1Credits: 3, // clamped to 4.0
      course2Grade: -2.0, course2Credits: 3, // clamped to 0.0
      course3Credits: 0, course4Credits: 0, course5Credits: 0,
    }) as any;
    // (4.0*3 + 0.0*3) / 6 = 12 / 6 = 2.0
    assert.equal(res.primary.value, 2.0);
    assert.equal(res.primary.formattedValue, '2.00 GPA');
  }

  // Reference Case
  console.log('Testing GPA Calculator - Independent Reference Case...');
  {
    // Calculator.net reference: Math (4.0 @ 3cr), English (3.3 @ 3cr), History (3.7 @ 2cr)
    // Points = 12.0 + 9.9 + 7.4 = 29.3. Credits = 8. GPA = 3.6625 -> 3.66
    const res = calc.formula({
      course1Grade: 4.0, course1Credits: 3,
      course2Grade: 3.3, course2Credits: 3,
      course3Grade: 3.7, course3Credits: 2,
      course4Credits: 0, course5Credits: 0,
    }) as any;
    assert.equal(Number(res.primary.value.toFixed(4)), 3.6625);
    assert.equal(res.primary.formattedValue, '3.66 GPA');
  }
  console.log('✓ GPA Calculator passed all tests\n');
});

// ==========================================
// 2. CGPA CALCULATOR
// ==========================================
describe('CGPA Calculator', () => {
  const calc = getCalc('cgpa-calculator');

  console.log('Testing CGPA Calculator - Normal Cases...');
  {
    // Normal Case 1: 4 terms: 3.5(18cr), 3.8(18cr), 3.6(16cr), 3.9(18cr)
    // Total credits = 70. Total QP = 63 + 68.4 + 57.6 + 70.2 = 259.2. CGPA = 259.2 / 70 = 3.702857...
    const res = calc.formula({
      semester1Gpa: 3.5, semester1Credits: 18,
      semester2Gpa: 3.8, semester2Credits: 18,
      semester3Gpa: 3.6, semester3Credits: 16,
      semester4Gpa: 3.9, semester4Credits: 18,
      semester5Credits: 0, semester6Credits: 0,
    }) as any;
    assert.equal(Number(res.primary.value.toFixed(4)), 3.7029);
    assert.equal(res.primary.formattedValue, '3.70 CGPA');
    assert.equal(res.secondary.find((s: any) => s.id === 'cumCredits')?.value, 70);
    assert.equal(res.secondary.find((s: any) => s.id === 'degreeStanding')?.badge, 'Magna Cum Laude');
  }

  {
    // Normal Case 2: 2 terms with equal credits
    const res = calc.formula({
      semester1Gpa: 3.2, semester1Credits: 15,
      semester2Gpa: 3.8, semester2Credits: 15,
      semester3Credits: 0, semester4Credits: 0, semester5Credits: 0, semester6Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 3.5);
    assert.equal(res.primary.formattedValue, '3.50 CGPA');
    assert.equal(res.secondary.find((s: any) => s.id === 'degreeStanding')?.badge, 'Magna Cum Laude');
  }

  {
    // Normal Case 3: Varied credits across 3 terms
    const res = calc.formula({
      semester1Gpa: 3.0, semester1Credits: 10,
      semester2Gpa: 4.0, semester2Credits: 20,
      semester3Gpa: 3.5, semester3Credits: 10,
      semester4Credits: 0, semester5Credits: 0, semester6Credits: 0,
    }) as any;
    // (30 + 80 + 35) / 40 = 145 / 40 = 3.625 -> 3.63
    assert.equal(res.primary.value, 3.625);
    assert.equal(res.primary.formattedValue, '3.63 CGPA');
  }

  console.log('Testing CGPA Calculator - Boundary Cases...');
  {
    // Boundary Case 1: Empty inputs {} or 0 credits - neutral state, NOT warning
    const res = calc.formula({
      semester1Gpa: 0, semester1Credits: 0,
      semester2Gpa: 0, semester2Credits: 0,
      semester3Gpa: 0, semester3Credits: 0,
      semester4Gpa: 0, semester4Credits: 0,
      semester5Gpa: 0, semester5Credits: 0,
      semester6Gpa: 0, semester6Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 0);
    assert.equal(res.primary.formattedValue, '0.00 CGPA');
    assert.equal(res.secondary.find((s: any) => s.id === 'degreeStanding')?.value, 'No completed credits entered');
    assert.equal(res.secondary.find((s: any) => s.id === 'equiv100')?.formattedValue, '—');
  }

  {
    // Boundary Case 2: Perfect 4.0 across terms
    const res = calc.formula({
      semester1Gpa: 4.0, semester1Credits: 18,
      semester2Gpa: 4.0, semester2Credits: 18,
      semester3Credits: 0, semester4Credits: 0, semester5Credits: 0, semester6Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 4.0);
    assert.equal(res.primary.formattedValue, '4.00 CGPA');
    assert.equal(res.secondary.find((s: any) => s.id === 'degreeStanding')?.badge, 'Summa Cum Laude');
  }

  console.log('Testing CGPA Calculator - Invalid Cases...');
  {
    // Invalid Case 1: Negative credits clamped to 0
    const res = calc.formula({
      semester1Gpa: 3.5, semester1Credits: -10,
      semester2Gpa: 3.8, semester2Credits: 20,
      semester3Credits: 0, semester4Credits: 0, semester5Credits: 0, semester6Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 3.8);
    assert.equal(res.secondary.find((s: any) => s.id === 'cumCredits')?.value, 20);
  }

  {
    // Invalid Case 2: GPA out of bounds clamped to [0, 4.0]
    const res = calc.formula({
      semester1Gpa: 5.0, semester1Credits: 10, // clamped to 4.0
      semester2Gpa: -1.0, semester2Credits: 10, // clamped to 0.0
      semester3Credits: 0, semester4Credits: 0, semester5Credits: 0, semester6Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 2.0);
  }

  console.log('Testing CGPA Calculator - Independent Reference Case...');
  {
    // Reference Case: 3 equal terms with 3.4, 3.6, 3.8
    // Average = 3.60 CGPA
    const res = calc.formula({
      semester1Gpa: 3.4, semester1Credits: 20,
      semester2Gpa: 3.6, semester2Credits: 20,
      semester3Gpa: 3.8, semester3Credits: 20,
      semester4Credits: 0, semester5Credits: 0, semester6Credits: 0,
    }) as any;
    assert.equal(res.primary.value, 3.6);
    assert.equal(res.primary.formattedValue, '3.60 CGPA');
  }
  console.log('✓ CGPA Calculator passed all tests\n');
});

// ==========================================
// 3. GRADE CALCULATOR
// ==========================================
describe('Grade Calculator', () => {
  const calc = getCalc('grade-calculator');

  console.log('Testing Grade Calculator - Normal Cases...');
  {
    // Normal Case 1: 92 out of 100
    const res = calc.formula({ marks: 92, totalMarks: 100, passingCutoff: 60, curvePoints: 0 }) as any;
    assert.equal(res.primary.value, 92);
    assert.equal(res.primary.formattedValue, '92.00% (A-)');
    assert.equal(res.secondary.find((s: any) => s.id === 'gpaScale')?.value, 3.7);
    assert.equal(res.secondary.find((s: any) => s.id === 'passStatus')?.badge, 'Passed');
    assert.equal(res.secondary.find((s: any) => s.id === 'pointsLost')?.value, 8);
  }

  {
    // Normal Case 2: 85 out of 100
    const res = calc.formula({ marks: 85, totalMarks: 100, passingCutoff: 60, curvePoints: 0 }) as any;
    assert.equal(res.primary.value, 85);
    assert.equal(res.primary.formattedValue, '85.00% (B)');
    assert.equal(res.secondary.find((s: any) => s.id === 'gpaScale')?.value, 3.0);
  }

  {
    // Normal Case 3: 74 with 4 curve points on 100 -> 78% (C+)
    const res = calc.formula({ marks: 74, totalMarks: 100, passingCutoff: 60, curvePoints: 4 }) as any;
    assert.equal(res.primary.value, 78);
    assert.equal(res.primary.formattedValue, '78.00% (C+)');
    assert.equal(res.secondary.find((s: any) => s.id === 'gpaScale')?.value, 2.3);
  }

  console.log('Testing Grade Calculator - Boundary Cases...');
  {
    // Boundary Case 1: 100 out of 100 (A+)
    const res = calc.formula({ marks: 100, totalMarks: 100, passingCutoff: 60, curvePoints: 0 }) as any;
    assert.equal(res.primary.value, 100);
    assert.equal(res.primary.formattedValue, '100.00% (A+)');
    assert.equal(res.secondary.find((s: any) => s.id === 'gpaScale')?.value, 4.0);
  }

  {
    // Boundary Case 2: Exact passing cutoff (60%)
    const res = calc.formula({ marks: 60, totalMarks: 100, passingCutoff: 60, curvePoints: 0 }) as any;
    assert.equal(res.primary.value, 60);
    assert.equal(res.primary.formattedValue, '60.00% (D)');
    assert.equal(res.secondary.find((s: any) => s.id === 'passStatus')?.badge, 'Passed');
    assert.match(res.secondary.find((s: any) => s.id === 'passStatus')?.value, /\+0\.0% above cutoff/);
  }

  {
    // Boundary Case 3: D+ tier verification (68 out of 100) -> D+ (1.3 GPA)
    const res = calc.formula({ marks: 68, totalMarks: 100, passingCutoff: 60, curvePoints: 0 }) as any;
    assert.equal(res.primary.value, 68);
    assert.equal(res.primary.formattedValue, '68.00% (D+)');
    assert.equal(res.secondary.find((s: any) => s.id === 'gpaScale')?.value, 1.3);
    assert.equal(calc.resultFormat(68), '68.00% (D+)');
  }

  {
    // Boundary Case 4: Extra credit over 100% (105 / 100)
    const res = calc.formula({ marks: 100, totalMarks: 100, curvePoints: 5, passingCutoff: 60 }) as any;
    assert.equal(res.primary.value, 105);
    assert.equal(res.primary.formattedValue, '105.00% (A+)');
    assert.equal(res.secondary.find((s: any) => s.id === 'pointsLost')?.value, 0);
  }

  console.log('Testing Grade Calculator - Invalid Cases...');
  {
    // Invalid Case 1: Total marks <= 0 (division by zero prevention)
    const res = calc.formula({ marks: 50, totalMarks: 0, passingCutoff: 60, curvePoints: 0 }) as any;
    assert.equal(res.primary.formattedValue, 'Invalid Total Marks');
    assert.equal(res.secondary.find((s: any) => s.id === 'passStatus')?.badge, 'Error');
  }

  {
    // Invalid Case 2: Negative total marks
    const res = calc.formula({ marks: 50, totalMarks: -100, passingCutoff: 60, curvePoints: 0 }) as any;
    assert.equal(res.primary.formattedValue, 'Invalid Total Marks');
    assert.equal(res.secondary.find((s: any) => s.id === 'passStatus')?.badge, 'Error');
  }

  {
    // Invalid Case 3: Negative marks clamped to 0
    const res = calc.formula({ marks: -20, totalMarks: 100, passingCutoff: 60, curvePoints: 0 }) as any;
    assert.equal(res.primary.value, 0);
    assert.equal(res.primary.formattedValue, '0.00% (F)');
  }

  console.log('Testing Grade Calculator - Independent Reference Case...');
  {
    // Reference Case: 42 marks earned out of 50 total -> 84.00% (B, 3.0 GPA)
    const res = calc.formula({ marks: 42, totalMarks: 50, passingCutoff: 60, curvePoints: 0 }) as any;
    assert.equal(res.primary.value, 84);
    assert.equal(res.primary.formattedValue, '84.00% (B)');
    assert.equal(res.secondary.find((s: any) => s.id === 'gpaScale')?.value, 3.0);
  }
  console.log('✓ Grade Calculator passed all tests\n');
});

console.log('====================================================');
console.log('ALL EDUCATION CALCULATOR TESTS PASSED SUCCESSFULLY!');
console.log('====================================================');

function describe(name: string, fn: () => void) {
  console.log(`--- ${name} ---`);
  fn();
}
