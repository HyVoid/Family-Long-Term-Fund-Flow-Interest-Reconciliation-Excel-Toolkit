import { SystemParameters, TransactionRecord, BackupData } from '../types';

const STORAGE_KEY = 'family_fund_ledger_v1';
const TIMESTAMP_KEY = 'family_fund_ledger_last_saved';

export const DEFAULT_PARAMETERS: SystemParameters = {
  currencySymbol: '$',
  dayBase: 365,
  interestMode: 'Simple',
  outflowLabel: 'Disbursement / Outflow',
  inflowLabel: 'Repayment / Inflow',
  rateTiers: [
    { id: 'rate-1', effectiveDate: '2015-01-01', annualRate: 5.25, note: 'Initial historical rate baseline' },
    { id: 'rate-2', effectiveDate: '2018-06-01', annualRate: 4.85, note: 'Market rate adjustment' },
    { id: 'rate-3', effectiveDate: '2020-01-01', annualRate: 4.35, note: 'Central bank benchmark rate cut' },
    { id: 'rate-4', effectiveDate: '2023-01-01', annualRate: 3.85, note: 'Recent market rate tier' },
    { id: 'rate-5', effectiveDate: '2025-01-01', annualRate: 3.45, note: 'Current benchmark tier' }
  ]
};

export const DEFAULT_TRANSACTIONS: TransactionRecord[] = [
  { id: 'TXN-2015-001', date: '2015-03-15', direction: 'Disbursement / Outflow', amount: 150000, description: 'Initial family home purchase down payment assistance' },
  { id: 'TXN-2016-002', date: '2016-09-10', direction: 'Disbursement / Outflow', amount: 50000, description: 'Educational fund advance for post-graduate study' },
  { id: 'TXN-2017-003', date: '2017-12-20', direction: 'Repayment / Inflow', amount: 30000, description: 'Year-end bonus partial principal repayment' },
  { id: 'TXN-2019-004', date: '2019-05-18', direction: 'Disbursement / Outflow', amount: 80000, description: 'Vehicle purchase & insurance support fund' },
  { id: 'TXN-2020-005', date: '2020-10-05', direction: 'Repayment / Inflow', amount: 20000, description: 'Autumn partial principal repayment' },
  { id: 'TXN-2022-006', date: '2022-04-12', direction: 'Repayment / Inflow', amount: 40000, description: 'Spring dividend repayment' },
  { id: 'TXN-2024-007', date: '2024-01-20', direction: 'Disbursement / Outflow', amount: 60000, description: 'Property renovation bridge loan' },
  { id: 'TXN-2025-008', date: '2025-06-15', direction: 'Repayment / Inflow', amount: 25000, description: 'Mid-year family fund return' }
];

export interface LoadedState {
  parameters: SystemParameters;
  transactions: TransactionRecord[];
  lastSaved: string;
}

/**
 * Loads parameters and transactions from localStorage or falls back to defaults
 */
export function loadState(): LoadedState {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    const rawTime = localStorage.getItem(TIMESTAMP_KEY);

    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (parsed.parameters && Array.isArray(parsed.transactions)) {
        let outflowLabel = parsed.parameters.outflowLabel || DEFAULT_PARAMETERS.outflowLabel;
        let inflowLabel = parsed.parameters.inflowLabel || DEFAULT_PARAMETERS.inflowLabel;

        if (outflowLabel.includes('借') || outflowLabel.includes('出')) {
          outflowLabel = DEFAULT_PARAMETERS.outflowLabel;
        }
        if (inflowLabel.includes('还') || inflowLabel.includes('收')) {
          inflowLabel = DEFAULT_PARAMETERS.inflowLabel;
        }

        const normalizedTransactions: TransactionRecord[] = parsed.transactions.map((tx: TransactionRecord) => {
          let dir = tx.direction;
          if (dir.includes('借') || dir.includes('出')) {
            dir = outflowLabel;
          } else if (dir.includes('还') || dir.includes('收')) {
            dir = inflowLabel;
          }
          return { ...tx, direction: dir };
        });

        const parameters: SystemParameters = {
          ...DEFAULT_PARAMETERS,
          ...parsed.parameters,
          outflowLabel,
          inflowLabel,
          rateTiers: parsed.parameters.rateTiers || DEFAULT_PARAMETERS.rateTiers
        };

        return {
          parameters,
          transactions: normalizedTransactions,
          lastSaved: rawTime || new Date().toLocaleString('en-US')
        };
      }
    }
  } catch (err) {
    console.error('Failed to parse localStorage state:', err);
  }

  // Fallback to default initial state
  const initialTime = new Date().toLocaleString('en-US');
  saveState(DEFAULT_PARAMETERS, DEFAULT_TRANSACTIONS, initialTime);
  return {
    parameters: DEFAULT_PARAMETERS,
    transactions: DEFAULT_TRANSACTIONS,
    lastSaved: initialTime
  };
}

/**
 * Saves current application state to localStorage
 */
export function saveState(
  parameters: SystemParameters,
  transactions: TransactionRecord[],
  timestampStr?: string
): string {
  const time = timestampStr || new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  });

  const payload: BackupData = {
    version: '1.0.0',
    exportedAt: time,
    parameters,
    transactions
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(TIMESTAMP_KEY, time);
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }

  return time;
}

/**
 * Resets state to default seed data
 */
export function resetState(): LoadedState {
  const resetTime = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  });
  saveState(DEFAULT_PARAMETERS, DEFAULT_TRANSACTIONS, resetTime);
  return {
    parameters: DEFAULT_PARAMETERS,
    transactions: DEFAULT_TRANSACTIONS,
    lastSaved: resetTime
  };
}

/**
 * Triggers browser download of current state as JSON file
 */
export function exportBackupJSON(parameters: SystemParameters, transactions: TransactionRecord[]) {
  const nowStr = new Date().toISOString().slice(0, 10);
  const data: BackupData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    parameters,
    transactions
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `family_fund_ledger_backup_${nowStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse JSON backup file text and validate structure
 */
export function parseBackupJSON(jsonContent: string): BackupData {
  const parsed = JSON.parse(jsonContent);
  if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
    throw new Error('Invalid backup file: Missing "transactions" array');
  }
  if (!parsed.parameters) {
    throw new Error('Invalid backup file: Missing "parameters" object');
  }
  return parsed as BackupData;
}

/**
 * Parses CSV text content into TransactionRecord list
 */
export function parseBulkCSV(
  csvText: string,
  outflowLabel: string,
  inflowLabel: string
): { records: TransactionRecord[]; errors: string[] } {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const errors: string[] = [];
  const records: TransactionRecord[] = [];

  if (lines.length === 0) {
    errors.push('CSV file is empty');
    return { records, errors };
  }

  // Header detection
  const firstLineLower = lines[0].toLowerCase();
  const hasHeader = firstLineLower.includes('date') || firstLineLower.includes('amount') || firstLineLower.includes('direction') || firstLineLower.includes('日期');
  const startIdx = hasHeader ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    // Split respecting quotes or simple commas
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());

    if (parts.length < 3) {
      errors.push(`Line ${i + 1}: Insufficient columns (expected at least Date, Direction, Amount)`);
      continue;
    }

    const date = parts[0];
    const rawDir = parts[1];
    const amountStr = parts[2].replace(/[$,¥€]/g, '');
    const amount = parseFloat(amountStr);
    const description = parts[3] || 'Bulk CSV imported transaction';

    // Validate date (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Line ${i + 1}: Invalid date format "${date}" (expected YYYY-MM-DD)`);
      continue;
    }

    if (isNaN(amount) || amount <= 0) {
      errors.push(`Line ${i + 1}: Invalid amount "${parts[2]}"`);
      continue;
    }

    // Determine normalized direction label
    let finalDir = outflowLabel;
    const normDir = rawDir.toLowerCase();
    if (normDir.includes('in') || normDir.includes('还') || normDir.includes('收') || normDir.includes('repay')) {
      finalDir = inflowLabel;
    }

    const id = `TXN-CSV-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

    records.push({
      id,
      date,
      direction: finalDir,
      amount,
      description
    });
  }

  return { records, errors };
}
