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
  const iconHeights = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Emblem - 100% Clean Transparency, Theme-Adaptive, No Ugly Container, No Green Dot */}
      <div className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 ${iconHeights[size]}`}>
        <img
          src="/sahaya-logo.png"
          alt="SAHAYA - අපි වෙනුවෙන් අපි"
          className={`h-full w-auto object-contain transition-all duration-200 ${
            light
              ? 'brightness-125 contrast-105'
              : 'brightness-100 contrast-100 dark:brightness-125 dark:contrast-105'
          }`}
        />
      </div>

      {showText && (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight ${textSizes[size]} ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              SAHAYA
            </span>
            <span className="text-[11px] font-bold text-teal-400">
              අපි වෙනුවෙන් අපි
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide mt-0.5">
              Humanitarian Aid Coordination
            </span>
          )}
        </div>
      )}
    </div>
  );
};
