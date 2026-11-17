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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { UserRole } from '../types';
import { SahayaLogo } from './SahayaLogo';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const navItems: NavItem[] = [
  { name: 'Admin Overview', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['Admin'] },
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  role = 'Admin',
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-68'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <SahayaLogo className="w-8 h-8 shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-white tracking-wide text-base leading-tight">SAHAYA</span>
                <span className="text-[10px] text-teal-400 font-medium uppercase tracking-wider">Command OS</span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {onLogout && (
          <div className="p-3 border-t border-slate-800">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
