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
      <Header
        onToggleSidebar={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="flex-1 flex min-h-0">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        <MobileNavigationDrawer
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
              <Outlet />
            </div>
          </main>

          <footer className="shrink-0 border-t border-[#D8E0E8] bg-white px-4 sm:px-6 py-3 text-right text-xs text-[#52677A]">
            Powered by <span className="font-semibold text-[#172B4D]">Synesis IT</span>
          </footer>
        </div>
      </div>
    </div>
  );
};
