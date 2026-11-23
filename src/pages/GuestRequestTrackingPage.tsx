import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Compass,
  Search,
  PhoneCall,
  Clock,
  ShieldCheck,
  MapPin,
  LifeBuoy,
  HeartPulse,
  PackageCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Users,
  Check,
  ExternalLink,
  ChevronRight,
  Home,
  Truck,
  ShieldAlert
} from 'lucide-react';
import { SahayaLogo } from '../components/SahayaLogo';
import { api } from '../services/api';
import { GuestEmergencyRecord } from './GuestEmergencyRequestPage';

// Default mock records for demo / evaluator testing
const defaultMockGuestRecords: Record<string, GuestEmergencyRecord> = {
  'EMG-74892': {
    referenceCode: 'EMG-74892',
    contactName: 'Nihal Jayasuriya',
    contactPhone: '+94 77 334 8812',
    category: 'Rescue',
    urgency: 'Critical',
    affectedCount: 5,
    childrenCount: 2,
    elderlyCount: 1,
    location: 'Sedawatta Raja Maha Viharaya, Wellampitiya',
    address: 'Near Old Ferry Road, Upper floor of temple premises',
    latitude: 6.942,
    longitude: 79.887,
    description: 'River water entered ground floor at 3 AM. 5 family members trapped on upper hall.',
    evidenceImages: [],
    status: 'Dispatched',
    createdAt: '2026-11-22T05:30:00Z',
    timeline: [
      {
        status: 'Submitted',
        title: 'Emergency Signal Registered',
        time: '05:30 AM',
        notes: 'Distress signal received via SAHAYA Unauthenticated Helpline.',
      },
      {
        status: 'UnderReview',
        title: 'Priority Triage Verified',
        time: '05:42 AM',
        notes: 'Sector Coordinator assessed as Level-1 Critical. Involves 2 infants and 1 elderly person.',
      },
      {
        status: 'Dispatched',
        title: 'Navy Boat Rescue Unit #3 En Route',
        time: '06:15 AM',
        notes: 'Inflatable dinghy team dispatched from Kelani North base with life vests and first aid kits.',
      },
    ],
  },
  'EMG-51204': {
    referenceCode: 'EMG-51204',
    contactName: 'Dilini Samarasinghe',
    contactPhone: '+94 71 882 1109',
    category: 'Medical',
    urgency: 'Medium',
    affectedCount: 3,
    childrenCount: 1,
    elderlyCount: 0,
    location: 'Pugoda Bridge North, Gampaha',
    address: 'No 45, Riverside Lane, Pugoda',
    latitude: 6.974,
    longitude: 80.015,
    description: 'Diabetic patient needs emergency insulin. Road inundated by 3 feet of water.',
    evidenceImages: [],
    status: 'UnderReview',
    createdAt: '2026-11-22T06:00:00Z',
    timeline: [
      {
        status: 'Submitted',
        title: 'Medical Assistance Registered',
        time: '06:00 AM',
        notes: 'Request logged for cold-chain emergency insulin.',
      },
      {
        status: 'UnderReview',
        title: 'Medical Volunteer Courier Assigned',
        time: '06:20 AM',
        notes: 'Doctor at Wathupitiwala Base Hospital coordinating high-clearance 4x4 dispatch.',
      },
    ],
  },
  'EMG-29103': {
    referenceCode: 'EMG-29103',
    contactName: 'Sunil Shantha',
    contactPhone: '+94 75 112 3344',
    category: 'Food',
    urgency: 'High',
    affectedCount: 12,
    childrenCount: 4,
    elderlyCount: 2,
    location: 'Biyagama Community Hall',
    address: 'Biyagama Central Safe Evacuation Zone',
    latitude: 6.948,
    longitude: 79.992,
    description: 'Ration packs for 12 evacuated individuals.',
    evidenceImages: [],
    status: 'Delivered',
    createdAt: '2026-11-21T14:00:00Z',
    timeline: [
      {
        status: 'Submitted',
        title: 'Ration Aid Requested',
        time: '02:00 PM',
        notes: 'Food and drinking water distress call registered.',
      },
      {
        status: 'UnderReview',
        title: 'Logistics Depot Allocation',
        time: '02:30 PM',
        notes: '12 ration packs packed at Biyagama Logistics Depot.',
      },
      {
        status: 'Dispatched',
        title: 'Relief Truck En Route',
        time: '03:10 PM',
        notes: 'Volunteer relief truck en route.',
      },
      {
        status: 'Delivered',
        title: 'Relief Packs Delivered & Confirmed',
        time: '04:15 PM',
        notes: 'All items delivered and verified by Camp Leader.',
      },
    ],
  },
};

export const GuestRequestTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCode = searchParams.get('code') || '';

  const [searchInput, setSearchInput] = useState(urlCode);
  const [activeRecord, setActiveRecord] = useState<GuestEmergencyRecord | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Search function looking in local storage + default mock records + window memory + citizen requests
  const performSearch = async (codeToSearch: string) => {
    let raw = codeToSearch.trim();
    if (!raw) {
      setSearchError('Please enter a valid tracking code or phone number.');
      return;
    }

    // Extract code if user pasted a full URL (e.g. /emergency/track?code=EMG-12345)
    if (raw.includes('code=')) {
      const match = raw.match(/code=([^&]+)/);
      if (match) raw = decodeURIComponent(match[1]);
    }
    raw = raw.replace(/^#/, '').trim();
    const query = raw.toUpperCase();
    const cleanPhoneQuery = raw.replace(/\D/g, ''); // only digits

    setSearchError(null);

    // 1. Gather all guest records from localStorage + window fallback
    let allGuestRecords: GuestEmergencyRecord[] = [];
    try {
      const stored = localStorage.getItem('sahaya_guest_emergency_records');
      if (stored) {
        allGuestRecords = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Storage read error', e);
    }
    if (typeof window !== 'undefined' && (window as any).__sahaya_emergency_records) {
      const memRecords: GuestEmergencyRecord[] = (window as any).__sahaya_emergency_records;
      memRecords.forEach((mr) => {
        if (!allGuestRecords.some((r) => r.referenceCode === mr.referenceCode)) {
          allGuestRecords.push(mr);
        }
      });
    }

    // Search guest records
    const guestMatch = allGuestRecords.find((r) => {
      const ref = r.referenceCode.toUpperCase();
      const phoneDigits = r.contactPhone.replace(/\D/g, '');
      return (
        ref === query ||
        ref.includes(query) ||
        (query.length >= 4 && query === ref.replace('EMG-', '')) ||
        (cleanPhoneQuery.length >= 7 && phoneDigits.includes(cleanPhoneQuery))
      );
    });

    if (guestMatch) {
      setActiveRecord(guestMatch);
      setSearchParams({ code: guestMatch.referenceCode });
      return;
    }

    // 2. Search default demo mock records
    const mockValues = Object.values(defaultMockGuestRecords);
    const mockMatch = mockValues.find((r) => {
      const ref = r.referenceCode.toUpperCase();
      const phoneDigits = r.contactPhone.replace(/\D/g, '');
      return (
        ref === query ||
        ref.includes(query) ||
        (query.length >= 4 && query === ref.replace('EMG-', '')) ||
        (cleanPhoneQuery.length >= 7 && phoneDigits.includes(cleanPhoneQuery))
      );
    });

    if (mockMatch) {
      setActiveRecord(mockMatch);
      setSearchParams({ code: mockMatch.referenceCode });
      return;
    }

    // 3. Search in citizen requests (both localStorage 'sahaya_mock_requests' and api.getRequests())
    try {
      let citRequests: any[] = [];
      const storedCit = localStorage.getItem('sahaya_mock_requests');
      if (storedCit) {
        citRequests = JSON.parse(storedCit);
      }
      if (!citRequests || citRequests.length === 0) {
        citRequests = await api.getRequests();
      }

      const foundCit = citRequests.find((cr) => {
        const idUpper = (cr.id || '').toUpperCase();
        const citPhoneDigits = (cr.citizenPhone || cr.contactPhone || '').replace(/\D/g, '');
        return (
          idUpper === query ||
          idUpper.includes(query) ||
          (cleanPhoneQuery.length >= 7 && citPhoneDigits.includes(cleanPhoneQuery))
        );
      });

      if (foundCit) {
        const mappedRecord: GuestEmergencyRecord = {
          referenceCode: foundCit.id,
          contactName: foundCit.citizenName || 'Citizen',
          contactPhone: foundCit.citizenPhone || foundCit.contactPhone || '+94 77 123 4567',
          category: foundCit.category || 'Rescue',
          urgency: (foundCit.urgency === 'Immediate' ? 'Critical' : foundCit.urgency) || 'High',
          affectedCount: foundCit.peopleCount || foundCit.affectedCount || 1,
          childrenCount: 0,
          elderlyCount: 0,
          location: foundCit.location || foundCit.address || 'Sri Lanka',
          address: foundCit.address || foundCit.location || '',
          latitude: foundCit.latitude || 6.942,
          longitude: foundCit.longitude || 79.887,
          description: foundCit.description || 'Assistance requested.',
          evidenceImages: foundCit.evidenceImages || [],
          status:
            foundCit.status === 'Resolved'
              ? 'Delivered'
              : foundCit.status === 'InProgress' || foundCit.status === 'Assigned'
                ? 'Dispatched'
                : 'Submitted',
          createdAt: foundCit.createdAt || new Date().toISOString(),
          timeline:
            foundCit.statusHistory && foundCit.statusHistory.length > 0
              ? foundCit.statusHistory.map((h: any) => ({
                status: h.newStatus,
                title: `${h.newStatus} - ${h.changedByName || 'Coordinator'}`,
                time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                notes: h.notes || 'Status updated by field coordination team.',
              }))
              : [
                {
                  status: foundCit.status || 'Submitted',
                  title: `Request ${foundCit.status || 'Registered'}`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  notes: 'Request registered in SAHAYA Humanitarian Coordination Hub.',
                },
              ],
        };

        setActiveRecord(mappedRecord);
        setSearchParams({ code: mappedRecord.referenceCode });
        return;
      }
    } catch (citErr) {
      console.warn('Citizen requests search error', citErr);
    }

    setSearchError(`No emergency request found matching "${codeToSearch}". Please verify the code or phone number.`);
    setActiveRecord(null);
  };

  useEffect(() => {
    if (urlCode) {
      setSearchInput(urlCode);
      performSearch(urlCode);
    }
  }, [urlCode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 1;
      case 'UnderReview':
        return 2;
      case 'Dispatched':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = activeRecord ? getStatusStepIndex(activeRecord.status) : 1;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVBAR (Matching SAHAYA White Clean Navbar) */}
      <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <SahayaLogo size="md" light={false} showText={true} showTagline={true} />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/emergency/request"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#ef4444] hover:bg-[#dc2626] shadow-md transition flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Request Help</span>
            </Link>

            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition"
            >
              Citizen Login
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SEARCH BANNER (Navy + Dual Curve Ribbon) */}
      <section className="relative bg-[#0b1e3b] text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 font-semibold">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>&gt;</span>
            <span className="text-white font-bold">Track Emergency Request</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>SAHAYA Live Response Tracker</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Track Emergency Request Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
            Check real-time rescue dispatch, priority review, and volunteer relief updates using your Emergency Reference Code.
          </p>

          {/* Elevated Clean Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-2">
            <div className="relative bg-white rounded-2xl p-1.5 shadow-2xl flex items-center border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Reference Code (e.g. EMG-74892) or Phone Number"
                className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0d254c] hover:bg-[#153a75] text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer shrink-0"
              >
                Track Status
              </button>
            </div>
          </form>

          {searchError && (
            <div className="max-w-xl mx-auto p-3 rounded-xl bg-rose-500/90 text-white text-xs text-center font-bold shadow-md">
              {searchError}
            </div>
          )}
        </div>

        {/* Dual Curve Ribbon at Hero Bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg className="w-full h-6 block" viewBox="0 0 1440 40" fill="none" preserveAspectRatio="none">
            <path d="M0,20 C360,40 720,0 1440,20 L1440,40 L0,40 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* 3. ACTIVE RECORD TRACKER VIEW */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeRecord ? (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-mono text-xs font-black tracking-wider">
                    {activeRecord.referenceCode}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${activeRecord.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : activeRecord.status === 'Dispatched'
                        ? 'bg-teal-50 text-teal-800 border-teal-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                  >
                    {activeRecord.status === 'Delivered'
                      ? '✓ Aid Delivered / Safe'
                      : activeRecord.status === 'Dispatched'
                        ? '⚡ Rescue Team Dispatched'
                        : '⏳ Triage Review in Progress'}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {activeRecord.urgency} Urgency
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeRecord.category} Assistance for {activeRecord.affectedCount} Stranded Individuals
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{activeRecord.location}</span>
                </p>
              </div>

              <div className="flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 text-xs text-slate-500">
                <span>Contact Person:</span>
                <span className="font-bold text-slate-900 text-sm">{activeRecord.contactName}</span>
                <span className="font-mono text-slate-700 font-bold mt-0.5">{activeRecord.contactPhone}</span>
              </div>
            </div>

            {/* Visual Status Progress Stepper */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-600" />
                Live Response Stepper
              </h3>

              {/* Step Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { step: 1, title: '1. Registered', sub: 'Signal logged' },
                  { step: 2, title: '2. Triage Review', sub: 'Severity verified' },
                  { step: 3, title: '3. Team Dispatched', sub: 'Rescue en route' },
                  { step: 4, title: '4. Aid Delivered', sub: 'Mission resolved' },
                ].map((s) => {
                  const isDone = currentStep >= s.step;
                  const isCurrent = currentStep === s.step;
                  return (
                    <div
                      key={s.step}
                      className={`p-3.5 rounded-2xl border transition ${isCurrent
                        ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                        : isDone
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-slate-50/40 border-slate-100 opacity-60'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={`text-xs font-bold ${isCurrent ? 'text-teal-900' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {s.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block pl-6">{s.sub}</span>
                    </div>
                  );
                })}
              </div>

              {/* Linear Stepper Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${currentStep === 4
                    ? 'w-full bg-emerald-500'
                    : currentStep === 3
                      ? 'w-3/4 bg-teal-500'
                      : currentStep === 2
                        ? 'w-1/2 bg-amber-500'
                        : 'w-1/4 bg-blue-500'
                    }`}
                />
              </div>

              {/* Status History Timeline */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mission Event Log
                </h4>
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeRecord.timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-8 text-xs space-y-1">
                      <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white ring-2 ring-teal-600/30" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{event.title}</span>
                        <span className="text-[11px] font-mono text-slate-500">{event.time}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                        {event.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Safety Guidance Card */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
              <h4 className="font-bold text-amber-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Emergency Safety Guidance while Waiting for Responders:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-amber-900 text-xs pl-1 font-medium">
                <li>Remain on the highest safe floor or rooftop if floodwaters continue rising.</li>
                <li>Conserve your mobile phone battery — keep calls brief for emergency coordination.</li>
                <li>Do not attempt to walk or swim through fast-moving water currents above knee level.</li>
                <li>Wave a brightly colored cloth, whistle, or flash a phone light when response boats approach.</li>
              </ul>
            </div>

            {/* Hotline Actions */}
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:117"
                className="flex-1 min-w-[200px] py-3.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <PhoneCall className="w-4 h-4 text-red-600" />
                <span>Call Disaster Operations (117)</span>
              </a>
              <a
                href="tel:1990"
                className="flex-1 min-w-[200px] py-3.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <HeartPulse className="w-4 h-4 text-teal-600" />
                <span>Call Suwa Seriya Medical (1990)</span>
              </a>
              <Link
                to="/emergency/request"
                className="py-3.5 px-5 rounded-xl bg-[#0d254c] hover:bg-[#153a75] text-white text-xs font-bold transition flex items-center gap-2 shadow-md"
              >
                <span>New Emergency Request</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 space-y-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 border border-teal-200 mx-auto flex items-center justify-center">
              <Compass className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Enter Your Emergency Reference Code</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Enter your Reference Code (e.g. <span className="font-mono font-bold text-slate-800">EMG-84920</span>) or your Contact Phone Number in the search box above to view live rescue dispatch progress.
            </p>
          </div>
        )}
      </main>

      {/* 4. FOOTER */}
      <footer className="mt-auto pt-8 border-t border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <span>&copy; {new Date().getFullYear()} SAHAYA — Humanitarian Crisis Management Platform.</span>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <Link to="/" className="hover:text-blue-700">Home</Link>
            <Link to="/citizen/safety-guide" className="hover:text-blue-700">Safety Guides</Link>
            <Link to="/emergency/request" className="hover:text-blue-700">Emergency Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
