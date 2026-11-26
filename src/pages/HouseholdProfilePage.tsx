import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Home,
  ShieldAlert,
  HeartPulse,
  PhoneCall,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader } from '../components/PageHeader';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import {
  HouseholdProfile,
  HouseholdProfileType,
  SriLankanDistrict,
  HouseholdComposition,
  VulnerabilityCategory,
  HouseholdProfileStatus,
  EmergencyContact
} from '../types';

export const SRI_LANKAN_DISTRICTS: SriLankanDistrict[] = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

export const VULNERABILITY_CATEGORIES: {
  key: VulnerabilityCategory;
  en: string;
  si: string;
  descriptionEn: string;
  descriptionSi: string;
}[] = [
  {
    key: 'pregnantWomen',
    en: 'Pregnant Women',
    si: 'ගර්භනී මව්වරුන්',
    descriptionEn: 'Maternal health and prenatal priority during crisis',
    descriptionSi: 'ආපදා අවස්ථාවලදී මාතෘ සෞඛ්‍ය සහ පෙර ප්‍රසව ප්‍රමුඛතාව'
  },
  {
    key: 'personsWithDisabilities',
    en: 'Persons with Disabilities',
    si: 'ආබාධිත පුද්ගලයන්',
    descriptionEn: 'Physical, sensory, or intellectual accessibility requirements',
    descriptionSi: 'ශාරීරික හෝ සංවේදනාත්මක ප්‍රවේශතා අවශ්‍යතා'
  },
  {
    key: 'chronicMedicalConditions',
    en: 'Chronic Medical Conditions',
    si: 'නිදන්ගත රෝගීන්',
    descriptionEn: 'Hypertension, diabetes, asthma, dialysis, or cardiac care',
    descriptionSi: 'දියවැඩියාව, ඇදුම, වකුගඩු හෝ හෘද රෝග සහිත පුද්ගලයන්'
  },
  {
    key: 'regularMedicationRequired',
    en: 'Regular Medication Required',
    si: 'දිනපතා අත්‍යවශ්‍ය ඖෂධ අවශ්‍ය අය',
    descriptionEn: 'Dependent on daily life-saving pharmaceuticals or insulin',
    descriptionSi: 'දිනපතා ලබාගත යුතු ඖෂධ හෝ ඉන්සියුලින් මත යැපෙන අය'
  },
  {
    key: 'mobilityAssistanceRequired',
    en: 'Mobility Assistance Required',
    si: 'චලන ආධාරක (රෝද පුටු/කලවම්) අවශ්‍ය අය',
    descriptionEn: 'Wheelchair, walker, bedridden, or stretcher transport needed',
    descriptionSi: 'රෝද පුටු, ඇවිදීමේ උපකරණ හෝ ඇඳන්ගතව සිටින අය'
  },
  {
    key: 'otherSpecialNeeds',
    en: 'Other Special Needs',
    si: 'වෙනත් විශේෂ ආධාරක අවශ්‍යතා',
    descriptionEn: 'Nutritional sensitivities, trauma support, or linguistic needs',
    descriptionSi: 'විශේෂ පෝෂණ, කම්පන සහන හෝ වෙනත් හදිසි අවශ්‍යතා'
  }
];

export const HouseholdProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const storageKey = `sahaya_household_profile_${user?.id || 'citizen'}`;

  // Form State
  const [profileType, setProfileType] = useState<HouseholdProfileType>('Family');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [district, setDistrict] = useState<SriLankanDistrict | ''>('');
  const [city, setCity] = useState('');

  // Composition State
  const [infants, setInfants] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [adults, setAdults] = useState<number>(1); // Includes logged-in citizen
  const [elderly, setElderly] = useState<number>(0);

  // Vulnerability State
  const [noSpecialNeeds, setNoSpecialNeeds] = useState<boolean>(false);
  const [preferNotToDisclose, setPreferNotToDisclose] = useState<boolean>(false);
  const [vulnerabilities, setVulnerabilities] = useState<
    Record<VulnerabilityCategory, { selected: boolean; affectedCount: number }>
  >({
    pregnantWomen: { selected: false, affectedCount: 0 },
    personsWithDisabilities: { selected: false, affectedCount: 0 },
    chronicMedicalConditions: { selected: false, affectedCount: 0 },
    regularMedicationRequired: { selected: false, affectedCount: 0 },
    mobilityAssistanceRequired: { selected: false, affectedCount: 0 },
    otherSpecialNeeds: { selected: false, affectedCount: 0 }
  });
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Emergency Contact State
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState<EmergencyContact['relationship']>('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // UI status
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto calculate total members
  const totalMembers = infants + children + adults + elderly;

  // Load existing profile from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: HouseholdProfile = JSON.parse(stored);
        setProfileType(parsed.profileType || 'Family');
        setResidentialAddress(parsed.residentialAddress || '');
        setDistrict(parsed.district || '');
        setCity(parsed.city || '');

        if (parsed.composition) {
          setInfants(parsed.composition.infants ?? 0);
          setChildren(parsed.composition.children ?? 0);
          setAdults(parsed.composition.adults ?? 1);
          setElderly(parsed.composition.elderly ?? 0);
        }

        setNoSpecialNeeds(!!parsed.noSpecialNeeds);
        setPreferNotToDisclose(!!parsed.preferNotToDisclose);
        if (parsed.vulnerabilities) {
          setVulnerabilities(parsed.vulnerabilities);
        }
        setAdditionalNotes(parsed.additionalNotes || '');

        if (parsed.emergencyContact) {
          setEmergencyName(parsed.emergencyContact.name || '');
          setEmergencyRelationship(parsed.emergencyContact.relationship || '');
          setEmergencyPhone(parsed.emergencyContact.phoneNumber || '');
        }

        setIsSaved(true);
      }
    } catch {
      // Ignore parse errors
    }
  }, [storageKey]);

  // Adjust composition when profileType is Individual
  const handleProfileTypeChange = (type: HouseholdProfileType) => {
    setProfileType(type);
    setIsDirty(true);
    if (type === 'Individual') {
      setInfants(0);
      setChildren(0);
      setAdults(1);
      setElderly(0);
      // Adjust any affected counts exceeding 1
      setVulnerabilities((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          const k = key as VulnerabilityCategory;
          if (updated[k].affectedCount > 1) {
            updated[k] = { ...updated[k], affectedCount: 1 };
          }
        });
        return updated;
      });
    }
  };

  // Safe composition counters
  const updateCount = (field: 'infants' | 'children' | 'adults' | 'elderly', delta: number) => {
    setIsDirty(true);
    if (profileType === 'Individual') return; // Cannot change in Individual mode

    if (field === 'infants') setInfants((prev) => Math.max(0, prev + delta));
    if (field === 'children') setChildren((prev) => Math.max(0, prev + delta));
    if (field === 'adults') setAdults((prev) => Math.max(1, prev + delta)); // Logged-in citizen is at least 1
    if (field === 'elderly') setElderly((prev) => Math.max(0, prev + delta));
  };

  // Vulnerability selection logic
  const handleVulnerabilityToggle = (cat: VulnerabilityCategory) => {
    setIsDirty(true);
    // Uncheck exclusive options
    setNoSpecialNeeds(false);
    setPreferNotToDisclose(false);

    setVulnerabilities((prev) => {
      const current = prev[cat];
      const willSelect = !current.selected;
      return {
        ...prev,
        [cat]: {
          selected: willSelect,
          affectedCount: willSelect ? Math.min(1, Math.max(1, totalMembers)) : 0
        }
      };
    });
  };

  const handleVulnerabilityCountChange = (cat: VulnerabilityCategory, count: number) => {
    setIsDirty(true);
    const validCount = Math.max(1, Math.min(count, Math.max(1, totalMembers)));
    setVulnerabilities((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        affectedCount: validCount
      }
    }));
  };

  const handleExclusiveToggle = (type: 'noSpecial' | 'preferNot') => {
    setIsDirty(true);
    if (type === 'noSpecial') {
      const next = !noSpecialNeeds;
      setNoSpecialNeeds(next);
      if (next) {
        setPreferNotToDisclose(false);
        // Deselect all vulnerabilities
        setVulnerabilities((prev) => {
          const reset = { ...prev };
          Object.keys(reset).forEach((k) => {
            const cat = k as VulnerabilityCategory;
            reset[cat] = { selected: false, affectedCount: 0 };
          });
          return reset;
        });
      }
    } else {
      const next = !preferNotToDisclose;
      setPreferNotToDisclose(next);
      if (next) {
        setNoSpecialNeeds(false);
        // Deselect all vulnerabilities
        setVulnerabilities((prev) => {
          const reset = { ...prev };
          Object.keys(reset).forEach((k) => {
            const cat = k as VulnerabilityCategory;
            reset[cat] = { selected: false, affectedCount: 0 };
          });
          return reset;
        });
      }
    }
  };

  // Determine current profile completeness status
  const calculateStatus = (): HouseholdProfileStatus => {
    if (!residentialAddress.trim() && !district && !city.trim()) {
      return 'NotCreated';
    }
    if (residentialAddress.trim() && district && city.trim() && totalMembers >= 1) {
      return 'Completed';
    }
    return 'Incomplete';
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!residentialAddress.trim()) {
      errors.residentialAddress =
        language === 'en' ? 'Residential address is required.' : 'නේවාසික ලිපිනය ඇතුළත් කිරීම අනිවාර්ය වේ.';
    }

    if (!district) {
      errors.district =
        language === 'en' ? 'Please select your district.' : 'කරුණාකර ඔබගේ දිස්ත්‍රික්කය තෝරන්න.';
    }

    if (!city.trim()) {
      errors.city =
        language === 'en' ? 'City or town is required.' : 'නගරය ඇතුළත් කිරීම අනිවාර්ය වේ.';
    }

    if (profileType === 'Individual' && totalMembers !== 1) {
      errors.composition =
        language === 'en'
          ? 'Individual household must have exactly 1 member.'
          : 'තනි පුද්ගල පැතිකඩක් සඳහා මුළු සාමාජික ගණන 1 ක් විය යුතුය.';
    }

    if (profileType === 'Family' && totalMembers < 1) {
      errors.composition =
        language === 'en'
          ? 'Total household members must be at least 1.'
          : 'මුළු සාමාජික ගණන අවම වශයෙන් 1ක් විය යුතුය.';
    }

    // Check affected counts do not exceed total members
    Object.keys(vulnerabilities).forEach((k) => {
      const cat = k as VulnerabilityCategory;
      if (vulnerabilities[cat].selected && vulnerabilities[cat].affectedCount > totalMembers) {
        errors[cat] =
          language === 'en'
            ? `Affected members cannot exceed total household members (${totalMembers}).`
            : `බලපෑමට ලක්වූවන්ගේ ගණන මුළු සාමාජික ගණන (${totalMembers}) ඉක්මවිය නොහැක.`;
      }
    });

    // Validate emergency phone if entered
    if (emergencyPhone.trim()) {
      const cleanPhone = emergencyPhone.replace(/[\s-]/g, '');
      const validPhone = /^(?:\+94|0)?7[0-9]{8}$/.test(cleanPhone);
      if (!validPhone) {
        errors.emergencyPhone =
          language === 'en'
            ? 'Please enter a valid Sri Lankan mobile number (e.g. 0771234567).'
            : 'කරුණාකර වලංගු ශ්‍රී ලාංකික ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න (උදා: 0771234567).';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const status = calculateStatus();
    const profileData: HouseholdProfile = {
      userId: user?.id || 'citizen',
      fullName: user?.fullName || 'Affected Citizen',
      mobileNumber: user?.phoneNumber || '',
      profileType,
      residentialAddress: residentialAddress.trim(),
      district,
      city: city.trim(),
      composition: {
        infants,
        children,
        adults,
        elderly,
        totalMembers
      },
      noSpecialNeeds,
      preferNotToDisclose,
      vulnerabilities,
      additionalNotes: additionalNotes.trim(),
      emergencyContact: emergencyName.trim()
        ? {
            name: emergencyName.trim(),
            relationship: emergencyRelationship,
            phoneNumber: emergencyPhone.trim()
          }
        : undefined,
      status,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(profileData));
        setIsSaved(true);
        setIsDirty(false);
        setSaveSuccessMessage(
          language === 'en'
            ? 'Household & Vulnerability Profile updated successfully! Your details are safeguarded.'
            : 'පවුලේ සහ විශේෂ අවශ්‍යතා පැතිකඩ සාර්ථකව යාවත්කාලීන විය! ඔබගේ දත්ත සුරක්ෂිතව තැන්පත් කර ඇත.'
        );
        setTimeout(() => setSaveSuccessMessage(null), 5000);
      } catch (err) {
        console.error('Failed to save profile', err);
      } finally {
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 400);
  };

  // Cancel handler with unsaved confirmation
  const handleCancel = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm(
        language === 'en'
          ? 'You have unsaved changes. Are you sure you want to discard them?'
          : 'ඔබ සිදුකළ වෙනස්කම් තවම Save කර නැත. ඒවා ඉවත් කර පිටවීමට අවශ්‍යද?'
      );
      if (!confirmDiscard) return;
    }
    navigate('/citizen/dashboard');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title={language === 'en' ? 'Household & Vulnerability Profile' : 'පවුලේ සහ විශේෂ අවශ්‍යතා තොරතුරු'}
        subtitle={
          language === 'en'
            ? 'Manage your household details and special assistance needs to receive appropriate support during emergencies.'
            : 'හදිසි ආපදා අවස්ථාවලදී නිවැරදි සහන ලබාගැනීම සඳහා ඔබගේ නිවසේ සාමාජික විස්තර සහ විශේෂ ආධාර අවශ්‍යතා මෙහි සටහන් කරන්න.'
        }
        portalBadge={language === 'en' ? 'Citizen Portal' : 'පුරවැසි පෝර්ටලය'}
        breadcrumbs={[
          { label: language === 'en' ? 'Citizen Home' : 'මුල් පිටුව', path: '/citizen/dashboard' },
          { label: language === 'en' ? 'Household Profile' : 'පවුලේ තොරතුරු' }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/citizen/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700 font-bold text-xs shadow-2xs hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Dashboard' : 'පුවරුවට'}</span>
            </Link>
            <LanguageSwitcher variant="pill" />
          </div>
        }
      />

      {/* Success Notification Banner */}
      {saveSuccessMessage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 flex items-start gap-3.5 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-teal-900">
              {language === 'en' ? 'Profile Saved Successfully' : 'පැතිකඩ සාර්ථකව සුරැකිණි'}
            </p>
            <p className="text-teal-800 mt-0.5 leading-relaxed">{saveSuccessMessage}</p>
          </div>
        </div>
      )}

      {/* Validation Errors Alert Banner */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3.5 shadow-xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-rose-900">
              {language === 'en' ? 'Please complete the required fields' : 'කරුණාකර අනිවාර්ය තොරතුරු සම්පූර්ණ කරන්න'}
            </p>
            <ul className="list-disc list-inside mt-1 text-rose-800 space-y-0.5">
              {Object.values(validationErrors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Security & Confidentiality Advisory Strip */}
      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-950 flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-blue-900">
          <strong className="font-bold">
            {language === 'en' ? 'Official Data Protection Notice: ' : 'නිල දත්ත ආරක්ෂණ නිවේදනය: '}
          </strong>
          {language === 'en'
            ? 'Your household composition and vulnerability information is confidential and accessed strictly by authorized crisis response personnel for triage and shelter accommodation during emergencies. Medical reports or identity documents are not required.'
            : 'ඔබ සපයන පවුලේ තොරතුරු සහ විශේෂ ආධාර අවශ්‍යතා දැඩි රහස්‍යභාවයකින් යුතුව ආරක්ෂා කෙරේ. ඒවා භාවිත වන්නේ හදිසි ආපදාවලදී ඔබට අවශ්‍ය සහන, ඖෂධ සහ නවාතැන් ප්‍රමුඛතා නිර්දේශ කිරීමට පමණි.'}
        </div>
      </div>

      {/* MAIN FORM */}
      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
        {/* =================================================================== */}
        {/* SECTION 1: HOUSEHOLD INFORMATION */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
                <Home className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {language === 'en' ? '1. Household Information' : '1. නිවසේ මූලික තොරතුරු'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Primary address and basic household configuration'
                    : 'ප්‍රධාන ලිපිනය සහ නිවසේ මූලික වගතුග'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">
                {language === 'en' ? 'Profile Status:' : 'පැතිකඩ තත්ත්වය:'}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  calculateStatus() === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : calculateStatus() === 'Incomplete'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {calculateStatus() === 'Completed'
                  ? language === 'en' ? 'Completed' : 'සම්පූර්ණයි'
                  : calculateStatus() === 'Incomplete'
                  ? language === 'en' ? 'Incomplete' : 'අසම්පූර්ණයි'
                  : language === 'en' ? 'Not Created' : 'සාදා නැත'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Full Name (Auto-populated from Auth) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'en' ? 'Full Name' : 'සම්පූර්ණ නම'}
                <span className="text-slate-400 font-normal ml-1">
                  ({language === 'en' ? 'From account' : 'ගිණුමෙන් ස්වයංක්‍රීයව'})
                </span>
              </label>
              <input
                type="text"
                disabled
                value={user?.fullName || 'Affected Citizen'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs sm:text-sm font-medium cursor-not-allowed"
              />
            </div>

            {/* Mobile Number (Auto-populated from Auth) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'en' ? 'Mobile Number' : 'ජංගම දුරකථන අංකය'}
                <span className="text-slate-400 font-normal ml-1">
                  ({language === 'en' ? 'From account' : 'ගිණුමෙන් ස්වයංක්‍රීයව'})
                </span>
              </label>
              <input
                type="text"
                disabled
                value={user?.phoneNumber || '0771234567'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs sm:text-sm font-mono font-medium cursor-not-allowed"
              />
            </div>

            {/* Profile Type: Individual vs Family */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {language === 'en' ? 'Profile Type' : 'පැතිකඩ වර්ගය'}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => handleProfileTypeChange('Individual')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                    profileType === 'Individual'
                      ? 'border-teal-500 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      profileType === 'Individual' ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
                    }`}
                  >
                    {profileType === 'Individual' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      {language === 'en' ? 'Individual Household' : 'තනි පුද්ගල පැතිකඩ'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">
                      {language === 'en'
                        ? 'I live alone (Total household member count is exactly 1).'
                        : 'මා තනිව ජීවත් වේ (මුළු සාමාජික ගණන 1ක් වේ).'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleProfileTypeChange('Family')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                    profileType === 'Family'
                      ? 'border-teal-500 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      profileType === 'Family' ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
                    }`}
                  >
                    {profileType === 'Family' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      {language === 'en' ? 'Family Household' : 'පවුලේ සාමාජිකයින් සහිත පැතිකඩ'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">
                      {language === 'en'
                        ? 'Multiple members residing under the same roof (children, elders, etc.).'
                        : 'එකම නිවසේ ජීවත්වන සාමාජිකයින් කිහිපදෙනෙකු (දරුවන්, වැඩිහිටියන් ආදී).'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Residential Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'en' ? 'Residential Address' : 'නේවාසික ලිපිනය'}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={residentialAddress}
                onChange={(e) => {
                  setResidentialAddress(e.target.value);
                  setIsDirty(true);
                  if (validationErrors.residentialAddress) {
                    setValidationErrors((prev) => ({ ...prev, residentialAddress: '' }));
                  }
                }}
                placeholder={
                  language === 'en'
                    ? 'e.g. No. 42, Temple Road, Badalgama'
                    : 'උදා: නො. 42, පන්සල පාර, බඩල්ගම'
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                  validationErrors.residentialAddress
                    ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500'
                    : 'border-slate-200 bg-white focus:border-teal-500'
                }`}
              />
              {validationErrors.residentialAddress && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">
                  {validationErrors.residentialAddress}
                </p>
              )}
            </div>

            {/* District Dropdown (All 25 Sri Lankan Districts) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'en' ? 'District' : 'දිස්ත්‍රික්කය'}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value as SriLankanDistrict);
                  setIsDirty(true);
                  if (validationErrors.district) {
                    setValidationErrors((prev) => ({ ...prev, district: '' }));
                  }
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                  validationErrors.district
                    ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500'
                    : 'border-slate-200 focus:border-teal-500'
                }`}
              >
                <option value="">
                  {language === 'en' ? '-- Select Sri Lankan District --' : '-- දිස්ත්‍රික්කය තෝරන්න --'}
                </option>
                {SRI_LANKAN_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              {validationErrors.district && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">
                  {validationErrors.district}
                </p>
              )}
            </div>

            {/* City / Town */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'en' ? 'City / Town' : 'නගරය'}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setIsDirty(true);
                  if (validationErrors.city) {
                    setValidationErrors((prev) => ({ ...prev, city: '' }));
                  }
                }}
                placeholder={language === 'en' ? 'e.g. Negombo / Galle / Kandy' : 'උදා: මීගමුව / ගාල්ල / නුවර'}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                  validationErrors.city
                    ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500'
                    : 'border-slate-200 bg-white focus:border-teal-500'
                }`}
              />
              {validationErrors.city && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">
                  {validationErrors.city}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECTION 2: HOUSEHOLD COMPOSITION */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {language === 'en' ? '2. Household Composition' : '2. නිවසේ සාමාජික සංයුතිය'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Enter member counts by age group. The logged-in citizen is included.'
                    : 'වයස් කාණ්ඩ අනුව සාමාජික ගණන ඇතුළත් කරන්න (ඔබ ඇතුළුව).'}
                </p>
              </div>
            </div>

            {/* Total Auto-Calculated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white shadow-xs">
              <span className="text-xs text-slate-300 font-medium">
                {language === 'en' ? 'Total Members:' : 'මුළු සාමාජිකයින්:'}
              </span>
              <strong className="text-base font-black text-teal-400 font-mono">
                {totalMembers}
              </strong>
            </div>
          </div>

          {validationErrors.composition && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              {validationErrors.composition}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Infants (< 1 year) */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {language === 'en' ? 'Infants' : 'බිළිඳුන්'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {language === 'en' ? 'Under 1 year' : 'අවුරුදු 1ට අඩු'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={profileType === 'Individual' || infants <= 0}
                  onClick={() => updateCount('infants', -1)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-slate-900 font-mono px-2">
                  {infants}
                </span>
                <button
                  type="button"
                  disabled={profileType === 'Individual'}
                  onClick={() => updateCount('infants', 1)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Children (1–17 years) */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {language === 'en' ? 'Children' : 'ළමුන්'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {language === 'en' ? '1 – 17 years' : 'අවුරුදු 1 – 17'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={profileType === 'Individual' || children <= 0}
                  onClick={() => updateCount('children', -1)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-slate-900 font-mono px-2">
                  {children}
                </span>
                <button
                  type="button"
                  disabled={profileType === 'Individual'}
                  onClick={() => updateCount('children', 1)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Adults (18–59 years) */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {language === 'en' ? 'Adults' : 'වැඩිහිටියන්'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {language === 'en' ? '18 – 59 years (incl. you)' : 'අවුරුදු 18 – 59 (ඔබ ඇතුළුව)'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={profileType === 'Individual' || adults <= 1}
                  onClick={() => updateCount('adults', -1)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-slate-900 font-mono px-2">
                  {adults}
                </span>
                <button
                  type="button"
                  disabled={profileType === 'Individual'}
                  onClick={() => updateCount('adults', 1)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Elderly (60+ years) */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {language === 'en' ? 'Elderly' : 'ජ්‍යෙෂ්ඨ පුරවැසියන්'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {language === 'en' ? '60 years & above' : 'අවුරුදු 60 සහ ඊට වැඩි'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={profileType === 'Individual' || elderly <= 0}
                  onClick={() => updateCount('elderly', -1)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-slate-900 font-mono px-2">
                  {elderly}
                </span>
                <button
                  type="button"
                  disabled={profileType === 'Individual'}
                  onClick={() => updateCount('elderly', 1)}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECTION 3: VULNERABILITY & SPECIAL NEEDS */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
                <HeartPulse className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {language === 'en' ? '3. Vulnerability & Special Needs' : '3. විශේෂ ආධාරක සහ අවදානම් අවශ්‍යතා'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Select all applicable categories to prioritize rescue, medicine, and accessible shelters'
                    : 'හදිසි ගලවාගැනීම්, ඖෂධ සහ නවාතැන් ප්‍රමුඛතා සඳහා අදාළ කරුණු තෝරන්න'}
                </p>
              </div>
            </div>
          </div>

          {/* Mutually Exclusive Options Strip */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {language === 'en' ? 'Quick Exclusions (Optional):' : 'ඉක්මන් තේරීම් (අවශ්‍ය නම්):'}
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noSpecialNeeds}
                  onChange={() => handleExclusiveToggle('noSpecial')}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {language === 'en' ? 'No Special Needs' : 'විශේෂ අවශ්‍යතා කිසිවක් නැත'}
                </span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferNotToDisclose}
                  onChange={() => handleExclusiveToggle('preferNot')}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {language === 'en' ? 'Prefer Not to Disclose' : 'හෙළිදරව් නොකිරීමට කැමැත්තෙමි'}
                </span>
              </label>
            </div>
          </div>

          {/* Vulnerability Checkboxes with Affected Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VULNERABILITY_CATEGORIES.map((cat) => {
              const itemState = vulnerabilities[cat.key];
              const isCatDisabled = noSpecialNeeds || preferNotToDisclose;

              return (
                <div
                  key={cat.key}
                  className={`p-4 rounded-2xl border transition-all ${
                    itemState.selected
                      ? 'border-teal-400 bg-teal-50/40 shadow-xs'
                      : isCatDisabled
                      ? 'opacity-50 border-slate-200 bg-slate-50 cursor-not-allowed'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-3 cursor-pointer select-none flex-1">
                      <input
                        type="checkbox"
                        disabled={isCatDisabled}
                        checked={itemState.selected}
                        onChange={() => handleVulnerabilityToggle(cat.key)}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer mt-0.5"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                          {cat[language]}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">
                          {language === 'en' ? cat.descriptionEn : cat.descriptionSi}
                        </span>
                      </div>
                    </label>

                    {/* Conditional Affected Count Number Input */}
                    {itemState.selected && (
                      <div className="flex items-center gap-1.5 shrink-0 bg-white px-2.5 py-1.5 rounded-xl border border-teal-300 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {language === 'en' ? 'Qty:' : 'ගණන:'}
                        </span>
                        <input
                          type="number"
                          min="1"
                          max={totalMembers}
                          value={itemState.affectedCount}
                          onChange={(e) =>
                            handleVulnerabilityCountChange(cat.key, parseInt(e.target.value) || 1)
                          }
                          className="w-12 text-center text-xs font-black text-slate-900 border-none p-0 focus:ring-0"
                        />
                      </div>
                    )}
                  </div>
                  {validationErrors[cat.key] && (
                    <p className="text-[11px] text-rose-600 font-bold mt-2">
                      {validationErrors[cat.key]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Optional Additional Notes Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'en' ? 'Additional Notes / Specific Requirements (Optional)' : 'අමතර සටහන් / විශේෂ අවශ්‍යතා (අවශ්‍ය නම් පමණි)'}
            </label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => {
                setAdditionalNotes(e.target.value);
                setIsDirty(true);
              }}
              placeholder={
                language === 'en'
                  ? 'e.g. Grandma requires a ground-floor bed; need baby formula and daily asthma inhaler.'
                  : 'උදා: ආච්චිට බිම් මහලේ ඇඳක් අවශ්‍යයි; දිනපතා භාවිත කරන ඇදුම ඉන්හේලර් සහ ළදරු ආහාර අවශ්‍ය වේ.'
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECTION 4: EMERGENCY CONTACT (OPTIONAL) */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <span className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <PhoneCall className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {language === 'en' ? '4. Emergency Contact' : '4. හදිසි ඇමතුම් පුද්ගලයා'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                  {language === 'en' ? 'Optional' : 'විකල්ප'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Person to contact if you cannot be reached during an emergency evacuation'
                  : 'හදිසි අවස්ථාවකදී ඔබව සම්බන්ධ කරගත නොහැකි වුවහොත් ඇමතිය යුතු ඥාතියෙකු'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Contact Person Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'en' ? 'Contact Person Name' : 'නම'}
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => {
                  setEmergencyName(e.target.value);
                  setIsDirty(true);
                }}
                placeholder={language === 'en' ? 'e.g. Gamini Silva' : 'උදා: ගාමිණී සිල්වා'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Relationship Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'en' ? 'Relationship' : 'සම්බන්ධතාවය'}
              </label>
              <select
                value={emergencyRelationship}
                onChange={(e) => {
                  setEmergencyRelationship(e.target.value as EmergencyContact['relationship']);
                  setIsDirty(true);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              >
                <option value="">{language === 'en' ? '-- Select Relationship --' : '-- තෝරන්න --'}</option>
                <option value="Parent">{language === 'en' ? 'Parent' : 'මව / පියා'}</option>
                <option value="Spouse">{language === 'en' ? 'Spouse' : 'සැමියා / බිරිඳ'}</option>
                <option value="Sibling">{language === 'en' ? 'Sibling' : 'සහෝදර / සහෝදරිය'}</option>
                <option value="Relative">{language === 'en' ? 'Relative' : 'ඥාතියෙක්'}</option>
                <option value="Friend">{language === 'en' ? 'Friend' : 'මිතුරෙක්'}</option>
                <option value="Neighbour">{language === 'en' ? 'Neighbour' : 'අසල්වැසියෙක්'}</option>
                <option value="Other">{language === 'en' ? 'Other' : 'වෙනත්'}</option>
              </select>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'en' ? 'Contact Phone Number' : 'දුරකථන අංකය'}
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => {
                  setEmergencyPhone(e.target.value);
                  setIsDirty(true);
                  if (validationErrors.emergencyPhone) {
                    setValidationErrors((prev) => ({ ...prev, emergencyPhone: '' }));
                  }
                }}
                placeholder="0771234567"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all ${
                  validationErrors.emergencyPhone
                    ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500'
                    : 'border-slate-200 bg-white focus:border-teal-500'
                }`}
              />
              {validationErrors.emergencyPhone && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">
                  {validationErrors.emergencyPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* FORM ACTION BUTTONS */}
        {/* =================================================================== */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>{language === 'en' ? 'Cancel' : 'අවලංගු කරන්න'}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              id="save-household-profile-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{language === 'en' ? 'Save Household Profile' : 'තොරතුරු සුරකින්න'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
