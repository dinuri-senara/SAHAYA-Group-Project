import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  AlertTriangle,
  MapPin,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SahayaLogo } from '../components/SahayaLogo';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const demoAccounts: { role: UserRole; email: string; pass: string; title: string; desc: string }[] = [
    { role: 'Citizen', email: 'citizen@sahaya.org', pass: 'Citizen@123', title: 'Affected Person / Citizen', desc: 'Aid requests, emergency SOS & status tracking' },
    { role: 'Coordinator', email: 'coordinator@sahaya.org', pass: 'Coordinator@123', title: 'Emergency Coordinator', desc: 'Case triage, AI assessment & crisis escalation' },
    { role: 'CaseManager', email: 'casemanager@sahaya.org', pass: 'Case@123', title: 'Incident / Case Manager', desc: 'Incidents registry & request lifecycle audit' },
    { role: 'LogisticsManager', email: 'logistics@sahaya.org', pass: 'Logistics@123', title: 'Resource & Logistics Manager', desc: 'Inventory depot, aid dispatches & shortages' },
    { role: 'ShelterAdmin', email: 'shelteradmin@sahaya.org', pass: 'Shelter@123', title: 'Shelter Administrator', desc: 'Shelter capacity, occupancies & facilities' },
    { role: 'VolunteerCoordinator', email: 'volunteercoord@sahaya.org', pass: 'VolCoord@123', title: 'Volunteer Coordinator', desc: 'Mobilization rosters & mission task allocation' },
    { role: 'Volunteer', email: 'volunteer@sahaya.org', pass: 'Volunteer@123', title: 'Field Volunteer', desc: 'Assigned field missions, task completion & GPS check-in' },
    { role: 'Donor', email: 'donor@sahaya.org', pass: 'Donor@123', title: 'Donor / Funding Officer', desc: 'Fund pledges, in-kind supplies & audit log' },
    { role: 'PartnerOfficer', email: 'partner@sahaya.org', pass: 'Partner@123', title: 'Partner Organisation Officer', desc: 'Inter-agency requisition & joint response' },
    { role: 'Admin', email: 'admin@sahaya.org', pass: 'Admin@123', title: 'System Administrator', desc: 'National executive command & system telemetry' },
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
      
      // If official staff account is pending administrator approval, gate immediately
      const isPublic = res.role === 'Citizen' || res.role === 'Donor';
      let isActive = true;
      try {
        const stored = localStorage.getItem('sahaya_registered_users');
        if (stored) {
          const parsed = JSON.parse(stored);
          const match = parsed.find((u: any) => u.email.toLowerCase() === res.email.toLowerCase());
          if (match && match.isActive === false) isActive = false;
        }
      } catch {}

      if (!isPublic && !isActive) {
        window.location.href = '/pending-approval';
        return;
      }

      redirectToDashboard(res.role);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = (role: UserRole) => {
    let target = '/citizen/dashboard';
    const cleanRole = String(role).trim();

    if (cleanRole === 'ShelterAdmin' || cleanRole === '8') {
      target = '/shelters';
    } else if (cleanRole === 'LogisticsManager' || cleanRole === '7') {
      target = '/resources';
    } else if (cleanRole === 'CaseManager' || cleanRole === '6') {
      target = '/coordinator/incidents';
    } else if (cleanRole === 'Coordinator' || cleanRole === '2') {
      target = '/coordinator/dashboard';
    } else if (cleanRole === 'VolunteerCoordinator' || cleanRole === '9') {
      target = '/volunteers';
    } else if (cleanRole === 'Donor' || cleanRole === '4') {
      target = '/donor/dashboard';
    } else if (cleanRole === 'PartnerOfficer' || cleanRole === '10') {
      target = '/partner/dashboard';
    } else if (cleanRole === 'Volunteer' || cleanRole === '3') {
      target = '/volunteer/dashboard';
    } else if (cleanRole === 'Admin' || cleanRole === '5') {
      target = '/dashboard';
    } else {
      target = '/citizen/dashboard';
    }

    window.location.href = target;
  };

  const handleDemoClick = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    handleLogin(undefined, acc.email, acc.pass);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. FULL PAGE BACKGROUND PHOTO (People on left, open landscape on right matching reference design) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#07162c] overflow-hidden">
        <img
          src="/images/hero-flood-relief-left.jpg"
          alt="SAHAYA Disaster Support Sri Lanka"
          className="w-full h-full object-cover object-left"
        />

        {/* Soft directional gradient: preserves text readability on left while keeping people vivid and colorful */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07162c]/85 via-[#07162c]/30 to-[#07162c]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07162c]/80 via-transparent to-[#07162c]/30" />
      </div>

      {/* 2. DUAL-WAVE RIBBON DECORATION AT BOTTOM (Full width across to the right-side corner) */}
      <div className="fixed bottom-0 left-0 right-0 w-full h-16 sm:h-20 lg:h-24 pointer-events-none z-10 leading-none overflow-hidden">
        <svg
          className="w-full h-full block"
          viewBox="0 0 1200 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,35 C300,75 700,10 1200,45 L1200,80 L0,80 Z"
            fill="#133568"
          />
          <path
            d="M0,52 C320,85 750,25 1200,60 L1200,80 L0,80 Z"
            fill="#dc2626"
          />
        </svg>
      </div>

      {/* 3. TOP BAR: SAHAYA Logo on Left + Back to Home & Language on Right */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <SahayaLogo
            size="md"
            light={true}
            showText={true}
            showTagline={true}
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white text-slate-800 text-xs font-bold shadow-xs backdrop-blur-md transition border border-white/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 text-slate-800 text-xs font-bold shadow-xs backdrop-blur-md border border-white/40">
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <select
              aria-label="Language selection"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'si')}
              className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en">English</option>
              <option value="si">සිංහල (Sinhala)</option>
            </select>
          </div>
        </div>
      </header>

      {/* 4. MAIN BODY: LEFT HERO DISASTER COPY + RIGHT FLOATING WHITE CARD */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT COLUMN: HERO HEADLINE & BADGES (Sitting cleanly over full background photo) */}
          <div className="lg:col-span-5 space-y-6 text-white py-4">
            <div className="space-y-4 max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Disaster Support <br />
                for a Safer Sri Lanka
              </h1>
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-lg">
                Request emergency assistance, stay informed with safety guides, and get the help you need during disasters.
              </p>
            </div>

            {/* 3 Quick Horizontal Badges at Bottom (Matching uploaded reference image) */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                </div>
                <span>Request Help in Emergencies</span>
              </div>

              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span>Find Nearby Shelters</span>
              </div>

              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-teal-500/30 text-teal-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                </div>
                <span>Learn Safety Measures</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FLOATING WHITE LOGIN CARD (Matching register card size & proportions) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="bg-white rounded-3xl sm:rounded-[36px] shadow-2xl border border-slate-100 p-8 sm:p-10 w-full max-w-xl relative z-10 backdrop-blur-xs">

              {/* Card Header with Official SAHAYA Logo */}
              <div className="text-center space-y-2 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <SahayaLogo
                    size="md"
                    light={false}
                    showText={true}
                    showTagline={true}
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Sign in to your citizen account
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email or Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email or username"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset instructions: Please contact your SAHAYA district coordinator or use your registered mobile number.');
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#0d254c] hover:bg-[#173a70] text-white shadow-md shadow-blue-950/20 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-5 text-center text-xs text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </div>

              {/* BOTTOM ALERT: Need immediate help without login */}
              <div className="mt-6 p-3.5 rounded-2xl bg-red-50/90 border border-red-200/80 flex flex-col gap-2 group">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-red-900">
                        Need immediate help?
                      </h4>
                      <p className="text-[11px] text-red-700">
                        Request emergency assistance without login.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/emergency/request"
                    className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 shadow-xs flex items-center justify-center text-white group-hover:translate-x-0.5 transition shrink-0 cursor-pointer"
                    title="Request without login"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="pt-2 border-t border-red-200/60 flex items-center justify-between text-[11px] font-semibold text-red-800">
                  <span>Already requested emergency aid?</span>
                  <Link to="/emergency/track" className="font-bold underline hover:text-red-950 flex items-center gap-1">
                    Track status &rarr;
                  </Link>
                </div>
              </div>

              {/* ONE-CLICK ACADEMIC DEMO LOGINS (Collapsible for easy evaluation) */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                  className="w-full flex items-center justify-between text-left text-[11px] font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Academic Evaluation Demo Logins
                  </span>
                  <span>{showDemoAccounts ? '▲' : '▼'}</span>
                </button>

                {showDemoAccounts && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {demoAccounts.map((acc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDemoClick(acc)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-left transition cursor-pointer flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-bold text-slate-800">{acc.title}</span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                            {acc.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate mt-0.5">{acc.email}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* 5. FOOTER */}
      <footer className="relative z-20 w-full py-4 text-center text-xs text-slate-300/80">
        © 2026 SAHAYA Disaster Management Platform. Sri Lanka Humanitarian Operations.
      </footer>
    </div>
  );
};
