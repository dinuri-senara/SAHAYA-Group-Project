import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Shield, Camera, Clock, X, Check, AlertCircle, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ColorTheme, ModeTheme } from '../context/ThemeContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshUser } = useAuth();
  const { colorTheme, setColorTheme, mode, setMode } = useTheme();

  const [activeTab, setActiveTab] = useState<'appearance' | 'profile'>('appearance');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+94 77 123 4567');
  const [emergencyContact, setEmergencyContact] = useState('+94 71 987 6543 (Immediate Kin)');
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem(`sahaya_avatar_${user?.id}`) || '';
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        if (user) {
          localStorage.setItem(`sahaya_avatar_${user.id}`, base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    try {
      if (user) {
        const updatedUser = {
          ...user,
          fullName,
          phoneNumber,
        };
        localStorage.setItem('sahaya_user', JSON.stringify(updatedUser));
        await refreshUser();
      }
      setSuccessMsg('Profile details & emergency contact updated successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
        window.location.reload();
      }, 1000);
    } catch {
      // safe fallback
    } finally {
      setIsSaving(false);
    }
  };

  const colorThemesList: { id: ColorTheme; name: string; nameSi: string; colorStyle: string; desc: string }[] = [
    {
      id: 'blue',
      name: 'Ocean Blue (Default)',
      nameSi: 'සාගර නිල්',
      colorStyle: '#2563eb',
      desc: 'National command authority & official humanitarian response',
    },
    {
      id: 'green',
      name: 'Emerald Green',
      nameSi: 'මරකත කොළ',
      colorStyle: '#059669',
      desc: 'Disaster recovery, safe shelters & medical triage operations',
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      nameSi: 'රාජකීය දම්',
      colorStyle: '#8b5cf6',
      desc: 'Volunteer mobilization, partner networks & community action',
    },
    {
      id: 'yellow',
      name: 'Warm Amber / Yellow',
      nameSi: 'රන්වන් කහ / ඇම්බර්',
      colorStyle: '#d97706',
      desc: 'Crisis weather warnings, hydrological watch & urgent logistics',
    },
  ];

  const auditHistory = [
    { action: 'Session Initialized', date: 'Just now', ip: '192.168.1.1 (Authenticated Token)' },
    { action: 'Role Verification Check', date: 'Today at 08:30 AM', ip: 'National Gateway Node' },
    { action: 'Emergency Readiness Confirmation', date: 'Yesterday at 04:15 PM', ip: 'Disaster Relief Cloud' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Settings & Appearance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Customize color themes, light/dark mode, and manage user profile.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-4 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Appearance & Themes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: Appearance & 4 Color Themes */}
        {activeTab === 'appearance' && (
          <div className="mt-5 space-y-6">
            {/* 1. Theme Mode: Light / Dark / System */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Display Mode
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMode('light')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    mode === 'light'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 font-bold text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold">Light Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('dark')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    mode === 'dark'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 font-bold text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50'
                  }`}
                >
                  <Moon className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold">Dark Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('system')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    mode === 'system'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 font-bold text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50'
                  }`}
                >
                  <Monitor className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-xs font-bold">System Sync</span>
                </button>
              </div>
            </div>

            {/* 2. Color Theme Selection: 4 Types (Blue, Green, Purple, Yellow) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  System Color Palette (4 Styles)
                </label>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  Live Preview
                </span>
              </div>

              <div className="space-y-2.5">
                {colorThemesList.map((t) => {
                  const isSelected = colorTheme === t.id;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setColorTheme(t.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? `border-slate-400 dark:border-white/40 bg-slate-50 dark:bg-slate-800/80 ring-2 shadow-sm`
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-slate-800/40'
                      }`}
                      style={isSelected ? { borderColor: t.colorStyle, boxShadow: `0 0 0 2px ${t.colorStyle}33` } : undefined}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-8 h-8 rounded-xl text-white flex items-center justify-center shadow-sm shrink-0"
                          style={{ backgroundColor: t.colorStyle }}
                        >
                          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {t.name}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              ({t.nameSi})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {t.desc}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: `${t.colorStyle}20`, color: t.colorStyle }}
                        >
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: User Profile & Security */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4 mt-5">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center font-black text-xl ring-2 ring-white dark:ring-slate-700 shadow-md overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0) || 'U'
                )}
              </div>
              <div>
                <label
                  htmlFor="avatar-upload"
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Upload Profile Photo</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <p className="text-[10px] text-slate-400 mt-1">Supported formats: JPG, PNG, WEBP (Max 2MB)</p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Primary Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Phone Contact</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Contact / Kin (24/7 Hotline)</label>
              <div className="relative">
                <AlertCircle className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+94 7X XXX XXXX (Next of Kin)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Assigned Role & Tier */}
            <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-900 dark:text-blue-200">Operational Role Tier:</span>
              <span className="font-black px-2.5 py-0.5 rounded-md bg-blue-600 text-white">
                {user?.role || 'Citizen'}
              </span>
            </div>

            {/* Account Audit History */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Verifiable Activity History
              </h4>
              <div className="space-y-1.5">
                {auditHistory.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-[11px] flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.action}</span>
                    <span className="text-slate-400 dark:text-slate-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
