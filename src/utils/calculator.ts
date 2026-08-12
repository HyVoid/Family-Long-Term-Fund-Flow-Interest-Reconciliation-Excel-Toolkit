import { SystemParameters, TransactionRecord, CalcEngineRow, SummaryMetrics } from '../types';

/**
 * Calculates net movement signed value based on direction
 */
export function calculateNetMovement(
  direction: string,
  amount: number,
  outflowLabel: string,
  inflowLabel: string
): number {
  const normDir = (direction || '').trim().toLowerCase();
  const normOut = (outflowLabel || '').trim().toLowerCase();
  const normIn = (inflowLabel || '').trim().toLowerCase();

  if (normDir === normOut || normDir.includes('out') || normDir.includes('借') || normDir.includes('出')) {
    return Math.abs(amount);
  }
  if (normDir === normIn || normDir.includes('in') || normDir.includes('还') || normDir.includes('收')) {
    return -Math.abs(amount);
  }
  return Math.abs(amount);
}

/**
 * Replicates XLOOKUP with match_mode -1 (exact match or next smaller item)
 * Finds the applicable annual rate for a given transaction date
 */
export function matchInterestRate(dateStr: string, parameters: SystemParameters): number {
  if (!parameters.rateTiers || parameters.rateTiers.length === 0) {
    return 0;
  }

  // Sort tiers by effectiveDate ascending
  const sortedTiers = [...parameters.rateTiers].sort((a, b) => 
    a.effectiveDate.localeCompare(b.effectiveDate)
  );

  let matchedRate = sortedTiers[0].annualRate;
  for (const tier of sortedTiers) {
    if (tier.effectiveDate <= dateStr) {
      matchedRate = tier.annualRate;
    } else {
      break;
    }
  }

  return matchedRate;
}

/**
 * Calculates difference in integer days between two YYYY-MM-DD date strings
 */
export function daysBetween(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Get today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Replicates 03_CalcEngine Excel dynamic array logic:
 * SORTBY, SCAN running principal, XLOOKUP matched rate, interval days, SCAN accrued interest, total outstanding
 */
export function runCalcEngine(
  transactions: TransactionRecord[],
  parameters: SystemParameters,
  asOfDateStr: string = getTodayDateString()
): CalcEngineRow[] {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  // 1. Sort transactions by date ascending (SORTBY equivalent)
  const sortedTx = [...transactions]
    .filter(tx => tx.date && tx.amount > 0)
    .sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return a.id.localeCompare(b.id);
    });

  if (sortedTx.length === 0) {
    return [];
  }

  const rows: CalcEngineRow[] = [];
  let runningPrincipal = 0;
  let runningAccruedInterest = 0;

  for (let i = 0; i < sortedTx.length; i++) {
    const tx = sortedTx[i];
    const netMvmt = calculateNetMovement(tx.direction, tx.amount, parameters.outflowLabel, parameters.inflowLabel);
    
    // SCAN running principal
    runningPrincipal += netMvmt;

    // XLOOKUP matched rate
    const matchedRate = matchInterestRate(tx.date, parameters);

    // Days count: interval to next transaction date or asOfDateStr
    const isLastRow = (i === sortedTx.length - 1);
    let nextDate = isLastRow ? asOfDateStr : sortedTx[i + 1].date;
    // Ensure nextDate is not earlier than current tx date
    if (nextDate < tx.date) {
      nextDate = tx.date;
    }
    const daysCount = daysBetween(tx.date, nextDate);

    // Period interest calculation
    // Principal * Rate/100 * Days / DayBase
    const dayBase = parameters.dayBase || 365;
    let periodInterest = 0;

    if (parameters.interestMode === 'Compound') {
      // Compound interest option: P * ((1 + r/365)^days - 1)
      const dailyRate = (matchedRate / 100) / dayBase;
      periodInterest = runningPrincipal * (Math.pow(1 + dailyRate, daysCount) - 1);
    } else {
      // Simple interest
      periodInterest = runningPrincipal * (matchedRate / 100) * (daysCount / dayBase);
    }

    // Round to 2 decimal places for clean ledger accumulation
    periodInterest = Math.round(periodInterest * 100) / 100;

    // SCAN accrued interest
    runningAccruedInterest += periodInterest;
    runningAccruedInterest = Math.round(runningAccruedInterest * 100) / 100;

    const totalRunningOutstanding = Math.round((runningPrincipal + runningAccruedInterest) * 100) / 100;

    rows.push({
      index: i + 1,
      id: tx.id,
      sortedDate: tx.date,
      direction: tx.direction,
      rawAmount: tx.amount,
      sortedMovement: netMvmt,
      runningPrincipal: Math.round(runningPrincipal * 100) / 100,
      matchedRate,
      daysCount,
      periodInterest,
      accruedInterest: runningAccruedInterest,
      totalRunningOutstanding,
      isLastRow
    });
  }

  return rows;
}

/**
 * Calculates Executive Summary metrics for 04_Summary sheet
 */
export function calculateSummaryMetrics(
  transactions: TransactionRecord[],
  calcRows: CalcEngineRow[],
  parameters: SystemParameters,
  asOfDateStr: string = getTodayDateString()
): SummaryMetrics {
  let totalOutflow = 0;
  let totalInflow = 0;
  let outflowCount = 0;
  let inflowCount = 0;

  transactions.forEach(tx => {
    const net = calculateNetMovement(tx.direction, tx.amount, parameters.outflowLabel, parameters.inflowLabel);
    if (net > 0) {
      totalOutflow += tx.amount;
      outflowCount++;
    } else {
      totalInflow += tx.amount;
      inflowCount++;
    }
  });

  const lastRow = calcRows.length > 0 ? calcRows[calcRows.length - 1] : null;
  const netOutstandingPrincipal = lastRow ? lastRow.runningPrincipal : (totalOutflow - totalInflow);
  const totalAccruedInterest = lastRow ? lastRow.accruedInterest : 0;
  const currentTotalOutstanding = lastRow ? lastRow.totalRunningOutstanding : 0;

  const firstTxDate = calcRows.length > 0 ? calcRows[0].sortedDate : asOfDateStr;
  const latestTxDate = calcRows.length > 0 ? calcRows[calcRows.length - 1].sortedDate : asOfDateStr;

  // Weighted average rate or last rate
  const effectiveAverageRate = lastRow ? lastRow.matchedRate : (parameters.rateTiers[0]?.annualRate || 0);

  const totalSum = Math.max(0.001, netOutstandingPrincipal + totalAccruedInterest);
  const principalRatioPercent = Math.max(0, Math.min(100, (netOutstandingPrincipal / totalSum) * 100));
  const interestRatioPercent = Math.max(0, Math.min(100, (totalAccruedInterest / totalSum) * 100));

  return {
    asOfDate: asOfDateStr,
    totalOutflow,
    totalInflow,
    netOutstandingPrincipal,
    totalAccruedInterest,
    currentTotalOutstanding,
    outflowCount,
    inflowCount,
    firstTransactionDate: firstTxDate,
    latestTransactionDate: latestTxDate,
    effectiveAverageRate,
    principalRatioPercent,
    interestRatioPercent
  };
}

/**
 * Currency Formatter
 */
export function formatCurrency(amount: number, symbol: string = '$'): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return isNegative ? `(${symbol}${absVal})` : `${symbol}${absVal}`;
}

/**
 * Percentage Formatter
 */
export function formatPercent(rate: number): string {
  return `${rate.toFixed(2)}%`;
}
