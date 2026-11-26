import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  Check,
  RotateCcw,
  Boxes,
  Home,
  Camera
} from 'lucide-react';
import { api } from '../services/api';
import { AssistanceRequest, RequestUrgency, RequestStatusHistory } from '../types';
import { StatusBadge, UrgencyBadge, getStatusHumanLabel, getStatusExplanation } from '../components/StatusBadge';
import { LoadingSkeleton } from '../components/StatCard';
import { MapComponent } from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState<AssistanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review & Override states
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overridePriority, setOverridePriority] = useState<number>(3); // High
  const [overrideCategory, setOverrideCategory] = useState<number>(1);
  const [overrideReason, setOverrideReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const isCoordinatorOrAdmin =
    user?.role === 'Coordinator' ||
    user?.role === 'Admin' ||
    user?.role === 'CaseManager';

  const loadRequest = async () => {
    if (!id) return;
    try {
      const data = await api.getRequestById(id);
      setRequest(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequest();
  }, [id]);

  const handleReviewDecision = async (decision: number, notes?: string) => {
    if (!id) return;
    setActionLoading(true);
    try {
      await api.reviewRequest(id, {
        decision, // 3 = Approved, 7 = Rejected
        notes: notes || (decision === 3 ? 'Approved by coordinator' : 'Rejected by coordinator'),
      });
      await loadRequest();
    } catch (err: any) {
      alert(err.message || 'Review action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptAIRecommendation = async () => {
    if (!request?.latestRecommendation) return;
    setActionLoading(true);
    try {
      await api.reviewAIRecommendation(request.latestRecommendation.id, {
        reviewStatus: 1, // 1 = Accepted in api.ts
        notes: 'Coordinator accepted AI priority and category assessment',
      });
      const officerName = user?.fullName || 'Operational Officer';
      const nowIso = new Date().toISOString();
      setRequest(prev => {
        if (!prev) return prev;
        const updatedRec = prev.latestRecommendation ? {
          ...prev.latestRecommendation,
          reviewStatus: 'Accepted' as const,
          reviewingOfficerName: officerName,
          reviewedAt: nowIso,
        } : undefined;
        return {
          ...prev,
          latestRecommendation: updatedRec,
        };
      });
    } catch (err: any) {
      alert(err.message || 'Failed to accept recommendation.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOverrideAIRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request?.latestRecommendation) return;
    if (!overrideReason.trim()) {
      alert('An explicit override reason is mandatory when altering AI recommendations.');
      return;
    }

    const targetPriority: RequestUrgency =
      overridePriority === 4 ? 'Critical' :
      overridePriority === 3 ? 'High' :
      overridePriority === 2 ? 'Medium' : 'Low';
    const officerName = user?.fullName || 'Operational Officer';
    const nowIso = new Date().toISOString();

    setActionLoading(true);
    try {
      await api.reviewAIRecommendation(request.latestRecommendation.id, {
        reviewStatus: 2, // 2 = Overridden in api.ts
        overriddenCategory: overrideCategory,
        overriddenPriority: overridePriority,
        overrideReason: overrideReason.trim(),
        notes: `Coordinator adjusted priority to ${targetPriority} based on ground report`,
      });

      setRequest(prev => {
        if (!prev) return prev;
        const updatedRec = prev.latestRecommendation ? {
          ...prev.latestRecommendation,
          reviewStatus: 'Overridden' as const,
          overrideReason: overrideReason.trim(),
          reviewingOfficerName: officerName,
          officerDecision: `Overridden to ${targetPriority}`,
          reviewedAt: nowIso,
        } : undefined;

        const newHistoryItem: RequestStatusHistory = {
          id: `hist-override-${Date.now()}`,
          previousStatus: prev.status,
          newStatus: prev.status,
          changedByName: officerName,
          notes: `AI Recommendation Overridden: Priority adjusted from ${prev.latestRecommendation?.suggestedPriority} to ${targetPriority}. Reason: "${overrideReason.trim()}"`,
          timestamp: nowIso,
        };

        return {
          ...prev,
          urgency: targetPriority,
          latestRecommendation: updatedRec,
          statusHistory: [newHistoryItem, ...(prev.statusHistory || [])],
        };
      });

      setShowOverrideModal(false);
      setOverrideReason('');
    } catch (err: any) {
      alert(err.message || 'Override failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to cancel this assistance request?')) return;
    setActionLoading(true);
    try {
      await api.cancelRequest(id, 'Citizen requested cancellation');
      await loadRequest();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel request.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} height="h-32" />;
  }

  if (error || !request) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-800">Request Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">{error || 'This request may not exist or you lack authorization.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white cursor-pointer"
        >
          Return Back
        </button>
      </div>
    );
  }

  const rec = request.latestRecommendation;

  return (
    <div className="space-y-8">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          <UrgencyBadge urgency={request.urgency} />
        </div>
      </div>

      {/* Main Request Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600">
              <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                {request.category}
              </span>
              {request.crisisEventTitle && (
                <span className="text-slate-400">
                  Incident: <strong className="text-slate-700">{request.crisisEventTitle}</strong>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {request.title}
            </h1>
            <p className="text-xs text-slate-500">
              Submitted on {new Date(request.createdAt).toLocaleString()} by <strong className="text-slate-800">{request.citizenName}</strong>
            </p>
          </div>

          {/* Citizen Cancel Action */}
          {user?.role === 'Citizen' && (request.status === 'Submitted' || request.status === 'UnderReview') && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-200 transition cursor-pointer"
            >
              Cancel Request
            </button>
          )}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {request.description}
        </div>

        {/* Human-Readable Status Explanation Callout */}
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs space-y-1 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-bold text-xs sm:text-sm">Current Progress: {getStatusHumanLabel(request.status)}</span>
          </div>
          <p className="text-teal-800 leading-relaxed text-xs pl-6">
            {getStatusExplanation(request.status)}
          </p>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Affected People</span>
            <p className="font-extrabold text-sm text-slate-900 mt-0.5">{request.affectedCount} individuals</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</span>
            <p className="font-extrabold text-sm text-slate-900 mt-0.5">{request.contactPhone || 'Provided in account'}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 sm:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Special Needs / Vulnerabilities</span>
            <p className="font-extrabold text-sm text-slate-900 mt-0.5">{request.specialNeeds || 'None specified'}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: AI Triage & Map + Coordinator Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: AI Explainability + Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendation Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">AI Assistance Triage Analysis</h3>
                  <p className="text-[11px] text-slate-400">Processing Mode: {rec?.providerMode || 'Rule-based fallback engine'}</p>
                </div>
              </div>

              {rec && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Confidence:</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {Math.round(rec.confidenceScore * 100)}%
                  </span>
                </div>
              )}
            </div>

            {rec ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Predicted Category</span>
                    <p className="text-sm font-bold text-teal-300 mt-0.5">{rec.predictedCategory}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Suggested Priority</span>
                    <p className={`text-sm font-bold mt-0.5 ${rec.suggestedPriority === 'Critical' ? 'text-red-400' : 'text-amber-400'}`}>
                      {rec.suggestedPriority}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1">Explainable Rationale</h4>
                  <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                    {rec.explanation}
                  </p>
                </div>

                {Boolean(rec.suggestedResources && rec.suggestedResources.length > 0) && (
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Recommended Relief Supplies</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.suggestedResources?.map((item, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-950/60 text-teal-300 border border-teal-800">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review status banner */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    Review Status: <strong className="text-white">{rec.reviewStatus}</strong>
                  </span>
                  {rec.reviewingOfficerName && (
                    <span>Officer: <strong className="text-white">{rec.reviewingOfficerName}</strong></span>
                  )}
                </div>

                {rec.overrideReason && (
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-300 text-xs">
                    <strong>Coordinator Override Reason:</strong> {rec.overrideReason}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Triage evaluation pending...</p>
            )}
          </div>

          {/* Location Map */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600" />
                Reported Incident Location
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}
              </span>
            </div>
            <p className="text-xs text-slate-600">{request.address}</p>

            <MapComponent
              center={[request.latitude, request.longitude]}
              zoom={13}
              selectedLocation={[request.latitude, request.longitude]}
              height="260px"
            />
          </div>

          {/* Attached Evidence Photos Preview (Coursework 1.1 A) */}
          {(request as any).evidenceImages && (request as any).evidenceImages.length > 0 && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-600" />
                Attached Evidence Photos ({(request as any).evidenceImages.length})
              </h3>
              <p className="text-xs text-slate-500">Field photos submitted by citizen for damage & flood verification.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {(request as any).evidenceImages.map((imgUrl: string, idx: number) => (
                  <div key={idx} className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs group relative">
                    <img
                      src={imgUrl}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Coordinator Operations & Status History */}
        <div className="space-y-6">
          {/* Coordinator Action Panel */}
          {isCoordinatorOrAdmin && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Coordinator Review Actions
              </h3>

              {request.status === 'Submitted' || request.status === 'UnderReview' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={actionLoading}
                      onClick={() => handleReviewDecision(3)} // 3 = Approved
                      className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Approve Request
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleReviewDecision(7)} // 7 = Rejected
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>

                  {rec && rec.reviewStatus === 'Pending' && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">AI Recommendation Actions:</p>
                      <button
                        disabled={actionLoading}
                        onClick={handleAcceptAIRecommendation}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        Accept AI Recommendation
                      </button>
                      <button
                        onClick={() => {
                          setOverrideCategory(1);
                          setOverridePriority(3);
                          setShowOverrideModal(true);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Modify / Override Priority
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Request decision finalized as <strong className="text-slate-800">{request.status}</strong>.
                </p>
              )}

              {/* Fast links to resources and shelter assignment */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Link
                  to="/resources"
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-teal-600" /> Allocate Inventory Stock
                  </span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  to="/shelters"
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-teal-600" /> Assign to Verified Shelter
                  </span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          )}

          {/* Status Timeline History with AI Override Audit */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Status Lifecycle & Audit Trail
              </h3>
              {rec?.reviewStatus === 'Overridden' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  AI Overridden
                </span>
              )}
            </div>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Task 1: Dedicated AI Override Audit Entry in Timeline */}
              {rec && rec.reviewStatus === 'Overridden' && (
                <div className="relative pl-7 text-xs space-y-2">
                  <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-purple-600 border-2 border-white ring-2 ring-purple-100" />

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      AI Recommendation Override Audit
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {rec.reviewedAt
                        ? new Date(rec.reviewedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                        : 'Audit Recorded'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-950 space-y-2.5">
                    {/* Priority Comparison: Original AI Priority vs Final Human-Approved Priority */}
                    <div className="grid grid-cols-2 gap-3 text-[11px] pb-2 border-b border-purple-200/70">
                      <div>
                        <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">
                          1. Original AI Priority
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-bold text-slate-800">{rec.suggestedPriority}</span>
                          {rec.confidenceScore !== undefined && (
                            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200">
                              {Math.round(rec.confidenceScore * 100)}% conf
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-purple-700 block text-[10px] font-bold uppercase tracking-wider">
                          2. Final Approved Priority
                        </span>
                        <div className="mt-1">
                          <UrgencyBadge urgency={request.urgency} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Override Reason */}
                    <div>
                      <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">
                        3. Mandatory Override Reason
                      </span>
                      <p className="text-[11px] text-slate-800 leading-relaxed bg-white/90 p-2.5 rounded-lg border border-purple-200/80 italic">
                        "{rec.overrideReason || 'Officer manual override based on field assessment'}"
                      </p>
                    </div>

                    {/* Responsible Officer & Decision Time */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600 pt-1 border-t border-purple-200/50">
                      <span>
                        4. Officer: <strong className="text-slate-900">{rec.reviewingOfficerName || user?.fullName || 'Operational Officer'}</strong>
                      </span>
                      <span>
                        5. Decision Time: <strong className="text-slate-900">
                          {rec.reviewedAt
                            ? new Date(rec.reviewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status History Items */}
              {(request.statusHistory || []).map(h => (
                <div key={h.id} className="relative pl-7 text-xs space-y-1">
                  <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-teal-600 border-2 border-white ring-2 ring-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{h.newStatus}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(h.timestamp || (h as any).changedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {h.notes || `Changed by ${h.changedByName}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Override AI Recommendation Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">
              Override AI Triage Recommendation
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Human oversight requirement: Every alteration to an AI recommendation must record an explicit operational reason for the compliance audit trail.
            </p>

            <form onSubmit={handleOverrideAIRecommendation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Adjusted Priority</label>
                <select
                  value={overridePriority}
                  onChange={e => setOverridePriority(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                  <option value={4}>Critical (Emergency)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mandatory Override Reason *</label>
                <textarea
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  placeholder="e.g. Ground coordinator verified water levels stabilized; priority downgraded to Medium."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-xs"
                >
                  {actionLoading ? 'Recording...' : 'Confirm Override Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
