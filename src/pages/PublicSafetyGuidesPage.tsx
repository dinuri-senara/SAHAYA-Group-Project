import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  ShieldAlert,
  Search,
  BookOpen,
  ArrowRight,
  PhoneCall,
  Lock,
  Globe,
  AlertTriangle,
  Compass,
  Droplets,
  Mountain,
  Flame,
  Wind,
  HeartPulse,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DISASTER_GUIDES, UI_TRANSLATIONS, DisasterGuide } from '../data/safetyGuideData';
import { useLanguage } from '../context/LanguageContext';
import { SahayaLogo } from '../components/SahayaLogo';

export const PublicSafetyGuidesPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const t = UI_TRANSLATIONS;

  // Filter and search logic with bilingual match
  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DISASTER_GUIDES.filter((guide) => {
      if (selectedFilter !== 'all') {
        if (selectedFilter === 'water' && guide.categoryType !== 'water') return false;
        if (selectedFilter === 'geological' && guide.categoryType !== 'geological') return false;
        if (selectedFilter === 'fire' && guide.categoryType !== 'fire') return false;
        if (selectedFilter === 'weather' && guide.categoryType !== 'weather') return false;
        if (selectedFilter === 'health' && guide.categoryType !== 'health') return false;
      }

      if (!q) return true;

      const matchTitleEn = guide.title.en.toLowerCase().includes(q);
      const matchTitleSi = guide.title.si.toLowerCase().includes(q);
      const matchDescEn = guide.shortDescription.en.toLowerCase().includes(q);
      const matchDescSi = guide.shortDescription.si.toLowerCase().includes(q);
      const matchTagsEn = guide.tags.en.some((tag) => tag.toLowerCase().includes(q));
      const matchTagsSi = guide.tags.si.some((tag) => tag.toLowerCase().includes(q));

      return matchTitleEn || matchTitleSi || matchDescEn || matchDescSi || matchTagsEn || matchTagsSi;
    });
  }, [searchQuery, selectedFilter]);

  const filterOptions = [
    { id: 'all', label: language === 'en' ? 'All Disasters' : 'සියලුම ආපදා' },
    { id: 'water', label: language === 'en' ? 'Floods & Water' : 'ගංවතුර සහ ජලය' },
    { id: 'geological', label: language === 'en' ? 'Landslides' : 'නායයෑම්' },
    { id: 'fire', label: language === 'en' ? 'Fires' : 'ගිනි ගැනීම්' },
    { id: 'weather', label: language === 'en' ? 'Severe Weather' : 'දැඩි කාලගුණය' },
    { id: 'health', label: language === 'en' ? 'Health & First Aid' : 'සෞඛ්‍ය හා ප්‍රථමාධාර' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVBAR (Clean Public Header) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <SahayaLogo size="md" light={false} showText={true} showTagline={true} />
          </Link>

          {/* Right Controls: Back to Home & Login */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition flex items-center gap-1.5 shadow-2xs"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/login"
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0d254c] hover:bg-[#153a75] shadow-md shadow-blue-950/20 transition hover:shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* 2. BREADCRUMB & HERO BANNER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <Link to="/" className="hover:text-slate-900 transition">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-slate-900 font-bold">Disaster Safety Guides</span>
        </div>

        {/* Hero Banner with Search */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d254c] via-[#103163] to-[#0a1e3f] text-white p-6 sm:p-10 shadow-xl border border-blue-900/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-md">
              <ShieldAlert className="w-4 h-4 text-teal-400" />
              <span>
                {language === 'en'
                  ? 'Official Disaster Management & Community Safety'
                  : 'නිල ආපදා කළමනාකරණ හා ප්‍රජා ආරක්ෂණ මාර්ගෝපදේශ'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {language === 'en'
                ? 'Disaster Safety & Life Protection Guides'
                : 'ආපදා ආරක්ෂාව සහ ජීවිත සුරැකීමේ මාර්ගෝපදේශ'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {language === 'en'
                ? 'Practical, step-by-step verified action guides before, during, and after natural hazards across Sri Lanka. Free and publicly accessible to protect yourself and your loved ones.'
                : 'ශ්‍රී ලංකාවේ ඇතිවන ස්වාභාවික ආපදාවලට පෙර, අතරතුර සහ පසුව ක්‍රියාකළ යුතු ආකාරය පිළිබඳ සරල උපදෙස් මාලාව. ඔබගේ සහ පවුලේ ආරක්ෂාව සඳහා සම්පූර්ණයෙන්ම නොමිලේ ලබාගත හැක.'}
            </p>

            {/* Public Search Input */}
            <div className="pt-2 max-w-xl">
              <div className="relative bg-white rounded-2xl p-1.5 shadow-2xl flex items-center border border-slate-200">
                <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Search flood, landslide, fire safety tips...'
                      : 'ගංවතුර, නායයෑම්, ගිනි ආරක්ෂක උපදෙස් සොයන්න...'
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 mr-2"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedFilter(opt.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFilter === opt.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 4. DISASTER GUIDES GRID (PUBLIC VIEW) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="h-44 bg-slate-900 relative overflow-hidden">
                  <img
                    src={guide.image}
                    alt={guide.imageAlt[language]}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to high-res disaster photography if local illustration missing
                      const fallback =
                        guide.id === 'flood-safety'
                          ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=600'
                          : guide.id === 'landslide-safety'
                          ? 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600'
                          : guide.id === 'fire-safety'
                          ? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600'
                          : 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&q=80&w=600';
                      (e.target as any).src = fallback;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs ${
                        guide.urgencyLevel === 'Critical'
                          ? 'bg-rose-600'
                          : guide.urgencyLevel === 'High'
                          ? 'bg-amber-600'
                          : 'bg-blue-600'
                      }`}
                    >
                      {guide.urgencyLevel}
                    </span>
                  </div>

                  <span className="absolute bottom-3 left-3 text-sm font-black text-white drop-shadow-md">
                    {guide.title[language]}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {guide.shortDescription[language]}
                  </p>

                  {/* Immediate Action Steps Preview */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {language === 'en' ? 'Critical Action Point:' : 'ප්‍රමුඛ ක්‍රියාමාර්ගය:'}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {guide.duringStage.steps[0] ? guide.duringStage.steps[0][language] : guide.introduction[language]}
                    </p>
                  </div>

                  {/* Hotline pill */}
                  {guide.officialHotlines && guide.officialHotlines.length > 0 && (
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <PhoneCall className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="text-slate-500 text-[11px]">
                        {guide.officialHotlines[0].name[language]}:
                      </span>
                      <strong className="text-slate-900 font-mono">
                        {guide.officialHotlines[0].number}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-5 pt-0">
                <Link
                  to="/login?redirect=/citizen/safety-guide"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 group"
                >
                  <span>{language === 'en' ? 'Sign in for Full Checklist & PDF' : 'සම්පූර්ණ උපදෙස් හා PDF සඳහා Login වන්න'}</span>
                  <Lock className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 6. CLEAN PUBLIC FOOTER */}
      <footer className="mt-auto bg-[#0d254c] text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-3">
            <SahayaLogo size="sm" light={true} showText={true} />
            <span className="hidden sm:inline">| Public Disaster Resilience Portal</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/emergency/request" className="hover:text-white">Request Emergency Aid</Link>
            <Link to="/emergency/track" className="hover:text-white">Track Rescue</Link>
            <Link to="/login" className="hover:text-white">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
