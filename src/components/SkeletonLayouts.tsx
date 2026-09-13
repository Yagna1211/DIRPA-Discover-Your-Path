import React from 'react';
import { motion } from 'motion/react';

// Common shimmer animation overlay
export function ShimmerOverlay() {
  return (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent pointer-events-none" />
  );
}

/**
 * Full page skeleton layout that matches DIRPA's Home / Dashboard page structure:
 * - Top Navbar
 * - Hero Banner with badges and quick actions
 * - Metrics counters bar
 * - 4-Column Educational Stream Cards Grid
 */
export function AppPageSkeleton({ isDarkMode = false }: { isDarkMode?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`fixed inset-0 z-[9999] overflow-y-auto ${
        isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-stone-900'
      } flex flex-col select-none`}
    >
      {/* 1. Header Bar Skeleton */}
      <header className="h-20 border-b-2 border-black dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 md:px-12 flex items-center justify-between shrink-0 relative overflow-hidden">
        <ShimmerOverlay />
        
        {/* Left: Logo placeholder */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400/70 dark:bg-amber-500/50 border-2 border-black dark:border-zinc-700 rounded-sm" />
          <div className="space-y-1">
            <div className="w-24 h-5 bg-stone-900/80 dark:bg-zinc-700 rounded-sm" />
            <div className="w-36 h-2.5 bg-stone-300 dark:bg-zinc-800 rounded-sm" />
          </div>
        </div>

        {/* Center: Search & Nav links */}
        <div className="hidden md:flex items-center gap-4">
          <div className="w-64 h-9 bg-stone-100 dark:bg-zinc-800 border-2 border-black/30 dark:border-zinc-700 rounded-sm" />
          <div className="w-20 h-7 bg-stone-200 dark:bg-zinc-800 rounded-sm" />
          <div className="w-24 h-7 bg-stone-200 dark:bg-zinc-800 rounded-sm" />
          <div className="w-20 h-7 bg-stone-200 dark:bg-zinc-800 rounded-sm" />
        </div>

        {/* Right: Auth / Profile actions */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-8 bg-stone-100 dark:bg-zinc-800 border-2 border-black/30 dark:border-zinc-700 rounded-sm" />
          <div className="w-24 h-8 bg-amber-300/80 dark:bg-amber-600/50 border-2 border-black/40 dark:border-zinc-700 rounded-sm" />
          <div className="w-9 h-9 rounded-full bg-stone-300 dark:bg-zinc-700 border-2 border-black/30 dark:border-zinc-700" />
        </div>
      </header>

      {/* 2. Main Content Skeleton Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* Hero Section Skeleton */}
        <div className="border-2 border-black dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.06)] relative overflow-hidden space-y-6">
          <ShimmerOverlay />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="w-48 h-6 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 rounded-sm" />
            <div className="w-32 h-5 bg-stone-200 dark:bg-zinc-800 rounded-sm" />
          </div>

          <div className="space-y-3">
            <div className="w-3/4 max-w-2xl h-10 bg-stone-900/80 dark:bg-zinc-700 rounded-sm" />
            <div className="w-full max-w-3xl h-4 bg-stone-300 dark:bg-zinc-800 rounded-sm" />
            <div className="w-4/5 max-w-2xl h-4 bg-stone-250 dark:bg-zinc-800/80 rounded-sm" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="w-40 h-11 bg-amber-400/90 dark:bg-amber-500/70 border-2 border-black dark:border-zinc-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-sm" />
            <div className="w-36 h-11 bg-stone-100 dark:bg-zinc-800 border-2 border-black/40 dark:border-zinc-700 rounded-sm" />
            <div className="w-32 h-11 bg-stone-100 dark:bg-zinc-800 border-2 border-black/40 dark:border-zinc-700 rounded-sm" />
          </div>
        </div>

        {/* 3. Metric Stats Row Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { color: 'border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20' },
            { color: 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20' },
            { color: 'border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20' },
            { color: 'border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/20' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 border-2 border-black dark:border-zinc-800 ${item.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.04)] relative overflow-hidden space-y-2`}
            >
              <ShimmerOverlay />
              <div className="w-16 h-3 bg-stone-300 dark:bg-zinc-700 rounded-sm" />
              <div className="w-24 h-7 bg-stone-800/80 dark:bg-zinc-600 rounded-sm" />
              <div className="w-32 h-2.5 bg-stone-300/80 dark:bg-zinc-750 rounded-sm" />
            </div>
          ))}
        </div>

        {/* 4. Stream Pathways Card Grid Skeleton (4-Column Layout) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-56 h-6 bg-stone-800/80 dark:bg-zinc-700 rounded-sm" />
            <div className="w-28 h-4 bg-stone-300 dark:bg-zinc-800 rounded-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="border-2 border-black dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] relative overflow-hidden flex flex-col justify-between space-y-4 min-h-[300px]"
              >
                <ShimmerOverlay />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-5 bg-amber-200 dark:bg-amber-900/60 border border-black/20 rounded-sm" />
                    <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-zinc-800" />
                  </div>

                  <div className="w-3/4 h-5 bg-stone-900/70 dark:bg-zinc-700 rounded-sm" />
                  <div className="w-full h-3 bg-stone-200 dark:bg-zinc-800 rounded-sm" />
                  <div className="w-5/6 h-3 bg-stone-200 dark:bg-zinc-800 rounded-sm" />

                  <div className="space-y-2 pt-2 border-t border-dashed border-stone-200 dark:border-zinc-800">
                    <div className="w-full h-2.5 bg-stone-150 dark:bg-zinc-800/60 rounded-sm" />
                    <div className="w-11/12 h-2.5 bg-stone-150 dark:bg-zinc-800/60 rounded-sm" />
                    <div className="w-4/5 h-2.5 bg-stone-150 dark:bg-zinc-800/60 rounded-sm" />
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="w-20 h-4 bg-stone-200 dark:bg-zinc-800 rounded-sm" />
                  <div className="w-24 h-7 bg-amber-300/80 dark:bg-amber-600/60 border border-black/40 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </motion.div>
  );
}

/**
 * Skeleton for AI Exam Details in EntranceExamsInfo
 */
export function ExamReportSkeleton() {
  return (
    <div className="border-2 border-black dark:border-zinc-800 p-6 sm:p-8 bg-amber-50/60 dark:bg-zinc-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.06)] relative overflow-hidden space-y-6 animate-pulse">
      <ShimmerOverlay />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black dark:border-zinc-800 pb-4">
        <div className="space-y-2">
          <div className="w-36 h-4 bg-blue-200 dark:bg-blue-900/60 rounded-sm border border-blue-400" />
          <div className="w-64 h-7 bg-stone-900/80 dark:bg-zinc-700 rounded-sm" />
        </div>
        <div className="w-36 h-8 bg-amber-300/80 dark:bg-amber-600/60 border border-black rounded-sm" />
      </div>

      {/* 4-Stat Metric Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-3 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 space-y-1.5">
            <div className="w-16 h-2.5 bg-stone-300 dark:bg-zinc-700 rounded-sm" />
            <div className="w-24 h-5 bg-stone-800/80 dark:bg-zinc-600 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Two Column Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 space-y-3">
          <div className="w-32 h-4 bg-stone-800/80 dark:bg-zinc-700 rounded-sm" />
          <div className="space-y-2">
            <div className="w-full h-3 bg-stone-200 dark:bg-zinc-700 rounded-sm" />
            <div className="w-11/12 h-3 bg-stone-200 dark:bg-zinc-700 rounded-sm" />
            <div className="w-4/5 h-3 bg-stone-200 dark:bg-zinc-700 rounded-sm" />
            <div className="w-5/6 h-3 bg-stone-200 dark:bg-zinc-700 rounded-sm" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 space-y-3">
          <div className="w-36 h-4 bg-stone-800/80 dark:bg-zinc-700 rounded-sm" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="w-24 h-6 bg-stone-150 dark:bg-zinc-700 rounded-sm border border-black/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for O*NET Career Explorer (Matching roles list & Occupation Dossier)
 */
export function OnetCareerSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      {/* Left List Skeleton */}
      <div className="lg:col-span-4 space-y-3">
        <div className="w-36 h-4 bg-stone-300 dark:bg-zinc-700 rounded-sm" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 space-y-2 relative overflow-hidden shadow-[2px_2px_0px_0px_#000]"
            >
              <ShimmerOverlay />
              <div className="flex items-center justify-between">
                <div className="w-16 h-3.5 bg-blue-100 dark:bg-blue-950/60 rounded-sm" />
                <div className="w-12 h-3.5 bg-emerald-100 dark:bg-emerald-950/60 rounded-sm" />
              </div>
              <div className="w-3/4 h-4 bg-stone-800/80 dark:bg-zinc-700 rounded-sm" />
              <div className="w-full h-2.5 bg-stone-200 dark:bg-zinc-700/80 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Detail Card Skeleton */}
      <div className="lg:col-span-8 border-2 border-black dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900 p-6 md:p-8 space-y-6 shadow-[5px_5px_0px_0px_#000] relative overflow-hidden">
        <ShimmerOverlay />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/10 dark:border-zinc-800 pb-4">
          <div className="space-y-2">
            <div className="w-24 h-4 bg-amber-200 dark:bg-amber-900/60 rounded-sm" />
            <div className="w-64 h-6 bg-stone-900/80 dark:bg-zinc-700 rounded-sm" />
          </div>
          <div className="w-32 h-8 bg-emerald-200 dark:bg-emerald-900/60 rounded-xl" />
        </div>

        <div className="space-y-2.5">
          <div className="w-32 h-3.5 bg-stone-400 dark:bg-zinc-600 rounded-sm" />
          <div className="w-full h-3 bg-stone-200 dark:bg-zinc-750 rounded-sm" />
          <div className="w-11/12 h-3 bg-stone-200 dark:bg-zinc-750 rounded-sm" />
          <div className="w-4/5 h-3 bg-stone-200 dark:bg-zinc-750 rounded-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 dark:bg-zinc-800 border-2 border-black/20 rounded-xl space-y-2.5">
            <div className="w-28 h-3.5 bg-stone-400 dark:bg-zinc-600 rounded-sm" />
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="w-16 h-5 bg-stone-200 dark:bg-zinc-700 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-zinc-800 border-2 border-black/20 rounded-xl space-y-2.5">
            <div className="w-32 h-3.5 bg-stone-400 dark:bg-zinc-600 rounded-sm" />
            <div className="w-full h-2.5 bg-stone-200 dark:bg-zinc-700 rounded-sm" />
            <div className="w-5/6 h-2.5 bg-stone-200 dark:bg-zinc-750 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Scholarship Module List
 */
export function ScholarshipListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] relative overflow-hidden space-y-4"
        >
          <ShimmerOverlay />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-stone-250 dark:border-zinc-800 pb-3">
            <div className="space-y-1.5">
              <div className="w-28 h-3.5 bg-purple-100 dark:bg-purple-950/60 rounded-sm border border-purple-300 dark:border-purple-800" />
              <div className="w-56 md:w-80 h-5 bg-stone-900/80 dark:bg-zinc-700 rounded-sm" />
            </div>
            <div className="w-32 h-7 bg-emerald-100 dark:bg-emerald-950/60 rounded-sm border border-emerald-400 dark:border-emerald-800" />
          </div>

          <div className="space-y-2">
            <div className="w-full h-3 bg-stone-200 dark:bg-zinc-750 rounded-sm" />
            <div className="w-4/5 h-3 bg-stone-200 dark:bg-zinc-750 rounded-sm" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2">
              <div className="w-24 h-5 bg-stone-150 dark:bg-zinc-800 rounded-sm" />
              <div className="w-28 h-5 bg-stone-150 dark:bg-zinc-800 rounded-sm" />
              <div className="w-20 h-5 bg-stone-150 dark:bg-zinc-800 rounded-sm" />
            </div>
            <div className="w-28 h-8 bg-amber-300 dark:bg-amber-600/70 border-2 border-black rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
