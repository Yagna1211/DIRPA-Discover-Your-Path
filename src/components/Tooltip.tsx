import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TooltipProps {
  content: React.ReactNode;
  title?: string;
  badge?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'center' | 'start' | 'end';
  delay?: number;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  title,
  badge,
  position = 'bottom',
  align = 'center',
  delay = 150,
  children,
  className = '',
  contentClassName = '',
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Position classes
  let positionClasses = '';
  let arrowClasses = '';

  switch (position) {
    case 'top':
      positionClasses = 'bottom-full mb-2.5';
      arrowClasses = 'top-full border-t-stone-900 dark:border-t-stone-100 border-x-transparent border-b-transparent border-t-[5px] border-x-[5px] border-b-0';
      break;
    case 'bottom':
      positionClasses = 'top-full mt-2.5';
      arrowClasses = 'bottom-full border-b-stone-900 dark:border-b-stone-100 border-x-transparent border-t-transparent border-b-[5px] border-x-[5px] border-t-0';
      break;
    case 'left':
      positionClasses = 'right-full mr-2.5 top-1/2 -translate-y-1/2';
      arrowClasses = 'left-full top-1/2 -translate-y-1/2 border-l-stone-900 dark:border-l-stone-100 border-y-transparent border-r-transparent border-l-[5px] border-y-[5px] border-r-0';
      break;
    case 'right':
      positionClasses = 'left-full ml-2.5 top-1/2 -translate-y-1/2';
      arrowClasses = 'right-full top-1/2 -translate-y-1/2 border-r-stone-900 dark:border-r-stone-100 border-y-transparent border-l-transparent border-r-[5px] border-y-[5px] border-l-0';
      break;
  }

  // Alignment classes for top/bottom
  let alignClasses = '';
  let arrowAlignClasses = '';
  if (position === 'top' || position === 'bottom') {
    switch (align) {
      case 'center':
        alignClasses = 'left-1/2 -translate-x-1/2';
        arrowAlignClasses = 'left-1/2 -translate-x-1/2';
        break;
      case 'start':
        alignClasses = 'left-0';
        arrowAlignClasses = 'left-4';
        break;
      case 'end':
        alignClasses = 'right-0';
        arrowAlignClasses = 'right-4';
        break;
    }
  }

  return (
    <div
      className={`relative ${className.includes('block') || className.includes('flex') || className.includes('grid') ? '' : 'inline-flex'} ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {isVisible && !disabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 2 : position === 'bottom' ? -2 : 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="tooltip"
            className={`absolute z-50 pointer-events-none w-max max-w-xs sm:max-w-sm ${positionClasses} ${alignClasses}`}
          >
            <div
              className={`relative px-3 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.9)] rounded-md text-left font-sans ${contentClassName}`}
            >
              {/* Optional Arrow */}
              <div className={`absolute w-0 h-0 pointer-events-none ${arrowClasses} ${arrowAlignClasses}`} />

              {/* Header: Title + Badge */}
              {(title || badge) && (
                <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-stone-700 dark:border-stone-300">
                  {title && (
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 dark:text-amber-600 font-mono">
                      {title}
                    </span>
                  )}
                  {badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-stone-800 text-stone-200 dark:bg-stone-200 dark:text-stone-800 border border-stone-600 dark:border-stone-400 rounded">
                      {badge}
                    </span>
                  )}
                </div>
              )}

              {/* Main Content */}
              <div className="text-[11px] font-medium leading-snug text-stone-200 dark:text-stone-800">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
