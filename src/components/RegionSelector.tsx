import React, { useState, useEffect } from 'react';

export type JobRegion = 'IN' | 'US';

interface RegionSelectorProps {
  currentRegion?: JobRegion;
  onRegionChange?: (region: JobRegion) => void;
  variant?: 'header' | 'compact' | 'card';
  className?: string;
  isDarkMode?: boolean;
}

export const REGIONS: { code: JobRegion; name: string; flag: string; label: string; currency: string; symbol: string }[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', label: 'India Market (Gemini Search)', currency: 'INR', symbol: '₹' },
  { code: 'US', name: 'United States', flag: '🇺🇸', label: 'United States (O*NET API)', currency: 'USD', symbol: '$' },
];

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  currentRegion,
  onRegionChange,
  variant = 'header',
  className = '',
  isDarkMode = false,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<JobRegion>(() => {
    if (currentRegion) return currentRegion;
    const saved = localStorage.getItem('dirpa_job_region') as JobRegion;
    return saved === 'US' || saved === 'IN' ? saved : 'IN';
  });

  useEffect(() => {
    if (currentRegion && currentRegion !== selectedRegion) {
      setSelectedRegion(currentRegion);
    }
  }, [currentRegion]);

  const handleSelect = (code: JobRegion) => {
    setSelectedRegion(code);
    localStorage.setItem('dirpa_job_region', code);
    if (onRegionChange) {
      onRegionChange(code);
    }
  };

  if (variant === 'card' || variant === 'compact') {
    return (
      <div className={`inline-flex items-center p-1 bg-stone-100 dark:bg-zinc-800 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] ${className}`}>
        {REGIONS.map((r) => {
          const isActive = selectedRegion === r.code;
          return (
            <button
              key={r.code}
              type="button"
              onClick={() => handleSelect(r.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-300 text-black border border-black shadow-[1px_1px_0px_0px_#000]'
                  : 'text-stone-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-stone-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span className="text-sm">{r.flag}</span>
              <span>{r.name}</span>
              <span className="text-[10px] font-mono px-1 bg-black/10 rounded">{r.symbol}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-[10px] font-mono font-bold uppercase text-stone-500 dark:text-zinc-400 hidden sm:inline">
        Region:
      </span>
      <div className="flex items-center p-0.5 bg-amber-50 dark:bg-zinc-800 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
        {REGIONS.map((r) => {
          const isActive = selectedRegion === r.code;
          return (
            <button
              key={r.code}
              type="button"
              onClick={() => handleSelect(r.code)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-black border border-black shadow-[1px_1px_0px_0px_#000]'
                  : isDarkMode
                  ? 'text-zinc-300 hover:text-white'
                  : 'text-stone-700 hover:text-black'
              }`}
              title={r.label}
            >
              <span>{r.flag}</span>
              <span className="font-extrabold">{r.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RegionSelector;
