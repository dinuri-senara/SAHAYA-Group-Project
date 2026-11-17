import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  BookOpen,
  ArrowRight,
  PhoneCall,
  PlusCircle,
  Sparkles,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { DISASTER_GUIDES, UI_TRANSLATIONS, DisasterGuide } from '../data/safetyGuideData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { PageHeader } from '../components/PageHeader';

export const SafetyGuidePage: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const t = UI_TRANSLATIONS;

  // Filter and search logic with bilingual match
  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DISASTER_GUIDES.filter((guide) => {
      // Category filter match
      if (selectedFilter !== 'all') {
        if (selectedFilter === 'water' && guide.categoryType !== 'water') return false;
        if (selectedFilter === 'geological' && guide.categoryType !== 'geological') return false;
        if (selectedFilter === 'weather' && guide.categoryType !== 'weather') return false;
        if (selectedFilter === 'preparedness' && guide.categoryType !== 'preparedness') return false;
        if (selectedFilter === 'health' && guide.categoryType !== 'health') return false;
      }

      // If no search query, return true
      if (!q) return true;

      // Search matches English or Sinhala titles, descriptions, and tags
      const matchTitleEn = guide.title.en.toLowerCase().includes(q);
      const matchTitleSi = guide.title.si.toLowerCase().includes(q);
      const matchDescEn = guide.shortDescription.en.toLowerCase().includes(q);
      const matchDescSi = guide.shortDescription.si.toLowerCase().includes(q);
      const matchTagsEn = guide.tags.en.some(tag => tag.toLowerCase().includes(q));
      const matchTagsSi = guide.tags.si.some(tag => tag.toLowerCase().includes(q));

      return matchTitleEn || matchTitleSi || matchDescEn || matchDescSi || matchTagsEn || matchTagsSi;
    });
  }, [searchQuery, selectedFilter]);

  const filterOptions = [
    { id: 'all', label: t.filterAll[language] },
    { id: 'water', label: t.filterWater[language] },
    { id: 'geological', label: t.filterGeological[language] },
    { id: 'weather', label: t.filterWeather[language] },
    { id: 'preparedness', label: t.filterPreparedness[language] },
    { id: 'health', label: t.filterHealth[language] },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Page Header with Breadcrumbs & Language Switcher */}
      <PageHeader
        title={t.pageTitle[language]}
        subtitle={t.pageSubtitle[language]}
        portalBadge={t.portalBadge[language]}
        breadcrumbs={[
          { label: t.backToDashboard[language], path: '/citizen/dashboard' },
          { label: t.pageTitle[language] },
        ]}
        actions={<LanguageSwitcher variant="pill" />}
      />

      {/* Hero Educational Alert & Quick Hotline Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-800/40">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <ShieldAlert className="w-4 h-4 text-teal-400" />
              <span>{language === 'en' ? 'Community Safety & Life Protection' : 'ප්‍රජා ආරක්ෂාව සහ ජීවිත සුරැකීම'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {language === 'en'
                ? 'Practical Disaster Guidance with Visual Illustrations'
                : 'පින්තූර සහ සරල උපදෙස් සහිත ප්‍රායෝගික ආපදා මාර්ගෝපදේශ'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {language === 'en'
                ? 'Choose a category below to access step-by-step actions before, during, and after disasters. Available in both English and Sinhala for every citizen.'
                : 'ආපදාවකට පෙර, අතරතුර සහ පසුව ක්‍රියාකළ යුතු ආකාරය පියවරෙන් පියවර දැනගැනීමට පහතින් අදාළ මාතෘකාව තෝරන්න. සෑම පුරවැසියෙකු සඳහාම සිංහල සහ ඉංග්‍රීසි භාෂා දෙකෙන්ම ලබාගත හැකිය.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <Link
              to="/request/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.submitRequestBtn[language]}</span>
            </Link>
            <a
              href="tel:117"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>DMC 117</span>
            </a>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            id="safety-guide-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder[language]}
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === filter.id
                  ? 'bg-teal-600 text-white shadow-xs font-extrabold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            {t.resultsCount[language]} <strong className="text-slate-800">{filteredGuides.length}</strong> {t.guidesWord[language]}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-teal-600 hover:text-teal-700 font-semibold cursor-pointer"
            >
              {t.resetSearch[language]}
            </button>
          )}
        </div>
      </div>

      {/* Grid of Disaster Guide Cards */}
      {filteredGuides.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{t.noResultsTitle[language]}</h3>
          <p className="text-xs text-slate-500 mt-1">{t.noResultsDesc[language]}</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="mt-5 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition cursor-pointer"
          >
            {t.resetSearch[language]}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Image Container with Fallback */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={guide.image}
                  alt={guide.imageAlt[language]}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to .jpg counterpart if browser prefers
                    const target = e.currentTarget;
                    if (!target.src.endsWith('.jpg')) {
                      target.src = guide.image.replace('.webp', '.jpg');
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

                {/* Urgency Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                      guide.urgencyLevel === 'Critical'
                        ? 'bg-rose-600 text-white'
                        : guide.urgencyLevel === 'High'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-teal-600 text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {guide.urgencyLevel}
                  </span>
                </div>

                {/* Bottom Overlay Title in Image */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <h3 className="text-lg font-black tracking-tight leading-snug drop-shadow-sm">
                    {guide.title[language]}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium opacity-90">
                    {language === 'en' ? guide.title.si : guide.title.en}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {guide.shortDescription[language]}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {guide.visualSteps.length} {language === 'en' ? 'Action Steps' : 'පියවර'}
                  </span>
                  <Link
                    to={`/citizen/safety-guide/${guide.id}`}
                    id={`view-guide-${guide.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-bold text-xs transition-all group-hover:shadow-xs cursor-pointer"
                  >
                    <span>{t.viewGuideBtn[language]}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verified Official Resources & Hotlines Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-teal-600" />
              <span>{t.emergencyHotlinesSection[language]}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Official 24/7 Sri Lankan national emergency telephone numbers'
                : 'ශ්‍රී ලංකා ජාතික හදිසි ආපදා දුරකථන අංක (පැය 24 පුරා නොමිලේ)'}
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            {language === 'en' ? 'Verified Government Services' : 'තහවුරු කළ රාජ්‍ය සේවාවන්'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 font-black text-sm">
              117
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                {language === 'en' ? 'Disaster Management Centre' : 'ආපදා කළමනාකරණ මධ්‍යස්ථානය'}
              </h4>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {language === 'en' ? 'Floods, cyclones, tsunami alerts' : 'ගංවතුර, කුණාටු, සුනාමි ආපදා'}
              </p>
              <a href="tel:117" className="text-xs font-extrabold text-amber-700 hover:underline mt-1 inline-block">
                Dial 117
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 font-black text-sm">
              1990
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">
                {language === 'en' ? 'Suwa Seriya Ambulance' : '1990 සුවසැරිය ගිලන්රථය'}
              </h4>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                {language === 'en' ? 'Free pre-hospital emergency medical care' : 'නොමිලේ හදිසි වෛද්‍ය ප්‍රතිකාර'}
              </p>
              <a href="tel:1990" className="text-xs font-extrabold text-emerald-700 hover:underline mt-1 inline-block">
                Dial 1990
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 font-black text-sm">
              110
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950">
                {language === 'en' ? 'Fire & Rescue Service' : 'ගිනි නිවීමේ සේවාව'}
              </h4>
              <p className="text-[11px] text-rose-800 mt-0.5">
                {language === 'en' ? 'Structural fires and vehicle extrication' : 'ගිනි අනතුරු සහ හදිසි මුදාගැනීම්'}
              </p>
              <a href="tel:110" className="text-xs font-extrabold text-rose-700 hover:underline mt-1 inline-block">
                Dial 110
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 font-black text-sm">
              119
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-950">
                {language === 'en' ? 'Police Emergency' : 'ශ්‍රී ලංකා පොලිස් හදිසි ඇමතුම්'}
              </h4>
              <p className="text-[11px] text-blue-800 mt-0.5">
                {language === 'en' ? 'Law enforcement and missing persons' : 'නීතිය ක්‍රියාත්මක කිරීම හා මහජන ආරක්ෂාව'}
              </p>
              <a href="tel:119" className="text-xs font-extrabold text-blue-700 hover:underline mt-1 inline-block">
                Dial 119
              </a>
            </div>
          </div>
        </div>

        {/* Public Safety & Educational Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-3 text-xs leading-relaxed">
          <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">{t.educationalDisclaimerTitle[language]}</p>
            <p className="mt-0.5 text-slate-600">{t.educationalDisclaimerDesc[language]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
