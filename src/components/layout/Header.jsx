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
    <header className="h-[77px] bg-white text-[#202338] border-b border-[#E2E5F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-[0_1px_3px_rgba(0,0,0,0.025)]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg border border-[#E2E5F0] text-[#626981] hover:text-[#4B5694] hover:border-[#4B5694] hover:bg-[#EEF0FA] transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenMobileNav}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-[#E2E5F0] text-[#626981] hover:text-[#4B5694] hover:border-[#4B5694] hover:bg-[#EEF0FA] transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center min-w-0" aria-label="Go to NEIR dashboard">
          <BtrcLogo className="h-10 w-10" showText />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg border border-[#E2E5F0] text-[#626981] hover:text-[#4B5694] hover:border-[#4B5694] hover:bg-[#EEF0FA] transition-colors cursor-pointer"
            aria-label="View notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-[#202338] rounded-xl shadow-lg border border-[#E2E5F0] py-2 z-50">
              <div className="px-4 py-2.5 border-b border-[#E2E5F0]">
                <span className="text-sm font-semibold text-[#202338]">Notifications</span>
              </div>
              <div className="px-4 py-5 text-sm text-[#626981]">
                No live notification service is connected in this frontend skeleton.
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-[#E2E5F0] mx-1 hidden sm:block" />

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="flex items-center gap-2.5 min-h-10 px-2 py-1.5 rounded-lg hover:bg-[#EEF0FA] transition-colors text-left cursor-pointer"
            aria-expanded={profileMenuOpen}
          >
            <div className="w-8 h-8 rounded-lg bg-[#EEF0FA] text-[#4B5694] flex items-center justify-center text-xs font-bold border border-[#E2E5F0]">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-[#202338] leading-tight truncate max-w-[150px]">
                {user?.fullName || 'Admin user'}
              </span>
              <span className="text-xs text-[#626981] leading-tight truncate max-w-[150px]">
                {user?.role || 'Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#626981] hidden sm:block" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-[#202338] rounded-xl shadow-lg border border-[#E2E5F0] py-1.5 z-50">
              <div className="px-4 py-3 border-b border-[#E2E5F0] bg-[#F7F8FC]">
                <p className="text-sm font-semibold text-[#202338] truncate">
                  {user?.fullName || 'Admin user'}
                </p>
                <p className="text-xs text-[#626981] truncate mt-0.5">
                  {user?.email || 'Mock authentication session'}
                </p>
              </div>

              <div className="py-1 text-sm">
                <Link
                  to="/office/users"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#EEF0FA] text-[#202338]"
                >
                  <User className="w-4 h-4 text-[#626981]" />
                  <span>User directory</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    addToast('Password management will be connected with production authentication.', 'info');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#EEF0FA] text-[#202338] text-left cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#626981]" />
                  <span>Change password</span>
                </button>
              </div>

              <div className="border-t border-[#E2E5F0] py-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-[#C62828] text-sm font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
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
