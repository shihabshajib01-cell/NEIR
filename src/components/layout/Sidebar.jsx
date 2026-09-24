import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck2,
  ShieldAlert,
  Smartphone,
  Radio,
  Users,
  CheckCircle,
  UploadCloud,
  Headphones,
  Ban,
  Building2,
  Search,
  ChevronDown,
  ChevronRight,
  FolderTree,
  KeyRound,
  Layers,
  ShieldCheck,
  Network,
  Award,
  UserCheck,
  ListOrdered,
  ShieldX
} from 'lucide-react';

export const navigationItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Special Registration',
    path: '/special-registration',
    icon: FileCheck2,
  },
  {
    name: 'Lost & Stolen',
    path: '/lost-stolen',
    icon: ShieldAlert,
  },
  {
    name: 'Device De-Register',
    path: '/device-deregister',
    icon: Smartphone,
  },
  {
    name: 'Auto Registration',
    path: '/auto-registration',
    icon: Radio,
  },
  {
    name: 'Role Management',
    path: '/role-management',
    icon: Users,
    children: [
      { name: 'Parent', path: '/role-management/parent', icon: FolderTree },
      { name: 'Permission', path: '/role-management/permission', icon: KeyRound },
      { name: 'Service Action', path: '/role-management/service-action', icon: Layers },
      { name: 'Role Setup', path: '/role-management/roles', icon: ShieldCheck },
    ]
  },
  {
    name: 'IMEI Check',
    path: '/imei-check',
    icon: CheckCircle,
  },
  {
    name: 'Manufacturer IMEI Upload',
    path: '/manufacturer-imei-upload',
    icon: UploadCloud,
  },
  {
    name: 'Support Ticket',
    path: '/support-ticket',
    icon: Headphones,
  },
  {
    name: 'Global IMEI Block',
    path: '/global-imei-block',
    icon: Ban,
    children: [
      { name: 'Block IMEI', path: '/global-imei-block', icon: ShieldX, exact: true },
      { name: 'Global IMEI Block List', path: '/global-imei-block/list', icon: ListOrdered },
    ]
  },
  {
    name: 'Office',
    path: '/office',
    icon: Building2,
    children: [
      { name: 'Department', path: '/office/departments', icon: Network },
      { name: 'Designation', path: '/office/designations', icon: Award },
      { name: 'User', path: '/office/users', icon: UserCheck },
    ]
  },
  {
    name: 'MSISDN IMEI List',
    path: '/msisdn-imei',
    icon: Search,
  },
];

export const Sidebar = ({ isCollapsed = false }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({
    '/role-management': location.pathname.startsWith('/role-management'),
    '/global-imei-block': location.pathname.startsWith('/global-imei-block'),
    '/office': location.pathname.startsWith('/office'),
  });

  const toggleSubmenu = (path) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white text-[#202338] border-r border-[#E2E5F0] transition-all duration-200 shrink-0 select-none z-20 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Navigation rail label */}
      <div className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#7A8197] border-b border-[#E2E5F0]">
        {isCollapsed ? 'NAV' : 'NAVIGATION'}
      </div>

      {/* Nav links scroll area */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1" aria-label="Main Navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isCurrentSectionActive = hasChildren
            ? location.pathname.startsWith(item.path)
            : location.pathname === item.path;
          const isSubmenuOpen = openSubmenus[item.path] || isCurrentSectionActive;

          if (hasChildren && !isCollapsed) {
            return (
              <div key={item.path} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isCurrentSectionActive
                      ? 'bg-[#E1F7FB] text-[#01ADC1]'
                      : 'text-[#626981] hover:bg-[#E1F7FB] hover:text-[#01ADC1]'
                  }`}
                  aria-expanded={isSubmenuOpen}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isCurrentSectionActive ? 'text-[#01ADC1]' : 'text-[#7A8197]'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isSubmenuOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#7A8197] shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#7A8197] shrink-0" />
                  )}
                </button>

                {isSubmenuOpen && (
                  <div className="pl-6 pr-1 space-y-0.5 border-l border-[#E2E5F0] ml-4 py-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = child.exact
                        ? location.pathname === child.path
                        : location.pathname.startsWith(child.path);

                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          end={child.exact}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                              isActive || isChildActive
                                ? 'bg-[#01ADC1] text-white font-medium shadow-xs'
                                : 'text-[#626981] hover:bg-[#E1F7FB] hover:text-[#01ADC1]'
                            }`
                          }
                        >
                          <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{child.name}</span>
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
              to={item.children ? item.children[0].path : item.path}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  isActive || isCurrentSectionActive
                    ? 'bg-[#01ADC1] text-white font-semibold shadow-[0_1px_3px_rgba(1,173,193,0.22)]'
                    : 'text-[#626981] hover:bg-[#E1F7FB] hover:text-[#01ADC1]'
                } ${isCollapsed ? 'justify-center px-2' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${(isActive || isCurrentSectionActive) ? 'text-white' : 'text-[#7A8197]'}`} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                  {(isActive || isCurrentSectionActive) && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#01ADC1] rounded-r" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-3 border-t border-[#E2E5F0] text-[11px] text-[#7A8197] bg-[#F7F8FC]">
          <p className="font-semibold text-[#202338]">BTRC NEIR</p>
          <p className="text-[10px] text-[#7A8197] mt-0.5">Frontend skeleton · mock data</p>
        </div>
      )}
    </aside>
  );
};
