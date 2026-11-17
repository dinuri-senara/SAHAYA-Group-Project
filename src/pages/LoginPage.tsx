import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SahayaLogo } from '../components/SahayaLogo';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demoAccounts: { role: UserRole; email: string; pass: string; title: string; desc: string }[] = [
    { role: 'Citizen', email: 'citizen@sahaya.org', pass: 'Citizen@123', title: 'Citizen Portal', desc: 'Submit requests & track emergency aid' },
    { role: 'Coordinator', email: 'coordinator@sahaya.org', pass: 'Coordinator@123', title: 'Coordinator Operations', desc: 'Triage, approve, and allocate resources' },
    { role: 'Volunteer', email: 'volunteer@sahaya.org', pass: 'Volunteer@123', title: 'Volunteer Dispatch', desc: 'Accept field mission tasks & updates' },
    { role: 'Donor', email: 'donor@sahaya.org', pass: 'Donor@123', title: 'Donor Hub', desc: 'Support campaigns & track aid impact' },
    { role: 'Admin', email: 'admin@sahaya.org', pass: 'Admin@123', title: 'System Administrator', desc: 'Audit trails & platform governance' },
  ];

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    if (!loginEmail || !loginPass) {
      setError('Please provide both email and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPass);
      redirectToDashboard(res.role);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = (role: UserRole) => {
    switch (role) {
      case 'Citizen': navigate('/citizen/dashboard'); break;
      case 'Coordinator': navigate('/coordinator/dashboard'); break;
      case 'Volunteer': navigate('/volunteer/dashboard'); break;
      case 'Donor': navigate('/donor/dashboard'); break;
      case 'Admin': navigate('/admin/dashboard'); break;
      default: navigate('/citizen/dashboard');
    }
  };

  const handleDemoClick = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    handleLogin(undefined, acc.email, acc.pass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-4">
          <SahayaLogo light size="lg" showTagline={true} />
        </Link>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Sign In to SAHAYA Command
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your authorized credentials to access operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@sahaya.org"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Operations'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-teal-400 hover:text-teal-300">
              Register as Citizen
            </Link>
          </div>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>One-Click Academic Demo Logins</span>
            </div>
            <div className="space-y-2">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDemoClick(acc)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-950/80 transition text-left flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-teal-300 transition">
                        {acc.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                        {acc.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{acc.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-teal-400 opacity-0 group-hover:opacity-100 transition">
                    Sign in &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
