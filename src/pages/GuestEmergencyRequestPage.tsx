import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  Users,
  Camera,
  UploadCloud,
  X,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Compass,
  LifeBuoy,
  HeartPulse,
  Droplets,
  PackageCheck,
  Home,
  Truck,
  Copy,
  Check,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Info,
  Utensils,
  Shirt,
  HelpCircle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { SahayaLogo } from '../components/SahayaLogo';
import { MapComponent } from '../components/MapComponent';

interface UploadedPhoto {
  id: string;
  name: string;
  size: string;
  url: string;
}

export interface GuestEmergencyRecord {
  referenceCode: string;
  contactName: string;
  contactPhone: string;
  alternatePhone?: string;
  category: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedCount: number;
  childrenCount: number;
  elderlyCount: number;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  evidenceImages: string[];
  status: 'Submitted' | 'UnderReview' | 'Dispatched' | 'Delivered';
  createdAt: string;
  timeline: {
    status: string;
    title: string;
    time: string;
    notes: string;
  }[];
}

export const GuestEmergencyRequestPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Step (1: Request Details, 2: Location, 3: Additional Info, 4: Review & Submit)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [category, setCategory] = useState<string>('Food & Water');
  const [description, setDescription] = useState<string>('');
  const [affectedCount, setAffectedCount] = useState<number | string>(5);
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Critical');

  // Location Fields
  const [locationName, setLocationName] = useState<string>('Sedawatta, Wellampitiya');
  const [detailedAddress, setDetailedAddress] = useState<string>('Near Sedawatta Temple, Kelani River Basin');
  const [latitude, setLatitude] = useState<number>(6.942);
  const [longitude, setLongitude] = useState<number>(79.887);
  const [locatingUser, setLocatingUser] = useState<boolean>(false);
  const [resolvingArea, setResolvingArea] = useState<boolean>(false);

  // Helper to reverse-geocode coordinates to real Area/Town name
  const resolveLocationAddress = async (lat: number, lon: number) => {
    setResolvingArea(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
        {
          signal: controller.signal,
          headers: { 'Accept-Language': 'en' },
        }
      );
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const a = data.address || {};
        const town = a.suburb || a.neighbourhood || a.village || a.town || a.city_district || a.city || a.county;
        const district = a.city || a.state_district || a.state || '';
        const resolvedName = town && district && town !== district ? `${town}, ${district}` : town || district;
        if (resolvedName) {
          setLocationName(resolvedName);
          const road = a.road ? `${a.road}, ` : '';
          setDetailedAddress(`${road}${resolvedName}`);
          setResolvingArea(false);
          return;
        }
      }
    } catch {
      // Ignore network/offline error and use coordinate fallback
    }

    // Intelligent Sri Lanka regional coordinate approximation fallback
    let fallbackArea = `GPS Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    if (lat >= 6.85 && lat <= 7.02 && lon >= 79.80 && lon <= 79.95) {
      fallbackArea = 'Colombo Metro / Kelani Basin';
    } else if (lat >= 7.00 && lat <= 7.20 && lon >= 79.90 && lon <= 80.15) {
      fallbackArea = 'Kelaniya / Gampaha District';
    } else if (lat >= 6.50 && lat <= 6.85 && lon >= 79.90 && lon <= 80.20) {
      fallbackArea = 'Kalutara / Kalu Ganga Basin';
    } else if (lat >= 5.95 && lat <= 6.25 && lon >= 80.15 && lon <= 80.40) {
      fallbackArea = 'Galle / Southern Province';
    } else if (lat >= 5.90 && lat <= 6.10 && lon >= 80.45 && lon <= 80.75) {
      fallbackArea = 'Matara / Nilwala Basin';
    } else if (lat >= 7.20 && lat <= 7.45 && lon >= 80.55 && lon <= 80.75) {
      fallbackArea = 'Kandy / Central Province';
    } else if (lat >= 6.60 && lat <= 6.85 && lon >= 80.30 && lon <= 80.60) {
      fallbackArea = 'Ratnapura / Sabaragamuwa';
    }

    setLocationName(fallbackArea);
    setDetailedAddress(`Pinned coordinates: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
    setResolvingArea(false);
  };

  // Additional / Contact Info Fields
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [alternatePhone, setAlternatePhone] = useState<string>('');
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [elderlyCount, setElderlyCount] = useState<number>(1);

  // Photos
  const [evidenceImages, setEvidenceImages] = useState<UploadedPhoto[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Submit States
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<GuestEmergencyRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Categories matching the screenshot
  const categories = [
    { id: 'Food & Water', label: 'Food & Water', icon: Utensils, desc: 'Clean water & cooked meals' },
    { id: 'Medical Aid', label: 'Medical Aid', icon: HeartPulse, desc: 'Emergency healthcare & medicine' },
    { id: 'Shelter', label: 'Shelter', icon: Home, desc: 'Temporary evacuation bedding' },
    { id: 'Rescue / Evacuation', label: 'Rescue / Evacuation', icon: LifeBuoy, desc: 'Boat rescue & extraction' },
    { id: 'Warm Clothing', label: 'Warm Clothing', icon: Shirt, desc: 'Blankets & dry clothing' },
    { id: 'Other', label: 'Other', icon: HelpCircle, desc: 'Other humanitarian assistance' },
  ];

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (evidenceImages.length + files.length > 3) {
      setUploadError('Maximum 3 photos allowed.');
      return;
    }

    setUploadError(null);
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds 5MB size limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: UploadedPhoto = {
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            url: event.target.result as string,
          };
          setEvidenceImages((prev) => [...prev, newPhoto].slice(0, 3));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (id: string) => {
    setEvidenceImages((prev) => prev.filter((p) => p.id !== id));
  };

  // GPS Location handler
  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lon = Number(pos.coords.longitude.toFixed(5));
        setLatitude(lat);
        setLongitude(lon);
        setLocatingUser(false);
        await resolveLocationAddress(lat, lon);
      },
      (err) => {
        setLocatingUser(false);
        alert(`Location error: ${err.message}. Please click on the map to set your location.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Step Navigations
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFromStep2 = () => {
    setErrorMessage(null);
    if (!locationName.trim() && !detailedAddress.trim()) {
      setErrorMessage('Please specify your current area or landmark.');
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFromStep3 = () => {
    setErrorMessage(null);

    // 1. Validate Contact Person Name (Mandatory)
    if (!contactName.trim() || contactName.trim().length < 2) {
      setErrorMessage('Please enter a valid contact person name.');
      return;
    }

    // 2. Validate Contact Phone Number (Must be a valid phone number)
    const trimmedPhone = contactPhone.trim();
    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    if (!trimmedPhone || /[a-zA-Z]/.test(trimmedPhone) || phoneDigits.length < 9 || phoneDigits.length > 12) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Submission
  const handleFinalSubmit = () => {
    setSubmitting(true);
    setErrorMessage(null);

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingCode = `EMG-${randomDigits}`;

    const newRecord: GuestEmergencyRecord = {
      referenceCode: trackingCode,
      contactName: contactName.trim() || 'Distressed Citizen',
      contactPhone: contactPhone.trim(),
      alternatePhone: alternatePhone.trim() || undefined,
      category,
      urgency,
      affectedCount: Number(affectedCount) || 1,
      childrenCount: Number(childrenCount) || 0,
      elderlyCount: Number(elderlyCount) || 0,
      location: locationName.trim() || 'Reported Location',
      address: detailedAddress.trim() || locationName.trim(),
      latitude,
      longitude,
      description: description.trim() || `Urgent ${category} assistance requested.`,
      evidenceImages: evidenceImages.map((img) => img.url),
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Submitted',
          title: 'Distress Signal Registered',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          notes: `Emergency request ${trackingCode} registered via Guest Emergency Portal. Priority: ${urgency}.`,
        },
      ],
    };

    // Save in window memory fallback
    if (typeof window !== 'undefined') {
      (window as any).__sahaya_emergency_records = [
        newRecord,
        ...((window as any).__sahaya_emergency_records || []),
      ];
    }

    // Save in localStorage
    try {
      const existing = localStorage.getItem('sahaya_guest_emergency_records');
      const records = existing ? JSON.parse(existing) : [];
      const safeRecord = {
        ...newRecord,
        evidenceImages: (newRecord.evidenceImages || []).slice(0, 2),
      };
      records.unshift(safeRecord);
      localStorage.setItem('sahaya_guest_emergency_records', JSON.stringify(records));
    } catch (e) {
      console.warn('Storage save error', e);
    }

    setTimeout(() => {
      setSubmitting(false);
      setSubmittedRecord(newRecord);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const copyReferenceCode = () => {
    if (!submittedRecord) return;
    navigator.clipboard.writeText(submittedRecord.referenceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <SahayaLogo size="md" light={false} showText={true} showTagline={true} />
          </Link>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              National Operational Command Active
            </span>
            <Link
              to="/emergency/track"
              className="px-3.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-300 transition"
            >
              Track Request
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-white bg-[#0d254c] hover:bg-[#153a75] shadow-md transition"
            >
              Citizen Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Breadcrumb & Header Box */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Link to="/" className="hover:text-slate-900 transition">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">Guest Emergency Request</span>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Guest Emergency Request
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  No Login Required
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Request immediate humanitarian assistance. You can submit this request as a guest without creating an account.
              </p>
            </div>
          </div>
        </div>

        {/* 4-Step Horizontal Stepper (Matching Screenshot) */}
        {!submittedRecord && (
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { num: 1, title: '1. Request Details', sub: 'Type & Situation' },
              { num: 2, title: '2. Location', sub: 'Your Current Location' },
              { num: 3, title: '3. Additional Info', sub: 'People, Photos & Details' },
              { num: 4, title: '4. Review & Submit', sub: 'Confirm & Get Tracking ID' },
            ].map((s) => {
              const isActive = currentStep === s.num;
              const isPassed = currentStep > s.num;
              return (
                <div
                  key={s.num}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-3 relative ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : isPassed
                      ? 'border-slate-200 bg-slate-50/60'
                      : 'border-transparent text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <div className="min-w-0">
                    <span className={`text-xs font-bold block truncate ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">{s.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Error message if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form / Steps */}
          <div className="lg:col-span-2">
            {submittedRecord ? (
              /* Success View */
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Emergency Request Dispatched!
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
                    Your distress signal has been routed to the District Crisis Command Hub. Nearest response teams have been alerted.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-emerald-400 text-center space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Your Emergency Tracking Reference Code
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-mono font-black text-slate-900 tracking-widest">
                      {submittedRecord.referenceCode}
                    </span>
                    <button
                      type="button"
                      onClick={copyReferenceCode}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs cursor-pointer"
                      title="Copy Tracking Code"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Please take a screenshot or write down this code to check response status anytime.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/emergency/track?code=${submittedRecord.referenceCode}`)}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Track Rescue Response in Real-Time</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRecord(null);
                      setCurrentStep(1);
                      setDescription('');
                      setEvidenceImages([]);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                {/* STEP 1: REQUEST DETAILS */}
                {currentStep === 1 && (
                  <form onSubmit={handleNextFromStep1} className="space-y-5">
                    {/* Type of Assistance */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-1 rounded bg-slate-100 text-slate-700">
                          <FileText className="w-3.5 h-3.5" />
                        </span>
                        <label className="text-xs font-bold text-slate-900">
                          Type of Assistance <span className="text-rose-600">*</span>
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2.5">
                        Choose the main type of help you need urgently.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {categories.map((cat) => {
                          const isSelected = category === cat.id;
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCategory(cat.id)}
                              className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center relative min-h-[82px] ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 font-bold shadow-2xs'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              {isSelected && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              )}
                              <Icon
                                className={`w-5 h-5 mb-1.5 ${
                                  isSelected
                                    ? 'text-emerald-700'
                                    : cat.id === 'Medical Aid'
                                    ? 'text-rose-600'
                                    : cat.id === 'Rescue / Evacuation'
                                    ? 'text-red-500'
                                    : 'text-slate-600'
                                }`}
                              />
                              <span className="text-[11px] font-bold leading-tight">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Emergency Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          Emergency Description <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                        </label>
                      </div>
                      <div className="relative">
                        <textarea
                          rows={4}
                          maxLength={500}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Briefly describe your situation and the help you need (optional)..."
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-emerald-500 text-slate-800 placeholder-slate-400"
                        />
                        <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400">
                          {description.length} / 500
                        </span>
                      </div>
                    </div>

                    {/* People in Need & Urgency Level */}
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        People in Need (Approx.) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={affectedCount}
                        onChange={(e) => setAffectedCount(e.target.value)}
                        placeholder="e.g., 5"
                        className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-semibold text-slate-800"
                      />
                    </div>

                    {/* Citizen-Reported Urgency Level * (Matching Image 2) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Citizen-Reported Urgency Level <span className="text-rose-600">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'Low', name: 'LOW', desc: 'Non-immediate supplies (3-5 days)' },
                          { id: 'Medium', name: 'MEDIUM', desc: 'Needed within 24 to 48 hours' },
                          { id: 'High', name: 'HIGH', desc: 'Vulnerable elders/children, needed in 12h' },
                          { id: 'Critical', name: 'CRITICAL', desc: 'Trapped, rising waters, or severe injury' },
                        ].map((u) => {
                          const isSelected = urgency === u.id;
                          return (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => setUrgency(u.id as any)}
                              className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <p className={`text-xs font-extrabold uppercase ${u.id === 'Critical' ? 'text-rose-700' : 'text-slate-900'}`}>
                                {u.name}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{u.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add Photo (Optional) Card matching screenshot */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Add Photo (Optional)</span>
                          <span className="text-[11px] text-slate-500">Upload a photo to help us understand the situation.</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold cursor-pointer transition flex items-center gap-1.5">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Choose Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {evidenceImages.length === 0 ? 'No file chosen' : `${evidenceImages.length} photo(s)`}
                        </span>
                      </div>
                    </div>

                    {/* Uploaded thumbnails */}
                    {evidenceImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {evidenceImages.map((img) => (
                          <div key={img.id} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(img.id)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Step 1 Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to="/"
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition"
                      >
                        Cancel
                      </Link>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: Location</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: LOCATION */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">2. Incident Location &amp; Map Pin</h2>
                        <p className="text-[11px] text-slate-500">Provide the area or drop a map pin so responders can locate you.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleUseCurrentGPS}
                        disabled={locatingUser}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold cursor-pointer transition"
                      >
                        <Compass className={`w-3.5 h-3.5 ${locatingUser ? 'animate-spin' : ''}`} />
                        <span>{locatingUser ? 'Locating...' : '📍 Use My GPS'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-800">
                            Area / Town <span className="text-rose-600">*</span>
                          </label>
                          {resolvingArea && (
                            <span className="text-[10px] text-teal-700 font-bold animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                              Detecting Town...
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          placeholder="e.g. Wellampitiya, Kelaniya"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Landmark / Specific Spot</label>
                        <input
                          type="text"
                          value={detailedAddress}
                          onChange={(e) => setDetailedAddress(e.target.value)}
                          placeholder="e.g. Near Temple rooftop, Old Ferry Road"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Interactive Leaflet Map */}
                    <div className="rounded-xl overflow-hidden border border-slate-200 [&_.leaflet-control-attribution]:hidden relative z-0 isolate">
                      <MapComponent
                        center={[latitude, longitude]}
                        zoom={13}
                        selectedLocation={[latitude, longitude]}
                        onLocationSelect={(lat, lng) => {
                          const nLat = Number(lat.toFixed(5));
                          const nLng = Number(lng.toFixed(5));
                          setLatitude(nLat);
                          setLongitude(nLng);
                          resolveLocationAddress(nLat, nLng);
                        }}
                        height="260px"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                      <span>Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
                      <span className="text-teal-700 font-sans font-semibold">Click on map to move rescue pin</span>
                    </div>

                    {/* Step 2 Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        &larr; Back
                      </button>

                      <button
                        type="button"
                        onClick={handleNextFromStep2}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: Additional Info</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: ADDITIONAL INFO */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">3. Emergency Contact &amp; Dependent Details</h2>
                      <p className="text-[11px] text-slate-500">Provide telephone numbers so boat teams and dispatchers can reach you.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1">
                          Contact Person Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Kasun Perera"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">Full name of the reporting contact.</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-900 mb-1">
                          Emergency Contact Phone <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={15}
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="e.g. 077 123 4567"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">Valid 10-digit phone number (07x xxx xxxx).</span>
                      </div>
                    </div>

                    {/* Breakdown of stranded people */}
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-2">
                        Vulnerable Dependents Breakdown
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Children Under 10</span>
                          <input
                            type="number"
                            min="0"
                            value={childrenCount}
                            onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-center font-bold text-xs"
                          />
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Elderly / Disabled Persons</span>
                          <input
                            type="number"
                            min="0"
                            value={elderlyCount}
                            onChange={(e) => setElderlyCount(parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-center font-bold text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 3 Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        &larr; Back
                      </button>

                      <button
                        type="button"
                        onClick={handleNextFromStep3}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: Review &amp; Submit</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW & SUBMIT */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    <div className="pb-2 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">4. Review &amp; Transmit Request</h2>
                      <p className="text-[11px] text-slate-500">Please verify your distress signal details before transmitting.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Need Category:</span>
                        <strong className="text-slate-900">{category}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Urgency Level:</span>
                        <span className="font-bold text-rose-700">{urgency}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">People Stranded:</span>
                        <strong className="text-slate-900">{affectedCount} individuals ({childrenCount} children, {elderlyCount} elderly)</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Contact Person:</span>
                        <strong className="text-slate-900">{contactName}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Contact Telephone:</span>
                        <strong className="text-slate-900 font-mono">{contactPhone}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Location:</span>
                        <strong className="text-slate-900 text-right truncate max-w-[240px]">{locationName}</strong>
                      </div>
                      {description.trim() && (
                        <div className="flex justify-between py-1 border-b border-slate-200">
                          <span className="text-slate-500">Situation Description:</span>
                          <span className="text-slate-800 text-right max-w-[240px] truncate italic">"{description.trim()}"</span>
                        </div>
                      )}

                      {/* Attached Disaster Photos Preview */}
                      {evidenceImages.length > 0 && (
                        <div className="pt-2">
                          <span className="text-slate-600 font-bold block mb-1.5">
                            Attached Disaster Photos ({evidenceImages.length}):
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {evidenceImages.map((img) => (
                              <div key={img.id} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white font-mono">
                                  {img.size}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Upon submission, you will receive an Emergency Tracking ID (<code className="font-bold">EMG-XXXXX</code>).</span>
                    </div>

                    {/* Step 4 Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        &larr; Back
                      </button>

                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleFinalSubmit}
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{submitting ? 'Transmitting Distress Signal...' : 'Confirm & Transmit Request'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: 3 Cards from Screenshot */}
          <div className="space-y-4">
            {/* Card 1: Need Immediate Help? (Dark Navy Card from Screenshot) */}
            <div className="bg-[#0e1726] text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Need Immediate Help?</h3>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Call the national emergency hotline for life-threatening situations.
                  </p>
                </div>
              </div>

              {/* Reddish-maroon pill container from screenshot */}
              <a
                href="tel:117"
                className="p-3 rounded-xl bg-gradient-to-r from-rose-950/80 to-[#2a0e14] border border-rose-800/50 flex items-center gap-3 transition hover:border-rose-600 cursor-pointer block"
              >
                <div className="p-2 rounded-lg bg-rose-900/60 text-rose-300 shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-black text-white tracking-wider block">117 / 1990</span>
                  <span className="text-[10px] text-rose-300 font-semibold block">24/7 Emergency Hotline</span>
                </div>
              </a>
            </div>

            {/* Card 2: How It Works (Numbered Timeline from Screenshot) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900">How It Works</h3>
              </div>

              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
                {[
                  {
                    num: 1,
                    title: 'Fill in the request details',
                    desc: 'Tell us what help you need.',
                  },
                  {
                    num: 2,
                    title: 'Provide your location',
                    desc: 'Share your current location or nearby area.',
                  },
                  {
                    num: 3,
                    title: 'Add additional information',
                    desc: 'Include people count, urgency, and a photo (optional).',
                  },
                  {
                    num: 4,
                    title: 'Submit and get a Tracking ID',
                    desc: 'You will receive a Tracking ID to check the status of your request anytime.',
                  },
                ].map((item) => (
                  <div key={item.num} className="relative pl-7 text-xs">
                    <span className="absolute left-1.5 top-0.5 w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                      {item.num}
                    </span>
                    <span className="font-bold text-slate-800 block text-[11px] leading-tight">{item.title}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: No Account Needed (Green Card from Screenshot) */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-extrabold text-emerald-950">No Account Needed</h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                  You can submit this request as a guest (without login or registration).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-6 border-t border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>&copy; {new Date().getFullYear()} SAHAYA — Humanitarian Crisis Management Platform.</span>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <Link to="/" className="hover:text-blue-700">Home</Link>
            <Link to="/emergency/track" className="hover:text-blue-700">Track Emergency Aid</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
