import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Copy,
  Info,
  Check,
  X,
  Edit3,
  Sliders,
  ChevronRight,
  ExternalLink,
  Bot
} from 'lucide-react';
import { AssistanceRequest, AIRecommendation, DuplicateMatch } from '../types';
import { api } from '../services/api';
import { StatusBadge, UrgencyBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';

export const CoordinatorAIReviewPage: React.FC = () => {
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Override / Decision state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideDecision, setOverrideDecision] = useState<'Accept' | 'Override' | 'Reject'>('Accept');
  const [modifiedUrgency, setModifiedUrgency] = useState<number>(2); // High
  const [modifiedCategory, setModifiedCategory] = useState<number>(0);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Duplicates list
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);

  const loadRequestsWithAI = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRequests();
      // Filter requests that have AI recommendations or are pending triage
      setRequests(data);
      if (data.length > 0 && !selectedRequest) {
        setSelectedRequest(data[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load requests for AI review.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequestsWithAI();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      loadDuplicatesForRequest(selectedRequest.id);
    }
  }, [selectedRequest]);

  const loadDuplicatesForRequest = async (requestId: string) => {
    try {
      setLoadingDuplicates(true);
      const matches = await api.detectDuplicates(requestId);
      setDuplicates(matches);
    } catch (err) {
      console.warn('Duplicate detection call failed:', err);
      setDuplicates([]);
    } finally {
      setLoadingDuplicates(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !selectedRequest.latestRecommendation) return;

    if (overrideDecision === 'Override' && !overrideReason.trim()) {
      setError('Please provide a mandatory justification for overriding the AI recommendation.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await api.reviewAIRecommendation(selectedRequest.latestRecommendation.id, {
        reviewStatus: overrideDecision === 'Accept' ? 1 : overrideDecision === 'Override' ? 2 : 3,
        overriddenPriority: overrideDecision === 'Override' ? Number(modifiedUrgency) : undefined,
        overriddenCategory: overrideDecision === 'Override' ? Number(modifiedCategory) : undefined,
        overrideReason: overrideDecision === 'Override' ? overrideReason : undefined,
        notes: overrideReason
      });

      setSuccessMsg(`AI recommendation decision recorded: [${overrideDecision}]. Audit log logged in SQL Server.`);
      setShowOverrideModal(false);
      setOverrideReason('');
      loadRequestsWithAI();
    } catch (err: any) {
      setError(err.message || 'Failed to submit recommendation review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAccept = async () => {
    if (!selectedRequest || !selectedRequest.latestRecommendation) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await api.reviewAIRecommendation(selectedRequest.latestRecommendation.id, {
        reviewStatus: 1, // 1 = Accepted
        notes: 'Coordinator accepted AI priority and category assessment directly',
      });
      setSuccessMsg('AI recommendation accepted successfully. Logged in audit trail.');
      loadRequestsWithAI();
    } catch (err: any) {
      setError(err.message || 'Failed to accept recommendation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rec = selectedRequest?.latestRecommendation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI Operations Center & Triage Oversight
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Explainable AI decision intelligence, human-in-the-loop review, and NLP duplicate request detection.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs font-bold text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-bold text-rose-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Two Column Layout: Request Queue & AI Triage Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Request Queue */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Incoming Triage Queue ({requests.length})
          </h2>

          {loading ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading incoming queue...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500">No requests awaiting review.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {requests.map(req => {
                const isSelected = selectedRequest?.id === req.id;
                const aiStatus = req.latestRecommendation?.reviewStatus || 'Pending';

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 shadow-sm ring-1 ring-teal-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{req.title}</h4>
                      <UrgencyBadge urgency={req.urgency} />
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{req.description}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Citizen: {req.citizenName}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        aiStatus === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : aiStatus === 'Overridden'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-purple-500/10 text-purple-600'
                      }`}>
                        AI: {aiStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: AI Explainability & Officer Review Panel */}
        <div className="lg:col-span-7 space-y-6">
          {selectedRequest ? (
            <>
              {/* Selected Request Detail Banner */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Assistance Request #{selectedRequest.id.substring(0, 8)}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedRequest.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Submitted by {selectedRequest.citizenName} • Category: {selectedRequest.category}</p>
                  </div>
                  <Link
                    to={`/requests/${selectedRequest.id}`}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    title="View Full Request Detail"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <p className="font-semibold text-slate-500 mb-1">Citizen Narrative:</p>
                  <p className="italic leading-relaxed">"{selectedRequest.description}"</p>
                  {selectedRequest.specialNeeds && (
                    <p className="mt-2 text-rose-600 font-semibold">
                      Special Needs / Vulnerabilities: {selectedRequest.specialNeeds}
                    </p>
                  )}
                </div>
              </div>

              {/* Explainable AI Engine Assessment Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">SAHAYA Explainable AI Assessment</h4>
                      <p className="text-xs text-slate-500">
                        Processing Mode: <strong className="text-slate-700">{rec?.providerMode || 'Rule-based fallback (Heuristic Safety Engine)'}</strong>
                      </p>
                    </div>
                  </div>

                  {rec && (
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-slate-400 block">Confidence Score</span>
                      <span className="text-lg font-bold text-purple-600">
                        {Math.round(rec.confidenceScore * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {rec ? (
                  <div className="mt-5 space-y-4">
                    {/* Recommendations grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                        <span className="text-[11px] font-semibold text-slate-500">Predicted Category</span>
                        <p className="text-sm font-bold text-slate-900 mt-1">{rec.predictedCategory}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                        <span className="text-[11px] font-semibold text-slate-500">Recommended Priority</span>
                        <div className="mt-1">
                          <UrgencyBadge urgency={rec.suggestedPriority || 'Medium'} />
                        </div>
                      </div>
                    </div>

                    {/* Reasoning explanation */}
                    <div className="p-4 rounded-2xl theme-bg-soft border theme-border-primary">
                      <p className="text-xs font-bold theme-text-primary uppercase tracking-wider mb-1.5">
                        Explainability & Rationale Breakdown
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                        {rec.explanation}
                      </p>
                    </div>

                    {/* Suggested resources */}
                    {rec.suggestedResources && rec.suggestedResources.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Suggested Resource Mobilization Bundle
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {rec.suggestedResources.map((resItem, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold"
                            >
                              {resItem}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Officer Review Status & Actions */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs">
                        <span className="text-slate-500">Review Status: </span>
                        <strong className="text-slate-900">{rec.reviewStatus}</strong>
                        {rec.reviewingOfficerName && (
                          <span className="text-slate-500"> by {rec.reviewingOfficerName}</span>
                        )}
                        {rec.overrideReason && (
                          <p className="text-amber-700 mt-0.5 text-[11px]">Override Justification: "{rec.overrideReason}"</p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {rec.reviewStatus === 'Pending' && (
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleQuickAccept}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Accept AI Assessment
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setOverrideDecision('Override');
                            setShowOverrideModal(true);
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Modify / Override
                        </button>
                        <Link
                          to={`/requests/${selectedRequest.id}`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-teal-300 transition-all flex items-center gap-1"
                        >
                          Approve Aid &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 text-center p-8 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                    No AI assessment recorded yet for this request.
                  </div>
                )}
              </div>

              {/* Duplicate Request Detection Results Matrix */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Copy className="w-5 h-5 text-amber-500" />
                    <h4 className="font-bold text-slate-900 text-base">Duplicate Request Detector</h4>
                  </div>
                  <span className="text-xs text-slate-500">Jaccard NLP & Haversine Proximity Check</span>
                </div>

                {loadingDuplicates ? (
                  <p className="text-xs text-slate-500 py-3 text-center">Scanning database for duplicate petitions...</p>
                ) : duplicates.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>No duplicate requests detected. This appears to be a unique citizen appeal.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-amber-700">
                      Potential duplicate requests found in the same geographic radius:
                    </p>
                    {duplicates.map(dup => (
                      <div
                        key={dup.id}
                        className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-start">
                          <strong className="text-slate-900">{dup.matchedTitle}</strong>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">
                            {Math.round(dup.similarityScore * 100)}% Similarity
                          </span>
                        </div>
                        <p className="text-slate-600">
                          Citizen: {dup.matchedCitizenName} • Distance: {dup.proximityKm} km away
                        </p>
                        <p className="text-slate-500 italic text-[11px]">{dup.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Sparkles className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Select a Request to Inspect</h3>
              <p className="text-xs text-slate-500 mt-1">Select an item from the queue to view explainable AI recommendations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Officer Review / Override */}
      {showOverrideModal && rec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Human Officer AI Review</h2>
            <p className="text-xs text-slate-500 mb-4">
              Authorized coordinators have full authority to accept, modify, or override AI recommendations.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Officer Decision *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Accept', 'Override', 'Reject'] as const).map(dec => (
                    <button
                      type="button"
                      key={dec}
                      onClick={() => setOverrideDecision(dec)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        overrideDecision === dec
                          ? dec === 'Accept'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : dec === 'Override'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {dec}
                    </button>
                  ))}
                </div>
              </div>

              {overrideDecision === 'Override' && (
                <div className="space-y-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Override Specifications</p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Adjust Urgency Priority *</label>
                    <select
                      value={modifiedUrgency}
                      onChange={e => setModifiedUrgency(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                    >
                      <option value={0}>Low</option>
                      <option value={1}>Medium</option>
                      <option value={2}>High</option>
                      <option value={3}>Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mandatory Override Justification *</label>
                    <textarea
                      required
                      rows={3}
                      value={overrideReason}
                      onChange={e => setOverrideReason(e.target.value)}
                      placeholder="Explain why the AI model's recommendation is being overridden (e.g. verified infant in household requiring urgent formula)..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  {isSubmitting ? 'Recording...' : 'Commit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
