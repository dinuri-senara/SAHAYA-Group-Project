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
  Truck,
} from 'lucide-react';
import { UserRole } from '../types';
import { SahayaLogo } from './SahayaLogo';
import { useLanguage } from '../context/LanguageContext';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const navItems: NavItem[] = [
  // 1. Affected Person / Citizen
  { name: 'My Assistance Portal', href: '/citizen/dashboard', icon: LayoutDashboard, roles: ['Citizen'] },
  { name: 'Household Profile', href: '/citizen/household-profile', icon: Users, roles: ['Citizen'] },
  { name: 'Submit Aid Request (SOS)', href: '/citizen/create-request', icon: ShieldAlert, roles: ['Citizen'] },
  { name: 'Nearby Safe Shelters', href: '/shelters', icon: Home, roles: ['Citizen'] },
  { name: 'Crisis Safety Guides', href: '/citizen/safety-guide', icon: FileBarChart, roles: ['Citizen'] },

  // 2. Emergency Coordinator
  { name: 'Coordinator Command Hub', href: '/coordinator/dashboard', icon: LayoutDashboard, roles: ['Coordinator'] },
  { name: 'Explainable AI Triage', href: '/coordinator/ai-review', icon: Bot, roles: ['Coordinator'] },
  { name: 'Crisis Incidents Registry', href: '/coordinator/incidents', icon: ShieldAlert, roles: ['Coordinator'] },
  { name: 'Resource Allocation Depot', href: '/resources', icon: Package, roles: ['Coordinator'] },

  // 3. Incident / Case Manager
  { name: 'Active Incidents Registry', href: '/coordinator/incidents', icon: ShieldAlert, roles: ['CaseManager'] },
  { name: 'Case Review & AI Triage', href: '/coordinator/ai-review', icon: Bot, roles: ['CaseManager'] },
  { name: 'Supply Depot Allocation', href: '/resources', icon: Package, roles: ['CaseManager'] },
  { name: 'GIS Crisis Map', href: '/map', icon: MapPin, roles: ['CaseManager'] },

  // 4. Resource and Logistics Manager
  { name: 'Inventory Depot & Supplies', href: '/resources', icon: Package, roles: ['LogisticsManager'] },
  { name: 'Inter-Agency Requisitions', href: '/partner/dashboard', icon: Truck, roles: ['LogisticsManager'] },

  // 5. Shelter Administrator
  { name: 'Safe Shelters & Camp Roster', href: '/shelters', icon: Home, roles: ['ShelterAdmin'] },
  { name: 'Shelter Locations Map', href: '/map', icon: MapPin, roles: ['ShelterAdmin'] },

  // 6. Volunteer Coordinator
  { name: 'Volunteer Mobilization Hub', href: '/volunteers', icon: HeartHandshake, roles: ['VolunteerCoordinator'] },
  { name: 'Field Mission GIS Map', href: '/map', icon: MapPin, roles: ['VolunteerCoordinator'] },

  // 7. Donor / Funding Officer
  { name: 'My Funding Portfolio', href: '/donor/dashboard', icon: LayoutDashboard, roles: ['Donor'] },
  { name: 'Relief Campaigns & Pledges', href: '/donations', icon: DollarSign, roles: ['Donor'] },

  // 8. Partner Organisation Officer
  { name: 'Partner Operations Hub', href: '/partner/dashboard', icon: LayoutDashboard, roles: ['PartnerOfficer'] },
  { name: 'Depot Relief Supplies', href: '/resources', icon: Package, roles: ['PartnerOfficer'] },
  { name: 'Joint Crisis GIS Map', href: '/map', icon: MapPin, roles: ['PartnerOfficer'] },

  // 9. System Administrator (National Command & Governance)
  { name: 'National Command Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin'] },
  { name: 'System Telemetry & Audit', href: '/admin/dashboard', icon: ShieldAlert, roles: ['Admin'] },
  { name: 'User Management & RBAC', href: '/admin/users', icon: Users, roles: ['Admin'] },
  { name: 'Incidents Registry', href: '/coordinator/incidents', icon: ShieldAlert, roles: ['Admin'] },
  { name: 'AI Decision Oversight', href: '/coordinator/ai-review', icon: Bot, roles: ['Admin'] },
  { name: 'All Shelters', href: '/shelters', icon: Home, roles: ['Admin'] },
  { name: 'All Resources Depot', href: '/resources', icon: Package, roles: ['Admin'] },
  { name: 'All Volunteers', href: '/volunteers', icon: HeartHandshake, roles: ['Admin'] },
  { name: 'Donations & Campaigns', href: '/donations', icon: DollarSign, roles: ['Admin'] },
  { name: 'Command GIS Map', href: '/map', icon: MapPin, roles: ['Admin'] },

  // Optional: Field Volunteer Mobile Dispatch
  { name: 'Field Mission Dispatch', href: '/volunteer/dashboard', icon: LayoutDashboard, roles: ['Volunteer'] },
  { name: 'Assigned Shelters', href: '/shelters', icon: Home, roles: ['Volunteer'] },
  { name: 'Field Navigation Map', href: '/map', icon: MapPin, roles: ['Volunteer'] },
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

const navItemTranslations: Record<string, { en: string; si: string }> = {
  'My Assistance Portal': { en: 'My Assistance Portal', si: 'මගේ සහන පෝර්ටලය' },
  'Household Profile': { en: 'Household Profile', si: 'පවුලේ සාමාජික තොරතුරු' },
  'Submit Aid Request (SOS)': { en: 'Submit Aid Request (SOS)', si: 'හදිසි ආධාර ඉල්ලීම (SOS)' },
  'Nearby Safe Shelters': { en: 'Nearby Safe Shelters', si: 'ආසන්න ආරක්ෂිත කඳවුරු' },
  'Crisis Safety Guides': { en: 'Crisis Safety Guides', si: 'ආපදා ආරක්ෂක උපදෙස්' },
  'Coordinator Command Hub': { en: 'Coordinator Command Hub', si: 'සම්බන්ධීකාරක මෙහෙයුම් මැදිරිය' },
  'Explainable AI Triage': { en: 'Explainable AI Triage', si: 'AI ප්‍රමුඛතා නිර්දේශ' },
  'Crisis Incidents Registry': { en: 'Crisis Incidents Registry', si: 'ආපදා සිදුවීම් ලේඛනය' },
  'Resource Allocation Depot': { en: 'Resource Allocation Depot', si: 'සම්පත් හා උපකරණ ගබඩාව' },
  'Operational Analytics': { en: 'Operational Analytics', si: 'මෙහෙයුම් විශ්ලේෂණ' },
  'Active Incidents Registry': { en: 'Active Incidents Registry', si: 'ක්‍රියාකාරී සිදුවීම් ලේඛනය' },
  'Case Review & AI Triage': { en: 'Case Review & AI Triage', si: 'සිද්ධි සමාලෝචන සහ AI Triage' },
  'GIS Crisis Map': { en: 'GIS Crisis Map', si: 'භූගෝලීය ආපදා සිතියම' },
  'Inventory Depot & Supplies': { en: 'Inventory Depot & Supplies', si: 'ගබඩා තොග සහ සැපයුම්' },
  'Supply Logistics Analytics': { en: 'Supply Logistics Analytics', si: 'සැපයුම් ලොජිස්ටික්ස් වාර්තා' },
  'Safe Shelters & Camp Roster': { en: 'Safe Shelters & Camp Roster', si: 'ආරක්ෂිත කඳවුරු ලේඛනය' },
  'Shelter Locations Map': { en: 'Shelter Locations Map', si: 'නවාතැන් පිහිටීම් සිතියම' },
  'Volunteer Mobilization Hub': { en: 'Volunteer Mobilization Hub', si: 'ස්වේච්ඡා බලකා මෙහෙයුම්' },
  'Field Mission GIS Map': { en: 'Field Mission GIS Map', si: 'ක්ෂේත්‍ර මෙහෙයුම් සිතියම' },
  'My Funding Portfolio': { en: 'My Funding Portfolio', si: 'මගේ පරිත්‍යාග කළඹ' },
  'Relief Campaigns & Pledges': { en: 'Relief Campaigns & Pledges', si: 'සහන අරමුදල් සහ පරිත්‍යාග' },
  'Partner Operations Hub': { en: 'Partner Operations Hub', si: 'හවුල්කාර මෙහෙයුම් කේන්ද්‍රය' },
  'Depot Relief Supplies': { en: 'Depot Relief Supplies', si: 'සහන සැපයුම් ගබඩාව' },
  'Joint Crisis GIS Map': { en: 'Joint Crisis GIS Map', si: 'ඒකාබද්ධ ආපදා සිතියම' },
  'National Command Overview': { en: 'National Command Overview', si: 'ජාතික ආපදා මෙහෙයුම් මධ්‍යස්ථානය' },
  'System Telemetry & Audit': { en: 'System Telemetry & Audit', si: 'පද්ධති විගණන වාර්තා' },
  'User Management & RBAC': { en: 'User Management & RBAC', si: 'පරිශීලක සහ අවසර කළමනාකරණය' },
  'Incidents Registry': { en: 'Incidents Registry', si: 'සිදුවීම් ලේඛනය' },
  'AI Decision Oversight': { en: 'AI Decision Oversight', si: 'AI තීරණ අධීක්ෂණය' },
  'All Shelters': { en: 'All Shelters', si: 'සියලුම ආරක්ෂිත කඳවුරු' },
  'All Resources Depot': { en: 'All Resources Depot', si: 'සියලුම සම්පත් ගබඩා' },
  'All Volunteers': { en: 'All Volunteers', si: 'සියලුම ස්වේච්ඡා සේවකයින්' },
  'Donations & Campaigns': { en: 'Donations & Campaigns', si: 'පරිත්‍යාග සහ ව්‍යාපාර' },
  'Command GIS Map': { en: 'Command GIS Map', si: 'භූගෝලීය ආපදා සිතියම' },
  'System Analytics & Reports': { en: 'System Analytics & Reports', si: 'පද්ධති විශ්ලේෂණ වාර්තා' },
  'Field Mission Dispatch': { en: 'Field Mission Dispatch', si: 'ක්ෂේත්‍ර මෙහෙයුම් අංශය' },
  'Assigned Shelters': { en: 'Assigned Shelters', si: 'පවරන ලද කඳවුරු' },
  'Field Navigation Map': { en: 'Field Navigation Map', si: 'ක්ෂේත්‍ර ගමන් සිතියම' },
};

export const Sidebar: React.FC<SidebarProps> = ({
  role = 'Admin',
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  onOpenAiDrawer,
}) => {
  const { language } = useLanguage();
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
            const isUserManagement = item.href === '/admin/users';
            let pendingCount = 0;
            if (isUserManagement) {
              try {
                const stored = localStorage.getItem('sahaya_registered_users');
                if (stored) {
                  const parsed = JSON.parse(stored);
                  if (Array.isArray(parsed)) {
                    pendingCount = parsed.filter((u: any) => u.isActive === false).length;
                  }
                }
              } catch {}
            }

            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-[#162744]'
                  }`
                }
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">
                      {language === 'si' && navItemTranslations[item.name]?.si
                        ? navItemTranslations[item.name].si
                        : item.name}
                    </span>
                  )}
                </div>

                {!isCollapsed && isUserManagement && pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-xs animate-pulse">
                    {pendingCount}
                  </span>
                )}
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
