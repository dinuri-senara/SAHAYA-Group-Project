import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'critical' | 'warning' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c1527]/80 hover:border-slate-300 dark:hover:border-white/20',
    critical: 'border-rose-200/80 dark:border-rose-500/30 bg-rose-50/60 dark:bg-rose-950/25 hover:border-rose-300 dark:hover:border-rose-500/50',
    warning: 'border-amber-200/80 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/25 hover:border-amber-300 dark:hover:border-amber-500/50',
    success: 'border-emerald-200/80 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/25 hover:border-emerald-300 dark:hover:border-emerald-500/50',
  };

  const iconColors = {
    default: 'bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300',
    critical: 'bg-rose-100/80 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400',
    warning: 'bg-amber-100/80 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
    success: 'bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-xs backdrop-blur-md transition-all duration-200 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
          {trend && (
            <span className="inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
              {trend}
            </span>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-2xl ${iconColors[variant]} shadow-xs`}>
            {icon}
          </div>
        )}
      </div>
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
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/60">
      {icon && <div className="p-4 rounded-2xl bg-slate-100 text-slate-400 mb-4">{icon}</div>}
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ count?: number; height?: string }> = ({
  count = 3,
  height = 'h-16',
}) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`w-full ${height} bg-slate-200/70 rounded-xl animate-pulse`} />
      ))}
    </div>
  );
};
