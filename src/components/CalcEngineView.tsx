import React, { useState } from 'react';
import { SystemParameters, CalcEngineRow } from '../types';
import { Calculator, HelpCircle, Layers, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/calculator';

interface CalcEngineViewProps {
  calcRows: CalcEngineRow[];
  parameters: SystemParameters;
  asOfDateStr: string;
}

export const CalcEngineView: React.FC<CalcEngineViewProps> = ({
  calcRows,
  parameters,
  asOfDateStr
}) => {
  const [selectedAuditRow, setSelectedAuditRow] = useState<CalcEngineRow | null>(null);

  const maxPrincipal = Math.max(1, ...calcRows.map(r => Math.abs(r.runningPrincipal)));
  const maxOutstanding = Math.max(1, ...calcRows.map(r => Math.abs(r.totalRunningOutstanding)));

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Banner */}
      <div className="card-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#051C2C] text-white rounded-lg">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#888888] font-mono">Sheet Code: 03_CalcEngine</div>
            <h2 className="font-heading font-bold text-2xl text-[#051C2C] tracking-heading">
              Dynamic Balance & Interest Calculation Engine
            </h2>
            <p className="text-xs text-[#888888] mt-0.5">
              Pure JS formula engine replicating Excel dynamic arrays (SORTBY, SCAN, XLOOKUP, MAP). Calculated through As-of Date: <span className="font-mono font-bold text-[#051C2C]">{asOfDateStr}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#F5F5F2] px-3 py-1.5 rounded-lg border border-[#E8E8E6] text-xs">
          <ShieldCheck className="w-4 h-4 text-[#00C853]" />
          <span className="font-medium text-[#051C2C]">Zero Manual Formula Maintenance</span>
        </div>
      </div>

      {/* Formula Audit Inspector Card if clicked */}
      {selectedAuditRow && (
        <div className="card-static p-6 bg-[#051C2C] text-white space-y-4 animate-fade-up">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#2251FF]" />
              <h3 className="font-heading font-bold text-lg">
                Audit Inspector — Row #{selectedAuditRow.index} ({selectedAuditRow.sortedDate})
              </h3>
            </div>
            <button
              onClick={() => setSelectedAuditRow(null)}
              className="text-xs text-white/60 hover:text-white px-2 py-1 rounded bg-white/10"
            >
              Close Inspector
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-white/5 rounded border border-white/10">
              <div className="text-white/60 text-[10px] uppercase">1. Running Principal</div>
              <div className="text-sm font-bold text-white mt-1">
                {formatCurrency(selectedAuditRow.runningPrincipal, parameters.currencySymbol)}
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                SCAN(0, Movement#, prev + curr)
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded border border-white/10">
              <div className="text-white/60 text-[10px] uppercase">2. Matched Rate (XLOOKUP)</div>
              <div className="text-sm font-bold text-[#2251FF] mt-1">
                {formatPercent(selectedAuditRow.matchedRate)}
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                XLOOKUP({selectedAuditRow.sortedDate}, Tiers, Rates, 0, -1)
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded border border-white/10">
              <div className="text-white/60 text-[10px] uppercase">3. Period Interest</div>
              <div className="text-sm font-bold text-white mt-1">
                {formatCurrency(selectedAuditRow.periodInterest, parameters.currencySymbol)}
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                Principal * Rate% * ({selectedAuditRow.daysCount} / {parameters.dayBase})
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded border border-white/10">
              <div className="text-white/60 text-[10px] uppercase">4. Total Outstanding</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">
                {formatCurrency(selectedAuditRow.totalRunningOutstanding, parameters.currencySymbol)}
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                RunningPrincipal + AccruedInterest
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Calculation Engine Table */}
      <div className="card-static p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E8E6] pb-3">
          <h3 className="font-heading font-bold text-xl text-[#051C2C] tracking-heading">
            Full Re-sorted Chronological Engine Table
          </h3>
          <span className="text-xs text-[#888888]">
            Click any row to open formula audit inspector
          </span>
        </div>

        <div className="overflow-x-auto border border-[#E8E8E6] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#051C2C]/5 border-b border-[#051C2C]/10 text-[#051C2C] uppercase text-[11px] tracking-label font-semibold">
                <th className="py-3 px-3 text-center">#</th>
                <th className="py-3 px-3">Sorted Date</th>
                <th className="py-3 px-3 text-right">Sorted Movement</th>
                <th className="py-3 px-3 text-right">Running Principal</th>
                <th className="py-3 px-3 text-right">Matched Rate</th>
                <th className="py-3 px-3 text-center">Days</th>
                <th className="py-3 px-3 text-right">Period Interest</th>
                <th className="py-3 px-3 text-right">Accrued Interest</th>
                <th className="py-3 px-3 text-right">Total Outstanding</th>
                <th className="py-3 px-3">Data Bar Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6] text-xs font-mono">
              {calcRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[#888888]">
                    No calculation rows generated. Please add transactions in 02_Transactions.
                  </td>
                </tr>
              ) : (
                calcRows.map((row) => {
                  const barRatio = Math.min(100, (Math.abs(row.totalRunningOutstanding) / maxOutstanding) * 100);

                  return (
                    <tr
                      key={row.id + row.index}
                      onClick={() => setSelectedAuditRow(row)}
                      className={`hover:bg-[#F5F5F2] cursor-pointer transition-colors ${
                        row.isLastRow ? 'bg-[#2251FF]/5 font-bold' : ''
                      }`}
                    >
                      {/* Row Index */}
                      <td className="py-3 px-3 text-center text-[#888888] font-bold">
                        {row.index}
                      </td>

                      {/* Sorted Date */}
                      <td className="py-3 px-3 text-[#051C2C] font-semibold">
                        {row.sortedDate}
                        {row.isLastRow && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-[#2251FF] text-white font-sans font-normal">
                            Latest
                          </span>
                        )}
                      </td>

                      {/* Sorted Net Movement */}
                      <td className={`py-3 px-3 text-right ${row.sortedMovement < 0 ? 'text-[#888888]' : 'text-[#051C2C]'}`}>
                        {formatCurrency(row.sortedMovement, parameters.currencySymbol)}
                      </td>

                      {/* Running Principal */}
                      <td className="py-3 px-3 text-right text-[#051C2C] font-bold">
                        {formatCurrency(row.runningPrincipal, parameters.currencySymbol)}
                      </td>

                      {/* Matched Rate */}
                      <td className="py-3 px-3 text-right text-[#2251FF] font-bold">
                        {formatPercent(row.matchedRate)}
                      </td>

                      {/* Days Count */}
                      <td className="py-3 px-3 text-center text-[#051C2C]">
                        {row.daysCount} d
                      </td>

                      {/* Period Interest */}
                      <td className="py-3 px-3 text-right text-[#051C2C]">
                        {formatCurrency(row.periodInterest, parameters.currencySymbol)}
                      </td>

                      {/* Accrued Interest */}
                      <td className="py-3 px-3 text-right text-[#2251FF] font-bold">
                        {formatCurrency(row.accruedInterest, parameters.currencySymbol)}
                      </td>

                      {/* Total Running Outstanding */}
                      <td className="py-3 px-3 text-right text-[#051C2C] font-extrabold text-sm">
                        {formatCurrency(row.totalRunningOutstanding, parameters.currencySymbol)}
                      </td>

                      {/* Inline Data Bar */}
                      <td className="py-3 px-3 min-w-[100px]">
                        <div className="data-bar-track">
                          <div
                            className="data-bar-fill"
                            style={{ width: `${barRatio}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula Documentation Block */}
      <div className="insight-block space-y-2">
        <div className="flex items-center space-x-2 text-[#051C2C] font-semibold text-xs">
          <HelpCircle className="w-4 h-4 text-[#2251FF]" />
          <span>Excel Dynamic Array Formula Equivalence Mapping</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-[#1A1A2E] pt-1">
          <div>
            <strong>Running Principal:</strong> <code>=SCAN(0, Movement#, LAMBDA(p, c, p + c))</code>
          </div>
          <div>
            <strong>Matched Rate:</strong> <code>=XLOOKUP(Date, RateDates, AnnualRates, 0, -1)</code>
          </div>
          <div>
            <strong>Days Count:</strong> <code>=IF(i=N, TODAY() - Date, NextDate - Date)</code>
          </div>
          <div>
            <strong>Period Interest:</strong> <code>=Principal * Rate * (Days / DayBase)</code>
          </div>
        </div>
      </div>
    </div>
  );
};
