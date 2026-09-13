import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scholarship, UserProfile } from '../../types';
import { evaluateScholarshipMatch } from '../../services/scholarshipService';
import { Bookmark, ExternalLink, ArrowRight, CheckCircle2, AlertCircle, Calendar, Building2, Award, Sparkles, DollarSign } from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  studentProfile: Partial<UserProfile> | null;
  isSaved: boolean;
  onViewDetails: (scholarship: Scholarship) => void;
  onToggleSave: (scholarship: Scholarship) => void;
  onAskAI: (scholarship: Scholarship) => void;
  isDarkMode?: boolean;
}

const formatExternalUrl = (url?: string) => {
  if (!url || !url.trim()) return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  studentProfile,
  isSaved,
  onViewDetails,
  onToggleSave,
  onAskAI,
  isDarkMode = false
}) => {
  const { t } = useTranslation();
  const matchResult = evaluateScholarshipMatch(studentProfile, scholarship);

  // Determine status color and text
  const isClosed = scholarship.status === 'Closed';
  
  // Check if deadline is approaching (within 15 days)
  let isClosingSoon = false;
  if (scholarship.applicationEndDate) {
    const deadline = new Date(scholarship.applicationEndDate).getTime();
    const now = new Date().getTime();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    if (daysLeft > 0 && daysLeft <= 15) {
      isClosingSoon = true;
    }
  }

  const getProviderTypeBadge = (type: string) => {
    switch (type) {
      case 'Government':
        return 'bg-emerald-100 text-emerald-900 border-emerald-400';
      case 'Private':
        return 'bg-purple-100 text-purple-900 border-purple-400';
      case 'NGO':
        return 'bg-amber-100 text-amber-900 border-amber-400';
      case 'University':
        return 'bg-blue-100 text-blue-900 border-blue-400';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-300';
    }
  };

  return (
    <div className={`border-2 border-black rounded-none p-5 md:p-6 transition-all relative flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${
      isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-stone-900'
    }`}>
      {/* Top Header: Provider Type & Status & Save Bookmark */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 border ${getProviderTypeBadge(scholarship.providerType)}`}>
              {scholarship.providerType}
            </span>

            {isClosed ? (
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-red-100 text-red-700 border border-red-300">
                {t('scholarships.closed', 'Closed')}
              </span>
            ) : isClosingSoon ? (
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-amber-200 text-amber-900 border border-amber-400 animate-pulse">
                ⏳ {t('scholarships.closingSoon', 'Closing Soon')}
              </span>
            ) : (
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300">
                {t('scholarships.open', 'Open')}
              </span>
            )}

            {/* Match Score Badge if Student Profile present */}
            {studentProfile && (
              <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 border flex items-center gap-1 ${
                matchResult.isEligible && matchResult.matchScore >= 80
                  ? 'bg-emerald-500 text-white border-black'
                  : matchResult.isEligible
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-stone-100 text-stone-600 border-stone-300'
              }`}>
                {matchResult.isEligible ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-white fill-emerald-600" />
                    {matchResult.matchScore}% {t('scholarships.matchScore', 'Match')}
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    {t('scholarships.notEligible', 'Not Fully Eligible')}
                  </>
                )}
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleSave(scholarship)}
            className={`p-2 border border-black transition-colors ${
              isSaved
                ? 'bg-amber-300 text-black hover:bg-amber-400'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
            }`}
            title={isSaved ? t('scholarships.unsave', 'Unsave') : t('scholarships.save', 'Save')}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black text-black' : ''}`} />
          </button>
        </div>

        {/* Scholarship Name */}
        <h3 className="text-lg md:text-xl font-display font-black uppercase tracking-tight leading-snug line-clamp-2 mb-2">
          {scholarship.scholarshipName}
        </h3>

        {/* Provider Name */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-600 mb-4">
          <Building2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span className="truncate">{scholarship.provider}</span>
        </div>

        {/* Highlight Amount Box */}
        <div className="bg-amber-100/80 border-2 border-black p-3 mb-4">
          <div className="text-[10px] font-mono font-bold uppercase text-amber-900 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-800" /> {t('scholarships.amount', 'Scholarship Amount')}
          </div>
          <div className="text-base font-display font-black text-stone-900 mt-0.5">
            {scholarship.scholarshipAmount}
          </div>
        </div>

        {/* Short Eligibility Summary */}
        <p className="text-xs text-stone-600 font-medium line-clamp-2 leading-relaxed mb-4">
          {scholarship.eligibility}
        </p>

        {/* Key Attributes Tags */}
        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono font-bold uppercase mb-4 text-stone-700">
          <span className="bg-stone-100 border border-stone-300 px-2 py-0.5">
            🎓 {scholarship.educationLevel}
          </span>
          <span className="bg-stone-100 border border-stone-300 px-2 py-0.5">
            📍 {scholarship.eligibleStates.join(', ')}
          </span>
          <span className="bg-stone-100 border border-stone-300 px-2 py-0.5">
            👤 {scholarship.category} ({scholarship.gender})
          </span>
          {scholarship.contributedBy && (
            <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 flex items-center gap-1 font-bold">
              🤝 Sourced: {scholarship.contributedBy}
            </span>
          )}
        </div>
      </div>

      {/* Footer / Action Buttons */}
      <div className="border-t-2 border-dashed border-stone-300 pt-4 mt-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {t('scholarships.deadline', 'Application Deadline')}:
          </span>
          <span className={isClosingSoon ? 'text-amber-800 font-black' : isClosed ? 'text-red-600 font-black' : 'text-stone-900 font-bold'}>
            {scholarship.applicationEndDate ? scholarship.applicationEndDate : 'Ongoing'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(scholarship)}
            className="w-full py-2 px-3 text-xs font-bold uppercase tracking-wider bg-white text-black border-2 border-black hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {t('scholarships.viewDetails', 'View Details')}
          </button>

          <a
            href={formatExternalUrl(scholarship.applicationLink || scholarship.officialWebsite)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 text-xs font-bold uppercase tracking-wider bg-amber-300 text-black border-2 border-black hover:bg-amber-400 transition-colors flex items-center justify-center gap-1 text-center cursor-pointer"
          >
            <span>{t('scholarships.applyNow', 'Apply Now ↗')}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        {/* Ask AI Helper button */}
        <button
          onClick={() => onAskAI(scholarship)}
          className="w-full mt-2 py-1.5 px-2 text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 border border-purple-300 hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          {t('scholarships.askAi', 'Ask AI Guidance')}
        </button>
      </div>
    </div>
  );
};
