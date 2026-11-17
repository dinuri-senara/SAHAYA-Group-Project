import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  PhoneCall,
  PlusCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Share2,
  CheckSquare,
  Square,
  Info
} from 'lucide-react';
import { DISASTER_GUIDES, UI_TRANSLATIONS, DisasterGuide } from '../data/safetyGuideData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { PageHeader } from '../components/PageHeader';

export const SafetyGuideDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const guide = DISASTER_GUIDES.find((g) => g.id === id);

  if (!guide) {
    return <Navigate to="/citizen/safety-guide" replace />;
  }

  const t = UI_TRANSLATIONS;

  const toggleChecklist = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Page Header with Back Link & Language Switcher */}
      <PageHeader
        title={guide.title[language]}
        subtitle={guide.shortDescription[language]}
        portalBadge={t.portalBadge[language]}
        breadcrumbs={[
          { label: t.backToDashboard[language], path: '/citizen/dashboard' },
          { label: t.pageTitle[language], path: '/citizen/safety-guide' },
          { label: guide.title[language] },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/citizen/safety-guide"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700 font-bold text-xs shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.backToGuides[language]}</span>
            </Link>
            <LanguageSwitcher variant="pill" />
          </div>
        }
      />

      {/* Prominent Educational Hero Illustration & Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Large Visual Illustration */}
          <div className="lg:col-span-7 relative aspect-4/3 sm:aspect-16/10 lg:aspect-auto min-h-[320px] bg-slate-900 overflow-hidden">
            <img
              src={guide.image}
              alt={guide.imageAlt[language]}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('.jpg')) {
                  target.src = guide.image.replace('.webp', '.jpg');
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 right-4 text-white lg:hidden">
              <span className="text-xs font-medium text-slate-300">
                {language === 'en' ? 'Verified Educational Visual' : 'තහවුරු කළ අධ්‍යාපනික රූප සටහන'}
              </span>
            </div>
          </div>

          {/* Guide Introduction & Action Callout */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    guide.urgencyLevel === 'Critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : guide.urgencyLevel === 'High'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-teal-100 text-teal-800 border border-teal-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {guide.urgencyLevel} Priority
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {language === 'en' ? guide.title.si : guide.title.en}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {guide.title[language]}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                {guide.introduction[language]}
              </p>
            </div>

            {/* Quick Request Assistance Banner within this guide */}
            <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-950 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-teal-900">
                <PlusCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{t.requestAidCardTitle[language]}</span>
              </div>
              <p className="text-xs text-teal-800 leading-relaxed">
                {t.requestAidCardDesc[language]}
              </p>
              <Link
                to="/request/new"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <span>{t.submitRequestBtn[language]}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Visual Action Guide (Numbered cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span>{t.stepByStepVisualTitle[language]}</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {guide.visualSteps.length} {language === 'en' ? 'Core Steps' : 'මූලික පියවර'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guide.visualSteps.map((vStep) => (
            <div
              key={vStep.stepNumber}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {vStep.stepNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                    {vStep.badge[language]}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {vStep.title[language]}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {vStep.description[language]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Stages: Before, During, After */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          <span>
            {language === 'en'
              ? 'Complete Action Timeline: Before, During & After'
              : 'සම්පූර්ණ කාලරාමුව: ආපදාවට පෙර, අතරතුර සහ පසුව'}
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Before Stage (if applicable) */}
          {guide.beforeStage && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/80 mb-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{guide.beforeStage.heading[language]}</span>
                </div>
                <ul className="space-y-3 mt-2">
                  {guide.beforeStage.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step[language]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* During Stage */}
          <div className="bg-white rounded-2xl p-6 border-2 border-teal-500 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-3">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>{guide.duringStage.heading[language]}</span>
              </div>
              <ul className="space-y-3 mt-2">
                {guide.duringStage.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 font-medium leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step[language]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* After Stage (if applicable) */}
          {guide.afterStage && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{guide.afterStage.heading[language]}</span>
                </div>
                <ul className="space-y-3 mt-2">
                  {guide.afterStage.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step[language]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Do's and Don'ts Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span>{t.dosAndDontsTitle[language]}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recommended Do's */}
          <div className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{t.dosHeading[language]}</span>
            </h3>
            <ul className="space-y-3">
              {guide.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-emerald-900 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item[language]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dangerous Don'ts */}
          <div className="bg-rose-50/60 rounded-3xl p-6 border border-rose-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-rose-950 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>{t.dontsHeading[language]}</span>
            </h3>
            <ul className="space-y-3">
              {guide.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-rose-900 leading-relaxed">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{item[language]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Preparation Checklist */}
      {guide.checklist.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-teal-600" />
                <span>{t.checklistTitle[language]}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en'
                  ? 'Check off items as you verify or pack them in your home'
                  : 'ඔබ සූදානම් කරගත් ද්‍රව්‍ය සටහන් කරගැනීමට ලකුණු කරන්න'}
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
              {Object.values(checkedItems).filter(Boolean).length} / {guide.checklist.length} {language === 'en' ? 'Checked' : 'සම්පූර්ණයි'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guide.checklist.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-teal-50/70 border-teal-300 text-slate-900'
                      : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="mt-0.5 shrink-0 text-teal-600">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </span>
                  <div>
                    <p className={`text-xs font-bold ${isChecked ? 'line-through text-teal-900' : ''}`}>
                      {item.text[language]}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.tip[language]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* When and How to Seek Help & Hotlines */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.whenToSeekHelpTitle[language]}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {guide.whenToSeekHelp[language]}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          {guide.officialHotlines.map((hotline, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4"
            >
              <div>
                <h4 className="text-xs font-extrabold text-white">
                  {hotline.name[language]}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {hotline.description[language]}
                </p>
              </div>
              <a
                href={`tel:${hotline.number.replace(/\s+/g, '')}`}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shrink-0 transition"
              >
                {hotline.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation & Return Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <Link
          to="/citizen/safety-guide"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToGuides[language]}</span>
        </Link>
        <Link
          to="/request/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.submitRequestBtn[language]}</span>
        </Link>
      </div>
    </div>
  );
};
