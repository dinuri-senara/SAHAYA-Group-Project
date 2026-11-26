import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  AlertCircle,
  CreditCard,
  UserPlus,
  Bell,
  BookOpen,
  ArrowLeft,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SahayaLogo } from '../components/SahayaLogo';

const SRI_LANKAN_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
];

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [role, setRole] = useState<string>('Citizen');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!nicNumber.trim()) {
      setError('Please enter your NIC number.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (!district) {
      setError('Please select your home district.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const regEmail = email.trim() || `user-${Date.now()}@sahaya.lk`;
      
      const roleMapping: Record<string, number> = {
        'Citizen': 1,
        'Coordinator': 2,
        'Volunteer': 3,
        'Donor': 4,
        'Admin': 5,
        'CaseManager': 6,
        'LogisticsManager': 7,
        'ShelterAdmin': 8,
        'VolunteerCoordinator': 9,
        'PartnerOfficer': 10
      };

      await register({
        fullName: fullName.trim(),
        email: regEmail,
        phoneNumber: phoneNumber.trim(),
        password,
        role: roleMapping[role] || 1,
      });

      // Role-specific redirect upon successful registration
      let target = '/citizen/dashboard';
      const isPublicRole = role === 'Citizen' || role === 'Donor';

      if (!isPublicRole) {
        target = '/pending-approval';
      } else if (role === 'Donor') {
        target = '/donor/dashboard';
      } else {
        target = '/citizen/dashboard';
      }

      window.location.href = target;
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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

      {/* 4. MAIN BODY: LEFT HERO REGISTRATION COPY + RIGHT FLOATING WHITE CARD */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT COLUMN: HERO HEADLINE & 3 BULLET BADGES (Sitting cleanly over full background photo) */}
          <div className="lg:col-span-5 space-y-6 text-white py-4">
            <div className="space-y-4 max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Create Your <br />
                Citizen Account
              </h1>
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-lg">
                Join SAHAYA to request assistance, track your requests, receive alerts, and stay safe during disasters.
              </p>
            </div>

            {/* 3 Feature Bullets with Round Icons (Matching Image 1 / uploaded mockup) */}
            <div className="pt-4 space-y-4 max-w-md">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Request & Track Aid</h4>
                  <p className="text-xs text-slate-200 leading-tight mt-0.5">
                    Submit and monitor your requests
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/30">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Get Real-time Alerts</h4>
                  <p className="text-xs text-slate-200 leading-tight mt-0.5">
                    Receive important disaster updates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-700/30">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Access Safety Guides</h4>
                  <p className="text-xs text-slate-200 leading-tight mt-0.5">
                    Learn how to stay safe and prepared
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FLOATING WHITE REGISTRATION CARD (Matching uploaded reference image) */}
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
                  Create an Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Register as a citizen and get access to SAHAYA services.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                      required
                    />
                  </div>
                </div>

                {/* 2-Column: NIC Number & Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIC Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={nicNumber}
                        onChange={(e) => setNicNumber(e.target.value)}
                        placeholder="e.g. 200012345678"
                        className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 071 234 5678"
                        className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                    />
                  </div>
                </div>

                {/* 2-Column: Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role-Based Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Requested Role Tier <span className="text-red-500">*</span>
                    </label>
                    {role !== 'Citizen' && role !== 'Donor' && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        Requires Admin Approval
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition cursor-pointer"
                    >
                      <optgroup label="Public Accounts (Instant Access)">
                        <option value="Citizen">Affected Person / Citizen</option>
                        <option value="Donor">Donor / Funding Officer</option>
                      </optgroup>
                      <optgroup label="Official Staff Roles (Admin Verified)">
                        <option value="Volunteer">Field Volunteer Candidate</option>
                        <option value="VolunteerCoordinator">Volunteer Coordinator</option>
                        <option value="ShelterAdmin">Shelter Administrator</option>
                        <option value="LogisticsManager">Resource & Logistics Manager</option>
                        <option value="CaseManager">Incident / Case Manager</option>
                        <option value="Coordinator">Emergency Coordinator</option>
                        <option value="PartnerOfficer">Partner Organisation Officer</option>
                      </optgroup>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {role === 'Citizen' || role === 'Donor'
                      ? 'Instant access to emergency assistance requests and relief portfolios.'
                      : 'Operational roles are created in pending verification status until authorized by System Administration.'}
                  </p>
                </div>

                {/* District Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition cursor-pointer"
                      required
                    >
                      <option value="">Select your district</option>
                      {SRI_LANKAN_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    required
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer leading-tight">
                    I agree to the{' '}
                    <span className="font-bold text-blue-600 hover:underline">Terms of Service</span> and{' '}
                    <span className="font-bold text-blue-600 hover:underline">Privacy Policy</span>.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#0d254c] hover:bg-[#173a70] text-white shadow-md shadow-blue-950/20 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </form>

              {/* Already have an account footer */}
              <div className="mt-5 text-center text-xs text-slate-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:underline">
                  Login Here
                </Link>
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
