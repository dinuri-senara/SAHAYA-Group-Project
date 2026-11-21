import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Home,
  Package,
  HeartHandshake,
  DollarSign,
  MapPin,
  Bot,
  FileBarChart,
  LogOut,
  Headphones,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { UserRole } from '../types';
import { SahayaLogo } from './SahayaLogo';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const navItems: NavItem[] = [
  { name: 'Admin Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin'] },
  { name: 'System Telemetry & Audit', href: '/admin/dashboard', icon: ShieldAlert, roles: ['Admin'] },
  { name: 'User Management', href: '/admin/users', icon: Users, roles: ['Admin'] },
  { name: 'Citizen Portal', href: '/citizen/dashboard', icon: LayoutDashboard, roles: ['Citizen', 'Admin'] },
  { name: 'Coordinator Hub', href: '/coordinator/dashboard', icon: LayoutDashboard, roles: ['Coordinator', 'Admin'] },
  { name: 'Incidents Registry', href: '/coordinator/incidents', icon: ShieldAlert, roles: ['Coordinator', 'Admin'] },
  { name: 'Safe Shelters', href: '/shelters', icon: Home, roles: ['Coordinator', 'Citizen', 'Volunteer', 'Admin'] },
  { name: 'Inventory Depot', href: '/resources', icon: Package, roles: ['Coordinator', 'Admin'] },
  { name: 'Volunteer Mobilization', href: '/volunteers', icon: HeartHandshake, roles: ['Coordinator', 'Volunteer', 'Admin'] },
  { name: 'Relief Campaigns', href: '/donations', icon: DollarSign, roles: ['Donor', 'Coordinator', 'Admin'] },
  { name: 'GIS Command Map', href: '/map', icon: MapPin, roles: ['Coordinator', 'Volunteer', 'Citizen', 'Admin'] },
  { name: 'AI Decision Review', href: '/coordinator/ai-review', icon: Bot, roles: ['Coordinator', 'Admin'] },
  { name: 'Analytics & Reports', href: '/reports', icon: FileBarChart, roles: ['Coordinator', 'Admin'] },
];

interface SidebarProps {
  role?: UserRole;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
  onOpenAiDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role = 'Admin',
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  onOpenAiDrawer,
}) => {
  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      if (confirm('Are you sure you want to sign out from SAHAYA Command OS?')) {
        window.location.href = '/login';
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0d1b32] border-r border-[#192b4a] text-slate-300 transition-all duration-300 ease-in-out shadow-2xl
          ${isCollapsed ? 'w-20' : 'w-68'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          backgroundImage: `radial-gradient(circle at 10% 90%, rgba(37, 99, 235, 0.08) 0%, transparent 60%)`
        }}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-[#172a48]">
          <div className="flex items-center gap-3 overflow-hidden">
            <SahayaLogo size="md" light={true} showText={false} />
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-black text-white text-lg tracking-tight leading-tight truncate flex items-center gap-1.5">
                  SAHAYA
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    අපි වෙනුවෙන් අපි
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide truncate">
                  Humanitarian Aid Coordination
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162744] border border-[#22385e] transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Dynamic Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-[#162744]'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* AI Assistant Help Floating Card (Only when expanded) */}
        {!isCollapsed && (
          <div className="p-3.5">
            <div className="relative rounded-2xl bg-gradient-to-br from-[#152745] to-[#0f1f38] border border-[#213a63] p-4 text-center shadow-lg overflow-hidden">
              <div className="w-9 h-9 mx-auto rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2">
                <Headphones className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-0.5">Need Help?</h4>
              <p className="text-[10px] text-slate-400 leading-tight mb-2.5">
                AI Triage Assistant is online.
              </p>
              <button
                onClick={onOpenAiDrawer}
                className="w-full py-1.5 px-3 rounded-lg bg-[#2563eb] hover:bg-blue-500 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <span>Chat Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Dedicated Sign Out & Footer Area */}
        <div className="p-3 border-t border-[#172a48] space-y-2">
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-all ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>

          {!isCollapsed && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
              <span>National SLA: 99.9%</span>
              <span>v1.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
