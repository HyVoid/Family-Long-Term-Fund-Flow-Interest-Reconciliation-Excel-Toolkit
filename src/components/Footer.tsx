import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#E8E8E6] mt-16 py-6">
      <div className="max-w-[1400px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#888888]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#00C853]" />
          <span>
            Privacy Notice: All data storage functions in this tool run locally in your browser (localStorage). No user data is stored on or transmitted to any external server.
          </span>
        </div>
        <div className="font-mono text-[11px] text-[#888888]">
          Family Long-Term Fund Flow & Interest Reconciliation Excel Toolkit &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
