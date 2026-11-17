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
    default: 'border-slate-200 bg-white hover:border-slate-300',
    critical: 'border-red-200 bg-red-50/40 hover:border-red-300',
    warning: 'border-amber-200 bg-amber-50/40 hover:border-amber-300',
    success: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300',
  };

  const iconColors = {
    default: 'bg-slate-100 text-slate-700',
    critical: 'bg-red-100 text-red-600',
    warning: 'bg-amber-100 text-amber-700',
    success: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className={`p-5 rounded-xl border shadow-xs transition-all duration-200 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
          )}
          {trend && (
            <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {trend}
            </span>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${iconColors[variant]}`}>
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
