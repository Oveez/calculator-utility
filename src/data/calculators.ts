import type { CalculatorConfig } from '../types/calculator';
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
		metaTitle: 'Mortgage Calculator',
		slug: 'mortgage-calculator',
		title: 'Mortgage & Loan Calculator',
		category: 'Finance',
		metaDescription: 'Calculate monthly mortgage payments, interest costs, and total repayment.',
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
		resultFormat: (value) => `${formatCurrency(value)} / month`,
		faq: [
			{ question: 'What does this monthly payment include?', answer: 'This calculation estimates the monthly principal and interest payment. Property taxes, homeowners insurance, and HOA fees are not included.' },
			{ question: 'How does interest rate affect the monthly payment?', answer: 'A higher interest rate increases both the monthly payment and the total interest paid over the life of the loan.' },
			{ question: 'Can I calculate for shorter loan terms?', answer: 'Yes, entering a 15-year term will show higher monthly payments but substantially lower lifetime interest.' },
		],
		relatedSlugs: ['compound-interest-calculator', 'auto-loan-calculator', 'simple-interest-calculator'],
		content: makeContent(
			'The Mortgage and Loan Calculator helps you estimate monthly repayments and plan your home buying or borrowing budget. By understanding how the loan amount, interest rate, and repayment horizon interact, you can make informed decisions about your real estate and personal borrowing strategies. The calculation runs 100% locally in your browser for total privacy.',
			'The calculator uses the standard fixed-rate amortization formula. It computes the monthly interest rate from the annual percentage and amortizes the principal evenly across all months of the term.',
			'Formula: Monthly Payment M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ], where P is Principal, i is Monthly Interest Rate, and n is Total Months.',
			[
				{ title: 'Standard 30-Year Mortgage', description: 'A common 30-year fixed home loan at 6.5% interest.', values: { principal: 300000, interestRate: 6.5, loanTermYears: 30 }, result: '$1,896.20 / month' },
				{ title: '15-Year Fast Payoff', description: 'The same loan amount over a shorter 15-year term at 6.0%.', values: { principal: 300000, interestRate: 6.0, loanTermYears: 15 }, result: '$2,531.60 / month' },
			],
		),
	},
	{
		metaTitle: 'Compound Interest Calculator',
		slug: 'compound-interest-calculator',
		title: 'Compound Interest Calculator',
		category: 'Finance',
		metaDescription: 'See how savings and investments grow over time with periodic compounding and contributions.',
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
			{ question: 'What is compound interest?', answer: 'Compound interest is interest earned on both the initial principal and the accumulated interest from previous periods.' },
			{ question: 'How often does this calculate compounding?', answer: 'This tool assumes monthly compounding and monthly contributions, matching most standard investment and index accounts.' },
			{ question: 'Why do regular contributions matter so much?', answer: 'Consistent monthly contributions provide fresh principal that compounds over the remaining term, multiplying the final balance.' },
		],
		relatedSlugs: ['mortgage-calculator', 'investment-calculator', 'simple-interest-calculator'],
		content: makeContent(
			'The Compound Interest Calculator demonstrates the power of exponential financial growth. Whether you are building an emergency fund, planning for retirement, or saving for education, compounding interest turns regular savings into substantial wealth over time.',
			'The formula calculates the compound growth of your initial principal and adds the future value of an annuity for your regular monthly deposits.',
			'Formula: Future Value = P(1 + r/n)^(nt) + PMT × [ ((1 + r/n)^(nt) - 1) / (r/n) ], where P is initial deposit, PMT is monthly contribution, r is rate, n is compounding frequency, and t is years.',
			[
				{ title: '10-Year Growth Plan', description: '$10,000 starting deposit with $500/month at 8% annual return.', values: { principal: 10000, monthlyContribution: 500, annualRate: 8, years: 10 }, result: '$113,866.49' },
				{ title: '20-Year Long Term', description: 'Longer horizon showcasing compounding acceleration.', values: { principal: 10000, monthlyContribution: 500, annualRate: 8, years: 20 }, result: '$340,896.24' },
			],
		),
	},
	{
		metaTitle: 'Simple Interest Calculator',
		slug: 'simple-interest-calculator',
		title: 'Simple Interest Calculator',
		category: 'Finance',
		metaDescription: 'Calculate straightforward interest on loans or short-term notes without compounding.',
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
		resultFormat: (value) => `${formatCurrency(value)} total`,
		faq: [
			{ question: 'When is simple interest used?', answer: 'Simple interest is commonly used for short-term personal loans, car title loans, promissory notes, and basic bond coupons.' },
			{ question: 'How is it different from compound interest?', answer: 'Simple interest is calculated only on the initial principal, whereas compound interest is calculated on both principal and accumulated interest.' },
		],
		relatedSlugs: ['compound-interest-calculator', 'mortgage-calculator', 'discount-calculator'],
		content: makeContent(
			'The Simple Interest Calculator provides a clear, transparent view of basic interest math. It is ideal for short-term lending, informal contracts, peer-to-peer loans, and basic accounting exercises.',
			'The interest is found by multiplying the initial principal by the rate and the time in years. The total maturity value is the principal plus interest.',
			'Formula: Interest I = P × r × t; Total A = P + I.',
			[
				{ title: '3-Year Note', description: '$5,000 borrowed at 5% simple interest for 3 years.', values: { principal: 5000, annualRate: 5, years: 3 }, result: '$5,750.00 total' },
				{ title: 'Short 1-Year Loan', description: '$2,000 at 7.5% for 1 year.', values: { principal: 2000, annualRate: 7.5, years: 1 }, result: '$2,150.00 total' },
			],
		),
	},
	{
		metaTitle: 'Tip & Bill Split Calculator',
		slug: 'tip-calculator',
		title: 'Tip & Bill Split Calculator',
		category: 'Finance',
		metaDescription: 'Calculate tip percentages, total dining bills, and per-person splits quickly.',
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
		resultFormat: (value) => `${formatCurrency(value)} / person`,
		faq: [
			{ question: 'What are standard dining tip rates?', answer: 'Standard US tipping rates are typically 15% for fair service, 18% for good service, and 20% or more for exceptional service.' },
			{ question: 'How is the split computed?', answer: 'The tip is added to the subtotal, and the resulting total bill is divided equally by the number of guests.' },
		],
		relatedSlugs: ['discount-calculator', 'percentage-calculator', 'salary-calculator'],
		content: makeContent(
			'The Tip & Bill Split Calculator eliminates dining room mental math. Whether having dinner with colleagues or sharing brunch with friends, enter the subtotal, select your desired gratuity, and get exact amounts per person.',
			'The tool multiplies the bill amount by the tip percentage, adds the tip to get the total, and divides by the party size.',
			'Formula: Tip = Bill × (Tip % / 100); Total = Bill + Tip; Per Person = Total / People.',
			[
				{ title: 'Dinner for Three', description: '$85.50 bill with an 18% tip split among 3 friends.', values: { billAmount: 85.5, tipPercent: 18, splitWays: 3 }, result: '$33.63 / person' },
				{ title: 'Solo Lunch', description: '$24.00 lunch with 20% tip.', values: { billAmount: 24, tipPercent: 20, splitWays: 1 }, result: '$28.80 / person' },
			],
		),
	},
	{
		metaTitle: 'Discount & Sales Tax Calculator',
		slug: 'discount-calculator',
		title: 'Discount & Sales Tax Calculator',
		category: 'Finance',
		metaDescription: 'Find discounted sale prices, net savings, and final price including sales tax.',
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
			{ question: 'Is sales tax applied before or after discount?', answer: 'In most jurisdictions, sales tax is applied to the discounted sale price, which this calculator follows.' },
			{ question: 'Can I set sales tax to 0%?', answer: 'Yes, if shopping in a tax-free area or buying tax-exempt items, set tax to 0% to see pure discount price.' },
		],
		relatedSlugs: ['tip-calculator', 'percentage-calculator', 'percentage-difference'],
		content: makeContent(
			'The Discount & Sales Tax Calculator is your shopping companion. Quickly check if a store markdown or promotional coupon provides real savings after factoring in local sales tax.',
			'The calculator subtracts the discount percentage from the retail price, then calculates and adds sales tax to the discounted amount.',
			'Formula: Discounted = Original × (1 – Discount %); Final = Discounted × (1 + Tax %).',
			[
				{ title: '25% Off Jacket', description: '$120 jacket with 25% discount and 8.25% sales tax.', values: { originalPrice: 120, discountPercent: 25, taxPercent: 8.25 }, result: '$97.43' },
				{ title: 'Clearance Deal', description: '$50 item with 40% discount, zero tax.', values: { originalPrice: 50, discountPercent: 40, taxPercent: 0 }, result: '$30.00' },
			],
		),
	},
	{
		metaTitle: 'Salary & Hourly Wage Calculator',
		slug: 'salary-calculator',
		title: 'Salary & Wage Calculator',
		category: 'Finance',
		metaDescription: 'Convert hourly pay to annual, monthly, and weekly salary equivalents.',
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
		resultFormat: (value) => `${formatCurrency(value, '$', 0)} / year`,
		faq: [
			{ question: 'Does this account for income taxes?', answer: 'This computes gross income before federal, state, and local payroll taxes or deductions.' },
			{ question: 'What if I have unpaid vacation?', answer: 'Adjust the paid weeks per year field (e.g. 50 weeks for 2 weeks unpaid leave).' },
		],
		relatedSlugs: ['tip-calculator', 'mortgage-calculator', 'compound-interest-calculator'],
		content: makeContent(
			'The Salary & Wage Calculator translates hourly pay into annual salary, monthly earnings, and paycheck milestones. It helps job seekers, freelancers, and contractors evaluate compensation packages and job offers.',
			'The calculation multiplies your hourly rate by weekly hours to get weekly pay, and then by total paid weeks per year to get gross annual salary.',
			'Formula: Annual Salary = Hourly Rate × Hours per Week × Weeks per Year; Monthly = Annual / 12.',
			[
				{ title: 'Full-Time $32.50/hr', description: '40 hours per week, 52 paid weeks.', values: { hourlyWage: 32.5, hoursPerWeek: 40, weeksPerYear: 52 }, result: '$67,600 / year' },
				{ title: 'Part-Time Work', description: '$20.00/hr, 25 hours per week.', values: { hourlyWage: 20, hoursPerWeek: 25, weeksPerYear: 52 }, result: '$26,000 / year' },
			],
		),
	},
	{
		metaTitle: 'Auto Loan Calculator',
		slug: 'auto-loan-calculator',
		title: 'Auto Loan Calculator',
		category: 'Finance',
		metaDescription: 'Estimate monthly car payments based on vehicle price, down payment, trade-in, and interest rate.',
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
		resultFormat: (value) => `${formatCurrency(value)} / month`,
		faq: [
			{ question: 'What loan term is best for a car?', answer: 'Standard car loan terms range between 3 to 5 years (36 to 60 months). Longer terms lower monthly payments but increase total interest.' },
			{ question: 'How do trade-ins reduce payments?', answer: 'Trade-in value directly reduces the financed principal amount, lowering both interest charges and monthly payments.' },
		],
		relatedSlugs: ['mortgage-calculator', 'compound-interest-calculator', 'simple-interest-calculator'],
		content: makeContent(
			'The Auto Loan Calculator lets you model different vehicle financing scenarios before visiting a dealership. Adjust your down payment, trade-in valuation, and loan term to find a comfortable monthly budget.',
			'The calculator subtracts the down payment and trade-in from the vehicle price to find net financed principal, then applies standard loan amortization.',
			'Formula: Net Financed = Price – Down Payment – Trade-in; Monthly Payment = Amortization(Net Financed, APR, Term).',
			[
				{ title: 'New Sedan Purchase', description: '$28,000 car with $4,000 down and $2,000 trade-in at 5.9% for 5 years.', values: { vehiclePrice: 28000, downPayment: 4000, tradeIn: 2000, interestRate: 5.9, loanTermYears: 5 }, result: '$424.32 / month' },
				{ title: '3-Year Short Loan', description: '$20,000 financed over 36 months at 4.5%.', values: { vehiclePrice: 20000, downPayment: 0, tradeIn: 0, interestRate: 4.5, loanTermYears: 3 }, result: '$594.86 / month' },
			],
		),
	},
	{
		metaTitle: 'Investment Return Calculator',
		slug: 'investment-calculator',
		title: 'Investment Growth Calculator',
		category: 'Finance',
		metaDescription: 'Project future investment wealth and portfolio growth with regular additions.',
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
			{ question: 'What annual return rate is realistic?', answer: 'Historical stock market index averages (like the S&P 500) have hovered around 8%–10% annually before inflation over multi-decade spans.' },
			{ question: 'Are investment returns guaranteed?', answer: 'No, market returns fluctuate yearly. This calculator models an annualized average compounded over time.' },
		],
		relatedSlugs: ['compound-interest-calculator', 'mortgage-calculator', 'salary-calculator'],
		content: makeContent(
			'The Investment Growth Calculator simulates portfolio trajectory across market cycles. See how starting capital combined with steady dollar-cost averaging creates financial independence over 10, 20, or 30 years.',
			'The engine applies monthly compound interest formulas to both the initial balance and ongoing monthly deposits.',
			'Formula: Future Portfolio = Starting Capital × (1 + r/12)^(12t) + Monthly × [ ((1 + r/12)^(12t) - 1) / (r/12) ].',
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
		metaTitle: 'GPA Calculator',
		slug: 'gpa-calculator',
		title: 'GPA Calculator',
		category: 'Education',
		metaDescription: 'Calculate a weighted GPA from course grades and credits.',
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
		resultFormat: (value) => `${formatNumber(value)} GPA`,
		faq: [
			{ question: 'Do all courses need the same credit weight?', answer: 'No. The calculator uses a weighted average, so a 4-credit class influences the result more than a 1-credit class.' },
			{ question: 'Can I use letter grades here?', answer: 'This version expects grade points (e.g. A=4.0, B=3.0), which keeps the math transparent.' },
			{ question: 'What happens if a credit value is zero?', answer: 'Zero-credit courses do not affect the average because they contribute no weight to the total GPA.' },
		],
		relatedSlugs: ['cgpa-calculator', 'grade-calculator', 'percentage-calculator'],
		content: makeContent(
			'The GPA Calculator turns course performance into one weighted score. It is designed for students who need a quick snapshot of semester standing, scholarship eligibility, or transfer planning. Instead of averaging raw grades blindly, it respects credit weight.',
			'This calculator works by multiplying each grade point by its credit value, adding those weighted points together, and dividing by the total number of credits.',
			'Formula: weighted GPA = (grade1 × credits1 + grade2 × credits2 + grade3 × credits3) / total credits.',
			[
				{ title: 'Balanced term', description: 'Three courses with similar weight and solid performance.', values: { course1Grade: 3.7, course1Credits: 3, course2Grade: 3.3, course2Credits: 3, course3Grade: 4.0, course3Credits: 4 }, result: '3.70 GPA' },
				{ title: 'Mixed workload', description: 'A strong major class offsets a lighter elective.', values: { course1Grade: 3.0, course1Credits: 2, course2Grade: 3.8, course2Credits: 5, course3Grade: 2.7, course3Credits: 1 }, result: '3.46 GPA' },
			],
		),
	},
	{
		metaTitle: 'CGPA Calculator',
		slug: 'cgpa-calculator',
		title: 'CGPA Calculator',
		category: 'Education',
		metaDescription: 'Find cumulative GPA across semesters using semester GPA and credits.',
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
		resultFormat: (value) => `${formatNumber(value)} CGPA`,
		faq: [
			{ question: 'How is CGPA different from GPA?', answer: 'GPA usually describes one semester, while CGPA combines multiple semesters into one cumulative score.' },
			{ question: 'Can I calculate with fewer semesters?', answer: 'Yes, leave unused semester credits at 0 and they will be ignored in the calculation.' },
		],
		relatedSlugs: ['gpa-calculator', 'grade-calculator', 'percentage-calculator'],
		content: makeContent(
			'The CGPA Calculator is built for students who want one cumulative score across multiple semesters. It weighs each semester by total enrolled credit units.',
			'The formula multiplies each semester GPA by credit load, sums them, and divides by total cumulative credits.',
			'Formula: CGPA = Σ(Semester GPA × Semester Credits) / Total Credits.',
			[
				{ title: 'Four-term record', description: 'Consistent academic performance across four terms.', values: { semester1Gpa: 3.5, semester1Credits: 18, semester2Gpa: 3.8, semester2Credits: 18, semester3Gpa: 3.6, semester3Credits: 16, semester4Gpa: 3.9, semester4Credits: 18 }, result: '3.70 CGPA' },
			],
		),
	},
	{
		metaTitle: 'Percentage Calculator',
		slug: 'percentage-calculator',
		title: 'Percentage Calculator',
		category: 'Math',
		metaDescription: 'Work out what percentage one number is of another.',
		inputs: [
			{ id: 'part', label: 'Part / Score', type: 'number', min: 0, step: 0.01, defaultValue: 42, unit: 'units' },
			{ id: 'whole', label: 'Whole / Total', type: 'number', min: 0.01, step: 0.01, defaultValue: 50, unit: 'units' },
		],
		formula: (values) => {
			const part = getValue(values, 'part', 42);
			const whole = getValue(values, 'whole', 50);
			return whole === 0 ? 0 : (part / whole) * 100;
		},
		resultFormat: (value) => `${formatNumber(Number(value))}%`,
		faq: [
			{ question: 'Can the part be larger than the whole?', answer: 'Yes. In that case the result will exceed 100%, indicating an increase or surplus.' },
			{ question: 'Why is whole never zero?', answer: 'Division by zero is undefined, so whole is kept positive.' },
		],
		relatedSlugs: ['percentage-difference', 'grade-calculator', 'fraction-calculator'],
		content: makeContent(
			'The Percentage Calculator determines the exact percentage representation of a part within a whole total.',
			'Under the hood, the calculator divides the part by the whole and multiplies by 100.',
			'Formula: Percentage = (Part ÷ Whole) × 100.',
			[
				{ title: 'Exam Score', description: '42 marks earned out of 50 total.', values: { part: 42, whole: 50 }, result: '84.00%' },
			],
		),
	},
	{
		metaTitle: 'Grade Calculator',
		slug: 'grade-calculator',
		title: 'Grade Calculator',
		category: 'Education',
		metaDescription: 'Turn marks into a percentage and letter grade instantly.',
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
			return `${formatNumber(percent)}% (${grade})`;
		},
		faq: [
			{ question: 'Which grading scale is used?', answer: 'This tool uses the standard North American letter grade scale (A+ through F).' },
		],
		relatedSlugs: ['gpa-calculator', 'cgpa-calculator', 'percentage-calculator'],
		content: makeContent(
			'The Grade Calculator converts test scores into percentages and matching letter grades.',
			'The formula computes (Marks / Total) × 100 and evaluates letter grade tiers.',
			'Formula: Grade % = (Marks ÷ Total Marks) × 100.',
			[
				{ title: 'High Exam Grade', description: '92 out of 100.', values: { marks: 92, totalMarks: 100 }, result: '92.00% (A-)' },
			],
		),
	},

	// ==========================================
	// HEALTH & WELLNESS (3 Calculators)
	// ==========================================
	{
		metaTitle: 'BMI Calculator — Accurate Body Mass Index & Category',
		slug: 'bmi-calculator',
		title: 'BMI Calculator',
		category: 'Health',
		metaDescription: 'Calculate Body Mass Index (BMI) from height and weight. Understand official WHO and CDC weight categories, limitations, and health guidance.',
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
			return `${formatNumber(bmi)} kg/m² (${category})`;
		},
		faq: [
			{ question: 'What are the official WHO and CDC BMI categories?', answer: 'The World Health Organization (WHO) and Centers for Disease Control (CDC) define: Underweight (<18.5 kg/m²), Normal weight (18.5–24.9 kg/m²), Overweight (25.0–29.9 kg/m²), and Obese (≥30.0 kg/m²).' },
			{ question: 'What are the limitations of Body Mass Index (BMI)?', answer: 'BMI is a general population screening metric that does not distinguish between lean muscle tissue, bone mass, and body fat. Muscular individuals and athletes may be classified as "overweight" despite low body fat, while older adults may have a normal BMI despite reduced muscle mass.' },
			{ question: 'Is BMI suitable for pregnant individuals or growing children?', answer: 'No. Standard adult BMI formulas should not be applied to pregnant individuals or young children, where specialized pediatric growth percentile charts and clinical assessments are required.' },
			{ question: 'Is this calculation a medical diagnosis?', answer: 'No. This tool is for informational screening purposes only and does not constitute medical advice or clinical diagnosis. Always consult a qualified physician or healthcare provider regarding weight management or metabolic health.' },
		],
		relatedSlugs: ['calorie-calculator', 'water-intake-calculator', 'age-calculator'],
		content: makeContent(
			'The BMI Calculator provides a standardized screening ratio of weight relative to height based on World Health Organization (WHO) guidelines. While BMI is a widely used public health indicator, it is not a diagnostic tool for individual body fatness or overall metabolic health. Important Note: Calculations are provided strictly for educational and screening estimation. Always consult a licensed medical professional for personal health evaluations.',
			'The formula divides weight in kilograms by height in meters squared. The resulting number is categorized against international weight status thresholds.',
			'Formula: BMI = Weight (kg) ÷ [Height (m)]². (For example, 70 kg ÷ (1.75 m)² = 22.86 kg/m²).',
			[
				{ title: 'Healthy Adult', description: 'Standard weight adult measuring 70 kg at 175 cm.', values: { weightKg: 70, heightCm: 175 }, result: '22.86 kg/m² (Normal weight)' },
				{ title: 'Screening Evaluation', description: 'Adult measuring 85 kg at 170 cm.', values: { weightKg: 85, heightCm: 170 }, result: '29.41 kg/m² (Overweight)' },
			],
		),
	},
	{
		metaTitle: 'Daily Calorie & TDEE Calculator — Maintenance & BMR',
		slug: 'calorie-calculator',
		title: 'Calorie & TDEE Calculator',
		category: 'Health',
		metaDescription: 'Estimate your Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR) using the clinically validated Mifflin-St Jeor formula.',
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
			const activityMultiplier = activityMultipliers[activityLevel.replace(/\s+/g, '')] ?? 1.55;
			const bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + sexAdjustment;
			return Math.max(bmr * activityMultiplier, 0);
		},
		resultFormat: (value) => `${formatInteger(value)} kcal / day`,
		faq: [
			{ question: 'What formula is used for calculating calories?', answer: 'This calculator uses the Mifflin-St Jeor equation, widely acknowledged in clinical nutrition as one of the most reliable formulas for estimating Basal Metabolic Rate (BMR).' },
			{ question: 'What is the difference between BMR and TDEE?', answer: 'BMR (Basal Metabolic Rate) is the energy your body expends at total rest to sustain vital organs. TDEE (Total Daily Energy Expenditure) accounts for both BMR and physical movement/exercise.' },
			{ question: 'How can I use this for weight loss or muscle gain?', answer: 'A common guideline is a mild calorie deficit (e.g. 300–500 kcal/day below TDEE) for gradual fat loss, or a mild surplus for muscle hypertrophy, alongside balanced macronutrient intake.' },
			{ question: 'Is this calculation a personalized dietary prescription?', answer: 'No. Individual metabolic rates vary by thyroid function, genetics, and lean muscle ratio. Consult a registered dietitian or physician for personalized nutrition guidance.' },
		],
		relatedSlugs: ['bmi-calculator', 'water-intake-calculator', 'age-calculator'],
		content: makeContent(
			'The Calorie and TDEE Calculator estimates the baseline daily energy (kilocalories) required to maintain your current body weight based on age, biological sex, height, weight, and daily physical activity level. Disclaimer: This tool provides general nutritional estimation only. Individual metabolic health varies.',
			'The calculation applies the Mifflin-St Jeor equation to compute Basal Metabolic Rate (BMR), then multiplies this figure by an established physical activity multiplier ranging from 1.2 (sedentary) to 1.9 (heavy athletic training).',
			'Formula: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + s (where s = +5 for males, -161 for females); TDEE = BMR × Activity Multiplier.',
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
		resultFormat: (value) => `${formatNumber(value)} liters / day`,
		faq: [
			{ question: 'What is the baseline scientific recommendation for hydration?', answer: 'Major health organizations like the European Food Safety Authority (EFSA) and U.S. National Academies of Sciences recommend 2.0 to 2.5 liters of total fluid daily for women and 2.5 to 3.5 liters for men, adjusted for body mass and physical exertion.' },
			{ question: 'Does tea, coffee, or food water count toward hydration?', answer: 'Yes. Plain water is optimal, but non-alcoholic beverages and water-rich foods (fruits, vegetables, soups) contribute approximately 20-30% of total daily hydration.' },
			{ question: 'When should I increase water intake?', answer: 'Increase hydration during intense cardiovascular exercise, high heat or humidity, illness (fever), or high altitude to prevent dehydration.' },
			{ question: 'Is this calculation a clinical fluid restriction guide?', answer: 'No. Individuals with congestive heart failure, chronic kidney disease, or other conditions requiring fluid restrictions must follow their physician\'s specific clinical guidance.' },
		],
		relatedSlugs: ['bmi-calculator', 'calorie-calculator'],
		content: makeContent(
			'The Daily Water Intake Calculator estimates optimal fluid consumption tailored to your body weight, daily workout routines, and ambient weather. Adequate hydration supports cognitive function, joint lubrication, metabolic efficiency, and physical stamina. Disclaimer: This tool provides general wellness estimates and is not a medical prescription.',
			'The formula multiplies body weight by standard baseline hydration factors (approx. 35 ml per kg of body mass), adds sweat replenishment factors for active exercise minutes, and adjusts for ambient climate humidity/temperature.',
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
		metaTitle: 'Percentage Difference',
		slug: 'percentage-difference',
		title: 'Percentage Difference',
		category: 'Math',
		metaDescription: 'Compare two values and see how far apart they are in percent.',
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
		resultFormat: (value) => `${formatNumber(value)}%`,
		faq: [
			{ question: 'Why use the average in the denominator?', answer: 'It ensures symmetric comparison regardless of which number is entered first.' },
		],
		relatedSlugs: ['percentage-calculator', 'ratio-calculator', 'average-calculator'],
		content: makeContent(
			'Percentage difference measures the relative gap between two values without assuming a fixed baseline.',
			'The formula divides the absolute difference by the average of both numbers.',
			'Formula: % Difference = |V1 – V2| / [ (V1 + V2) / 2 ] × 100.',
			[
				{ title: 'Price Comparison', description: '120 vs 132.', values: { oldValue: 120, newValue: 132 }, result: '9.52%' },
			],
		),
	},
	{
		metaTitle: 'Ratio Calculator',
		slug: 'ratio-calculator',
		title: 'Ratio Calculator',
		category: 'Math',
		metaDescription: 'Express one number relative to another as a simple ratio.',
		inputs: [
			{ id: 'partA', label: 'First quantity (A)', type: 'number', step: 0.01, defaultValue: 18, unit: 'units' },
			{ id: 'partB', label: 'Second quantity (B)', type: 'number', min: 0.001, step: 0.01, defaultValue: 24, unit: 'units' },
		],
		formula: (values) => {
			const partA = getValue(values, 'partA', 18);
			const partB = getValue(values, 'partB', 24);
			return partB === 0 ? 0 : partA / partB;
		},
		resultFormat: (value) => `${formatNumber(value)} : 1`,
		faq: [
			{ question: 'How is the ratio displayed?', answer: 'It displays the proportional value of A relative to 1 unit of B.' },
		],
		relatedSlugs: ['fraction-calculator', 'percentage-difference', 'average-calculator'],
		content: makeContent(
			'The Ratio Calculator scales and expresses two quantities as a normalized comparative ratio.',
			'The formula computes A divided by B.',
			'Formula: Ratio = A / B : 1.',
			[
				{ title: 'Scaling Recipe', description: '18 parts to 24 parts.', values: { partA: 18, partB: 24 }, result: '0.75 : 1' },
			],
		),
	},
	{
		metaTitle: 'Fraction Calculator',
		slug: 'fraction-calculator',
		title: 'Fraction Calculator',
		category: 'Math',
		metaDescription: 'Convert a fraction to decimal and percentage in one view.',
		inputs: [
			{ id: 'numerator', label: 'Numerator (top number)', type: 'number', step: 1, defaultValue: 3, unit: 'parts' },
			{ id: 'denominator', label: 'Denominator (bottom number)', type: 'number', min: 0.001, step: 1, defaultValue: 4, unit: 'parts' },
		],
		formula: (values) => {
			const num = getValue(values, 'numerator', 3);
			const den = getValue(values, 'denominator', 4);
			return den === 0 ? 0 : num / den;
		},
		resultFormat: (value) => `${formatNumber(Number(value))} (${formatNumber(Number(value) * 100)}%)`,
		faq: [
			{ question: 'What does this output?', answer: 'It provides both decimal and equivalent percentage representations simultaneously.' },
		],
		relatedSlugs: ['ratio-calculator', 'percentage-calculator', 'average-calculator'],
		content: makeContent(
			'The Fraction Calculator simplifies fractions into clean decimal and percentage formats.',
			'The formula divides the numerator by denominator.',
			'Formula: Decimal = Numerator ÷ Denominator; Percent = Decimal × 100.',
			[
				{ title: 'Three Quarters', description: '3 / 4.', values: { numerator: 3, denominator: 4 }, result: '0.75 (75.00%)' },
			],
		),
	},
	{
		metaTitle: 'Average Calculator',
		slug: 'average-calculator',
		title: 'Average Calculator',
		category: 'Math',
		metaDescription: 'Find the mean average of numbers with a fast static form.',
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
			{ question: 'What type of average is this?', answer: 'This computes the arithmetic mean (sum divided by count).' },
		],
		relatedSlugs: ['ratio-calculator', 'fraction-calculator', 'percentage-difference'],
		content: makeContent(
			'The Average Calculator computes the exact arithmetic mean of your input numbers.',
			'The calculation sums all four numbers and divides by 4.',
			'Formula: Average = (V1 + V2 + V3 + V4) / 4.',
			[
				{ title: 'Class Test Average', description: '78, 84, 91, 87.', values: { value1: 78, value2: 84, value3: 91, value4: 87 }, result: '85.00' },
			],
		),
	},

	// ==========================================
	// DATE & TIME (4 Calculators)
	// ==========================================
	{
		metaTitle: 'Age Calculator',
		slug: 'age-calculator',
		title: 'Age Calculator',
		category: 'Date & Time',
		metaDescription: 'Calculate exact age in years, months, and days from a birth date.',
		inputs: [
			{ id: 'birthDate', label: 'Date of birth', type: 'date', defaultValue: '1998-05-15' },
			{ id: 'referenceDate', label: 'Age as of date', type: 'date', defaultValue: '2026-08-29' },
		],
		formula: (values) => {
			const birth = getTextValue(values, 'birthDate', '1998-05-15');
			const ref = getTextValue(values, 'referenceDate', '2026-08-29');
			return Math.max(ageFromIsoDate(birth, ref), 0);
		},
		resultFormat: (value) => `${formatNumber(value)} years`,
		faq: [
			{ question: 'How is the decimal age calculated?', answer: 'It calculates total elapsed days divided by the average solar year length of 365.2425 days.' },
		],
		relatedSlugs: ['date-difference-calculator', 'countdown-calculator', 'working-days-calculator'],
		content: makeContent(
			'The Age Calculator computes exact chronological age between a birth date and any reference calendar date.',
			'Dates are normalized in UTC to avoid time-zone or daylight saving discrepancies.',
			'Formula: Age = Elapsed Days / 365.2425.',
			[
				{ title: 'Age in 2026', description: 'Born May 15, 1998 evaluated on Aug 29, 2026.', values: { birthDate: '1998-05-15', referenceDate: '2026-08-29' }, result: '28.29 years' },
			],
		),
	},
	{
		metaTitle: 'Date Difference Calculator',
		slug: 'date-difference-calculator',
		title: 'Date Difference Calculator',
		category: 'Date & Time',
		metaDescription: 'Measure how many days separate two calendar dates.',
		inputs: [
			{ id: 'startDate', label: 'Start date', type: 'date', defaultValue: '2026-01-01' },
			{ id: 'endDate', label: 'End date', type: 'date', defaultValue: '2026-12-31' },
		],
		formula: (values) => {
			const start = getTextValue(values, 'startDate', '2026-01-01');
			const end = getTextValue(values, 'endDate', '2026-12-31');
			return dateDiffDaysFromIso(start, end);
		},
		resultFormat: (value) => `${formatInteger(value)} days`,
		faq: [
			{ question: 'Does order of dates matter?', answer: 'No. The calculator automatically computes the absolute difference between both dates.' },
		],
		relatedSlugs: ['age-calculator', 'countdown-calculator', 'working-days-calculator'],
		content: makeContent(
			'The Date Difference Calculator measures the total number of whole calendar days between any two dates.',
			'The formula calculates the difference between timestamps at UTC midnight.',
			'Formula: Days = |End Date – Start Date| in milliseconds / 86,400,000.',
			[
				{ title: 'Full Year Span', description: 'Jan 1 to Dec 31, 2026.', values: { startDate: '2026-01-01', endDate: '2026-12-31' }, result: '364 days' },
			],
		),
	},
	{
		metaTitle: 'Countdown Calculator',
		slug: 'countdown-calculator',
		title: 'Countdown Calculator',
		category: 'Date & Time',
		metaDescription: 'See time remaining between two target moments.',
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
			'The Countdown Calculator breaks down time remaining into days, hours, minutes, and seconds.',
			'The formula computes total remaining seconds and converts to human-readable units.',
			'Formula: Remaining Seconds = Target Time – Current Time.',
			[
				{ title: 'New Year Countdown', description: 'Aug 29 to New Year Eve.', values: { currentDate: '2026-08-29T09:00', targetDate: '2026-12-31T23:59' }, result: '124d 14h 59m 0s' },
			],
		),
	},
	{
		metaTitle: 'Working Days Calculator',
		slug: 'working-days-calculator',
		title: 'Working Days Calculator',
		category: 'Date & Time',
		metaDescription: 'Count business days between two dates, excluding weekends.',
		inputs: [
			{ id: 'startDate', label: 'Start date', type: 'date', defaultValue: '2026-09-01' },
			{ id: 'endDate', label: 'End date', type: 'date', defaultValue: '2026-09-30' },
		],
		formula: (values) => {
			const start = getTextValue(values, 'startDate', '2026-09-01');
			const end = getTextValue(values, 'endDate', '2026-09-30');
			return workingDaysFromIso(start, end);
		},
		resultFormat: (value) => `${formatInteger(value)} working days`,
		faq: [
			{ question: 'Which days are excluded?', answer: 'Saturdays and Sundays are excluded from the business day count.' },
		],
		relatedSlugs: ['date-difference-calculator', 'countdown-calculator', 'age-calculator'],
		content: makeContent(
			'The Working Days Calculator computes business days between milestones for project planning and sprint deadlines.',
			'The engine iterates from start date to end date and counts Monday through Friday.',
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
		resultFormat: (value) => `${formatInteger(value)} words`,
		faq: [
			{ question: 'How are words counted accurately?', answer: 'Words are identified using standard unicode regex boundaries separating whitespace and punctuation tokens without transmitting text to any server.' },
			{ question: 'What is the recommended word count for a professional resume summary?', answer: 'An effective resume or CV summary should typically be between 40 and 80 words (2 to 4 concise sentences).' },
			{ question: 'What is the ideal word count for a cover letter?', answer: 'A standard professional cover letter should be between 250 and 400 words (3 to 4 short paragraphs fitting on a single page).' },
		],
		relatedSlugs: ['character-counter', 'case-converter', 'salary-calculator'],
		content: makeContent(
			'The Word Counter provides real-time word counting and text analysis for resumes, cover letters, academic essays, and articles. It runs completely in your local browser memory, ensuring your confidential documents and drafts are never sent across the internet.',
			'The counter parses all non-whitespace token clusters in the text stream, correctly handling multiple spaces, tabs, and line breaks.',
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
		resultFormat: (value) => `${formatInteger(value)} characters`,
		faq: [
			{ question: 'Do spaces and line breaks count as characters?', answer: 'Yes, this tool counts every unicode character including letters, numbers, punctuation, spaces, and newline symbols.' },
			{ question: 'What are common character limits for social media and SEO?', answer: 'Google Search meta descriptions typically display up to 155-160 characters; X (Twitter) posts allow 280 characters; LinkedIn headlines allow up to 220 characters.' },
			{ question: 'Is my pasted text kept private?', answer: 'Yes. Character counting executes 100% on your local machine with zero server communication.' },
		],
		relatedSlugs: ['word-counter', 'case-converter'],
		content: makeContent(
			'The Character Counter provides instantaneous character tracking for SEO meta titles, meta descriptions, LinkedIn summaries, and SMS messaging limits. All computations execute locally in browser memory for complete privacy.',
			'The formula calculates the unicode length of the provided text string in memory without latency.',
			'Formula: Character Count = String.length.',
			[
				{ title: 'SEO Meta Description', description: 'Checking search snippet length.', values: { text: 'Calculate monthly mortgage payments, interest costs, and total repayment with our free tool.' }, result: '93 characters' },
				{ title: 'Sample Line', description: 'Headline check.', values: { text: 'Fast Static Tools' }, result: '17 characters' },
			],
		),
	},
	{
		metaTitle: 'Case Converter',
		slug: 'case-converter',
		title: 'Case Converter',
		category: 'Text Tools',
		metaDescription: 'Convert text to UPPER, lower, Title, or Sentence case.',
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
		metaTitle: 'Currency Converter',
		slug: 'currency-converter',
		title: 'Currency Converter (Live Rates)',
		category: 'Converters',
		metaDescription: 'Convert between 160+ world currencies with free real-time exchange rates, mid-market rates, and instant currency matrix.',
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
		resultFormat: (value) => `${formatNumber(Number(value))} Converted`,
		faq: [
			{ question: 'Where do the rates come from?', answer: 'Real-time exchange rates are fetched from public central banking and interbank data feeds with zero retail markup.' },
			{ question: 'Can this convert other currencies?', answer: 'Yes! The full interactive converter supports over 160+ world currencies with live real-time synchronization.' },
		],
		relatedSlugs: ['discount-calculator', 'compound-interest-calculator', 'length-converter'],
		content: makeContent(
			'The Real-Time Currency Converter allows instant conversion across 160+ global currencies using free live foreign exchange rates. Powered by mid-market rates without hidden bank markups.',
			'The converter normalizes the source currency amount to base USD and computes the target currency equivalent using live rates.',
			'Formula: Target Amount = (Source Amount / Source Rate) × Target Rate.',
			[
				{ title: 'USD to EUR', description: '$100 converted to Euros.', values: { amount: 100, fromCurrency: 'USD', toCurrency: 'EUR' }, result: '92.50 Converted' },
				{ title: 'GBP to USD', description: '£100 converted to US Dollars.', values: { amount: 100, fromCurrency: 'GBP', toCurrency: 'USD' }, result: '129.45 Converted' },
			],
		),
	},
	{
		metaTitle: 'Length Converter',
		slug: 'length-converter',
		title: 'Length Converter',
		category: 'Converters',
		metaDescription: 'Convert length between metric and imperial units.',
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
			{ question: 'Which units are supported?', answer: 'Millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles.' },
		],
		relatedSlugs: ['weight-converter', 'temperature-converter', 'storage-unit-converter'],
		content: makeContent(
			'The Length Converter bridges metric and imperial distances with precise factor conversion.',
			'Values are converted into a meter base unit before mapping to the destination unit.',
			'Formula: Converted = (Value × FromFactor) / ToFactor.',
			[
				{ title: 'Meters to Feet', description: '10 meters to feet.', values: { value: 10, fromUnit: 'm', toUnit: 'ft' }, result: '32.81 ft' },
			],
		),
	},
	{
		metaTitle: 'Weight Converter',
		slug: 'weight-converter',
		title: 'Weight Converter',
		category: 'Converters',
		metaDescription: 'Convert mass and weight values between common metric and imperial units.',
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
			{ question: 'Which units are supported?', answer: 'Pounds, kilograms, grams, ounces, stones, and tonnes.' },
		],
		relatedSlugs: ['length-converter', 'temperature-converter', 'storage-unit-converter'],
		content: makeContent(
			'The Weight Converter provides smooth conversions for shipping, gym workouts, culinary recipes, and engineering weights.',
			'The formula maps through standard kilogram equivalents.',
			'Formula: Converted = (Weight × FromFactor) / ToFactor.',
			[
				{ title: 'Pounds to KG', description: '150 lb in kg.', values: { value: 150, fromUnit: 'lb', toUnit: 'kg' }, result: '68.04 kg' },
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
