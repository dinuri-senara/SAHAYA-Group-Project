import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LifeBuoy,
  MapPin,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Users,
  Phone,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Utensils,
  Droplets,
  HeartPulse,
  Home,
  Truck,
  Shirt,
  Sparkle,
  HelpCircle,
  Check,
  Camera,
  UploadCloud,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { CrisisEvent } from '../types';
import { MapComponent } from '../components/MapComponent';

export const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CrisisEvent[]>([]);

  // Wizard Step State (1: Aid Type & Details, 2: People & Location, 3: Review & Submit)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<number>(1); // 1 = Food Rations
  const [urgency, setUrgency] = useState<number>(2); // 2 = Medium
  const [affectedCount, setAffectedCount] = useState<number>(4);
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(6.0535);
  const [longitude, setLongitude] = useState<number>(80.2210);
  const [contactPhone, setContactPhone] = useState('');
  const [crisisEventId, setCrisisEventId] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Evidence / Damage Photos (Coursework 1.1 A)
  interface UploadedPhoto {
    id: string;
    name: string;
    size: string;
    url: string;
  }
  const [evidenceImages, setEvidenceImages] = useState<UploadedPhoto[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (evidenceImages.length + files.length > 3) {
      setUploadError('Maximum 3 damage photos allowed per assistance request.');
      return;
    }

    setUploadError(null);
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds maximum 5MB size limit.`);
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
    setUploadError(null);
  };

  useEffect(() => {
    async function loadEvents() {
      try {
        const evs = await api.getCrisisEvents(true);
        setEvents(evs);
        if (evs.length > 0) {
          setCrisisEventId(evs[0].id);
          setLatitude(evs[0].latitude);
          setLongitude(evs[0].longitude);
        }
      } catch {
        // Ignored
      }
    }
    loadEvents();
  }, []);

  const handleLocationPicked = (lat: number, lon: number) => {
    setLatitude(lat);
    setLongitude(lon);
  };

  const validateStep1 = (): boolean => {
    if (!title.trim()) {
      setError('Please provide a brief request title describing what is needed.');
      return false;
    }
    if (!description.trim()) {
      setError('Please provide a short description of your situation and immediate needs.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!address.trim()) {
      setError('Please enter a street address or recognizable landmark.');
      return false;
    }
    if (affectedCount < 1) {
      setError('Number of affected individuals must be at least 1.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setError(null);
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const created = await api.createRequest({
        crisisEventId: crisisEventId || undefined,
        category,
        title,
        description,
        urgency,
        affectedCount: Number(affectedCount),
        specialNeeds: specialNeeds.trim() || undefined,
        address,
        latitude: Number(latitude),
        longitude: Number(longitude),
        contactPhone: contactPhone.trim() || undefined,
        evidenceImages: evidenceImages.map((img) => img.url),
      });

      navigate(`/requests/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 1, name: 'Food Rations', icon: Utensils, desc: 'Dry rations, cooked meals, infant nutrition' },
    { id: 2, name: 'Drinking Water', icon: Droplets, desc: 'Bottled clean water, purification tablets' },
    { id: 3, name: 'Medical Assistance', icon: HeartPulse, desc: 'First aid, prescription refills, injuries' },
    { id: 4, name: 'Emergency Shelter', icon: Home, desc: 'Temporary bedding, evacuation center placement' },
    { id: 5, name: 'Rescue / Transport', icon: Truck, desc: 'Aquatic boat rescue, transport from rising waters' },
    { id: 6, name: 'Warm Clothing', icon: Shirt, desc: 'Dry garments, blankets, rain protection' },
    { id: 7, name: 'Sanitation & Hygiene', icon: Sparkle, desc: 'Soap, hygiene kits, sanitary supplies' },
    { id: 8, name: 'Other Support', icon: HelpCircle, desc: 'Specialized assistance or general relief' },
  ];

  const urgencies = [
    { id: 1, name: 'Low', desc: 'Non-immediate supplies (3-5 days)' },
    { id: 2, name: 'Medium', desc: 'Needed within 24 to 48 hours' },
    { id: 3, name: 'High', desc: 'Vulnerable elders/children, needed in 12h' },
    { id: 4, name: 'Critical', desc: 'Trapped, rising waters, or severe injury' },
  ];

  // Quick fill helper for distressed citizens
  const applyQuickTemplate = (templateTitle: string, templateDesc: string, catId: number, urgId: number) => {
    setTitle(templateTitle);
    setDescription(templateDesc);
    setCategory(catId);
    setUrgency(urgId);
  };

  const selectedCategoryObj = categories.find(c => c.id === category) || categories[0];
  const selectedUrgencyObj = urgencies.find(u => u.id === urgency) || urgencies[1];
  const linkedEvent = events.find(e => e.id === crisisEventId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <LifeBuoy className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Request Emergency Assistance
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Follow 3 simple steps to submit your needs. Your request is automatically prioritized by AI and reviewed by human coordinators.
            </p>
          </div>
          <Link
            to="/citizen/dashboard"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition flex items-center gap-1 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* Wizard Step Progress Indicator */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-2">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                step === 1
                  ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                  : step > 1
                  ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                  : 'border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-extrabold">
                {step > 1 ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    1
                  </span>
                )}
                <span>1. Aid Needs</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">Category & Situation</p>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                step === 2
                  ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                  : step > 2
                  ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                  : 'border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-extrabold">
                {step > 2 ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    2
                  </span>
                )}
                <span>2. Location & People</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">Address & GPS Pin</p>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1() && validateStep2()) setStep(3);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                step === 3
                  ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                  : 'border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-extrabold">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  3
                </span>
                <span>3. Review & Submit</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">Verify & Confirm</p>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* STEP 1: Aid Needs & Description */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Quick-fill template aids */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80">
            <p className="text-xs font-bold text-teal-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Need to write quickly? Click a common situation to pre-fill details:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyQuickTemplate(
                  'Family trapped by rising floodwaters, urgent evacuation boat required',
                  'Water levels have reached chest height inside our residence. Roads are completely blocked. We need immediate aquatic rescue and transport to a safe shelter.',
                  5, // Rescue
                  4  // Critical
                )}
                className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 hover:border-teal-400 text-xs font-semibold text-teal-800 transition cursor-pointer"
              >
                🌊 Flood Rescue
              </button>
              <button
                type="button"
                onClick={() => applyQuickTemplate(
                  'Urgent drinking water and dry food rations needed for family',
                  'Local well and water supplies are contaminated by runoff. We are without potable water and dry food. Family includes children.',
                  2, // Water
                  3  // High
                )}
                className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 hover:border-teal-400 text-xs font-semibold text-teal-800 transition cursor-pointer"
              >
                💧 Clean Water & Food
              </button>
              <button
                type="button"
                onClick={() => applyQuickTemplate(
                  'Medical assistance: Elderly patient needs prescription medication and wound dressing',
                  'An elderly family member is stranded with limited mobility, running out of essential chronic prescription meds, and needs wound care.',
                  3, // Medical
                  3  // High
                )}
                className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 hover:border-teal-400 text-xs font-semibold text-teal-800 transition cursor-pointer"
              >
                🏥 Medical & Medicine
              </button>
            </div>
          </div>

          {/* Aid Category Cards */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Select Primary Type of Assistance *
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the category that best represents your most pressing emergency requirement.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map(c => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`p-2 rounded-lg ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                    </div>
                    <div className="mt-2.5">
                      <p className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-900'}`}>
                        {c.name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 leading-tight">
                        {c.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Linked Crisis Incident (Optional) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Linked Disaster Incident <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <select
                value={crisisEventId}
                onChange={e => setCrisisEventId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:border-teal-500 focus:outline-none"
              >
                <option value="">General Disaster Aid (No Incident Linked)</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Situation Narrative & Urgency */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-teal-600" />
              Explain Your Situation & Urgency
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Request Summary Title * <span className="text-teal-600 font-normal">(Keep it short & specific)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 5 people stranded on upper floor, floodwaters rising, urgent clean water needed"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Situation Description * <span className="text-slate-400 font-normal">(Explain hazards, water level, or immediate injuries)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe current road conditions, water height, how many hours you have been stranded, and exact urgent supplies required..."
                rows={4}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none leading-relaxed"
                required
              />
            </div>

            {/* Urgency Selection Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Citizen-Reported Urgency Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {urgencies.map(u => (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => setUrgency(u.id)}
                    className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                      urgency === u.id
                        ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className={`text-xs font-extrabold uppercase ${u.id === 4 ? 'text-red-700' : 'text-slate-900'}`}>
                      {u.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{u.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Supporting Evidence & Disaster Photos (Coursework 1.1 A) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-teal-600" />
                  Supporting Evidence & Disaster Photos
                  <span className="text-[10px] font-normal text-slate-400 normal-case">(Optional - Up to 3 photos)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Attach photos of rising floodwaters, damaged structures, or road obstacles to assist rescue teams in verifying severity.
                </p>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Dropzone */}
              <div className="relative border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-5 text-center transition bg-slate-50/60 hover:bg-teal-50/20">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  multiple
                  disabled={evidenceImages.length >= 3}
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  id="damage-photo-upload"
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="p-3 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200/60">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {evidenceImages.length >= 3
                        ? 'Maximum 3 photos reached'
                        : 'Click or drag & drop disaster damage photos here'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supports JPG, PNG, WEBP (Max 5MB per photo)
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Thumbnails Preview */}
              {evidenceImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {evidenceImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs"
                    >
                      <div className="h-28 w-full overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        />
                      </div>
                      <div className="p-2 bg-white flex items-center justify-between text-[11px]">
                        <span className="truncate max-w-[120px] font-semibold text-slate-700" title={img.name}>
                          {img.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{img.size}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(img.id)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white transition cursor-pointer"
                        title="Remove Photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate('/citizen/dashboard')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center gap-2"
            >
              Continue to Step 2: Location & People
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: People & Location */}
      {step === 2 && (
        <div className="space-y-6">
          {/* People & Contact Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              People & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Affected Individuals *
                </label>
                <input
                  type="number"
                  min="1"
                  value={affectedCount}
                  onChange={e => setAffectedCount(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none font-bold"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">Helps coordinators allocate the right volume of rations or boat seats.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Direct line for the field volunteer or relief driver to call you.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Vulnerabilities or Medical Needs <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={specialNeeds}
                onChange={e => setSpecialNeeds(e.target.value)}
                placeholder="e.g. 1 newborn needing infant formula, 1 elderly diabetic with insulin requirements"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Infants, elderly family, pregnant mothers, disabilities, or chronic illnesses.</p>
            </div>
          </div>

          {/* Geospatial Address & Map Pin */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                Location & Geospatial Map Pin
              </h2>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                Click map to reposition rescue pin
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Street Address or Known Landmark *
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. No. 42 Riverside Cross Road, Galle (near Saman Temple)"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <MapComponent
                center={[latitude, longitude]}
                zoom={13}
                selectedLocation={[latitude, longitude]}
                onLocationSelect={handleLocationPicked}
                height="280px"
              />
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span>Latitude: <strong>{latitude.toFixed(4)}</strong></span>
                <span>Longitude: <strong>{longitude.toFixed(4)}</strong></span>
                <span className="text-teal-700 font-semibold font-sans">Pin saved</span>
              </div>
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Step 1
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center gap-2"
            >
              Review Details & Confirm
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Confirmation */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  Step 3: Review Before Submitting
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please verify your details. Once submitted, our AI engine will assess urgency and alert local response teams.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                Edit Information
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aid Category</span>
                <p className="font-bold text-sm text-slate-900">{selectedCategoryObj.name}</p>
                <p className="text-[11px] text-slate-500">{selectedCategoryObj.desc}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reported Urgency</span>
                <p className={`font-bold text-sm ${urgency === 4 ? 'text-red-700' : 'text-slate-900'}`}>
                  {selectedUrgencyObj.name} Priority
                </p>
                <p className="text-[11px] text-slate-500">{selectedUrgencyObj.desc}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{title}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Situation Narrative</span>
                <p className="text-slate-700 mt-0.5 leading-relaxed">{description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Affected People</span>
                <p className="font-bold text-slate-900 mt-1">{affectedCount} individuals</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</span>
                <p className="font-bold text-slate-900 mt-1">{contactPhone || 'Not provided'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Incident</span>
                <p className="font-bold text-slate-900 mt-1 truncate">{linkedEvent?.title || 'General Relief'}</p>
              </div>
            </div>

            {specialNeeds && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Special Vulnerabilities:</span>
                <p className="font-semibold mt-0.5">{specialNeeds}</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location Address</span>
              <p className="font-bold text-slate-900">{address}</p>
              <p className="font-mono text-[11px] text-slate-500">
                GPS Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            </div>

            {/* Attached Damage Evidence Photos Preview (Coursework 1.1 A) */}
            {evidenceImages.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Attached Damage Evidence ({evidenceImages.length} photos)
                </span>
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {evidenceImages.map((img) => (
                    <div key={img.id} className="h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation of What Happens Next */}
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                What happens after you click Submit:
              </p>
              <ul className="list-disc list-inside space-y-1 text-teal-800 text-[11px] pl-1">
                <li>Your request will immediately enter the regional operations command queue.</li>
                <li>AI Triage will assess resource bundles and check for duplicate petitions to prevent delays.</li>
                <li>An authorized emergency coordinator will review and allocate supplies or dispatch a volunteer.</li>
                <li>You will receive real-time status updates right on your Citizen Dashboard.</li>
              </ul>
            </div>
          </div>

          {/* Step 3 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Step 2
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/20 transition cursor-pointer flex items-center gap-2"
            >
              {loading ? 'Submitting & Running AI Triage...' : 'Confirm & Submit Emergency Request'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
