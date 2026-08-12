import React, { useState } from 'react';
import { SystemParameters, SummaryMetrics, CalcEngineRow } from '../types';
import { BarChart3, TrendingUp, DollarSign, Calendar, AlertCircle, Award, ArrowUpRight, CheckCircle2, PieChart, Layers } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/calculator';

interface SummaryViewProps {
  summary: SummaryMetrics;
  calcRows: CalcEngineRow[];
  parameters: SystemParameters;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  calcRows,
  parameters
}) => {
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Banner */}
      <div className="card-surface p-6 bg-gradient-to-r from-[#051C2C] via-[#0A2D46] to-[#051C2C] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#2251FF]/20 text-[#2251FF] border border-[#2251FF]/30 rounded-full text-xs font-medium mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sheet Code: 04_Summary</span>
          </div>
          <h2 className="font-heading font-bold text-3xl tracking-display text-white">
            Current Financial Status & Decision Dashboard
          </h2>
          <p className="text-white/80 text-xs mt-1">
            Real-time executive settlement summary calculated through <span className="font-mono font-bold text-emerald-400">{summary.asOfDate}</span>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-right min-w-[220px]">
          <div className="text-[11px] text-white/70 uppercase tracking-label">Final Current Outstanding</div>
          <div className="font-heading font-extrabold text-3xl text-emerald-400 tracking-display mt-0.5">
            {formatCurrency(summary.currentTotalOutstanding, parameters.currencySymbol)}
          </div>
          <div className="text-[10px] text-white/60 mt-1">
            Net Principal + Total Accrued Interest
          </div>
        </div>
      </div>

      {/* Hero KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Net Outstanding Principal */}
        <div className="card-surface p-6 space-y-2 border-l-4 border-l-[#2251FF]">
          <div className="text-[11px] text-[#888888] uppercase tracking-label font-semibold">
            Net Outstanding Principal
          </div>
          <div className="font-heading font-bold text-3xl text-[#051C2C] tracking-display">
            {formatCurrency(summary.netOutstandingPrincipal, parameters.currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs text-[#888888] pt-1">
            <span>Outflow - Inflow</span>
            <span className="font-mono font-bold text-[#2251FF]">{summary.principalRatioPercent.toFixed(1)}% of total</span>
          </div>
        </div>

        {/* KPI 2: Total Accrued Interest */}
        <div className="card-surface p-6 space-y-2 border-l-4 border-l-[#2251FF]">
          <div className="text-[11px] text-[#888888] uppercase tracking-label font-semibold">
            Total Accrued Interest (10-Yr)
          </div>
          <div className="font-heading font-bold text-3xl text-[#051C2C] tracking-display">
            {formatCurrency(summary.totalAccruedInterest, parameters.currencySymbol)}
          </div>
          <div className="flex items-center justify-between text-xs text-[#888888] pt-1">
            <span>Dynamic market rate</span>
            <span className="font-mono font-bold text-[#2251FF]">{summary.interestRatioPercent.toFixed(1)}% of total</span>
          </div>
        </div>

        {/* KPI 3: Total Cumulative Disbursed */}
        <div className="card-surface p-6 space-y-2">
          <div className="text-[11px] text-[#888888] uppercase tracking-label font-semibold">
            Total Historical Disbursed
          </div>
          <div className="font-heading font-bold text-3xl text-[#051C2C] tracking-display">
            {formatCurrency(summary.totalOutflow, parameters.currencySymbol)}
          </div>
          <div className="text-xs text-[#888888] pt-1">
            Across {summary.outflowCount} historical disbursements
          </div>
        </div>

        {/* KPI 4: Total Cumulative Repaid */}
        <div className="card-surface p-6 space-y-2">
          <div className="text-[11px] text-[#888888] uppercase tracking-label font-semibold">
            Total Historical Repaid
          </div>
          <div className="font-heading font-bold text-3xl text-[#051C2C] tracking-display">
            {formatCurrency(summary.totalInflow, parameters.currencySymbol)}
          </div>
          <div className="text-xs text-[#888888] pt-1">
            Across {summary.inflowCount} historical repayments
          </div>
        </div>
      </div>

      {/* Composition Ratio & Timeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Principal vs Interest Composition */}
        <div className="card-static p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-[#E8E8E6] pb-3">
            <PieChart className="w-5 h-5 text-[#2251FF]" />
            <h3 className="font-heading font-bold text-xl text-[#051C2C] tracking-heading">
              1. Outstanding Composition Ratio
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#051C2C]">Net Principal</span>
                <span className="font-mono text-[#2251FF]">
                  {formatCurrency(summary.netOutstandingPrincipal, parameters.currencySymbol)} ({summary.principalRatioPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-[#E8E8E6] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#051C2C] h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary.principalRatioPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#051C2C]">Accrued Interest</span>
                <span className="font-mono text-[#2251FF]">
                  {formatCurrency(summary.totalAccruedInterest, parameters.currencySymbol)} ({summary.interestRatioPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-[#E8E8E6] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#2251FF] h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary.interestRatioPercent}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6] space-y-2 text-xs">
              <div className="flex justify-between text-[#888888]">
                <span>First Ledger Date:</span>
                <span className="font-mono font-bold text-[#051C2C]">{summary.firstTransactionDate}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Latest Ledger Date:</span>
                <span className="font-mono font-bold text-[#051C2C]">{summary.latestTransactionDate}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Effective Current Rate:</span>
                <span className="font-mono font-bold text-[#2251FF]">{formatPercent(summary.effectiveAverageRate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Exposure Matrix */}
        <div className="card-static p-6 space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E8E8E6] pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#2251FF]" />
              <h3 className="font-heading font-bold text-xl text-[#051C2C] tracking-heading">
                2. Interactive Financial Exposure Matrix
              </h3>
            </div>
            <span className="text-xs text-[#888888]">Hover cells to scale & inspect</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Matrix Cell 1 */}
            <div
              onClick={() => setSelectedMatrixCell('principal')}
              className="matrix-cell p-4 rounded-xl bg-[#F5F5F2] border border-[#E8E8E6] space-y-2"
            >
              <div className="text-[10px] text-[#888888] uppercase tracking-label font-bold">
                Net Principal Exposure
              </div>
              <div className="font-heading font-bold text-xl text-[#051C2C]">
                {formatCurrency(summary.netOutstandingPrincipal, parameters.currencySymbol)}
              </div>
              <div className="text-[11px] text-[#2251FF] font-medium">
                Click to inspect
              </div>
            </div>

            {/* Matrix Cell 2 */}
            <div
              onClick={() => setSelectedMatrixCell('interest')}
              className="matrix-cell p-4 rounded-xl bg-[#2251FF]/10 border border-[#2251FF]/20 space-y-2"
            >
              <div className="text-[10px] text-[#2251FF] uppercase tracking-label font-bold">
                Accumulated Interest
              </div>
              <div className="font-heading font-bold text-xl text-[#2251FF]">
                {formatCurrency(summary.totalAccruedInterest, parameters.currencySymbol)}
              </div>
              <div className="text-[11px] text-[#2251FF] font-medium">
                Click to inspect
              </div>
            </div>

            {/* Matrix Cell 3 */}
            <div
              onClick={() => setSelectedMatrixCell('rate')}
              className="matrix-cell p-4 rounded-xl bg-[#F5F5F2] border border-[#E8E8E6] space-y-2"
            >
              <div className="text-[10px] text-[#888888] uppercase tracking-label font-bold">
                Current Rate Tier
              </div>
              <div className="font-heading font-bold text-xl text-[#051C2C]">
                {formatPercent(summary.effectiveAverageRate)}
              </div>
              <div className="text-[11px] text-[#888888]">
                XLOOKUP matched
              </div>
            </div>

            {/* Matrix Cell 4 */}
            <div
              onClick={() => setSelectedMatrixCell('total')}
              className="matrix-cell p-4 rounded-xl bg-[#051C2C] text-white space-y-2"
            >
              <div className="text-[10px] text-white/60 uppercase tracking-label font-bold">
                Total Settlement
              </div>
              <div className="font-heading font-bold text-xl text-emerald-400">
                {formatCurrency(summary.currentTotalOutstanding, parameters.currencySymbol)}
              </div>
              <div className="text-[11px] text-white/80">
                Final total due
              </div>
            </div>
          </div>

          {selectedMatrixCell && (
            <div className="p-4 bg-[#051C2C] text-white rounded-lg text-xs space-y-1 animate-fade-up">
              <div className="font-bold text-[#2251FF] uppercase text-[10px]">Matrix Inspector Detail</div>
              <p className="text-white/80">
                {selectedMatrixCell === 'principal' && `Net Outstanding Principal is calculated as Total Disbursed (${formatCurrency(summary.totalOutflow, parameters.currencySymbol)}) minus Total Repaid (${formatCurrency(summary.totalInflow, parameters.currencySymbol)}).`}
                {selectedMatrixCell === 'interest' && `Accumulated Interest represents total market interest accrued across all period intervals between transaction dates up to ${summary.asOfDate}.`}
                {selectedMatrixCell === 'rate' && `Current Rate Tier is ${formatPercent(summary.effectiveAverageRate)}, which applies from the latest benchmark rate update.`}
                {selectedMatrixCell === 'total' && `Total Settlement Amount is the binding financial baseline sum of Net Principal plus Accrued Interest.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Insight Block */}
      <div className="insight-block space-y-3">
        <div className="flex items-center space-x-2 text-[#051C2C] font-semibold text-sm">
          <Award className="w-5 h-5 text-[#2251FF]" />
          <span>Executive Summary & Settlement Recommendation</span>
        </div>
        <div className="text-xs text-[#1A1A2E] leading-relaxed space-y-1.5">
          <p>
            <strong>Baseline Settlement Amount:</strong> As of <span className="font-mono font-bold">{summary.asOfDate}</span>, the total outstanding financial balance stands at <span className="font-mono font-bold text-[#2251FF]">{formatCurrency(summary.currentTotalOutstanding, parameters.currencySymbol)}</span>.
          </p>
          <p>
            <strong>Principal vs. Interest Breakdown:</strong> The principal balance accounts for <strong>{summary.principalRatioPercent.toFixed(1)}%</strong> ({formatCurrency(summary.netOutstandingPrincipal, parameters.currencySymbol)}), while historical market interest accounts for <strong>{summary.interestRatioPercent.toFixed(1)}%</strong> ({formatCurrency(summary.totalAccruedInterest, parameters.currencySymbol)}).
          </p>
          <p>
            <strong>Audit Guarantee:</strong> Every calculation step is deterministic and zero-hardcoded. Updating rate tiers or inserting historical records will instantly recalibrate the entire timeline.
          </p>
        </div>
      </div>
    </div>
  );
};
