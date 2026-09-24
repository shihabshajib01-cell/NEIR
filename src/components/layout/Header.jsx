import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, KeyRound, LogOut, Menu, Settings2, User } from 'lucide-react';
import { BtrcLogo } from './BtrcLogo.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { useToast } from '../feedback/Toast.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';
import { PreferencesPanel } from '../settings/PreferencesPanel.jsx';

export const Header = ({
  onToggleSidebar,
  onOpenMobileNav,
  isSidebarCollapsed,
}) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { language, t } = usePreferences();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const preferencesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setProfileMenuOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setNotificationsOpen(false);
      if (preferencesRef.current && !preferencesRef.current.contains(event.target)) setPreferencesOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    addToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  const utilityButton = 'w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer';

  return (
    <header className="h-[72px] bg-white text-[var(--color-text-primary)] border-b border-[var(--color-border)] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className={'hidden lg:flex ' + utilityButton}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenMobileNav}
          className={'lg:hidden ' + utilityButton}
          aria-label={t('Navigation')}
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center min-w-0" aria-label={t('Dashboard')}>
          <BtrcLogo className="h-10 w-10" showText />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div ref={preferencesRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setPreferencesOpen((open) => !open);
              setNotificationsOpen(false);
              setProfileMenuOpen(false);
            }}
            className={utilityButton + ' gap-1.5 px-2 sm:w-auto sm:min-w-10'}
            aria-label={t('Preferences')}
            aria-expanded={preferencesOpen}
            title={t('Preferences')}
          >
            <Settings2 className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline type-meta font-semibold">
              {language === 'bn' ? 'বাংলা' : 'EN'}
            </span>
          </button>
          {preferencesOpen && (
            <div className="absolute right-0 mt-2 z-50">
              <PreferencesPanel />
            </div>
          )}
        </div>

        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setPreferencesOpen(false);
              setProfileMenuOpen(false);
            }}
            className={utilityButton}
            aria-label={t('View notifications')}
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-[var(--color-text-primary)] rounded-xl shadow-[var(--shadow-lg)] border border-[var(--color-border)] py-2 z-50">
              <div className="px-4 py-2.5 border-b border-[var(--color-border)]">
                <span className="type-label font-semibold">{t('Notifications')}</span>
              </div>
              <div className="px-4 py-5 text-sm text-[var(--color-text-secondary)]">
                {t('No new notifications.')}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-[var(--color-border)] mx-1 hidden sm:block" />

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen((open) => !open);
              setPreferencesOpen(false);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 min-h-10 px-2 py-1.5 rounded-lg hover:bg-[var(--color-primary-light)] transition-colors text-left cursor-pointer"
            aria-expanded={profileMenuOpen}
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] flex items-center justify-center text-xs font-bold border border-[var(--color-border)]">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="type-label font-semibold leading-tight truncate max-w-[150px]">
                {user?.fullName || t('Admin user')}
              </span>
              <span className="type-meta text-[var(--color-text-secondary)] leading-tight truncate max-w-[150px]">
                {user?.role || 'Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-secondary)] hidden sm:block" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-[var(--shadow-lg)] border border-[var(--color-border)] py-1.5 z-50">
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background-subtle)]">
                <p className="type-label font-semibold truncate">{user?.fullName || t('Admin user')}</p>
                <p className="type-meta text-[var(--color-text-secondary)] truncate mt-0.5">
                  {user?.email || user?.username || 'NEIR Admin'}
                </p>
              </div>

              <div className="py-1 type-body-sm">
                <Link
                  to="/office/users"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--color-primary-light)]"
                >
                  <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <span>{t('User directory')}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    addToast('Password management is not available from this menu.', 'info');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--color-primary-light)] text-left cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <span>{t('Change password')}</span>
                </button>
              </div>

              <div className="border-t border-[var(--color-border)] py-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-[var(--color-error)] type-label text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('Sign out')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
