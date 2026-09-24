import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, LogOut, ShieldCheck } from 'lucide-react';
import { navigationItems } from './Sidebar.jsx';
import { BtrcLogo } from './BtrcLogo.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export const MobileNavigationDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openSubmenus, setOpenSubmenus] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const toggleSubmenu = (path) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#102A43]/70 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Navigation Drawer */}
      <div className="relative w-4/5 max-w-xs bg-[#102A43] text-white flex flex-col h-full z-10 shadow-2xl animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#173F5F] flex items-center justify-between">
          <BtrcLogo className="h-7 w-7" inverted showText={true} />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Mobile Drawer */}
        <div className="px-4 py-3 bg-[#173F5F]/60 border-b border-[#173F5F]">
          <p className="text-xs font-semibold text-white">{user?.fullName || 'BTRC Operator'}</p>
          <p className="text-[11px] text-slate-300">{user?.role || 'Super Admin'}</p>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Mobile Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isCurrentSectionActive = hasChildren
              ? location.pathname.startsWith(item.path)
              : location.pathname === item.path;
            const isSubmenuOpen = openSubmenus[item.path] ?? isCurrentSectionActive;

            if (hasChildren) {
              return (
                <div key={item.path} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                      isCurrentSectionActive ? 'bg-[#173F5F] text-white' : 'text-slate-300 hover:bg-[#173F5F]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.name}</span>
                    </div>
                    {isSubmenuOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  {isSubmenuOpen && (
                    <div className="pl-6 space-y-1 border-l border-[#173F5F] ml-4 py-1">
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
                            className={`flex items-center gap-2 px-2.5 py-2 rounded text-xs transition-colors ${
                              isChildActive ? 'bg-[#14804A] text-white font-semibold' : 'text-slate-300 hover:bg-[#173F5F]'
                            }`}
                          >
                            <ChildIcon className="w-3.5 h-3.5" />
                            <span>{child.name}</span>
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
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                    isActive ? 'bg-[#14804A] text-white font-semibold' : 'text-slate-300 hover:bg-[#173F5F]/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom sign out */}
        <div className="p-3 border-t border-[#173F5F]">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-red-900/40 text-red-200 text-xs font-medium hover:bg-red-900/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
