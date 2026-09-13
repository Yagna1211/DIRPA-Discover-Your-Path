import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scholarship, UserProfile } from '../../types';
import { evaluateScholarshipMatch } from '../../services/scholarshipService';
import { X, ExternalLink, Calendar, CheckCircle2, AlertCircle, FileText, Award, Building2, ShieldCheck, Sparkles, User, RefreshCw, Bookmark } from 'lucide-react';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  studentProfile: Partial<UserProfile> | null;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (scholarship: Scholarship) => void;
  onAskAI: (scholarship: Scholarship) => void;
}

const formatExternalUrl = (url?: string) => {
  if (!url || !url.trim()) return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  studentProfile,
  isSaved,
  onClose,
  onToggleSave,
  onAskAI
}) => {
  const { t } = useTranslation();
  if (!scholarship) return null;

  const matchResult = evaluateScholarshipMatch(studentProfile, scholarship);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-4 border-black text-stone-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 relative my-auto text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 border-2 border-black transition-colors cursor-pointer"
          title={t('common.close', 'Close')}
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Top Header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 border border-emerald-400 bg-emerald-100 text-emerald-900">
            {scholarship.providerType}
          </span>
          <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 border ${
            scholarship.status === 'Open' ? 'bg-emerald-500 text-white border-black' : 'bg-red-100 text-red-800 border-red-300'
          }`}>
            {scholarship.status === 'Open' ? t('scholarships.open', 'Open') : t('scholarships.closed', 'Closed')}
          </span>
          {scholarship.renewalAvailable && (
            <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> {t('scholarships.renewalCriteria', 'Renewal Terms & Conditions')}
            </span>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-stone-900 leading-tight mb-2 pr-10">
          {scholarship.scholarshipName}
        </h2>

        <div className="flex items-center gap-2 text-sm font-bold text-stone-600 mb-6 border-b-2 border-dashed border-stone-200 pb-4">
          <Building2 className="w-4 h-4 text-stone-500 shrink-0" />
          <span>{scholarship.provider}</span>
        </div>

        {/* Match Breakdown Card (If Profile exists) */}
        {studentProfile && (
          <div className={`p-4 border-2 border-black mb-6 ${
            matchResult.isEligible ? 'bg-emerald-50' : 'bg-amber-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
                {matchResult.isEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                )}
                {t('scholarships.matchScore', 'Match Score')}: {matchResult.matchScore}%
              </span>
              <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 border ${
                matchResult.isEligible ? 'bg-emerald-200 text-emerald-900 border-emerald-400' : 'bg-amber-200 text-amber-900 border-amber-400'
              }`}>
                {matchResult.isEligible ? t('scholarships.eligible', 'Eligible') : t('scholarships.notEligible', 'Not Fully Eligible')}
              </span>
            </div>

            {matchResult.matchReasons.length > 0 && (
              <ul className="text-xs text-emerald-900 space-y-1 mb-2 font-medium">
                {matchResult.matchReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span> {reason}
                  </li>
                ))}
              </ul>
            )}

            {matchResult.unmetReasons.length > 0 && (
              <ul className="text-xs text-amber-900 space-y-1 font-medium border-t border-amber-200 pt-2 mt-2">
                {matchResult.unmetReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">⚠️</span> {reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Award Amount Banner */}
        <div className="bg-amber-100 border-2 border-black p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
              {t('scholarships.amount', 'Scholarship Amount')}
            </span>
            <div className="text-xl md:text-2xl font-display font-black text-stone-900">
              {scholarship.scholarshipAmount}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onToggleSave(scholarship)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black transition-colors flex items-center gap-1.5 cursor-pointer ${
                isSaved ? 'bg-amber-300 text-black' : 'bg-white hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
              <span>{isSaved ? t('scholarships.unsave', 'Unsave') : t('scholarships.save', 'Save')}</span>
            </button>

            <a
              href={formatExternalUrl(scholarship.applicationLink || scholarship.officialWebsite)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('scholarships.applyNow', 'Apply Now ↗')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-stone-500 mb-1">
                {t('scholarships.filterLevel', 'Education Level')} & {t('scholarships.category', 'Social Category')}
              </h4>
              <p className="text-sm font-bold text-stone-900">
                {scholarship.educationLevel} | {scholarship.category} ({scholarship.gender})
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-stone-500 mb-1">
                {t('scholarships.maxIncome', 'Max Annual Income')} & {t('scholarships.minMarks', 'Min Percentage Marks')}
              </h4>
              <p className="text-sm font-bold text-stone-900">
                {scholarship.maximumFamilyIncome ? `≤ ₹${scholarship.maximumFamilyIncome.toLocaleString('en-IN')}` : 'No Strict Cap'} | {scholarship.minimumPercentage ? `≥ ${scholarship.minimumPercentage}%` : 'Passing Grade'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-stone-500 mb-1">
                {t('scholarships.filterState', 'State / Jurisdiction')}
              </h4>
              <p className="text-sm font-bold text-stone-900">
                {scholarship.eligibleStates.join(', ')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-stone-500 mb-1">
                {t('scholarships.deadline', 'Application Deadline')}
              </h4>
              <p className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-stone-600" />
                {scholarship.applicationEndDate || 'Ongoing / Round-the-year'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-stone-500 mb-1">
                {t('scholarships.requiredDocuments', 'Required Documents Checklist')}
              </h4>
              <ul className="text-xs text-stone-700 space-y-1 font-medium list-disc list-inside">
                {scholarship.documentsRequired.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Community Contributor Note if present */}
        {(scholarship.contributedBy || scholarship.contributorNote) && (
          <div className="bg-purple-50 border-2 border-black p-4 mb-6 text-purple-950">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 bg-purple-200 text-purple-900 border border-purple-400">
                🤝 Community Beneficiary Contribution
              </span>
              {scholarship.contributedBy && (
                <span className="text-xs font-bold font-mono">By: {scholarship.contributedBy}</span>
              )}
            </div>
            {scholarship.contributorNote && (
              <p className="text-xs font-medium italic mt-1 leading-relaxed bg-white/70 p-2.5 border border-purple-200">
                "{scholarship.contributorNote}"
              </p>
            )}
          </div>
        )}

        {/* Ask AI Banner inside detail modal */}
        <div className="bg-purple-50 border-2 border-black p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-700 shrink-0" />
            <div>
              <h4 className="text-xs font-display font-black uppercase text-purple-950">
                {t('scholarships.aiAssistantTitle', 'DIRPA Scholarship AI Advisor')}
              </h4>
              <p className="text-[11px] text-purple-800 font-medium">
                {t('scholarships.aiAssistantSubtitle', 'Ask questions about eligibility, document checklists, renewal terms, or portal registration.')}
              </p>
            </div>
          </div>

          <button
            onClick={() => { onClose(); onAskAI(scholarship); }}
            className="px-4 py-2 bg-purple-900 text-white border-2 border-black hover:bg-purple-950 font-bold uppercase text-xs tracking-wider shrink-0 cursor-pointer"
          >
            {t('scholarships.askAi', 'Ask AI Guidance')}
          </button>
        </div>
      </div>
    </div>
  );
};
