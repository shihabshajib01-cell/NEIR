import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col justify-center bg-[#F7F8FC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-xl border border-[#E2E5F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        <div className="lg:col-span-5 bg-[#202338] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10">
            <BtrcLogo className="h-14 w-14" inverted showText />

            <div className="mt-8 space-y-3">
              <span className="inline-flex text-[11px] font-semibold uppercase tracking-widest text-emerald-300 bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
                Administrative Portal
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white leading-snug">
                National Equipment Identity Register (NEIR)
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Secure administrative access to the NEIR frontend workspace.
              </p>
            </div>

            <div className="mt-8 rounded-lg border border-[#7C8BD6] bg-[#4B5694]/70 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Prototype access</p>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Authentication is bypassed while we build and review the frontend.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-[#4B5694] text-xs text-slate-400">
            Bangladesh Telecommunication Regulatory Commission (BTRC)
          </div>
        </div>

        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#202338] tracking-tight">Administrative sign in</h2>
              <p className="text-sm text-[#626981] mt-1">
                Username and password are optional in the current frontend prototype.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Username"
                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Optional"
                icon={User}
                autoComplete="username"
              />

              <PasswordInput
                label="Password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Optional"
                autoComplete="current-password"
              />

              <Checkbox
                label="Remember this browser"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />

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

            <div className="mt-8 pt-4 border-t border-[#E2E5F0] text-center text-xs text-[#7A8197]">
              Click Sign in to continue directly to the dashboard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
