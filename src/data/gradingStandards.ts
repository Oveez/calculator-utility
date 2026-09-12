export interface GradeBand {
	letter: string;
	gradePoint?: number;
	minPercent?: number;
	maxPercent?: number;
	isPassing: boolean;
	description?: string;
}

export interface DegreeClassification {
	name: string;
	minGpa?: number;
	minPercent?: number;
	badge?: string;
	description?: string;
}

export interface GradingStandard {
	id: string;
	name: string;
	shortName: string;
	description: string;
	countryOrRegion?: string;
	gpaScale?: number;
	gradeBands: GradeBand[];
	passingCutoffPercent?: number;
	degreeClassifications?: DegreeClassification[];
	hasPercentageMapping: boolean;
	hasGpaMapping: boolean;
	officialSource?: string;
	notes?: string;
	isCustom?: boolean;
}

export const GRADING_STANDARDS: GradingStandard[] = [
	{
		id: 'universal',
		name: 'Universal / None (Raw Math & Direct Grade Points)',
		shortName: 'Universal (No Scale)',
		description: 'Pure mathematical calculation without enforcing letter grades or arbitrary GPA conversions.',
		countryOrRegion: 'Universal',
		gpaScale: undefined,
		hasPercentageMapping: false,
		hasGpaMapping: false,
		passingCutoffPercent: 50,
		gradeBands: [],
		notes: 'Calculates raw percentage and exact weighted averages without assuming any specific school grading system.',
	},
	{
		id: 'us-4.0',
		name: 'US Standard 4.0 Scale (Plus / Minus)',
		shortName: 'US 4.0 (+/-)',
		description: 'Standard North American 4.0 collegiate scale with plus/minus quality point differentiations.',
		countryOrRegion: 'United States & North America',
		gpaScale: 4.0,
		hasPercentageMapping: true,
		hasGpaMapping: true,
		passingCutoffPercent: 60,
		officialSource: 'Common US Higher Education Reference (AACRAO & College Board)',
		gradeBands: [
			{ letter: 'A+', gradePoint: 4.0, minPercent: 97, maxPercent: 100, isPassing: true, description: 'Highest honors performance' },
			{ letter: 'A', gradePoint: 4.0, minPercent: 93, maxPercent: 96.99, isPassing: true, description: 'Superior academic mastery' },
			{ letter: 'A-', gradePoint: 3.7, minPercent: 90, maxPercent: 92.99, isPassing: true, description: 'Excellent performance' },
			{ letter: 'B+', gradePoint: 3.3, minPercent: 87, maxPercent: 89.99, isPassing: true, description: 'Very good comprehension' },
			{ letter: 'B', gradePoint: 3.0, minPercent: 83, maxPercent: 86.99, isPassing: true, description: 'Good / above average' },
			{ letter: 'B-', gradePoint: 2.7, minPercent: 80, maxPercent: 82.99, isPassing: true, description: 'Above average' },
			{ letter: 'C+', gradePoint: 2.3, minPercent: 77, maxPercent: 79.99, isPassing: true, description: 'Satisfactory / average' },
			{ letter: 'C', gradePoint: 2.0, minPercent: 73, maxPercent: 76.99, isPassing: true, description: 'Average passing standard' },
			{ letter: 'C-', gradePoint: 1.7, minPercent: 70, maxPercent: 72.99, isPassing: true, description: 'Minimum major requirement in many degrees' },
			{ letter: 'D+', gradePoint: 1.3, minPercent: 67, maxPercent: 69.99, isPassing: true, description: 'Below average pass' },
			{ letter: 'D', gradePoint: 1.0, minPercent: 60, maxPercent: 66.99, isPassing: true, description: 'Minimum general passing mark' },
			{ letter: 'F', gradePoint: 0.0, minPercent: 0, maxPercent: 59.99, isPassing: false, description: 'Failing / zero quality points' },
		],
		degreeClassifications: [
			{ name: 'Summa Cum Laude (Highest Honors)', minGpa: 3.9, badge: 'Summa Cum Laude', description: 'Generally top 1-5% of graduating cohort' },
			{ name: 'Magna Cum Laude (High Honors)', minGpa: 3.7, badge: 'Magna Cum Laude', description: 'Generally top 10-15% of graduating cohort' },
			{ name: 'Cum Laude (Honors)', minGpa: 3.5, badge: 'Cum Laude', description: 'Generally top 20-25% of graduating cohort' },
			{ name: 'Good Academic Standing', minGpa: 2.0, badge: 'Good Standing', description: 'Satisfactory collegiate standing' },
			{ name: 'Academic Probation Warning', minGpa: 0.0, badge: 'Probation Risk', description: 'GPA below graduation minimum (< 2.0)' },
		],
	},
	{
		id: 'us-4.0-simple',
		name: 'US Standard 4.0 Scale (Straight A–F, No +/-)',
		shortName: 'US 4.0 (A–F)',
		description: 'Traditional straight letter grading system without fractional plus/minus quality points.',
		countryOrRegion: 'United States',
		gpaScale: 4.0,
		hasPercentageMapping: true,
		hasGpaMapping: true,
		passingCutoffPercent: 60,
		officialSource: 'Traditional US Collegiate Letter Standard',
		gradeBands: [
			{ letter: 'A', gradePoint: 4.0, minPercent: 90, maxPercent: 100, isPassing: true, description: 'Excellent / Superior' },
			{ letter: 'B', gradePoint: 3.0, minPercent: 80, maxPercent: 89.99, isPassing: true, description: 'Good / Above Average' },
			{ letter: 'C', gradePoint: 2.0, minPercent: 70, maxPercent: 79.99, isPassing: true, description: 'Average / Competent' },
			{ letter: 'D', gradePoint: 1.0, minPercent: 60, maxPercent: 69.99, isPassing: true, description: 'Passing / Below Average' },
			{ letter: 'F', gradePoint: 0.0, minPercent: 0, maxPercent: 59.99, isPassing: false, description: 'Failing' },
		],
		degreeClassifications: [
			{ name: 'Dean\'s List / High Honors', minGpa: 3.5, badge: 'High Honors' },
			{ name: 'Good Academic Standing', minGpa: 2.0, badge: 'Good Standing' },
			{ name: 'Probation Risk', minGpa: 0.0, badge: 'Probation' },
		],
	},
	{
		id: 'canada-omsas-4.0',
		name: 'Canadian OMSAS 4.0 Scale (Ontario Universities Reference)',
		shortName: 'Canada OMSAS 4.0',
		description: 'Official Ontario Medical School Application Service undergraduate standard, widely referenced across Canadian universities.',
		countryOrRegion: 'Canada',
		gpaScale: 4.0,
		hasPercentageMapping: true,
		hasGpaMapping: true,
		passingCutoffPercent: 50,
		officialSource: 'Ontario Medical School Application Service (OMSAS) Conversion Table',
		gradeBands: [
			{ letter: 'A+', gradePoint: 4.0, minPercent: 90, maxPercent: 100, isPassing: true },
			{ letter: 'A', gradePoint: 3.9, minPercent: 85, maxPercent: 89.99, isPassing: true },
			{ letter: 'A-', gradePoint: 3.7, minPercent: 80, maxPercent: 84.99, isPassing: true },
			{ letter: 'B+', gradePoint: 3.3, minPercent: 77, maxPercent: 79.99, isPassing: true },
			{ letter: 'B', gradePoint: 3.0, minPercent: 73, maxPercent: 76.99, isPassing: true },
			{ letter: 'B-', gradePoint: 2.7, minPercent: 70, maxPercent: 72.99, isPassing: true },
			{ letter: 'C+', gradePoint: 2.3, minPercent: 67, maxPercent: 69.99, isPassing: true },
			{ letter: 'C', gradePoint: 2.0, minPercent: 63, maxPercent: 66.99, isPassing: true },
			{ letter: 'C-', gradePoint: 1.7, minPercent: 60, maxPercent: 62.99, isPassing: true },
			{ letter: 'D+', gradePoint: 1.3, minPercent: 57, maxPercent: 59.99, isPassing: true },
			{ letter: 'D', gradePoint: 1.0, minPercent: 53, maxPercent: 56.99, isPassing: true },
			{ letter: 'D-', gradePoint: 0.7, minPercent: 50, maxPercent: 52.99, isPassing: true },
			{ letter: 'F', gradePoint: 0.0, minPercent: 0, maxPercent: 49.99, isPassing: false },
		],
		degreeClassifications: [
			{ name: 'First Class Standing (A)', minGpa: 3.7, badge: 'First Class' },
			{ name: 'Second Class Standing (B)', minGpa: 2.7, badge: 'Second Class' },
			{ name: 'Satisfactory Standing (C)', minGpa: 1.7, badge: 'Satisfactory' },
			{ name: 'Conditional / Probation', minGpa: 0.0, badge: 'Conditional' },
		],
	},
	{
		id: 'uk-honours',
		name: 'UK Undergraduate Honours Classification (Percentage-Based)',
		shortName: 'UK Honours',
		description: 'British higher education degree classification framework based directly on overall percentage benchmarks without an artificial GPA scale.',
		countryOrRegion: 'United Kingdom',
		gpaScale: undefined,
		hasPercentageMapping: true,
		hasGpaMapping: false,
		passingCutoffPercent: 40,
		officialSource: 'UK Higher Education Degree Classification Framework (QAA Benchmark)',
		gradeBands: [
			{ letter: 'First-Class Honours (1st)', minPercent: 70, maxPercent: 100, isPassing: true, description: 'Highest academic achievement band' },
			{ letter: 'Upper Second-Class (2:1)', minPercent: 60, maxPercent: 69.99, isPassing: true, description: 'Very good performance; standard graduate employer threshold' },
			{ letter: 'Lower Second-Class (2:2)', minPercent: 50, maxPercent: 59.99, isPassing: true, description: 'Good / sound performance' },
			{ letter: 'Third-Class Honours (3rd)', minPercent: 40, maxPercent: 49.99, isPassing: true, description: 'Minimum honours passing threshold' },
			{ letter: 'Fail', minPercent: 0, maxPercent: 39.99, isPassing: false, description: 'Below minimum passing benchmark' },
		],
		degreeClassifications: [
			{ name: 'First-Class Honours (1st)', minPercent: 70, badge: 'First (1st)', description: '70% and above' },
			{ name: 'Upper Second-Class Honours (2:1)', minPercent: 60, badge: 'Upper Second (2:1)', description: '60% to 69%' },
			{ name: 'Lower Second-Class Honours (2:2)', minPercent: 50, badge: 'Lower Second (2:2)', description: '50% to 59%' },
			{ name: 'Third-Class Honours (3rd)', minPercent: 40, badge: 'Third (3rd)', description: '40% to 49%' },
			{ name: 'Fail', minPercent: 0, badge: 'Fail', description: 'Below 40%' },
		],
	},
	{
		id: 'nigeria-5.0',
		name: 'Nigerian University System (NUC 5.0 CGPA Scale)',
		shortName: 'Nigeria 5.0 Scale',
		description: 'Official National Universities Commission (NUC) benchmark minimum academic standard used in Nigerian universities.',
		countryOrRegion: 'Nigeria',
		gpaScale: 5.0,
		hasPercentageMapping: true,
		hasGpaMapping: true,
		passingCutoffPercent: 40,
		officialSource: 'National Universities Commission (NUC) Benchmark Minimum Academic Standards',
		gradeBands: [
			{ letter: 'A', gradePoint: 5.0, minPercent: 70, maxPercent: 100, isPassing: true, description: 'Excellent' },
			{ letter: 'B', gradePoint: 4.0, minPercent: 60, maxPercent: 69.99, isPassing: true, description: 'Very Good' },
			{ letter: 'C', gradePoint: 3.0, minPercent: 50, maxPercent: 59.99, isPassing: true, description: 'Good' },
			{ letter: 'D', gradePoint: 2.0, minPercent: 45, maxPercent: 49.99, isPassing: true, description: 'Fair' },
			{ letter: 'E', gradePoint: 1.0, minPercent: 40, maxPercent: 44.99, isPassing: true, description: 'Pass' },
			{ letter: 'F', gradePoint: 0.0, minPercent: 0, maxPercent: 39.99, isPassing: false, description: 'Fail' },
		],
		degreeClassifications: [
			{ name: 'First Class Honours', minGpa: 4.5, badge: 'First Class', description: '4.50 – 5.00 CGPA' },
			{ name: 'Second Class Honours (Upper Division)', minGpa: 3.5, badge: '2nd Upper', description: '3.50 – 4.49 CGPA' },
			{ name: 'Second Class Honours (Lower Division)', minGpa: 2.4, badge: '2nd Lower', description: '2.40 – 3.49 CGPA' },
			{ name: 'Third Class Honours', minGpa: 1.5, badge: 'Third Class', description: '1.50 – 2.39 CGPA' },
			{ name: 'Pass Degree', minGpa: 1.0, badge: 'Pass', description: '1.00 – 1.49 CGPA' },
			{ name: 'Fail', minGpa: 0.0, badge: 'Fail', description: '< 1.00 CGPA' },
		],
	},
	{
		id: 'india-ugc-10.0',
		name: 'Indian UGC 10-Point Grading System (CBCS Standard)',
		shortName: 'India UGC 10.0',
		description: 'University Grants Commission Choice Based Credit System (CBCS) letter and point scale used across Indian universities.',
		countryOrRegion: 'India',
		gpaScale: 10.0,
		hasPercentageMapping: true,
		hasGpaMapping: true,
		passingCutoffPercent: 35,
		officialSource: 'University Grants Commission (UGC) Guidelines on Adoption of CBCS',
		gradeBands: [
			{ letter: 'O (Outstanding)', gradePoint: 10.0, minPercent: 90, maxPercent: 100, isPassing: true },
			{ letter: 'A+ (Excellent)', gradePoint: 9.0, minPercent: 80, maxPercent: 89.99, isPassing: true },
			{ letter: 'A (Very Good)', gradePoint: 8.0, minPercent: 70, maxPercent: 79.99, isPassing: true },
			{ letter: 'B+ (Good)', gradePoint: 7.0, minPercent: 60, maxPercent: 69.99, isPassing: true },
			{ letter: 'B (Above Average)', gradePoint: 6.0, minPercent: 50, maxPercent: 59.99, isPassing: true },
			{ letter: 'C (Average)', gradePoint: 5.0, minPercent: 40, maxPercent: 49.99, isPassing: true },
			{ letter: 'P (Pass)', gradePoint: 4.0, minPercent: 35, maxPercent: 39.99, isPassing: true },
			{ letter: 'F (Fail)', gradePoint: 0.0, minPercent: 0, maxPercent: 34.99, isPassing: false },
		],
		degreeClassifications: [
			{ name: 'First Class with Distinction', minGpa: 8.0, badge: 'Distinction', description: 'CGPA 8.00 and above' },
			{ name: 'First Class', minGpa: 6.5, badge: 'First Class', description: 'CGPA 6.50 – 7.99' },
			{ name: 'Second Class', minGpa: 5.5, badge: 'Second Class', description: 'CGPA 5.50 – 6.49' },
			{ name: 'Pass Class', minGpa: 4.0, badge: 'Pass Class', description: 'CGPA 4.00 – 5.49' },
			{ name: 'Re-appear / Fail', minGpa: 0.0, badge: 'Fail', description: 'Below CGPA 4.00' },
		],
	},
	{
		id: 'australia-7.0',
		name: 'Australian Higher Education 7.0 GPA Scale',
		shortName: 'Australia 7.0 Scale',
		description: 'Standard 7-point Grade Point Average system used across prominent Australian universities.',
		countryOrRegion: 'Australia',
		gpaScale: 7.0,
		hasPercentageMapping: true,
		hasGpaMapping: true,
		passingCutoffPercent: 50,
		officialSource: 'Australian Higher Education Standards / University GPA Benchmark',
		gradeBands: [
			{ letter: 'High Distinction (HD)', gradePoint: 7.0, minPercent: 85, maxPercent: 100, isPassing: true },
			{ letter: 'Distinction (D)', gradePoint: 6.0, minPercent: 75, maxPercent: 84.99, isPassing: true },
			{ letter: 'Credit (C)', gradePoint: 5.0, minPercent: 65, maxPercent: 74.99, isPassing: true },
			{ letter: 'Pass (P)', gradePoint: 4.0, minPercent: 50, maxPercent: 64.99, isPassing: true },
			{ letter: 'Fail (F)', gradePoint: 0.0, minPercent: 0, maxPercent: 49.99, isPassing: false },
		],
		degreeClassifications: [
			{ name: 'First Class Honours (Class I)', minGpa: 6.2, badge: 'Class I' },
			{ name: 'Second Class Honours (Class IIA)', minGpa: 5.6, badge: 'Class IIA' },
			{ name: 'Second Class Honours (Class IIB)', minGpa: 5.0, badge: 'Class IIB' },
			{ name: 'Third Class Honours', minGpa: 4.0, badge: 'Class III' },
			{ name: 'Pass', minGpa: 4.0, badge: 'Pass' },
		],
	},
	{
		id: 'custom',
		name: 'Custom Academic Standard (User Configurable)',
		shortName: 'Custom Standard',
		description: 'Define your institution\'s custom grading scale, grade points, letter tiers, and passing mark.',
		countryOrRegion: 'Custom',
		isCustom: true,
		gpaScale: 4.0,
		hasPercentageMapping: true,
		hasGpaMapping: true,
		passingCutoffPercent: 50,
		gradeBands: [
			{ letter: 'A+', gradePoint: 4.0, minPercent: 90, maxPercent: 100, isPassing: true },
			{ letter: 'A', gradePoint: 3.75, minPercent: 85, maxPercent: 89.99, isPassing: true },
			{ letter: 'A-', gradePoint: 3.5, minPercent: 80, maxPercent: 84.99, isPassing: true },
			{ letter: 'B+', gradePoint: 3.25, minPercent: 75, maxPercent: 79.99, isPassing: true },
			{ letter: 'B', gradePoint: 3.0, minPercent: 70, maxPercent: 74.99, isPassing: true },
			{ letter: 'C', gradePoint: 2.0, minPercent: 60, maxPercent: 69.99, isPassing: true },
			{ letter: 'D', gradePoint: 1.0, minPercent: 50, maxPercent: 59.99, isPassing: true },
			{ letter: 'F', gradePoint: 0.0, minPercent: 0, maxPercent: 49.99, isPassing: false },
		],
	},
];

export function findStandardById(id: string): GradingStandard {
	return GRADING_STANDARDS.find((s) => s.id === id) ?? GRADING_STANDARDS[0];
}

export function mapPercentageToGrade(percent: number, standard: GradingStandard): GradeBand | null {
	if (!standard.hasPercentageMapping || !standard.gradeBands || standard.gradeBands.length === 0) {
		return null;
	}

	const safePercent = Math.max(0, percent);
	for (const band of standard.gradeBands) {
		const min = band.minPercent ?? 0;
		const max = band.maxPercent ?? 100;
		// Inclusive bounds with tolerance for decimal upper limits
		if (safePercent >= min && (safePercent <= max || (safePercent <= 100 && max >= 99))) {
			return band;
		}
	}

	// Fallback to lowest band if score is near zero or boundary
	return standard.gradeBands[standard.gradeBands.length - 1] ?? null;
}

export function mapGradeToPoint(letter: string, standard: GradingStandard): number | null {
	if (!standard.hasGpaMapping || !standard.gradeBands) return null;
	const match = standard.gradeBands.find((b) => b.letter.trim().toLowerCase() === letter.trim().toLowerCase());
	return match && match.gradePoint !== undefined ? match.gradePoint : null;
}

export function getDegreeClassification(
	score: number,
	standard: GradingStandard,
	isGpa: boolean,
): DegreeClassification | null {
	if (!standard.degreeClassifications || standard.degreeClassifications.length === 0) {
		return null;
	}

	for (const item of standard.degreeClassifications) {
		if (isGpa && item.minGpa !== undefined && score >= item.minGpa) {
			return item;
		}
		if (!isGpa && item.minPercent !== undefined && score >= item.minPercent) {
			return item;
		}
	}

	return null;
}

export function validateCustomGradeBands(bands: GradeBand[]): { isValid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!bands || bands.length === 0) {
		return { isValid: false, errors: ['At least one grade band must be defined.'] };
	}

	// Check letter names
	bands.forEach((b, idx) => {
		if (!b.letter || b.letter.trim() === '') {
			errors.push(`Row ${idx + 1}: Letter grade cannot be empty.`);
		}
		if (b.minPercent === undefined || b.maxPercent === undefined) {
			errors.push(`Row ${idx + 1} (${b.letter}): Minimum and Maximum percentage must be specified.`);
		} else if (b.minPercent > b.maxPercent) {
			errors.push(`Row ${idx + 1} (${b.letter}): Minimum percentage (${b.minPercent}%) cannot exceed Maximum (${b.maxPercent}%).`);
		}
	});

	// Check overlaps between bands
	for (let i = 0; i < bands.length; i++) {
		for (let j = i + 1; j < bands.length; j++) {
			const b1 = bands[i];
			const b2 = bands[j];
			if (
				b1.minPercent !== undefined &&
				b1.maxPercent !== undefined &&
				b2.minPercent !== undefined &&
				b2.maxPercent !== undefined
			) {
				// Overlap condition: max(min1, min2) < min(max1, max2)
				const overlap = Math.max(b1.minPercent, b2.minPercent) < Math.min(b1.maxPercent, b2.maxPercent);
				if (overlap) {
					errors.push(`Overlap detected between "${b1.letter}" (${b1.minPercent}-${b1.maxPercent}%) and "${b2.letter}" (${b2.minPercent}-${b2.maxPercent}%).`);
				}
			}
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
