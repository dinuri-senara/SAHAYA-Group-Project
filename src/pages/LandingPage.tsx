import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bell,
  MapPin,
  ClipboardList,
  CheckCircle2,
  PhoneCall,
  Globe,
  LifeBuoy,
  Flame,
  Droplets,
  Mountain
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SahayaLogo } from '../components/SahayaLogo';

export const LandingPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Official SAHAYA Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <SahayaLogo size="md" light={false} showText={true} showTagline={true} />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <Link to="/" className="text-blue-700 font-extrabold border-b-2 border-blue-700 pb-0.5">
              {t('nav.home', 'Home')}
            </Link>
            <Link to="/citizen/safety-guide" className="hover:text-blue-700 transition">
              {t('nav.safetyGuides', 'Safety Guides')}
            </Link>
            <a href="#how-it-works" className="hover:text-blue-700 transition">
              {t('nav.howItWorks', 'How It Works')}
            </a>
            <a href="#about" className="hover:text-blue-700 transition">
              {t('nav.about', 'About')}
            </a>
            <a href="#contact" className="hover:text-blue-700 transition">
              {t('nav.contact', 'Contact')}
            </a>
          </nav>

          {/* Right Controls: Language & Auth CTAs */}
          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                aria-label="Language selection"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'si')}
                className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en">English</option>
                <option value="si">සිංහල (Sinhala)</option>
              </select>
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#0d254c] hover:bg-slate-100 border border-slate-300 transition shadow-2xs"
            >
              {t('nav.login', 'Login')}
            </Link>

            {/* Sign Up Button */}
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0d254c] hover:bg-[#153a75] shadow-md shadow-blue-950/20 transition hover:shadow-lg"
            >
              {t('nav.signUp', 'Sign Up')}
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER SECTION (Matching Image 2 with Vivid Rescue Photography) */}
      <section className="relative overflow-hidden bg-[#0b1e3b] text-white min-h-[460px] lg:min-h-[520px] flex items-center">
        {/* Full-width seamless background image without any dividing lines or cuts */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/hero-flood-rescue.jpg"
            alt="Sri Lanka Flood Relief Team"
            className="w-full h-full object-cover object-[65%_center]"
          />
          {/* Smooth left-to-right gradient: dark navy on the left for high text readability, seamlessly fading into the vivid photo on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e3b] via-[#0b1e3b]/85 via-40% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1e3b]/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-2xl space-y-5">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-black backdrop-blur-md">
              <span className="p-1 rounded-full bg-red-500 text-white animate-pulse">
                <AlertTriangle className="w-3 h-3" />
              </span>
              <span>{language === 'si' ? 'හදිසි ආධාර මෙහෙයුම්' : 'Emergency Assistance'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              {language === 'si' ? (
                <>
                  ඔබට වඩාත්ම අවශ්‍ය <br />
                  <span className="text-[#ef4444]">මොහොතේ පිහිට.</span>
                </>
              ) : (
                <>
                  Help When You <br />
                  <span className="text-[#ef4444]">Need It Most.</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-xl">
              {t('landing.heroSub')}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/citizen/create-request"
                className="px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm text-white bg-[#ef4444] hover:bg-[#dc2626] shadow-lg shadow-red-600/30 hover:shadow-xl transition-all flex items-center gap-2.5 cursor-pointer group"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
                <span>{t('landing.requestAidBtn')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/citizen/safety-guide"
                className="px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-white" />
                <span>{t('landing.viewGuidesBtn')}</span>
              </Link>
            </div>

            {/* No Account Required Note */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 pt-1">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>{t('landing.noAccountNotice')}</span>
            </div>
          </div>
        </div>

        {/* Dual Color Curve Ribbon (Blue + Red Waves at Hero Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className="w-full h-10 sm:h-14 lg:h-16 block"
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,45 C320,80 520,10 820,50 C1120,90 1320,25 1440,35 L1440,80 L0,80 Z"
              fill="#1e3a8a"
            />
            <path
              d="M0,60 C360,95 620,30 920,65 C1220,100 1360,45 1440,55 L1440,80 L0,80 Z"
              fill="#dc2626"
            />
          </svg>
        </div>
      </section>

      {/* 3. FOUR QUICK FEATURE CARDS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1: Request Help */}
          <Link
            to="/citizen/create-request"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
                {t('landing.cardHelpTitle', 'Request Help')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {t('landing.cardHelpDesc', 'Food, water, medical, or rescue')}
              </p>
            </div>
          </Link>

          {/* Card 2: Find Nearby Shelters */}
          <Link
            to="/shelters"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                {t('landing.cardSheltersTitle', 'Find Nearby Shelters')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {t('landing.cardSheltersDesc', 'Safe locations in your area')}
              </p>
            </div>
          </Link>

          {/* Card 3: Get Emergency Alerts */}
          <Link
            to="/citizen/safety-guide"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                {t('landing.cardAlertsTitle', 'Get Emergency Alerts')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {t('landing.cardAlertsDesc', 'Stay updated in real time')}
              </p>
            </div>
          </Link>

          {/* Card 4: Learn & Stay Safe */}
          <Link
            to="/citizen/safety-guide"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">
                {t('landing.cardSafetyTitle', 'Learn & Stay Safe')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {t('landing.cardSafetyDesc', 'Guides for floods, landslides & more')}
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. MAIN CONTENT SPLIT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: How SAHAYA Works (7 Columns) */}
          <div id="how-it-works" className="lg:col-span-7 space-y-5">
            <div className="border-b-2 border-blue-600 pb-2 inline-block">
              <h2 className="text-2xl font-black text-[#0d254c] tracking-tight">
                How SAHAYA Works
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between min-h-[140px] text-center">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-100">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">1. Request Help</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    Fill a simple form <br />(no login needed)
                  </p>
                </div>
                <div className="text-[10px] text-blue-600 font-bold mt-2">Step 01 &rarr;</div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between min-h-[140px] text-center">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-2 border border-red-100">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">2. Share Location</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    Allow GPS or enter your address
                  </p>
                </div>
                <div className="text-[10px] text-red-600 font-bold mt-2">Step 02 &rarr;</div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between min-h-[140px] text-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-100">
                  <LifeBuoy className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">3. Submit Request</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    Send to the rapid response team
                  </p>
                </div>
                <div className="text-[10px] text-emerald-600 font-bold mt-2">Step 03 &rarr;</div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between min-h-[140px] text-center">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2 border border-purple-100">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">4. Track Progress</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    Check the status of your aid anytime
                  </p>
                </div>
                <div className="text-[10px] text-purple-600 font-bold mt-2">Step 04 ✓</div>
              </div>
            </div>

            {/* Quick Action Button for Direct Help */}
            <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-xs font-bold text-blue-900">Need immediate emergency support?</p>
                <p className="text-[11px] text-blue-700">Submit a request right now in less than 2 minutes.</p>
              </div>
              <Link
                to="/citizen/create-request"
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm shrink-0 flex items-center gap-1.5"
              >
                <span>Submit Aid Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Emergency Safety Guides (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="border-b-2 border-blue-600 pb-2 inline-block">
              <h2 className="text-2xl font-black text-[#0d254c] tracking-tight">
                Emergency Safety Guides
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* Guide 1: Floods */}
              <Link
                to="/citizen/safety-guide/flood-safety"
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="h-28 bg-slate-900 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=400"
                    alt="Flood Safety"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-black text-white bg-blue-600/90 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <Droplets className="w-2.5 h-2.5" /> Floods
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                    Safety tips & what to do &rarr;
                  </span>
                </div>
              </Link>

              {/* Guide 2: Landslides */}
              <Link
                to="/citizen/safety-guide/landslide-safety"
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="h-28 bg-slate-900 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=400"
                    alt="Landslide Safety"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-black text-white bg-red-600/90 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <Mountain className="w-2.5 h-2.5" /> Landslides
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition">
                    Warning signs & safety &rarr;
                  </span>
                </div>
              </Link>

              {/* Guide 3: Fires */}
              <Link
                to="/citizen/safety-guide/fire-safety"
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="h-28 bg-slate-900 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400"
                    alt="Fire Safety"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-black text-white bg-amber-600/90 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5" /> Fires
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition">
                    Prevention & response &rarr;
                  </span>
                </div>
              </Link>

            </div>
          </div>

        </div>

        {/* 5. ABOUT SAHAYA FULL-WIDTH BANNER */}
        <div id="about" className="p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20 font-bold text-xl">
              i
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-blue-950">
                About SAHAYA
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
                SAHAYA is a disaster management platform that connects people in need with rapid humanitarian support, safety information, and emergency resources during disasters in Sri Lanka.
              </p>
            </div>
          </div>

          <Link
            to="/citizen/safety-guide"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 transition flex items-center gap-2 shadow-2xs shrink-0"
          >
            <span>Learn More About Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer id="contact" className="mt-auto bg-[#0d254c] text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <SahayaLogo size="md" light={true} showText={true} showTagline={true} />
              <p className="text-xs text-slate-400 leading-relaxed">
                National Disaster Management & Humanitarian Aid Command Platform. Unifying aid efforts across Sri Lanka.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/citizen/create-request" className="hover:text-teal-400">Request Emergency Aid</Link></li>
                <li><Link to="/shelters" className="hover:text-teal-400">Safe Shelters Directory</Link></li>
                <li><Link to="/citizen/safety-guide" className="hover:text-teal-400">Disaster Safety Guides</Link></li>
                <li><Link to="/donations" className="hover:text-teal-400">Support Relief Campaigns</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Portals</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-teal-400">Citizen Sign In</Link></li>
                <li><Link to="/register" className="hover:text-teal-400">Citizen Registration</Link></li>
                <li><Link to="/login" className="hover:text-teal-400">Officer & Volunteer Access</Link></li>
                <li><Link to="/citizen/safety-guide" className="hover:text-teal-400">Public Early Warnings</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">National Hotlines</h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                  <span>DMC Disaster Hotline: <strong>117</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Suwa Seriya Ambulance: <strong>1990</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  <span>Police Emergency: <strong>119</strong></span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 SAHAYA Disaster Management Platform. Built for humanitarian resilience.</p>
            <p>Sri Lanka Emergency Services Integration</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
