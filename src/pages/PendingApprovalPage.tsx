import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Phone,
  CheckCircle2,
  LogOut,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { SahayaLogo } from '../components/SahayaLogo';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const PendingApprovalPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCheckApproval = async () => {
    setChecking(true);
    setStatusMessage(null);
    try {
      await refreshUser();
      
      // Look up account directly in stored users to avoid session overlap
      let targetRole = user?.role;
      let isNowActive = false;

      try {
        const stored = localStorage.getItem('sahaya_registered_users');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && user) {
            const match = parsed.find(
              (u: any) => u.email.toLowerCase() === user.email.toLowerCase() || u.id === user.id
            );
            if (match) {
              targetRole = match.role;
              isNowActive = match.isActive === true;
            }
          }
        }
      } catch {}

      if (isNowActive) {
        setStatusMessage('Your official staff account has been approved by the Administrator! Redirecting...');
        setTimeout(() => {
          let target = '/dashboard';
          if (targetRole === 'ShelterAdmin') target = '/shelters';
          else if (targetRole === 'LogisticsManager') target = '/resources';
          else if (targetRole === 'PartnerOfficer') target = '/partner/dashboard';
          else if (targetRole === 'Coordinator') target = '/coordinator/dashboard';
          else if (targetRole === 'CaseManager') target = '/coordinator/incidents';
          else if (targetRole === 'VolunteerCoordinator') target = '/volunteers';
          else if (targetRole === 'Volunteer') target = '/volunteer/dashboard';
          else if (targetRole === 'Donor') target = '/donor/dashboard';
          else if (targetRole === 'Admin') target = '/dashboard';
          window.location.href = target;
        }, 1200);
      } else {
        setStatusMessage('Your account is still awaiting approval by a System Administrator.');
      }
    } catch {
      setStatusMessage('Unable to reach server. Please try again in a moment.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative selection:bg-purple-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-3">
          <SahayaLogo size="md" light={true} showText={true} showTagline={true} />
        </Link>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Central Content */}
      <main className="relative z-10 max-w-xl w-full mx-auto px-4 py-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/20">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Gate: Official Verification Required</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Account Awaiting Admin Approval
        </h1>

        <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-md">
          Hello <span className="font-bold text-slate-200">{user?.fullName || 'Colleague'}</span>, your request for an official operational credential (
          <span className="font-bold text-amber-300">{user?.role || 'Staff Role'}</span>) has been securely received by the National Emergency Operations Command.
        </p>

        {/* Verification Status Card */}
        <div className="w-full mt-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400 font-medium">Registered Identifier:</span>
            <span className="text-xs font-mono font-bold text-slate-200">{user?.email || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400 font-medium">Requested Privilege Level:</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {user?.role} (Tier 2/3 Staff)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Authorization Status:</span>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Pending Admin Review
            </span>
          </div>
        </div>

        {/* Notice of Security Guidelines */}
        <div className="w-full mt-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-left flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            In compliance with national disaster response regulations, sensitive operational modules (incidents, logistics depots, and AI decision recommendations) are strictly protected. An authorized System Administrator will review and activate your account shortly.
          </p>
        </div>

        {/* Status Message Toast / Feedback */}
        {statusMessage && (
          <div
            className={`w-full mt-4 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition animate-fade-in ${
              statusMessage.includes('approved')
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
            }`}
          >
            {statusMessage.includes('approved') ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleCheckApproval}
            disabled={checking}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking Status...' : 'Check Approval Status'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition cursor-pointer"
          >
            <span>Log In with Another Account</span>
          </button>
        </div>

        {/* Contact Hotline */}
        <p className="text-[11px] text-slate-500 mt-6 flex items-center gap-2">
          <span>Need expedited emergency clearance? Contact NEOC Helpdesk:</span>
          <span className="text-blue-400 font-mono font-bold">117 / (011) 213-6117</span>
        </p>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-4 py-4 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} SAHAYA Humanitarian Crisis Management & Aid Coordination Platform
      </footer>
    </div>
  );
};
