import React, { useState, useMemo } from 'react';
import { SystemParameters, TransactionRecord, ActiveTab, BackupData } from './types';
import { loadState, saveState, resetState, exportBackupJSON } from './utils/storage';
import { runCalcEngine, calculateSummaryMetrics, getTodayDateString } from './utils/calculator';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { InstructionsView } from './components/InstructionsView';
import { ParametersView } from './components/ParametersView';
import { TransactionsView } from './components/TransactionsView';
import { CalcEngineView } from './components/CalcEngineView';
import { SummaryView } from './components/SummaryView';
import { Footer } from './components/Footer';
import { ImportModal } from './components/ImportModal';
import { CSVModal } from './components/CSVModal';
import { ResetModal } from './components/ResetModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [parameters, setParameters] = useState<SystemParameters>(() => loadState().parameters);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => loadState().transactions);
  const [lastSaved, setLastSaved] = useState<string>(() => loadState().lastSaved);

  // Modal Dialog States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Auto-save & calculate engine rows
  const todayStr = useMemo(() => getTodayDateString(), []);

  const calcRows = useMemo(() => {
    return runCalcEngine(transactions, parameters, todayStr);
  }, [transactions, parameters, todayStr]);

  const summary = useMemo(() => {
    return calculateSummaryMetrics(transactions, calcRows, parameters, todayStr);
  }, [transactions, calcRows, parameters, todayStr]);

  // Handle Updates & Auto-save to localStorage
  const handleUpdateParameters = (newParams: SystemParameters) => {
    setParameters(newParams);
    const newTime = saveState(newParams, transactions);
    setLastSaved(newTime);
  };

  const handleUpdateTransactions = (newTxs: TransactionRecord[]) => {
    setTransactions(newTxs);
    const newTime = saveState(parameters, newTxs);
    setLastSaved(newTime);
  };

  const handleExportBackup = () => {
    exportBackupJSON(parameters, transactions);
  };

  const handleImportBackup = (backup: BackupData) => {
    setParameters(backup.parameters);
    setTransactions(backup.transactions);
    const newTime = saveState(backup.parameters, backup.transactions);
    setLastSaved(newTime);
  };

  const handleConfirmCSVImport = (newRecords: TransactionRecord[]) => {
    const combined = [...transactions, ...newRecords].sort((a, b) => a.date.localeCompare(b.date));
    handleUpdateTransactions(combined);
  };

  const handleConfirmReset = () => {
    const reset = resetState();
    setParameters(reset.parameters);
    setTransactions(reset.transactions);
    setLastSaved(reset.lastSaved);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex flex-col justify-between selection:bg-[#2251FF] selection:text-white">
      <div>
        {/* Tier 1: Top Horizontal Navbar */}
        <Navbar
          lastSaved={lastSaved}
          onExportBackup={handleExportBackup}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onOpenCSVModal={() => setIsCSVModalOpen(true)}
          onOpenResetModal={() => setIsResetModalOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Workspace Body: Left Sidebar + Main View Container */}
        <div className="flex w-full min-h-[calc(100vh-57px)]">
          {/* Tier 2: Left Navigation Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-5 sm:p-8 max-w-[1400px] mx-auto min-w-0">
            {activeTab === 'instructions' && (
              <InstructionsView />
            )}

            {activeTab === 'parameters' && (
              <ParametersView
                parameters={parameters}
                onUpdateParameters={handleUpdateParameters}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsView
                transactions={transactions}
                parameters={parameters}
                onUpdateTransactions={handleUpdateTransactions}
                onOpenCSVModal={() => setIsCSVModalOpen(true)}
              />
            )}

            {activeTab === 'calc_engine' && (
              <CalcEngineView
                calcRows={calcRows}
                parameters={parameters}
                asOfDateStr={todayStr}
              />
            )}

            {activeTab === 'summary' && (
              <SummaryView
                summary={summary}
                calcRows={calcRows}
                parameters={parameters}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Bottom Footer */}
      <Footer />

      {/* Modals */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportBackup}
      />

      <CSVModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        outflowLabel={parameters.outflowLabel}
        inflowLabel={parameters.inflowLabel}
        onConfirmImport={handleConfirmCSVImport}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
}
