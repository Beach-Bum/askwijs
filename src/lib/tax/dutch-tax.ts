/**
 * Dutch tax calculations for ZZP'ers (2026 rates)
 */

// ── BTW (VAT) ──────────────────────────────────────────────────────

export interface BTWQuarterSummary {
  quarter: number;
  year: number;
  btwCollected: number; // BTW on invoices (revenue)
  btwDeducted: number; // BTW on business expenses (voorbelasting)
  btwNet: number; // btwCollected - btwDeducted (positive = owe, negative = refund)
  deadline: string; // filing deadline
}

export function calculateBTW(
  transactions: Array<{
    amount: number;
    btwRate: number;
    btwAmount: number;
    isBusiness: boolean;
    date: Date;
  }>,
  quarter: number,
  year: number
): BTWQuarterSummary {
  const quarterStart = new Date(year, (quarter - 1) * 3, 1);
  const quarterEnd = new Date(year, quarter * 3, 0, 23, 59, 59);

  const quarterTxs = transactions.filter(
    (tx) => tx.date >= quarterStart && tx.date <= quarterEnd
  );

  let btwCollected = 0; // BTW on revenue (you collected from clients)
  let btwDeducted = 0; // BTW on expenses (you paid, can deduct)

  for (const tx of quarterTxs) {
    if (tx.amount > 0) {
      // Revenue: you charged BTW to client
      btwCollected += Math.abs(tx.btwAmount);
    } else if (tx.isBusiness && tx.btwAmount) {
      // Business expense: you paid BTW, can deduct
      btwDeducted += Math.abs(tx.btwAmount);
    }
  }

  // Filing deadlines: last day of month following quarter end
  const deadlineMonth = quarter * 3 + 1; // April, July, October, January
  const deadlineYear = quarter === 4 ? year + 1 : year;
  const deadline = new Date(deadlineYear, deadlineMonth, 0)
    .toISOString()
    .split("T")[0];

  return {
    quarter,
    year,
    btwCollected: Math.round(btwCollected * 100) / 100,
    btwDeducted: Math.round(btwDeducted * 100) / 100,
    btwNet: Math.round((btwCollected - btwDeducted) * 100) / 100,
    deadline,
  };
}

export function calculateBTWFromAmount(
  amount: number,
  btwRate: number
): { netAmount: number; btwAmount: number } {
  // Given a gross amount, extract the BTW
  const netAmount = amount / (1 + btwRate / 100);
  const btwAmount = amount - netAmount;
  return {
    netAmount: Math.round(netAmount * 100) / 100,
    btwAmount: Math.round(btwAmount * 100) / 100,
  };
}

// ── Income Tax Deductions (2026 estimates) ─────────────────────────

export const DEDUCTIONS_2026 = {
  zelfstandigenaftrek: 4_600, // Self-employed deduction
  startersaftrek: 2_123, // First 3 years bonus
  mkbWinstvrijstelling: 0.1331, // 13.31% of remaining profit exempt
  korThreshold: 20_000, // KOR: VAT exemption under this revenue
} as const;

export interface TaxEstimate {
  grossRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  zelfstandigenaftrek: number;
  startersaftrek: number;
  taxableIncome: number;
  mkbVrijstelling: number;
  finalTaxableIncome: number;
  estimatedTax: number;
  effectiveRate: number;
  korEligible: boolean;
}

export function estimateIncomeTax(
  grossRevenue: number,
  totalExpenses: number,
  isStarter: boolean = false,
  hoursWorked: number = 1225 // minimum 1225 hrs for zelfstandigenaftrek
): TaxEstimate {
  const grossProfit = grossRevenue - totalExpenses;

  // Zelfstandigenaftrek requires minimum 1225 hours criterion
  const zelfstandigenaftrek =
    hoursWorked >= 1225
      ? Math.min(DEDUCTIONS_2026.zelfstandigenaftrek, grossProfit)
      : 0;

  const startersaftrek =
    isStarter && hoursWorked >= 1225
      ? Math.min(DEDUCTIONS_2026.startersaftrek, grossProfit - zelfstandigenaftrek)
      : 0;

  const afterDeductions = grossProfit - zelfstandigenaftrek - startersaftrek;
  const mkbVrijstelling = afterDeductions * DEDUCTIONS_2026.mkbWinstvrijstelling;
  const finalTaxableIncome = Math.max(0, afterDeductions - mkbVrijstelling);

  // 2026 income tax brackets (box 1, estimated)
  const estimatedTax = calculateIncomeTaxBrackets(finalTaxableIncome);
  const effectiveRate =
    grossProfit > 0 ? (estimatedTax / grossProfit) * 100 : 0;

  return {
    grossRevenue,
    totalExpenses,
    grossProfit,
    zelfstandigenaftrek,
    startersaftrek,
    taxableIncome: afterDeductions,
    mkbVrijstelling: Math.round(mkbVrijstelling * 100) / 100,
    finalTaxableIncome: Math.round(finalTaxableIncome * 100) / 100,
    estimatedTax: Math.round(estimatedTax * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 10) / 10,
    korEligible: grossRevenue <= DEDUCTIONS_2026.korThreshold,
  };
}

function calculateIncomeTaxBrackets(income: number): number {
  // 2026 estimated brackets
  const brackets = [
    { limit: 38_098, rate: 0.3697 },
    { limit: 75_518, rate: 0.3697 },
    { limit: Infinity, rate: 0.4950 },
  ];

  let tax = 0;
  let remaining = income;
  let prevLimit = 0;

  for (const bracket of brackets) {
    const bracketSize = bracket.limit - prevLimit;
    const taxable = Math.min(remaining, bracketSize);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prevLimit = bracket.limit;
    if (remaining <= 0) break;
  }

  return tax;
}

// ── Quarterly deadlines ────────────────────────────────────────────

export function getBTWDeadlines(year: number): Array<{ quarter: number; deadline: string; period: string }> {
  return [
    { quarter: 1, deadline: `${year}-04-30`, period: `Jan-Mar ${year}` },
    { quarter: 2, deadline: `${year}-07-31`, period: `Apr-Jun ${year}` },
    { quarter: 3, deadline: `${year}-10-31`, period: `Jul-Sep ${year}` },
    { quarter: 4, deadline: `${year + 1}-01-31`, period: `Oct-Dec ${year}` },
  ];
}