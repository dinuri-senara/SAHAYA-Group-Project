import React, { useState, useEffect, useRef } from 'react';
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
  Mountain,
  Compass,
  Shield,
  HeartPulse,
  Phone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SahayaLogo } from '../components/SahayaLogo';

export const LandingPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('home');
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);

  // Track active section on scroll (Scroll Spy)
  useEffect(() => {
    // Check initial hash on load
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && ['home', 'safety-guides', 'how-it-works', 'about', 'contact'].includes(initialHash)) {
      setActiveSection(initialHash);
    }

    const handleScroll = () => {
      // Do not override if user just clicked a nav item and is animating/scrolling
      if (isClickingRef.current) return;

      // Near top of page
      if (window.scrollY < 120) {
        setActiveSection('home');
        return;
      }

      // Check sections from bottom to top (contact -> about -> how-it-works -> safety-guides)
      const mainSections = ['contact', 'about', 'how-it-works', 'safety-guides'];
      for (const id of mainSections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240 && rect.bottom >= 100) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'safety-guides', label: 'Safety Guides', href: '#safety-guides' },
    { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveSection(id);
    // Lock scroll spy listener for 900ms while smooth scrolling to target
    isClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = window.setTimeout(() => {
      isClickingRef.current = false;
    }, 900);

    if (id === 'home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Official SAHAYA Logo */}
          <Link
            to="/"
            onClick={() => {
              setActiveSection('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group"
          >
            <SahayaLogo size="md" light={false} showText={true} showTagline={true} />
          </Link>

          {/* Center Navigation Links with Dynamic Active Indicator */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`pb-0.5 border-b-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-blue-700 font-extrabold border-blue-700'
                      : 'text-slate-600 hover:text-blue-700 border-transparent'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
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
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-white/[0.08] hover:bg-slate-200/80 dark:hover:bg-white/[0.15] border border-slate-200/80 dark:border-white/10 transition shadow-2xs"
            >
              Login
            </Link>

            {/* Sign Up Button */}
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white theme-btn-primary shadow-md shadow-blue-950/20 transition hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER SECTION (Matching Image 2 with Vivid Rescue Photography) */}
      <section id="home" className="relative overflow-hidden bg-[#0b1e3b] text-white min-h-[460px] lg:min-h-[520px] flex items-center scroll-mt-28">
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
              <span>Emergency Assistance</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Help When You <br />
              <span className="text-[#ef4444]">Need It Most.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-xl">
              Request emergency assistance, get safety information, and stay connected during disasters across Sri Lanka.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/emergency/request"
                className="px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm text-white bg-[#ef4444] hover:bg-[#dc2626] shadow-lg shadow-red-600/30 hover:shadow-xl transition-all flex items-center gap-2.5 cursor-pointer group"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
                <span>Request Emergency Aid (No Login)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/emergency/track"
                className="px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Track Request Status</span>
              </Link>

              <Link
                to="/safety-guides"
                className="px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Safety Guides</span>
              </Link>
            </div>

            {/* No Account Required Note */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 pt-1">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>No account or login required for emergency aid requests</span>
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
            to="/emergency/request"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
                Request Help
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Food, water, medical, or rescue (No Login)
              </p>
            </div>
          </Link>

          {/* Card 2: Find Nearby Shelters */}
          <Link
            to="/public-shelters"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                Find Nearby Shelters
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Safe locations in your area
              </p>
            </div>
          </Link>

          {/* Card 3: Get Emergency Alerts */}
          <Link
            to="/alerts"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                Get Emergency Alerts
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Stay updated in real time
              </p>
            </div>
          </Link>

          {/* Card 4: Learn & Stay Safe */}
          <Link
            to="/safety-guides"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-teal-100 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 dark:text-blue-400 transition-colors">
                Learn & Stay Safe
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Guides for floods, landslides & more
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. MAIN CONTENT SECTIONS (Arranged in exact Top-Navbar sequence: Safety Guides -> How It Works -> About) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-20">

        {/* SECTION 1: EMERGENCY SAFETY GUIDES (Matching 1st Navbar Link) */}
        <div id="safety-guides" className="space-y-6 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0d254c] tracking-tight">
                Emergency Safety Guides
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Essential disaster preparedness, survival tips, and evacuation protocols across Sri Lanka.
              </p>
            </div>
            <Link
              to="/safety-guides"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 hover:text-blue-900 transition shrink-0 group"
            >
              <span>View All Safety Guides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3 Featured Public Disaster Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Guide 1: Floods */}
            <Link
              to="/safety-guides"
              className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-900 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=600"
                    alt="Flood Safety"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-rose-600 shadow-xs flex items-center gap-1">
                    <Droplets className="w-2.5 h-2.5" /> Floods
                  </span>
                  <span className="absolute bottom-3 left-3 text-sm font-black text-white">
                    Flood Safety &amp; Evacuation
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Move to high ground immediately, disconnect home electrical mains, and never attempt to walk or drive through flowing floodwaters.
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0 text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>Read safety tips &amp; what to do</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Guide 2: Landslides */}
            <Link
              to="/safety-guides"
              className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-900 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600"
                    alt="Landslide Safety"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-amber-600 shadow-xs flex items-center gap-1">
                    <Mountain className="w-2.5 h-2.5" /> Landslides
                  </span>
                  <span className="absolute bottom-3 left-3 text-sm font-black text-white">
                    Hill Country Landslide Alerts
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Recognize early warning signs such as sudden spring water emergence, tilting trees, or door jams, and evacuate slope perimeters at once.
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0 text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>Warning signs &amp; action guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Guide 3: Fires */}
            <Link
              to="/safety-guides"
              className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-900 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"
                    alt="Fire Safety"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-red-600 shadow-xs flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5" /> Fires
                  </span>
                  <span className="absolute bottom-3 left-3 text-sm font-black text-white">
                    Structural &amp; Wildfire Safety
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Stay low under heavy smoke, cover nose with damp cloth, test doors before opening, and dial national emergency services (119/110) immediately.
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0 text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>Prevention &amp; emergency response</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>


        </div>

        {/* SECTION 2: HOW SAHAYA WORKS (Matching 2nd Navbar Link) */}
        <div id="how-it-works" className="space-y-6 scroll-mt-28">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0d254c] tracking-tight">
              How SAHAYA Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Simple 4-step emergency coordination connecting stranded citizens with rapid disaster response units.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between text-center relative group hover:border-blue-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block mb-1">Step 01</span>
                <h4 className="text-sm font-black text-slate-900">Request Help</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Fill a simple distress form without needing to create an account.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between text-center relative group hover:border-red-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 border border-red-100">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block mb-1">Step 02</span>
                <h4 className="text-sm font-black text-slate-900">Share Location</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Tap "Use My GPS" or pin your exact location on the interactive map.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between text-center relative group hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                <LifeBuoy className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">Step 03</span>
                <h4 className="text-sm font-black text-slate-900">Submit Request</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Distress signal routes directly to District Crisis Command Hubs.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between text-center relative group hover:border-purple-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 border border-purple-100">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block mb-1">Step 04</span>
                <h4 className="text-sm font-black text-slate-900">Track Progress</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Receive your Tracking Code to follow rescue dispatch in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: ABOUT SAHAYA (Matching 3rd Navbar Link) */}
        <div id="about" className="space-y-4 scroll-mt-28">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0d254c] tracking-tight">
              About SAHAYA
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Connecting Communities. Coordinating Hope.
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-4xl">
            <p>
              SAHAYA is an AI-powered humanitarian aid coordination platform dedicated to supporting communities during emergencies and natural disasters. It brings together affected individuals, volunteers, shelters, donors, and relief organizations through one connected platform.
            </p>
            <p>
              By simplifying emergency assistance requests, improving resource coordination, and supporting faster response efforts, SAHAYA helps ensure that people in need receive the right assistance at the right time. Our mission is to strengthen collaboration, empower communities, and build a safer, more resilient future for everyone.
            </p>
          </div>
        </div>

        {/* SECTION 4: NATIONAL EMERGENCY HOTLINES & CONTACTS (Matching 4th Navbar Link) */}
        <div id="contact" className="space-y-6 scroll-mt-28">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0d254c] tracking-tight">
              Emergency Hotlines &amp; Contacts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Click or tap any number below to call official emergency services in Sri Lanka directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. DMC */}
            <a
              href="tel:117"
              className="p-5 rounded-2xl bg-white border border-red-200/90 shadow-xs hover:shadow-md hover:border-red-400 hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-red-700 bg-red-50 border border-red-200">
                  24/7 Hotline
                </span>
              </div>
              <div className="my-3">
                <span className="text-xs font-bold text-slate-500 block">Disaster Management Centre</span>
                <span className="text-2xl font-black text-red-600 tracking-tight">117</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600 group-hover:translate-x-0.5 transition-transform">
                <span>DMC Emergency</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* 2. Suwa Seriya */}
            <a
              href="tel:1990"
              className="p-5 rounded-2xl bg-white border border-emerald-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200">
                  Free Ambulance
                </span>
              </div>
              <div className="my-3">
                <span className="text-xs font-bold text-slate-500 block">Suwa Seriya Ambulance</span>
                <span className="text-2xl font-black text-emerald-600 tracking-tight">1990</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                <span>Medical Emergency</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* 3. Police */}
            <a
              href="tel:119"
              className="p-5 rounded-2xl bg-white border border-blue-200/90 shadow-xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-blue-700 bg-blue-50 border border-blue-200">
                  Police
                </span>
              </div>
              <div className="my-3">
                <span className="text-xs font-bold text-slate-500 block">Police Emergency Unit</span>
                <span className="text-2xl font-black text-blue-600 tracking-tight">119</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                <span>Security &amp; Rescue</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* 4. Fire & Rescue */}
            <a
              href="tel:110"
              className="p-5 rounded-2xl bg-white border border-orange-200/90 shadow-xs hover:shadow-md hover:border-orange-400 hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:scale-105 transition-transform">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-orange-700 bg-orange-50 border border-orange-200">
                  Fire &amp; Rescue
                </span>
              </div>
              <div className="my-3">
                <span className="text-xs font-bold text-slate-500 block">Fire Emergency Service</span>
                <span className="text-2xl font-black text-orange-600 tracking-tight">110</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                <span>Fire &amp; Accident</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="mt-auto bg-[#0d254c] text-slate-300 border-t border-slate-800">
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
                <li><Link to="/emergency/request" className="hover:text-blue-400 dark:text-blue-300">Request Emergency Aid</Link></li>
                <li><Link to="/public-shelters" className="hover:text-blue-400 dark:text-blue-300">Safe Shelters Directory</Link></li>
                <li><Link to="/alerts" className="hover:text-blue-400 dark:text-blue-300">Live Disaster Alerts</Link></li>
                <li><Link to="/safety-guides" className="hover:text-blue-400 dark:text-blue-300">Disaster Safety Guides</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Portals</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-blue-400 dark:text-blue-300">Citizen Sign In</Link></li>
                <li><Link to="/register" className="hover:text-blue-400 dark:text-blue-300">Citizen Registration</Link></li>
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
