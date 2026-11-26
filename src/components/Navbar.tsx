import React, { useState, useRef, useEffect } from 'react';
import { Menu, Shield, ChevronDown, Check, LogOut, User as UserIcon, Settings, Palette } from 'lucide-react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileModal } from './ProfileModal';
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
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load avatar if uploaded
  const avatar = user ? localStorage.getItem(`sahaya_avatar_${user.id}`) : null;

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
    { role: 'PartnerOfficer', title: 'Partner Organisation Officer', desc: 'Agency credentials, joint relief & requisitions', dashboard: '/partner/dashboard' },
    { role: 'Citizen', title: 'Affected Citizen', desc: 'Emergency SOS & assistance tracking', dashboard: '/citizen/dashboard' },
  ];

  // Only Administrator has authority to live-simulate other roles
  const canSimulateRoles = userRole === 'Admin';

  return (
    <>
      <header className="h-20 px-4 sm:px-8 flex items-center justify-between z-20">
        {/* Left: Mobile menu toggle + Live System Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-white/70 lg:hidden shadow-xs backdrop-blur-md cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {language === 'si' ? 'ජාතික මෙහෙයුම් විධානය සක්‍රීයයි' : 'National Operational Command Active'}
            </span>
          </div>
        </div>

        {/* Right side: Global Language Switcher + Notification Bell + User Profile Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto relative" ref={dropdownRef}>
          {/* Universal Bilingual Language Switcher */}
          <LanguageSwitcher variant="compact" />

          {/* Interactive Crisis Notification Dropdown */}
          <NotificationDropdown />

          {/* User Profile Pill Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 py-1 px-1.5 sm:pr-3 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-md transition cursor-pointer group"
          >
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-white shadow-xs" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userName.charAt(0)}
              </div>
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition flex items-center gap-1">
                {userName}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-600'}`} />
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5 mt-0.5">
                <Shield className="w-2.5 h-2.5 inline text-blue-500" /> {userRole}
              </span>
            </div>
          </button>

          {/* User Account / Role Simulation Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-14 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 shadow-2xl p-2.5 z-50 animate-fade-in divide-y divide-slate-100 dark:divide-white/5">
              {/* Header: Authenticated Identity */}
              <div className="px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'authenticated.session@sahaya.org'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Appearance & Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit Profile & Theme Action Link */}
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="mt-2.5 w-full py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-white/10 text-[11px] font-bold text-blue-700 dark:text-blue-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Theme & Appearance Settings</span>
                </button>
              </div>

              {/* Admin-Only: Simulator Switcher with Clean Hover Animation */}
              {canSimulateRoles ? (
                <div className="py-2">
                  <div className="px-3 pb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Role Simulation
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                      Admin Preview
                    </span>
                  </div>

                  <div className="space-y-1 max-h-[260px] overflow-y-auto pr-0.5 scrollbar-thin">
                    {roleConfigs.map((cfg) => {
                      const isCurrent = userRole === cfg.role;
                      return (
                        <button
                          key={cfg.role}
                          onClick={() => handleRoleSwitch(cfg.role, cfg.dashboard, cfg.title)}
                          className={`w-full group text-left px-3 py-2 rounded-xl transition-all duration-200 flex items-start justify-between cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50/90 dark:bg-blue-950/40 border border-blue-500/30 shadow-xs'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 hover:translate-x-0.5 border border-transparent'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className={`text-xs font-semibold ${isCurrent ? 'text-blue-900 dark:text-blue-200 font-bold' : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600'}`}>
                              {cfg.title}
                            </span>
                            <span className="text-[10.5px] text-slate-400 group-hover:text-slate-500 leading-tight">
                              {cfg.desc}
                            </span>
                          </div>
                          {isCurrent && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
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
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Access Tier:</span> {userRole}
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
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Global Profile & Appearance Settings Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};
