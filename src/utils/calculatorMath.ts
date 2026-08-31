export type CalculatorValueMap = Record<string, number | string>;

export const formatNumber = (value: number | string, digits = 2): string =>
	new Intl.NumberFormat('en-US', {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	}).format(Number(value));

export const formatInteger = (value: number | string): string =>
	new Intl.NumberFormat('en-US', {
		maximumFractionDigits: 0,
	}).format(Math.round(Number(value)));

export const getValue = (values: CalculatorValueMap, key: string, fallback = 0): number =>
	Number(values[key] ?? fallback);

export const getTextValue = (values: CalculatorValueMap, key: string, fallback = ''): string =>
	String(values[key] ?? fallback);

export const normalizeToken = (value: string): string => value.trim().toLowerCase();

export const toUtcDate = (
	year: number,
	month: number,
	day: number,
	hour = 0,
	minute = 0,
	second = 0,
): Date => new Date(Date.UTC(year, month - 1, day, hour, minute, second));

export const daysBetween = (start: Date, end: Date): number =>
	Math.round((end.getTime() - start.getTime()) / 86_400_000);

export const decimalAge = (start: Date, end: Date): number => {
	const totalDays = Math.max(daysBetween(start, end), 0);
	return totalDays / 365.2425;
};

export const workingDaysBetween = (start: Date, end: Date): number => {
	const from = start.getTime() <= end.getTime() ? start : end;
	const to = start.getTime() <= end.getTime() ? end : start;
	const cursor = new Date(from);
	cursor.setUTCHours(0, 0, 0, 0);
	const limit = new Date(to);
	limit.setUTCHours(0, 0, 0, 0);

	let count = 0;

	while (cursor.getTime() <= limit.getTime()) {
		const day = cursor.getUTCDay();
		if (day !== 0 && day !== 6) {
			count += 1;
		}

		cursor.setUTCDate(cursor.getUTCDate() + 1);
	}

	return count;
};

export const formatCountdown = (seconds: number | string): string => {
	const totalSeconds = Math.max(Math.floor(Number(seconds)), 0);
	const days = Math.floor(totalSeconds / 86_400);
	const hours = Math.floor((totalSeconds % 86_400) / 3_600);
	const minutes = Math.floor((totalSeconds % 3_600) / 60);
	const remainingSeconds = totalSeconds % 60;

	if (totalSeconds === 0) {
		return 'Event has started';
	}

	return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
};

export const weightedAverage = (grades: Array<[number, number]>): number => {
	const totalCredits = grades.reduce((sum, [, credits]) => sum + credits, 0);
	const weightedPoints = grades.reduce((sum, [grade, credits]) => sum + grade * credits, 0);

	return totalCredits === 0 ? 0 : weightedPoints / totalCredits;
};

export const countWords = (text: string): number => text.trim().match(/\S+/g)?.length ?? 0;

export const countCharacters = (text: string): number => text.length;

export const convertCase = (text: string, mode: string): string => {
	const normalizedMode = normalizeToken(mode);

	switch (normalizedMode) {
		case 'lower':
			return text.toLowerCase();
		case 'sentence':
			return text ? `${text.charAt(0).toUpperCase()}${text.slice(1).toLowerCase()}` : '';
		case 'title':
			return text
				.toLowerCase()
				.replace(/(^|\s|[-_])(\p{L})/gu, (_match, separator: string, letter: string) => `${separator}${letter.toUpperCase()}`);
		default:
			return text.toUpperCase();
	}
};

export const convertWithFactors = (
	value: number,
	fromUnit: string,
	toUnit: string,
	factors: Record<string, number>,
	labels: Record<string, string>,
): string => {
	const fromKey = normalizeToken(fromUnit);
	const toKey = normalizeToken(toUnit);
	const fromFactor = factors[fromKey];
	const toFactor = factors[toKey];

	if (!fromFactor || !toFactor) {
		return 'Unsupported unit';
	}

	const converted = (value * fromFactor) / toFactor;
	return `${formatNumber(converted)} ${labels[toKey] ?? toUnit}`;
};

export const convertTemperature = (value: number, fromUnit: string, toUnit: string): string => {
	const fromKey = normalizeToken(fromUnit);
	const toKey = normalizeToken(toUnit);

	if (fromKey === toKey) {
		return `${formatNumber(value)} ${toKey === 'c' ? '°C' : toKey === 'f' ? '°F' : 'K'}`;
	}

	let celsius = value;

	if (fromKey === 'f') {
		celsius = ((value - 32) * 5) / 9;
	} else if (fromKey === 'k') {
		celsius = value - 273.15;
	}

	let converted = celsius;
	if (toKey === 'f') {
		converted = (celsius * 9) / 5 + 32;
	} else if (toKey === 'k') {
		converted = celsius + 273.15;
	}

	const labels: Record<string, string> = { c: '°C', f: '°F', k: 'K' };
	return `${formatNumber(converted)} ${labels[toKey] ?? toUnit}`;
};

export const convertStorageUnits = (value: number, fromUnit: string, toUnit: string): string => {
	const units: Record<string, number> = {
		b: 1,
		kb: 1024,
		mb: 1024 ** 2,
		gb: 1024 ** 3,
		tb: 1024 ** 4,
		pb: 1024 ** 5,
	};
	const labels: Record<string, string> = {
		b: 'B',
		kb: 'KB',
		mb: 'MB',
		gb: 'GB',
		tb: 'TB',
		pb: 'PB',
	};

	return convertWithFactors(value, fromUnit, toUnit, units, labels);
};

export const formatCurrency = (value: number | string, symbol = '$', digits = 2): string => {
	const num = Number(value);
	if (isNaN(num)) return `${symbol}0.00`;
	return `${symbol}${new Intl.NumberFormat('en-US', {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	}).format(num)}`;
};

export const calculateLoanMonthlyPayment = (
	principal: number,
	annualRatePercent: number,
	years: number,
): number => {
	if (principal <= 0 || years <= 0) return 0;
	const monthlyRate = annualRatePercent > 0 ? annualRatePercent / 100 / 12 : 0;
	const totalMonths = years * 12;

	if (monthlyRate === 0) {
		return principal / totalMonths;
	}

	const factor = Math.pow(1 + monthlyRate, totalMonths);
	return (principal * monthlyRate * factor) / (factor - 1);
};

export const calculateCompoundInterest = (
	principal: number,
	annualRatePercent: number,
	years: number,
	compoundsPerYear = 12,
	monthlyContribution = 0,
): { futureValue: number; totalDeposits: number; totalInterest: number } => {
	const r = annualRatePercent / 100;
	const n = compoundsPerYear > 0 ? compoundsPerYear : 12;
	const t = Math.max(years, 0);
	const P = Math.max(principal, 0);
	const PMT = Math.max(monthlyContribution, 0);

	// Compound interest on principal: P * (1 + r/n)^(nt)
	const futurePrincipal = P * Math.pow(1 + r / n, n * t);

	// Future value of a series (monthly deposits compounding n times per year):
	// For monthly contributions with compounding frequency n:
	let futureDeposits = 0;
	if (PMT > 0 && t > 0) {
		if (r === 0) {
			futureDeposits = PMT * 12 * t;
		} else {
			const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
			futureDeposits = PMT * ((Math.pow(1 + monthlyRate, 12 * t) - 1) / monthlyRate);
		}
	}

	const futureValue = futurePrincipal + futureDeposits;
	const totalDeposits = P + PMT * 12 * t;
	const totalInterest = Math.max(futureValue - totalDeposits, 0);

	return { futureValue, totalDeposits, totalInterest };
};

export const calculateSimpleInterest = (
	principal: number,
	annualRatePercent: number,
	years: number,
): { interest: number; totalAmount: number } => {
	const P = Math.max(principal, 0);
	const r = annualRatePercent / 100;
	const t = Math.max(years, 0);
	const interest = P * r * t;
	return { interest, totalAmount: P + interest };
};

export const calculateTip = (
	billAmount: number,
	tipPercent: number,
	splitWays = 1,
): { tipAmount: number; totalBill: number; perPerson: number } => {
	const bill = Math.max(billAmount, 0);
	const tipRate = Math.max(tipPercent, 0) / 100;
	const splits = Math.max(Math.floor(splitWays), 1);

	const tipAmount = bill * tipRate;
	const totalBill = bill + tipAmount;
	const perPerson = totalBill / splits;

	return { tipAmount, totalBill, perPerson };
};

export const calculateDiscount = (
	originalPrice: number,
	discountPercent: number,
	taxPercent = 0,
): { finalPrice: number; savings: number; taxAmount: number } => {
	const price = Math.max(originalPrice, 0);
	const discountRate = Math.min(Math.max(discountPercent, 0), 100) / 100;
	const taxRate = Math.max(taxPercent, 0) / 100;

	const savings = price * discountRate;
	const discountedPrice = price - savings;
	const taxAmount = discountedPrice * taxRate;
	const finalPrice = discountedPrice + taxAmount;

	return { finalPrice, savings, taxAmount };
};

export const calculateSalary = (
	hourlyWage: number,
	hoursPerWeek = 40,
	weeksPerYear = 52,
): { annual: number; monthly: number; biweekly: number; weekly: number } => {
	const rate = Math.max(hourlyWage, 0);
	const hours = Math.max(hoursPerWeek, 0);
	const weeks = Math.min(Math.max(weeksPerYear, 1), 52);

	const weekly = rate * hours;
	const annual = weekly * weeks;
	const monthly = annual / 12;
	const biweekly = weekly * 2;

	return { annual, monthly, biweekly, weekly };
};

export const parseIsoDate = (dateStr: string): Date | null => {
	if (!dateStr || typeof dateStr !== 'string') return null;
	const parts = dateStr.trim().split(/[-T :]/);
	if (parts.length < 3) return null;
	const year = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10);
	const day = parseInt(parts[2], 10);
	const hour = parts[3] ? parseInt(parts[3], 10) : 0;
	const min = parts[4] ? parseInt(parts[4], 10) : 0;

	if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
	return new Date(Date.UTC(year, month - 1, day, hour, min, 0));
};

export const dateDiffDaysFromIso = (startStr: string, endStr: string): number => {
	const start = parseIsoDate(startStr) ?? new Date();
	const end = parseIsoDate(endStr) ?? new Date();
	return Math.abs(daysBetween(start, end));
};

export const ageFromIsoDate = (birthDateStr: string, refDateStr?: string): number => {
	const birth = parseIsoDate(birthDateStr) ?? new Date(1995, 0, 1);
	const ref = refDateStr ? (parseIsoDate(refDateStr) ?? new Date()) : new Date();
	return decimalAge(birth, ref);
};

export const workingDaysFromIso = (startStr: string, endStr: string): number => {
	const start = parseIsoDate(startStr) ?? new Date();
	const end = parseIsoDate(endStr) ?? new Date();
	return workingDaysBetween(start, end);
};

export const countdownFromIso = (targetStr: string, currentStr?: string): number => {
	const target = parseIsoDate(targetStr) ?? new Date(Date.now() + 86400000);
	const current = currentStr ? (parseIsoDate(currentStr) ?? new Date()) : new Date();
	return Math.max((target.getTime() - current.getTime()) / 1000, 0);
};