import React from 'react';
import { ActiveTab } from '../types';
import { 
  BookOpen, 
  Settings, 
  Receipt, 
  Calculator, 
  BarChart3, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  onToggleCollapse
}) => {
  const tabs: { 
    id: ActiveTab; 
    label: string; 
    sheetCode: string; 
    codeNum: string;
    icon: React.ReactNode; 
    desc: string 
  }[] = [
    { id: 'instructions', label: 'Instructions & SOP', sheetCode: '00_Instructions', codeNum: '00', icon: <BookOpen className="w-4 h-4" />, desc: 'System Description & SOP' },
    { id: 'parameters', label: 'Parameters & Rates', sheetCode: '01_Parameters', codeNum: '01', icon: <Settings className="w-4 h-4" />, desc: 'Global Config & Rate Tiers' },
    { id: 'transactions', label: 'Transaction Ledger', sheetCode: '02_Transactions', codeNum: '02', icon: <Receipt className="w-4 h-4" />, desc: 'Historical Fund Movement' },
    { id: 'calc_engine', label: 'Calculation Engine', sheetCode: '03_CalcEngine', codeNum: '03', icon: <Calculator className="w-4 h-4" />, desc: 'Pure JS Dynamic Engine' },
    { id: 'summary', label: 'Summary Dashboard', sheetCode: '04_Summary', codeNum: '04', icon: <BarChart3 className="w-4 h-4" />, desc: 'Executive KPI Overview' }
  ];

  return (
    <aside 
      className={`bg-white border-r border-[#E8E8E6] transition-all duration-300 flex flex-col shrink-0 sticky top-[57px] h-[calc(100vh-57px)] z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header & Collapse Toggle */}
      <div className="p-3.5 border-b border-[#E8E8E6] flex items-center justify-between bg-[#F8F8F6]">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 text-[#051C2C]">
            <Layers className="w-4 h-4 text-[#2251FF]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Workbook Sheets
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`p-1.5 rounded-md text-[#888888] hover:text-[#051C2C] hover:bg-white border border-transparent hover:border-[#E8E8E6] transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Sheet List Navigation */}
      <nav className="p-2 space-y-1.5 flex-1 overflow-y-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={isCollapsed ? `${tab.codeNum} - ${tab.label}` : undefined}
              className={`w-full text-left rounded-lg transition-all flex items-center relative group ${
                isCollapsed ? 'justify-center p-3' : 'p-2.5 space-x-3'
              } ${
                isActive
                  ? 'bg-[#2251FF]/5 text-[#051C2C] font-semibold border border-[#2251FF]/30 shadow-2xs'
                  : 'text-[#051C2C]/70 hover:text-[#051C2C] hover:bg-[#F8F8F6] border border-transparent'
              }`}
            >
              {/* Active Indicator Strip */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#2251FF] rounded-r-full" />
              )}

              {/* Icon */}
              <div className={`shrink-0 ${isActive ? 'text-[#2251FF]' : 'text-[#888888] group-hover:text-[#051C2C]'}`}>
                {tab.icon}
              </div>

              {/* Expanded Details */}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium truncate leading-tight">
                      {tab.label}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ml-1.5 ${
                      isActive 
                        ? 'bg-[#2251FF] text-white font-bold' 
                        : 'bg-[#E8E8E6] text-[#051C2C]/70'
                    }`}>
                      {tab.codeNum}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#888888] truncate mt-0.5">
                    {tab.desc}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Info Widget */}
      {!isCollapsed && (
        <div className="p-3 m-2.5 rounded-lg bg-[#F8F8F6] border border-[#E8E8E6] text-[11px] space-y-1.5">
          <div className="flex items-center space-x-1.5 text-[#051C2C] font-semibold">
            <Info className="w-3.5 h-3.5 text-[#2251FF]" />
            <span>Active Sheet</span>
          </div>
          <div className="text-[10px] font-mono text-[#888888]">
            Code: <span className="text-[#051C2C] font-bold">{tabs.find(t => t.id === activeTab)?.sheetCode}</span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-[#00C853] font-medium pt-1 border-t border-[#E8E8E6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
            <span>Calc Engine Sync Active</span>
          </div>
        </div>
      )}
    </aside>
  );
};
