import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, ShieldCheck, LayoutDashboard, Languages } from 'lucide-react';
import { BtrcLogo } from '../../components/layout/BtrcLogo.jsx';
import { TextInput, PasswordInput } from '../../components/forms/TextInput.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { useAuth } from './AuthContext.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const { language, setLanguage, t } = usePreferences();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await login(username, password, rememberMe);
      addToast('Signed in successfully.', 'success');
      navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-16 relative">
      <button
        type="button"
        onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
        className="absolute top-4 right-4 min-h-10 px-3 flex items-center gap-2 rounded-lg bg-white border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
      >
        <Languages className="w-4 h-4" />
        <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
      </button>

      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
        <section className="hidden lg:flex flex-1 min-h-[560px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-light)] relative overflow-hidden p-10 flex-col justify-between">
          <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-[rgba(128,194,198,0.20)]" />
          <div className="absolute -left-24 bottom-0 w-64 h-64 rounded-full bg-[rgba(1,173,193,0.08)]" />
          <div className="absolute inset-0 opacity-50 pointer-events-none bg-[radial-gradient(rgba(1,173,193,0.18)_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[var(--color-border)] text-xs font-semibold text-[var(--color-primary-dark)] shadow-[var(--shadow-sm)]">
              <ShieldCheck className="w-4 h-4" />
              BTRC Administrative Portal
            </div>

            <div className="mt-10 max-w-lg">
              <h1 className="text-[34px] leading-[1.18] font-semibold tracking-tight text-[var(--color-text-primary)]">National Equipment Identity Register</h1>
              <p className="text-base text-[var(--color-text-secondary)] leading-7 mt-4 max-w-md">A focused administrative workspace for NEIR operations, review, device services, and system management.</p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-3 max-w-md">
            <div className="flex items-center gap-3 p-4 bg-white/85 border border-white rounded-xl shadow-[var(--shadow-sm)]">
              <div className="w-10 h-10 rounded-xl bg-[rgba(1,173,193,0.10)] flex items-center justify-center text-[var(--color-primary-dark)] shrink-0"><LayoutDashboard className="w-5 h-5" /></div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Unified administration</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">One consistent workspace across NEIR modules.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/85 border border-white rounded-xl shadow-[var(--shadow-sm)]">
              <div className="w-10 h-10 rounded-xl bg-[rgba(46,125,50,0.10)] flex items-center justify-center text-[var(--color-success)] shrink-0"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Administrative workspace</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Access NEIR operations, review queues, device services, and system management.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-[540px] shrink-0">
          <div className="flex items-start justify-between gap-6 mb-5 px-1">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{t('NEIR Admin Portal')}</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{t('Bangladesh Telecommunication Regulatory Commission')}</p>
            </div>
            <BtrcLogo className="h-14 w-14" showText={false} />
          </div>

          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-md)] p-6 sm:p-8">
            <div className="mb-7">
              <h1 className="text-[30px] leading-tight font-semibold tracking-tight text-[var(--color-text-primary)]">{t('Administrative sign in')}</h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-6">{t('Sign in to access your NEIR office workspace.')}</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <TextInput label="Username" id="username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter username" icon={User} autoComplete="username" />
              <PasswordInput label="Password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" autoComplete="current-password" />

              <div className="flex items-center">
                <Checkbox label="Remember this browser" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
              </div>

              <Button type="submit" variant="primary" isLoading={isLoading} className="w-full justify-center">Sign in</Button>
            </form>

          </div>
        </section>
      </div>
    </div>
  );
};
