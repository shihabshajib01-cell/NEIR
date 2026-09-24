import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, Radio, Smartphone, Server } from 'lucide-react';
import { BtrcLogo } from '../../components/layout/BtrcLogo.jsx';
import { TextInput, PasswordInput } from '../../components/forms/TextInput.jsx';
import { Checkbox } from '../../components/forms/Checkbox.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { useAuth } from './AuthContext.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';

export const LoginPage = () => {
  const [username, setUsername] = useState('admin.btrc');
  const [password, setPassword] = useState('btrc#2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your BTRC admin username or official email ID.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your account password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(username, password);
      addToast('Authentication successful. Welcome to BTRC NEIR Portal.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F4F7FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-xl border border-[#D8E0E8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        {/* Left Column: Official Identity & BTRC Regulatory Notice (Desktop 5 cols) */}
        <div className="lg:col-span-5 bg-[#102A43] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle geometric telecom grid lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10">
            <BtrcLogo className="h-12 w-12" inverted showText={true} />
            
            <div className="mt-8 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
                Government of Bangladesh
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
                National Equipment Identity Register (NEIR)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Centralized regulatory platform for handset verification, EIR whitelisting, grey-market containment, and stolen device blacklisting across all licensed MNOs.
              </p>
            </div>

            {/* Pillar highlights */}
            <div className="mt-8 space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center gap-2.5 bg-[#173F5F]/80 p-2.5 rounded border border-[#214F73]">
                <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>4 Mobile Operators Synchronized</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#173F5F]/80 p-2.5 rounded border border-[#214F73]">
                <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Real-time GSMA TAC Validation</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#173F5F]/80 p-2.5 rounded border border-[#214F73]">
                <Server className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Law Enforcement EIR Gateway</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-[#173F5F] text-[11px] text-slate-400">
            <span>Bangladesh Telecommunication Regulatory Commission (BTRC)</span>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">IEB Bhaban, Ramna, Dhaka-1000</p>
          </div>
        </div>

        {/* Right Column: Secure Login Card (Desktop 7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#102A43] tracking-tight">Administrative Sign In</h3>
              <p className="text-xs text-[#52677A] mt-1">
                Enter your authorized credentials to access NEIR operational controls.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Username / Official Email"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin.btrc or officer@btrc.gov.bd"
                icon={User}
                required
              />

              <PasswordInput
                label="Account Password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center justify-between pt-1">
                <Checkbox
                  label="Remember this workstation"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <button
                  type="button"
                  onClick={() => addToast('Password reset requests must be submitted to the BTRC SSD Helpdesk.', 'info')}
                  className="text-xs font-medium text-[#147D83] hover:text-[#102A43] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full justify-center"
                >
                  Sign In to NEIR
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-4 border-t border-[#D8E0E8] text-center text-[11px] text-[#748597]">
              <span>Authorized personnel only. All access is logged for regulatory compliance.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
