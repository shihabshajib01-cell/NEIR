import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, KeyRound, LogOut, Menu, User } from 'lucide-react';
import { BtrcLogo } from './BtrcLogo.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { useToast } from '../feedback/Toast.jsx';

export const Header = ({
  onToggleSidebar,
  onOpenMobileNav,
  isSidebarCollapsed,
}) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    addToast('Signed out of the NEIR frontend skeleton.', 'info');
    navigate('/login');
  };

  return (
    <header className="h-14 bg-[#102A43] text-white border-b border-[#173F5F] px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:flex p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenMobileNav}
          className="lg:hidden p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center min-w-0" aria-label="Go to NEIR dashboard">
          <BtrcLogo className="h-9 w-9" inverted showText />
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="View notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-5 h-5" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-[#172B4D] rounded-lg shadow-xl border border-[#D8E0E8] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#D8E0E8]">
                <span className="text-xs font-semibold text-[#102A43]">Notifications</span>
              </div>
              <div className="px-4 py-5 text-sm text-[#52677A]">
                No live notification service is connected in this frontend skeleton.
              </div>
            </div>
          )}
        </div>

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="flex items-center gap-2 p-1 pl-2 rounded-md hover:bg-white/10 transition-colors text-left cursor-pointer"
            aria-expanded={profileMenuOpen}
          >
            <div className="w-7 h-7 rounded-full bg-[#10683D] text-white flex items-center justify-center text-xs font-bold border border-emerald-400/40">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
                {user?.fullName || 'Admin user'}
              </span>
              <span className="text-[10px] text-slate-300 leading-tight truncate max-w-[130px]">
                {user?.role || 'Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-[#172B4D] rounded-lg shadow-xl border border-[#D8E0E8] py-1 z-50">
              <div className="px-4 py-3 border-b border-[#D8E0E8] bg-[#F4F7FA]">
                <p className="text-xs font-semibold text-[#102A43] truncate">
                  {user?.fullName || 'Admin user'}
                </p>
                <p className="text-[11px] text-[#52677A] truncate mt-0.5">
                  {user?.email || 'Mock authentication session'}
                </p>
              </div>

              <div className="py-1 text-xs">
                <Link
                  to="/office/users"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#F4F7FA] text-[#172B4D]"
                >
                  <User className="w-4 h-4 text-[#748597]" />
                  <span>User directory</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    addToast('Password management will be connected with production authentication.', 'info');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#F4F7FA] text-[#172B4D] text-left cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#748597]" />
                  <span>Change password</span>
                </button>
              </div>

              <div className="border-t border-[#D8E0E8] py-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-700 text-xs font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
