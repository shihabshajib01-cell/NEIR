import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  User,
  KeyRound,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Building,
  Smartphone
} from 'lucide-react';
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
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    addToast('Signed out of BTRC NEIR Portal.', 'info');
    navigate('/login');
  };

  return (
    <header className="h-14 bg-[#102A43] text-white border-b border-[#173F5F] px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left zone: Collapse/hamburger + Branding */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:flex p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar"
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

        <Link to="/dashboard" className="flex items-center gap-2">
          <BtrcLogo className="h-8 w-8" inverted showText={true} />
        </Link>
      </div>

      {/* Center zone: Global Search placeholder */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search IMEI, NID, MSISDN or Ticket ID across registry..."
            readOnly
            onClick={() => addToast('Global Registry Search indexing active in background.', 'info')}
            className="w-full h-8.5 pl-9 pr-4 text-xs bg-[#173F5F]/80 text-white placeholder:text-slate-400 rounded-md border border-[#214F73] focus:border-[#14804A] focus:bg-[#173F5F] outline-hidden cursor-pointer"
          />
        </div>
      </div>

      {/* Right zone: System notifications + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Dropdown */}
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors relative cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#14804A] ring-2 ring-[#102A43]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-[#172B4D] rounded-lg shadow-xl border border-[#D8E0E8] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#D8E0E8] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#102A43]">System Notices</span>
                <span className="text-[11px] text-[#14804A] font-semibold bg-[#14804A]/10 px-1.5 py-0.5 rounded">3 New</span>
              </div>
              <div className="divide-y divide-[#F4F7FA] max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-[#F4F7FA] text-xs transition-colors">
                  <p className="font-semibold text-[#172B4D]">MNO Daily Sync Complete</p>
                  <p className="text-[11px] text-[#52677A] mt-0.5">GP, Robi, BL & TT registers synchronized 14 min ago.</p>
                </div>
                <div className="p-3 hover:bg-[#F4F7FA] text-xs transition-colors">
                  <p className="font-semibold text-[#172B4D]">Special Registration Queue</p>
                  <p className="text-[11px] text-[#52677A] mt-0.5">4 new airport baggage quota submissions pending review.</p>
                </div>
                <div className="p-3 hover:bg-[#F4F7FA] text-xs transition-colors">
                  <p className="font-semibold text-[#172B4D]">Police GD EIR Blacklist</p>
                  <p className="text-[11px] text-[#52677A] mt-0.5">Gulshan Thana GD #492 IMEI blocked globally.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-md hover:bg-white/10 transition-colors text-left cursor-pointer"
            aria-expanded={profileMenuOpen}
          >
            <div className="w-7 h-7 rounded-full bg-[#10683D] text-white flex items-center justify-center text-xs font-bold border border-emerald-400/40">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
                {user?.fullName || 'BTRC Officer'}
              </span>
              <span className="text-[10px] text-slate-300 leading-tight truncate max-w-[130px]">
                {user?.role || 'Super Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-[#172B4D] rounded-lg shadow-xl border border-[#D8E0E8] py-1 z-50 animate-scale-up">
              <div className="px-4 py-3 border-b border-[#D8E0E8] bg-[#F4F7FA]">
                <p className="text-xs font-semibold text-[#102A43] truncate">{user?.fullName || 'Admin User'}</p>
                <p className="text-[11px] text-[#52677A] truncate font-mono mt-0.5">{user?.email || 'admin@btrc.gov.bd'}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold bg-[#14804A]/10 text-[#10683D] px-2 py-0.5 rounded border border-[#14804A]/20">
                    {user?.role || 'Super Admin'}
                  </span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <Link
                  to="/office/users"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#F4F7FA] text-[#172B4D]"
                >
                  <User className="w-4 h-4 text-[#748597]" />
                  <span>My Profile & Office Directory</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    addToast('Change password dialog is available in user administration.', 'info');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#F4F7FA] text-[#172B4D] text-left cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#748597]" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="border-t border-[#D8E0E8] py-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-700 text-xs font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
