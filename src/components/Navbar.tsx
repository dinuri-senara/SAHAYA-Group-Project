import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Shield, ChevronDown, Check, LogOut, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (newRole: UserRole, targetDashboard: string, roleTitle: string) => {
    if (user) {
      const updated = { ...user, role: newRole, fullName: roleTitle };
      localStorage.setItem('sahaya_user', JSON.stringify(updated));
    }
    setDropdownOpen(false);
    navigate(targetDashboard);
    window.location.reload();
  };

  const roleConfigs: { role: UserRole; title: string; desc: string; dashboard: string }[] = [
    { role: 'Admin', title: 'System Administrator', desc: 'National command & audit governance', dashboard: '/dashboard' },
    { role: 'Coordinator', title: 'Emergency Coordinator', desc: 'Crisis triage & operational overview', dashboard: '/coordinator/dashboard' },
    { role: 'CaseManager', title: 'Incident / Case Manager', desc: 'Incident registry & case resolution', dashboard: '/coordinator/incidents' },
    { role: 'LogisticsManager', title: 'Resource & Logistics Manager', desc: 'Inventory depot, aid dispatches & shortages', dashboard: '/resources' },
    { role: 'ShelterAdmin', title: 'Shelter Administrator', desc: 'Evacuation camps, capacity & occupancy', dashboard: '/shelters' },
    { role: 'VolunteerCoordinator', title: 'Volunteer Coordinator', desc: 'Roster mobilization & mission tasks', dashboard: '/volunteers' },
    { role: 'Donor', title: 'Donor / Funding Officer', desc: 'Aid pledges, in-kind contributions & reports', dashboard: '/donor/dashboard' },
    { role: 'PartnerOfficer', title: 'Partner Organisation Officer', desc: 'Inter-agency requisitions & joint logistics', dashboard: '/resources' },
    { role: 'Citizen', title: 'Affected Citizen', desc: 'Emergency SOS & assistance tracking', dashboard: '/citizen/dashboard' },
  ];

  // Only Administrator has authority to live-simulate other roles
  const canSimulateRoles = userRole === 'Admin';

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

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-slate-200/80 shadow-xs backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">
            National Operational Command Active
          </span>
        </div>
      </div>

      {/* Right side: Floating Notification Bell + User Profile Badge */}
      <div className="flex items-center gap-3 ml-auto relative" ref={dropdownRef}>
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

        {/* User Profile Button */}
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="group flex items-center gap-2.5 pl-1.5 pr-3.5 py-1 rounded-full bg-white/85 hover:bg-white border border-slate-200/80 shadow-xs backdrop-blur-md transition-all duration-200 hover:shadow-md cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform">
            {userName.charAt(0)}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
              {userName}
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-600'}`} />
            </span>
            <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <Shield className="w-2.5 h-2.5 inline text-teal-500" /> {userRole}
            </span>
          </div>
        </button>

        {/* User Account / Role Simulation Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-14 w-80 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 z-50 animate-fade-in divide-y divide-slate-100">
            {/* Header: Authenticated Identity */}
            <div className="px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'authenticated.session@sahaya.org'}</p>
                </div>
              </div>
            </div>

            {/* Admin-Only: Simulator Switcher with Clean Hover Animation */}
            {canSimulateRoles ? (
              <div className="py-2">
                <div className="px-3 pb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Role Simulation
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
                    Admin Preview
                  </span>
                </div>

                <div className="space-y-1 max-h-[320px] overflow-y-auto pr-0.5">
                  {roleConfigs.map((cfg) => {
                    const isCurrent = userRole === cfg.role;
                    return (
                      <button
                        key={cfg.role}
                        onClick={() => handleRoleSwitch(cfg.role, cfg.dashboard, cfg.title)}
                        className={`w-full group text-left px-3 py-2 rounded-xl transition-all duration-200 flex items-start justify-between cursor-pointer ${
                          isCurrent
                            ? 'bg-teal-50/90 border border-teal-500/30 shadow-xs'
                            : 'hover:bg-slate-50 hover:translate-x-0.5 border border-transparent'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-xs font-semibold ${isCurrent ? 'text-teal-900 font-bold' : 'text-slate-800 group-hover:text-blue-600'}`}>
                            {cfg.title}
                          </span>
                          <span className="text-[10.5px] text-slate-400 group-hover:text-slate-500 leading-tight">
                            {cfg.desc}
                          </span>
                        </div>
                        {isCurrent && (
                          <div className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-2 px-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Access Tier:</span> {userRole}
              </div>
            )}

            {/* Logout Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Session</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
