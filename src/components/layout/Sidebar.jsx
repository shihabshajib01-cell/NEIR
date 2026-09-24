import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileCheck2, ShieldAlert, Smartphone, Radio, Users, CheckCircle,
  UploadCloud, Headphones, Ban, Building2, Search, ChevronDown, ChevronRight,
  FolderTree, KeyRound, Layers, ShieldCheck, Network, Award, UserCheck, ListOrdered, ShieldX
} from 'lucide-react';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Special Registration', path: '/special-registration', icon: FileCheck2 },
  { name: 'Lost & Stolen', path: '/lost-stolen', icon: ShieldAlert },
  { name: 'Device De-Register', path: '/device-deregister', icon: Smartphone },
  { name: 'Auto Registration', path: '/auto-registration', icon: Radio },
  {
    name: 'Role Management', path: '/role-management', icon: Users,
    children: [
      { name: 'Parent', path: '/role-management/parent', icon: FolderTree },
      { name: 'Permission', path: '/role-management/permission', icon: KeyRound },
      { name: 'Service Action', path: '/role-management/service-action', icon: Layers },
      { name: 'Role Setup', path: '/role-management/roles', icon: ShieldCheck },
    ]
  },
  { name: 'IMEI Check', path: '/imei-check', icon: CheckCircle },
  { name: 'Manufacturer IMEI Upload', path: '/manufacturer-imei-upload', icon: UploadCloud },
  { name: 'Support Ticket', path: '/support-ticket', icon: Headphones },
  {
    name: 'Global IMEI Block', path: '/global-imei-block', icon: Ban,
    children: [
      { name: 'Block IMEI', path: '/global-imei-block', icon: ShieldX, exact: true },
      { name: 'Global IMEI Block List', path: '/global-imei-block/list', icon: ListOrdered },
    ]
  },
  {
    name: 'Office', path: '/office', icon: Building2,
    children: [
      { name: 'Department', path: '/office/departments', icon: Network },
      { name: 'Designation', path: '/office/designations', icon: Award },
      { name: 'User', path: '/office/users', icon: UserCheck },
    ]
  },
  { name: 'MSISDN IMEI List', path: '/msisdn-imei', icon: Search },
];

export const Sidebar = ({ isCollapsed = false }) => {
  const location = useLocation();
  const { t } = usePreferences();
  const [openSubmenus, setOpenSubmenus] = useState({
    '/role-management': location.pathname.startsWith('/role-management'),
    '/global-imei-block': location.pathname.startsWith('/global-imei-block'),
    '/office': location.pathname.startsWith('/office'),
  });

  const toggleSubmenu = (path) => {
    setOpenSubmenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <aside
      className={'hidden lg:flex flex-col bg-white text-[var(--color-text-primary)] border-r border-[var(--color-border)] transition-all duration-200 shrink-0 select-none z-20 ' + (isCollapsed ? 'w-16' : 'w-64')}
    >
      <div className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
        {isCollapsed ? 'NAV' : t('Navigation')}
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1" aria-label={t('Navigation')}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const activeSection = hasChildren ? location.pathname.startsWith(item.path) : location.pathname === item.path;
          const submenuOpen = openSubmenus[item.path] || activeSection;

          if (hasChildren && !isCollapsed) {
            return (
              <div key={item.path} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.path)}
                  className={'w-full min-h-11 flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ' +
                    (activeSection
                      ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)]')}
                  aria-expanded={submenuOpen}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={'w-4 h-4 shrink-0 ' + (activeSection ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]')} />
                    <span className="truncate">{t(item.name)}</span>
                  </div>
                  {submenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {submenuOpen && (
                  <div className="ml-4 pl-3 border-l border-[var(--color-border)] space-y-1 py-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const activeChild = child.exact ? location.pathname === child.path : location.pathname.startsWith(child.path);
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          end={child.exact}
                          className={'min-h-10 flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ' +
                            (activeChild
                              ? 'bg-[var(--color-primary)] text-white font-semibold shadow-[var(--shadow-sm)]'
                              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)]')}
                        >
                          <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{t(child.name)}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? t(item.name) : undefined}
              className={({ isActive }) =>
                'min-h-11 flex items-center ' + (isCollapsed ? 'justify-center px-2' : 'gap-2.5 px-3') + ' py-2.5 rounded-lg text-sm font-medium transition-colors ' +
                (isActive
                  ? 'bg-[var(--color-primary)] text-white font-semibold shadow-[var(--shadow-sm)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)]')
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{t(item.name)}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
