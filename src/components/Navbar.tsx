import React from 'react';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  RotateCcw,
  CheckCircle2,
  Database,
  PanelLeft
} from 'lucide-react';

interface NavbarProps {
  lastSaved: string;
  onExportBackup: () => void;
  onOpenImportModal: () => void;
  onOpenCSVModal: () => void;
  onOpenResetModal: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lastSaved,
  onExportBackup,
  onOpenImportModal,
  onOpenCSVModal,
  onOpenResetModal,
  isSidebarCollapsed,
  onToggleSidebar
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E8E8E6] shadow-[0_2px_8px_rgba(5,28,44,0.04)]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand & Main Toolkit Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="p-1.5 rounded-md text-[#051C2C] hover:bg-[#F5F5F2] border border-[#E8E8E6] transition-colors shrink-0"
          >
            <PanelLeft className="w-4 h-4 text-[#2251FF]" />
          </button>

          <div className="w-8 h-8 rounded-md bg-[#051C2C] border border-[#051C2C] flex items-center justify-center text-white font-heading font-bold text-base shadow-2xs shrink-0">
            F
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center space-x-2 truncate">
              <h1 className="font-heading font-bold text-sm sm:text-base md:text-lg text-[#051C2C] leading-snug tracking-tight truncate">
                Family Long-Term Fund Flow & Interest Reconciliation Excel Toolkit
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#2251FF]/10 text-[#2251FF] border border-[#2251FF]/20 rounded shrink-0">
                v1.0 Pro
              </span>
            </div>
            <p className="text-[11px] text-[#888888] font-sans truncate hidden sm:block">
              Dynamic Multi-Period Compound Interest Reconciliation & Historical Ledger Audit System
            </p>
          </div>
        </div>

        {/* FUNCTIONAL ZONE: Data Management & System Operations */}
        <div className="flex items-center space-x-2 sm:space-x-3 bg-[#F8F8F6] p-1.5 rounded-lg border border-[#E8E8E6] shrink-0">
          <div className="hidden lg:flex items-center space-x-1.5 px-2 text-[11px] text-[#051C2C]">
            <Database className="w-3.5 h-3.5 text-[#2251FF]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#888888]">
              Data Tools
            </span>
          </div>

          <div className="hidden lg:block h-4 w-[1px] bg-[#E8E8E6]" />

          {/* Auto Save Status */}
          <div className="flex items-center space-x-1.5 px-2 py-1 bg-white rounded border border-[#E8E8E6] text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853] shrink-0" />
            <span className="text-[#888888] font-medium hidden sm:inline">Saved:</span>
            <span className="font-mono font-semibold text-[11px] text-[#051C2C]">{lastSaved}</span>
          </div>

          <div className="h-4 w-[1px] bg-[#E8E8E6]" />

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onExportBackup}
              title="Export current state to JSON backup file"
              className="px-2.5 py-1 text-xs text-[#051C2C] bg-white hover:bg-[#2251FF]/5 hover:text-[#2251FF] hover:border-[#2251FF]/30 rounded transition-all font-medium border border-[#E8E8E6] flex items-center space-x-1 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#2251FF]" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={onOpenImportModal}
              title="Import backup JSON file"
              className="px-2.5 py-1 text-xs text-[#051C2C] bg-white hover:bg-[#2251FF]/5 hover:text-[#2251FF] hover:border-[#2251FF]/30 rounded transition-all font-medium border border-[#E8E8E6] flex items-center space-x-1 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#2251FF]" />
              <span className="hidden sm:inline">Import</span>
            </button>

            <button
              onClick={onOpenCSVModal}
              title="Batch import transactions from CSV file"
              className="px-2.5 py-1 text-xs text-[#051C2C] bg-white hover:bg-[#2251FF]/5 hover:text-[#2251FF] hover:border-[#2251FF]/30 rounded transition-all font-medium border border-[#E8E8E6] flex items-center space-x-1 shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#2251FF]" />
              <span>Bulk CSV</span>
            </button>

            <button
              onClick={onOpenResetModal}
              title="Reset system to default seed data"
              className="px-2 py-1 text-xs text-[#888888] hover:text-[#D32F2F] hover:bg-[#FFF0F0] rounded transition-colors font-medium flex items-center space-x-1 ml-0.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
