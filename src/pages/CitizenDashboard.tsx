import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LifeBuoy,
  PlusCircle,
  Clock,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Home,
  Bell,
  HelpCircle,
  Activity,
  Layers,
  PhoneCall,
  UserCheck,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Megaphone,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { AssistanceRequest, Shelter, NotificationItem } from '../types';
import { StatusBadge, UrgencyBadge, getStatusHumanLabel, getStatusExplanation } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import { PageHeader } from '../components/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { MapComponent } from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Resolved'>('All');

  // Filter requests according to tab
  const filteredRequests = requests.filter(r => {
    if (statusFilter === 'Active') {
      return r.status !== 'Resolved' && r.status !== 'Rejected' && r.status !== 'Cancelled';
    }
    if (statusFilter === 'Resolved') {
      return r.status === 'Resolved';
    }
    return true;
  });

  const displayList = filteredRequests.slice(0, 10);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reqs, shlts, notifs] = await Promise.all([
        api.getRequests(),
        api.getShelters(true),
        api.getNotifications(),
      ]);
      setRequests(reqs);
      setShelters(shlts);
      setNotifications(notifs);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load citizen records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading Citizen Portal & Emergency Requests..." count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  // Calculate 5 specified widget KPIs
  const totalSubmitted = requests.length;
  const pendingRequests = requests.filter(
    r => r.status === 'Submitted' || r.status === 'UnderReview'
  ).length;
  const approvedRequests = requests.filter(
    r => r.status === 'Approved' || r.status === 'InProgress'
  ).length;
  const completedRequests = requests.filter(
    r => r.status === 'Resolved'
  ).length;

  // Recent request updates (most recently updated requests)
  const recentUpdates = [...requests].sort(
    (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`Welcome, ${user?.fullName || 'Citizen'}`}
        subtitle="Submit emergency assistance requests, monitor real-time triage progress, and locate nearby humanitarian relief centres."
        portalBadge="Citizen Portal"
        breadcrumbs={[
          { label: 'Citizen Home', path: '/citizen/dashboard' },
          { label: 'Operations & Requests' },
        ]}
        actions={
          <Link
            to="/request/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Emergency Request
          </Link>
        }
      />

      {/* 4 Vibrant Action Cards (Matching platform UI theme & visual hierarchy) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Emergency Aid SOS (Red) */}
        <Link
          to="/citizen/create-request"
          className="group rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white p-5 shadow-lg shadow-red-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Instant SOS
            </span>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="font-extrabold text-sm leading-snug block">Submit Aid Request</span>
              <span className="text-[11px] text-red-100 font-medium">Food, water, rescue & medical</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Card 2: Find Safe Shelters (Teal / Emerald) */}
        <Link
          to="/shelters"
          className="group rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white p-5 shadow-lg shadow-teal-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              {shelters.filter(s => s.availableCapacity > 0).length} Open
            </span>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="font-extrabold text-sm leading-snug block">Nearby Safe Camps</span>
              <span className="text-[11px] text-teal-100 font-medium">Verified shelters with beds</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Card 3: Disaster Safety Guides (Blue) */}
        <Link
          to="/citizen/safety-guide"
          className="group rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Bilingual Guides
            </span>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="font-extrabold text-sm leading-snug block">Crisis Safety Guides</span>
              <span className="text-[11px] text-blue-100 font-medium">Floods, landslides & storms</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Card 4: 24/7 National Emergency Hotline (Amber / Slate) */}
        <a
          href="tel:117"
          className="group rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 p-5 shadow-lg shadow-slate-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
              24/7 Hotline
            </span>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="font-extrabold text-sm leading-snug block">Call Hotline: 117 / 1990</span>
              <span className="text-[11px] text-slate-300 font-medium">Disaster center & 1990 Suwa Seriya</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0 text-amber-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </a>
      </div>

      {/* Emergency Advisory Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold">Active Weather Warning — Humanitarian Response Underway</p>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            Severe flooding has affected southern river basins. If waters are entering your home or roads are impassable, please request aid immediately and move to verified high-ground relief shelters listed below.
          </p>
        </div>
      </div>

      {/* Clearly Visible Entry: Emergency Help & Safety Guide — හදිසි ආපදා සහ ආරක්ෂක මාර්ගෝපදේශය */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 text-white p-5 sm:p-7 shadow-lg border border-teal-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-teal-400/30 shadow-md bg-slate-800">
              <img
                src="/illustrations/flood-safety.webp"
                alt="Emergency Help & Safety Guide — හදිසි ආපදා සහ ආරක්ෂක මාර්ගෝපදේශය"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('.jpg')) {
                    target.src = '/illustrations/flood-safety.jpg';
                  }
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Bilingual Safety Guide / ද්විභාෂා ආරක්ෂක මාර්ගෝපදේශය</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Emergency Help & Safety Guide
              </h2>
              <h3 className="text-sm font-bold text-teal-300">
                හදිසි ආපදා සහ ආරක්ෂක මාර්ගෝපදේශය
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Learn what to do during emergencies through simple pictures and step-by-step safety instructions.
              </p>
              <p className="text-xs text-teal-200/90 leading-relaxed">
                හදිසි අවස්ථාවලදී ආරක්ෂිතව ක්රියා කළ යුතු ආකාරය සරල පින්තූර සහ පියවරෙන් පියවර උපදෙස් මඟින් ඉගෙන ගන්න.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <Link
              to="/citizen/safety-guide"
              id="citizen-dashboard-safety-guide-btn"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Safety Guide / උපදෙස් බලන්න</span>
            </Link>
            <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400">
              <span>12 Disaster Guides</span>
              <span>•</span>
              <span className="text-teal-300 font-medium">English &amp; සිංහල</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Required Dashboard Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Requests Submitted"
          value={totalSubmitted}
          subtitle="Your recorded crisis reports"
          icon={<LifeBuoy className="w-6 h-6" />}
          variant="default"
        />
        <StatCard
          title="Pending Review"
          value={pendingRequests}
          subtitle="Under triage by coordinators"
          icon={<Clock className="w-6 h-6" />}
          variant={pendingRequests > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Approved Aid"
          value={approvedRequests}
          subtitle="Resource or dispatch underway"
          icon={<Activity className="w-6 h-6" />}
          variant="default"
        />
        <StatCard
          title="Completed Requests"
          value={completedRequests}
          subtitle="Assistance delivered & verified"
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="success"
        />
      </div>

      {/* Main Content Layout: Left 2 Cols (Requests & Recent Updates) + Right 1 Col (Shelters & Support) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Recent Request Updates & Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Widget 5: Recent Request Updates */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Your Assistance Requests & Status Timeline
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time status updates and delivery tracking for your emergency petitions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/request/new"
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition"
                >
                  + New Request
                </Link>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-slate-100 max-w-fit">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({requests.length})
              </button>
              <button
                onClick={() => setStatusFilter('Active')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'Active' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active / In Progress ({pendingRequests + approvedRequests})
              </button>
              <button
                onClick={() => setStatusFilter('Resolved')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'Resolved' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Delivered ({completedRequests})
              </button>
            </div>

            {displayList.length === 0 ? (
              <EmptyState
                title={statusFilter === 'All' ? "No Emergency Requests Found" : `No ${statusFilter} Requests Found`}
                description={
                  statusFilter === 'All'
                    ? "If you or someone in your community needs rescue, medical care, food, or clean water, submit a request."
                    : "No requests match the selected filter. Switch to 'All' to view your complete assistance history."
                }
                icon={<LifeBuoy className="w-8 h-8" />}
                actionText="Create Emergency Request"
                onAction={() => window.location.href = '/request/new'}
              />
            ) : (
              <div className="space-y-3">
                {displayList.map(req => {
                  const isPending = req.status === 'Submitted' || req.status === 'UnderReview';
                  const isApproved = req.status === 'Approved' || req.status === 'InProgress';
                  const isResolved = req.status === 'Resolved';

                  return (
                    <Link
                      key={req.id}
                      to={`/requests/${req.id}`}
                      className="block p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/90 hover:border-teal-500/50 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={req.status} size="sm" />
                            <UrgencyBadge urgency={req.urgency} size="sm" />
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {req.category}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Logged: {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-600 transition truncate">
                            {req.title}
                          </h3>

                          {/* Reassuring Plain-English Status Meaning */}
                          <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900 leading-relaxed">
                            <span className="font-bold">{getStatusHumanLabel(req.status)}: </span>
                            <span className="text-teal-800">{getStatusExplanation(req.status)}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[200px]">{req.address}</span>
                            </span>
                            <span>{req.affectedCount} person(s) affected</span>
                            {req.contactPhone && (
                              <span>Contact: {req.contactPhone}</span>
                            )}
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-white group-hover:bg-teal-50 text-slate-400 group-hover:text-teal-600 transition shrink-0 border border-slate-200/60">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Visual Status Tracking Stepper */}
                      <div className="mt-4 pt-3 border-t border-slate-200/70">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                          <span className={isPending ? 'text-amber-600 font-bold' : 'text-slate-400'}>1. Triage Review</span>
                          <span className={isApproved ? 'text-teal-600 font-bold' : 'text-slate-400'}>2. Approved & Dispatched</span>
                          <span className={isResolved ? 'text-emerald-600 font-bold' : 'text-slate-400'}>3. Aid Delivered</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isResolved ? 'w-full bg-emerald-500' : isApproved ? 'w-2/3 bg-teal-500' : 'w-1/3 bg-amber-500'
                            }`}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Nearby Assistance & Relief Centres */}
        <div className="space-y-6">
          {/* Relief Shelters Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-4 h-4 text-teal-600" />
                Nearby Assistance Centres
              </h2>
              <Link to="/shelters" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                View All ({shelters.length})
              </Link>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200">
              <MapComponent
                shelters={shelters}
                requests={requests}
                height="220px"
                center={[6.0535, 80.2210]}
                zoom={11}
              />
            </div>

            <div className="space-y-2.5">
              {shelters.slice(0, 3).map(s => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-[180px]">{s.name}</h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${s.availableCapacity > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {s.availableCapacity} spots
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{s.address}</p>
                  <p className="text-[10px] text-teal-700 font-semibold mt-1 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" /> {s.contactPhone}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Help & Support Advisory Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Emergency Help & Hotline</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In life-threatening situations requiring immediate aquatic rescue or medical evacuation, contact the Disaster Management Centre (DMC) emergency line:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">National Crisis Hotline</p>
                <p className="text-lg font-black text-amber-400">117 / 1990</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                24/7 Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
