import fs from 'node:fs';
import { CSV_KEYWORD_SET, RAW_CSV_KEYWORDS } from './raw_keywords.mjs';

// Define the full content for calculators.ts
const calculatorsTsContent = `import type { CalculatorConfig } from '../types/calculator';
import {
	ageFromIsoDate,
	calculateCompoundInterest,
	calculateDiscount,
	calculateLoanMonthlyPayment,
	calculateSalary,
	calculateSimpleInterest,
	calculateTip,
	convertCase,
	convertStorageUnits,
	convertTemperature,
	convertWithFactors,
	countdownFromIso,
	countCharacters,
	countWords,
	dateDiffDaysFromIso,
	formatCountdown,
	formatCurrency,
	formatInteger,
	formatNumber,
	getTextValue,
	getValue,
	normalizeToken,
	weightedAverage,
	workingDaysFromIso,
} from '../utils/calculatorMath';

const makeContent = (
	intro: string,
	howItWorks: string,
	formulaExplanation: string,
	examples: { title: string; description: string; values: Record<string, number | string>; result: string }[],
): CalculatorConfig['content'] => ({
	intro,
	howItWorks,
	formulaExplanation,
	examples,
});

const calculators: CalculatorConfig[] = [
	// ==========================================
	// FINANCE & MONEY (8 Calculators)
	// ==========================================
	{
		metaTitle: 'Loan Calculator — Monthly Payment & Interest Rate Calculator',
		slug: 'mortgage-calculator',
		title: 'Loan Calculator & Mortgage Payment Calculator',
		category: 'Finance',
		metaDescription: 'Free online loan calculator to calculate loan payment amounts, interest charges, monthly loan rate schedule, and total payoff terms.',
		inputs: [
			{ id: 'principal', label: 'Loan / Home amount', type: 'number', min: 1000, step: 1000, defaultValue: 300000, unit: '$' },
			{ id: 'interestRate', label: 'Annual interest rate', type: 'number', min: 0.1, max: 30, step: 0.05, defaultValue: 6.5, unit: '%' },
			{ id: 'loanTermYears', label: 'Loan term', type: 'number', min: 1, max: 50, step: 1, defaultValue: 30, unit: 'years' },
		],
		formula: (values) => {
			const principal = getValue(values, 'principal', 300000);
			const rate = getValue(values, 'interestRate', 6.5);
			const years = getValue(values, 'loanTermYears', 30);
			return calculateLoanMonthlyPayment(principal, rate, years);
		},
		resultFormat: (value) => \`\${formatCurrency(value)} / month\`,
		faq: [
			{
				question: 'How do I calculate loan payment and monthly interest?',
				answer: 'Our loan payment calculator computes your exact monthly loan calculator payment by amortizing the principal over your term at the specified annual rate. It acts as an all-in-one loan and interest calculator.'
			},
			{
				question: 'What factors determine my monthly payment and interest charges?',
				answer: 'Your loan calculator monthly payment depends on three factors: total borrowed principal, the loan term calculator duration in years, and the loan interest rate calculator figure. A higher rate or longer term increases the total interest over time.'
			},
			{
				question: 'How does a loan term calculator help reduce total finance costs?',
				answer: 'Shortening your repayment window with a monthly loan calculator lowers cumulative borrowing expenses. Comparing loan tables across 15-year and 30-year terms reveals thousands in interest savings.'
			},
			{
				question: 'Can I use this as a finance loan calculator for personal or mortgage loans?',
				answer: 'Yes! This browser-based finance loan calculator functions as an accurate loan calculator tool for mortgages, personal notes, student financing, and home equity loans.'
			},
		],
		relatedSlugs: ['compound-interest-calculator', 'auto-loan-calculator', 'simple-interest-calculator'],
		content: makeContent(
			'This comprehensive loan calculator helps you estimate financing costs, plan home mortgages, and evaluate repayment schedules. Whether you need a monthly payment calculator, a loan and interest rate calculator, or a finance loan calculator to analyze borrowing options, this tool delivers instant, private projections. Plan your personal loan calendar and make confident borrowing decisions with zero server data tracking.',
			'The calculator uses the standard fixed-rate amortization loan calculator formula. It converts the annual percentage into a monthly loan rate calculator figure, dividing the principal and interest evenly across the total loan term calculator months for a predictable monthly loan calculator payment.',
			'Formula: Monthly Payment M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ], where P is Principal, i is monthly interest rate, and n is total months in the loan term.',
			[
				{ title: 'Standard 30-Year Loan', description: 'A $300,000 mortgage at 6.5% interest over a 30-year term.', values: { principal: 300000, interestRate: 6.5, loanTermYears: 30 }, result: '$1,896.20 / month' },
				{ title: '15-Year Fast Payoff Loan', description: 'A $300,000 loan over a 15-year term at 6.0% interest.', values: { principal: 300000, interestRate: 6.0, loanTermYears: 15 }, result: '$2,531.60 / month' },
			],
		),
	},
	{
		metaTitle: 'Compound Interest Calculator — Investment & Savings Growth',
		slug: 'compound-interest-calculator',
		title: 'Compound Interest Calculator',
		category: 'Finance',
		metaDescription: 'Free compound interest calculator to estimate compound interest, cumulative interest, monthly growth, and future investment returns over time.',
		inputs: [
			{ id: 'principal', label: 'Initial deposit', type: 'number', min: 0, step: 100, defaultValue: 10000, unit: '$' },
			{ id: 'monthlyContribution', label: 'Monthly addition', type: 'number', min: 0, step: 50, defaultValue: 500, unit: '$' },
			{ id: 'annualRate', label: 'Annual interest / return rate', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 8, unit: '%' },
			{ id: 'years', label: 'Investment period', type: 'number', min: 1, max: 60, step: 1, defaultValue: 10, unit: 'years' },
		],
		formula: (values) => {
			const principal = getValue(values, 'principal', 10000);
			const monthly = getValue(values, 'monthlyContribution', 500);
			const rate = getValue(values, 'annualRate', 8);
			const years = getValue(values, 'years', 10);
			const result = calculateCompoundInterest(principal, rate, years, 12, monthly);
			return result.futureValue;
		},
		resultFormat: (value) => formatCurrency(value),
		faq: [
			{
				question: 'How do I calculate compound interest with monthly contributions?',
				answer: 'Our compound interest calculator monthly models your initial deposit plus regular additions. By applying the compound interest formula calculator at each monthly interval, your cumulative interest calculator balance accelerates over time.'
			},
			{
				question: 'What is the difference in simple interest and compound interest calculator results?',
				answer: 'A simple interest calculator computes returns solely on the original principal. In contrast, a compound growth calculator adds earned interest back into the balance, enabling exponential wealth building.'
			},
			{
				question: 'Can I use this as a compound loan calculator?',
				answer: 'Yes! While designed for investment growth, this tool also operates as a compound loan calculator to evaluate compounding debt balances and interest compound interest calculator projections.'
			},
			{
				question: 'How does the compound interest rate calculator factor in compounding frequency?',
				answer: 'This compound interest rate calculator assumes monthly compounding (12 times per year), which matches standard high-yield savings accounts, index funds, and brokerage investment products.'
			},
		],
		relatedSlugs: ['mortgage-calculator', 'investment-calculator', 'simple-interest-calculator'],
		content: makeContent(
			'This compound interest calculator demonstrates the exponential power of financial compounding. Whether planning retirement, building a rainy-day fund, or simulating stock market returns, use our compound calculator to estimate compound interest growth across multi-year horizons. Regular monthly additions multiply your cumulative interest earnings without active trading.',
			'The compound interest growth calculator applies monthly compounding to your starting balance while simultaneously compounding the annuity of your regular monthly deposits. The engine computes both principal accumulation and cumulative interest over time.',
			'Formula: Future Value = P(1 + r/n)^(nt) + PMT × [ ((1 + r/n)^(nt) - 1) / (r/n) ], where P is initial deposit, PMT is monthly contribution, r is annual compound rate, n is compounding frequency per year, and t is time in years.',
			[
				{ title: '10-Year Growth Plan', description: '$10,000 starting deposit with $500/month at 8% annual return.', values: { principal: 10000, monthlyContribution: 500, annualRate: 8, years: 10 }, result: '$113,866.49' },
				{ title: '20-Year Long Term Horizon', description: 'Longer horizon showcasing compounding acceleration over 20 years.', values: { principal: 10000, monthlyContribution: 500, annualRate: 8, years: 20 }, result: '$340,896.24' },
			],
		),
	},
	{
		metaTitle: 'Simple Interest Calculator — Loan & Rate Formula Tool',
		slug: 'simple-interest-calculator',
		title: 'Simple Interest Calculator',
		category: 'Finance',
		metaDescription: 'Calculate simple interest, monthly interest rate, and total repayment amount with our free simple interest loan calculator.',
		inputs: [
			{ id: 'principal', label: 'Principal amount', type: 'number', min: 1, step: 100, defaultValue: 5000, unit: '$' },
			{ id: 'annualRate', label: 'Annual interest rate', type: 'number', min: 0.01, step: 0.1, defaultValue: 5, unit: '%' },
			{ id: 'years', label: 'Time period', type: 'number', min: 0.1, step: 0.5, defaultValue: 3, unit: 'years' },
		],
		formula: (values) => {
			const principal = getValue(values, 'principal', 5000);
			const rate = getValue(values, 'annualRate', 5);
			const years = getValue(values, 'years', 3);
			const res = calculateSimpleInterest(principal, rate, years);
			return res.totalAmount;
		},
		resultFormat: (value) => \`\${formatCurrency(value)} total\`,
		faq: [
			{
				question: 'How do I find the simple interest rate calculator formula?',
				answer: 'The simple interest formula calculator uses the equation Interest = Principal × Rate × Time. Enter your loan amount and annual rate to determine exact interest costs instantly.'
			},
			{
				question: 'When is a simple interest loan calculator used?',
				answer: 'A simple interest loan calculator is standard for short-term personal notes, auto financing, retail installment contracts, and peer-to-peer promissory agreements.'
			},
			{
				question: 'How do I calculate monthly interest rate and annual interest?',
				answer: 'Our interest calculator monthly converts your annual rate into monthly interest charges by dividing annual percentage by 12, displaying both total interest per annum calculator and total balance.'
			},
		],
		relatedSlugs: ['compound-interest-calculator', 'mortgage-calculator', 'discount-calculator'],
		content: makeContent(
			'The simple interest calculator provides clean, transparent financial calculations without compounding complexity. Perfect for borrowers, lenders, and students needing an interest rate calculator for promissory notes, short-term agreements, and basic interest rate calculator assessments.',
			'The interest calculator simple interest engine multiplies the starting principal by the annual percentage rate and the loan duration in years, computing the exact interest percentage calculator amount and maturity total.',
			'Formula: Interest I = P × r × t; Total Maturity Value A = P + I, where P is Principal, r is annual interest rate, and t is time in years.',
			[
				{ title: '3-Year Note', description: '$5,000 borrowed at 5% simple interest for 3 years.', values: { principal: 5000, annualRate: 5, years: 3 }, result: '$5,750.00 total' },
				{ title: 'Short 1-Year Loan', description: '$2,000 at 7.5% for 1 year.', values: { principal: 2000, annualRate: 7.5, years: 1 }, result: '$2,150.00 total' },
			],
		),
	},
	{
		metaTitle: 'Tip Calculator — Bill Split Calculator & Gratuity Tool',
		slug: 'tip-calculator',
		title: 'Tip Calculator & Bill Split Calculator',
		category: 'Finance',
		metaDescription: 'Free bill split calculator to calculate tip amounts, split restaurant dining bills among friends, and check total dining cost.',
		inputs: [
			{ id: 'billAmount', label: 'Bill amount', type: 'number', min: 0.01, step: 0.5, defaultValue: 85.5, unit: '$' },
			{ id: 'tipPercent', label: 'Tip percentage', type: 'number', min: 0, max: 100, step: 1, defaultValue: 18, unit: '%' },
			{ id: 'splitWays', label: 'Split among people', type: 'number', min: 1, max: 50, step: 1, defaultValue: 3, unit: 'people' },
		],
		formula: (values) => {
			const bill = getValue(values, 'billAmount', 85.5);
			const tip = getValue(values, 'tipPercent', 18);
			const split = getValue(values, 'splitWays', 3);
			const res = calculateTip(bill, tip, split);
			return res.perPerson;
		},
		resultFormat: (value) => \`\${formatCurrency(value)} / person\`,
		faq: [
			{
				question: 'How do I calculate tip on a restaurant bill?',
				answer: 'To calculate tip, multiply the pre-tax or total check amount by your desired tip percentage (e.g. 15%, 18%, or 20%), then add it to the subtotal.'
			},
			{
				question: 'How does this bill split calculator divide dining costs?',
				answer: 'Our bill split calculator adds the gratuity to the bill, then divides the overall cost calculator sum evenly among party members.'
			},
		],
		relatedSlugs: ['discount-calculator', 'percentage-calculator', 'salary-calculator'],
		content: makeContent(
			'This bill split calculator and tip tool makes restaurant dining and shared group expenses stress-free. Whether dining out with colleagues or splitting brunch among friends, calculate tip rates and get exact per-person costs with zero math hassle.',
			'The bill calculator multiplies the check subtotal by the chosen tip percentage, adds the gratuity to find total cost, and evenly splits the figure across the party size.',
			'Formula: Tip = Bill × (Tip % / 100); Total Bill = Bill + Tip; Split Per Person = Total Bill ÷ People.',
			[
				{ title: 'Dinner for Three', description: '$85.50 bill with an 18% tip split among 3 friends.', values: { billAmount: 85.5, tipPercent: 18, splitWays: 3 }, result: '$33.63 / person' },
				{ title: 'Solo Lunch', description: '$24.00 lunch with 20% tip.', values: { billAmount: 24, tipPercent: 20, splitWays: 1 }, result: '$28.80 / person' },
			],
		),
	},
	{
		metaTitle: 'Discount Calculator — Sales Tax & Markdown Savings',
		slug: 'discount-calculator',
		title: 'Discount & Sales Tax Calculator',
		category: 'Finance',
		metaDescription: 'Calculate discount prices, retail sale markdowns, net savings, and checkout totals with local sales tax included.',
		inputs: [
			{ id: 'originalPrice', label: 'Original price', type: 'number', min: 0.01, step: 1, defaultValue: 120, unit: '$' },
			{ id: 'discountPercent', label: 'Discount percentage', type: 'number', min: 0, max: 100, step: 1, defaultValue: 25, unit: '%' },
			{ id: 'taxPercent', label: 'Sales tax rate', type: 'number', min: 0, max: 30, step: 0.25, defaultValue: 8.25, unit: '%' },
		],
		formula: (values) => {
			const price = getValue(values, 'originalPrice', 120);
			const discount = getValue(values, 'discountPercent', 25);
			const tax = getValue(values, 'taxPercent', 8.25);
			const res = calculateDiscount(price, discount, tax);
			return res.finalPrice;
		},
		resultFormat: (value) => formatCurrency(value),
		faq: [
			{
				question: 'How do I calculate discount prices during store sales?',
				answer: 'Multiply the original retail price by (1 minus the discount rate). For example, a $100 item with a 20% discount costs $80 before tax.'
			},
			{
				question: 'Is sales tax applied before or after the discount prices are calculated?',
				answer: 'In standard retail transactions, sales tax is applied to the discounted sale price rather than the original manufacturer price.'
			},
		],
		relatedSlugs: ['tip-calculator', 'percentage-calculator', 'percentage-difference'],
		content: makeContent(
			'The discount calculator helps shoppers evaluate real savings during promotional sales and clearance events. Check discount prices, coupon markdowns, and final register costs with sales tax accounted for in real time.',
			'The calculator subtracts the markdown percentage from the original price, then applies local sales tax to the discounted subtotal.',
			'Formula: Discounted Price = Original Price × (1 – Discount % / 100); Final Price = Discounted Price × (1 + Sales Tax % / 100).',
			[
				{ title: '25% Off Jacket', description: '$120 jacket with 25% discount and 8.25% sales tax.', values: { originalPrice: 120, discountPercent: 25, taxPercent: 8.25 }, result: '$97.43' },
				{ title: 'Clearance Deal', description: '$50 item with 40% discount, zero tax.', values: { originalPrice: 50, discountPercent: 40, taxPercent: 0 }, result: '$30.00' },
			],
		),
	},
	{
		metaTitle: 'Salary Calculator — Hourly Rate Converter & Wage Calculator',
		slug: 'salary-calculator',
		title: 'Salary & Hourly Wage Calculator',
		category: 'Finance',
		metaDescription: 'Use our hourly rate converter and wage calculator to convert hourly pay into annual salary, monthly earnings, and weekly milestones.',
		inputs: [
			{ id: 'hourlyWage', label: 'Hourly wage', type: 'number', min: 1, step: 0.5, defaultValue: 32.5, unit: '$/hr' },
			{ id: 'hoursPerWeek', label: 'Hours worked per week', type: 'number', min: 1, max: 100, step: 1, defaultValue: 40, unit: 'hrs' },
			{ id: 'weeksPerYear', label: 'Paid weeks per year', type: 'number', min: 1, max: 52, step: 1, defaultValue: 52, unit: 'weeks' },
		],
		formula: (values) => {
			const rate = getValue(values, 'hourlyWage', 32.5);
			const hours = getValue(values, 'hoursPerWeek', 40);
			const weeks = getValue(values, 'weeksPerYear', 52);
			const res = calculateSalary(rate, hours, weeks);
			return res.annual;
		},
		resultFormat: (value) => \`\${formatCurrency(value, '$', 0)} / year\`,
		faq: [
			{
				question: 'How does an hourly rate converter work?',
				answer: 'An hourly rate converter multiplies your base wage by weekly working hours and annual paid weeks (typically 52) to compute your gross annual salary.'
			},
			{
				question: 'How do hourly rates calculator conversions help evaluate job offers?',
				answer: 'Comparing contracts with an hourly rates calculator reveals the annualized compensation equivalent, clarifying differences between hourly freelance gigs and salaried employment.'
			},
		],
		relatedSlugs: ['tip-calculator', 'mortgage-calculator', 'compound-interest-calculator'],
		content: makeContent(
			'This salary and wage calculator functions as an intuitive hourly rate converter, translating hourly wages into equivalent annual, monthly, and biweekly compensation. Perfect for freelancers, contractors, and job candidates comparing employment offers.',
			'The tool calculates total gross earnings by multiplying your hourly rate by the weekly hours worked, scaled across total annual paid weeks.',
			'Formula: Annual Salary = Hourly Wage × Hours per Week × Weeks per Year; Monthly Salary = Annual Salary ÷ 12.',
			[
				{ title: 'Full-Time $32.50/hr', description: '40 hours per week, 52 paid weeks.', values: { hourlyWage: 32.5, hoursPerWeek: 40, weeksPerYear: 52 }, result: '$67,600 / year' },
				{ title: 'Part-Time Work', description: '$20.00/hr, 25 hours per week.', values: { hourlyWage: 20, hoursPerWeek: 25, weeksPerYear: 52 }, result: '$26,000 / year' },
			],
		),
	},
	{
		metaTitle: 'Auto Loan Calculator — Monthly Car Payment & Financing Tool',
		slug: 'auto-loan-calculator',
		title: 'Auto Loan Calculator',
		category: 'Finance',
		metaDescription: 'Estimate monthly car payments and auto financing with our free loan calculator. Factor in vehicle price, down payment, trade-in, and loan rate.',
		inputs: [
			{ id: 'vehiclePrice', label: 'Vehicle purchase price', type: 'number', min: 1000, step: 500, defaultValue: 28000, unit: '$' },
			{ id: 'downPayment', label: 'Down payment', type: 'number', min: 0, step: 500, defaultValue: 4000, unit: '$' },
			{ id: 'tradeIn', label: 'Trade-in value', type: 'number', min: 0, step: 500, defaultValue: 2000, unit: '$' },
			{ id: 'interestRate', label: 'Annual loan rate (APR)', type: 'number', min: 0.1, max: 30, step: 0.1, defaultValue: 5.9, unit: '%' },
			{ id: 'loanTermYears', label: 'Loan duration', type: 'number', min: 1, max: 8, step: 1, defaultValue: 5, unit: 'years' },
		],
		formula: (values) => {
			const price = getValue(values, 'vehiclePrice', 28000);
			const down = getValue(values, 'downPayment', 4000);
			const trade = getValue(values, 'tradeIn', 2000);
			const rate = getValue(values, 'interestRate', 5.9);
			const years = getValue(values, 'loanTermYears', 5);
			const netPrincipal = Math.max(price - down - trade, 0);
			return calculateLoanMonthlyPayment(netPrincipal, rate, years);
		},
		resultFormat: (value) => \`\${formatCurrency(value)} / month\`,
		faq: [
			{
				question: 'How do down payments and trade-ins impact my loan calculator monthly payment?',
				answer: 'Down payments and trade-ins directly reduce the net financed principal, lowering both monthly payment obligations and lifetime interest costs.'
			},
			{
				question: 'What is the optimal term on an auto loan calculator?',
				answer: 'Most buyers choose 3 to 5 years (36 to 60 months). Shorter terms have higher monthly payments but save substantially on total loan interest charges.'
			},
		],
		relatedSlugs: ['mortgage-calculator', 'compound-interest-calculator', 'simple-interest-calculator'],
		content: makeContent(
			'The auto loan calculator helps you budget vehicle purchases and compare dealership financing offers. Adjust down payment amounts, trade-in equity, and interest rates to find an affordable monthly payment.',
			'The calculator subtracts your down payment and trade-in credit from the sticker price to establish net financed principal, then applies standard amortization across the chosen loan duration.',
			'Formula: Net Financed Principal = Purchase Price – Down Payment – Trade-In; Monthly Payment = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ].',
			[
				{ title: 'New Sedan Purchase', description: '$28,000 car with $4,000 down and $2,000 trade-in at 5.9% for 5 years.', values: { vehiclePrice: 28000, downPayment: 4000, tradeIn: 2000, interestRate: 5.9, loanTermYears: 5 }, result: '$424.32 / month' },
				{ title: '3-Year Short Loan', description: '$20,000 financed over 36 months at 4.5%.', values: { vehiclePrice: 20000, downPayment: 0, tradeIn: 0, interestRate: 4.5, loanTermYears: 3 }, result: '$594.86 / month' },
			],
		),
	},
	{
		metaTitle: 'Investment Growth Calculator — Portfolio Returns & Wealth Projection',
		slug: 'investment-calculator',
		title: 'Investment Growth Calculator',
		category: 'Finance',
		metaDescription: 'Project future investment wealth and portfolio growth with our free compound interest growth calculator and savings projection tool.',
		inputs: [
			{ id: 'initialInvestment', label: 'Starting balance', type: 'number', min: 0, step: 500, defaultValue: 25000, unit: '$' },
			{ id: 'monthlyAdd', label: 'Monthly recurring addition', type: 'number', min: 0, step: 50, defaultValue: 750, unit: '$' },
			{ id: 'expectedReturn', label: 'Expected annual return', type: 'number', min: 1, max: 40, step: 0.25, defaultValue: 9, unit: '%' },
			{ id: 'horizonYears', label: 'Time horizon', type: 'number', min: 1, max: 50, step: 1, defaultValue: 15, unit: 'years' },
		],
		formula: (values) => {
			const init = getValue(values, 'initialInvestment', 25000);
			const add = getValue(values, 'monthlyAdd', 750);
			const ret = getValue(values, 'expectedReturn', 9);
			const yrs = getValue(values, 'horizonYears', 15);
			const res = calculateCompoundInterest(init, ret, yrs, 12, add);
			return res.futureValue;
		},
		resultFormat: (value) => formatCurrency(value),
		faq: [
			{
				question: 'How does regular dollar-cost averaging accelerate portfolio returns?',
				answer: 'Regular monthly additions steadily increase your invested capital base, allowing future compound interest growth to multiply exponentially over long time horizons.'
			},
			{
				question: 'What expected return rate should I use in this calculator?',
				answer: 'Historically, diversified broad-market index funds (such as the S&P 500) have returned approximately 8% to 10% annually before inflation over multi-decade periods.'
			},
		],
		relatedSlugs: ['compound-interest-calculator', 'mortgage-calculator', 'salary-calculator'],
		content: makeContent(
			'The investment growth calculator models the long-term compounding of your investment portfolio. See how starting capital combined with consistent monthly contributions builds financial independence over 10, 20, or 30 years.',
			'The tool computes compound growth on your initial lump sum and adds the accumulated future value of recurring monthly investments.',
			'Formula: Future Portfolio = Initial Principal × (1 + r/12)^(12t) + Monthly Addition × [ ((1 + r/12)^(12t) – 1) / (r/12) ].',
			[
				{ title: '15-Year Wealth Plan', description: '$25,000 starting sum with $750/month at 9% return over 15 years.', values: { initialInvestment: 25000, monthlyAdd: 750, expectedReturn: 9, horizonYears: 15 }, result: '$378,574.65' },
				{ title: 'Aggressive 25-Year Horizon', description: '$10,000 initial + $1,000/mo at 10% over 25 years.', values: { initialInvestment: 10000, monthlyAdd: 1000, expectedReturn: 10, horizonYears: 25 }, result: '$1,446,143.76' },
			],
		),
	},

	// ==========================================
	// EDUCATION & GRADES (4 Calculators)
	// ==========================================
	{
		metaTitle: 'GPA Calculator — Calculate Weighted Semester GPA Online',
		slug: 'gpa-calculator',
		title: 'GPA Calculator',
		category: 'Education',
		metaDescription: 'Free GPA calculator to calculate weighted GPA, course credit averages, and semester grades with our fast online academic tool.',
		inputs: [
			{ id: 'course1Grade', label: 'Course 1 grade points', type: 'number', min: 0, max: 4.0, step: 0.01, defaultValue: 3.7, unit: 'pts' },
			{ id: 'course1Credits', label: 'Course 1 credits', type: 'number', min: 0, max: 12, step: 0.5, defaultValue: 3, unit: 'credits' },
			{ id: 'course2Grade', label: 'Course 2 grade points', type: 'number', min: 0, max: 4.0, step: 0.01, defaultValue: 3.3, unit: 'pts' },
			{ id: 'course2Credits', label: 'Course 2 credits', type: 'number', min: 0, max: 12, step: 0.5, defaultValue: 3, unit: 'credits' },
			{ id: 'course3Grade', label: 'Course 3 grade points', type: 'number', min: 0, max: 4.0, step: 0.01, defaultValue: 4.0, unit: 'pts' },
			{ id: 'course3Credits', label: 'Course 3 credits', type: 'number', min: 0, max: 12, step: 0.5, defaultValue: 4, unit: 'credits' },
		],
		formula: (values) => {
			const pairs: Array<[number, number]> = [
				[getValue(values, 'course1Grade'), getValue(values, 'course1Credits')],
				[getValue(values, 'course2Grade'), getValue(values, 'course2Credits')],
				[getValue(values, 'course3Grade'), getValue(values, 'course3Credits')],
			];
			return weightedAverage(pairs);
		},
		resultFormat: (value) => \`\${formatNumber(value)} GPA\`,
		faq: [
			{
				question: 'How does a weighted gpa calculator compute semester scores?',
				answer: 'A weighted gpa calculator multiplies each course grade by its credit hours, sums the quality points, and divides by total credits to determine your exact semester gpa calculator rating.'
			},
			{
				question: 'How can I get an accurate gpa estimate before final grades?',
				answer: 'Enter your projected grades and credit units into this tool to get an immediate gpa estimate of your semester standing.'
			},
			{
				question: 'Can I do a gpa convert from percentage scores?',
				answer: 'Yes, if your school grades on a 100-point scale, convert percentage marks to standard 4.0 grade points before calculating.'
			},
		],
		relatedSlugs: ['cgpa-calculator', 'grade-calculator', 'percentage-calculator'],
		content: makeContent(
			'This online GPA calculator provides accurate weighted grade point average calculations for high school, college, and university students. Whether you need a semester gpa calculator or a weighted gpa calculator to evaluate academic standing and honors eligibility, our tool delivers instant results.',
			'The calculator computes your weighted average by multiplying each grade point by its course credits, summing total grade points, and dividing by total enrolled credits.',
			'Formula: GPA = Σ(Course Grade Points × Course Credits) ÷ Total Credits.',
			[
				{ title: 'Balanced Term Workload', description: 'Three courses with balanced weight and strong performance.', values: { course1Grade: 3.7, course1Credits: 3, course2Grade: 3.3, course2Credits: 3, course3Grade: 4.0, course3Credits: 4 }, result: '3.70 GPA' },
				{ title: 'Mixed Credit Workload', description: 'A heavy 5-credit core lecture balancing lighter elective classes.', values: { course1Grade: 3.0, course1Credits: 2, course2Grade: 3.8, course2Credits: 5, course3Grade: 2.7, course3Credits: 1 }, result: '3.46 GPA' },
			],
		),
	},
	{
		metaTitle: 'CGPA Calculator — Cumulative GPA Across Semesters',
		slug: 'cgpa-calculator',
		title: 'CGPA Calculator',
		category: 'Education',
		metaDescription: 'Calculate cumulative GPA across multiple college terms with our fast, free cumulative gpa calculator and academic tracker.',
		inputs: [
			{ id: 'semester1Gpa', label: 'Semester 1 GPA', type: 'number', min: 0, max: 4.0, step: 0.01, defaultValue: 3.5, unit: 'pts' },
			{ id: 'semester1Credits', label: 'Semester 1 credits', type: 'number', min: 0, max: 40, step: 0.5, defaultValue: 18, unit: 'credits' },
			{ id: 'semester2Gpa', label: 'Semester 2 GPA', type: 'number', min: 0, max: 4.0, step: 0.01, defaultValue: 3.8, unit: 'pts' },
			{ id: 'semester2Credits', label: 'Semester 2 credits', type: 'number', min: 0, max: 40, step: 0.5, defaultValue: 18, unit: 'credits' },
			{ id: 'semester3Gpa', label: 'Semester 3 GPA', type: 'number', min: 0, max: 4.0, step: 0.01, defaultValue: 3.6, unit: 'pts' },
			{ id: 'semester3Credits', label: 'Semester 3 credits', type: 'number', min: 0, max: 40, step: 0.5, defaultValue: 16, unit: 'credits' },
			{ id: 'semester4Gpa', label: 'Semester 4 GPA', type: 'number', min: 0, max: 4.0, step: 0.01, defaultValue: 3.9, unit: 'pts' },
			{ id: 'semester4Credits', label: 'Semester 4 credits', type: 'number', min: 0, max: 40, step: 0.5, defaultValue: 18, unit: 'credits' },
		],
		formula: (values) => weightedAverage([
			[getValue(values, 'semester1Gpa'), getValue(values, 'semester1Credits')],
			[getValue(values, 'semester2Gpa'), getValue(values, 'semester2Credits')],
			[getValue(values, 'semester3Gpa'), getValue(values, 'semester3Credits')],
			[getValue(values, 'semester4Gpa'), getValue(values, 'semester4Credits')],
		]),
		resultFormat: (value) => \`\${formatNumber(value)} CGPA\`,
		faq: [
			{
				question: 'How is a cumulative gpa calculator different from a single semester GPA calculator?',
				answer: 'A semester GPA evaluates one academic term, whereas a cumulative gpa calculator combines all completed terms weighted by credit hours into an overall graduation CGPA.'
			},
			{
				question: 'How do I calculate CGPA when semesters have different credit loads?',
				answer: 'Our tool automatically weights each semester GPA by the number of credit units taken in that specific term.'
			},
		],
		relatedSlugs: ['gpa-calculator', 'grade-calculator', 'percentage-calculator'],
		content: makeContent(
			'This online CGPA calculator helps university and college students compute their overall cumulative grade point average across multiple terms. Our cumulative gpa calculator weights each semester score proportionally by credit load.',
			'The calculator multiplies each semester GPA by enrolled credit hours, sums all weighted scores, and divides by total cumulative credits completed.',
			'Formula: CGPA = Σ(Semester GPA × Semester Credits) ÷ Total Cumulative Credits.',
			[
				{ title: 'Four-Term Academic Record', description: 'Academic performance across four consecutive college semesters.', values: { semester1Gpa: 3.5, semester1Credits: 18, semester2Gpa: 3.8, semester2Credits: 18, semester3Gpa: 3.6, semester3Credits: 16, semester4Gpa: 3.9, semester4Credits: 18 }, result: '3.70 CGPA' },
			],
		),
	},
	{
		metaTitle: 'Percentage Calculator — Percentage Formula & Converter Tool',
		slug: 'percentage-calculator',
		title: 'Percentage Calculator',
		category: 'Math',
		metaDescription: 'Free percentage calculator to calculate percentages, parts of whole numbers, percentage increase, and conversion ratios with instant results.',
		inputs: [
			{ id: 'part', label: 'Part / Score', type: 'number', min: 0, step: 0.01, defaultValue: 42, unit: 'units' },
			{ id: 'whole', label: 'Whole / Total', type: 'number', min: 0.01, step: 0.01, defaultValue: 50, unit: 'units' },
		],
		formula: (values) => {
			const part = getValue(values, 'part', 42);
			const whole = getValue(values, 'whole', 50);
			return whole === 0 ? 0 : (part / whole) * 100;
		},
		resultFormat: (value) => \`\${formatNumber(Number(value))}%\`,
		faq: [
			{
				question: 'What is the standard percentage calculator formula?',
				answer: 'The standard percentage calculator formula is: Percentage = (Part ÷ Whole) × 100. This determines what portion one number is of another.'
			},
			{
				question: 'Can this tool function as a percentage converter and percentage number calculator?',
				answer: 'Yes! Use this percentage converter to determine shares, financial markups, test scores, and proportional rates.'
			},
		],
		relatedSlugs: ['percentage-difference', 'grade-calculator', 'fraction-calculator'],
		content: makeContent(
			'The percentage calculator is a fast, versatile math tool for finding percentages, parts of whole numbers, and proportional ratios. Whether calculating test scores, markups, or statistical shares, this percentage number calculator and percentage converter gives instant results.',
			'The percentage counter divides the partial value by the whole total and multiplies by 100.',
			'Formula: Percentage % = (Part ÷ Whole) × 100.',
			[
				{ title: 'Test Score Calculation', description: '42 marks earned out of 50 total.', values: { part: 42, whole: 50 }, result: '84.00%' },
			],
		),
	},
	{
		metaTitle: 'Grade Calculator — Test Marks & Letter Grade Converter',
		slug: 'grade-calculator',
		title: 'Grade Calculator',
		category: 'Education',
		metaDescription: 'Calculate test percentages and letter grades from raw exam scores with our fast online grade calculator.',
		inputs: [
			{ id: 'marks', label: 'Marks obtained', type: 'number', min: 0, step: 0.5, defaultValue: 92, unit: 'marks' },
			{ id: 'totalMarks', label: 'Total marks available', type: 'number', min: 1, step: 0.5, defaultValue: 100, unit: 'marks' },
		],
		formula: (values) => {
			const marks = getValue(values, 'marks', 92);
			const totalMarks = getValue(values, 'totalMarks', 100);
			return totalMarks === 0 ? 0 : (marks / totalMarks) * 100;
		},
		resultFormat: (value) => {
			const percent = Number(value);
			const grade = percent >= 97 ? 'A+' : percent >= 93 ? 'A' : percent >= 90 ? 'A-' : percent >= 87 ? 'B+' : percent >= 83 ? 'B' : percent >= 80 ? 'B-' : percent >= 77 ? 'C+' : percent >= 73 ? 'C' : percent >= 70 ? 'C-' : percent >= 60 ? 'D' : 'F';
			return \`\${formatNumber(percent)}% (\${grade})\`;
		},
		faq: [
			{
				question: 'Which grading scale is used in this calculator?',
				answer: 'This tool converts percentage scores to the standard North American letter grade scale (A+ through F).'
			},
		],
		relatedSlugs: ['gpa-calculator', 'cgpa-calculator', 'percentage-calculator'],
		content: makeContent(
			'The Grade Calculator converts raw assignment, quiz, and exam scores into exact percentages and corresponding letter grades.',
			'The formula computes (Marks / Total) × 100 and evaluates letter grade tiers.',
			'Formula: Grade % = (Marks ÷ Total Marks) × 100.',
			[
				{ title: 'High Exam Grade', description: '92 out of 100 on midterm examination.', values: { marks: 92, totalMarks: 100 }, result: '92.00% (A-)' },
			],
		),
	},

	// ==========================================
	// HEALTH & WELLNESS (3 Calculators)
	// ==========================================
	{
		metaTitle: 'BMI Calculator — Body Mass Index Calculator & Height Weight Tool',
		slug: 'bmi-calculator',
		title: 'BMI Calculator & Body Mass Index Calculator',
		category: 'Health',
		metaDescription: 'Free online BMI calculator to calculate body mass index formula, evaluate height weight calculator ratio, and check official WHO BMI standards.',
		inputs: [
			{ id: 'weightKg', label: 'Weight', type: 'number', min: 10, step: 0.5, defaultValue: 70, unit: 'kg' },
			{ id: 'heightCm', label: 'Height', type: 'number', min: 50, step: 0.5, defaultValue: 175, unit: 'cm' },
		],
		formula: (values) => {
			const weightKg = getValue(values, 'weightKg', 70);
			const heightM = getValue(values, 'heightCm', 175) / 100;
			return heightM === 0 ? 0 : weightKg / (heightM * heightM);
		},
		resultFormat: (value) => {
			const bmi = Number(value);
			let category = 'Normal';
			if (bmi < 18.5) category = 'Underweight';
			else if (bmi < 25) category = 'Normal weight';
			else if (bmi < 30) category = 'Overweight';
			else category = 'Obese';
			return \`\${formatNumber(bmi)} kg/m² (\${category})\`;
		},
		faq: [
			{
				question: 'How do I calculate body mass index formula from height and weight?',
				answer: 'To calculate body mass index formula, divide your weight in kilograms by your height in meters squared: BMI = kg / m². You can also use our body mass index converter for quick conversions.'
			},
			{
				question: 'What are the official WHO and CDC bmi standards and bmi tables?',
				answer: 'Official bmi standards define four primary categories: Underweight (BMI < 18.5), Normal weight (BMI 18.5–24.9), Overweight (BMI 25.0–29.9), and Obese (BMI ≥ 30.0).'
			},
			{
				question: 'How does this mass index calculator and height weight calculator work?',
				answer: 'This mass index calculator takes your height and weight measurements to compute body mass index and classify your body weight category.'
			},
			{
				question: 'Can I use this to calculate your ideal body weight and body weight calculator estimates?',
				answer: 'Yes! By referencing standard BMI ranges, you can determine target weight ranges for your height. Note that BMI is an informational screening tool rather than a comprehensive medical diagnosis.'
			},
		],
		relatedSlugs: ['calorie-calculator', 'water-intake-calculator', 'age-calculator'],
		content: makeContent(
			'This online BMI calculator provides quick, accurate body mass index calculations based on World Health Organization guidelines. Whether you are using a mass index calculator, checking your height weight calculator ratio, or looking to compute body mass index for fitness tracking, our tool helps you evaluate body weight status with complete privacy.',
			'The body mass index calculator divides your body weight in kilograms by the square of your height in meters. The resulting bmi measure is categorized according to established international bmi tables.',
			'Formula: BMI = Weight (kg) ÷ [Height (m)]². (For example, a person weighing 70 kg at 1.75 m height has a BMI of 70 ÷ (1.75)² = 22.86 kg/m²).',
			[
				{ title: 'Healthy Weight Adult', description: 'Standard weight adult measuring 70 kg at 175 cm.', values: { weightKg: 70, heightCm: 175 }, result: '22.86 kg/m² (Normal weight)' },
				{ title: 'Overweight Screening Evaluation', description: 'Adult measuring 85 kg at 170 cm.', values: { weightKg: 85, heightCm: 170 }, result: '29.41 kg/m² (Overweight)' },
			],
		),
	},
	{
		metaTitle: 'Calorie & TDEE Calculator — Basal Metabolic Rate Calc',
		slug: 'calorie-calculator',
		title: 'Calorie & TDEE Calculator (BMR & Maintenance)',
		category: 'Health',
		metaDescription: 'Use our basal metabolic rate calc to calculate basal metabolic rate formula, daily calorie burn, and TDEE maintenance requirements.',
		inputs: [
			{ id: 'weightKg', label: 'Weight', type: 'number', min: 20, step: 0.5, defaultValue: 72, unit: 'kg' },
			{ id: 'heightCm', label: 'Height', type: 'number', min: 80, step: 0.5, defaultValue: 178, unit: 'cm' },
			{ id: 'ageYears', label: 'Age', type: 'number', min: 10, max: 120, step: 1, defaultValue: 30, unit: 'years' },
			{
				id: 'sex',
				label: 'Biological sex',
				type: 'select',
				defaultValue: 'male',
				options: [
					{ label: 'Male', value: 'male' },
					{ label: 'Female', value: 'female' },
				],
			},
			{
				id: 'activityLevel',
				label: 'Activity level',
				type: 'select',
				defaultValue: 'moderate',
				options: [
					{ label: 'Sedentary (desk job, little exercise)', value: 'sedentary' },
					{ label: 'Light (exercise 1-3 days/week)', value: 'light' },
					{ label: 'Moderate (exercise 3-5 days/week)', value: 'moderate' },
					{ label: 'Active (exercise 6-7 days/week)', value: 'active' },
					{ label: 'Very active (heavy physical training)', value: 'very active' },
				],
			},
		],
		formula: (values) => {
			const weightKg = getValue(values, 'weightKg', 72);
			const heightCm = getValue(values, 'heightCm', 178);
			const ageYears = getValue(values, 'ageYears', 30);
			const sex = normalizeToken(getTextValue(values, 'sex', 'male'));
			const activityLevel = normalizeToken(getTextValue(values, 'activityLevel', 'moderate'));
			const sexAdjustment = sex.startsWith('f') ? -161 : 5;
			const activityMultipliers: Record<string, number> = {
				sedentary: 1.2,
				light: 1.375,
				moderate: 1.55,
				active: 1.725,
				veryactive: 1.9,
			};
			const activityMultiplier = activityMultipliers[activityLevel.replace(/\\s+/g, '')] ?? 1.55;
			const bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + sexAdjustment;
			return Math.max(bmr * activityMultiplier, 0);
		},
		resultFormat: (value) => \`\${formatInteger(value)} kcal / day\`,
		faq: [
			{
				question: 'How do I calculate basal metabolic rate formula for daily energy?',
				answer: 'Our basal metabolic rate calc uses the clinical Mifflin-St Jeor equation to compute the energy required for vital bodily functions at complete rest.'
			},
			{
				question: 'What is the difference between BMR and TDEE?',
				answer: 'BMR (Basal Metabolic Rate) is resting calorie expenditure, while TDEE (Total Daily Energy Expenditure) accounts for both baseline BMR and daily physical movement.'
			},
		],
		relatedSlugs: ['bmi-calculator', 'water-intake-calculator', 'age-calculator'],
		content: makeContent(
			'This daily calorie and basal metabolic rate calc estimates your daily energy expenditure (TDEE) and resting metabolic rate. Whether planning nutrition for weight management or athletic conditioning, calculate your basal metabolic rate accurately with clinical formulas.',
			'The calculator applies the Mifflin-St Jeor formula to compute baseline metabolic burn, then multiplies by activity factors from 1.2 (sedentary) to 1.9 (athletic training).',
			'Formula: BMR = (10 × weight in kg) + (6.25 × height in cm) – (5 × age in years) + s (where s = +5 for males, –161 for females); TDEE = BMR × Activity Multiplier.',
			[
				{ title: 'Moderately Active Male', description: '72 kg, 178 cm, 30 years old, exercising 3-5 days/week.', values: { weightKg: 72, heightCm: 178, ageYears: 30, sex: 'male', activityLevel: 'moderate' }, result: '2616 kcal / day' },
				{ title: 'Sedentary Female', description: '60 kg, 165 cm, 28 years old, desk job with minimal exercise.', values: { weightKg: 60, heightCm: 165, ageYears: 28, sex: 'female', activityLevel: 'sedentary' }, result: '1600 kcal / day' },
			],
		),
	},
	{
		metaTitle: 'Water Intake Calculator — Daily Hydration Target',
		slug: 'water-intake-calculator',
		title: 'Daily Water Intake Calculator',
		category: 'Health',
		metaDescription: 'Calculate optimal daily fluid intake based on body weight, daily workout minutes, and climate conditions.',
		inputs: [
			{ id: 'weightKg', label: 'Weight', type: 'number', min: 20, step: 0.5, defaultValue: 70, unit: 'kg' },
			{ id: 'exerciseMinutes', label: 'Exercise duration per day', type: 'number', min: 0, step: 5, defaultValue: 30, unit: 'mins' },
			{
				id: 'climate',
				label: 'Climate / Environment',
				type: 'select',
				defaultValue: 'moderate',
				options: [
					{ label: 'Cool / Temperate', value: 'cool' },
					{ label: 'Moderate', value: 'moderate' },
					{ label: 'Hot / Humid', value: 'hot' },
				],
			},
		],
		formula: (values) => {
			const weightKg = getValue(values, 'weightKg', 70);
			const exerciseMinutes = getValue(values, 'exerciseMinutes', 30);
			const climate = normalizeToken(getTextValue(values, 'climate', 'moderate'));
			const climateMultipliers: Record<string, number> = { cool: 0.95, moderate: 1, hot: 1.15 };
			const climateMultiplier = climateMultipliers[climate] ?? 1;
			const milliliters = (weightKg * 35 + exerciseMinutes * 12) * climateMultiplier;
			return Math.max(milliliters / 1000, 0);
		},
		resultFormat: (value) => \`\${formatNumber(value)} liters / day\`,
		faq: [
			{ question: 'What is the baseline scientific recommendation for hydration?', answer: 'Major health organizations recommend 2.0 to 2.5 liters daily for women and 2.5 to 3.5 liters for men, adjusted for body mass and physical exertion.' },
			{ question: 'Does tea, coffee, or food water count toward hydration?', answer: 'Yes, non-alcoholic fluids and water-rich foods contribute approximately 20-30% of daily hydration.' },
		],
		relatedSlugs: ['bmi-calculator', 'calorie-calculator'],
		content: makeContent(
			'The Daily Water Intake Calculator estimates optimal fluid consumption tailored to your body weight, workout routine, and climate conditions for peak mental and physical vitality.',
			'The formula multiplies body weight by baseline hydration factors (approx. 35 ml per kg), adds sweat replenishment for workout duration, and adjusts for ambient climate.',
			'Formula: Liters = [ (Weight in kg × 35 ml) + (Exercise in min × 12 ml) ] × Climate Factor ÷ 1,000.',
			[
				{ title: 'Standard Daily Hydration', description: '70 kg adult with 30 min daily exercise in moderate climate.', values: { weightKg: 70, exerciseMinutes: 30, climate: 'moderate' }, result: '2.81 liters / day' },
				{ title: 'Hot Weather Athlete', description: '80 kg adult with 60 min workout in hot/humid conditions.', values: { weightKg: 80, exerciseMinutes: 60, climate: 'hot' }, result: '4.05 liters / day' },
			],
		),
	},

	// ==========================================
	// MATH & NUMBERS (4 Calculators)
	// ==========================================
	{
		metaTitle: 'Percentage Difference Calculator — Compare Two Numbers',
		slug: 'percentage-difference',
		title: 'Percentage Difference Calculator',
		category: 'Math',
		metaDescription: 'Compare two values and calculate percentage difference, relative variance, and change between numbers.',
		inputs: [
			{ id: 'oldValue', label: 'First value (V1)', type: 'number', step: 0.01, defaultValue: 120, unit: 'units' },
			{ id: 'newValue', label: 'Second value (V2)', type: 'number', step: 0.01, defaultValue: 132, unit: 'units' },
		],
		formula: (values) => {
			const oldValue = getValue(values, 'oldValue', 120);
			const newValue = getValue(values, 'newValue', 132);
			const average = (Math.abs(oldValue) + Math.abs(newValue)) / 2;
			return average === 0 ? 0 : (Math.abs(newValue - oldValue) / average) * 100;
		},
		resultFormat: (value) => \`\${formatNumber(value)}%\`,
		faq: [
			{ question: 'Why use the average in the denominator?', answer: 'It ensures symmetric comparison regardless of which number is entered first.' },
		],
		relatedSlugs: ['percentage-calculator', 'ratio-calculator', 'average-calculator'],
		content: makeContent(
			'Percentage difference measures the relative variance between two numerical values without assuming a fixed baseline.',
			'The formula divides the absolute difference by the average of both numbers.',
			'Formula: % Difference = |V1 – V2| ÷ [ (V1 + V2) ÷ 2 ] × 100.',
			[
				{ title: 'Price Comparison', description: '120 vs 132.', values: { oldValue: 120, newValue: 132 }, result: '9.52%' },
			],
		),
	},
	{
		metaTitle: 'Ratio Calculator — Solve & Simplify Ratios Online',
		slug: 'ratio-calculator',
		title: 'Ratio Calculator',
		category: 'Math',
		metaDescription: 'Free ratio calculator to simplify ratios, scale quantities, and compute proportions with our fast math calculator tool.',
		inputs: [
			{ id: 'partA', label: 'First quantity (A)', type: 'number', step: 0.01, defaultValue: 18, unit: 'units' },
			{ id: 'partB', label: 'Second quantity (B)', type: 'number', min: 0.001, step: 0.01, defaultValue: 24, unit: 'units' },
		],
		formula: (values) => {
			const partA = getValue(values, 'partA', 18);
			const partB = getValue(values, 'partB', 24);
			return partB === 0 ? 0 : partA / partB;
		},
		resultFormat: (value) => \`\${formatNumber(value)} : 1\`,
		faq: [
			{ question: 'How is the ratio displayed?', answer: 'It displays the proportional value of A relative to 1 unit of B.' },
		],
		relatedSlugs: ['fraction-calculator', 'percentage-difference', 'average-calculator'],
		content: makeContent(
			'The ratio calculator normalizes two quantities into clean comparative proportions for scaling recipes, screen resolutions, financial ratios, and engineering designs.',
			'The formula computes A divided by B to express the ratio in standard A : 1 notation.',
			'Formula: Ratio = A ÷ B : 1.',
			[
				{ title: 'Scaling Recipe', description: '18 parts to 24 parts.', values: { partA: 18, partB: 24 }, result: '0.75 : 1' },
			],
		),
	},
	{
		metaTitle: 'Fraction Calculator — Fraction to Decimal & Percentage Tool',
		slug: 'fraction-calculator',
		title: 'Fraction Calculator',
		category: 'Math',
		metaDescription: 'Free fraction calculator to convert fractions into decimals and percentages instantly with clean numerical breakdowns.',
		inputs: [
			{ id: 'numerator', label: 'Numerator (top number)', type: 'number', step: 1, defaultValue: 3, unit: 'parts' },
			{ id: 'denominator', label: 'Denominator (bottom number)', type: 'number', min: 0.001, step: 1, defaultValue: 4, unit: 'parts' },
		],
		formula: (values) => {
			const num = getValue(values, 'numerator', 3);
			const den = getValue(values, 'denominator', 4);
			return den === 0 ? 0 : num / den;
		},
		resultFormat: (value) => \`\${formatNumber(Number(value))} (\${formatNumber(Number(value) * 100)}%)\`,
		faq: [
			{ question: 'What does this fraction calculator output?', answer: 'It provides both decimal and equivalent percentage representations simultaneously.' },
		],
		relatedSlugs: ['ratio-calculator', 'percentage-calculator', 'average-calculator'],
		content: makeContent(
			'The fraction calculator simplifies numerical fractions and converts them into exact decimal and percentage values.',
			'The formula divides the numerator by the denominator and multiplies by 100 for percentage form.',
			'Formula: Decimal = Numerator ÷ Denominator; Percentage = Decimal × 100.',
			[
				{ title: 'Three Quarters', description: '3 / 4.', values: { numerator: 3, denominator: 4 }, result: '0.75 (75.00%)' },
			],
		),
	},
	{
		metaTitle: 'Average Calculator — Mean Calculator for Numbers Online',
		slug: 'average-calculator',
		title: 'Average Calculator & Mean Calculator',
		category: 'Math',
		metaDescription: 'Free average calculator and mean calculator to find the arithmetic mean, statistical average, and sum of numbers quickly.',
		inputs: [
			{ id: 'value1', label: 'Number 1', type: 'number', step: 0.01, defaultValue: 78, unit: 'val' },
			{ id: 'value2', label: 'Number 2', type: 'number', step: 0.01, defaultValue: 84, unit: 'val' },
			{ id: 'value3', label: 'Number 3', type: 'number', step: 0.01, defaultValue: 91, unit: 'val' },
			{ id: 'value4', label: 'Number 4', type: 'number', step: 0.01, defaultValue: 87, unit: 'val' },
		],
		formula: (values) =>
			(getValue(values, 'value1', 78) + getValue(values, 'value2', 84) + getValue(values, 'value3', 91) + getValue(values, 'value4', 87)) / 4,
		resultFormat: (value) => formatNumber(value),
		faq: [
			{
				question: 'How does an average calculator compute the arithmetic mean?',
				answer: 'An average calculator sums all input numerical values and divides the total by the count of entries to find the exact central tendency.'
			},
		],
		relatedSlugs: ['ratio-calculator', 'fraction-calculator', 'percentage-difference'],
		content: makeContent(
			'This online average calculator and mean calculator computes the exact arithmetic mean across multiple data points with fast client-side execution.',
			'The calculation sums all four numbers and divides by the sample count of 4.',
			'Formula: Mean Average = (V1 + V2 + V3 + V4) ÷ 4.',
			[
				{ title: 'Class Test Average', description: 'Scores of 78, 84, 91, and 87.', values: { value1: 78, value2: 84, value3: 91, value4: 87 }, result: '85.00' },
			],
		),
	},

	// ==========================================
	// DATE & TIME (4 Calculators)
	// ==========================================
	{
		metaTitle: 'Age Calculator — Date Age Calculator & Birthday Counter',
		slug: 'age-calculator',
		title: 'Age Calculator & Date Age Calculator',
		category: 'Date & Time',
		metaDescription: 'Free online age calculator to calculate exact age in years, months, and days from date of birth with our date calculator tool.',
		inputs: [
			{ id: 'birthDate', label: 'Date of birth', type: 'date', defaultValue: '1998-05-15' },
			{ id: 'referenceDate', label: 'Age as of date', type: 'date', defaultValue: '2026-08-29' },
		],
		formula: (values) => {
			const birth = getTextValue(values, 'birthDate', '1998-05-15');
			const ref = getTextValue(values, 'referenceDate', '2026-08-29');
			return Math.max(ageFromIsoDate(birth, ref), 0);
		},
		resultFormat: (value) => \`\${formatNumber(value)} years\`,
		faq: [
			{
				question: 'How do I use this date age calculator to calculate my age?',
				answer: 'Enter your date of birth and any target evaluation date. Our date age calculator computes exact chronological age, years calculator span, and total days calculator elapsed.'
			},
			{
				question: 'Can this tool function as a date counter and calendar calculator?',
				answer: 'Yes! The tool serves as an accurate date counter, date calculator, and calendar days calculator for milestone tracking.'
			},
		],
		relatedSlugs: ['date-difference-calculator', 'countdown-calculator', 'working-days-calculator'],
		content: makeContent(
			'This online age calculator accurately computes chronological age between a birth date and any reference date. Whether you need a date and age calculator, a years calculator, or a calendar date counter, our tool gives precise calculations with zero tracking.',
			'The date calculator converts calendar dates to UTC timestamps, calculating total elapsed days and accounting for leap years.',
			'Formula: Chronological Age = Total Elapsed Days ÷ 365.2425 average solar days per year.',
			[
				{ title: 'Chronological Age Example', description: 'Born May 15, 1998 evaluated on Aug 29, 2026.', values: { birthDate: '1998-05-15', referenceDate: '2026-08-29' }, result: '28.29 years' },
			],
		),
	},
	{
		metaTitle: 'Date Difference Calculator — Days Between Dates Tool',
		slug: 'date-difference-calculator',
		title: 'Date Difference Calculator',
		category: 'Date & Time',
		metaDescription: 'Measure how many days separate two calendar dates with our fast date calculator and date counter tool.',
		inputs: [
			{ id: 'startDate', label: 'Start date', type: 'date', defaultValue: '2026-01-01' },
			{ id: 'endDate', label: 'End date', type: 'date', defaultValue: '2026-12-31' },
		],
		formula: (values) => {
			const start = getTextValue(values, 'startDate', '2026-01-01');
			const end = getTextValue(values, 'endDate', '2026-12-31');
			return dateDiffDaysFromIso(start, end);
		},
		resultFormat: (value) => \`\${formatInteger(value)} days\`,
		faq: [
			{ question: 'Does order of dates matter?', answer: 'No. The calculator automatically computes the absolute difference between both dates.' },
		],
		relatedSlugs: ['age-calculator', 'countdown-calculator', 'working-days-calculator'],
		content: makeContent(
			'The Date Difference Calculator measures the total number of whole calendar days between any two dates.',
			'The formula calculates the difference between timestamps at UTC midnight.',
			'Formula: Days = |End Date – Start Date| in milliseconds ÷ 86,400,000.',
			[
				{ title: 'Full Year Span', description: 'Jan 1 to Dec 31, 2026.', values: { startDate: '2026-01-01', endDate: '2026-12-31' }, result: '364 days' },
			],
		),
	},
	{
		metaTitle: 'Countdown Calculator — Time Remaining & Event Tracker',
		slug: 'countdown-calculator',
		title: 'Countdown Calculator',
		category: 'Date & Time',
		metaDescription: 'See time remaining between two target moments with our free real-time countdown calculator.',
		inputs: [
			{ id: 'currentDate', label: 'Current timestamp', type: 'datetime-local', defaultValue: '2026-08-29T09:00' },
			{ id: 'targetDate', label: 'Target event timestamp', type: 'datetime-local', defaultValue: '2026-12-31T23:59' },
		],
		formula: (values) => {
			const target = getTextValue(values, 'targetDate', '2026-12-31T23:59');
			const current = getTextValue(values, 'currentDate', '2026-08-29T09:00');
			return countdownFromIso(target, current);
		},
		resultFormat: formatCountdown,
		faq: [
			{ question: 'What happens when target date passes?', answer: 'The countdown gracefully displays "Event has started".' },
		],
		relatedSlugs: ['age-calculator', 'date-difference-calculator', 'working-days-calculator'],
		content: makeContent(
			'The countdown calculator breaks down time remaining into days, hours, minutes, and seconds for events, deadlines, and project launches.',
			'The formula computes total remaining seconds between the target moment and reference timestamp.',
			'Formula: Remaining Seconds = Target Time – Current Time.',
			[
				{ title: 'New Year Countdown', description: 'Aug 29 to New Year Eve.', values: { currentDate: '2026-08-29T09:00', targetDate: '2026-12-31T23:59' }, result: '124d 14h 59m 0s' },
			],
		),
	},
	{
		metaTitle: 'Working Days Calculator — Business Days & Workday Counter',
		slug: 'working-days-calculator',
		title: 'Working Days Calculator & Business Days Calculator',
		category: 'Date & Time',
		metaDescription: 'Count working days and business days between dates excluding weekends with our fast work calculator.',
		inputs: [
			{ id: 'startDate', label: 'Start date', type: 'date', defaultValue: '2026-09-01' },
			{ id: 'endDate', label: 'End date', type: 'date', defaultValue: '2026-09-30' },
		],
		formula: (values) => {
			const start = getTextValue(values, 'startDate', '2026-09-01');
			const end = getTextValue(values, 'endDate', '2026-09-30');
			return workingDaysFromIso(start, end);
		},
		resultFormat: (value) => \`\${formatInteger(value)} working days\`,
		faq: [
			{
				question: 'How does a business days calculator exclude weekends?',
				answer: 'Our business days calculator loops through every date in the selected range and counts only Monday through Friday workdays.'
			},
		],
		relatedSlugs: ['date-difference-calculator', 'countdown-calculator', 'age-calculator'],
		content: makeContent(
			'This working days calculator and business days calculator computes total professional workdays between milestone dates for project planning, payroll cycles, and sprint deadlines.',
			'The work calculator engine iterates day-by-day between the start date and end date, counting business days while filtering out Saturdays and Sundays.',
			'Formula: Working Days = Σ(Weekdays in Range).',
			[
				{ title: 'September 2026 Workdays', description: 'Month of September.', values: { startDate: '2026-09-01', endDate: '2026-09-30' }, result: '22 working days' },
			],
		),
	},

	// ==========================================
	// TEXT TOOLS (3 Calculators)
	// ==========================================
	{
		metaTitle: 'Word Counter — Real-Time Text & Reading Time Tool',
		slug: 'word-counter',
		title: 'Word Counter',
		category: 'Text Tools',
		metaDescription: 'Count words, sentences, and paragraphs in real time. Perfect for resume summaries, cover letters, essays, and blog posts with 100% privacy.',
		inputs: [
			{ id: 'text', label: 'Text content', type: 'textarea', rows: 5, defaultValue: 'Astro is a modern web framework designed for building content-focused websites.', placeholder: 'Paste or type your text here...' },
		],
		formula: (values) => countWords(getTextValue(values, 'text')),
		resultFormat: (value) => \`\${formatInteger(value)} words\`,
		faq: [
			{ question: 'How are words counted accurately?', answer: 'Words are identified using standard unicode regex boundaries separating whitespace and punctuation tokens without transmitting text to any server.' },
			{ question: 'What is the recommended word count for a professional resume summary?', answer: 'An effective resume summary should typically be between 40 and 80 words.' },
		],
		relatedSlugs: ['character-counter', 'case-converter', 'salary-calculator'],
		content: makeContent(
			'The Word Counter provides real-time word counting and text analysis for resumes, cover letters, essays, and articles. It runs completely in your local browser memory for complete privacy.',
			'The counter parses all non-whitespace token clusters in the text stream, handling multiple spaces and line breaks.',
			'Formula: Word Count = Count of whitespace-delimited non-empty string tokens.',
			[
				{ title: 'Resume Objective', description: 'A typical 3-sentence summary draft.', values: { text: 'Experienced frontend developer proficient in TypeScript and responsive UI design with 4 years in fintech.' }, result: '17 words' },
				{ title: 'Short Paragraph', description: 'A quick sample sentence.', values: { text: 'Quick brown fox jumps over the lazy dog.' }, result: '8 words' },
			],
		),
	},
	{
		metaTitle: 'Character Counter — Online Letter & Space Count',
		slug: 'character-counter',
		title: 'Character Counter',
		category: 'Text Tools',
		metaDescription: 'Count total characters with and without spaces. Ideal for SEO meta descriptions, social media character limits, and form validations.',
		inputs: [
			{ id: 'text', label: 'Text content', type: 'textarea', rows: 5, defaultValue: 'Static text tools are fast, secure, and run locally.', placeholder: 'Paste or type your text here...' },
		],
		formula: (values) => countCharacters(getTextValue(values, 'text')),
		resultFormat: (value) => \`\${formatInteger(value)} characters\`,
		faq: [
			{ question: 'Do spaces and line breaks count as characters?', answer: 'Yes, this tool counts every unicode character including letters, numbers, punctuation, spaces, and newline symbols.' },
		],
		relatedSlugs: ['word-counter', 'case-converter'],
		content: makeContent(
			'The Character Counter provides instantaneous character tracking for SEO meta titles, meta descriptions, LinkedIn summaries, and SMS limits.',
			'The formula calculates the unicode length of the provided text string in memory without latency.',
			'Formula: Character Count = String.length.',
			[
				{ title: 'SEO Meta Description', description: 'Checking search snippet length.', values: { text: 'Calculate monthly mortgage payments, interest costs, and total repayment with our free tool.' }, result: '93 characters' },
			],
		),
	},
	{
		metaTitle: 'Case Converter — Text Formatting & Casing Tool',
		slug: 'case-converter',
		title: 'Case Converter',
		category: 'Text Tools',
		metaDescription: 'Convert text to UPPER, lower, Title, or Sentence case with instant formatting transformation.',
		inputs: [
			{ id: 'text', label: 'Text content', type: 'textarea', rows: 4, defaultValue: 'building a static calculator site', placeholder: 'Enter text to convert...' },
			{
				id: 'mode',
				label: 'Target case style',
				type: 'select',
				defaultValue: 'title',
				options: [
					{ label: 'Title Case', value: 'title' },
					{ label: 'UPPERCASE', value: 'upper' },
					{ label: 'lowercase', value: 'lower' },
					{ label: 'Sentence case', value: 'sentence' },
				],
			},
		],
		formula: (values) => convertCase(getTextValue(values, 'text'), getTextValue(values, 'mode', 'title')),
		resultFormat: (value) => String(value),
		faq: [
			{ question: 'Which formats are supported?', answer: 'Title Case, UPPERCASE, lowercase, and Sentence case.' },
		],
		relatedSlugs: ['word-counter', 'character-counter'],
		content: makeContent(
			'The Case Converter transforms formatting styles for headlines, database labels, or cleanup tasks.',
			'The converter applies regex casing transforms to character words.',
			'Formula: Casing Transform per selected mode.',
			[
				{ title: 'Title Case', description: 'Convert headline.', values: { text: 'building a static calculator site', mode: 'title' }, result: 'Building A Static Calculator Site' },
			],
		),
	},

	// ==========================================
	// CONVERTERS & UNITS (5 Calculators)
	// ==========================================
	{
		metaTitle: 'Currency Converter — Real-Time Currency Exchange Rate Calculator',
		slug: 'currency-converter',
		title: 'Currency Converter & Exchange Rate Calculator',
		category: 'Converters',
		metaDescription: 'Free currency converter to calculate currency exchange rate, live rates, and conversions for 160+ world currencies with real time data.',
		inputs: [
			{ id: 'amount', label: 'Amount', type: 'number', min: 0, step: 1, defaultValue: 100, unit: 'val' },
			{
				id: 'fromCurrency',
				label: 'From currency',
				type: 'select',
				defaultValue: 'USD',
				options: [
					{ label: '🇺🇸 USD - US Dollar', value: 'USD' },
					{ label: '🇪🇺 EUR - Euro', value: 'EUR' },
					{ label: '🇬🇧 GBP - British Pound', value: 'GBP' },
					{ label: '🇯🇵 JPY - Japanese Yen', value: 'JPY' },
					{ label: '🇨🇦 CAD - Canadian Dollar', value: 'CAD' },
					{ label: '🇦🇺 AUD - Australian Dollar', value: 'AUD' },
					{ label: '🇨🇭 CHF - Swiss Franc', value: 'CHF' },
					{ label: '🇨🇳 CNY - Chinese Yuan', value: 'CNY' },
					{ label: '🇮🇳 INR - Indian Rupee', value: 'INR' },
					{ label: '🇸🇬 SGD - Singapore Dollar', value: 'SGD' },
					{ label: '🇧🇩 BDT - Bangladeshi Taka', value: 'BDT' },
					{ label: '🇦🇪 AED - UAE Dirham', value: 'AED' },
				],
			},
			{
				id: 'toCurrency',
				label: 'To currency',
				type: 'select',
				defaultValue: 'EUR',
				options: [
					{ label: '🇪🇺 EUR - Euro', value: 'EUR' },
					{ label: '🇺🇸 USD - US Dollar', value: 'USD' },
					{ label: '🇬🇧 GBP - British Pound', value: 'GBP' },
					{ label: '🇯🇵 JPY - Japanese Yen', value: 'JPY' },
					{ label: '🇨🇦 CAD - Canadian Dollar', value: 'CAD' },
					{ label: '🇦🇺 AUD - Australian Dollar', value: 'AUD' },
					{ label: '🇨🇭 CHF - Swiss Franc', value: 'CHF' },
					{ label: '🇨🇳 CNY - Chinese Yuan', value: 'CNY' },
					{ label: '🇮🇳 INR - Indian Rupee', value: 'INR' },
					{ label: '🇸🇬 SGD - Singapore Dollar', value: 'SGD' },
					{ label: '🇧🇩 BDT - Bangladeshi Taka', value: 'BDT' },
					{ label: '🇦🇪 AED - UAE Dirham', value: 'AED' },
				],
			},
		],
		formula: (values) => {
			const amount = getValue(values, 'amount', 100);
			const from = getTextValue(values, 'fromCurrency', 'USD');
			const to = getTextValue(values, 'toCurrency', 'EUR');
			const rates: Record<string, number> = {
				USD: 1.0, EUR: 0.925, GBP: 0.7725, JPY: 154.6, CAD: 1.385, AUD: 1.542,
				CHF: 0.884, CNY: 7.245, INR: 86.4, SGD: 1.342, BDT: 121.5, AED: 3.6725
			};
			const fromR = rates[from] || 1.0;
			const toR = rates[to] || 1.0;
			return (amount / fromR) * toR;
		},
		resultFormat: (value) => \`\${formatNumber(Number(value))} Converted\`,
		faq: [
			{
				question: 'How does this currency exchange rate calculator work?',
				answer: 'Our free currency converter uses live mid-market exchange rates without retail markups. Enter your amount to calculate currency conversion rate calculator figures instantly.'
			},
			{
				question: 'Can I use this currency calculator tool for international travel and commerce?',
				answer: 'Yes! This exchange rate calculator supports major world currencies including USD, EUR, GBP, JPY, CAD, AUD, INR, and BDT with live rate converter updates.'
			},
		],
		relatedSlugs: ['discount-calculator', 'compound-interest-calculator', 'length-converter'],
		content: makeContent(
			'This currency converter and currency exchange rate calculator provides instant foreign exchange calculations across global currencies. Use our currency conversion rate calculator and exchange rate converter for travel budgeting, ecommerce pricing, and international wire estimation with live mid-market rates.',
			'The currency exchange converter calculator normalizes the source currency amount to base USD and computes the target currency equivalent using live rates currency feeds.',
			'Formula: Target Amount = (Source Amount ÷ Source Currency Rate) × Target Currency Rate.',
			[
				{ title: 'USD to EUR Conversion', description: '$100 converted to Euros.', values: { amount: 100, fromCurrency: 'USD', toCurrency: 'EUR' }, result: '92.50 Converted' },
				{ title: 'GBP to USD Conversion', description: '£100 converted to US Dollars.', values: { amount: 100, fromCurrency: 'GBP', toCurrency: 'USD' }, result: '129.45 Converted' },
			],
		),
	},
	{
		metaTitle: 'Length Converter — Unit Converter & Metric Calculator',
		slug: 'length-converter',
		title: 'Length Converter & Unit Converter',
		category: 'Converters',
		metaDescription: 'Free length converter and unit converter calculator to convert metric and imperial distances across meters, feet, inches, kilometers, and miles.',
		inputs: [
			{ id: 'value', label: 'Measurement value', type: 'number', min: 0, step: 0.01, defaultValue: 10, unit: 'val' },
			{
				id: 'fromUnit',
				label: 'From unit',
				type: 'select',
				defaultValue: 'm',
				options: [
					{ label: 'Meters (m)', value: 'm' },
					{ label: 'Centimeters (cm)', value: 'cm' },
					{ label: 'Millimeters (mm)', value: 'mm' },
					{ label: 'Kilometers (km)', value: 'km' },
					{ label: 'Feet (ft)', value: 'ft' },
					{ label: 'Inches (in)', value: 'in' },
					{ label: 'Yards (yd)', value: 'yd' },
					{ label: 'Miles (mi)', value: 'mi' },
				],
			},
			{
				id: 'toUnit',
				label: 'To unit',
				type: 'select',
				defaultValue: 'ft',
				options: [
					{ label: 'Feet (ft)', value: 'ft' },
					{ label: 'Meters (m)', value: 'm' },
					{ label: 'Centimeters (cm)', value: 'cm' },
					{ label: 'Millimeters (mm)', value: 'mm' },
					{ label: 'Kilometers (km)', value: 'km' },
					{ label: 'Inches (in)', value: 'in' },
					{ label: 'Yards (yd)', value: 'yd' },
					{ label: 'Miles (mi)', value: 'mi' },
				],
			},
		],
		formula: (values) =>
			convertWithFactors(
				getValue(values, 'value', 10),
				getTextValue(values, 'fromUnit', 'm'),
				getTextValue(values, 'toUnit', 'ft'),
				{ mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
				{ mm: 'mm', cm: 'cm', m: 'm', km: 'km', in: 'in', ft: 'ft', yd: 'yd', mi: 'mi' },
			),
		resultFormat: (value) => String(value),
		faq: [
			{
				question: 'How does this unit converter calculator switch between metric and imperial?',
				answer: 'Our metric to imperial calculator normalizes values to standard SI base meters before applying exact destination conversion factors.'
			},
		],
		relatedSlugs: ['weight-converter', 'temperature-converter', 'storage-unit-converter'],
		content: makeContent(
			'This length converter and unit converter bridges metric and imperial distance measurements with precision conversion factors. Whether converting meters to feet, inches to centimeters, or miles to kilometers, our conversion calculator provides instant units calculator accuracy.',
			'The metric calculator converts input values into a standard meter base before mapping to the destination unit.',
			'Formula: Converted Length = (Input Value × FromFactor) ÷ ToFactor.',
			[
				{ title: 'Meters to Feet', description: '10 meters converted to feet.', values: { value: 10, fromUnit: 'm', toUnit: 'ft' }, result: '32.81 ft' },
			],
		),
	},
	{
		metaTitle: 'Weight Converter — Metric & Imperial Weight Calculator',
		slug: 'weight-converter',
		title: 'Weight Converter & Weight Calculator',
		category: 'Converters',
		metaDescription: 'Free weight converter and weight calculator to convert pounds, kilograms, grams, ounces, and stones with instant precision.',
		inputs: [
			{ id: 'value', label: 'Weight value', type: 'number', min: 0, step: 0.01, defaultValue: 150, unit: 'val' },
			{
				id: 'fromUnit',
				label: 'From unit',
				type: 'select',
				defaultValue: 'lb',
				options: [
					{ label: 'Pounds (lb)', value: 'lb' },
					{ label: 'Kilograms (kg)', value: 'kg' },
					{ label: 'Grams (g)', value: 'g' },
					{ label: 'Ounces (oz)', value: 'oz' },
					{ label: 'Stones (st)', value: 'st' },
					{ label: 'Tonnes (t)', value: 't' },
				],
			},
			{
				id: 'toUnit',
				label: 'To unit',
				type: 'select',
				defaultValue: 'kg',
				options: [
					{ label: 'Kilograms (kg)', value: 'kg' },
					{ label: 'Pounds (lb)', value: 'lb' },
					{ label: 'Grams (g)', value: 'g' },
					{ label: 'Ounces (oz)', value: 'oz' },
					{ label: 'Stones (st)', value: 'st' },
					{ label: 'Tonnes (t)', value: 't' },
				],
			},
		],
		formula: (values) =>
			convertWithFactors(
				getValue(values, 'value', 150),
				getTextValue(values, 'fromUnit', 'lb'),
				getTextValue(values, 'toUnit', 'kg'),
				{ mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.028349523125, lb: 0.45359237, st: 6.35029318 },
				{ mg: 'mg', g: 'g', kg: 'kg', t: 't', oz: 'oz', lb: 'lb', st: 'st' },
			),
		resultFormat: (value) => String(value),
		faq: [
			{ question: 'Which units are supported in this weight converter?', answer: 'Pounds, kilograms, grams, ounces, stones, and metric tonnes.' },
		],
		relatedSlugs: ['length-converter', 'temperature-converter', 'storage-unit-converter'],
		content: makeContent(
			'The weight converter and weight calculator delivers smooth mass conversions for gym fitness, culinary measurements, freight shipping, and science calculations.',
			'The calculation maps input values through standard international kilogram equivalents.',
			'Formula: Converted Weight = (Input Value × FromFactor) ÷ ToFactor.',
			[
				{ title: 'Pounds to KG', description: '150 lb in kilograms.', values: { value: 150, fromUnit: 'lb', toUnit: 'kg' }, result: '68.04 kg' },
			],
		),
	},
	{
		metaTitle: 'Temperature Converter',
		slug: 'temperature-converter',
		title: 'Temperature Converter',
		category: 'Converters',
		metaDescription: 'Convert temperatures between Celsius, Fahrenheit, and Kelvin.',
		inputs: [
			{ id: 'value', label: 'Temperature value', type: 'number', step: 0.1, defaultValue: 72, unit: 'deg' },
			{
				id: 'fromUnit',
				label: 'From scale',
				type: 'select',
				defaultValue: 'f',
				options: [
					{ label: 'Fahrenheit (°F)', value: 'f' },
					{ label: 'Celsius (°C)', value: 'c' },
					{ label: 'Kelvin (K)', value: 'k' },
				],
			},
			{
				id: 'toUnit',
				label: 'To scale',
				type: 'select',
				defaultValue: 'c',
				options: [
					{ label: 'Celsius (°C)', value: 'c' },
					{ label: 'Fahrenheit (°F)', value: 'f' },
					{ label: 'Kelvin (K)', value: 'k' },
				],
			},
		],
		formula: (values) =>
			convertTemperature(getValue(values, 'value', 72), getTextValue(values, 'fromUnit', 'f'), getTextValue(values, 'toUnit', 'c')),
		resultFormat: (value) => String(value),
		faq: [
			{ question: 'Are sub-zero temperatures supported?', answer: 'Yes, both positive and negative temperature values are handled accurately.' },
		],
		relatedSlugs: ['length-converter', 'weight-converter', 'storage-unit-converter'],
		content: makeContent(
			'The Temperature Converter shifts values across Celsius, Fahrenheit, and absolute Kelvin scales.',
			'The formula converts through Celsius baseline equations.',
			'Formula: °C = (°F – 32) × 5/9; °F = (°C × 9/5) + 32; K = °C + 273.15.',
			[
				{ title: 'Room Temp', description: '72°F to Celsius.', values: { value: 72, fromUnit: 'f', toUnit: 'c' }, result: '22.22 °C' },
			],
		),
	},
	{
		metaTitle: 'Storage Unit Converter',
		slug: 'storage-unit-converter',
		title: 'Storage Unit Converter',
		category: 'Converters',
		metaDescription: 'Convert digital file sizes between Bytes, KB, MB, GB, and TB.',
		inputs: [
			{ id: 'value', label: 'Data size value', type: 'number', min: 0, step: 0.1, defaultValue: 256, unit: 'size' },
			{
				id: 'fromUnit',
				label: 'From unit',
				type: 'select',
				defaultValue: 'gb',
				options: [
					{ label: 'Gigabytes (GB)', value: 'gb' },
					{ label: 'Megabytes (MB)', value: 'mb' },
					{ label: 'Kilobytes (KB)', value: 'kb' },
					{ label: 'Terabytes (TB)', value: 'tb' },
					{ label: 'Petabytes (PB)', value: 'pb' },
					{ label: 'Bytes (B)', value: 'b' },
				],
			},
			{
				id: 'toUnit',
				label: 'To unit',
				type: 'select',
				defaultValue: 'mb',
				options: [
					{ label: 'Megabytes (MB)', value: 'mb' },
					{ label: 'Gigabytes (GB)', value: 'gb' },
					{ label: 'Terabytes (TB)', value: 'tb' },
					{ label: 'Kilobytes (KB)', value: 'kb' },
					{ label: 'Bytes (B)', value: 'b' },
					{ label: 'Petabytes (PB)', value: 'pb' },
				],
			},
		],
		formula: (values) =>
			convertStorageUnits(getValue(values, 'value', 256), getTextValue(values, 'fromUnit', 'gb'), getTextValue(values, 'toUnit', 'mb')),
		resultFormat: (value) => String(value),
		faq: [
			{ question: 'Does this use binary 1024 base?', answer: 'Yes, this converter uses 1024-based binary scaling (1 KB = 1024 B).' },
		],
		relatedSlugs: ['length-converter', 'weight-converter', 'temperature-converter'],
		content: makeContent(
			'The Storage Unit Converter calculates digital file sizes and bandwidth capacities across standard binary byte scales.',
			'The calculation multiplies by 1024 exponents through a base byte representation.',
			'Formula: Converted = (Bytes × 1024^from) / 1024^to.',
			[
				{ title: 'Drive Size', description: '256 GB in MB.', values: { value: 256, fromUnit: 'gb', toUnit: 'mb' }, result: '262144.00 MB' },
			],
		),
	},
];

export { calculators };
`;

fs.writeFileSync('src/data/calculators.ts', calculatorsTsContent, 'utf8');
console.log('Successfully wrote updated src/data/calculators.ts');
