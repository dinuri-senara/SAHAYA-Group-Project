import React from 'react';
import { Bell, Menu, Shield, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  onMenuClick?: () => void;
  userName?: string;
  userRole?: UserRole;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  userName = 'Operational Officer',
  userRole = 'Admin',
  unreadCount = 3,
}) => {
  return (
    <header className="h-20 px-4 sm:px-8 flex items-center justify-between z-20">
      {/* Left: Mobile menu toggle + Live System Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-white/70 lg:hidden shadow-xs backdrop-blur-md"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">
            National Operational Command Active
          </span>
        </div>
      </div>

      {/* Right side: Floating Notification Bell + User Role Pill */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification Bell */}
        <button
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-700 flex items-center justify-center shadow-xs border border-slate-200/80 backdrop-blur-md transition-all duration-200 hover:scale-105"
        >
          <Bell className="w-4.5 h-4.5 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white/85 hover:bg-white border border-slate-200/80 shadow-xs backdrop-blur-md transition cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white shadow-xs">
            {userName.charAt(0)}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
              {userName}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </span>
            <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-0.5">
              <Shield className="w-2.5 h-2.5 inline" /> {userRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
