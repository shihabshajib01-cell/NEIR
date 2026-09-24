import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';
import { MobileNavigationDrawer } from './MobileNavigationDrawer.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const AppShell = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { t } = usePreferences();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
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
            <div className="p-4 sm:p-5 lg:p-6 xl:p-8 max-w-[1600px] w-full mx-auto">
              <Outlet />
            </div>
          </main>

          <footer className="shrink-0 border-t border-[var(--color-border)] bg-white px-4 sm:px-6 py-3 text-right text-xs text-[var(--color-text-secondary)]">
            {t('Powered by')} <span className="font-semibold text-[var(--color-text-primary)]">Synesis IT</span>
          </footer>
        </div>
      </div>
    </div>
  );
};
