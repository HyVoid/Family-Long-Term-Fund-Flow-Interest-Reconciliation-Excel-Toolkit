import React, { useState } from 'react';
import { SystemParameters, InterestRateTier } from '../types';
import { Settings, Plus, Trash2, Calendar, Percent, Info, RefreshCw, Check } from 'lucide-react';
import { formatPercent } from '../utils/calculator';

interface ParametersViewProps {
  parameters: SystemParameters;
  onUpdateParameters: (updated: SystemParameters) => void;
}

export const ParametersView: React.FC<ParametersViewProps> = ({
  parameters,
  onUpdateParameters
}) => {
  const [newEffectiveDate, setNewEffectiveDate] = useState('');
  const [newAnnualRate, setNewAnnualRate] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGlobalChange = (field: keyof SystemParameters, value: any) => {
    const updated = { ...parameters, [field]: value };
    onUpdateParameters(updated);
    triggerSuccessFeedback();
  };

  const triggerSuccessFeedback = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
  };

  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEffectiveDate || !newAnnualRate) return;

    const rateNum = parseFloat(newAnnualRate);
    if (isNaN(rateNum) || rateNum < 0) return;

    const newTier: InterestRateTier = {
      id: `rate-${Date.now()}`,
      effectiveDate: newEffectiveDate,
      annualRate: rateNum,
      note: newNote.trim() || 'Custom rate tier'
    };

    // Keep sorted by effectiveDate ascending
    const updatedTiers = [...parameters.rateTiers, newTier].sort((a, b) =>
      a.effectiveDate.localeCompare(b.effectiveDate)
    );

    onUpdateParameters({
      ...parameters,
      rateTiers: updatedTiers
    });

    setNewEffectiveDate('');
    setNewAnnualRate('');
    setNewNote('');
    triggerSuccessFeedback();
  };

  const handleDeleteTier = (id: string) => {
    if (parameters.rateTiers.length <= 1) {
      alert('At least one interest rate tier must be maintained in the system.');
      return;
    }
    const updatedTiers = parameters.rateTiers.filter(t => t.id !== id);
    onUpdateParameters({
      ...parameters,
      rateTiers: updatedTiers
    });
    triggerSuccessFeedback();
  };

  const handleUpdateTierRate = (id: string, rateStr: string) => {
    const rateNum = parseFloat(rateStr);
    if (isNaN(rateNum) || rateNum < 0) return;

    const updatedTiers = parameters.rateTiers.map(t =>
      t.id === id ? { ...t, annualRate: rateNum } : t
    );

    onUpdateParameters({
      ...parameters,
      rateTiers: updatedTiers
    });
    triggerSuccessFeedback();
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Banner */}
      <div className="card-surface p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#051C2C] text-white rounded-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#888888] font-mono">Sheet Code: 01_Parameters</div>
            <h2 className="font-heading font-bold text-2xl text-[#051C2C] tracking-heading">
              Parameters & Market Rate Assumptions
            </h2>
            <p className="text-xs text-[#888888] mt-0.5">
              Single-point maintenance: Changes here immediately propagate across all historical calculation engines.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#00C853]/10 text-[#00C853] text-xs font-semibold rounded-md animate-pulse">
            <Check className="w-4 h-4" />
            <span>Updated & Saved</span>
          </div>
        )}
      </div>

      {/* Global Config Section */}
      <div className="card-static p-6 space-y-6">
        <h3 className="font-heading font-bold text-xl text-[#051C2C] tracking-heading border-b border-[#E8E8E6] pb-3">
          1. Global System Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Currency Symbol */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block">
              Default Currency Symbol
            </label>
            <input
              type="text"
              value={parameters.currencySymbol}
              onChange={(e) => handleGlobalChange('currencySymbol', e.target.value)}
              className="editable-cell w-full px-3 py-2 text-sm font-mono font-bold text-[#051C2C]"
              placeholder="$"
            />
            <p className="text-[11px] text-[#888888]">Used in all monetary displays ($ / ¥ / € / £)</p>
          </div>

          {/* Interest Day Base */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block">
              Annual Day Count Base
            </label>
            <select
              value={parameters.dayBase}
              onChange={(e) => handleGlobalChange('dayBase', parseInt(e.target.value))}
              className="editable-cell w-full px-3 py-2 text-sm font-semibold text-[#051C2C]"
            >
              <option value={365}>365 Days (Actual/365 Exact Base)</option>
              <option value={360}>360 Days (Commercial 30/360 Base)</option>
            </select>
            <p className="text-[11px] text-[#888888]">Basis for daily rate calculation (Rate / Day Base)</p>
          </div>

          {/* Interest Calculation Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block">
              Interest Mode
            </label>
            <select
              value={parameters.interestMode}
              onChange={(e) => handleGlobalChange('interestMode', e.target.value)}
              className="editable-cell w-full px-3 py-2 text-sm font-semibold text-[#051C2C]"
            >
              <option value="Simple">Simple Interest (Standard Family Ledger)</option>
              <option value="Compound">Compound Interest (Daily Compounded)</option>
            </select>
            <p className="text-[11px] text-[#888888]">Simple interest avoids interest-on-interest compounding</p>
          </div>

          {/* Outflow Label */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block">
              Outflow / Disbursed Direction Label
            </label>
            <input
              type="text"
              value={parameters.outflowLabel}
              onChange={(e) => handleGlobalChange('outflowLabel', e.target.value)}
              className="editable-cell w-full px-3 py-2 text-sm font-medium text-[#051C2C]"
            />
            <p className="text-[11px] text-[#888888]">Increases outstanding principal balance (+)</p>
          </div>

          {/* Inflow Label */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block">
              Inflow / Repayment Direction Label
            </label>
            <input
              type="text"
              value={parameters.inflowLabel}
              onChange={(e) => handleGlobalChange('inflowLabel', e.target.value)}
              className="editable-cell w-full px-3 py-2 text-sm font-medium text-[#051C2C]"
            />
            <p className="text-[11px] text-[#888888]">Decreases outstanding principal balance (-)</p>
          </div>
        </div>
      </div>

      {/* Tiered Interest Rate Schedule */}
      <div className="card-static p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8E8E6] pb-3">
          <div>
            <h3 className="font-heading font-bold text-xl text-[#051C2C] tracking-heading">
              2. Tiered Annual Market Interest Rate Schedule
            </h3>
            <p className="text-xs text-[#888888] mt-0.5">
              Dates match transactions using XLOOKUP(exact or next smaller date) logic.
            </p>
          </div>
        </div>

        {/* Add Tier Form */}
        <form onSubmit={handleAddTier} className="p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6] grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block mb-1">
              Effective Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={newEffectiveDate}
              onChange={(e) => setNewEffectiveDate(e.target.value)}
              className="editable-cell w-full px-3 py-1.5 text-xs font-mono text-[#051C2C]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block mb-1">
              Annual Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={newAnnualRate}
              onChange={(e) => setNewAnnualRate(e.target.value)}
              placeholder="e.g. 4.25"
              className="editable-cell w-full px-3 py-1.5 text-xs font-mono text-[#051C2C]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block mb-1">
              Note / Reference
            </label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="e.g. Rate revision"
              className="editable-cell w-full px-3 py-1.5 text-xs text-[#051C2C]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rate Tier</span>
          </button>
        </form>

        {/* Rate Tiers Table */}
        <div className="overflow-x-auto border border-[#E8E8E6] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#051C2C]/5 border-b border-[#051C2C]/10 text-[#051C2C] uppercase text-[11px] tracking-label font-semibold">
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4 text-right">Annual Rate (%)</th>
                <th className="py-3 px-4">Notes & Historical Context</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6] text-xs">
              {parameters.rateTiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-[#F5F5F2]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#051C2C]">
                    {tier.effectiveDate}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.01"
                        value={tier.annualRate}
                        onChange={(e) => handleUpdateTierRate(tier.id, e.target.value)}
                        className="editable-cell w-20 px-2 py-1 text-right font-mono font-bold text-xs text-[#2251FF]"
                      />
                      <span className="font-mono text-[#051C2C] font-semibold">%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#1A1A2E]">
                    {tier.note || 'Market baseline rate'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteTier(tier.id)}
                      title="Delete Rate Tier"
                      className="p-1.5 text-[#888888] hover:text-[#D32F2F] hover:bg-[#FFF0F0] rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight Explainer */}
      <div className="insight-block">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-[#2251FF] shrink-0 mt-0.5" />
          <div className="text-xs text-[#1A1A2E] leading-relaxed">
            <strong>XLOOKUP Tier Matching Logic:</strong> When calculating interest for a transaction occurring on date <em>T</em>, the engine locates the latest rate tier whose Effective Date is <code>&le; T</code>. Interest for each interval is dynamically allocated using that period's rate.
          </div>
        </div>
      </div>
    </div>
  );
};
