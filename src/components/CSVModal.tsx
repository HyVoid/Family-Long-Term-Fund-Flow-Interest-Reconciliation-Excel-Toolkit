import React, { useState } from 'react';
import { FileSpreadsheet, X, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { parseBulkCSV } from '../utils/storage';
import { TransactionRecord } from '../types';

interface CSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  outflowLabel: string;
  inflowLabel: string;
  onConfirmImport: (newRecords: TransactionRecord[]) => void;
}

export const CSVModal: React.FC<CSVModalProps> = ({
  isOpen,
  onClose,
  outflowLabel,
  inflowLabel,
  onConfirmImport
}) => {
  const [csvText, setCsvText] = useState('');
  const [parsedRecords, setParsedRecords] = useState<TransactionRecord[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const sampleCSV = `Date,Direction,Amount,Description\n2023-03-15,${outflowLabel},25000,Spring property development advance\n2023-11-20,${inflowLabel},10000,Autumn dividend partial repayment\n2024-05-10,${outflowLabel},15000,Education expense support`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'family_ledger_sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      processCSVText(text);
    };
    reader.readAsText(file);
  };

  const processCSVText = (text: string) => {
    setCsvText(text);
    const result = parseBulkCSV(text, outflowLabel, inflowLabel);
    setParsedRecords(result.records);
    setErrors(result.errors);
  };

  const handleApply = () => {
    if (parsedRecords.length === 0) return;
    onConfirmImport(parsedRecords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#051C2C]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(5,28,44,0.2)] max-w-2xl w-full p-6 space-y-6 border border-[#E8E8E6] animate-fade-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E8E8E6] pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#2251FF]" />
            <h3 className="font-heading font-bold text-xl text-[#051C2C]">
              Bulk CSV Ledger Import
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-[#051C2C] rounded-md hover:bg-[#F5F5F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between bg-[#F5F5F2] p-3 rounded-lg border border-[#E8E8E6]">
          <span className="text-xs text-[#051C2C] font-medium">
            Format: <code>Date, Direction, Amount, Description</code>
          </span>
          <button
            onClick={handleDownloadSample}
            className="px-3 py-1 bg-white border border-[#E8E8E6] hover:bg-[#051C2C] hover:text-white text-xs text-[#051C2C] font-semibold rounded flex items-center space-x-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        {/* File Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#051C2C] uppercase tracking-label">
            Upload CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-xs text-[#051C2C] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#051C2C] file:text-white hover:file:bg-[#2251FF] file:cursor-pointer border border-[#E8E8E6] rounded-md p-1"
          />
        </div>

        {/* Or Paste CSV */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#051C2C] uppercase tracking-label">
            Or Paste CSV Content
          </label>
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => processCSVText(e.target.value)}
            placeholder={`2023-01-10,${outflowLabel},50000,Project bridge loan...`}
            className="editable-cell w-full p-3 font-mono text-xs text-[#051C2C]"
          />
        </div>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="p-3 bg-[#D32F2F]/10 border border-[#D32F2F]/20 text-[#D32F2F] text-xs rounded-md space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>CSV Parsing Warnings ({errors.length})</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Parsed Preview */}
        {parsedRecords.length > 0 && (
          <div className="space-y-2 border-t border-[#E8E8E6] pt-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#00C853]">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Parsed {parsedRecords.length} Valid Ledger Records</span>
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto border border-[#E8E8E6] rounded-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#051C2C]/5 font-semibold text-[#051C2C] uppercase text-[10px]">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Direction</th>
                    <th className="p-2 text-right">Amount</th>
                    <th className="p-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E6]">
                  {parsedRecords.map((r, i) => (
                    <tr key={i} className="font-mono">
                      <td className="p-2">{r.date}</td>
                      <td className="p-2">{r.direction}</td>
                      <td className="p-2 text-right font-bold">{r.amount.toLocaleString()}</td>
                      <td className="p-2 truncate max-w-[200px]">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-3 border-t border-[#E8E8E6]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E8E8E6] text-xs font-semibold text-[#051C2C] hover:bg-[#F5F5F2] rounded-md"
          >
            Cancel
          </button>
          <button
            disabled={parsedRecords.length === 0}
            onClick={handleApply}
            className="px-4 py-2 bg-[#2251FF] hover:bg-[#051C2C] disabled:opacity-50 text-white text-xs font-semibold rounded-md transition-colors"
          >
            Append {parsedRecords.length} Records
          </button>
        </div>
      </div>
    </div>
  );
};
