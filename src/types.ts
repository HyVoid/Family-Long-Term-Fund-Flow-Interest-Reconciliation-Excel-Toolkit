export interface InterestRateTier {
  id: string;
  effectiveDate: string; // YYYY-MM-DD
  annualRate: number;    // percentage, e.g. 5.25 for 5.25%
  note?: string;
}

export interface SystemParameters {
  currencySymbol: string;      // e.g. "$" or "¥"
  dayBase: number;             // 365 or 360
  interestMode: 'Simple' | 'Compound'; // Simple interest or Compound interest
  outflowLabel: string;        // e.g. "Disbursement / Outflow"
  inflowLabel: string;         // e.g. "Repayment / Inflow"
  rateTiers: InterestRateTier[];
}

export interface TransactionRecord {
  id: string;
  date: string;       // YYYY-MM-DD
  direction: string;  // Matches parameters outflowLabel or inflowLabel
  amount: number;     // Always positive number
  description: string;
  category?: string;
}

export interface CalcEngineRow {
  index: number;
  id: string;
  sortedDate: string;
  direction: string;
  rawAmount: number;
  sortedMovement: number;       // + for outflow, - for inflow
  runningPrincipal: number;     // SCAN running principal balance
  matchedRate: number;          // Matched annual rate (%) from XLOOKUP
  daysCount: number;            // Interval days to next event or TODAY
  periodInterest: number;       // Principal * Rate * (Days / DayBase)
  accruedInterest: number;      // SCAN running cumulative interest
  totalRunningOutstanding: number; // Running Principal + Accrued Interest
  isLastRow: boolean;
}

export interface SummaryMetrics {
  asOfDate: string;
  totalOutflow: number;
  totalInflow: number;
  netOutstandingPrincipal: number;
  totalAccruedInterest: number;
  currentTotalOutstanding: number;
  outflowCount: number;
  inflowCount: number;
  firstTransactionDate: string;
  latestTransactionDate: string;
  effectiveAverageRate: number;
  principalRatioPercent: number;
  interestRatioPercent: number;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  parameters: SystemParameters;
  transactions: TransactionRecord[];
}

export type ActiveTab = 'instructions' | 'parameters' | 'transactions' | 'calc_engine' | 'summary';
