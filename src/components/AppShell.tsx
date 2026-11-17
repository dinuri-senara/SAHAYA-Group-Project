import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { UserRole } from '../types';

interface AppShellProps {
  children?: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
  onOpenAiDrawer?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  userRole = 'Admin',
  userName = 'Operational Officer',
  onOpenAiDrawer,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 flex relative overflow-x-hidden">
      {/* Sidebar navigation */}
      <Sidebar
        role={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        onOpenAiDrawer={onOpenAiDrawer}
      />

      {/* Main Content Area: dynamically offsets based on collapse state */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-68'
        }`}
      >
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          userRole={userRole}
        />

        <main className="flex-1 px-4 sm:px-8 pb-12 w-full max-w-[1550px] mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
