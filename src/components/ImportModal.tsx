import React, { useState } from 'react';
import { Upload, X, AlertTriangle, FileJson, CheckCircle2 } from 'lucide-react';
import { parseBackupJSON } from '../utils/storage';
import { BackupData } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (data: BackupData) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [jsonText, setJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [parsedPreview, setParsedPreview] = useState<BackupData | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonText(text);
        const data = parseBackupJSON(text);
        setParsedPreview(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse JSON backup file');
        setParsedPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (text: string) => {
    setJsonText(text);
    setErrorMsg('');
    if (!text.trim()) {
      setParsedPreview(null);
      return;
    }
    try {
      const data = parseBackupJSON(text);
      setParsedPreview(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON format');
      setParsedPreview(null);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedPreview) return;
    onImportSuccess(parsedPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#051C2C]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(5,28,44,0.2)] max-w-lg w-full p-6 space-y-6 border border-[#E8E8E6] animate-fade-up">
        <div className="flex items-center justify-between border-b border-[#E8E8E6] pb-3">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-[#2251FF]" />
            <h3 className="font-heading font-bold text-xl text-[#051C2C]">
              Import Backup Snapshot
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-[#051C2C] rounded-md hover:bg-[#F5F5F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload File Box */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-[#051C2C] uppercase tracking-label">
            Select Backup JSON File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-xs text-[#051C2C] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#051C2C] file:text-white hover:file:bg-[#2251FF] file:cursor-pointer cursor-pointer border border-[#E8E8E6] rounded-md p-1"
          />
        </div>

        <div className="text-center text-xs text-[#888888] font-mono">
          - OR PASTE JSON CONTENT BELOW -
        </div>

        {/* JSON Textarea */}
        <textarea
          rows={5}
          value={jsonText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Paste backup JSON data structure here..."
          className="editable-cell w-full p-3 font-mono text-xs text-[#051C2C]"
        />

        {errorMsg && (
          <div className="p-3 bg-[#D32F2F]/10 border border-[#D32F2F]/20 text-[#D32F2F] text-xs rounded-md flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {parsedPreview && (
          <div className="p-3 bg-[#00C853]/10 border border-[#00C853]/20 text-[#00C853] text-xs rounded-md space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Valid Backup Snapshot Verified</span>
            </div>
            <div className="text-[11px] text-[#051C2C]">
              Transactions: {parsedPreview.transactions.length} records | Currency: {parsedPreview.parameters.currencySymbol}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-3 border-t border-[#E8E8E6]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E8E8E6] text-xs font-semibold text-[#051C2C] hover:bg-[#F5F5F2] rounded-md"
          >
            Cancel
          </button>
          <button
            disabled={!parsedPreview}
            onClick={handleConfirmImport}
            className="px-4 py-2 bg-[#051C2C] hover:bg-[#2251FF] disabled:opacity-50 text-white text-xs font-semibold rounded-md transition-colors"
          >
            Restore Backup Data
          </button>
        </div>
      </div>
    </div>
  );
};
