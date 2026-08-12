import React from 'react';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#051C2C]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(5,28,44,0.2)] max-w-md w-full p-6 space-y-5 border border-[#E8E8E6] animate-fade-up">
        <div className="flex items-center justify-between border-b border-[#E8E8E6] pb-3">
          <div className="flex items-center space-x-2 text-[#D32F2F]">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-heading font-bold text-xl text-[#051C2C]">
              Reset Data to Default Seed
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-[#051C2C] rounded-md hover:bg-[#F5F5F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#1A1A2E] leading-relaxed">
          <p>
            This action will <strong>overwrite your current browser local storage</strong> and restore the default 10-year family transaction ledger and rate schedule seed dataset.
          </p>
          <p className="text-[#D32F2F] font-semibold bg-[#D32F2F]/10 p-3 rounded-md border border-[#D32F2F]/20">
            Warning: Any custom transactions or modified interest rate parameters you added will be erased unless you export a backup JSON first.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-[#E8E8E6]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E8E8E6] text-xs font-semibold text-[#051C2C] hover:bg-[#F5F5F2] rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-4 py-2 bg-[#D32F2F] hover:bg-[#b71c1c] text-white text-xs font-semibold rounded-md transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Confirm Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
