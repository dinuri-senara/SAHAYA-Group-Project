import React from 'react';
import { AlertCircle, RefreshCw, Inbox, Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{
  message?: string;
  subMessage?: string;
  count?: number;
}> = ({ message = 'Loading operational data...', subMessage, count = 3 }) => {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-50/60 border border-teal-100 text-teal-800 text-xs">
        <Loader2 className="w-4 h-4 animate-spin text-teal-600 shrink-0" />
        <div>
          <p className="font-bold">{message}</p>
          {subMessage && <p className="text-[11px] text-teal-600 mt-0.5">{subMessage}</p>}
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full h-20 bg-slate-200/70 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Failed to Load Information',
  message = 'An unexpected error occurred while communicating with SAHAYA services. Please verify your connection or contact operations.',
  onRetry,
}) => {
  return (
    <div className="p-8 rounded-2xl bg-red-50/70 border border-red-200 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-6">
      <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3.5 shadow-2xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-red-950">{title}</h3>
      <p className="text-xs text-red-700/90 mt-1 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, icon, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/70 shadow-2xs my-4">
      <div className="p-4 rounded-2xl bg-slate-100/80 text-slate-400 mb-3.5">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-sm sm:text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
