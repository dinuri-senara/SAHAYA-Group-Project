import React from 'react';
import { Languages, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'compact' | 'full';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-white text-teal-700 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-pressed={language === 'en'}
          title="Switch to English"
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage('si')}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            language === 'si'
              ? 'bg-teal-600 text-white shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-pressed={language === 'si'}
          title="සිංහල භාෂාවට මාරු වන්න"
        >
          සිංහල
        </button>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selection / භාෂාව තෝරාගැනීම"
      className={`inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/5 border border-slate-200/80 shadow-2xs backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-1.5 pl-2 pr-1 text-xs font-semibold text-slate-500 hidden sm:flex">
        <Languages className="w-4 h-4 text-teal-600" />
        <span className="text-[11px] uppercase tracking-wider">Language</span>
      </div>

      <button
        type="button"
        id="lang-select-en"
        onClick={() => setLanguage('en')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 ring-1 ring-slate-900/5'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        }`}
        aria-pressed={language === 'en'}
      >
        <span>English</span>
        {language === 'en' && <Check className="w-3.5 h-3.5 text-teal-600 stroke-[3]" />}
      </button>

      <button
        type="button"
        id="lang-select-si"
        onClick={() => setLanguage('si')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          language === 'si'
            ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        }`}
        aria-pressed={language === 'si'}
      >
        <span>සිංහල</span>
        {language === 'si' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
      </button>
    </div>
  );
};
