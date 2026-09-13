import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, ExternalLink, Trash2, CheckCircle, Clock, Award, Sparkles, User as UserIcon } from 'lucide-react';
import { StuffResource, UserProfile } from '../../types';
import { getCommunityRatingBadge } from '../../utils/stuffRanking';
import { castVote } from '../../services/stuffService';

interface ResourceCardProps {
  resource: StuffResource;
  user: UserProfile | null;
  userVote?: 'helpful' | 'not_helpful' | null;
  onVoteUpdated?: (resourceId: string, helpful: number, notHelpful: number, score: number, userVote: 'helpful' | 'not_helpful' | null) => void;
  onDeleteResource?: (resourceId: string) => void;
  onRequireAuth?: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
  'Videos': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', emoji: '🎥' },
  'Web Resources': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', emoji: '🌐' },
  'Practice': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', emoji: '💻' },
  'Documentation': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', emoji: '📚' },
  'Courses': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', emoji: '🎓' }
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  user,
  userVote: initialUserVote = null,
  onVoteUpdated,
  onDeleteResource,
  onRequireAuth
}) => {
  const [currentVote, setCurrentVote] = useState<'helpful' | 'not_helpful' | null>(initialUserVote || null);
  const [helpfulCount, setHelpfulCount] = useState<number>(resource.helpfulCount || 0);
  const [notHelpfulCount, setNotHelpfulCount] = useState<number>(resource.notHelpfulCount || 0);
  const [rankingScore, setRankingScore] = useState<number>(resource.rankingScore || 0);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  // Is current logged in user the submitter?
  const isOwner = user && user.id === resource.submittedBy;

  const totalVotes = helpfulCount + notHelpfulCount;
  const helpfulPercentage = totalVotes > 0 ? Math.round((helpfulCount / totalVotes) * 100) : null;
  const ratingBadge = getCommunityRatingBadge(rankingScore, totalVotes);
  const categoryStyle = CATEGORY_COLORS[resource.resourceType] || CATEGORY_COLORS['Web Resources'];

  const formattedDate = resource.createdAt
    ? new Date(resource.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  const handleVote = async (voteType: 'helpful' | 'not_helpful') => {
    setVoteError(null);

    if (!user) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (isOwner) {
      setVoteError("Submitters cannot vote on their own resources.");
      return;
    }

    setIsVoting(true);
    try {
      const response = await castVote(resource.resourceId, user.id, voteType);
      if (response.success) {
        setCurrentVote(response.userVote);
        setHelpfulCount(response.helpfulCount);
        setNotHelpfulCount(response.notHelpfulCount);
        setRankingScore(response.rankingScore);

        if (onVoteUpdated) {
          onVoteUpdated(
            resource.resourceId,
            response.helpfulCount,
            response.notHelpfulCount,
            response.rankingScore,
            response.userVote
          );
        }
      } else {
        setVoteError(response.error || 'Failed to submit vote');
      }
    } catch (err: any) {
      setVoteError(err.message || 'Voting error');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div
      className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between relative group"
      id={`resource-card-${resource.resourceId}`}
    >
      <div>
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-stone-200">
          <div className="flex items-center gap-2">
            {/* Category Tag */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${categoryStyle.border} ${categoryStyle.bg} ${categoryStyle.text} rounded`}
            >
              <span>{categoryStyle.emoji}</span>
              <span>{resource.resourceType}</span>
            </span>

            {/* Platform Badge */}
            <span className="text-[11px] font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 border border-stone-300 rounded">
              {resource.platform}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Community Rating Score Badge */}
            {totalVotes > 0 && (
              <span
                className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 border rounded ${ratingBadge.badgeClass}`}
                title={`Community ranking score: ${rankingScore}/100 based on ${totalVotes} student evaluations`}
              >
                {ratingBadge.label}
              </span>
            )}

            {/* Submitter delete option */}
            {isOwner && onDeleteResource && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to remove your submitted resource?')) {
                    onDeleteResource(resource.resourceId);
                  }
                }}
                className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                title="Delete your submitted resource"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-display font-black text-stone-900 leading-snug tracking-tight mb-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-700 font-medium leading-relaxed mb-3">
          {resource.description}
        </p>

        {/* Why recommended student quote (if provided) */}
        {resource.recommendationReason && (
          <div className="mb-4 p-2.5 bg-amber-50/70 border-l-3 border-amber-400 text-xs text-stone-800 italic">
            <span className="font-bold not-italic text-amber-900 mr-1">💬 Recommendation note:</span>
            "{resource.recommendationReason}"
          </div>
        )}
      </div>

      {/* Footer Section: Community Voting & Open Action */}
      <div className="pt-3 border-t-2 border-dashed border-stone-200 mt-2 space-y-3">
        {/* Submitter & Date */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <UserIcon className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate">
              Added by <strong>{resource.submittedByName || 'Student'}</strong>
              {isOwner && <span className="ml-1 text-amber-700 font-bold">(You)</span>}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-stone-400">
            <Clock className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Voting & Community Counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-2.5 border border-stone-200 rounded">
          {/* Vote Controls */}
          <div className="flex items-center gap-2">
            {/* Helpful Vote Button */}
            <button
              type="button"
              onClick={() => handleVote('helpful')}
              disabled={isVoting || isOwner}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-mono transition-all border rounded cursor-pointer ${
                currentVote === 'helpful'
                  ? 'bg-emerald-200 text-emerald-950 border-emerald-500 shadow-[1px_1px_0px_0px_#059669]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-emerald-50 hover:border-emerald-300'
              } ${isOwner ? 'opacity-75 cursor-not-allowed' : ''}`}
              title={isOwner ? 'Submitters cannot vote on their own submissions' : 'Mark as Helpful'}
              id={`vote-helpful-${resource.resourceId}`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${currentVote === 'helpful' ? 'fill-emerald-800 text-emerald-900' : 'text-stone-500'}`} />
              <span>{helpfulCount.toLocaleString()}</span>
              <span className="text-[10px] hidden sm:inline">Helpful</span>
            </button>

            {/* Not Helpful Vote Button */}
            <button
              type="button"
              onClick={() => handleVote('not_helpful')}
              disabled={isVoting || isOwner}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-mono transition-all border rounded cursor-pointer ${
                currentVote === 'not_helpful'
                  ? 'bg-red-200 text-red-950 border-red-500 shadow-[1px_1px_0px_0px_#dc2626]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-red-50 hover:border-red-300'
              } ${isOwner ? 'opacity-75 cursor-not-allowed' : ''}`}
              title={isOwner ? 'Submitters cannot vote on their own submissions' : 'Mark as Not Helpful'}
              id={`vote-nothelpful-${resource.resourceId}`}
            >
              <ThumbsDown className={`w-3.5 h-3.5 ${currentVote === 'not_helpful' ? 'fill-red-800 text-red-900' : 'text-stone-500'}`} />
              <span>{notHelpfulCount.toLocaleString()}</span>
              <span className="text-[10px] hidden sm:inline">Not Helpful</span>
            </button>
          </div>

          {/* Ratio & Community Feedback Summary */}
          <div className="text-[11px] font-mono text-stone-600 text-right">
            {totalVotes > 0 ? (
              <span>
                <strong className="text-stone-900">{helpfulPercentage}%</strong> students found helpful ({totalVotes} votes)
              </span>
            ) : (
              <span className="text-stone-400 italic">No votes yet • Be the first!</span>
            )}
          </div>
        </div>

        {/* Error prompt if any */}
        {voteError && (
          <p className="text-[11px] font-bold text-red-600 font-mono bg-red-50 p-1.5 border border-red-200">
            ⚠ {voteError}
          </p>
        )}

        {/* OPEN RESOURCE Button */}
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center no-underline"
          id={`open-resource-${resource.resourceId}`}
        >
          <span>OPEN RESOURCE</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
