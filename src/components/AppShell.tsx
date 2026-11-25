import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { OfflineBanner } from './OfflineBanner';
import { RiverAlertTicker } from './RiverAlertTicker';
import { AIChatDrawer } from './AIChatDrawer';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface AppShellProps {
  children?: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
  onOpenAiDrawer?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  userRole: propUserRole,
  userName: propUserName,
  onOpenAiDrawer,
}) => {
  const { user } = useAuth();
  const activeRole: UserRole = propUserRole || user?.role || 'Admin';
  const activeUserName: string = propUserName || user?.fullName || 'Operational Officer';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sahaya_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sahaya_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleOpenAi = () => {
    if (onOpenAiDrawer) {
      onOpenAiDrawer();
    } else {
      setAiDrawerOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 flex relative overflow-x-hidden">
      {/* Sidebar navigation */}
      <Sidebar
        role={activeRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        onOpenAiDrawer={handleOpenAi}
      />

      {/* Main Content Area: dynamically offsets based on collapse state */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-68'
        }`}
      >
        <OfflineBanner />
        <RiverAlertTicker />
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          userName={activeUserName}
          userRole={activeRole}
        />

        <main className="flex-1 px-4 sm:px-8 pb-12 w-full max-w-[1550px] mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* Global AI Chat Drawer */}
      <AIChatDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        onOpen={() => setAiDrawerOpen(true)}
      />
    </div>
  );
};
