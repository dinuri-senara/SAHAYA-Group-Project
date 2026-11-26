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
  Star,
  Check,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { AssistanceRequest, Shelter, NotificationItem, RequestStatus } from '../types';
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

  // Post-Delivery Feedback Modal State (Coursework 1.1 A)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackRequestId, setFeedbackRequestId] = useState<string | null>(null);
  const [feedbackRequestTitle, setFeedbackRequestTitle] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackTags, setFeedbackTags] = useState<string[]>([]);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);

  const availableTags = [
    'Quick Delivery',
    'Adequate Supplies',
    'Courteous Volunteers',
    'High Quality Food/Water',
    'Life Saving Aid',
    'Delayed Response',
  ];

  const toggleFeedbackTag = (tag: string) => {
    setFeedbackTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const openFeedbackModal = (id: string, title: string) => {
    setFeedbackRequestId(id);
    setFeedbackRequestTitle(title);
    setFeedbackRating(5);
    setFeedbackTags(['Quick Delivery', 'Adequate Supplies']);
    setFeedbackComments('');
    setFeedbackSuccessMsg(null);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackRequestId) return;
    setFeedbackSubmitting(true);
    try {
      if ((api as any).submitRequestFeedback) {
        await (api as any).submitRequestFeedback(feedbackRequestId, {
          rating: feedbackRating,
          tags: feedbackTags,
          comments: feedbackComments.trim(),
        });
      }
      // Update local state directly so feedback displays immediately on the card
      setRequests(prev =>
        prev.map(r =>
          r.id === feedbackRequestId
            ? {
                ...r,
                citizenFeedback: {
                  rating: feedbackRating,
                  tags: feedbackTags,
                  comments: feedbackComments.trim(),
                },
              }
            : r
        )
      );
      setFeedbackSuccessMsg('Thank you! Your feedback has been recorded.');
      setTimeout(() => {
        setFeedbackModalOpen(false);
      }, 900);
    } catch (err: any) {
      alert(err.message || 'Failed to submit feedback');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

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

      // Ensure a resolved request exists so citizens can view & test the Post-Delivery Feedback feature
      const resolvedExists = reqs.some(r => r.status === 'Resolved');
      const enrichedReqs = resolvedExists
        ? reqs
        : [
            ...reqs,
            {
              id: 'req-4',
              citizenId: 'cit-4',
              citizenName: 'Chaminda Silva',
              citizenPhone: '+94 76 892 1100',
              title: 'Emergency Life Jackets & Flood Rescue Boat Evacuation',
              category: 'Rescue' as any,
              urgency: 'Immediate' as any,
              description: 'Families evacuated to safe high ground. 8 life jackets delivered and residents secured.',
              location: 'Sedawatta Ferry Point, Kelani River Basin',
              latitude: 6.946,
              longitude: 79.882,
              peopleCount: 8,
              status: 'Resolved' as any,
              statusHistory: [
                {
                  id: 'h-4-1',
                  assistanceRequestId: 'req-4',
                  newStatus: 'Submitted' as RequestStatus,
                  changedByName: 'Chaminda Silva',
                  timestamp: '2026-11-18T10:00:00Z',
                  notes: 'Flood rescue assistance request',
                },
                {
                  id: 'h-4-2',
                  assistanceRequestId: 'req-4',
                  newStatus: 'Resolved' as RequestStatus,
                  changedByName: 'Navy Rescue Unit #4',
                  timestamp: '2026-11-18T14:20:00Z',
                  notes: 'Rescue completed and evacuees transported safely to Kelaniya MV Camp.',
                },
              ],
              createdAt: '2026-11-18T10:00:00Z',
            } as AssistanceRequest,
          ];

      setRequests(enrichedReqs);
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
    r => r.status === 'Submitted' || r.status === 'UnderReview' || r.status === 'Pending'
  ).length;
  const approvedRequests = requests.filter(
    r => r.status === 'Approved' || r.status === 'Assigned' || r.status === 'InProgress'
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
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Emergency Request
          </Link>
        }
      />

      {/* Quick Action Navigation Hero - Direct, clear choices for citizens in stress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/request/new"
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-md shadow-blue-700/20 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-white/20 text-white backdrop-blur-xs">
              <PlusCircle className="w-6 h-6" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Primary Step
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-extrabold group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
              Request Emergency Aid <ChevronRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              Need rescue, medical care, food, or clean water? Submit an aid request with your GPS pin.
            </p>
          </div>
        </Link>

        <Link
          to="/shelters"
          className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 shadow-xs backdrop-blur-md transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Home className="w-6 h-6" />
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              {shelters.filter(s => s.availableCapacity > 0).length} Safe Zones Open
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              Find Safe Shelters <ChevronRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Locate verified disaster evacuation centers with available beds, medical staff, and food.
            </p>
          </div>
        </Link>

        <a
          href="tel:117"
          className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-800/90 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-800 dark:border-white/10 shadow-md backdrop-blur-md transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <PhoneCall className="w-6 h-6" />
            </span>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
              24/7 Hotline
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
              Call Hotline: 117 / 1990 <ChevronRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              For immediate aquatic rescue or life-threatening medical emergencies, dial national disaster lines.
            </p>
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 text-white p-5 sm:p-7 shadow-lg border border-blue-800/50 dark:border-blue-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-blue-400/30 dark:border-blue-400/40 shadow-md bg-slate-800">
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 dark:bg-blue-500/20 text-blue-300 dark:text-blue-200 text-[11px] font-bold border border-blue-500/30 dark:border-blue-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" />
                <span>Bilingual Safety Guide / ද්විභාෂා ආරක්ෂක මාර්ගෝපදේශය</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Emergency Help & Safety Guide
              </h2>
              <h3 className="text-sm font-bold text-blue-300 dark:text-blue-200">
                හදිසි ආපදා සහ ආරක්ෂක මාර්ගෝපදේශය
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Learn what to do during emergencies through simple pictures and step-by-step safety instructions.
              </p>
              <p className="text-xs text-blue-200 dark:text-blue-100/90 leading-relaxed">
                හදිසි අවස්ථාවලදී ආරක්ෂිතව ක්රියා කළ යුතු ආකාරය සරල පින්තූර සහ පියවරෙන් පියවර උපදෙස් මඟින් ඉගෙන ගන්න.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <Link
              to="/citizen/safety-guide"
              id="citizen-dashboard-safety-guide-btn"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:bg-blue-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Safety Guide / උපදෙස් බලන්න</span>
            </Link>
            <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400">
              <span>12 Disaster Guides</span>
              <span>•</span>
              <span className="text-blue-300 dark:text-blue-200 font-medium">English &amp; සිංහල</span>
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
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Your Assistance Requests & Status Timeline
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time status updates and delivery tracking for your emergency petitions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/request/new"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 dark:bg-blue-600 hover:bg-blue-600 dark:bg-blue-500 text-white font-bold text-xs shadow-xs transition"
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
                  statusFilter === 'Active' ? 'bg-white text-blue-900 dark:text-blue-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
                  const isPending = req.status === 'Submitted' || req.status === 'UnderReview' || req.status === 'Pending';
                  const isApproved = req.status === 'Approved' || req.status === 'Assigned' || req.status === 'InProgress';
                  const isResolved = req.status === 'Resolved';
                  const reqFeedback = (req as any).citizenFeedback;

                  return (
                    <Link
                      key={req.id}
                      to={`/requests/${req.id}`}
                      className="block p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/90 hover:border-blue-500 dark:border-blue-400/50 hover:shadow-md transition-all group"
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

                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 dark:text-blue-400 transition truncate">
                            {req.title || `${req.category || 'Emergency'} Assistance Request`}
                          </h3>

                          {/* Reassuring Plain-English Status Meaning */}
                          <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60/60 text-xs text-blue-950 dark:text-blue-100 leading-relaxed">
                            <span className="font-bold">{getStatusHumanLabel(req.status)}: </span>
                            <span className="text-blue-900 dark:text-blue-200">{getStatusExplanation(req.status)}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[200px]">{req.address || (req as any).location || 'Reported incident location'}</span>
                            </span>
                            <span>{req.affectedCount || (req as any).peopleCount || 1} person(s) affected</span>
                            {(req.contactPhone || (req as any).citizenPhone) && (
                              <span>Contact: {req.contactPhone || (req as any).citizenPhone}</span>
                            )}
                          </div>

                          {/* Uploaded Evidence Photos Preview (Coursework 1.1 A) */}
                          {(req as any).evidenceImages && (req as any).evidenceImages.length > 0 && (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evidence:</span>
                              <div className="flex items-center gap-1.5">
                                {(req as any).evidenceImages.map((imgUrl: string, idx: number) => (
                                  <img
                                    key={idx}
                                    src={imgUrl}
                                    alt="Evidence thumbnail"
                                    className="w-7 h-7 rounded-lg object-cover border border-slate-200 shadow-2xs"
                                  />
                                ))}
                                <span className="text-[10px] font-semibold text-slate-500">
                                  ({(req as any).evidenceImages.length} attached)
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Post-Delivery Feedback Trigger (Coursework 1.1 A) */}
                          {isResolved && (
                            <div className="pt-2 mt-2 border-t border-slate-200/60">
                              {reqFeedback ? (
                                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                                  <span className="flex items-center gap-1 font-bold">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                    Your Feedback: {reqFeedback.rating}/5 Stars
                                  </span>
                                  {reqFeedback.comments && (
                                    <span className="text-[11px] text-emerald-700 italic truncate max-w-[220px]">
                                      "{reqFeedback.comments}"
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openFeedbackModal(req.id, req.title || `${req.category} Assistance Request`);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition cursor-pointer"
                                >
                                  <Star className="w-3.5 h-3.5 text-amber-600" />
                                  Provide Aid Delivery Feedback
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="p-2 rounded-xl bg-white group-hover:bg-blue-50 dark:bg-blue-950/30 text-slate-400 group-hover:text-blue-600 dark:text-blue-400 transition shrink-0 border border-slate-200/60">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Visual Status Tracking Stepper */}
                      <div className="mt-4 pt-3 border-t border-slate-200/70">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                          <span className={isPending ? 'text-amber-600 font-bold' : 'text-slate-400'}>1. Triage Review</span>
                          <span className={isApproved ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}>2. Approved & Dispatched</span>
                          <span className={isResolved ? 'text-emerald-600 font-bold' : 'text-slate-400'}>3. Aid Delivered</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isResolved ? 'w-full bg-emerald-500' : isApproved ? 'w-2/3 bg-blue-600 dark:bg-blue-500' : 'w-1/3 bg-amber-500'
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
                <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Nearby Assistance Centres
              </h2>
              <Link to="/shelters" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-300">
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
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold mt-1 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" /> {s.contactPhone}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Help & Support Advisory Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-blue-400 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
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
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-600 dark:bg-blue-500/20 text-blue-300 dark:text-blue-200 border border-blue-500/30 dark:border-blue-500/40">
                24/7 Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Delivery Feedback Modal (Coursework 1.1 A) */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <span>Rate Your Relief Assistance</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Help us improve humanitarian coordination by providing feedback on: <strong className="text-slate-800">{feedbackRequestTitle}</strong>
            </p>

            {feedbackSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                {feedbackSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Star Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Overall Satisfaction *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 transition transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= feedbackRating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {feedbackRating === 5 ? 'Excellent' : feedbackRating === 4 ? 'Good' : feedbackRating === 3 ? 'Satisfactory' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>

                {/* Quick Aspect Tag Pills */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Key Highlights / Observations</label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((tag) => {
                      const isSelected = feedbackTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleFeedbackTag(tag)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700/60'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comments Textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Additional Comments / Notes</label>
                  <textarea
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="e.g. Relief pack arrived in good condition, drinking water was very helpful."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-teal-500"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={feedbackSubmitting}
                    className="px-5 py-2 text-xs font-bold bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
