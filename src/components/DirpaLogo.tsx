import React from 'react';

export type LogoStyle = 'cyber-compass';

export interface DirpaLogoProps {
  styleName?: LogoStyle;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export function getActiveLogoStyle(): LogoStyle {
  return 'cyber-compass';
}

export default function DirpaLogo({
  styleName = 'cyber-compass',
  variant = 'full',
  size = 'md',
  className = '',
  animate = true
}: DirpaLogoProps) {
  // Size mapping
  const sizeClasses = {
    sm: {
      container: 'gap-1.5',
      icon: 'w-6 h-6 sm:w-7 sm:h-7',
      text: 'text-md sm:text-lg',
    },
    md: {
      container: 'gap-2 sm:gap-3',
      icon: 'w-8 h-8 sm:w-10 sm:h-10',
      text: 'text-xl sm:text-2xl',
    },
    lg: {
      container: 'gap-4',
      icon: 'w-16 h-16',
      text: 'text-4xl md:text-5xl',
    },
    xl: {
      container: 'gap-6',
      icon: 'w-24 h-24',
      text: 'text-6xl md:text-8xl',
    }
  };

  const selectedSize = sizeClasses[size];

  // Render Icon (Cyber Compass Grid)
  const renderIcon = () => {
    return (
      <div 
        className={`${selectedSize.icon} bg-black border-2 border-black rounded-full flex items-center justify-center relative shadow-[2px_2px_0px_0px_rgba(245,158,11,1)] shrink-0 transition-transform hover:scale-105 duration-200 group`}
      >
        {/* Spinning vector dial */}
        <div className={`w-5/6 h-5/6 border-2 border-dashed border-zinc-700 rounded-full flex items-center justify-center relative ${animate ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
          {/* Compass Pointer Needle */}
          <div className="absolute h-full w-1 flex flex-col justify-between py-1">
            <div className="w-1 h-3.5 bg-amber-400 border border-black rounded-t"></div>
            <div className="w-1 h-3.5 bg-blue-500 border border-black rounded-b"></div>
          </div>
        </div>

        {/* Outer mini signal dot indicator */}
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border border-black rounded-full animate-ping"></span>
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border border-black rounded-full"></span>
      </div>
    );
  };

  // Render Typography text for Cyber Compass Grid style
  const renderText = () => {
    return (
      <div className="flex flex-col items-start leading-none text-left">
        <span className={`${selectedSize.text} font-display font-black tracking-tighter uppercase italic text-black dark:text-white`}>
          DIRPA
        </span>
        <span className="text-[8.5px] font-mono font-extrabold text-blue-600 block uppercase tracking-wider mt-0.5">
          DISCOVER YOUR PATH!
        </span>
      </div>
    );
  };

  if (variant === 'icon') {
    return (
      <div id="dirpa-logo-icon-cyber-compass" className={`inline-flex ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div id="dirpa-logo-text-cyber-compass" className={`inline-flex ${className}`}>
        {renderText()}
      </div>
    );
  }

  return (
    <div 
      id="dirpa-logo-full-cyber-compass" 
      className={`inline-flex items-center ${selectedSize.container} select-none ${className}`}
    >
      {renderIcon()}
      {renderText()}
    </div>
  );
}
