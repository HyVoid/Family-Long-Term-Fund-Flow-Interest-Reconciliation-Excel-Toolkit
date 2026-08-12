import React from 'react';
import { BookOpen, Layers, ShieldCheck, Cpu, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

export const InstructionsView: React.FC = () => {
  const modules = [
    { code: '00_Instructions', name: 'System Instructions', sheetName: 'System Description & Guide', purpose: 'Provides architecture overview, SOP guides, and validation dictionary', type: 'Static Reference' },
    { code: '01_Parameters', name: 'Parameters & Rates', sheetName: 'Parameters & Rates Config', purpose: 'Centralized global config (tiered interest schedule, day base, direction labels)', type: 'Manual Input / Config' },
    { code: '02_Transactions', name: 'Transaction Ledger', sheetName: 'Historical Fund Ledger', purpose: 'Standardized 10-year transaction records with automatic Net Movement calculation', type: 'Manual Entry / Auto Column' },
    { code: '03_CalcEngine', name: 'Calculation Engine', sheetName: 'Dynamic Balance & Interest Engine', purpose: 'Chronological re-sorting, running principal, dynamic interest rate lookup & accrued interest', type: 'Pure Formula Engine' },
    { code: '04_Summary', name: 'Summary Dashboard', sheetName: 'Current Financial Status', purpose: 'Executive summary KPI dashboard, principal vs interest ratio, and exposure breakdown', type: 'Executive Dashboard' }
  ];

  const sopSteps = [
    { step: '1', title: 'Review Global Parameters', desc: 'Navigate to 01_Parameters to verify currency symbol, interest day base (365/360), and market interest rate tiers.' },
    { step: '2', title: 'Enter Historical Flow', desc: 'Record transaction details (Date, Direction, Amount, Description) in 02_Transactions. Net Movement is auto-derived.' },
    { step: '3', title: 'Automatic Calculation Engine', desc: '03_CalcEngine automatically re-sorts transactions, matches applicable interest rates, and calculates cumulative interest to date.' },
    { step: '4', title: 'Executive Decision Dashboard', desc: 'View current Outstanding balance, Net Principal, and Accrued Interest breakdown in real time on 04_Summary.' },
    { step: '5', title: 'Backup & Data Security', desc: 'All data is auto-saved locally in localStorage. Use "Export Backup" to save a JSON snapshot at any time.' }
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Banner */}
      <div className="card-surface p-8 bg-gradient-to-r from-[#051C2C] to-[#0A2D46] text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#2251FF]/20 text-[#2251FF] border border-[#2251FF]/30 rounded-full text-xs font-medium mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sheet Code: 00_Instructions</span>
            </div>
            <h2 className="font-heading font-bold text-3xl tracking-display text-white mb-2">
              Family Long-Term Fund Flow & Interest Reconciliation Excel Toolkit
            </h2>
            <p className="text-white/80 text-sm max-w-3xl leading-relaxed">
              This system reconstructs long-term family fund flows into a standardized chronological time series, automatically calculating running principal balances and dynamic tiered market interest over time.
            </p>
          </div>
          <div className="hidden lg:block text-right border-l border-white/10 pl-8">
            <div className="text-xs text-white/60">System Version</div>
            <div className="text-lg font-mono font-bold text-white">v1.0.0 Pro</div>
            <div className="text-xs text-white/60 mt-1">Formula Model: Excel Dynamic Array</div>
          </div>
        </div>
      </div>

      {/* Module Hierarchy Table */}
      <div className="card-static p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-[#2251FF]" />
          <h3 className="font-heading font-bold text-xl text-[#051C2C] tracking-heading">
            1. Module Structure & Sheet Architecture
          </h3>
        </div>

        <div className="overflow-x-auto border border-[#E8E8E6] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#051C2C]/5 border-b border-[#051C2C]/10 text-[#051C2C] uppercase text-[11px] tracking-label font-semibold">
                <th className="py-3 px-4">Sheet Code</th>
                <th className="py-3 px-4">Module Name</th>
                <th className="py-3 px-4">Worksheet Name</th>
                <th className="py-3 px-4">Business Purpose & Data Role</th>
                <th className="py-3 px-4">Property</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6] text-xs">
              {modules.map((m) => (
                <tr key={m.code} className="hover:bg-[#F5F5F2]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#051C2C]">{m.code}</td>
                  <td className="py-3 px-4 font-semibold text-[#051C2C]">{m.name}</td>
                  <td className="py-3 px-4 text-[#051C2C]">{m.sheetName}</td>
                  <td className="py-3 px-4 text-[#1A1A2E]">{m.purpose}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#051C2C]/10 text-[#051C2C]">
                      {m.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Flow Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Logic Flow */}
        <div className="card-static p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#2251FF]" />
            <h3 className="font-heading font-bold text-xl text-[#051C2C] tracking-heading">
              2. Data Flow & Formula Linkage
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs text-[#051C2C] bg-[#F5F5F2] p-4 rounded-lg border border-[#E8E8E6]">
            <div className="p-2 bg-white rounded border border-[#E8E8E6]">
              [01_Parameters] Global Config (Rate Tiers / Day Base / Labels)
            </div>
            <div className="text-center text-[#2251FF] font-bold">│</div>
            <div className="p-2 bg-white rounded border border-[#E8E8E6]">
              [02_Transactions] Raw Ledger Input ──► MAP/IF Net Movement
            </div>
            <div className="text-center text-[#2251FF] font-bold">│</div>
            <div className="p-2 bg-white rounded border border-[#E8E8E6] space-y-1">
              <div className="font-bold text-[#2251FF]">[03_CalcEngine] Pure JS Engine</div>
              <div className="text-[11px] text-[#888888]">1. SORTBY chronological re-order</div>
              <div className="text-[11px] text-[#888888]">2. SCAN running principal accumulation</div>
              <div className="text-[11px] text-[#888888]">3. XLOOKUP dynamic tiered rate matching</div>
              <div className="text-[11px] text-[#888888]">4. Days interval to next event or TODAY()</div>
              <div className="text-[11px] text-[#888888]">5. SCAN accrued cumulative interest</div>
            </div>
            <div className="text-center text-[#2251FF] font-bold">│</div>
            <div className="p-2 bg-[#051C2C] text-white rounded font-bold">
              [04_Summary] Real-time Outstanding & KPI Dashboard
            </div>
          </div>
        </div>

        {/* Right: Operational SOP */}
        <div className="card-static p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#2251FF]" />
            <h3 className="font-heading font-bold text-xl text-[#051C2C] tracking-heading">
              3. Standard Operating Procedure (SOP)
            </h3>
          </div>

          <div className="space-y-3">
            {sopSteps.map((s) => (
              <div key={s.step} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F5F5F2] transition-colors border border-transparent hover:border-[#E8E8E6]">
                <div className="w-6 h-6 rounded-full bg-[#051C2C] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#051C2C]">{s.title}</h4>
                  <p className="text-xs text-[#888888] mt-0.5 leading-normal">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Principles Block */}
      <div className="insight-block space-y-2">
        <div className="flex items-center space-x-2 text-[#051C2C] font-semibold text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#2251FF]" />
          <span>Core Architectural Principles</span>
        </div>
        <p className="text-xs text-[#1A1A2E] leading-relaxed">
          <strong>Zero Hardcoding:</strong> All interest rates, day count bases, currency symbols, and directional labels are extracted to the parameter layer.
          <br />
          <strong>Zero Formula Maintenance:</strong> Calculations are fully automated using dynamic array algorithms without manual row dragging.
          <br />
          <strong>Auditability:</strong> Every mathematical transformation from raw transaction to current total outstanding is fully transparent in 03_CalcEngine.
        </p>
      </div>
    </div>
  );
};
