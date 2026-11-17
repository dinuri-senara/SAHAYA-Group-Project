import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
}

export const SahayaLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showTagline = false,
  light = false 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Custom Original Humanitarian Aid Mark */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-md ${iconSizes[size]}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3/5 h-3/5 text-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Beacon / Shield with Heart and Hands Symbolism */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-300"></span>
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${textSizes[size]} ${light ? 'text-white' : 'text-slate-900'}`}>
            SAHAYA
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-teal-100 text-teal-800 border border-teal-200">
            Operations
          </span>
        </div>
        {showTagline && (
          <span className={`text-xs font-medium tracking-tight mt-0.5 ${light ? 'text-slate-400' : 'text-slate-500'}`}>
            Smart Humanitarian Aid & Assistance
          </span>
        )}
      </div>
    </div>
  );
};
