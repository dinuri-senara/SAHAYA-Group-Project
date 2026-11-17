import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../data/safetyGuideData';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'sahaya_preferred_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'si') {
        return saved;
      }
    } catch {
      // localStorage may fail in private mode or test environments
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not persist language to localStorage', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'si' : 'en');
  };

  useEffect(() => {
    // Update HTML lang attribute for accessibility & screen readers
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a safe fallback for isolated unit tests or components rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      toggleLanguage: () => {},
    };
  }
  return context;
};
