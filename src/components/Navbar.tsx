import React from 'react';
import { Menu, Shield } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
  userRole?: string;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  userRole = 'Lead Architect (Member 1)',
  userName = 'Admin Operator',
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
            System Live: Operational Command Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/20">
            M1
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">{userName}</span>
            <span className="text-[10px] text-teal-600 font-medium flex items-center gap-1">
              <Shield className="w-3 h-3 inline" /> {userRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
