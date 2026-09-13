import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Clock, 
  CornerDownRight 
} from 'lucide-react';
import { Bullet, BulletComment, UserProfile } from '../types';

interface BulletCommentsModalProps {
  bullet: Bullet;
  user?: UserProfile | null;
  onClose: () => void;
  onCommentAdded: (bulletId: string, count: number) => void;
  isDarkMode?: boolean;
}

export const BulletCommentsModal: React.FC<BulletCommentsModalProps> = ({
  bullet,
  user,
  onClose,
  onCommentAdded,
  isDarkMode = false
}) => {
  const [comments, setComments] = useState<BulletComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments from backend
  useEffect(() => {
    let isMounted = true;
    const loadComments = async () => {
      try {
        const res = await fetch(`/api/bullets/${bullet.bulletId}/comments`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.comments) {
            setComments(data.comments);
          }
        }
      } catch (err) {
        console.warn('Failed to load comments from server:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadComments();
    return () => { isMounted = false; };
  }, [bullet.bulletId]);

  // Handle post comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const text = newCommentText.trim();
    try {
      const res = await fetch(`/api/bullets/${bullet.bulletId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          userId: user?.id,
          userName: user?.name || 'Fellow Student',
          userRole: user?.role || 'student',
          userAvatar: user?.avatar
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.comment) {
          const updated = [data.comment, ...comments];
          setComments(updated);
          setNewCommentText('');
          onCommentAdded(bullet.bulletId, data.commentsCount || updated.length);
        }
      } else {
        // Fallback local optimistic comment
        const localComment: BulletComment = {
          id: `c_${Date.now()}`,
          bulletId: bullet.bulletId,
          userId: user?.id,
          userName: user?.name || 'Fellow Student',
          userRole: user?.role || 'student',
          text,
          createdAt: 'Just now'
        };
        const updated = [localComment, ...comments];
        setComments(updated);
        setNewCommentText('');
        onCommentAdded(bullet.bulletId, updated.length);
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-xl max-h-[88vh] flex flex-col rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden ${
          isDarkMode ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-900'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b-2 border-black bg-amber-300 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-black text-white rounded-lg">
              <MessageSquare className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-black">
                Student Discussion & Insights
              </h3>
              <p className="text-[11px] font-medium text-stone-800 line-clamp-1 max-w-md">
                {bullet.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border-2 border-black bg-white hover:bg-stone-100 rounded-lg text-black transition-colors shadow-[1px_1px_0px_0px_#000] cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* VERIFICATION BANNER */}
        <div className="px-5 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-[11px] font-medium flex items-center justify-between gap-2 shrink-0">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Notice verified via <strong>{bullet.sourceName}</strong>
          </span>
          <span className="font-mono text-stone-500 text-[10px]">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>

        {/* COMMENTS SCROLL LIST */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              Loading student discussion...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-black flex items-center justify-center mx-auto text-amber-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm text-stone-800">Be the first student to comment!</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Ask a question about eligibility, application deadlines, or share tips with peer students worldwide.
              </p>
            </div>
          ) : (
            comments.map(comment => (
              <div 
                key={comment.id} 
                className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/70 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {comment.userAvatar ? (
                      <img 
                        src={comment.userAvatar} 
                        alt={comment.userName} 
                        className="w-6 h-6 rounded-full object-cover border border-black" 
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-amber-200 border border-black flex items-center justify-center font-black text-[10px] text-black">
                        {comment.userName.charAt(0)}
                      </div>
                    )}
                    <span className="font-bold text-stone-900">{comment.userName}</span>
                    <span className="px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded text-[9px] font-mono capitalize">
                      {comment.userRole || 'student'}
                    </span>
                  </div>

                  <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {comment.createdAt}
                  </span>
                </div>

                <p className="text-stone-700 leading-relaxed pl-8 font-normal">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* COMMENT INPUT FORM */}
        <form 
          onSubmit={handleSubmitComment} 
          className="p-4 border-t-2 border-black bg-stone-50 shrink-0 space-y-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-300 border border-black flex items-center justify-center font-bold text-[10px] text-black shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <span className="text-xs font-bold text-stone-800">
              Commenting as {user?.name || 'Guest Student'}
            </span>
          </div>

          <div className="relative">
            <textarea
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              placeholder="Ask a question, share verification tips, or discuss eligibility..."
              rows={2}
              className="w-full p-3 pr-12 text-xs border-2 border-black rounded-lg focus:outline-none focus:bg-white bg-white resize-none shadow-[2px_2px_0px_0px_#000]"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim() || isSubmitting}
              className="absolute right-2.5 bottom-3.5 p-2 bg-black hover:bg-stone-800 disabled:opacity-40 text-amber-400 rounded-md transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Post comment"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
