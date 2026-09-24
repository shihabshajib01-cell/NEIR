import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, ShieldCheck, MonitorCheck, LayoutDashboard } from 'lucide-react';
import { BtrcLogo } from '../../components/layout/BtrcLogo.jsx';
import { TextInput, PasswordInput } from '../../components/forms/TextInput.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { useAuth } from './AuthContext.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      await login(username, password, rememberMe);
      addToast('Prototype access enabled.', 'success');
      navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-16">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
        <section className="hidden lg:flex flex-1 min-h-[560px] rounded-2xl border border-[#E2E5F0] bg-[#EEF0FA] relative overflow-hidden p-10 flex-col justify-between">
          <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-[#7C8BD6]/16" />
          <div className="absolute -left-24 bottom-0 w-64 h-64 rounded-full bg-[#4B5694]/8" />
          <div className="absolute inset-0 opacity-50 pointer-events-none bg-[radial-gradient(rgba(75,86,148,0.16)_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E5F0] text-xs font-semibold text-[#4B5694] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <ShieldCheck className="w-4 h-4" />
              BTRC Administrative Portal
            </div>

            <div className="mt-10 max-w-lg">
              <h1 className="text-[34px] leading-[1.18] font-semibold tracking-tight text-[#202338]">
                National Equipment Identity Register
              </h1>
              <p className="text-base text-[#626981] leading-7 mt-4 max-w-md">
                A focused administrative workspace for NEIR operations, review, device services, and system management.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-3 max-w-md">
            <div className="flex items-center gap-3 p-4 bg-white/85 border border-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 rounded-xl bg-[#4B5694]/10 flex items-center justify-center text-[#4B5694] shrink-0">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#202338]">Unified administration</p>
                <p className="text-xs text-[#626981] mt-0.5">One consistent workspace across NEIR modules.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/85 border border-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32] shrink-0">
                <MonitorCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#202338]">Prototype review mode</p>
                <p className="text-xs text-[#626981] mt-0.5">Credentials are bypassed while the frontend is being reviewed.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-[540px] shrink-0">
          <div className="flex items-start justify-between gap-6 mb-5 px-1">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-[#202338]">NEIR Admin Portal</h2>
              <p className="text-sm text-[#626981] mt-1">Bangladesh Telecommunication Regulatory Commission</p>
            </div>
            <BtrcLogo className="h-14 w-14" showText={false} />
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E5F0] shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 sm:p-8">
            <div className="mb-7">
              <h1 className="text-[30px] leading-tight font-semibold tracking-tight text-[#202338]">
                Administrative sign in
              </h1>
              <p className="text-sm text-[#626981] mt-2 leading-6">
                Sign in to access your NEIR office workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <TextInput
                label="Username"
                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                icon={User}
                autoComplete="username"
              />

              <PasswordInput
                label="Password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between gap-4">
                <Checkbox
                  label="Remember this browser"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span className="text-xs text-[#7A8197]">Prototype access</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full justify-center"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-[#7A8197] leading-5">
              For this frontend prototype, credentials are optional. Click Sign in to continue to the dashboard.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
