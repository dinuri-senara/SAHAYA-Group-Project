import React from 'react';
import { RequestStatus, RequestUrgency } from '../types';

interface StatusBadgeProps {
  status: RequestStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    Submitted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    UnderReview: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    Approved: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
    Assigned: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
    InProgress: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
    Resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    Rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
    Cancelled: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', dot: 'bg-slate-400' },
    Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    Full: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
    Available: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    Busy: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    Accepted: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
    Overridden: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  };

  const style = styles[status] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' };
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      title={getStatusExplanation(status)}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

export const getStatusHumanLabel = (status: RequestStatus | string): string => {
  switch (status) {
    case 'Submitted':
      return 'Received by Emergency Center';
    case 'UnderReview':
      return 'Under Coordinator Triage';
    case 'Approved':
      return 'Approved — Resources Allocating';
    case 'Assigned':
      return 'Assigned to Volunteer / Depot';
    case 'InProgress':
      return 'Aid Dispatched & En Route';
    case 'Resolved':
      return 'Assistance Delivered & Completed';
    case 'Rejected':
      return 'Request Not Approved';
    case 'Cancelled':
      return 'Request Cancelled';
    default:
      return status;
  }
};

export const getStatusExplanation = (status: RequestStatus | string): string => {
  switch (status) {
    case 'Submitted':
      return 'Your request has been safely logged in the system and is in line for AI triage and officer review.';
    case 'UnderReview':
      return 'An emergency coordinator is currently assessing your needs, location, and matching available relief supplies.';
    case 'Approved':
      return 'Your assistance request has been officially approved. Supplies and relief logistics are being prepared.';
    case 'Assigned':
      return 'A field responder, volunteer team, or relief shelter has been assigned to coordinate your assistance.';
    case 'InProgress':
      return 'Aid delivery, rescue transport, or shelter accommodations are actively underway in your sector.';
    case 'Resolved':
      return 'Emergency assistance has been successfully delivered and verified by our operational team.';
    case 'Rejected':
      return 'This request could not be approved at this time. Please check coordinator notes or re-apply if urgent.';
    case 'Cancelled':
      return 'This request was cancelled by the citizen or emergency officer.';
    default:
      return '';
  }
};

export const UrgencyBadge: React.FC<{ urgency: RequestUrgency | string; size?: 'sm' | 'md' }> = ({ urgency, size = 'md' }) => {
  const styles: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    Low: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', glow: '' },
    Medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', glow: '' },
    High: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', glow: 'shadow-sm shadow-orange-100' },
    Critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', glow: 'shadow-sm shadow-red-200 animate-pulse' },
  };

  const style = styles[urgency] || styles.Medium;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${style.bg} ${style.text} ${style.border} ${style.glow} ${sizeClass}`}>
      {urgency === 'Critical' && (
        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
      )}
      {urgency}
    </span>
  );
};
