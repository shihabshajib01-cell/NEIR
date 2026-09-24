import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';
import { MobileNavigationDrawer } from './MobileNavigationDrawer.jsx';

export const AppShell = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA] text-[#172B4D]">
      {/* Top Application Header */}
      <Header
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Structural Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation Rail */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Mobile Navigation Drawer */}
        <MobileNavigationDrawer
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
