import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { Bullet } from '../types';
import { getBulletFallbackImage } from '../data/bulletsData';

interface BulletArticleProps {
  bullet: Bullet;
  isSaved: boolean;
  isLiked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  onToggleSave: (bulletId: string, e?: React.MouseEvent) => void;
  onLike: (bulletId: string, e?: React.MouseEvent) => void;
  onOpenComments: (bullet: Bullet) => void;
  onSelectBullet: (bullet: Bullet) => void;
  onOpenOriginalLink: (bullet: Bullet, e?: React.MouseEvent) => void;
  onShare: (bullet: Bullet, e?: React.MouseEvent) => void;
  isDarkMode?: boolean;
}

export const BulletArticle: React.FC<BulletArticleProps> = ({
  bullet,
  isSaved,
  isLiked = false,
  likesCount = 0,
  commentsCount = 0,
  onToggleSave,
  onLike,
  onOpenComments,
  onSelectBullet,
  onOpenOriginalLink,
  onShare,
  isDarkMode = false
}) => {
  const [imgError, setImgError] = useState(false);

  // Category Theme Colors
  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Scholarships':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Entrance Exams':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Jobs':
      case 'Company Hiring':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Internships':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Government Schemes':
      case 'Government Notifications':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Fellowships':
      case 'Research Opportunities':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'International Education':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      default:
        return 'bg-stone-100 text-stone-900 border-stone-300';
    }
  };

  const articleImage = (!imgError && (bullet.imageUrl || bullet.thumbnailUrl)) 
    ? (bullet.imageUrl || bullet.thumbnailUrl)! 
    : getBulletFallbackImage(bullet.category);

  return (
    <article
      id={`bullet-article-${bullet.bulletId}`}
      className={`relative w-full py-6 md:py-8 px-4 md:px-8 border-b-2 border-stone-200 transition-colors ${
        isDarkMode ? 'bg-stone-900/60 hover:bg-stone-900 text-stone-100' : 'bg-white hover:bg-[#FAF9F6] text-stone-900'
      }`}
    >
      {/* MAIN HORIZONTAL CONTENT WRAPPER */}
      <div className="flex flex-col-reverse md:flex-row md:items-start justify-between gap-6 md:gap-8">
        
        {/* LEFT SIDE: EDITORIAL TEXT & METADATA (65-70% width) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Category Badge & Verification Status */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border ${getCategoryBadgeStyle(bullet.category)}`}
              >
                {bullet.category}
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300/80 rounded-md text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                Verified Official Notice
              </span>

              {bullet.deadline && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-md text-[10px] font-bold">
                  <Clock className="w-3 h-3 text-red-600 shrink-0" />
                  Deadline: {bullet.deadline}
                </span>
              )}
            </div>

            {/* Large Bold Headline */}
            <h2
              onClick={() => onSelectBullet(bullet)}
              className="text-lg sm:text-xl md:text-2xl font-display font-black leading-snug md:leading-tight text-black tracking-tight cursor-pointer hover:text-amber-800 transition-colors"
            >
              {bullet.title}
            </h2>

            {/* Short 2-4 Line Editorial Summary */}
            <p 
              onClick={() => onSelectBullet(bullet)}
              className="mt-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3 md:line-clamp-4 cursor-pointer"
            >
              {bullet.summary}
            </p>
          </div>

          {/* Metadata Row: Source Name • Published Date • Region */}
          <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-stone-500 font-medium">
            <span className="inline-flex items-center gap-1 font-bold text-stone-800">
              <Building className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              {bullet.sourceName}
            </span>

            <span className="text-stone-300">•</span>

            <span className="font-mono text-stone-500">
              {bullet.publishedAt}
            </span>

            <span className="text-stone-300">•</span>

            <span className="inline-flex items-center gap-1 text-stone-600">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              {bullet.region}
            </span>

            {bullet.educationLevel && bullet.educationLevel.length > 0 && (
              <>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <span className="text-stone-500 text-[11px] hidden sm:inline">
                  🎓 {bullet.educationLevel.slice(0, 2).join(', ')}{bullet.educationLevel.length > 2 ? ' +' : ''}
                </span>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: LARGE ARTICLE / NEWS IMAGE (30-35% width) */}
        <div 
          onClick={() => onSelectBullet(bullet)}
          className="w-full md:w-[32%] lg:w-[30%] shrink-0 cursor-pointer"
        >
          <div className="relative aspect-[16/10] md:aspect-[4/3] w-full rounded-lg overflow-hidden border-2 border-black/15 bg-stone-100 shadow-xs group">
            <img
              src={articleImage}
              alt={bullet.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />

            {/* Subtle category overlay pill in corner of image */}
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono font-bold uppercase rounded tracking-wider flex items-center gap-1 shadow-xs">
              <span>{bullet.category}</span>
            </div>

            {bullet.isImportant && (
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-400 border border-black text-black text-[9px] font-black uppercase rounded shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-black" />
                Featured Notice
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM SEPARATOR LINE & SOCIAL / NEWS INTERACTION BAR */}
      <div className="mt-5 pt-3.5 border-t border-stone-200/90 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Like • Comment • Original Link Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Like Button */}
          <button
            type="button"
            onClick={(e) => onLike(bullet.bulletId, e)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isLiked 
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                : 'text-stone-600 hover:text-rose-600 hover:bg-stone-100'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart 
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
              }`} 
            />
            <span>{likesCount > 0 ? likesCount : 'Like'}</span>
          </button>

          {/* Comment Button */}
          <button
            type="button"
            onClick={() => onOpenComments(bullet)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer"
            title="View or add comments"
          >
            <MessageSquare className="w-4 h-4 text-stone-500" />
            <span>{commentsCount > 0 ? `${commentsCount} ${commentsCount === 1 ? 'Comment' : 'Comments'}` : 'Comment'}</span>
          </button>

          {/* Original Link (Opens Official Verified Portal) */}
          <button
            type="button"
            onClick={(e) => onOpenOriginalLink(bullet, e)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:text-black hover:bg-stone-100 transition-all cursor-pointer"
            title={`Visit verified portal: ${bullet.sourceName}`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            <span>Original Link</span>
            <span className="text-[10px] text-stone-400 font-normal hidden sm:inline">
              ({bullet.officialPortalName || 'Official Portal'})
            </span>
          </button>
        </div>

        {/* Right: Save / Bookmark & Share */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => onToggleSave(bullet.bulletId, e)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isSaved
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title={isSaved ? 'Saved in bookmarks' : 'Save Bullet'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-700' : 'text-stone-500'}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => onShare(bullet, e)}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Share Bullet"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </article>
  );
};
