import React, { useState } from 'react';
import { SystemParameters, TransactionRecord } from '../types';
import { Receipt, Plus, Trash2, FileSpreadsheet, ArrowUpDown, Filter, Search, Info } from 'lucide-react';
import { calculateNetMovement, formatCurrency } from '../utils/calculator';

interface TransactionsViewProps {
  transactions: TransactionRecord[];
  parameters: SystemParameters;
  onUpdateTransactions: (txs: TransactionRecord[]) => void;
  onOpenCSVModal: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  parameters,
  onUpdateTransactions,
  onOpenCSVModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [directionFilter, setDirectionFilter] = useState<string>('ALL');
  
  // New transaction form state
  const [newDate, setNewDate] = useState('');
  const [newDirection, setNewDirection] = useState(parameters.outflowLabel);
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Calculate max absolute net movement for data bar scaling
  const maxAbsMovement = Math.max(
    1,
    ...transactions.map(tx => Math.abs(tx.amount))
  );

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newAmount) return;

    const amtNum = parseFloat(newAmount);
    if (isNaN(amtNum) || amtNum <= 0) return;

    const newTx: TransactionRecord = {
      id: `TXN-${Date.now().toString(36).toUpperCase()}`,
      date: newDate,
      direction: newDirection,
      amount: amtNum,
      description: newDescription.trim() || 'Manual transaction entry'
    };

    const updated = [...transactions, newTx].sort((a, b) => a.date.localeCompare(b.date));
    onUpdateTransactions(updated);

    // Reset form
    setNewDate('');
    setNewAmount('');
    setNewDescription('');
  };

  const handleUpdateTx = (id: string, field: keyof TransactionRecord, val: any) => {
    const updated = transactions.map(tx => {
      if (tx.id === id) {
        if (field === 'amount') {
          const parsed = parseFloat(val);
          return { ...tx, amount: isNaN(parsed) ? 0 : parsed };
        }
        return { ...tx, [field]: val };
      }
      return tx;
    });
    onUpdateTransactions(updated);
  };

  const handleDeleteTx = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction record?')) {
      const updated = transactions.filter(tx => tx.id !== id);
      onUpdateTransactions(updated);
    }
  };

  // Filtered transactions
  const filteredTxs = transactions.filter(tx => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.date.includes(searchTerm) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (directionFilter === 'ALL') return matchesSearch;
    return matchesSearch && tx.direction === directionFilter;
  });

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Banner */}
      <div className="card-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#051C2C] text-white rounded-lg">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#888888] font-mono">Sheet Code: 02_Transactions</div>
            <h2 className="font-heading font-bold text-2xl text-[#051C2C] tracking-heading">
              Historical Fund Ledger
            </h2>
            <p className="text-xs text-[#888888] mt-0.5">
              Record all historical transactions ({transactions.length} records). Yellow inputs are user-editable.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCSVModal}
            className="px-4 py-2 bg-[#2251FF] hover:bg-[#051C2C] text-white text-xs font-semibold rounded-md transition-colors flex items-center space-x-2 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bulk CSV Import</span>
          </button>
        </div>
      </div>

      {/* Add New Transaction Form */}
      <div className="card-static p-6 space-y-4">
        <h3 className="font-heading font-bold text-lg text-[#051C2C] tracking-heading border-b border-[#E8E8E6] pb-2">
          Add New Ledger Transaction
        </h3>

        <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-[#F5F5F2] p-4 rounded-lg border border-[#E8E8E6]">
          <div>
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block mb-1">
              Transaction Date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="editable-cell w-full px-3 py-1.5 text-xs font-mono text-[#051C2C]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block mb-1">
              Direction
            </label>
            <select
              value={newDirection}
              onChange={(e) => setNewDirection(e.target.value)}
              className="editable-cell w-full px-3 py-1.5 text-xs font-semibold text-[#051C2C]"
            >
              <option value={parameters.outflowLabel}>{parameters.outflowLabel} (+ Disbursed)</option>
              <option value={parameters.inflowLabel}>{parameters.inflowLabel} (- Repayment)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block mb-1">
              Amount ({parameters.currencySymbol})
            </label>
            <input
              type="number"
              step="0.01"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="editable-cell w-full px-3 py-1.5 text-xs font-mono font-bold text-[#051C2C]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#051C2C] uppercase tracking-label block mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="e.g. Down payment advance"
              className="editable-cell w-full px-3 py-1.5 text-xs text-[#051C2C]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </form>
      </div>

      {/* Ledger Table Section */}
      <div className="card-static p-6 space-y-4">
        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E8E8E6]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by description, ID or date..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F5F2] border border-[#E8E8E6] rounded-md focus:outline-none focus:border-[#2251FF]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-[#888888]" />
            <span className="text-xs text-[#888888]">Filter Direction:</span>
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="text-xs bg-[#F5F5F2] border border-[#E8E8E6] rounded px-2.5 py-1 text-[#051C2C] font-medium"
            >
              <option value="ALL">All Directions</option>
              <option value={parameters.outflowLabel}>{parameters.outflowLabel}</option>
              <option value={parameters.inflowLabel}>{parameters.inflowLabel}</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto border border-[#E8E8E6] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#051C2C]/5 border-b border-[#051C2C]/10 text-[#051C2C] uppercase text-[11px] tracking-label font-semibold">
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4 text-right">Raw Amount</th>
                <th className="py-3 px-4 text-right">Net Movement (Auto)</th>
                <th className="py-3 px-4">Inline Data Bar</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6] text-xs">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#888888]">
                    No transaction records found matching your search.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx) => {
                  const netMvmt = calculateNetMovement(
                    tx.direction,
                    tx.amount,
                    parameters.outflowLabel,
                    parameters.inflowLabel
                  );
                  const absRatio = Math.min(100, (Math.abs(netMvmt) / maxAbsMovement) * 100);

                  return (
                    <tr key={tx.id} className="hover:bg-[#F5F5F2]/60 transition-colors">
                      {/* ID */}
                      <td className="py-2.5 px-4 font-mono text-[11px] font-bold text-[#051C2C]">
                        {tx.id}
                      </td>

                      {/* Date */}
                      <td className="py-2.5 px-4">
                        <input
                          type="date"
                          value={tx.date}
                          onChange={(e) => handleUpdateTx(tx.id, 'date', e.target.value)}
                          className="editable-cell px-2 py-1 text-xs font-mono text-[#051C2C]"
                        />
                      </td>

                      {/* Direction */}
                      <td className="py-2.5 px-4">
                        <select
                          value={tx.direction}
                          onChange={(e) => handleUpdateTx(tx.id, 'direction', e.target.value)}
                          className="editable-cell px-2 py-1 text-xs font-medium text-[#051C2C]"
                        >
                          <option value={parameters.outflowLabel}>{parameters.outflowLabel}</option>
                          <option value={parameters.inflowLabel}>{parameters.inflowLabel}</option>
                        </select>
                      </td>

                      {/* Raw Amount */}
                      <td className="py-2.5 px-4 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={tx.amount}
                          onChange={(e) => handleUpdateTx(tx.id, 'amount', e.target.value)}
                          className="editable-cell w-28 px-2 py-1 text-right font-mono font-bold text-xs text-[#051C2C]"
                        />
                      </td>

                      {/* Calculated Net Movement */}
                      <td className={`py-2.5 px-4 text-right font-mono font-bold ${
                        netMvmt < 0 ? 'text-[#888888]' : 'text-[#051C2C]'
                      }`}>
                        {formatCurrency(netMvmt, parameters.currencySymbol)}
                      </td>

                      {/* Inline Data Bar */}
                      <td className="py-2.5 px-4 min-w-[120px]">
                        <div className="data-bar-track">
                          <div
                            className="data-bar-fill"
                            style={{
                              width: `${absRatio}%`,
                              backgroundColor: netMvmt < 0 ? '#888888' : '#2251FF'
                            }}
                          />
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={tx.description}
                          onChange={(e) => handleUpdateTx(tx.id, 'description', e.target.value)}
                          className="editable-cell w-full px-2 py-1 text-xs text-[#1A1A2E]"
                        />
                      </td>

                      {/* Delete */}
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteTx(tx.id)}
                          title="Delete transaction"
                          className="p-1.5 text-[#888888] hover:text-[#D32F2F] hover:bg-[#FFF0F0] rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainer */}
      <div className="insight-block">
        <div className="flex items-center space-x-2 text-xs text-[#1A1A2E]">
          <Info className="w-4 h-4 text-[#2251FF] shrink-0" />
          <span>
            <strong>Formula equivalent:</strong> Net Movement = <code>MAP(dirs, amts, LAMBDA(d, a, IF(d=Outflow, a, IF(d=Inflow, -a, 0))))</code>. All edits automatically trigger a re-sort and full recalculation in 03_CalcEngine.
          </span>
        </div>
      </div>
    </div>
  );
};
