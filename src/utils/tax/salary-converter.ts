export interface SalaryPeriodBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  semimonthly: number;
  monthly: number;
  quarterly: number;
  annual: number;
}

export function convertSalary(
  amount: number,
  fromFrequency: 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annual',
  hoursPerWeek: number = 40,
  daysPerWeek: number = 5,
  weeksPerYear: number = 52
): SalaryPeriodBreakdown {
  const validAmount = Math.max(0, isNaN(amount) ? 0 : amount);
  const validHours = Math.max(1, isNaN(hoursPerWeek) ? 40 : hoursPerWeek);
  const validDays = Math.max(1, isNaN(daysPerWeek) ? 5 : daysPerWeek);
  const validWeeks = Math.max(1, isNaN(weeksPerYear) ? 52 : weeksPerYear);

  let annual = 0;

  switch (fromFrequency) {
    case 'hourly':
      annual = validAmount * validHours * validWeeks;
      break;
    case 'daily':
      annual = validAmount * validDays * validWeeks;
      break;
    case 'weekly':
      annual = validAmount * validWeeks;
      break;
    case 'biweekly':
      annual = validAmount * (validWeeks / 2);
      break;
    case 'monthly':
      annual = validAmount * 12;
      break;
    case 'annual':
    default:
      annual = validAmount;
      break;
  }

  const totalHours = validHours * validWeeks;
  const totalDays = validDays * validWeeks;

  return {
    hourly: totalHours > 0 ? annual / totalHours : 0,
    daily: totalDays > 0 ? annual / totalDays : 0,
    weekly: validWeeks > 0 ? annual / validWeeks : 0,
    biweekly: validWeeks > 0 ? (annual / validWeeks) * 2 : 0,
    semimonthly: annual / 24,
    monthly: annual / 12,
    quarterly: annual / 4,
    annual: annual,
  };
}

export interface OvertimeResult {
  regularPay: number;
  overtimePay: number;
  doubleTimePay: number;
  totalGrossPay: number;
  effectiveHourlyRate: number;
}

export function calculateOvertimePay(
  hourlyRate: number,
  regularHours: number,
  overtimeHours: number = 0,
  doubleTimeHours: number = 0,
  overtimeMultiplier: number = 1.5,
  doubleTimeMultiplier: number = 2.0
): OvertimeResult {
  const rate = Math.max(0, hourlyRate);
  const regHours = Math.max(0, regularHours);
  const otHours = Math.max(0, overtimeHours);
  const dtHours = Math.max(0, doubleTimeHours);

  const regularPay = rate * regHours;
  const overtimePay = rate * overtimeMultiplier * otHours;
  const doubleTimePay = rate * doubleTimeMultiplier * dtHours;
  const totalGrossPay = regularPay + overtimePay + doubleTimePay;
  const totalHours = regHours + otHours + dtHours;

  return {
    regularPay,
    overtimePay,
    doubleTimePay,
    totalGrossPay,
    effectiveHourlyRate: totalHours > 0 ? totalGrossPay / totalHours : rate,
  };
}
