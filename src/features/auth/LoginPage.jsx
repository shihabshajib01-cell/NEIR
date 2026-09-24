import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, AlertCircle, ShieldCheck } from 'lucide-react';
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
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(username, password, rememberMe);
      addToast('Signed in to the NEIR frontend skeleton.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F4F7FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-xl border border-[#D8E0E8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        <div className="lg:col-span-5 bg-[#102A43] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
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

            <div className="mt-8 rounded-lg border border-[#214F73] bg-[#173F5F]/70 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Frontend skeleton</p>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Production authentication and operational APIs are not connected yet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-[#173F5F] text-xs text-slate-400">
            Bangladesh Telecommunication Regulatory Commission (BTRC)
          </div>
        </div>

        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#102A43] tracking-tight">Administrative sign in</h2>
              <p className="text-sm text-[#52677A] mt-1">
                Use any non-empty username and password while this project is running with mock authentication.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2.5" role="alert">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Username"
                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                icon={User}
                autoComplete="username"
                required
              />

              <PasswordInput
                label="Password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
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

            <div className="mt-8 pt-4 border-t border-[#D8E0E8] text-center text-xs text-[#748597]">
              Production authentication will replace this mock login during backend integration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
