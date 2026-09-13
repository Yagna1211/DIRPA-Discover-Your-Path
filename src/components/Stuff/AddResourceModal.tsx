import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Sparkles, AlertCircle, CheckCircle, ExternalLink, BookOpen } from 'lucide-react';
import { StuffCategory, StuffResource, UserProfile } from '../../types';
import { detectPlatformAndType, normalizeResourceUrl } from '../../utils/stuffRanking';
import { createResource } from '../../services/stuffService';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  initialSubject?: string;
  onResourceAdded: (newResource: StuffResource) => void;
  onViewExistingResource?: (resource: StuffResource) => void;
}

const CATEGORIES: { type: StuffCategory; label: string; icon: string; desc: string }[] = [
  { type: 'Videos', label: '🎥 Videos', icon: '🎥', desc: 'YouTube videos, playlists, recorded lectures' },
  { type: 'Web Resources', label: '🌐 Web Resources', icon: '🌐', desc: 'GeeksforGeeks, tutorials, articles, blogs' },
  { type: 'Practice', label: '💻 Practice', icon: '💻', desc: 'LeetCode, HackerRank, coding platforms, quizzes' },
  { type: 'Documentation', label: '📚 Documentation', icon: '📚', desc: 'Official technical documentation, API guides' },
  { type: 'Courses', label: '🎓 Courses', icon: '🎓', desc: 'Online courses, NPTEL, Coursera, edX' },
];

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  user,
  initialSubject = '',
  onResourceAdded,
  onViewExistingResource
}) => {
  const [subjectName, setSubjectName] = useState(initialSubject || '');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [resourceType, setResourceType] = useState<StuffCategory>('Videos');
  const [description, setDescription] = useState('');
  const [recommendationReason, setRecommendationReason] = useState('');

  const [detectedPlatform, setDetectedPlatform] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateResource, setDuplicateResource] = useState<StuffResource | null>(null);

  // Sync initialSubject when opened
  useEffect(() => {
    if (initialSubject) {
      setSubjectName(initialSubject);
    }
  }, [initialSubject]);

  // Auto-detect platform and resource category as the user types URL
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setErrorMessage(null);
    setDuplicateResource(null);

    if (newUrl.trim().length > 6) {
      const detected = detectPlatformAndType(newUrl.trim());
      setDetectedPlatform(detected.platform);
      // Auto-set category if user hasn't heavily customized
      if (detected.resourceType) {
        setResourceType(detected.resourceType);
      }
    } else {
      setDetectedPlatform('');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDuplicateResource(null);

    if (!user) {
      setErrorMessage('Please sign in with your student account to add learning resources.');
      return;
    }

    const trimmedSubject = subjectName.trim();
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    const trimmedDesc = description.trim();

    if (!trimmedSubject) {
      setErrorMessage('Please enter a subject or topic name (e.g. Java OOP, Data Structures).');
      return;
    }
    if (!trimmedTitle) {
      setErrorMessage('Please enter a resource title.');
      return;
    }
    if (!trimmedUrl) {
      setErrorMessage('Please enter the resource link/URL.');
      return;
    }
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      setErrorMessage('Please enter a valid URL starting with http:// or https://');
      return;
    }
    if (!trimmedDesc) {
      setErrorMessage('Please write a short description of what this resource covers.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createResource({
        subjectName: trimmedSubject,
        title: trimmedTitle,
        url: trimmedUrl,
        resourceType,
        description: trimmedDesc,
        recommendationReason: recommendationReason.trim(),
        userId: user.id,
        userName: user.name || 'DIRPA Student',
        userAvatar: user.avatar || ''
      });

      if (response.isDuplicate && response.existingResource) {
        setDuplicateResource(response.existingResource);
        setErrorMessage(response.message || 'This resource has already been added.');
        setIsSubmitting(false);
        return;
      }

      if (!response.success || !response.resource) {
        setErrorMessage(response.error || 'Failed to submit resource. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Successful addition
      onResourceAdded(response.resource);
      // Reset form
      setTitle('');
      setUrl('');
      setDescription('');
      setRecommendationReason('');
      setDetectedPlatform('');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error submitting resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-amber-300">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-black text-amber-300 font-display font-black text-xs uppercase tracking-widest border border-black">
              STUFF
            </span>
            <h2 className="text-xl font-display font-black uppercase text-stone-900 tracking-tight">
              + Add Learning Resource
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-black bg-white hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            title="Close"
            id="close-add-resource-modal"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Submitter Info Notice */}
          <div className="bg-stone-50 border border-stone-300 p-3 flex items-center justify-between text-xs text-stone-600">
            <span className="font-mono">
              Contributing as: <strong>{user?.name || 'Student (Guest)'}</strong>
            </span>
            <span className="text-[11px] text-stone-500 font-mono">
              Permanent Firestore Record
            </span>
          </div>

          {/* Duplicate Resource Alert */}
          {duplicateResource && (
            <div className="p-4 bg-amber-50 border-2 border-amber-500 text-stone-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>This resource has already been added to DIRPA!</span>
              </div>
              <p className="text-xs text-stone-700">
                Title: <strong>{duplicateResource.title}</strong> ({duplicateResource.platform})
              </p>
              <div className="pt-2 flex items-center gap-3">
                {onViewExistingResource && (
                  <button
                    type="button"
                    onClick={() => {
                      onViewExistingResource(duplicateResource);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-bold uppercase bg-amber-400 border border-black hover:bg-amber-500 transition-colors shadow-[1px_1px_0px_0px_#000]"
                  >
                    View Existing Resource ➔
                  </button>
                )}
                <a
                  href={duplicateResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  Open URL directly <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {errorMessage && !duplicateResource && (
            <div className="p-3 bg-red-50 border-2 border-red-500 text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Subject / Topic Field */}
          <div>
            <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1.5">
              Subject / Topic <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Java OOP, Data Structures, DBMS, React, Machine Learning"
              className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              id="stuff-subject-input"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Specify the subject or technology this resource is meant for.
            </p>
          </div>

          {/* Resource Title Field */}
          <div>
            <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1.5">
              Resource Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Java OOP Complete Tutorial & Practice Questions"
              className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              id="stuff-title-input"
            />
          </div>

          {/* Resource URL Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-black uppercase text-stone-800">
                Resource URL <span className="text-red-600">*</span>
              </label>
              {detectedPlatform && (
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300 rounded">
                  Platform: {detectedPlatform}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://geeksforgeeks.org/..."
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border-2 border-black text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                id="stuff-url-input"
              />
              <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Tracking parameters will be automatically normalized to prevent duplicates.
            </p>
          </div>

          {/* Resource Type Categories */}
          <div>
            <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1.5">
              Resource Type <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.type}
                  onClick={() => setResourceType(cat.type)}
                  className={`p-2.5 border-2 text-left transition-all cursor-pointer ${
                    resourceType === cat.type
                      ? 'border-black bg-amber-200 text-stone-900 shadow-[2px_2px_0px_0px_#000] font-bold'
                      : 'border-stone-300 bg-stone-50 text-stone-700 hover:border-black'
                  }`}
                  id={`select-category-${cat.type}`}
                >
                  <div className="text-xs font-bold">{cat.label}</div>
                  <div className="text-[10px] text-stone-500 truncate mt-0.5">{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1.5">
              Short Description <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Complete beginner-friendly explanation of OOP concepts with code walkthroughs and diagrams."
              className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              id="stuff-desc-input"
            />
          </div>

          {/* Why do you recommend this resource? (Optional) */}
          <div>
            <label className="block text-xs font-mono font-black uppercase text-stone-800 mb-1.5">
              Why do you recommend this resource? <span className="text-stone-400 font-normal">(Optional student note)</span>
            </label>
            <input
              type="text"
              value={recommendationReason}
              onChange={(e) => setRecommendationReason(e.target.value)}
              placeholder="e.g. Cleared my doubts on inheritance in just 30 minutes before exams!"
              className="w-full px-3.5 py-2 bg-white border-2 border-black text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              id="stuff-reason-input"
            />
          </div>

          {/* Submission Notice */}
          <div className="text-[11px] text-stone-500 leading-relaxed font-mono bg-stone-50 p-2.5 border border-stone-200">
            📌 <strong>DIRPA Community Guidelines:</strong> Votes and rankings are evaluated strictly by other students. You cannot vote on your own submission. Resources are publicly listed once verified.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black border-2 border-transparent hover:border-black transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-display font-black uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              id="submit-resource-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Submitting to Firestore...</span>
                </>
              ) : (
                <span>Publish Resource ➔</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
