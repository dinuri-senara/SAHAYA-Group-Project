import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'si';

// Comprehensive dictionary for all system navigation, actions, status, and alerts
export const UI_TRANSLATIONS: Record<string, { en: string; si: string }> = {
  // Navigation / Roles
  'nav.home': { en: 'Home', si: 'මුල් පිටුව' },
  'nav.safetyGuides': { en: 'Safety Guides', si: 'ආරක්ෂිත මාර්ගෝපදේශ' },
  'nav.howItWorks': { en: 'How It Works', si: 'ක්‍රියාකාරීත්වය' },
  'nav.about': { en: 'About Us', si: 'අප ගැන' },
  'nav.contact': { en: 'Contact Support', si: 'හදිසි ඇමතුම්' },
  'nav.login': { en: 'Login', si: 'පිවිසෙන්න' },
  'nav.signUp': { en: 'Sign Up', si: 'ලියාපදිංචි වන්න' },
  'nav.logout': { en: 'Sign Out', si: 'පද්ධතියෙන් ඉවත් වන්න' },
  'nav.profile': { en: 'Profile & History', si: 'පැතිකඩ සහ ඉතිහාසය' },
  'nav.darkMode': { en: 'Dark Theme', si: 'අඳුරු තේමාව' },
  'nav.lightMode': { en: 'Light Theme', si: 'දීප්තිමත් තේමාව' },

  // Sidebar items
  'sidebar.citizenDashboard': { en: 'My Assistance Portal', si: 'මගේ සහන පෝර්ටලය' },
  'sidebar.submitSos': { en: 'Submit Aid Request (SOS)', si: 'හදිසි ආධාර ඉල්ලීම (SOS)' },
  'sidebar.shelters': { en: 'Nearby Safe Shelters', si: 'ආසන්න ආරක්ෂිත කඳවුරු' },
  'sidebar.safetyGuide': { en: 'Crisis Safety Guides', si: 'ආපදා ආරක්ෂක උපදෙස්' },
  'sidebar.coordinatorHub': { en: 'Coordinator Command Hub', si: 'සම්බන්ධීකාරක මෙහෙයුම් මැදිරිය' },
  'sidebar.aiTriage': { en: 'Explainable AI Triage', si: 'AI ප්‍රමුඛතා නිර්දේශ' },
  'sidebar.incidents': { en: 'Crisis Incidents Registry', si: 'ආපදා සිදුවීම් ලේඛනය' },
  'sidebar.resources': { en: 'Resource Allocation Depot', si: 'සම්පත් හා උපකරණ ගබඩාව' },
  'sidebar.analytics': { en: 'Operational Analytics', si: 'මෙහෙයුම් විශ්ලේෂණ' },
  'sidebar.volunteers': { en: 'Volunteer Mobilization Hub', si: 'ස්වේච්ඡා බලකා මෙහෙයුම්' },
  'sidebar.donations': { en: 'Relief Campaigns & Pledges', si: 'සහන අරමුදල් සහ පරිත්‍යාග' },
  'sidebar.gisMap': { en: 'Command GIS Map', si: 'භූගෝලීය ආපදා සිතියම' },
  'sidebar.adminUsers': { en: 'User Management & RBAC', si: 'පරිශීලක සහ අවසර කළමනාකරණය' },
  'sidebar.adminTelemetry': { en: 'System Telemetry & Audit', si: 'පද්ධති විගණන වාර්තා' },
  'sidebar.fieldDispatch': { en: 'Field Mission Dispatch', si: 'ක්ෂේත්‍ර මෙහෙයුම් අංශය' },
  'sidebar.fundingPortfolio': { en: 'My Funding Portfolio', si: 'මගේ පරිත්‍යාග කළඹ' },

  // Common UI Buttons & Badges
  'common.requestHelp': { en: 'Request Help', si: 'ආධාර ඉල්ලන්න' },
  'common.viewDetails': { en: 'View Details', si: 'විස්තර බලන්න' },
  'common.search': { en: 'Search...', si: 'සොයන්න...' },
  'common.filter': { en: 'Filter', si: 'පෙරහන්' },
  'common.all': { en: 'All', si: 'සියල්ල' },
  'common.active': { en: 'Active', si: 'සක්‍රීය' },
  'common.pending': { en: 'Pending', si: 'පොරොත්තුවේ' },
  'common.resolved': { en: 'Resolved', si: 'විසඳන ලද' },
  'common.save': { en: 'Save Changes', si: 'වෙනස්කම් සුරකින්න' },
  'common.cancel': { en: 'Cancel', si: 'අවලංගු කරන්න' },
  'common.back': { en: 'Back', si: 'ආපසු' },
  'common.loading': { en: 'Loading...', si: 'පූරණය වෙමින් පවතී...' },
  'common.actions': { en: 'Actions', si: 'ක්‍රියාමාර්ග' },
  'common.district': { en: 'District', si: 'දිස්ත්‍රික්කය' },
  'common.province': { en: 'Province', si: 'පළාත' },
  'common.status': { en: 'Status', si: 'තත්ත්වය' },
  'common.urgency': { en: 'Urgency', si: 'හදිසිභාවය' },
  'common.category': { en: 'Category', si: 'වර්ගය' },
  'common.date': { en: 'Date', si: 'දිනය' },

  // Landing Page Hero & Cards
  'landing.heroTitle': { en: 'Help When You Need It Most.', si: 'ඔබට වඩාත්ම අවශ්‍ය මොහොතේ පිහිට.' },
  'landing.heroSub': {
    en: 'Request emergency assistance, get safety information, and stay connected during disasters across Sri Lanka.',
    si: 'ශ්‍රී ලංකාව පුරා ඇතිවන ආපදාවන්හිදී හදිසි සහන ඉල්ලන්න, ආරක්ෂිත මාර්ගෝපදේශ ලබාගන්න, සහ සහන කණ්ඩායම් හා සම්බන්ධ වන්න.'
  },
  'landing.requestAidBtn': { en: 'Request Emergency Assistance', si: 'හදිසි සහන ආධාර ඉල්ලන්න' },
  'landing.viewGuidesBtn': { en: 'View Safety Guides', si: 'ආරක්ෂක උපදෙස් බලන්න' },
  'landing.noAccountNotice': { en: 'No account or login required for emergency aid requests', si: 'හදිසි ආධාර ඉල්ලීම් සඳහා ලියාපදිංචිය හෝ පිවිසීම අවශ්‍ය නොවේ' },
  'landing.cardHelpTitle': { en: 'Request Help', si: 'ආධාර ඉල්ලන්න' },
  'landing.cardHelpDesc': { en: 'Food, water, medical, or rescue', si: 'ආහාර, ජලය, ඖෂධ හෝ මුදාගැනීම්' },
  'landing.cardSheltersTitle': { en: 'Find Nearby Shelters', si: 'ආසන්න නවාතැන් සොයන්න' },
  'landing.cardSheltersDesc': { en: 'Safe verified locations in your area', si: 'ඔබේ ප්‍රදේශයේ ආරක්ෂිත කඳවුරු' },
  'landing.cardAlertsTitle': { en: 'Get Emergency Alerts', si: 'හදිසි අනතුරු ඇඟවීම්' },
  'landing.cardAlertsDesc': { en: 'Real-time safety updates & river levels', si: 'ගංගා ජල මට්ටම් සහ ක්ෂණික පණිවිඩ' },
  'landing.cardSafetyTitle': { en: 'Learn & Stay Safe', si: 'ආරක්ෂිත උපදෙස්' },
  'landing.cardSafetyDesc': { en: 'Guides for floods, landslides & storms', si: 'ගංවතුර, නායයෑම් සහ කුණාටු මාර්ගෝපදේශ' },

  // Role Names
  'role.Citizen': { en: 'Affected Citizen / Public', si: 'විපතට පත් පුරවැසියා / සාමාන්‍ය ජනතාව' },
  'role.Coordinator': { en: 'Emergency Coordinator', si: 'හදිසි ආපදා සම්බන්ධීකාරක' },
  'role.CaseManager': { en: 'Incident / Case Manager', si: 'සිදුවීම් සහ සිද්ධි කළමනාකරු' },
  'role.LogisticsManager': { en: 'Resource & Logistics Director', si: 'සම්පත් හා සැපයුම් කළමනාකරු' },
  'role.ShelterAdmin': { en: 'Shelter Administrator', si: 'ආරක්ෂිත කඳවුරු පරිපාලක' },
  'role.VolunteerCoordinator': { en: 'Volunteer Coordinator', si: 'ස්වේච්ඡා බලකා සම්බන්ධීකාරක' },
  'role.Volunteer': { en: 'Field Response Volunteer', si: 'ක්ෂේත්‍ර සහන ස්වේච්ඡා සේවක' },
  'role.Donor': { en: 'Aid Donor / Funding Officer', si: 'ආධාර පරිත්‍යාගශීලී / මූල්‍ය නිලධාරී' },
  'role.PartnerOfficer': { en: 'Partner Organisation Officer', si: 'හවුල්කාර සංවිධාන නිලධාරී' },
  'role.Admin': { en: 'System Administrator', si: 'පද්ධති ප්‍රධාන පරිපාලක' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
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
      // localStorage fallback
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

  const t = (key: string, defaultText?: string): string => {
    const entry = UI_TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return defaultText || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
