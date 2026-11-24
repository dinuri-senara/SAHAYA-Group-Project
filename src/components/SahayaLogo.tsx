import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
  showText?: boolean;
}

export const SahayaLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showTagline = false,
  light = true,
  showText = false
}) => {
  const iconSizes = {
    sm: 'w-7 h-9',
    md: 'w-9 h-11',
    lg: 'w-12 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Humanitarian Logo (Two Hands forming S, Location Pin & Medical Cross - Transparent) */}
      <div className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 ${iconSizes[size]}`}>
        <img
          src="/sahaya-logo.png"
          alt="SAHAYA - අපි වෙනුවෙන් අපි"
          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(20,184,166,0.35)]"
        />
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-300"></span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight ${textSizes[size]} ${light ? 'text-white' : 'text-slate-900'}`}>
              SAHAYA
            </span>
            <span className="text-[11px] font-bold text-teal-400">
              අපි වෙනුවෙන් අපි
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
              Humanitarian Aid Coordination
            </span>
          )}
        </div>
      )}
    </div>
  );
};
